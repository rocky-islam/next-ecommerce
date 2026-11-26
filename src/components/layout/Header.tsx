"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "@/context/cart-context";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "@/components/search/SearchModal";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, totalQuantity } = useCart();

  const navLinks = [
    { name: "Catalog", href: "/products" },
    { name: "Men", href: "/products?tag=Men" },
    { name: "Women", href: "/products?tag=Women" },
    { name: "Athletics", href: "/products?vendor=POWER" },
    { name: "Streetwear", href: "/products?vendor=NORTH+STAR" },
    { name: "Kids & School", href: "/products?vendor=Bubblegummers" },
    { name: "Bags & Gear", href: "/products?type=Bags" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0B0B0B]/90 backdrop-blur-xl border-b border-neutral-800 text-white transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile hamburger menu */}
            <div className="flex items-center lg:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Brand Logo - Bespoke Minimalist Luxury */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-flex items-baseline gap-1.5 group">
                <span className="text-lg sm:text-xl font-black tracking-[0.25em] text-white uppercase font-sans">
                  KINETIC
                </span>
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                  STUDIO
                </span>
              </Link>
            </div>

            {/* Desktop Navigation with Hover underline animation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-[0.16em] text-neutral-400 hover:text-white transition-colors relative py-1 hover:after:w-full after:w-0 after:h-[1.5px] after:bg-white after:absolute after:bottom-0 after:left-0 after:transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right: Search & Cart actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-xs cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="w-4 h-4" />
                <span className="hidden md:inline-block text-[11px] font-bold tracking-widest uppercase text-neutral-400">
                  Search
                </span>
              </motion.button>

              {/* Cart Button with spring badge pulse */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={openCart}
                className="p-2.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
                aria-label={`Shopping bag with ${totalQuantity} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                {totalQuantity > 0 && (
                  <motion.span
                    key={totalQuantity}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-lg"
                  >
                    {totalQuantity > 99 ? "99+" : totalQuantity}
                  </motion.span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
