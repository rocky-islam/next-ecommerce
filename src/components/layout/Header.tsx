"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, ChevronDown, ArrowUpRight } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useAnimate,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import { useCart } from "@/context/cart-context";
import { brandHouses, divisions, primaryNav } from "@/lib/navigation";
import { EASE, SPRING } from "@/lib/motion";
import { RollText } from "@/components/motion/RollText";
import { RollingValue } from "@/components/motion/RollingValue";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "@/components/search/SearchModal";

const MEGA_MENU_ID = "catalog-mega-menu";

const megaList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.025, delayChildren: 0.08 } },
};
const megaItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.out } },
};

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const { openCart, totalQuantity, isLoading } = useCart();

  // ── Scroll-aware header: compact glass on scroll, hide on scroll down ──
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setIsScrolled(latest > 12);
    if (Math.abs(latest - previous) < 4) return;
    // Track scroll direction only; open menus are handled by `hidden` below,
    // so the header still tucks away once a menu closes mid-scroll.
    setIsHidden(latest > previous && latest > 420);
  });

  // ── Mega menu open/close with hover intent ──
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaOpen(true);
  }, []);
  const scheduleMegaClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setIsMegaOpen(false), 140);
  }, []);
  const closeMega = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsMegaOpen(false);
  }, []);

  useEffect(() => {
    if (!isMegaOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMega();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMegaOpen, closeMega]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  // ── Cart icon bump when an item is added (not on initial cart load) ──
  const [bagScope, animateBag] = useAnimate<HTMLSpanElement>();
  const prevQty = useRef(totalQuantity);
  const wasLoaded = useRef(false);
  useEffect(() => {
    if (wasLoaded.current && totalQuantity > prevQty.current && bagScope.current) {
      animateBag(
        bagScope.current,
        { rotate: [0, -14, 10, -6, 0], scale: [1, 1.2, 1] },
        { duration: 0.65, ease: "easeOut" }
      );
    }
    prevQty.current = totalQuantity;
    wasLoaded.current = !isLoading;
  }, [totalQuantity, isLoading, animateBag, bagScope]);

  const hidden = isHidden && !isMegaOpen && !isMobileMenuOpen && !isSearchOpen;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.5, ease: EASE.out }}
        onFocusCapture={() => setIsHidden(false)}
        style={{ viewTransitionName: "site-header" }}
        // Frosted glass re-blurs the page under the header every scroll
        // frame; it halved homepage scroll FPS on throttled phones, so
        // small screens get a near-solid bar and the glass starts at lg.
        className={`sticky top-0 z-40 border-b text-white lg:backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500 ${
          isScrolled
            ? "bg-[#0B0B0B]/[0.97] lg:bg-[#0B0B0B]/80 border-white/10 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.6)]"
            : "bg-[#0B0B0B]/[0.97] lg:bg-[#0B0B0B]/90 border-neutral-800"
        }`}
      >
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
                aria-expanded={isMobileMenuOpen}
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
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase group-hover:text-neutral-300 transition-colors duration-500">
                  <RollText>STUDIO</RollText>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation with sliding hover pill */}
            <nav
              aria-label="Primary"
              className="hidden lg:flex items-center gap-0.5 xl:gap-1.5"
              onMouseLeave={() => {
                setHoveredLink(null);
                scheduleMegaClose();
              }}
            >
              {primaryNav.map((link) => {
                const isCatalog = link.name === "Catalog";
                return (
                  <div
                    key={link.name}
                    className="relative flex items-center"
                    onMouseEnter={() => {
                      setHoveredLink(link.name);
                      if (isCatalog) openMega();
                      else scheduleMegaClose();
                    }}
                  >
                    {hoveredLink === link.name && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08]"
                        transition={SPRING.glide}
                      />
                    )}
                    <Link
                      href={link.href}
                      onClick={closeMega}
                      className={`group relative z-10 block py-2 whitespace-nowrap text-[11px] xl:text-xs font-bold uppercase tracking-[0.1em] xl:tracking-[0.16em] text-neutral-400 hover:text-white transition-colors ${
                        isCatalog ? "pl-2.5 xl:pl-3 pr-1" : "px-2.5 xl:px-3"
                      }`}
                    >
                      <RollText>{link.name}</RollText>
                    </Link>
                    {isCatalog && (
                      <button
                        type="button"
                        onClick={() => (isMegaOpen ? closeMega() : openMega())}
                        aria-expanded={isMegaOpen}
                        aria-controls={MEGA_MENU_ID}
                        aria-label="Toggle catalog menu"
                        className="relative z-10 pr-2.5 xl:pr-3 pl-0.5 py-2 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                      >
                        <motion.span
                          animate={{ rotate: isMegaOpen ? 180 : 0 }}
                          transition={{ duration: 0.4, ease: EASE.out }}
                          className="block"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </motion.span>
                      </button>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right: Search & Cart actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="group p-2.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-xs cursor-pointer"
                aria-label="Search catalog"
              >
                <Search className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
                <span className="hidden md:inline-block lg:hidden xl:inline-block text-[11px] font-bold tracking-widest uppercase text-neutral-400 group-hover:text-white transition-colors">
                  <RollText>Search</RollText>
                </span>
              </motion.button>

              {/* Cart Button: bag bumps on add, badge pops and rolls */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={openCart}
                className="p-2.5 text-neutral-300 hover:text-white rounded-full hover:bg-white/10 transition-colors relative cursor-pointer"
                aria-label={`Shopping bag with ${totalQuantity} items`}
              >
                <span ref={bagScope} className="block">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <AnimatePresence>
                  {totalQuantity > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={SPRING.snappy}
                      className="absolute -top-1 -right-1 bg-white text-black text-[9px] font-bold min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <RollingValue value={totalQuantity > 99 ? "99+" : totalQuantity} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Scroll progress hairline */}
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute -bottom-px left-0 right-0 h-px origin-left bg-white/50"
        />

        {/* Catalog Mega Menu */}
        <AnimatePresence>
          {isMegaOpen && (
            <motion.div
              id={MEGA_MENU_ID}
              key="mega"
              initial={{ opacity: 0, y: -8, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, y: -6, clipPath: "inset(0 0 100% 0)" }}
              transition={{ duration: 0.5, ease: EASE.out }}
              onMouseEnter={openMega}
              onMouseLeave={scheduleMegaClose}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                  scheduleMegaClose();
                }
              }}
              className="hidden lg:block absolute inset-x-0 top-full bg-[#0B0B0B] border-b border-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]"
            >
              <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-12 gap-10">
                <div className="col-span-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-4 font-mono">
                    Divisions
                  </p>
                  <motion.ul
                    variants={megaList}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-x-6 gap-y-2.5"
                  >
                    {divisions.map((d) => (
                      <motion.li key={d.name} variants={megaItem}>
                        <Link
                          href={d.href}
                          onClick={closeMega}
                          className="link-underline text-xs font-bold uppercase tracking-[0.12em] text-neutral-300 hover:text-white"
                        >
                          {d.name}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <div className="col-span-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-500 mb-4 font-mono">
                    Brand Archive
                  </p>
                  <motion.ul variants={megaList} initial="hidden" animate="show" className="space-y-2.5">
                    {brandHouses.map((b) => (
                      <motion.li key={b.name} variants={megaItem}>
                        <Link
                          href={b.href}
                          onClick={closeMega}
                          className="link-underline text-xs text-neutral-400 hover:text-white"
                        >
                          {b.name}
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.12, ease: EASE.out }}
                  className="col-span-4"
                >
                  <Link
                    href="/products?vendor=POWER"
                    onClick={closeMega}
                    className="group relative block aspect-16/10 rounded-2xl overflow-hidden border border-white/10"
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"
                      alt="Athletic & Running"
                      fill
                      sizes="400px"
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-300">
                          POWER SPORTS
                        </span>
                        <p className="text-sm font-bold uppercase tracking-tight text-white mt-0.5">
                          Athletic &amp; Running
                        </p>
                      </div>
                      <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-500 group-hover:rotate-45 shrink-0">
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

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
