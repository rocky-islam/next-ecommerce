import Image from "next/image";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { SpinBadge } from "@/components/motion/SpinBadge";

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

          {/* Left Column: Craftsmanship Photography — wipe reveal + inner parallax */}
          <div className="lg:col-span-5 relative">
            <ImageReveal
              direction="left"
              className="relative aspect-4/5 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl group"
            >
              <Parallax offset={40} className="absolute inset-x-0 -inset-y-[8%]">
                <Image
                  src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&auto=format&fit=crop"
                  alt="Footwear craftsmanship and stitching detail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-106"
                />
              </Parallax>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/20" />
            </ImageReveal>

            {/* The quote that lived here now leads the Manifesto section */}
            <Reveal delay={700} y={-10} className="absolute top-5 right-5 pointer-events-none">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                CRAFT // 02
              </div>
            </Reveal>
            <Reveal delay={850} y={20} scale={0.85} className="absolute -bottom-10 -right-6 sm:-right-10 hidden sm:block">
              <SpinBadge
                text="CERTIFIED SOURCING • ANATOMICAL CONTOURS • "
                className="h-32 w-32 rounded-full bg-[#101010] p-1 ring-1 ring-neutral-800"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black text-[10px] font-black tracking-widest">
                  KS
                </span>
              </SpinBadge>
            </Reveal>
          </div>

          {/* Right Column: Editorial Manifesto & Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-10">
              <Reveal y={12}>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                  OUR COMMITMENT
                </span>
              </Reveal>
              <SplitText
                as="h2"
                delay={100}
                lines={["Engineered For", "The Daily Rhythm."]}
                className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans uppercase mt-2 leading-tight"
              />
              <Reveal delay={350} y={18}>
                <p className="mt-4 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
                  We bridge heritage shoemaking legacy with modern digital commerce.
                  Our collections are curated for individuals who value both refined
                  aesthetics and relentless everyday durability.
                </p>
              </Reveal>
            </div>

            {/* 4 Pillars — staggered entrance, hairline draws on hover */}
            <StaggerGroup step={100} delay={150} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <div
                  key={pillar.num}
                  className="group relative overflow-hidden p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/70 transition-colors duration-500"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-px w-full origin-left scale-x-0 bg-linear-to-r from-white/70 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                  <span className="text-xs font-mono text-neutral-500 font-bold block mb-1 transition-colors duration-500 group-hover:text-white">
                    {pillar.num}
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-light">
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </StaggerGroup>
          </div>

        </div>
      </div>
    </section>
  );
}
