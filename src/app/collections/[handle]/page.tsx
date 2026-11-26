import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCollection } from "@/lib/shopify/collections";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ImageReveal } from "@/components/motion/ImageReveal";

export const instant = false;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const { collection } = await getCollection(handle);

  if (!collection) {
    return { title: "Collection Not Found | KINETIC // STUDIO" };
  }

  return {
    title: `${collection.title} | KINETIC // STUDIO`,
    description:
      collection.description ||
      `Explore the ${collection.title} collection with genuine products and official pricing.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const { collection, products } = await getCollection(handle);

  if (!collection) {
    notFound();
  }

  return (
    <PageTransition>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumbs */}
      <Reveal trigger="mount" y={8}>
      <nav
        aria-label="Breadcrumbs"
        className="flex items-center space-x-2 text-xs text-gray-500 mb-8"
      >
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <Link href="/products" className="hover:text-black transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
        <span className="text-gray-900 font-medium">{collection.title}</span>
      </nav>
      </Reveal>

      {/* Collection Hero */}
      <Reveal trigger="mount" delay={60} y={20} className="mb-12 bg-[#F7F7F5] rounded-3xl p-8 sm:p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Collection
          </span>
          <SplitText
            as="h1"
            trigger="mount"
            delay={200}
            text={collection.title}
            className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-sans tracking-tight mt-1"
          />
          {collection.description && (
            <Reveal trigger="mount" delay={450} y={12}>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {collection.description}
              </p>
            </Reveal>
          )}
          <Reveal trigger="mount" delay={550} y={12}>
            <p className="mt-4 text-xs font-semibold text-gray-500">
              {products.length} products available
            </p>
          </Reveal>
        </div>

        {collection.image && (
          <ImageReveal
            trigger="mount"
            direction="expand"
            delay={250}
            className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl bg-white shadow-sm shrink-0 group"
          >
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-106"
            />
          </ImageReveal>
        )}
      </Reveal>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductGrid products={products} priorityCount={4} />
      </Suspense>
    </div>
    </PageTransition>
  );
}
