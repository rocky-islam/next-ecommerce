"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { useOverlay } from "@/hooks/use-overlay";

const chipList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.2 } },
};
const chipItem = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: EASE.out } },
};

type SearchResultItem = {
  id: string;
  title: string;
  handle: string;
  featuredImage?: {
    url: string;
    altText: string | null;
  } | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

export function SearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const curatedSuggestions = [
    { label: "Power Running", query: "Power" },
    { label: "Hush Puppies Leather", query: "Hush Puppies" },
    { label: "North Star Canvas", query: "North Star" },
    { label: "Bubblegummers School", query: "Bubblegummers" },
    { label: "Men's Sandals", query: "sandal" },
    { label: "Comfit Slides", query: "Comfit" },
    { label: "Ladies Handbags", query: "Bags" },
    { label: "Formal Dress Shoes", query: "Dress" },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    let isCancelled = false;

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`
        );
        if (res.ok && !isCancelled) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Live search failed:", err);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleClose = () => {
    setQuery("");
    setResults([]);
    onClose();
  };

  // Escape closes, page scroll locked while open
  const dialogRef = useOverlay(isOpen, handleClose);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (sugQuery: string) => {
    handleClose();
    router.push(`/search?q=${encodeURIComponent(sugQuery)}`);
  };

  const isQueryEmpty = !query.trim();
  const displayResults = isQueryEmpty ? [] : results;

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={dialogRef} className="fixed inset-0 z-50 outline-none" role="dialog" aria-modal="true" aria-label="Search catalog">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={handleClose}
          />

          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)", y: -12 }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: 0 }}
            exit={{ clipPath: "inset(0 0 100% 0)", y: -8, transition: { duration: 0.35, ease: EASE.inOut } }}
            transition={{ duration: 0.6, ease: EASE.out }}
            className="fixed top-0 inset-x-0 bg-white shadow-2xl border-b border-neutral-200 max-h-[85vh] flex flex-col z-10"
          >
            <div className="max-w-4xl mx-auto w-full p-4 sm:p-6">
              <motion.form
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12, ease: EASE.out }}
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <Search className="w-5 h-5 text-neutral-400 absolute left-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (!e.target.value.trim()) {
                      setResults([]);
                      setIsLoading(false);
                    }
                  }}
                  placeholder="Search by shoe type, brand, or color (e.g. 'Power', 'Hush Puppies', 'Sandals')..."
                  aria-label="Search products"
                  className="w-full pl-12 pr-12 py-3.5 bg-neutral-100 border border-neutral-200 rounded-full text-base focus:outline-none focus:border-black focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.05)] transition-[background-color,border-color,box-shadow] duration-300 font-sans"
                />
                {query ? (
                  <motion.button
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    aria-label="Clear search"
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setResults([]);
                    }}
                    className="absolute right-4 text-neutral-400 hover:text-black p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="absolute right-4 text-neutral-400 hover:text-black text-xs uppercase font-medium tracking-wider cursor-pointer"
                  >
                    ESC
                  </button>
                )}
              </motion.form>

              {/* If query is empty, show curated suggestions */}
              {isQueryEmpty && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="mt-5 pt-4 border-t border-neutral-100"
                >
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 mb-3 font-mono">
                    Trending Brands &amp; Silhouettes
                  </p>
                  <motion.div variants={chipList} initial="hidden" animate="show" className="flex flex-wrap gap-2">
                    {curatedSuggestions.map((sug) => (
                      <motion.button
                        key={sug.label}
                        variants={chipItem}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleSuggestionClick(sug.query)}
                        className="px-3.5 py-1.5 rounded-full text-xs bg-neutral-100 hover:bg-black hover:text-white text-neutral-800 transition-colors cursor-pointer"
                      >
                        {sug.label}
                      </motion.button>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {/* Results section */}
              <div className="mt-4 overflow-y-auto max-h-[50vh] divide-y divide-neutral-100">
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    role="status"
                    className="py-12 flex flex-col items-center justify-center text-neutral-400"
                  >
                    <Loader2 className="w-6 h-6 animate-spin mb-2" />
                    <span className="text-xs uppercase tracking-widest font-mono">Searching catalog...</span>
                  </motion.div>
                )}

                {!isLoading && displayResults.length > 0 && (
                  <div className="py-2">
                    <p className="text-[11px] uppercase font-bold text-neutral-400 tracking-wider mb-3 font-mono">
                      Products ({displayResults.length})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {displayResults.slice(0, 6).map((item, idx) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.45, ease: EASE.out }}
                        >
                          <Link
                            href={`/products/${item.handle}`}
                            onClick={handleClose}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors group border border-transparent hover:border-neutral-200"
                          >
                            <div className="relative w-14 h-14 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                              {item.featuredImage ? (
                                <Image
                                  src={item.featuredImage.url}
                                  alt={item.featuredImage.altText || item.title}
                                  fill
                                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                                  sizes="56px"
                                />
                              ) : null}
                            </div>
                            <div className="flex-1 min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black truncate uppercase tracking-tight">
                                {item.title}
                              </h4>
                              <p className="text-xs font-black text-neutral-900 mt-0.5 font-mono">
                                {formatPrice(
                                  item.priceRange.minVariantPrice.amount,
                                  item.priceRange.minVariantPrice.currencyCode
                                )}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>

                    {displayResults.length > 6 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={handleSubmit}
                          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black cursor-pointer"
                        >
                          <span className="link-underline">View all {displayResults.length} results</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {!isLoading && !isQueryEmpty && displayResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE.out }}
                    className="py-12 text-center text-neutral-500"
                  >
                    <p className="text-base font-bold text-neutral-900 uppercase">
                      No silhouettes found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-neutral-400 mt-1 font-light">
                      Try searching &ldquo;Power&rdquo;, &ldquo;Sandals&rdquo;, or &ldquo;Bubblegummers&rdquo;.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
