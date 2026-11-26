"use client";

import Link from "next/link";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const categories = [
    { name: "Full Catalog", href: "/products" },
    { name: "Men's Formal & Casual", href: "/products?tag=Men" },
    { name: "Women's Heels & Flats", href: "/products?tag=Women" },
    { name: "Athletic & Running (Power)", href: "/products?vendor=POWER" },
    { name: "Streetwear & Canvas (North Star)", href: "/products?vendor=NORTH+STAR" },
    { name: "School & Youth (Bubblegummers)", href: "/products?vendor=Bubblegummers" },
    { name: "Bags & Backpacks", href: "/products?type=Bags" },
    { name: "Sandals & Slides", href: "/products?type=Sandal" },
    { name: "Comfort Footbed (Comfit)", href: "/products?vendor=Comfit" },
    { name: "Outdoor Trail (Weinbrenner)", href: "/products?vendor=Weinbrenner" },
  ];

  const brandHouses = [
    { name: "POWER Sports", href: "/products?vendor=POWER" },
    { name: "Hush Puppies Leather", href: "/products?vendor=Hush+Puppies" },
    { name: "North Star Urban", href: "/products?vendor=NORTH+STAR" },
    { name: "Bubblegummers Kids", href: "/products?vendor=Bubblegummers" },
    { name: "Comfit Ergonomics", href: "/products?vendor=Comfit" },
    { name: "Weinbrenner Trail", href: "/products?vendor=Weinbrenner" },
    { name: "Floatz Waterproof", href: "/products?vendor=Floatz" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer with Spring Entrance */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
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
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mobile Search Link */}
            <div className="p-5 border-b border-neutral-800">
              <Link
                href="/search"
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white text-xs tracking-wider uppercase transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search Silhouettes &amp; Brands...</span>
              </Link>
            </div>

            {/* Navigation links with Stagger */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3 font-mono">
                  Divisions
                </p>
                <nav className="flex flex-col space-y-2.5">
                  {categories.map((link, idx) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + idx * 0.03 }}
                    >
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-300 hover:text-white py-1 transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-3 font-mono">
                  Brand Archive
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400">
                  {brandHouses.map((b) => (
                    <Link
                      key={b.name}
                      href={b.href}
                      onClick={onClose}
                      className="py-1 hover:text-white transition-colors"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer info */}
            <div className="p-6 border-t border-neutral-800 bg-neutral-950 text-[11px] text-neutral-400 space-y-2">
              <p className="font-bold uppercase tracking-widest text-white">Independent Flagship</p>
              <p>Official Bangladeshi Taka (BDT) Billing</p>
              <div className="pt-2 flex flex-wrap gap-x-4 gap-y-2 text-neutral-500 text-[10px] uppercase tracking-wider">
                <Link href="/shipping-policy" onClick={onClose} className="hover:text-white">
                  Shipping
                </Link>
                <Link href="/return-policy" onClick={onClose} className="hover:text-white">
                  Exchanges
                </Link>
                <Link href="/faq" onClick={onClose} className="hover:text-white">
                  FAQ
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
