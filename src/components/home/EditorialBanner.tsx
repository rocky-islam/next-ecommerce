"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function EditorialBanner() {
  const pillars = [
    {
      num: "01",
      title: "CERTIFIED SOURCING",
      desc: "Every pair originates from brand-authorized distributors. No imitations, no compromised standards.",
    },
    {
      num: "02",
      title: "ANATOMICAL CONTOURS",
      desc: "Engineered with dual-density cushioning and flexible outsoles for natural, fatigue-free movement.",
    },
    {
      num: "03",
      title: "64-DISTRICT DISPATCH",
      desc: "Direct fulfillment across Bangladesh with live SMS/email tracking and tamper-evident packaging.",
    },
    {
      num: "04",
      title: "7-DAY CONCIERGE EXCHANGE",
      desc: "If sizing isn't perfect, our dedicated care team manages prompt replacements with zero friction.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#101010] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Craftsmanship Photography with smooth perspective reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl group">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop"
                alt="Footwear craftsmanship and stitching detail"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-106"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute bottom-6 inset-x-6 p-5 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs text-neutral-300 italic leading-relaxed">
                &ldquo;True comfort is quiet. It is the absence of pressure points,
                the resilience of good leather, and the confidence of every step.&rdquo;
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Manifesto & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
              className="mb-10"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                OUR COMMITMENT
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans uppercase mt-2 leading-tight">
                Engineered For <br />
                The Daily Rhythm.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                We bridge heritage shoemaking legacy with modern digital commerce.
                Our collections are curated for individuals who value both refined
                aesthetics and relentless everyday durability.
              </p>
            </motion.div>

            {/* 4 Pillars List with Staggered Scroll Entrance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, idx) => (
                <motion.div
                  key={pillar.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1] as const,
                  }}
                  className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 transition-colors"
                >
                  <span className="text-xs font-mono text-neutral-500 font-bold block mb-1">
                    {pillar.num}
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
