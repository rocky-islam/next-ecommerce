"use client";

import Link from "next/link";
import { X, Search, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { brandHouses, divisions } from "@/lib/navigation";
import { EASE, SPRING } from "@/lib/motion";
import { useOverlay } from "@/hooks/use-overlay";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.15 } },
};

// Each link rises out of its own overflow mask
const maskedItem = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.6, ease: EASE.out } },
};

const fadeItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.out } },
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const dialogRef = useOverlay(isOpen, onClose);

  return (
    <AnimatePresence>
      {isOpen && (
        <div ref={dialogRef} className="fixed inset-0 z-50 lg:hidden outline-none" role="dialog" aria-modal="true" aria-label="Site navigation">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer with Spring Entrance */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%", transition: { duration: 0.35, ease: EASE.inOut } }}
            transition={SPRING.drawer}
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-[#0F0F0F] text-white shadow-2xl flex flex-col z-10 border-r border-neutral-800"
          >
            <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
              <Link
                href="/"
                onClick={onClose}
                className="text-base font-black tracking-[0.25em] text-white uppercase"
              >
                KINETIC // STUDIO
              </Link>
              <motion.button
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, ease: EASE.out }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Search Link */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE.out }}
              className="p-5 border-b border-neutral-800"
            >
              <Link
                href="/search"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 text-xs tracking-wider uppercase transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search Silhouettes &amp; Brands...</span>
              </Link>
            </motion.div>

            {/* Navigation links with masked stagger */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3 font-mono">
                  Divisions
                </p>
                <motion.nav
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col space-y-2.5"
                >
                  {divisions.map((link) => (
                    <div key={link.name} className="overflow-hidden">
                      <motion.div variants={maskedItem}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="group flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-neutral-300 hover:text-white py-1 transition-colors"
                        >
                          <span>{link.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                        </Link>
                      </motion.div>
                    </div>
                  ))}
                </motion.nav>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3 font-mono">
                  Brand Archive
                </p>
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-2 text-xs text-neutral-400"
                >
                  {brandHouses.map((b) => (
                    <motion.div key={b.name} variants={fadeItem}>
                      <Link
                        href={b.href}
                        onClick={onClose}
                        className="block py-1 hover:text-white transition-colors"
                      >
                        {b.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Footer info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="p-6 border-t border-neutral-800 bg-neutral-950 text-[11px] text-neutral-400 space-y-2"
            >
              <p className="font-bold uppercase tracking-widest text-white">Independent Flagship</p>
              <p>Official Bangladeshi Taka (BDT) Billing</p>
              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-neutral-500 text-[10px] uppercase tracking-wider">
                <Link href="/shipping-policy" onClick={onClose} className="link-underline hover:text-white">
                  Shipping
                </Link>
                <Link href="/return-policy" onClick={onClose} className="link-underline hover:text-white">
                  Exchanges
                </Link>
                <Link href="/faq" onClick={onClose} className="link-underline hover:text-white">
                  FAQ
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
