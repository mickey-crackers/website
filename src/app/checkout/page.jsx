"use client";
import React, { useEffect, useMemo, useState } from 'react'
import { Form, Input, Checkbox, Modal, Result, message } from "antd";
import Header from '../../components/Header'
import Footer from '../../components/Footer';
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { useRouter } from 'next/navigation'
import BookingSummary from '../../components/BookingSummary'
import { getOwnerOrderMessageUrl } from '../../utils/whatsappHelper';

const { TextArea } = Input;

export default function CheckOut() {
    const router = useRouter()
    const { products, setProducts, appliedCoupon, setAppliedCoupon } = useCartStore()
    const { settings } = useUserStore()
    const [orderId, setOrderId] = useState('');
    const [openSuccess, setOpenSuccess] = useState(false)
    const [loading, setLoading] = useState(false);

    const total = useMemo(() => {
        var counts = 0, amount = 0;
        products?.forEach((prod) => {
            counts = counts + prod?.count
            amount = amount + prod?.total
        })
        return { counts, amount }
    }, [products])

    useEffect(() => {
        if (!openSuccess && total?.amount < settings?.minimumAmount)
            router.push('/cart')
    }, [total, settings, router, openSuccess])

    const [form] = Form.useForm();
    const [usePhoneAsWhatsapp, setUsePhoneAsWhatsapp] = useState(false);

    const states = [
        "Andhra Pradesh",
        "Karnataka",
        "Kerala",
        "Pondicherry",
        "Tamil Nadu"
    ];

    const onCheckboxChange = (e) => {
        setUsePhoneAsWhatsapp(e.target.checked);
        if (e.target.checked) {
            const phoneValue = form.getFieldValue("phone");
            form.setFieldsValue({ whatsapp: phoneValue });
        }
    };

    const onPhoneChange = (e) => {
        if (usePhoneAsWhatsapp) {
            form.setFieldsValue({ whatsapp: e.target.value });
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const cartPayload = products.map((prod) => {
                return { id: prod?.id, count: prod?.count }
            });

            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerData: values,
                    cartProducts: cartPayload,
                    couponCode: appliedCoupon?.code || null
                })
            });

            const result = await res.json();
            if (res.ok && result.success) {
                // Calculate total values for WhatsApp prefill before clearing Zustand store
                const subTotal = products.reduce((acc, p) => acc + p.total, 0);
                const isPackingFree = appliedCoupon?.type === 'free_packing';
                const discountVal = appliedCoupon?.type === 'percentage' 
                    ? Math.round((subTotal * appliedCoupon.value) / 100) 
                    : (appliedCoupon?.type === 'flat' ? Math.min(appliedCoupon.value, subTotal) : 0);
                const finalPackingCharge = isPackingFree ? 0 : (settings?.courierCharge || 0);
                const totalAmount = subTotal + finalPackingCharge - (isPackingFree ? 0 : discountVal);

                const whatsappUrl = getOwnerOrderMessageUrl({
                    orderID: result.orderID,
                    customerData: values,
                    cart: {
                        products: products,
                        totalAmount: totalAmount,
                        couponCode: appliedCoupon?.code || null,
                        packingDiscount: isPackingFree,
                        couponDiscount: isPackingFree ? 0 : discountVal
                    }
                });

                setOrderId(result.orderID);
                setOpenSuccess(true);
                setProducts([]);
                setAppliedCoupon(null);

                // Open wa.me chat window
                window.open(whatsappUrl, '_blank');
            } else {
                message.error(result.error || 'Failed to process order.');
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            message.error('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-[#0a0a0a] text-white select-none" >
            <Header />
            
            {/* Header Area */}
            <div className="flex flex-col items-center py-12 bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#0a0a0a] border-b border-[#D4AF37]/20 relative overflow-hidden text-center px-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                    Complete <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Booking</span>
                </h1>
                <p className="text-xs text-gray-400 font-light mt-2 uppercase tracking-widest">
                    Please enter your contact & address to complete your order
                </p>
            </div>

            {/* Layout Grid */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 px-4 sm:px-6 py-10 flex-grow" >
                <div className="col-span-12 md:col-span-7 lg:col-span-8 bg-[#121212]/30 border border-neutral-900 rounded-2xl p-5 md:p-8" >
                    <Form
                        className="grid grid-cols-12 gap-x-4 gap-y-1"
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            state: "Tamil Nadu",
                        }}
                    >
                        <Form.Item
                            className="col-span-12 md:col-span-6"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Full Name *</span>}
                            name="fullName"
                            rules={[
                                { required: true, message: "Please enter your full name" },
                                { min: 3, message: "Name must be at least 3 characters" }
                            ]}
                        >
                            <Input 
                                placeholder="Enter full name" 
                                size="large" 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                            />
                        </Form.Item>

                        <Form.Item
                            className="col-span-12 md:col-span-6"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Email *</span>}
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" }
                            ]}
                        >
                            <Input 
                                placeholder="Enter email address" 
                                size="large" 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                            />
                        </Form.Item>

                        <div className="col-span-12 md:col-span-6" >
                            <Form.Item
                                label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Phone Number *</span>}
                                name="phone"
                                rules={[
                                    { required: true, message: "Please enter your phone number" },
                                    { pattern: /^[0-9]{10}$/, message: "Phone must be 10 digits" }
                                ]}
                            >
                                <Input 
                                    placeholder="Enter 10-digit phone number" 
                                    size="large" 
                                    maxLength={10} 
                                    onChange={onPhoneChange} 
                                    className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                                />
                            </Form.Item>

                            <Form.Item className="!mb-3">
                                <Checkbox 
                                    checked={usePhoneAsWhatsapp} 
                                    onChange={onCheckboxChange} 
                                    className="!text-gray-400 text-xs hover:!text-gray-300"
                                >
                                    Use phone number as WhatsApp number
                                </Checkbox>
                            </Form.Item>
                        </div>

                        <Form.Item
                            className="col-span-12 md:col-span-6"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">WhatsApp Number *</span>}
                            name="whatsapp"
                            rules={[
                                { required: true, message: "Please enter your WhatsApp number" },
                                { pattern: /^[0-9]{10}$/, message: "WhatsApp must be 10 digits" }
                            ]}
                        >
                            <Input 
                                placeholder="Enter 10-digit WhatsApp number" 
                                size="large" 
                                maxLength={10} 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                            />
                        </Form.Item>

                        <Form.Item
                            className="col-span-12"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Shipping Address *</span>}
                            name="address"
                            rules={[
                                { required: true, message: "Please enter your address" },
                                { min: 5, message: "Address must be at least 5 characters" }
                            ]}
                        >
                            <TextArea 
                                rows={3} 
                                placeholder="Enter full delivery address" 
                                size="large" 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            className="col-span-12 md:col-span-4"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">State *</span>}
                            name="state"
                            rules={[{ required: true, message: "Please select your state" }]}
                        >
                            <select 
                                className="w-full bg-neutral-950 border border-neutral-850 focus:border-[#D4AF37] focus:outline-none text-white h-11 px-3 rounded-lg text-sm transition"
                            >
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </Form.Item>

                        <Form.Item
                            className="col-span-12 md:col-span-4"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">City *</span>}
                            name="city"
                            rules={[{ required: true, message: "Please enter your city" }]}
                        >
                            <Input 
                                placeholder="Enter city" 
                                size="large" 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                            />
                        </Form.Item>

                        <Form.Item
                            className="col-span-12 md:col-span-4"
                            label={<span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Pincode *</span>}
                            name="pincode"
                            rules={[
                                { required: true, message: "Please enter your pincode" },
                                { pattern: /^[0-9]{6}$/, message: "Pincode must be exactly 6 digits" }
                            ]}
                        >
                            <Input 
                                placeholder="Enter pincode" 
                                maxLength={6} 
                                size="large" 
                                className="!bg-neutral-950 !border-neutral-850 focus:!border-[#D4AF37] !text-white hover:!border-neutral-800 rounded-lg h-11"
                            />
                        </Form.Item>

                        <Form.Item className="col-span-12 mb-0 mt-4" >
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full h-11 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-8 rounded-lg shadow-md transition duration-300 disabled:opacity-50 text-sm uppercase tracking-wider"
                            >
                                {loading ? "Processing..." : "Place Booking & Open WhatsApp"}
                            </button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="col-span-12 md:col-span-5 lg:col-span-4" >
                    <BookingSummary showButton={false} />
                </div>
            </div>
            <Footer/>

            <Modal 
                width={600} 
                open={openSuccess} 
                footer={null} 
                onCancel={() => {
                    setProducts([])
                    setOpenSuccess(false)
                    router.push('/quick-purchase')
                }}
                styles={{
                    content: {
                        backgroundColor: '#121212',
                        border: '1px solid #262626',
                        borderRadius: '24px',
                        color: '#ffffff',
                        padding: '30px'
                    }
                }}
            >
                <Result
                    status="success"
                    title={<span className="text-white text-2xl font-bold tracking-wide">Order Placed Successfully!</span>}
                    subTitle={
                        <span className="text-gray-400 text-sm block mt-3 leading-relaxed">
                            Your order number is <strong className="text-[#D4AF37] font-mono font-bold text-base">{orderId}</strong>. We have opened a chat on WhatsApp to send your booking confirmation. Please send the payment screenshot there.
                        </span>
                    }
                    extra={[
                        <button 
                            key="buy" 
                            onClick={() => {
                                setProducts([])
                                router.push('/quick-purchase')
                            }} 
                            className="cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-6 py-2.5 rounded-lg shadow-md transition duration-300 text-xs tracking-wide uppercase"
                        >
                            Buy More Crackers
                        </button>,
                    ]}
                />
            </Modal>
        </div>
    )
}
