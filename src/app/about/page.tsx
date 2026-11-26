import Image from "next/image";

export const metadata = {
  title: "Atelier Story | KINETIC // STUDIO",
  description:
    "Learn about KINETIC // STUDIO, our pursuit of architectural footwear, and our certified brand partnerships across Bangladesh.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Title */}
      <div className="text-center mb-16">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-mono">
          ATELIER MANIFESTO
        </span>
        <h1 className="mt-3 text-3xl sm:text-6xl font-black text-neutral-900 font-sans uppercase tracking-tight">
          Architectural Craft <br />
          For Daily Movement.
        </h1>
        <p className="mt-6 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed font-light">
          We curate certified genuine footwear designed to withstand the rigorous
          demands of modern life without sacrificing aesthetic refinement.
        </p>
      </div>

      {/* Editorial Image Banner */}
      <div className="relative aspect-16/9 rounded-3xl overflow-hidden bg-neutral-900 mb-16 shadow-2xl border border-neutral-200">
        <Image
          src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop"
          alt="Footwear studio and design process"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 1000px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 text-white text-xs font-mono uppercase tracking-widest">
          STUDIO CURATION // BANGLADESH
        </div>
      </div>

      {/* Content Pillars */}
      <div className="space-y-12 text-neutral-700 text-sm sm:text-base leading-relaxed">
        <section className="bg-[#F8F8F6] rounded-3xl p-8 sm:p-12 border border-neutral-200/60">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-tight mb-4 font-sans">
            The Philosophy
          </h2>
          <p className="font-light leading-relaxed">
            Every day is lived on our feet. Whether navigating boardroom meetings in
            metropolitan Dhaka, stepping out for evening gatherings, or outfitting
            children for the school year, footwear should never be a compromise between
            comfort and dignity. We partner exclusively with certified, heritage manufacturers
            to deliver footwear that upholds both.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 bg-white shadow-2xs">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider mb-2 font-sans">
              Direct Authentication
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm font-light leading-relaxed">
              Every single silhouette is sourced through official brand channels.
              We reject gray-market replicas and uninspected stock, ensuring every stitch
              and sole meets strict international factory standards.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 bg-white shadow-2xs">
            <h3 className="text-base font-bold text-neutral-900 uppercase tracking-wider mb-2 font-sans">
              All 64 Districts Reached
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm font-light leading-relaxed">
              Our fulfillment network reaches customers in every corner of Bangladesh.
              Orders are packaged in shock-resistant protective outer cartons with
              end-to-end consignment tracking.
            </p>
          </div>
        </section>

        <section className="p-8 sm:p-12 rounded-3xl bg-[#0F0F0F] text-white">
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-3 font-sans">
            Independent Engineering
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
            Our storefront is custom-engineered using modern web architecture for
            lightning-fast speed, absolute privacy, and seamless checkout security.
            No off-the-shelf templates — just pure, focused commerce.
          </p>
        </section>
      </div>
    </div>
  );
}
