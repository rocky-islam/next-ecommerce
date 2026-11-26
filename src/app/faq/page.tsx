"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Are all products 100% authentic?",
      a: "Yes. All products listed on KINETIC // STUDIO are genuine, brand-authorized inventory from official distributors and heritage brands including Bata, Hush Puppies, Power, and Bubblegummers.",
    },
    {
      q: "How does checkout and payment work?",
      a: "When you proceed to checkout, you are redirected to official Shopify-hosted Checkout. Shopify securely manages all billing information, shipping destination validation, applicable tax computations, and local payment methods with Level 1 PCI-DSS encryption.",
    },
    {
      q: "What are the shipping charges and delivery timeframes?",
      a: "Inside Dhaka: Delivery typically takes 2–3 business days. Delivery is free on orders above ৳2,500.\nOutside Dhaka: Delivery takes 3–5 business days across all 64 districts of Bangladesh with tracked courier partners.",
    },
    {
      q: "Can I exchange an item if the size doesn't fit?",
      a: "Yes. We offer an easy 7-day size exchange guarantee. The footwear must be unused, unwashed, in its original box, and with original brand tags attached.",
    },
    {
      q: "How can I track my order?",
      a: "As soon as your order is confirmed through Shopify, you will receive an email and SMS with your order confirmation and tracking number to monitor your parcel in real-time.",
    },
    {
      q: "What currencies are accepted?",
      a: "All storefront prices and transactions are processed in Bangladeshi Taka (BDT / ৳).",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="text-center mb-16"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-mono">
          CLIENT CONCIERGE
        </span>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black text-neutral-900 font-sans tracking-tight uppercase">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed font-light">
          Everything you need to know regarding authentication, 64-district delivery timelines, and our 7-day exchange protocol.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl bg-[#FBFBFA] border border-neutral-200/80 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 cursor-pointer"
              >
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-neutral-400"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line border-t border-neutral-100/60"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
