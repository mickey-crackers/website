"use client";
import React, { useState, useEffect } from "react";
import bannerOne from '../assets/bannerOne.png';
import bannerTwo from '../assets/bannerTwo.png';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const slides = [
        { image: bannerOne.src || bannerOne },
        { image: bannerTwo.src || bannerTwo }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrent((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative w-full border-b border-[#D4AF37]/20 overflow-hidden bg-black select-none">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`${index === 0 ? 'relative' : 'absolute inset-0'} w-full transition-opacity duration-500 ease-in-out ${
                        index === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                >
                    <img 
                        src={slide.image} 
                        className="w-full h-auto block object-cover" 
                        alt={`Banner ${index + 1}`} 
                    />
                </div>
            ))}

            {/* Left and Right Navigation Chevrons */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#D4AF37] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition duration-300 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer flex items-center justify-center"
                aria-label="Previous Slide"
            >
                <FaChevronLeft className="text-xs md:text-sm" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 rounded-full bg-black/40 hover:bg-black/70 text-[#D4AF37] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition duration-300 opacity-80 hover:opacity-100 hover:scale-105 cursor-pointer flex items-center justify-center"
                aria-label="Next Slide"
            >
                <FaChevronRight className="text-xs md:text-sm" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            index === current 
                                ? "bg-[#D4AF37] w-6 shadow shadow-amber-500" 
                                : "bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
