import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/shopify/products";
import { ProductSortKey } from "@/lib/shopify/types";
import { ProductFilters } from "@/components/product/ProductFilters";
import { ProductGrid } from "@/components/product/ProductGrid";
import { DensityProductGrid } from "@/components/product/GridDensity";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

export const metadata = {
  title: "Full Directory | KINETIC // STUDIO",
  description:
    "Explore our complete footwear directory. Formal dress shoes, athletic sneakers, sandals, slip-ons, and youth school essentials with official BDT pricing.",
};

export const instant = false;

type SearchParams = Promise<{
  query?: string;
  vendor?: string;
  type?: string;
  tag?: string;
  sort?: string;
  after?: string;
}>;

function mapSortParam(sort?: string): {
  sortKey: ProductSortKey;
  reverse: boolean;
} {
  switch (sort) {
    case "newest":
      return { sortKey: "CREATED_AT", reverse: true };
    case "price_asc":
      return { sortKey: "PRICE", reverse: false };
    case "price_desc":
      return { sortKey: "PRICE", reverse: true };
    case "title_asc":
      return { sortKey: "TITLE", reverse: false };
    case "best_selling":
    default:
      return { sortKey: "BEST_SELLING", reverse: false };
  }
}

async function ProductsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const currentQuery = params.query || "";
  const currentVendor = params.vendor || "";
  const currentType = params.type || "";
  const currentTag = params.tag || "";
  const currentSort = params.sort || "best_selling";
  const afterCursor = params.after;

  const { sortKey, reverse } = mapSortParam(currentSort);

  // Construct Shopify Storefront API query filter
  const queryParts: string[] = [];
  if (currentQuery) queryParts.push(currentQuery);
  if (currentVendor) queryParts.push(`vendor:"${currentVendor}"`);
  if (currentType) queryParts.push(`product_type:"${currentType}"`);
  if (currentTag) queryParts.push(`tag:"${currentTag}"`);

  const queryFilter = queryParts.length > 0 ? queryParts.join(" ") : undefined;

  const { products, pageInfo } = await getProducts({
    first: 24,
    after: afterCursor,
    sortKey,
    reverse,
    query: queryFilter,
  });

  // Calculate active title for heading
  const activeTitle =
    currentVendor ||
    currentType ||
    currentTag ||
    (currentQuery ? `"${currentQuery}"` : "All Silhouettes");

  return (
    <div>
      <div className="mb-8">
        <Reveal trigger="mount" y={10}>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2 font-mono">
            DIRECTORY // CATALOG
          </p>
        </Reveal>
        {/* Keyed so the headline re-reveals whenever the filter changes */}
        <SplitText
          key={activeTitle}
          as="h1"
          trigger="mount"
          delay={80}
          text={activeTitle}
          className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 font-sans uppercase"
        />
      </div>

      <ProductFilters
        totalCount={products.length}
        currentSort={currentSort}
        currentQuery={currentQuery}
        currentVendor={currentVendor}
        currentType={currentType}
        currentTag={currentTag}
      />

      {products.length > 0 ? (
        <DensityProductGrid products={products} priorityCount={8} />
      ) : (
        <ProductGrid products={products} />
      )}

      {/* Pagination */}
      {pageInfo.hasNextPage && pageInfo.endCursor && (
        <Reveal className="mt-16 flex items-center justify-center gap-4 pt-10 border-t border-neutral-200/70">
          <Magnetic>
          <Link
            href={`/products?${new URLSearchParams({
              ...(currentQuery ? { query: currentQuery } : {}),
              ...(currentVendor ? { vendor: currentVendor } : {}),
              ...(currentType ? { type: currentType } : {}),
              ...(currentTag ? { tag: currentTag } : {}),
              sort: currentSort,
              after: pageInfo.endCursor,
            }).toString()}`}
            className="group btn-shine px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors shadow-md inline-flex items-center gap-2"
          >
            <RollText>Load Next Page</RollText>
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          </Magnetic>
        </Reveal>
      )}
    </div>
  );
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <Suspense fallback={<ProductGridSkeleton count={12} />}>
          <ProductsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </PageTransition>
  );
}
