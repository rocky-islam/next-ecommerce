import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export const metadata = {
  title: "Returns & Exchanges Policy | NextStore",
  description: "Learn about our 7-day hassle-free return and size exchange policy.",
};

export default function ReturnPolicyPage() {
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
          text="Returns & Exchange Policy"
          className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight"
        />
        <p className="mt-2 text-xs text-neutral-400">Last updated: November 2026</p>
      </StaggerGroup>

      <StaggerGroup step={90} delay={150} className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-6 text-neutral-700">
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">1. 7-Day Exchange Window</h2>
          <p>
            If you receive footwear that does not fit comfortably or wish to exchange for another available size or style, you may request an exchange within 7 days of receiving the parcel.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Eligibility Conditions</h2>
          <p>
            To qualify for an exchange or return:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>The shoes must be unworn outdoors and free from scuffs, creases, or stains.</li>
            <li>All original tags, promotional inserts, and packaging must remain attached and undamaged.</li>
            <li>Proof of purchase (Shopify order confirmation email/SMS) must be provided.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">3. How to Initiate an Exchange</h2>
          <p>
            Contact our Customer Care team via our <a href="/contact" className="underline underline-offset-2 decoration-neutral-300 hover:decoration-black transition-colors font-medium text-black">Contact Page</a> or email <code>support@nextstore.com.bd</code> with your order ID and the desired replacement size. We will arrange reverse logistics pickup or drop-off instructions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Damaged or Defective Goods</h2>
          <p>
            In the rare event that an item arrives damaged or has a manufacturing defect, please report it within 48 hours of delivery with photographic evidence for an expedited replacement at no extra charge.
          </p>
        </section>
      </StaggerGroup>
    </div>
    </PageTransition>
  );
}
