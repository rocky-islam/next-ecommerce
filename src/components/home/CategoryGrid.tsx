import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { SectionHeader } from "./SectionHeader";

export function CategoryGrid() {
  const categories = [
    {
      title: "Athletic & Running",
      subtitle: "Power dynamic trainers, running sneakers & performance apparel",
      href: "/products?vendor=POWER",
      tag: "POWER SPORTS",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Men's Formal & Loafers",
      subtitle: "Bata & Hush Puppies leather dress shoes, slip-ons & moccasins",
      href: "/products?tag=Men",
      tag: "HERITAGE LEATHER",
      image:
        "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Women's Heels & Flats",
      subtitle: "Block mid heels, elegant ballerinas, low wedges & handbags",
      href: "/products?tag=Women",
      tag: "WOMEN'S ATELIER",
      image:
        "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Streetwear & Canvas",
      subtitle: "North Star retro joggers, classic vulcanized canvas & backpacks",
      href: "/products?vendor=NORTH+STAR",
      tag: "NORTH STAR",
      image:
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "School & Youth",
      subtitle: "Bubblegummers certified school dress shoes & youth sneakers",
      href: "/products?vendor=Bubblegummers",
      tag: "BUBBLEGUMMERS",
      image:
        "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=800&auto=format&fit=crop",
    },
    {
      title: "Bags & Leather Goods",
      subtitle: "Backpacks, school bags, genuine leather wallets & belts",
      href: "/products?type=Bags",
      tag: "LEATHER & GEAR",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="CATALOG DIVISIONS"
          title="Curated Silhouettes"
          href="/products"
          linkLabel="View Full Directory"
        />

        {/* 6-Card High-Fashion Grid — staggered clip-path wipes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <ImageReveal
              key={cat.title}
              delay={(idx % 3) * 120}
              innerScale={1.12}
              className="rounded-3xl shadow-md"
            >
              <Link
                href={cat.href}
                data-cursor-label="Explore"
                className="group relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/60 block isolate"
              >
                {/* Background Photography */}
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />

                {/* Gradient Scrim deepens on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-700" />

                {/* Content overlay */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                      {cat.tag}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-lg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-sans">
                      {cat.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed transition-colors duration-500 group-hover:text-white">
                      {cat.subtitle}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-4 block h-px w-full origin-left scale-x-0 bg-white/60 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />
                  </div>
                </div>
              </Link>
            </ImageReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
