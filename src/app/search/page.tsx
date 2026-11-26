import { Suspense } from "react";
import { Search as SearchIcon } from "lucide-react";
import { searchProducts } from "@/lib/shopify/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

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
      <Reveal trigger="mount" delay={300} className="py-20 text-center">
        <p className="text-base font-semibold text-gray-900">
          Enter a search term above to explore our footwear catalog.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Suggestions: &ldquo;bata&rdquo;, &ldquo;school&rdquo;, &ldquo;sandals&rdquo;, &ldquo;men&rdquo;, &ldquo;loafer&rdquo;
        </p>
      </Reveal>
    );
  }

  const { products, totalCount } = await searchProducts({
    query: query.trim(),
    first: 24,
  });

  return (
    <div>
      <Reveal trigger="mount" y={10} className="mb-8 pb-4 border-b border-gray-100 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Found <span className="font-bold text-gray-900">{totalCount}</span>{" "}
          results for &ldquo;<span className="font-semibold text-black">{query}</span>&rdquo;
        </p>
      </Reveal>

      <ProductGrid products={products} priorityCount={4} />
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;

  return (
    <PageTransition>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <SplitText
          as="h1"
          trigger="mount"
          text="Search Storefront"
          className="text-3xl font-black text-gray-900 font-sans tracking-tight"
        />
        <Reveal trigger="mount" delay={200} y={12}>
          <p className="mt-2 text-sm text-gray-500">
            Find your preferred shoe size, brand, or collection.
          </p>
        </Reveal>

        {/* Search input form */}
        <Reveal trigger="mount" delay={300} y={16} scale={0.98}>
        <form
          action="/search"
          method="GET"
          className="mt-6 relative flex items-center max-w-xl mx-auto group"
        >
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-4 transition-colors duration-300 group-focus-within:text-black" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by keywords..."
            aria-label="Search by keywords"
            className="w-full pl-12 pr-28 py-3.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-black focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow] duration-300 shadow-xs"
          />
          <button
            type="submit"
            className="btn-shine absolute right-2 px-5 py-2 bg-black text-white text-xs font-bold uppercase rounded-full hover:bg-neutral-800 active:scale-95 transition-[background-color,transform] cursor-pointer"
          >
            Search
          </button>
        </form>
        </Reveal>
      </div>

      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <SearchResults query={q} />
      </Suspense>
    </div>
    </PageTransition>
  );
}
