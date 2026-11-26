import { Suspense } from "react";
import { Search as SearchIcon } from "lucide-react";
import { searchProducts } from "@/lib/shopify/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";

export const metadata = {
  title: "Search Catalog | KINETIC // STUDIO",
  description: "Search for shoes, sandals, bags, and accessories in our official catalog.",
};

export const instant = false;

type Props = {
  searchParams: Promise<{ q?: string }>;
};

async function SearchResults({ query }: { query: string }) {
  if (!query.trim()) {
    return (
      <div className="py-20 text-center">
        <p className="text-base font-semibold text-gray-900">
          Enter a search term above to explore our footwear catalog.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Suggestions: &ldquo;bata&rdquo;, &ldquo;school&rdquo;, &ldquo;sandals&rdquo;, &ldquo;men&rdquo;, &ldquo;loafer&rdquo;
        </p>
      </div>
    );
  }

  const { products, totalCount } = await searchProducts({
    query: query.trim(),
    first: 24,
  });

  return (
    <div>
      <div className="mb-8 pb-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found <span className="font-bold text-gray-900">{totalCount}</span>{" "}
          results for &ldquo;<span className="font-semibold text-black">{query}</span>&rdquo;
        </p>
      </div>

      <ProductGrid products={products} priorityCount={4} />
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-black text-gray-900 font-sans tracking-tight">
          Search Storefront
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Find your preferred shoe size, brand, or collection.
        </p>

        {/* Search input form */}
        <form
          action="/search"
          method="GET"
          className="mt-6 relative flex items-center max-w-xl mx-auto"
        >
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by keywords..."
            className="w-full pl-12 pr-28 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black focus:bg-white transition-all shadow-xs"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 bg-black text-white text-xs font-bold uppercase rounded-full hover:bg-neutral-800 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <SearchResults query={q} />
      </Suspense>
    </div>
  );
}
