import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { collection, addDoc, getDocs, query, where, updateDoc, increment } from 'firebase/firestore';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerData, cartProducts, couponCode } = body;

    if (!customerData || !cartProducts || !Array.isArray(cartProducts) || cartProducts.length === 0) {
      return NextResponse.json({ error: 'Invalid order request payload' }, { status: 400 });
    }

    // 1. Fetch settings from Firestore
    const settingsRef = collection(db, 'settings');
    const settingsSnapshot = await getDocs(settingsRef);
    if (settingsSnapshot.empty) {
      return NextResponse.json({ error: 'Store configuration not found' }, { status: 500 });
    }
    const settings = {
      ...settingsSnapshot.docs[0].data(),
      id: settingsSnapshot.docs[0].id
    };

    const discountPercent = settings.discount || 0;
    const courierCharge = settings.courierCharge || 0;
    const minimumAmount = settings.minimumAmount || 0;

    // 2. Fetch products in the cart from Firestore to verify prices
    const productIds = cartProducts.map(p => p.id);
    const productsRef = collection(db, 'products');
    
    const productsSnapshot = await getDocs(productsRef);
    const allDbProducts = productsSnapshot.docs.map(doc => ({
      ...doc.data(),
      docId: doc.id
    }));

    const dbProductsMap = new Map();
    allDbProducts.forEach(prod => {
      dbProductsMap.set(prod.id, prod);
    });

    // 3. Recalculate and verify totals
    let recalculatedSubTotal = 0;
    let recalculatedTotalQuantity = 0;
    const verifiedProducts = [];
    const dbProductMapForCart = []; // Cache to match product category exclusions later

    for (const item of cartProducts) {
      const dbProduct = dbProductsMap.get(item.id);
      if (!dbProduct) {
        return NextResponse.json({ error: `Product with ID ${item.id} not found in store catalog.` }, { status: 400 });
      }

      const count = Math.max(0, Math.min(250, Number(item.count)));
      if (count <= 0) continue;

      const originalPrice = dbProduct.price || 0;
      const discountedPrice = Math.round(originalPrice - (originalPrice * discountPercent) / 100);
      const totalItemAmount = count * discountedPrice;

      recalculatedSubTotal += totalItemAmount;
      recalculatedTotalQuantity += count;

      verifiedProducts.push({
        name: dbProduct.name,
        type: dbProduct.quantityType,
        qty: count,
        price: discountedPrice,
        total: totalItemAmount
      });

      dbProductMapForCart.push({
        verifiedItem: verifiedProducts[verifiedProducts.length - 1],
        category: dbProduct.category
      });
    }

    if (verifiedProducts.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // 4. Validate Minimum Order Limit
    if (recalculatedSubTotal < minimumAmount) {
      return NextResponse.json({
        error: `Order subtotal ₹${recalculatedSubTotal} does not meet the minimum amount of ₹${minimumAmount}.`
      }, { status: 400 });
    }

    // 5. Securely Validate Coupon Code
    let coupon = null;
    let couponDiscount = 0;
    let packingDiscount = false;

    if (couponCode) {
      const couponsRef = collection(db, 'coupons');
      const q = query(
        couponsRef, 
        where('code', '==', couponCode.trim().toUpperCase()), 
        where('isActive', '==', true)
      );
      const couponSnapshot = await getDocs(q);

      if (couponSnapshot.empty) {
        return NextResponse.json({ error: 'Applied coupon is invalid or has been deactivated.' }, { status: 400 });
      }

      coupon = {
        id: couponSnapshot.docs[0].id,
        ref: couponSnapshot.docs[0].ref,
        ...couponSnapshot.docs[0].data()
      };

      // Check dates
      const now = Date.now();
      if (now < coupon.startDate || now > coupon.endDate) {
        return NextResponse.json({ error: 'Coupon code has expired or is not yet active.' }, { status: 400 });
      }

      // Check overall usage cap
      if (coupon.claimedCount >= coupon.maxClaims) {
        return NextResponse.json({ error: 'Coupon usage limit has been reached.' }, { status: 400 });
      }

      // Check minimum order value requirement
      if (recalculatedSubTotal < coupon.minOrderValue) {
        return NextResponse.json({ 
          error: `Minimum order value of ₹${coupon.minOrderValue} is required to use this coupon.` 
        }, { status: 400 });
      }

      // Process discount calculations
      if (coupon.type === 'free_packing') {
        packingDiscount = true;
        couponDiscount = courierCharge;
      } else {
        // Calculate discountable subtotal excluding banned categories
        let discountableSubtotal = 0;
        dbProductMapForCart.forEach(item => {
          const isExcluded = coupon.excludedCategories?.includes(item.category);
          if (!isExcluded) {
            discountableSubtotal += item.verifiedItem.total;
          }
        });

        if (coupon.type === 'percentage') {
          couponDiscount = Math.round((discountableSubtotal * coupon.value) / 100);
        } else if (coupon.type === 'flat') {
          couponDiscount = Math.min(coupon.value, discountableSubtotal);
        }
      }
    }

    const finalCourierCharge = packingDiscount ? 0 : courierCharge;
    const totalAmount = recalculatedSubTotal + finalCourierCharge - (packingDiscount ? 0 : couponDiscount);

    // 6. Generate Order ID (YYYY-MMDD-HHMMSS format based on server time)
    const now = new Date();
    const year = now.getFullYear();
    const monthDay = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') +
                 String(now.getMinutes()).padStart(2, '0') +
                 String(now.getSeconds()).padStart(2, '0');
    const orderID = `${year}-${monthDay}-${time}`;

    // 7. Save order to Firestore
    const ordersRef = collection(db, 'orders');
    const orderDoc = {
      customerData: {
        fullName: customerData.fullName,
        email: customerData.email,
        phone: customerData.phone,
        whatsapp: customerData.whatsapp,
        address: customerData.address,
        state: customerData.state,
        city: customerData.city,
        pincode: customerData.pincode
      },
      cart: {
        products: verifiedProducts,
        subTotal: recalculatedSubTotal,
        totalQuantity: recalculatedTotalQuantity,
        couponCode: coupon ? coupon.code : null,
        couponDiscount: packingDiscount ? 0 : couponDiscount,
        packingDiscount,
        totalAmount
      },
      orderID,
      orderedAt: Date.now(),
      orderStatus: 'Waiting for Payment',
      paymentStatus: 'Not Paid',
      status: 1
    };

    const docRef = await addDoc(ordersRef, orderDoc);

    // 8. Atomically increment the coupon claim count if successfully logged
    if (coupon) {
      await updateDoc(coupon.ref, {
        claimedCount: increment(1)
      });
    }

    return NextResponse.json({
      success: true,
      orderID,
      docId: docRef.id
    });

  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Server error processing order placement' }, { status: 500 });
  }
}
