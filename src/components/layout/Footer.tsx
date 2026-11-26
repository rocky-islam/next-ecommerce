"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Lock } from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-neutral-800/80">
          
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
                <Link href="/products" className="hover:text-white transition-colors">
                  All Silhouettes
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=Men"
                  className="hover:text-white transition-colors"
                >
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?tag=Women"
                  className="hover:text-white transition-colors"
                >
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=POWER"
                  className="hover:text-white transition-colors"
                >
                  Power Athletics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=NORTH+STAR"
                  className="hover:text-white transition-colors"
                >
                  North Star Street
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Bubblegummers"
                  className="hover:text-white transition-colors"
                >
                  Bubblegummers Kids
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=Bags"
                  className="hover:text-white transition-colors"
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
                  className="hover:text-white transition-colors"
                >
                  POWER Sports
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Hush+Puppies"
                  className="hover:text-white transition-colors"
                >
                  Hush Puppies Leather
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=NORTH+STAR"
                  className="hover:text-white transition-colors"
                >
                  North Star Canvas
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Comfit"
                  className="hover:text-white transition-colors"
                >
                  Comfit Ergonomics
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Weinbrenner"
                  className="hover:text-white transition-colors"
                >
                  Weinbrenner Trail
                </Link>
              </li>
              <li>
                <Link
                  href="/products?vendor=Floatz"
                  className="hover:text-white transition-colors"
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
            {isSubscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs py-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You have been added to the register.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-2 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4 uppercase tracking-wider">
          <p>© 2026 KINETIC // STUDIO. Independent Digital Storefront.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/shipping-policy"
              className="hover:text-white transition-colors"
            >
              Dispatch
            </Link>
            <Link
              href="/return-policy"
              className="hover:text-white transition-colors"
            >
              Exchanges
            </Link>
            <span className="flex items-center gap-1.5 text-neutral-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span className="text-white font-mono">BDT (৳)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
