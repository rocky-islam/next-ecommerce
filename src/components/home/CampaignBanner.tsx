"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function CampaignBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative rounded-3xl overflow-hidden min-h-[440px] flex items-center bg-neutral-900 border border-neutral-800 shadow-2xl group"
      >
        {/* Background Image with slow cinematic scale on hover */}
        <Image
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1200&auto=format&fit=crop"
          alt="Footwear capsule campaign"
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-106"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-xl p-8 sm:p-14 text-white">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-white/15 backdrop-blur-md border border-white/20 text-neutral-200">
            LIMITED CURATION
          </span>

          <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.08] mt-4 font-sans">
            Style in Motion. <br />
            Built for Reality.
          </h3>

          <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
            Engineered with precision stitching, slip-resistant treads, and breathable
            uppers. Experience certified footwear delivered straight to your door across Bangladesh.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                href="/products?sort=newest"
                className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg block"
              >
                <span>Shop The Capsule</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
