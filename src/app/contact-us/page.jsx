import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const metadata = {
    title: 'Contact Us | Mickey Crackers Sivakasi - Best Crackers Shop',
    description: 'Get in touch with Mickey Crackers Sivakasi (your best online crackers website) for bulk orders, low cost factory direct pricing, and parcel delivery support.',
    keywords: [
        'Mickey Crackers contact number',
        'Sivakasi crackers shop contact',
        'bulk crackers order support',
        'fireworks store phone number',
        'Mickey Crackers Sivakasi address',
        'best crackers shop contact details',
        'sivakasi vedi kadai phone number',
        'online crackers website support'
    ],
    openGraph: {
        title: 'Contact Us | Mickey Crackers Sivakasi - Best Crackers Shop',
        description: 'Get in touch with Mickey Crackers Sivakasi for bulk orders, wholesale pricing, and parcel delivery details.',
        url: 'https://mickeycrackers.com/contact-us',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Contact Mickey Crackers Sivakasi',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Contact Us | Mickey Crackers Sivakasi - Best Crackers Shop',
        description: 'Get in touch with Mickey Crackers Sivakasi for bulk orders, wholesale pricing, and parcel delivery details.',
        images: ['/og-image.png'],
    }
};

export default function ContactUs() {
    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white">
            <Header />
            <div className="flex flex-col items-center py-20 bg-gradient-to-b from-[#161616] via-[#0d0d0d] to-[#0a0a0a] border-b border-[#D4AF37]/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.05)_0%,_transparent_60%)] pointer-events-none" />
                <h1 className="text-4xl font-extrabold text-white tracking-tight uppercase">Contact <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Us</span></h1>
                <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-mono">Get in Touch</p>
            </div>

            <section
                id="contact-us"
                className="bg-[#0a0a0a] py-16 px-6 max-w-7xl mx-auto"
            >
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="bg-[#121212] border border-neutral-900 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/30 w-full overflow-hidden">
                        <h2 className="text-2xl font-bold mb-4 text-[#D4AF37] tracking-wide uppercase border-b border-[#D4AF37]/15 pb-3">
                            Contact Mickey Crackers
                        </h2>
                        <p className="text-neutral-300 mb-8 font-light leading-relaxed">
                            Have questions about orders, wholesale pricing, or deliveries? Reach
                            out to <strong className="text-amber-100 font-medium">Mickey Crackers Sivakasi</strong> – we’re here to help
                            you with Diwali, wedding, and festive fireworks bookings.
                        </p>

                        <div className="space-y-6 text-sm font-light text-neutral-300">
                            <div>
                                <h3 className="text-[#D4AF37] font-semibold text-md mb-2 uppercase tracking-wider">Address</h3>
                                <p className="leading-relaxed">
                                    D Amman Township, Southside school &
                                    <br />
                                    Government college opposite, Chenakaman Patti,
                                    <br />
                                    Sivakasi, Tamil Nadu – 626189
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] font-semibold text-md mb-2 uppercase tracking-wider">Phone & WhatsApp</h3>
                                <p className="space-y-1">
                                    <a
                                        href="tel:+919025399060"
                                        className="text-amber-100 hover:text-[#D4AF37] transition font-medium block"
                                    >
                                        +91-9025399060
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] font-semibold text-md mb-2 uppercase tracking-wider">Email</h3>
                                <p>
                                    <a
                                        href="mailto:mickeycrackers2026@gmail.com"
                                        className="text-amber-100 hover:text-[#D4AF37] transition font-medium block break-all text-xs sm:text-sm"
                                    >
                                        mickeycrackers2026@gmail.com
                                    </a>
                                </p>
                            </div>

                            <div>
                                <h3 className="text-[#D4AF37] font-semibold text-md mb-2 uppercase tracking-wider">Business Hours</h3>
                                <p>Mon – Sun : 9:00 AM – 8:00 PM</p>
                            </div>
                        </div>

                        <script type="application/ld+json" dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "LocalBusiness",
                                "name": "Mickey Crackers",
                                "image": "https://mickeycrackers.com/og-image.png",
                                "url": "https://mickeycrackers.com/contact",
                                "telephone": "+919025399060",
                                "email": "mickeycrackers2026@gmail.com",
                                "address": {
                                    "@type": "PostalAddress",
                                    "streetAddress": "D Amman Township, Southside school & Government college opposite, Chenakaman Patti",
                                    "addressLocality": "Sivakasi",
                                    "addressRegion": "TN",
                                    "postalCode": "626189",
                                    "addressCountry": "IN"
                                },
                                "openingHours": "Mo-Su 09:00-20:00",
                                "priceRange": "₹₹",
                                "sameAs": [
                                    "https://www.instagram.com/mickey_crackers"
                                ]
                            })
                        }} />
                    </div>

                    <div className="space-y-8 flex flex-col justify-center">
                        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/35 shadow-black/85">
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d705.997686613738!2d77.87825267769367!3d9.407238237459941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b06cb3dd9327473%3A0xd7f64ab5f4db4da2!2sMickey%20Crackers!5e1!3m2!1sen!2sin!4v1786547454539!5m2!1sen!2sin" width="100%" height="100%" className="w-full h-full border-0" allowFullScreen="" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
