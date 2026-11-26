import { Suspense } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProducts, getNewArrivals } from "@/lib/shopify/products";
import { HeroBanner } from "@/components/home/HeroBanner";
import { MarqueeBanner } from "@/components/home/MarqueeBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandShowcase } from "@/components/home/BrandShowcase";
import { EditorialBanner } from "@/components/home/EditorialBanner";
import { CampaignBanner } from "@/components/home/CampaignBanner";
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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">
              CURATED FAVORITES
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 font-sans uppercase">
              Essential Footwear
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>View All Styles</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">
              LATEST RELEASES
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 font-sans uppercase">
              New Additions
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Browse New Drops</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={products} priorityCount={4} />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
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

      {/* High-Impact Campaign Banner */}
      <CampaignBanner />
    </div>
  );
}
