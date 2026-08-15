"use client";
import React, { useMemo, useState } from 'react'
import { useCartStore } from '../store/cartStore';
import { useUserStore } from '../store/userStore';
import { App } from 'antd';
import { useRouter } from 'next/navigation';
import { db } from '../../db';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function BookingSummary({ showButton }) {
    const navigate = useRouter()
    const { message } = App.useApp();
    const { products, appliedCoupon, setAppliedCoupon } = useCartStore()
    const { settings } = useUserStore()
    
    const [couponInput, setCouponInput] = useState('');
    const [loading, setLoading] = useState(false);

    const total = useMemo(() => {
        var counts = 0, amount = 0;
        products?.forEach((prod) => {
            counts = counts + prod?.count
            amount = amount + prod?.total
        })
        return { counts, amount }
    }, [products])

    // Calculate coupon discounts dynamically on the client for display
    const discountDetails = useMemo(() => {
        if (!appliedCoupon) return { discount: 0, packingDiscount: false };

        // 1. Check minimum order value
        if (total.amount < appliedCoupon.minOrderValue) {
            return { discount: 0, packingDiscount: false, error: `Minimum order value of ₹${appliedCoupon.minOrderValue} required.` };
        }

        // 2. Free packing discount
        if (appliedCoupon.type === 'free_packing') {
            return { discount: settings?.courierCharge || 0, packingDiscount: true };
        }

        // 3. Excluded categories calculations
        let discountableSubtotal = 0;
        products?.forEach((prod) => {
            const isExcluded = appliedCoupon.excludedCategories?.includes(prod.category);
            if (!isExcluded) {
                discountableSubtotal += prod.total;
            }
        });

        if (appliedCoupon.type === 'percentage') {
            const discountVal = Math.round((discountableSubtotal * appliedCoupon.value) / 100);
            return { discount: discountVal, packingDiscount: false };
        } else if (appliedCoupon.type === 'flat') {
            const discountVal = Math.min(appliedCoupon.value, discountableSubtotal);
            return { discount: discountVal, packingDiscount: false };
        }

        return { discount: 0, packingDiscount: false };
    }, [appliedCoupon, total.amount, products, settings?.courierCharge])

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;
        setLoading(true);
        try {
            const couponsRef = collection(db, 'coupons');
            const q = query(
                couponsRef, 
                where('code', '==', couponInput.trim().toUpperCase()), 
                where('isActive', '==', true)
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                message.error("Invalid or inactive coupon code.");
                setLoading(false);
                return;
            }

            const couponData = {
                id: snapshot.docs[0].id,
                ...snapshot.docs[0].data()
            };

            const now = Date.now();
            if (now < couponData.startDate || now > couponData.endDate) {
                message.error("This coupon has expired or is not yet active.");
                setLoading(false);
                return;
            }

            if (couponData.claimedCount >= couponData.maxClaims) {
                message.error("This coupon usage limit has been reached.");
                setLoading(false);
                return;
            }

            if (total.amount < couponData.minOrderValue) {
                message.error(`Minimum order value of ₹${couponData.minOrderValue} required for this coupon.`);
                setLoading(false);
                return;
            }

            setAppliedCoupon(couponData);
            message.success(`Coupon ${couponData.code} applied!`);
            setCouponInput('');
        } catch (error) {
            console.error("Error applying coupon:", error);
            message.error("Failed to apply coupon.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        message.info("Coupon removed.");
    };

    const displayPackingCharge = discountDetails.packingDiscount ? 0 : (settings?.courierCharge || 0);
    const amountPayable = total.amount + displayPackingCharge - (discountDetails.packingDiscount ? 0 : discountDetails.discount);

    return (
        <div className="p-5 md:p-6 rounded-2xl bg-[#121212]/50 border border-neutral-900 shadow-xl flex flex-col gap-6" >
            
            {/* Notes & Terms Section */}
            <div>
                <h3 className="text-sm font-bold text-amber-100 uppercase tracking-wider mb-2">Delivery & Terms</h3>
                <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-gray-400 font-light leading-relaxed">
                    <li>Currently delivering to Andhra Pradesh, Karnataka, Kerala, Puducherry, Tamil Nadu.</li>
                    <li>Once booking is placed, please complete the payment and send the screenshot to our WhatsApp number to dispatch your order.</li>
                </ul>
            </div>
            
            <div className="w-full h-px bg-neutral-900" />
            
            {/* Coupon Section */}
            <div>
                <h3 className="text-sm font-bold text-amber-100 uppercase tracking-wider mb-3">Apply Coupon</h3>
                {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-950/20 border border-green-500/20 p-3 rounded-xl">
                        <div>
                            <span className="font-bold text-green-400 text-xs tracking-wider uppercase">{appliedCoupon.code}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                                {appliedCoupon.type === 'free_packing' ? 'Free Secured Packing' : `Discount: ₹${discountDetails.discount}`}
                            </span>
                        </div>
                        <button 
                            onClick={handleRemoveCoupon}
                            className="cursor-pointer text-red-400 hover:text-red-300 text-xs font-semibold bg-transparent border-0"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input 
                            placeholder="Coupon Code" 
                            value={couponInput} 
                            onChange={(e) => setCouponInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                            className="flex-grow bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] focus:outline-none text-white h-9 px-3 rounded-lg text-xs tracking-wider uppercase placeholder-gray-500 transition"
                        />
                        <button 
                            onClick={handleApplyCoupon}
                            disabled={loading}
                            className="h-9 cursor-pointer bg-neutral-900 border border-neutral-850 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-50 text-white text-xs font-semibold px-4 rounded-lg transition"
                        >
                            {loading ? '...' : 'Apply'}
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-neutral-900" />

            {/* Booking Summary Section */}
            <div>
                <h3 className="text-sm font-bold text-amber-100 uppercase tracking-wider mb-4">Booking Summary</h3>
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-light py-1.5 border-b border-neutral-900/40">
                        <span className="text-gray-400">Sub Total</span>
                        <span className="text-white font-medium">Rs. {total?.amount}</span>
                    </div>
                    
                    {appliedCoupon && !discountDetails.packingDiscount && (
                        <div className="flex justify-between items-center text-xs font-light py-1.5 border-b border-neutral-900/40">
                            <span className="text-gray-400">Coupon Discount</span>
                            <span className="text-green-400 font-medium">- Rs. {discountDetails.discount}</span>
                        </div>
                    )}

                    <div className="flex justify-between items-center text-xs font-light py-1.5 border-b border-neutral-900/40">
                        <span className="text-gray-400">Secured Packing (Plastic Sack)</span>
                        <div className="flex items-center gap-2">
                            <span className={`text-white font-medium ${discountDetails.packingDiscount ? 'line-through text-gray-500 font-light' : ''}`} >
                                Rs. {settings?.courierCharge}
                            </span>
                            {discountDetails.packingDiscount && <span className="text-green-400 text-[10px] font-bold uppercase tracking-wider">FREE</span>}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs font-light py-1.5 border-b border-neutral-900/40">
                        <span className="text-gray-400">Transport Charges</span>
                        <span className="text-gray-400 text-right text-[10px]">To be paid to agency</span>
                    </div>

                    <div className="flex justify-between items-center pt-3">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Amount Payable</span>
                        <span className="text-[#D4AF37] font-extrabold text-xl">Rs. {amountPayable}</span>
                    </div>
                </div>
            </div>

            {
                showButton && (
                    <button 
                        disabled={total?.amount < settings?.minimumAmount}
                        onClick={() => {
                            navigate.push('/checkout')
                        }}
                        className="w-full h-11 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-6 rounded-lg shadow-md transition duration-300 disabled:opacity-50 text-sm whitespace-nowrap flex items-center justify-center gap-2 mt-2"
                    >
                        Proceed to Book
                    </button>
                )
            }
        </div>
    )
}
