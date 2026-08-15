"use client";
import React from "react";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import Footer from "../components/Footer";
import Logo from '../assets/mickey-logo.png';
import bottomGif from '../assets/bottom.png';
import FAQSection from "../components/FAQ";
import FireworksCanvas from "../components/FireworksCanvas";
import { FiShield, FiTag, FiBox, FiTruck } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from "react-icons/fa";

export default function HomePageClient() {
    const router = useRouter();



    const handleSubmit = () => {
        const rawMessage = `Hello, I am interested in purchasing crackers from Mickey Crackers. `;
        const encodedMessage = encodeURIComponent(rawMessage);
        const whatsappLink = `https://wa.me/+919025399060?text=${encodedMessage}`;
        window.open(whatsappLink, '_blank');
    };

    return (
        <div className="relative bg-[#0a0a0a] text-white min-h-screen">
            <FireworksCanvas />

            {/* Floating WhatsApp Contact Button */}
            <button
                onClick={handleSubmit}
                className="animate-bounce z-50 fixed bottom-12 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:bg-green-700 transition duration-300 flex items-center justify-center border border-[#D4AF37]/45"
                aria-label="Chat on WhatsApp"
                title="Chat on WhatsApp"
            >
                <FaWhatsapp size={22} />
            </button>

            <Header />

            <main>
                <HeroCarousel />

                {/* About Section */}
                <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Brand Logo Showcase */}
                    <div className="flex justify-center">
                        <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-3xl bg-neutral-950 border-2 border-[#D4AF37]/30 flex flex-col justify-center items-center p-8 text-center shadow-3xl shadow-amber-500/5 overflow-hidden group transition-all duration-500 hover:border-[#D4AF37]/65">
                            {/* Golden ambient background glow */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.1)_0%,_transparent_70%)] pointer-events-none" />
                            <div className="absolute -right-16 -top-16 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700" />
                            <div className="absolute -left-16 -bottom-16 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/15 transition-all duration-700" />

                            <img
                                className="w-48 md:w-56 object-contain z-10 transition-transform duration-500 group-hover:scale-105"
                                src={Logo.src || Logo}
                                alt="Mickey Crackers Sivakasi logo - Premium fireworks manufacturer"
                            />

                            <div className="mt-4 z-10">
                                <h3 className="text-amber-100 font-bold text-xl tracking-wider uppercase">Mickey Crackers</h3>
                                <p className="text-gray-400 text-xs mt-1 tracking-widest uppercase font-semibold">Sivakasi, Tamil Nadu</p>
                            </div>
                        </div>
                    </div>

                    {/* SEO-Friendly About Content */}
                    <div>
                        <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#D4AF37] mb-3 block uppercase">
                            Best Crackers Shop & Online Crackers Website
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-tight uppercase">
                            About <span className="bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#AA7C11] bg-clip-text text-transparent">Mickey Crackers</span>
                        </h2>

                        <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base font-light">
                            Welcome to <strong>Mickey Crackers</strong>, the best online crackers website and your premier destination to buy premium fireworks directly from Sivakasi. As a trusted wholesale and retail online <strong>vedi kadai</strong> (crackers shop), we provide low cost crackers with direct factory-level pricing to make your celebrations spectacular and safe.
                        </p>

                        <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base font-light">
                            Whether you are ordering for Diwali, wedding celebrations, temple festivals, or corporate events, we offer a comprehensive catalog at direct factory rates. Every product is <strong>100% BIS-certified</strong> and adheres to eco-friendly green cracker guidelines, ensuring a vibrant yet safe family celebration with low cost fireworks from the best crackers shop in Sivakasi.
                        </p>

                        {/* SEO highlights grid */}
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            <div className="bg-[#121212] border border-[#D4AF37]/15 p-4 rounded-xl">
                                <h4 className="text-amber-200 font-bold text-sm mb-1">Direct from Sivakasi</h4>
                                <p className="text-gray-400 text-xs font-light">Bypass middle-men and get direct factory prices on premium Diwali crackers.</p>
                            </div>
                            <div className="bg-[#121212] border border-[#D4AF37]/15 p-4 rounded-xl">
                                <h4 className="text-amber-200 font-bold text-sm mb-1">Eco-Safe Green Crackers</h4>
                                <p className="text-gray-400 text-xs font-light">Certified eco-friendly formulas with reduced emissions and smoke.</p>
                            </div>
                            <div className="bg-[#121212] border border-[#D4AF37]/15 p-4 rounded-xl">
                                <h4 className="text-amber-200 font-bold text-sm mb-1">All-India Quick Shipping</h4>
                                <p className="text-gray-400 text-xs font-light">Reliable door-delivery with secure dispatch protocols direct from Sivakasi.</p>
                            </div>
                            <div className="bg-[#121212] border border-[#D4AF37]/15 p-4 rounded-xl">
                                <h4 className="text-amber-200 font-bold text-sm mb-1">100% Certified Safety</h4>
                                <p className="text-gray-400 text-xs font-light">Strictly quality-tested and BIS-approved products for secure handling.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                className="cursor-pointer bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] hover:brightness-110 text-black font-semibold rounded-md py-3 px-6 text-sm transition shadow-lg shadow-amber-500/5"
                                onClick={() => router.push('/quick-purchase')}
                            >
                                Order Online Now
                            </button>
                            <a
                                href="/mickey-crackers-price-list.pdf"
                                className="border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 text-[#D4AF37] font-semibold rounded-md py-3 px-6 text-sm transition flex items-center"
                                target="_blank"
                                download
                            >
                                Download Price List
                            </a>
                        </div>
                    </div>
                </section>



                {/* Why Choose Us */}
                <section className="py-20 px-6 max-w-6xl mx-auto text-center">
                    <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#D4AF37] mb-3 block uppercase">
                        Our Guarantee
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-white tracking-tight uppercase">
                        Why Choose Mickey Crackers?
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto mb-16 text-sm font-light leading-relaxed">
                        We prioritize safety, factory-direct pricing, and secure packing to deliver absolute satisfaction with every single celebration.
                    </p>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "BIS-Certified Safety",
                                desc: "100% safe, government-approved green crackers for worry-free family celebrations.",
                                icon: FiShield,
                                color: "text-blue-500"
                            },
                            {
                                title: "Direct Sivakasi Pricing",
                                desc: "Get premium quality fireworks at direct factory wholesale prices, bypassing middlemen.",
                                icon: FiTag,
                                color: "text-amber-500"
                            },
                            {
                                title: "Weatherproof Packaging",
                                desc: "Packed securely in moisture-resistant and tamper-proof boxes for maximum safety.",
                                icon: FiBox,
                                color: "text-purple-500"
                            },
                            {
                                title: "Reliable Express Delivery",
                                desc: "Timely dispatch and safe door-delivery across India with trusted cargo partners.",
                                icon: FiTruck,
                                color: "text-emerald-500"
                            }
                        ].map((f) => {
                            const IconComponent = f.icon;
                            return (
                                <div
                                    key={f.title}
                                    className="group relative bg-[#121212]/50 backdrop-blur-sm border border-neutral-900 hover:border-[#D4AF37]/30 p-8 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center overflow-hidden"
                                >
                                    {/* Ambient hover glow inside the card */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/0 via-transparent to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className={`p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80 mb-6 transition-all duration-300 group-hover:border-[#D4AF37]/30 group-hover:bg-[#121212] group-hover:shadow-2xl ${f.color}`}>
                                        <IconComponent size={28} className="transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                    <h3 className="text-lg font-bold text-amber-100 mb-3 tracking-wide">
                                        {f.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed font-light">{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Sparkling Divider */}
                <div className="flex justify-center my-4 overflow-hidden select-none rounded-[20%]">
                    <img className="max-w-[80%] rounded-xl" loading="lazy" src={bottomGif.src || bottomGif} alt="Gold sparkle divider" />
                </div>

                <FAQSection />
            </main>

            <Footer />
        </div>
    );
}
