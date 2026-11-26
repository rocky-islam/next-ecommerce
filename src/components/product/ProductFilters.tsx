"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ProductFiltersProps = {
  totalCount?: number;
  currentSort?: string;
  currentQuery?: string;
  currentVendor?: string;
  currentType?: string;
  currentTag?: string;
};

export function ProductFilters({
  totalCount,
  currentSort = "best_selling",
  currentQuery = "",
  currentVendor = "",
  currentType = "",
  currentTag = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  type QuickPill = {
    label: string;
    params: {
      vendor?: string;
      type?: string;
      tag?: string;
      query?: string;
    };
  };

  // Quick-access category pills tailored to the CSV catalog
  const quickPills: QuickPill[] = [
    { label: "All Silhouettes", params: {} },
    { label: "Power Athletics", params: { vendor: "POWER" } },
    { label: "Men's Collection", params: { tag: "Men" } },
    { label: "Women's Collection", params: { tag: "Women" } },
    { label: "Hush Puppies", params: { vendor: "Hush Puppies" } },
    { label: "North Star Streetwear", params: { vendor: "NORTH STAR" } },
    { label: "Bubblegummers Kids", params: { vendor: "Bubblegummers" } },
    { label: "Bags & Backpacks", params: { type: "Bags" } },
    { label: "Sandals & Slides", params: { type: "Sandal" } },
    { label: "Comfit Wellness", params: { vendor: "Comfit" } },
    { label: "Trail (Weinbrenner)", params: { vendor: "Weinbrenner" } },
  ];

  // Specific facets from the actual CSV
  const brandList = [
    { label: "POWER Sports", value: "POWER" },
    { label: "Bata (Men)", value: "BATA (MEN)" },
    { label: "Bata (Women)", value: "BATA (WOMEN)" },
    { label: "Hush Puppies Leather", value: "Hush Puppies" },
    { label: "North Star Urban", value: "NORTH STAR" },
    { label: "Bubblegummers Kids", value: "Bubblegummers" },
    { label: "Comfit Ergonomics", value: "Comfit" },
    { label: "Weinbrenner Trail", value: "Weinbrenner" },
    { label: "Floatz Waterproof", value: "Floatz" },
    { label: "Scholl Ortho", value: "Scholl" },
  ];

  const typeList = [
    { label: "Sneakers & Athletic", value: "Sneaker" },
    { label: "Sandals & Slides", value: "Sandal" },
    { label: "Bags & Backpacks", value: "Bags" },
    { label: "Formal Shoes & Lace-ups", value: "Formal Shoe" },
    { label: "Slip-On & Loafers", value: "Loafer" },
    { label: "Women's Heels", value: "Heel" },
    { label: "Apparel & Sportswear", value: "Apparel" },
    { label: "Wallets & Belts", value: "Wallet" },
  ];

  const priceBands = [
    { label: "Under ৳1,000", tag: "Under Tk. 1000" },
    { label: "৳1,001 - ৳2,000", tag: "Tk. 1501 - Tk. 2000" },
    { label: "৳2,001 - ৳3,000", tag: "Tk. 2001 - Tk. 3000" },
    { label: "৳3,001 - ৳5,000", tag: "Tk. 4001 - Tk. 5000" },
    { label: "Above ৳5,000", tag: "Above Tk. 5000" },
  ];

  const sortOptions = [
    { label: "Best Selling", value: "best_selling" },
    { label: "Newest Arrivals", value: "newest" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Alphabetical: A-Z", value: "title_asc" },
  ];

  const setSingleParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("after");
    router.push(`/products?${params.toString()}`);
  };

  const applyPill = (pillParams: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (currentSort && currentSort !== "best_selling") {
      params.set("sort", currentSort);
    }
    Object.entries(pillParams).forEach(([k, v]) => {
      if (v) {
        params.set(k, v);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const hasActiveFilters = Boolean(
    currentQuery ||
      currentVendor ||
      currentType ||
      currentTag ||
      currentSort !== "best_selling"
  );

  return (
    <div className="space-y-5 mb-10">
      {/* Category Horizontal Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {quickPills.map((pill) => {
          const isAll =
            Object.keys(pill.params).length === 0 &&
            !currentVendor &&
            !currentType &&
            !currentTag &&
            !currentQuery;

          const isActive =
            isAll ||
            (pill.params.vendor && pill.params.vendor === currentVendor) ||
            (pill.params.type && pill.params.type === currentType) ||
            (pill.params.tag && pill.params.tag === currentTag);

          return (
            <motion.button
              key={pill.label}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => applyPill(pill.params)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-black text-white shadow-xs"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {pill.label}
            </motion.button>
          );
        })}
      </div>

      {/* Control Bar: Product Count, Active Chips & Sort Select */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-200/80 flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {totalCount !== undefined && (
            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wider mr-2">
              Showing <span className="font-bold text-neutral-900">{totalCount}</span> styles
            </p>
          )}

          {/* Active Filter Badges */}
          {currentVendor && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-neutral-900 text-white font-medium">
              Brand: {currentVendor}
              <button
                type="button"
                onClick={() => setSingleParam("vendor", "")}
                className="hover:text-red-400 p-0.5"
                aria-label="Remove brand filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentType && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-neutral-900 text-white font-medium">
              Type: {currentType}
              <button
                type="button"
                onClick={() => setSingleParam("type", "")}
                className="hover:text-red-400 p-0.5"
                aria-label="Remove type filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentTag && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-neutral-900 text-white font-medium">
              Tag: {currentTag}
              <button
                type="button"
                onClick={() => setSingleParam("tag", "")}
                className="hover:text-red-400 p-0.5"
                aria-label="Remove tag filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {currentQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-neutral-900 text-white font-medium">
              Search: {currentQuery}
              <button
                type="button"
                onClick={() => setSingleParam("query", "")}
                className="hover:text-red-400 p-0.5"
                aria-label="Remove query filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-red-600 hover:text-red-700 ml-2 cursor-pointer transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
            <select
              value={currentSort}
              onChange={(e) => setSingleParam("sort", e.target.value)}
              className="bg-white border border-neutral-300 rounded-lg text-xs font-medium text-neutral-800 py-2 px-3 focus:outline-none focus:border-black transition-colors"
              aria-label="Sort products by"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  Sort: {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="p-2 border border-neutral-300 rounded-lg text-neutral-700 hover:text-black flex items-center gap-1.5 text-xs font-semibold"
            aria-label="Filter products"
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refine</span>
          </button>
        </div>
      </div>

      {/* Filter Drawer / Modal */}
      <AnimatePresence>
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-10 p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <h3 className="text-base font-bold text-neutral-900 uppercase font-sans tracking-wide">
                  Refine Catalog
                </h3>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="py-6 space-y-6 flex-1 overflow-y-auto">
                {/* Brand Section */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider mb-3">
                    Brand / Label
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {brandList.map((b) => {
                      const isSelected = currentVendor === b.value;
                      return (
                        <button
                          key={b.value}
                          onClick={() => {
                            setSingleParam("vendor", isSelected ? "" : b.value);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Product Type Section */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider mb-3">
                    Product Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {typeList.map((t) => {
                      const isSelected = currentType === t.value;
                      return (
                        <button
                          key={t.value}
                          onClick={() => {
                            setSingleParam("type", isSelected ? "" : t.value);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Band Section */}
                <div>
                  <h4 className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider mb-3">
                    Price Tier (BDT)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {priceBands.map((p) => {
                      const isSelected = currentTag === p.tag;
                      return (
                        <button
                          key={p.tag}
                          onClick={() => {
                            setSingleParam("tag", isSelected ? "" : p.tag);
                            setIsMobileFiltersOpen(false);
                          }}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex gap-3">
                <button
                  onClick={() => {
                    clearAllFilters();
                    setIsMobileFiltersOpen(false);
                  }}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-800 text-xs font-bold uppercase rounded-lg hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
