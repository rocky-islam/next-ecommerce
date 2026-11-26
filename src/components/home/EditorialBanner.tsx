import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          
          {/* Left Column: Craftsmanship Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop"
                alt="Footwear craftsmanship and stitching detail"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />

              <div className="absolute bottom-6 inset-x-6 p-5 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs text-neutral-300 italic leading-relaxed">
                &ldquo;True comfort is quiet. It is the absence of pressure points,
                the resilience of good leather, and the confidence of every step.&rdquo;
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Manifesto & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-10">
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
            </div>

            {/* 4 Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-800">
              {pillars.map((pillar) => (
                <div key={pillar.num} className="space-y-1.5">
                  <span className="text-xs font-mono font-bold text-neutral-500">
                    {pillar.num} &bull;
                  </span>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-white font-sans">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors"
              >
                <span>Read Full Brand Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
