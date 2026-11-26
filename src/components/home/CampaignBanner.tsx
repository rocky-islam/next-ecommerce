"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

export function CampaignBanner() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-linked "aperture": the banner opens from an inset frame to full
  // bleed as it approaches centre screen while the photo settles from a zoom.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const inset = useTransform(scrollYProgress, [0, 1], [10, 0]);
  const radius = useTransform(scrollYProgress, [0, 1], [56, 24]);
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${radius}px)`;
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

  return (
    <section ref={ref} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        style={reduce ? undefined : { clipPath }}
        className="relative rounded-3xl overflow-hidden min-h-[440px] flex items-center bg-neutral-900 border border-neutral-800 shadow-2xl group"
      >
        {/* Background Image: scroll zoom-settle + slow hover scale */}
        <motion.div
          style={reduce ? undefined : { scale: imageScale }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1200&auto=format&fit=crop"
            alt="Footwear capsule campaign"
            fill
            sizes="(max-width: 1280px) 100vw, 1200px"
            className="object-cover object-center transition-transform duration-[1600ms] ease-out group-hover:scale-106"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-xl p-8 sm:p-14 text-white">
          <Reveal y={12}>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-white/15 backdrop-blur-md border border-white/20 text-neutral-200">
              LIMITED CURATION
            </span>
          </Reveal>

          <SplitText
            as="h3"
            delay={120}
            stagger={70}
            lines={["Style in Motion.", "Built for Reality."]}
            className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-[1.08] mt-4 font-sans"
          />

          <Reveal delay={450} y={16}>
            <p className="mt-4 text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
              Engineered with precision stitching, slip-resistant treads, and breathable
              uppers. Experience certified footwear delivered straight to your door across Bangladesh.
            </p>
          </Reveal>

          <Reveal delay={600} y={16} className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <Link
                href="/products?sort=newest"
                className="group px-8 py-3.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2 shadow-lg"
              >
                <RollText>Shop The Capsule</RollText>
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}
