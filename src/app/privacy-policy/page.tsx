import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export const metadata = {
  title: "Privacy Policy | KINETIC // STUDIO",
  description: "How we collect, protect, and handle your data through our Shopify headless storefront.",
};

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <StaggerGroup trigger="mount" step={120} className="mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          Legal
        </span>
        <SplitText
          as="h1"
          trigger="mount"
          delay={100}
          text="Privacy Policy"
          className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight"
        />
        <p className="mt-2 text-xs text-neutral-400">Last updated: November 2026</p>
      </StaggerGroup>

      <StaggerGroup step={90} delay={150} className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-6 text-neutral-700">
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Data Collection &amp; Purpose</h2>
          <p>
            When you browse KINETIC // STUDIO, anonymous analytics may be collected to improve site speed and usability. When you place an order, your personal and shipping information is captured directly and processed securely through official Shopify Checkout.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Payment Security</h2>
          <p>
            We do not store, process, or view credit card numbers, mobile wallet PINs, or raw financial data on our Next.js servers. All transactions are handled by Shopify Level 1 PCI-DSS certified payment gateways.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Cookies &amp; Local Storage</h2>
          <p>
            We utilize secure HTTP-only cookies strictly for retaining your active shopping cart ID across browser sessions. We do not sell your personal information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Your Rights</h2>
          <p>
            You have the right to request access to or deletion of any personal data stored in relation to your past orders by contacting <code>privacy@nextstore.com.bd</code>.
          </p>
        </section>
      </StaggerGroup>
    </div>
    </PageTransition>
  );
}
