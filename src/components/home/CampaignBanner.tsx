import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CampaignBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="relative rounded-3xl overflow-hidden min-h-[440px] flex items-center bg-neutral-900 border border-neutral-800 shadow-2xl">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1200&auto=format&fit=crop"
          alt="Footwear capsule campaign"
          fill
          sizes="(max-width: 1280px) 100vw, 1200px"
          className="object-cover object-center"
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
            <Link
              href="/products?sort=newest"
              className="px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 active:scale-[0.98] shadow-lg"
            >
              <span>Shop The Capsule</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
