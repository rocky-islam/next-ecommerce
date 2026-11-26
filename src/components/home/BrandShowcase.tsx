"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function BrandShowcase() {
  const brands = [
    {
      name: "POWER",
      tagline: "Dynamic Athletics & Running",
      desc: "Engineered cushioning, responsive foam, and lightweight breathable mesh designed for movement.",
      href: "/products?vendor=POWER",
      badge: "Performance",
    },
    {
      name: "HUSH PUPPIES",
      tagline: "Heritage Leather Craft",
      desc: "World-renowned genuine leather formal shoes, slip-ons, and handcrafted luxury leather accessories.",
      href: "/products?vendor=Hush+Puppies",
      badge: "Premium Leather",
    },
    {
      name: "NORTH STAR",
      tagline: "Urban Street & Canvas",
      desc: "Retro running joggers, vulcanized canvas sneakers, and streetwear-inspired lifestyle backpacks.",
      href: "/products?vendor=NORTH+STAR",
      badge: "Street Culture",
    },
    {
      name: "BUBBLE GUMMERS",
      tagline: "School & Youth Essentials",
      desc: "Ultra-durable school dress shoes, character sneakers, and supportive everyday footwear for active kids.",
      href: "/products?vendor=Bubblegummers",
      badge: "Kids & School",
    },
    {
      name: "COMFIT",
      tagline: "Anatomical Wellness & Support",
      desc: "Orthopedically contoured footbeds, soft low wedges, and stress-relieving slides for all-day comfort.",
      href: "/products?vendor=Comfit",
      badge: "Ergonomics",
    },
    {
      name: "WEINBRENNER",
      tagline: "Outdoor Trail & Exploration",
      desc: "Rugged all-terrain outsoles, trail-ready grip, and weather-resistant construction built for the outdoors.",
      href: "/products?vendor=Weinbrenner",
      badge: "All-Terrain",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#0E0E0E] text-white border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
        >
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">
              HOUSES &amp; LABELS
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans uppercase">
              Brand Archive
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-xs text-neutral-400 max-w-sm font-light leading-relaxed">
            Every label represents decades of specialized tooling — from Olympic-inspired running tech to century-old formal cordwaining.
          </p>
        </motion.div>

        {/* 6-Card Brand Matrix with Staggered Springs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand, idx) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              whileHover={{ y: -6 }}
            >
              <Link
                href={brand.href}
                className="group p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-500 transition-all duration-300 hover:bg-neutral-900/90 flex flex-col justify-between min-h-[220px] h-full shadow-lg hover:shadow-2xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                      {brand.badge}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black tracking-tight font-sans uppercase text-white">
                    {brand.name}
                  </h3>
                  <p className="text-xs font-mono tracking-wider text-neutral-400 mt-1 uppercase">
                    {brand.tagline}
                  </p>
                </div>

                <p className="mt-6 text-xs text-neutral-400 font-light leading-relaxed">
                  {brand.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
