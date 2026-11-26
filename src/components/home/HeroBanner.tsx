"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck, Compass } from "lucide-react";
import { motion } from "motion/react";

export function HeroBanner() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section className="relative bg-[#0E0E0E] text-white overflow-hidden">
      {/* Background radial gradient accent with smooth breathing pulse */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-1/4 w-96 h-96 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-0 left-10 w-80 h-80 bg-neutral-900/50 rounded-full blur-2xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Typography */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            {/* Minimalist Season Tag */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>COLLECTION // 2026 EDITION</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white font-sans uppercase"
            >
              ARCHITECTURAL <br />
              <span className="text-neutral-400 font-light italic">FOOTWEAR</span> FOR <br />
              MODERN STEPS.
            </motion.h1>

            {/* Narrative Subhead */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-normal"
            >
              A curated harmony of timeless heritage leather craft and all-day
              ergonomics. Discover formal dress shoes, slip-ons, outdoor sandals,
              and school essentials engineered for continuous daily movement.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products"
                  className="group px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2.5 shadow-2xl block"
                >
                  <span>Explore Curation</span>
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/products?sort=newest"
                  className="px-8 py-4 rounded-full border border-neutral-700 bg-neutral-900/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest hover:border-neutral-400 hover:bg-neutral-800 transition-all block"
                >
                  New Arrivals
                </Link>
              </motion.div>
            </motion.div>

            {/* Brand Credibility Micro-Points */}
            <motion.div
              variants={itemVariants}
              className="mt-12 sm:mt-16 pt-8 border-t border-neutral-800/80 flex flex-wrap gap-8 text-neutral-400 text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">100% Genuine Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">64 Districts Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">Complimentary ৳2,500+ Shipping</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Fashion Visual Showcase with floating physics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-4/5 w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                alt="Contemporary footwear design"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-106"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />

              {/* Floating Architectural Badge (Top Right) */}
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                STUDIO // 01
              </div>

              {/* Floating Product Highlight Card with subtle gentle hover float */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    SPOTLIGHT LOOK
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5">
                    Signature Footwear Series
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Direct Official Pricing in BDT
                  </p>
                </div>
                <Link
                  href="/products"
                  className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-transform hover:scale-110 shrink-0 ml-3 shadow-md"
                  aria-label="View spotlight collection"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
