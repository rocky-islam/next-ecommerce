"use client";

import Image from "next/image";
import { Loader2, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE, SPRING } from "@/lib/motion";
import { RollingValue } from "@/components/motion/RollingValue";
import type { ShopifyImage } from "@/lib/shopify/types";

type StickyBuyBarProps = {
  open: boolean;
  title: string;
  image?: ShopifyImage | null;
  /** e.g. "Size 7 · Brown" */
  summary?: string;
  price: string;
  isAvailable: boolean;
  isAdding: boolean;
  justAdded: boolean;
  onAdd: () => void;
};

const swap = {
  initial: { y: 14, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -14, opacity: 0 },
  transition: { duration: 0.25, ease: EASE.out },
};

/**
 * Compact purchase bar that rises into view once the main Add to Bag
 * button has scrolled away. Shares state with the main product form.
 */
export function StickyBuyBar({
  open,
  title,
  image,
  summary,
  price,
  isAvailable,
  isAdding,
  justAdded,
  onAdd,
}: StickyBuyBarProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sticky-buy"
          data-sticky-buy=""
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "120%", opacity: 0 }}
          transition={SPRING.drawer}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6 sm:pb-6 pointer-events-none"
        >
          <div
            role="region"
            aria-label="Quick purchase"
            className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl sm:rounded-full bg-white/[0.97] p-2 sm:p-2.5 sm:pl-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-neutral-200"
          >
            {image && (
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:rounded-full bg-[#F4F4F2]">
                <Image src={image.url} alt="" fill sizes="44px" className="object-cover" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold uppercase tracking-wide text-neutral-900">{title}</p>
              <p className="truncate text-[11px] text-neutral-500">
                <RollingValue value={price} className="font-mono font-bold text-neutral-900" />
                {summary && <span className="ml-2">{summary}</span>}
              </p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={onAdd}
              disabled={!isAvailable || isAdding}
              aria-live="polite"
              className={`btn-shine shrink-0 inline-flex items-center gap-2 rounded-xl sm:rounded-full px-4 sm:px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition-colors duration-500 disabled:opacity-50 cursor-pointer ${
                justAdded ? "bg-emerald-600" : "bg-neutral-900 hover:bg-black"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdding ? (
                  <motion.span key="a" {...swap} className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span className="hidden sm:inline">Adding</span>
                  </motion.span>
                ) : justAdded ? (
                  <motion.span key="b" {...swap} className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: EASE.out }} />
                    </svg>
                    <span>Added</span>
                  </motion.span>
                ) : (
                  <motion.span key="c" {...swap} className="flex items-center gap-2">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>{isAvailable ? "Add to Bag" : "Sold Out"}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
