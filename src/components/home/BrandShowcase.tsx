"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { setPointerVars } from "@/lib/motion";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { SectionHeader } from "./SectionHeader";

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
        <SectionHeader
          tone="dark"
          eyebrow="HOUSES & LABELS"
          title="Brand Archive"
          className="mb-14"
          aside={
            <p className="mt-4 md:mt-0 text-xs text-neutral-400 max-w-sm font-light leading-relaxed">
              Every label represents decades of specialized tooling — from Olympic-inspired running tech to century-old formal cordwaining.
            </p>
          }
        />

        {/* 6-Card Brand Matrix — staggered entrance, cursor spotlight */}
        <StaggerGroup step={80} y={32} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              href={brand.href}
              onPointerMove={setPointerVars}
              className="group relative overflow-hidden isolate p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 transition-[border-color,background-color,box-shadow,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-neutral-900/90 hover:-translate-y-1.5 flex flex-col justify-between min-h-[220px] h-full shadow-lg hover:shadow-2xl"
            >
              {/* Cursor spotlight */}
              <span
                aria-hidden="true"
                className="spotlight pointer-events-none absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                    {brand.badge}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-500 group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-2xl font-black tracking-tight font-sans uppercase text-white transition-[letter-spacing] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-normal">
                  {brand.name}
                </h3>
                <p className="text-xs font-mono tracking-wider text-neutral-400 mt-1 uppercase">
                  {brand.tagline}
                </p>
              </div>

              <p className="mt-6 text-xs text-neutral-400 font-light leading-relaxed transition-colors duration-500 group-hover:text-neutral-300">
                {brand.desc}
              </p>
            </Link>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
