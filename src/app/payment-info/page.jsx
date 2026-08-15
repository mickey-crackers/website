"use client";
import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import QR from '../../assets/qr.jpeg'

export default function PaymentInfo() {
    const [copiedUpi, setCopiedUpi] = useState(false);
    const [copiedPhone, setCopiedPhone] = useState(false);
    const [copiedAccNum, setCopiedAccNum] = useState(false);
    const [copiedIfsc, setCopiedIfsc] = useState(false);

    const handleCopy = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'upi') {
            setCopiedUpi(true);
            setTimeout(() => setCopiedUpi(false), 2000);
        } else if (type === 'phone') {
            setCopiedPhone(true);
            setTimeout(() => setCopiedPhone(false), 2000);
        } else if (type === 'accNum') {
            setCopiedAccNum(true);
            setTimeout(() => setCopiedAccNum(false), 2000);
        } else if (type === 'ifsc') {
            setCopiedIfsc(true);
            setTimeout(() => setCopiedIfsc(false), 2000);
        }
    };

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Header />
            <div className="flex flex-col items-center py-16 md:py-20 bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#0a0a0a] border-b border-[#D4AF37]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase text-center px-4">
                    Payment <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Information</span>
                </h1>
                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-mono text-center px-4">Secure Payment Options</p>
            </div>

            <section className="bg-[#0a0a0a] py-10 md:py-16 px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-12 gap-6 md:gap-8">
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* UPI & Mobile Payments */}
                        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/30">
                            <h2 className="text-lg md:text-xl font-bold text-[#D4AF37] mb-4 tracking-wide uppercase border-b border-[#D4AF37]/15 pb-2">
                                UPI & Mobile Payments
                            </h2>
                            <ul className="space-y-4 text-neutral-300 text-sm font-light">
                                <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">UPI ID</span>
                                        <span className="font-mono text-amber-100 text-sm mt-1 select-all break-all">ndranalage26-1@okicici</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy('ndranalage26-1@okicici', 'upi')}
                                        className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto text-center animate-in fade-in"
                                    >
                                        {copiedUpi ? 'Copied!' : 'Copy UPI ID'}
                                    </button>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Google Pay / PhonePe</span>
                                        <span className="font-mono text-amber-100 text-sm mt-1 select-all">9025399060</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy('9025399060', 'phone')}
                                        className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto text-center animate-in fade-in"
                                    >
                                        {copiedPhone ? 'Copied!' : 'Copy Number'}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Bank Account Details */}
                        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/30">
                            <h2 className="text-lg md:text-xl font-bold text-[#D4AF37] mb-4 tracking-wide uppercase border-b border-[#D4AF37]/15 pb-2">
                                Bank Account Details
                            </h2>
                            <ul className="space-y-4 text-neutral-300 text-sm font-light">
                                <li className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Account Holder Name</span>
                                        <span className="text-amber-100 text-sm mt-1 font-semibold">MR. ALAKENTHERAN ALAGESAN</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Bank & Branch</span>
                                        <span className="text-neutral-300 text-sm mt-1">Tamilnad Mercantile Bank (TMB), Meenampatti Branch</span>
                                    </div>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Account Number</span>
                                        <span className="font-mono text-amber-100 text-sm mt-1 select-all">521100050301603</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy('521100050301603', 'accNum')}
                                        className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
                                    >
                                        {copiedAccNum ? 'Copied!' : 'Copy Account No'}
                                    </button>
                                </li>
                                <li className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">IFSC Code</span>
                                        <span className="font-mono text-amber-100 text-sm mt-1 select-all">TMBL0000521</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy('TMBL0000521', 'ifsc')}
                                        className="cursor-pointer bg-neutral-900 border border-neutral-800 hover:border-[#D4AF37] hover:text-[#D4AF37] text-gray-300 text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-300 w-full sm:w-auto text-center"
                                    >
                                        {copiedIfsc ? 'Copied!' : 'Copy IFSC Code'}
                                    </button>
                                </li>
                                <li className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-950/50 p-4 rounded-xl border border-yellow-900">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Account Type</span>
                                        <span className="text-neutral-300 text-sm mt-1">Savings Account</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">MICR Code</span>
                                        <span className="font-mono text-neutral-300 text-sm mt-1">626060312</span>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Instructions */}
                        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/30">
                            <h2 className="text-lg md:text-xl font-bold text-[#D4AF37] mb-4 tracking-wide uppercase border-b border-[#D4AF37]/15 pb-2">
                                How to Make a Payment
                            </h2>
                            <ol className="list-decimal list-outside pl-5 space-y-3 text-neutral-300 text-sm font-light leading-relaxed">
                                <li>
                                    Add your desired fireworks to the cart and place the order/quotation request.
                                </li>
                                <li>
                                    Transfer the payment amount using Bank Transfer or GPay, PhonePe, or the UPI ID provided.
                                </li>
                                <li>
                                    Take a screenshot of the successful transaction and send it to our WhatsApp number with your Order ID.
                                </li>
                                <li>
                                    Once verified, we will securely pack and dispatch your order from Sivakasi directly to your address.
                                </li>
                            </ol>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-4">
                        {/* Digital Payments Scan */}
                        <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-5 md:p-6 shadow-xl shadow-black/30 flex flex-col items-center">
                            <h2 className="text-lg md:text-xl font-bold text-[#D4AF37] mb-4 tracking-wide uppercase border-b border-[#D4AF37]/15 pb-2 w-full text-center">
                                Scan & Pay
                            </h2>
                            <div className="bg-white overflow-hidden rounded-xl shadow-inner shadow-black border-2 border-yellow-400 max-w-[250px] w-full">
                                <img src={QR.src || QR} alt="UPI QR code" className="w-full h-auto object-contain rounded-md" />
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-wider text-center">Scan using any UPI App</p>
                        </div>
                    </div>

                    {/* SEO & Branding */}
                    <div className="text-gray-500 col-span-12 font-light text-xs leading-relaxed mt-6 border-t border-neutral-900 pt-6">
                        <p>
                            Mickey Crackers is a trusted Sivakasi-based fireworks supplier offering
                            over 150+ varieties of BIS-certified crackers, including sparklers, chakkars, mega fountains,
                            gift boxes, and more—perfect for Diwali, weddings, and festive events.
                        </p>
                        <p className="mt-3">
                            With safe packaging, prompt customer service, and transparent payment channels,
                            we aim to make your celebrations bright and hassle-free. Order today and experience the
                            joy of Sivakasi fireworks delivered to your doorstep.
                        </p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
