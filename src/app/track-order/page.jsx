"use client";
import React, { Suspense, useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { App } from 'antd'
import { useUserActions } from '../../actions/user'
import Order from '../../components/Order'
import { useSearchParams } from "next/navigation";

function TrackOrderContent() {
    const [values, setValues] = useState({ phone: '', orderNumber: '' })
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(false);
    const { getOrdersByPhoneOrOrderId } = useUserActions()
    const { message } = App.useApp()

    const searchParams = useSearchParams();
    const id = searchParams.get("id"); // ?id=123

    useEffect(() => {
        if (id && /[0-9]{4}-[0-9]{4}-[0-9]{6}/.test(id))
            fetchOrders(id, '')
    }, [id])

    async function fetchOrders(orderId = '', phone = '') {
        setLoading(true);
        const res = await getOrdersByPhoneOrOrderId(phone, orderId)
        setOrders(res);
        setLoading(false);
    }

    const handleTrack = () => {
        if (/[0-9]{4}-[0-9]{4}-[0-9]{6}/.test(values?.orderNumber) || /[6789]{1}[0-9]{9}/.test(values?.phone))
            fetchOrders(values?.orderNumber, values?.phone)
        else
            message.info("Please provide valid order number or phone number")
    }

    return (
        <>
            <div className="flex flex-col items-center py-16 md:py-20 bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#0a0a0a] border-b border-[#D4AF37]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase text-center px-4">
                    Track <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Order</span>
                </h1>
                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-mono text-center px-4">Check your package status</p>
            </div>

            <div className="max-w-4xl mx-auto w-full px-4 mt-10">
                <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-6 md:p-8 shadow-xl shadow-black/40 flex flex-col items-center">
                    <h2 className="text-sm md:text-base font-bold text-amber-100 mb-6 uppercase tracking-wider text-center">
                        Enter Order details to track
                    </h2>
                    <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4" >
                        <input 
                            className="w-full md:w-72 bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] focus:outline-none text-white hover:border-[#D4AF37]/50 rounded-lg h-11 px-4 placeholder-gray-500 font-light text-sm transition"
                            placeholder="Order Number (xxxx-xxxx-xxxxxx)" 
                            inputMode="numeric" 
                            maxLength={16} 
                            value={values?.orderNumber} 
                            onChange={(e) => {
                                let id = e.target.value?.trim()
                                if (!/[0-9-]+/.test(id) && id !== '') return
                                setValues({ ...values, orderNumber: id })
                            }} 
                        />
                        <span className="text-xs text-gray-500 font-mono font-semibold uppercase">Or</span>
                        <input 
                            className="w-full md:w-72 bg-neutral-950 border border-neutral-800 focus:border-[#D4AF37] focus:outline-none text-white hover:border-[#D4AF37]/50 rounded-lg h-11 px-4 placeholder-gray-500 font-light text-sm transition"
                            placeholder="Phone Number" 
                            inputMode="numeric" 
                            maxLength={10} 
                            value={values?.phone} 
                            onChange={(e) => {
                                let id = e.target.value?.trim()
                                if (!/[0-9]+/.test(id) && id !== '') return
                                setValues({ ...values, phone: id })
                            }} 
                        />
                        <button 
                            onClick={handleTrack} 
                            disabled={loading}
                            className="w-full md:w-auto h-11 cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-bold px-8 rounded-lg shadow-md transition duration-300 disabled:opacity-50 text-sm whitespace-nowrap"
                        >
                            {loading ? 'Tracking...' : 'Track Order'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 max-w-4xl mx-auto my-10 px-4 w-full" >
                {
                    loading ?
                        <div className="w-full py-12 flex justify-center items-center" >
                            <p className="text-center text-amber-100/70 font-light tracking-wide text-sm animate-pulse">Fetching Orders...</p>
                        </div>
                        :
                        <>
                            {
                                orders?.length === 0 ?
                                    (values.orderNumber || values.phone ? (
                                        <div className="w-full py-12 bg-[#121212] border border-neutral-900 rounded-2xl" >
                                            <p className="text-center text-amber-100/60 font-light text-sm">No order found with these details.</p>
                                        </div>
                                    ) : null)
                                    :
                                    <div className="space-y-6">
                                        {
                                            orders?.map((order, index) => {
                                                return (
                                                    <Order isAdmin={false} data={order} key={index} />
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </>
                }
            </div>
        </>
    );
}

export default function TrackOrder() {
    return (
        <div className="w-full min-h-screen flex flex-col bg-[#0a0a0a] text-white">
            <Header />
            <Suspense fallback={<div className="text-center py-20 text-amber-100/60 font-light">Loading tracker...</div>}>
                <TrackOrderContent />
            </Suspense>
            <Footer />
        </div>
    )
}
