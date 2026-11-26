import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  getProduct,
  getProductRecommendations,
} from "@/lib/shopify/products";
import { ProductDetails } from "@/components/product/ProductInfo";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeader } from "@/components/home/SectionHeader";

export const instant = false;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    return {
      title: "Product Not Found | KINETIC // STUDIO",
    };
  }

  const primaryImage = product.featuredImage || product.images?.nodes[0];

  return {
    title: `${product.title} | KINETIC // STUDIO`,
    description:
      product.description?.slice(0, 160) ||
      `Buy authentic ${product.title} with fast shipping and official warranty.`,
    openGraph: {
      title: `${product.title} | KINETIC // STUDIO`,
      description: product.description?.slice(0, 160),
      images: primaryImage ? [{ url: primaryImage.url }] : [],
    },
  };
}

async function RelatedProducts({ productId }: { productId: string }) {
  const related = await getProductRecommendations(productId);

  if (related.length === 0) return null;

  return (
    <div className="mt-20 pt-16 border-t border-gray-100">
      <SectionHeader
        eyebrow="Complete Your Style"
        title="Recommended for You"
        className="mb-8"
      />
      <ProductGrid products={related.slice(0, 4)} priorityCount={0} />
    </div>
  );
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const price = product.priceRange.minVariantPrice;
  const primaryImage = product.featuredImage || product.images?.nodes[0];

  // Schema.org Product Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: primaryImage?.url,
    brand: {
      "@type": "Brand",
      name: product.vendor || "NextStore",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: price.currencyCode,
      price: price.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <PageTransition>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <Reveal trigger="mount" y={8}>
      <nav
        aria-label="Breadcrumbs"
        className="flex items-center space-x-2 text-xs text-gray-500 mb-8 overflow-x-auto no-scrollbar"
      >
        <Link href="/" className="hover:text-black transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        <Link href="/products" className="hover:text-black transition-colors">
          Footwear
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
          {product.title}
        </span>
      </nav>
      </Reveal>

      {/* Product Details Section */}
      <ProductDetails product={product} />

      {/* Related Products */}
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <RelatedProducts productId={product.id} />
      </Suspense>
    </div>
    </PageTransition>
  );
}
