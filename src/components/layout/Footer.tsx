"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerGroup step={90} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-neutral-800/80">
          
          {/* Brand Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-[0.25em] uppercase text-white font-sans">
                KINETIC
              </span>
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                STUDIO
              </span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-sm leading-relaxed font-light">
              Contemporary footwear crafted for enduring movement. Sourced directly
              from authorized brand partners with transparent pricing in BDT and
              swift tracked delivery nationwide across Bangladesh.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline-block" />
                Certified Authentic Inventory
              </span>
            </div>
          </div>

          {/* Directory Links */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300">
              Divisions
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-neutral-400">
              <li>
                <Link href="/products" className="link-underline hover:text-white">
                  All Silhouettes
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=Men"
                  className="link-underline hover:text-white"
                >
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=Women"
                  className="link-underline hover:text-white"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=POWER"
                  className="link-underline hover:text-white"
                >
                  Power Athletics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=NORTH+STAR"
                  className="link-underline hover:text-white"
                >
                  North Star Street
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Bubblegummers"
                  className="link-underline hover:text-white"
                >
                  Bubblegummers Kids
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=Bags"
                  className="link-underline hover:text-white"
                >
                  Bags &amp; Backpacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand Houses */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300">
              Brand Archive
            </h4>
            <ul className="space-y-2.5 text-xs uppercase tracking-wider text-neutral-400">
              <li>
                <Link
                  href="/products?vendor=POWER"
                  className="link-underline hover:text-white"
                >
                  POWER Sports
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Hush+Puppies"
                  className="link-underline hover:text-white"
                >
                  Hush Puppies Leather
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=NORTH+STAR"
                  className="link-underline hover:text-white"
                >
                  North Star Canvas
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Comfit"
                  className="link-underline hover:text-white"
                >
                  Comfit Ergonomics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Weinbrenner"
                  className="link-underline hover:text-white"
                >
                  Weinbrenner Trail
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Floatz"
                  className="link-underline hover:text-white"
                >
                  Floatz Waterproof
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300">
              Private Curation
            </h4>
            <p className="text-neutral-400 text-xs font-light">
              Receive private notifications for seasonal drops, archival rests, and member privileges.
            </p>
            <AnimatePresence mode="wait" initial={false}>
              {isSubscribed ? (
                <motion.div
                  key="subscribed"
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE.out }}
                  role="status"
                  className="flex items-center gap-2 text-emerald-400 text-xs py-2"
                >
                  <motion.span
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  </motion.span>
                  <span>You have been added to the register.</span>
                </motion.div>
              ) : (
                <motion.form
                  key="subscribe-form"
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubscribe}
                  className="space-y-2"
                >
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      aria-label="Email address"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)] transition-[border-color,box-shadow] duration-300"
                    />
                    <button
                      type="submit"
                      className="absolute right-1.5 top-1.5 p-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors overflow-hidden cursor-pointer"
                      aria-label="Subscribe"
                    >
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-focus-within:translate-x-0.5 hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </StaggerGroup>

        {/* Oversized wordmark — decorative, revealed word-by-word on scroll */}
        <div aria-hidden="true" className="pt-14 pb-4 overflow-hidden select-none">
          <SplitText
            as="p"
            text="KINETIC STUDIO"
            stagger={90}
            className="text-[length:min(11vw,9.4rem)] leading-[0.85] font-black tracking-[-0.04em] uppercase text-neutral-800/80 whitespace-nowrap"
          />
        </div>

        {/* Bottom bar */}
        <Reveal y={12} className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4 uppercase tracking-wider border-t border-neutral-800/80">
          <p>© 2026 KINETIC // STUDIO. Independent Digital Storefront.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="link-underline hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="link-underline hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/shipping-policy"
              className="link-underline hover:text-white"
            >
              Dispatch
            </Link>
            <Link
              href="/return-policy"
              className="link-underline hover:text-white"
            >
              Exchanges
            </Link>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span className="text-white font-mono">BDT (৳)</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
