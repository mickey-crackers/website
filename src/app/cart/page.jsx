"use client";
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProductCard from '../../components/ProductCard'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import { useRouter } from 'next/navigation'
import BookingSummary from '../../components/BookingSummary'

export default function Cart() {
    const navigate = useRouter()
    const { products } = useCartStore()
    const { settings } = useUserStore()
    const [updatedProducts, setUpdatedProducts] = useState([]);

    useEffect(() => {
        setUpdatedProducts(products)
    }, [products])

    return (
        <div className="w-full min-h-screen flex flex-col bg-[#0a0a0a] text-white select-none" >
            <Header />
            
            {/* Header section with gradient and glow */}
            <div className="flex flex-col items-center py-12 bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#0a0a0a] border-b border-[#D4AF37]/20 relative overflow-hidden text-center px-4">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase">
                    Manage Your <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Cart</span>
                </h1>
                <p className="text-xs text-amber-500/80 font-mono mt-2 uppercase tracking-widest">
                    Minimum Order Value: Rs.{settings?.minimumAmount}
                </p>
            </div>

            {/* Cart products grid */}
            <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 px-4 sm:px-6 py-10 flex-grow" >
                <div className="col-span-12 md:col-span-7 lg:col-span-8 space-y-4" >
                    {
                        updatedProducts?.length === 0 ?
                            <div className="py-16 bg-[#121212]/50 border border-neutral-900 rounded-2xl flex flex-col justify-center items-center px-4" >
                                <p className="text-sm text-amber-100/60 font-light mb-4" >Your cart is empty</p>
                                <button 
                                    onClick={() => { navigate.push('/quick-purchase'); }}
                                    className="cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-extrabold px-6 py-2.5 rounded-lg shadow-md transition duration-300 text-xs tracking-wide uppercase"
                                >
                                    Purchase Crackers Now
                                </button>
                            </div> :
                            <div className="space-y-4">
                                {
                                    updatedProducts?.map((product, index) => {
                                        return (
                                            <ProductCard product={product} isCart={true} key={index} />
                                        )
                                    })
                                }
                            </div>
                    }
                </div>
                <div className="col-span-12 md:col-span-5 lg:col-span-4" >
                    <BookingSummary showButton={true} />
                </div>
            </div>
            <Footer/>
        </div>
    )
}
