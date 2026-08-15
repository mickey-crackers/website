import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#080808] border-t border-[#D4AF37]/20 text-neutral-300 pt-12 pb-6 px-6">
            <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-4">
                {/* Brand Info */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-[#D4AF37] tracking-wider uppercase">Mickey Crackers</h2>
                    <p className="text-neutral-400 leading-relaxed text-sm">
                        Mickey Crackers in <strong className="text-amber-100 font-medium">Sivakasi</strong> offers BIS/ISI certified
                        fireworks at wholesale and retail prices. Shop online for Diwali,
                        weddings, birthdays, and festive events with safe packaging and
                        doorstep delivery.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg text-[#D4AF37] font-semibold mb-4 tracking-wide">Quick Links</h3>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                        <li><Link href="/" className="hover:text-[#D4AF37] transition">Home</Link></li>
                        <li><Link href="/quick-purchase" className="hover:text-[#D4AF37] transition">Quick Purchase</Link></li>
                        <li><Link href="/track-order" className="hover:text-[#D4AF37] transition">Track Order</Link></li>
                        <li><Link href="/payment-info" className="hover:text-[#D4AF37] transition">Payment Info</Link></li>
                        <li><Link href="/contact-us" className="hover:text-[#D4AF37] transition">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg text-[#D4AF37] font-semibold mb-4 tracking-wide">Contact</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        D Amman Township, Southside school &
                        <br />
                        Government college opposite, Chenakaman Patti,
                        <br />
                        Sivakasi, Tamil Nadu – 626189
                    </p>
                    <p className="mt-3 text-sm">
                        Phone:{" "}
                        <a href="tel:+919025399060" className="text-amber-100 hover:text-[#D4AF37] transition font-medium">
                            +91-9025399060
                        </a>
                    </p>
                    <p className="text-sm">
                        Email:{" "}
                        <a href="mailto:mickeycrackers2026@gmail.com" className="text-amber-100 hover:text-[#D4AF37] transition font-medium">
                            mickeycrackers2026@gmail.com
                        </a>
                    </p>
                    <p className="mt-2 text-xs text-neutral-500">Open: Mon–Sun, 9 AM – 8 PM</p>
                </div>

                {/* Service Areas */}
                <div>
                    <h3 className="text-lg text-[#D4AF37] font-semibold mb-4 tracking-wide">We Deliver In</h3>
                    <ul className="space-y-2 text-neutral-400 text-sm">
                        <li>Tamil Nadu</li>
                        <li>Kerala</li>
                        <li>Karnataka</li>
                        <li>Andhra Pradesh</li>
                        <li>Puducherry</li>
                        <li>and All over India.</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-10 border-t border-neutral-900 pt-4 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500">
                <p className="text-center" >
                    © {new Date().getFullYear()} Mickey Crackers, Sivakasi. All Rights
                    Reserved.
                </p>
                <p className="mt-2 md:mt-0">
                    Crafted with ❤️ by <span className="text-[#D4AF37] font-semibold">AYTHA</span>
                </p>
            </div>
        </footer>
    );
}
