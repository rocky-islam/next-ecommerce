"use client";

import { useState } from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { AccordionItem } from "@/components/motion/Accordion";

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
    <PageTransition>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <StaggerGroup trigger="mount" step={120} className="text-center mb-16">
        <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-mono">
          CLIENT CONCIERGE
        </span>
        <SplitText
          as="h1"
          trigger="mount"
          delay={100}
          text="Frequently Asked Questions"
          className="mt-2 text-3xl sm:text-5xl font-black text-neutral-900 font-sans tracking-tight uppercase"
        />
        <p className="mt-4 text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto leading-relaxed font-light">
          Everything you need to know regarding authentication, 64-district delivery timelines, and our 7-day exchange protocol.
        </p>
      </StaggerGroup>

      <StaggerGroup trigger="mount" delay={350} step={70} className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <AccordionItem
              key={faq.q}
              title={faq.q}
              isOpen={isOpen}
              onToggle={() => toggleFAQ(index)}
              className={`rounded-2xl border overflow-hidden transition-[background-color,border-color,box-shadow] duration-500 ${
                isOpen
                  ? "bg-white border-neutral-300 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.35)]"
                  : "bg-[#FBFBFA] border-neutral-200/80 hover:border-neutral-300"
              }`}
              buttonClassName="p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900"
              iconClassName={`w-7 h-7 rounded-full transition-colors duration-500 ${
                isOpen ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-400 group-hover:text-neutral-900"
              }`}
              panelClassName="px-6 pb-6 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed whitespace-pre-line border-t border-neutral-100/60"
            >
              {faq.a}
            </AccordionItem>
          );
        })}
      </StaggerGroup>
    </div>
    </PageTransition>
  );
}
