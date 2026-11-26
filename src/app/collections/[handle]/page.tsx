import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getCollection } from "@/lib/shopify/collections";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Breadcrumbs */}
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

      {/* Collection Hero */}
      <div className="mb-12 bg-[#F7F7F5] rounded-3xl p-8 sm:p-12 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Collection
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 font-sans tracking-tight mt-1">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              {collection.description}
            </p>
          )}
          <p className="mt-4 text-xs font-semibold text-gray-500">
            {products.length} products available
          </p>
        </div>

        {collection.image && (
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl overflow-hidden bg-white shadow-sm shrink-0">
            <Image
              src={collection.image.url}
              alt={collection.image.altText || collection.title}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ProductGrid products={products} priorityCount={4} />
      </Suspense>
    </div>
  );
}
