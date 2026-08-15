/**
 * Utility helper functions for generating WhatsApp wa.me redirect URLs with prefilled messages
 */

const OWNER_WHATSAPP_NUMBER = '919025399060'; // Sanitized owner number

/**
 * Sanitizes a phone number to only digits and prepends country code if needed
 */
export function sanitizePhoneNumber(phone) {
    if (!phone) return '';
    // Remove all non-numeric characters
    let cleaned = phone.toString().replace(/\D/g, '');
    
    // If it starts with +91 or 91 and has 12 digits, return it
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
        return cleaned;
    }
    
    // If it is 10 digits, assume India (+91) and prepend 91
    if (cleaned.length === 10) {
        return '91' + cleaned;
    }
    
    return cleaned;
}

/**
 * Generates the WhatsApp URL for customers to send order invoices to the shop owner
 */
export function getOwnerOrderMessageUrl(order) {
    const orderID = order.orderID || 'N/A';
    const customerName = order.customerData?.fullName || 'N/A';
    const mobile = order.customerData?.phone || 'N/A';
    const address = `${order.customerData?.address || ''}, ${order.customerData?.city || ''}, ${order.customerData?.state || ''} - ${order.customerData?.pincode || ''}`;
    const couponCode = order.cart?.couponCode || 'None';
    const totalAmount = order.cart?.totalAmount || 0;

    const productList = (order.cart?.products || []).map(p => {
        const name = p.name || 'N/A';
        const type = p.type || p.quantityType || '';
        const qty = p.qty || p.count || 0;
        const total = p.total || 0;
        return `- ${name} [${type}] x ${qty} = ₹${total.toLocaleString('en-IN')}`;
    }).join('\n');

    const message = `🎆 *New Crackers Order*

Please find my order details below.

*Order ID:* ${orderID}

*Customer Name:* ${customerName}
*Mobile:* ${mobile}
*Address:* ${address}

*Products:*
${productList}

*Coupon:* ${couponCode}
*Total Amount:* ₹${totalAmount.toLocaleString('en-IN')}

Kindly confirm my order. Thank you.`;

    return `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates the WhatsApp URL for admins to send order IDs to customers
 */
export function getAdminSendIdUrl(order) {
    const customerPhone = sanitizePhoneNumber(order?.customerData?.phone);
    const customerName = order?.customerData?.fullName || 'N/A';
    const orderID = order?.orderID || 'N/A';

    const message = `Hello ${customerName},

Thank you for your order.

Your Order ID is:
*${orderID}*

You can use this Order ID for future communication regarding your order.

    Track your order here:
    https://mickeycrackers.com/track-order?id=${orderID}

    Thank you for choosing us!

    Best regards,
    *Mickey Crackers, Sivakasi*
Support: +91 90253 99060`;

    return `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
}
