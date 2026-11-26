"use client";

import { useRef, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles, ShieldCheck, Compass, ArrowDown } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useFinePointer } from "@/hooks/use-media-query";
import { SpinBadge } from "@/components/motion/SpinBadge";
import { setPointerVars } from "@/lib/motion";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

export function HeroBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Cinematic scroll-out: copy drifts up and dims, visual sinks slower
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.15]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  // Subtle 3D: the visual leans toward the cursor (fine pointers only)
  const fine = useFinePointer();
  const tilt = fine && !reduce;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 20 });
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 20 });
  const cardX = useSpring(useTransform(px, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 20 });
  const cardY = useSpring(useTransform(py, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    setPointerVars(e);
    if (!tilt) return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative bg-[#0E0E0E] text-white overflow-hidden"
    >
      {/* Architectural grid lines, radially faded */}
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0" />

      {/* Cursor-following spotlight (desktop) */}
      <div
        aria-hidden="true"
        className="spotlight pointer-events-none absolute inset-0 hidden lg:block"
        style={
          {
            "--spot-size": "640px",
            "--spot-color": "rgba(255,255,255,0.055)",
          } as CSSProperties
        }
      />

      {/* Drifting ambient gradients (CSS, compositor-only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-[28rem] h-[28rem] bg-neutral-700/25 rounded-full blur-3xl animate-drift"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-10 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl animate-drift [animation-delay:-7s]"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Editorial Typography */}
          <motion.div
            style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}
            className="lg:col-span-7 flex flex-col items-start z-10"
          >
            {/* Minimalist Season Tag */}
            <Reveal trigger="mount" delay={80} y={14}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-300 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>COLLECTION // 2026 EDITION</span>
              </div>
            </Reveal>

            {/* Main Headline — masked word reveal */}
            <SplitText
              as="h1"
              trigger="mount"
              delay={220}
              stagger={75}
              lines={[
                "ARCHITECTURAL",
                [
                  { text: "FOOTWEAR", className: "text-neutral-400 font-light italic" },
                  { text: "FOR" },
                ],
                "MODERN STEPS.",
              ]}
              className="text-4xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-white font-sans uppercase"
            />

            {/* Narrative Subhead */}
            <Reveal trigger="mount" delay={720} y={18}>
              <p className="mt-6 text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed font-normal">
                A curated harmony of timeless heritage leather craft and all-day
                ergonomics. Discover formal dress shoes, slip-ons, outdoor sandals,
                and school essentials engineered for continuous daily movement.
              </p>
            </Reveal>

            {/* CTAs — magnetic with rolling labels */}
            <Reveal
              trigger="mount"
              delay={860}
              y={18}
              className="mt-8 sm:mt-10 flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <Magnetic>
                <Link
                  href="/products"
                  className="group px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2.5 shadow-2xl"
                >
                  <RollText>Explore Curation</RollText>
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  href="/products?sort=newest"
                  className="group block px-8 py-4 rounded-full border border-neutral-700 bg-neutral-900/60 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest hover:border-neutral-400 hover:bg-neutral-800 transition-colors"
                >
                  <RollText>New Arrivals</RollText>
                </Link>
              </Magnetic>
            </Reveal>

            {/* Brand Credibility Micro-Points */}
            <StaggerGroup
              trigger="mount"
              delay={1000}
              step={110}
              y={12}
              className="mt-12 sm:mt-16 pt-8 border-t border-neutral-800/80 flex flex-wrap gap-8 text-neutral-400 text-xs"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">100% Genuine Inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">64 Districts Express Dispatch</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white shrink-0" />
                <span className="font-medium text-neutral-300">Complimentary ৳2,500+ Shipping</span>
              </div>
            </StaggerGroup>
          </motion.div>

          {/* Right Column: Visual Showcase — expanding clip reveal + scroll parallax */}
          <motion.div
            style={reduce ? undefined : { y: visualY }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              style={tilt ? { rotateX, rotateY, transformPerspective: 1100 } : undefined}
              className="relative w-full max-w-md mx-auto [transform-style:preserve-3d]"
            >
              {/* Rotating seal overlapping the frame */}
              <Reveal
                trigger="mount"
                delay={1400}
                y={0}
                scale={0.6}
                className="absolute -left-12 top-16 z-20 hidden lg:block"
              >
                <SpinBadge
                  text="OFFICIAL BDT PRICING • 64 DISTRICTS • "
                  className="h-28 w-28 rounded-full bg-[#0E0E0E]/80 backdrop-blur-md ring-1 ring-white/10"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-black">
                    <ArrowDown className="h-4 w-4" />
                  </span>
                </SpinBadge>
              </Reveal>

              <ImageReveal
                trigger="mount"
                direction="expand"
                delay={150}
                innerScale={1.22}
                className="relative aspect-4/5 w-full rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop"
                  alt="Contemporary footwear design"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-106"
                />

                {/* Gradient Vignette */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              </ImageReveal>

              {/* Floating Architectural Badge (Top Right) */}
              <Reveal
                trigger="mount"
                delay={1100}
                y={-10}
                className="absolute top-4 right-4 pointer-events-none"
              >
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                  STUDIO // 01
                </div>
              </Reveal>

              {/* Floating Product Highlight Card */}
              <Reveal trigger="mount" delay={1250} y={24} className="absolute bottom-5 inset-x-5">
                <motion.div style={tilt ? { x: cardX, y: cardY, translateZ: 40 } : undefined}>
                <div className="animate-float p-4 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-white/10 shadow-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                      SPOTLIGHT LOOK
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5">
                      Signature Footwear Series
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Direct Official Pricing in BDT
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="group/spot w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-transform hover:scale-110 shrink-0 ml-3 shadow-md"
                    aria-label="View spotlight collection"
                  >
                    <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover/spot:rotate-45" />
                  </Link>
                </div>
                </motion.div>
              </Reveal>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[9px] font-bold uppercase tracking-[0.3em] text-neutral-500"
      >
        <span>Scroll</span>
        <span className="relative block w-px h-10 overflow-hidden bg-neutral-800">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-white/70 animate-scroll-cue" />
        </span>
      </div>
    </section>
  );
}
