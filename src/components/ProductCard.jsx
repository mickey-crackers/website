import React, { useEffect, useMemo, useState } from 'react'
import { Button, Image, InputNumber } from 'antd'
import Logo from '../assets/mickey-logo.png'
import { useUserStore } from '../store/userStore/index'
import { useCartStore } from '../store/cartStore'
import { AiOutlineDelete } from "react-icons/ai";
import { TiMinus, TiPlus } from "react-icons/ti";

export default function ProductCard({ product, isCart = false }) {
    const { products, setProducts } = useCartStore()
    const { settings } = useUserStore()

    const [cracker, setCracker] = useState({ ...product, count: 0, total: 0 })

    // Set initial cracker from cart products
    useEffect(() => {
        const matched = products?.find(p => p?.id === product?.id);
        if (matched) {
            setCracker({ ...matched });
        } else {
            setCracker({ ...product, count: 0, total: 0 });
        }
    }, [product, products]);

    const discountedPrice = useMemo(() => {
        const discountVal = Number(settings?.discount || 0);
        return Math.round(product?.price - (product?.price * discountVal) / 100);
    }, [product, settings]);

    const updateCracker = (newCount) => {
        const count = Math.max(0, Math.min(250, newCount)); // keep within 0-250
        const updated = {
            ...cracker,
            count,
            total: count * discountedPrice,
        };
        setCracker(updated);

        const index = products.findIndex((prod) => prod?.id == product?.id);

        // Update global cart state
        const updatedProducts = products?.filter(p => p.id !== product.id);
        if (updated?.count != 0) {
            updatedProducts?.splice(index, 0, updated)
        }
        setProducts(updatedProducts)
    };

    const deleteProduct = () => {
        const updatedProducts = products?.filter(p => p.id !== product.id);
        setProducts(updatedProducts)
    }

    const hasDiscount = settings?.discount > 0;

    return (
        <div className='flex flex-col sm:flex-row justify-between gap-4 sm:gap-0 border-b border-neutral-900/60 bg-[#121212]/10 p-4 rounded-xl hover:bg-[#121212]/30 hover:border-neutral-800 transition duration-300'>
            <div className='left flex gap-4'>
                <Image 
                    width={70} 
                    height={70} 
                    src={product?.imageFile || Logo.src || Logo} 
                    fallback={Logo.src || Logo} 
                    alt={product?.name} 
                    className="object-contain rounded-lg border border-neutral-900 bg-neutral-950 p-1"
                />
                <div className="flex flex-col justify-center">
                    <p className='text-[#D4AF37] font-semibold text-[10px] uppercase tracking-wider'>{product?.category}</p>
                    <p className='text-md font-bold text-white mt-0.5'>{product?.name}</p>
                    <p className='text-xs text-gray-400 font-light mt-0.5'>{product?.quantityType}</p>
                    <p className="mt-1">
                        {hasDiscount ? (
                            <>
                                <span className='font-bold me-2 text-amber-100'>Rs.{discountedPrice}</span>
                                <span className='line-through text-red-500 text-[10px]'>Rs.{product?.price}</span>
                            </>
                        ) : (
                            <span className='font-bold text-amber-100'>Rs.{product?.price}</span>
                        )}
                    </p>
                </div>
            </div>
            <div className='flex flex-row justify-between sm:justify-evenly sm:flex-col gap-3 items-center'>
                <div className='flex items-center gap-1.5'>
                    <Button
                        icon={<TiMinus className='text-sm' />}
                        disabled={cracker?.count < 1}
                        onClick={() => updateCracker(cracker?.count - 1)}
                        className="!bg-neutral-900 !border-neutral-800 !text-white hover:!border-[#D4AF37] hover:!text-[#D4AF37] disabled:!bg-neutral-950 disabled:!text-gray-600 disabled:!border-neutral-900"
                    />
                    <input
                        type="text"
                        inputMode="numeric"
                        value={cracker?.count}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            updateCracker(val ? Number(val) : 0);
                        }}
                        className="bg-neutral-950 border border-neutral-850 focus:border-[#D4AF37] focus:outline-none text-white w-16 h-8 text-center rounded-lg text-sm font-semibold transition"
                    />
                    <Button
                        icon={<TiPlus className='text-sm' />}
                        disabled={cracker?.count >= 250}
                        onClick={() => updateCracker(cracker?.count + 1)}
                        className="!bg-neutral-900 !border-neutral-800 !text-white hover:!border-[#D4AF37] hover:!text-[#D4AF37] disabled:!bg-neutral-950 disabled:!text-gray-600 disabled:!border-neutral-900"
                    />
                </div>
                <div className='flex flex-row justify-center items-center gap-4' >
                    <p className='text-md text-[#D4AF37] font-bold'>Rs. {cracker?.total}</p>
                    {
                        isCart && (
                            <Button 
                                type='primary' 
                                danger 
                                icon={<AiOutlineDelete />} 
                                onClick={deleteProduct}
                                className="flex items-center justify-center"
                            ></Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
}