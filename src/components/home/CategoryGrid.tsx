import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2">
              CATALOG DIVISIONS
            </p>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 font-sans uppercase">
              Curated Silhouettes
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-500 inline-flex items-center gap-1.5 group transition-colors"
          >
            <span>View Full Directory</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* 6-Card High-Fashion Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 shadow-md border border-neutral-200/60 block"
            >
              {/* Background Photography */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/10 transition-opacity group-hover:opacity-90" />

              {/* Content overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white z-10">
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md bg-white/20 backdrop-blur-md text-white border border-white/20">
                    {cat.tag}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight uppercase font-sans">
                    {cat.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-300 font-light line-clamp-2 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
