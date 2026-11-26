import { Suspense } from "react";
import { getFeaturedProducts, getNewArrivals } from "@/lib/shopify/products";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MarqueeBanner } from "@/components/home/MarqueeBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { CampaignBanner } from "@/components/home/CampaignBanner";
import { BrandMarquee } from "@/components/home/BrandMarquee";
import { ManifestoSection } from "@/components/home/ManifestoSection";
import { SectionHeader } from "@/components/home/SectionHeader";
import { PageTransition } from "@/components/motion/PageTransition";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";

export const metadata = {
  title: "KINETIC // STUDIO | Official Curated Footwear & Leather",
  description:
    "Official digital flagship for Power, Hush Puppies, North Star, Bubblegummers, Comfit, and Bata. Architectural craftsmanship, transparent BDT pricing, and express nationwide delivery in Bangladesh.",
};

async function FeaturedProductsSection() {
  const products = await getFeaturedProducts(8);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CURATED FAVORITES"
          title="Essential Footwear"
          href="/products"
          linkLabel="View All Styles"
        />

        <ProductGrid products={products} priorityCount={4} />
      </div>
    </section>
  );
}

async function NewArrivalsSection() {
  const products = await getNewArrivals(8);

  return (
    <section className="py-20 sm:py-28 bg-[#FBFBFA] border-t border-neutral-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="LATEST RELEASES"
          title="New Additions"
          href="/products?sort=newest"
          linkLabel="Browse New Drops"
        />

        {/* morph off: these products can repeat from Featured, and view-transition names must be unique */}
        <ProductGrid products={products} priorityCount={0} morph={false} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <PageTransition>
    <div className="flex flex-col min-h-screen">
      {/* Editorial Hero */}
      <HeroBanner />

      {/* Ticker Marquee Ribbon */}
      <MarqueeBanner />

      {/* Visual Category Lookbook Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <Suspense
        fallback={
          <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-neutral-100 rounded mb-8 animate-pulse" />
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        <FeaturedProductsSection />
      </Suspense>

      {/* Scroll-lit manifesto + count-up proof points */}
      <ManifestoSection />

      {/* Brand Archive Showcase */}
      <BrandShowcase />

      {/* Editorial Craftsmanship Manifesto */}
      <EditorialBanner />

      {/* New Arrivals */}
      <Suspense
        fallback={
          <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 bg-neutral-100 rounded mb-8 animate-pulse" />
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        <NewArrivalsSection />
      </Suspense>

      {/* Oversized brand type band */}
      <BrandMarquee />

      {/* High-Impact Campaign Banner */}
      <CampaignBanner />
    </div>
    </PageTransition>
  );
}
