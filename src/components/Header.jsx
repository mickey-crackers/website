"use client";
import React, { useState, useMemo, useEffect } from 'react'
import Logo from '../assets/mickey-logo.png'
import rocket from '../assets/rocket.gif'
import Link from 'next/link'
import { useCartStore } from '../store/cartStore'
import { PiShoppingCartDuotone } from "react-icons/pi";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useRouter, usePathname } from 'next/navigation';
import { FaPhone } from "react-icons/fa6";
import { RiInstagramLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa6";

export default function Header() {
    const router = useRouter()
    const pathname = usePathname();

    const [show, setShow] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { products } = useCartStore()

    const total = useMemo(() => {
        var counts = 0;
        products?.map((prod) => {
            counts = counts + prod?.count
        })
        return counts
    }, [products])

    useEffect(() => {
        const handleScroll = () => {
            const threshold = window.innerWidth < 1024 ? 140 : 80;
            if (window.scrollY > threshold) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };
        // Call once to initialize
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const showTopBar = pathname !== "/quick-purchase" && pathname !== "/cart" && pathname !== "/checkout";

    return (
        <>
            {showTopBar && (
                <nav className="w-full bg-[#0a0a0a] py-3.5 min-h-fit px-4 md:px-8 gap-4 flex flex-col lg:flex-row lg:justify-between items-center border-b border-[#D4AF37]/10">
                    <div className='flex items-center gap-4' >
                        <div className='flex items-center gap-2' >
                            <FaPhone className='text-[#D4AF37]' />
                            <a href="tel:+919025399060" className="text-gray-300 font-semibold hover:text-[#D4AF37] transition">
                                +91-9025399060
                            </a>
                        </div>
                        <a href="https://www.instagram.com/mickey_crackers/" className="text-gray-400 hover:text-[#D4AF37] transition" target="_blank" rel="noopener noreferrer">
                            <RiInstagramLine className='text-xl' />
                        </a>
                        <a href="https://wa.me/+919025399060" className="text-gray-400 hover:text-green-500 transition" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp className='text-xl' />
                        </a>
                    </div>
                    <div className='lg:ms-5 flex items-center gap-3 cursor-pointer relative' onClick={() => { router.push('/') }} >
                        <img className='lg:ms-8 w-32 object-cover' src={Logo.src || Logo} alt='mickey crackers sivakasi' />
                        <img className='absolute -left-5 w-16 block' src={rocket.src || rocket} alt='gold fireworks animation rocket' />
                        <img className='absolute left-28 w-16 block' src={rocket.src || rocket} alt='gold fireworks animation rocket' />
                    </div>
                    <div className='flex items-center gap-4' >
                        <a href="/mickey-crackers-price-list.pdf" className="text-[#D4AF37]" target='_blank' download>
                            <span className='h-fit text-black font-semibold rounded bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 py-2 px-3 text-xs tracking-wider transition-all duration-300' >Download Price List</span>
                        </a>
                        <button className='h-fit text-black font-semibold rounded bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:brightness-110 py-2 px-4 text-xs tracking-wider cursor-pointer transition-all duration-300' onClick={() => {
                            router.push('/quick-purchase')
                        }} >Order Now</button>
                    </div>
                </nav>
            )}
            <header className={`w-full sticky top-0 bg-[#121212]/95 backdrop-blur-md z-50 border-b border-[#D4AF37]/20 shadow-lg shadow-black/40 transition-all duration-300 ${isScrolled ? 'shadow-black/60' : ''}`} >
                <nav className={`items-center px-4 md:px-8 transition-all duration-300 flex justify-between ${isScrolled ? 'py-2' : 'py-3.5'}`} >
                    <div className='w-full flex justify-between items-center gap-4 md:gap-6' >
                        {/* Left group: Logo (collapsible) + Nav Links */}
                        <div className='flex items-center' >
                            {/* Small Logo with sliding transition */}
                            <div 
                                className={`flex items-center cursor-pointer transition-all duration-500 ease-in-out overflow-hidden ${
                                    (isScrolled || !showTopBar) 
                                        ? 'w-16 md:w-20 opacity-100 mr-4 md:mr-6' 
                                        : 'w-0 opacity-0 mr-0'
                                }`}
                                onClick={() => { router.push('/') }}
                            >
                                <img className='w-16 md:w-20 object-cover min-w-[64px] md:min-w-[80px]' src={Logo.src || Logo} alt='mickey crackers sivakasi' />
                            </div>

                            {/* Nav Links */}
                            <div className='hidden lg:flex items-center gap-6' >
                                <Link href="/payment-info" >
                                    <p className={`text-sm duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold ${pathname === '/payment-info' ? 'text-[#D4AF37]' : 'text-amber-100/90'}`} >Payment Info</p>
                                </Link>
                                <Link href="/quick-purchase" >
                                    <p className={`text-sm duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold ${pathname === '/quick-purchase' ? 'text-[#D4AF37]' : 'text-amber-100/90'}`} >Quick Purchase</p>
                                </Link>
                                <Link href="/track-order" >
                                    <p className={`text-sm duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold ${pathname === '/track-order' ? 'text-[#D4AF37]' : 'text-amber-100/90'}`} >Track Order</p>
                                </Link>
                                <Link href="/contact-us" >
                                    <p className={`text-sm duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold ${pathname === '/contact-us' ? 'text-[#D4AF37]' : 'text-amber-100/90'}`} >Contact</p>
                                </Link>
                            </div>
                        </div>

                        {/* Right group: Action Button + Cart + Hamburger */}
                        <div className='flex items-center gap-3 md:gap-4' >
                            {/* Minimal action button shown when scrolled with slide-in transition */}
                            <div 
                                className={`transition-all duration-500 ease-in-out overflow-hidden flex items-center ${
                                    (isScrolled && showTopBar)
                                        ? 'max-w-[150px] opacity-100 mr-1 md:mr-2' 
                                        : 'max-w-0 opacity-0 mr-0'
                                }`}
                            >
                                <button className='h-fit text-black font-semibold rounded bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:brightness-110 py-1.5 px-3 md:px-4 text-[10px] md:text-xs tracking-wider cursor-pointer whitespace-nowrap' onClick={() => {
                                    router.push('/quick-purchase')
                                }} >Order Now</button>
                            </div>

                            <Link href="/cart" >
                                <div className="p-2 md:p-2.5 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 rounded-lg flex gap-2 items-center text-black font-semibold transition cursor-pointer shadow-md shadow-black/20" >
                                    <PiShoppingCartDuotone className='text-base md:text-lg text-black' />
                                    <p className='text-black text-[10px] md:text-xs font-bold' >{total || '0'}</p>
                                </div>
                            </Link>
                            <HiOutlineMenuAlt3 className='block lg:hidden text-2xl text-[#D4AF37] cursor-pointer' onClick={() => {
                                setShow(true)
                            }} />
                        </div>
                    </div>

                    {/* Mobile Drawer menu */}
                    <div className={`lg:hidden transition-all duration-300 ease-in-out ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} w-screen h-screen fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-lg px-8 py-10 select-none z-50`} >
                        <div className='flex justify-end' >
                            <p className='text-[#D4AF37] text-lg font-semibold cursor-pointer border border-[#D4AF37]/30 rounded px-3 py-1 bg-[#121212]' onClick={() => { setShow(false) }} >Close Menu</p>
                        </div>
                        <div className='flex flex-col mt-12 items-center gap-6' >
                            <Link href="/payment-info" >
                                <p className='text-xl text-amber-100 duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold' onClick={() => { setShow(false) }} >Payment Info</p>
                            </Link>
                            <Link href="/quick-purchase" >
                                <p className='text-xl text-amber-100 duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold' onClick={() => { setShow(false) }} >Quick Purchase</p>
                            </Link>
                            <Link href="/track-order" >
                                <p className='text-xl text-amber-100 duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold' onClick={() => { setShow(false) }} >Track Order</p>
                            </Link>
                            <Link href="/contact-us" >
                                <p className='text-xl text-amber-100 duration-300 transition-all ease-in-out hover:text-[#D4AF37] font-semibold' onClick={() => { setShow(false) }} >Contact</p>
                            </Link>
                            <img className='w-[120px] mt-12 rounded-lg border border-[#D4AF37]/30 shadow-lg' src={Logo.src || Logo} alt='mickey crackers sivakasi' />
                            <h4 className='text-md text-amber-100/70 font-semibold uppercase tracking-wider' >Mickey Crackers &copy;</h4>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}
