import React from "react";

export default function FAQSection() {
  const faqs = [
    {
      q: "Why should I buy from Mickey Crackers - the best online crackers website?",
      a: "Mickey Crackers is widely recognized as the best online crackers website and wholesale vedi kadai shop, offering 100% genuine, BIS-certified Sivakasi fireworks at direct factory low cost prices with secure, on-time delivery across India."
    },
    {
      q: "Do you provide home delivery from your Sivakasi vedi kadai?",
      a: "Yes! We deliver Sivakasi crackers directly from our vedi kadai to your doorstep anywhere in India. We ensure secure, weatherproof packaging to prevent any transit damage."
    },
    {
      q: "Are your crackers safe and certified?",
      a: "Absolutely! All our products are BIS-certified and manufactured under strict quality standards to ensure safe celebrations for families and kids."
    },
    {
      q: "Do you offer discounts on bulk orders at your crackers shop?",
      a: "Yes, we provide the lowest cost crackers for bulk and wholesale purchases. As a leading online vedi kadai, we offer customized pricing for Diwali, weddings, temple events, and corporate celebrations."
    },
    {
      q: "How can I place an order with Mickey Crackers?",
      a: "You can place your order easily through our online crackers website, or contact our sales team via phone or WhatsApp. We will help you select the best fireworks and guide you through the delivery options."
    }
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-white mb-4 text-center">
        Frequently Asked <span className="bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent">Questions</span>
      </h2>
      <p className="text-gray-400 text-center text-sm font-light mb-12">
        Find answers to common questions about our products, ordering process, and shipping services.
      </p>
      
      <div className="space-y-5">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="bg-[#121212] border border-neutral-900 hover:border-[#D4AF37]/20 rounded-xl shadow-lg p-6 transition duration-300"
          >
            <h3 className="text-lg font-semibold text-amber-100 mb-2">
              {item.q}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">{item.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
