export const metadata = {
  title: "Frequently Asked Questions | NextStore",
  description:
    "Common questions regarding orders, payment via Shopify, sizing, delivery timelines, and returns.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "Are all products 100% authentic?",
      a: "Yes. All products listed on NextStore are genuine, brand-authorized inventory from official distributors and heritage brands including Bata, Hush Puppies, and Bubblegummers.",
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Support Center
        </span>
        <h1 className="mt-2 text-3xl sm:text-5xl font-black text-neutral-900 font-sans tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-sm text-neutral-500 max-w-xl mx-auto">
          Everything you need to know about shopping, orders, delivery, and authenticity.
        </p>
      </div>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="p-6 sm:p-8 rounded-2xl bg-[#F7F7F5] border border-neutral-100"
          >
            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
              {faq.q}
            </h3>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed whitespace-pre-line">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
