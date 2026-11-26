import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";

export const metadata = {
  title: "Terms of Service | NextStore",
  description: "Terms and conditions governing the use of NextStore and order processing.",
};

export default function TermsOfServicePage() {
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
          text="Terms of Service"
          className="mt-2 text-3xl sm:text-4xl font-black text-neutral-900 font-sans tracking-tight"
        />
        <p className="mt-2 text-xs text-neutral-400">Last updated: November 2026</p>
      </StaggerGroup>

      <StaggerGroup step={90} delay={150} className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-6 text-neutral-700">
        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">1. Storefront Terms</h2>
          <p>
            By accessing or purchasing from NextStore, you agree to comply with and be bound by these Terms of Service. These terms apply to all users of the site, including browsers, customers, and merchants.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">2. Product Information &amp; Pricing</h2>
          <p>
            We endeavor to display accurate product titles, color representations, sizes, and pricing. Prices for products are stated in Bangladeshi Taka (BDT) and are subject to change without notice in accordance with official manufacturer guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">3. Orders &amp; Contract Acceptance</h2>
          <p>
            An order placed through Shopify Checkout constitutes an offer to purchase. We reserve the right to cancel or refuse any order in the event of catalog errors or inventory discrepancies, in which case any charged funds will be promptly refunded.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">4. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements shall be governed by and construed in accordance with the applicable laws of Bangladesh.
          </p>
        </section>
      </StaggerGroup>
    </div>
    </PageTransition>
  );
}
