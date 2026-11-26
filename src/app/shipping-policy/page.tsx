import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export const metadata = {
  title: "Shipping & Delivery Policy | NextStore",
  description: "Nationwide delivery timelines, shipping charges, and order fulfillment policies.",
};

export default function ShippingPolicyPage() {
  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <StaggerGroup trigger="mount" step={120} className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Policies
        </span>
        <SplitText
          as="h1"
          trigger="mount"
          delay={100}
          text="Shipping & Delivery Policy"
          className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight"
        />
        <p className="mt-2 text-xs text-neutral-400">Last updated: November 2026</p>
      </StaggerGroup>

      <StaggerGroup step={90} delay={150} className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-6 text-neutral-700">
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Delivery Zones &amp; Timelines</h2>
          <p>
            We deliver to all 64 districts in Bangladesh through trusted courier networks.
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Dhaka Metropolitan Area:</strong> 2–3 business days after order confirmation.</li>
            <li><strong>Outside Dhaka (Divisional Cities &amp; Districts):</strong> 3–5 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Shipping Rates</h2>
          <p>
            Shipping rates are calculated dynamically at checkout based on your delivery address and total cart weight. We offer complimentary shipping on all orders totaling ৳2,500 or higher.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Order Tracking</h2>
          <p>
            Once your order is processed and handed to our logistics partner, a tracking link and consignment ID will be sent to the phone number and email address specified in your Shopify checkout.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Packaging &amp; Inspection</h2>
          <p>
            All footwear is shipped in its official protective brand box inside tamper-evident parcel packaging. Customers are encouraged to verify external packaging integrity upon delivery.
          </p>
        </section>
      </StaggerGroup>
    </div>
    </PageTransition>
  );
}
