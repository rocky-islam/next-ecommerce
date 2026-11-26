"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

// three.js is only fetched once the section approaches the viewport
const KineticSculpture = dynamic(() => import("@/components/three/KineticSculpture"), {
  ssr: false,
  loading: () => null,
});
const FloatingProduct = dynamic(() => import("@/components/three/FloatingProduct"), {
  ssr: false,
  loading: () => null,
});

export type KineticLabProduct = {
  title: string;
  handle: string;
  vendor?: string;
  price: string;
  image: { url: string; altText?: string | null };
};

// Every point is drawn from claims already made elsewhere on the site
const features = [
  { num: "01", title: "Dual-density cushioning", desc: "Soft underfoot, supportive through the stride." },
  { num: "02", title: "Flexible outsoles", desc: "Bends with the foot for natural, fatigue-free movement." },
  { num: "03", title: "Breathable uppers", desc: "Air keeps moving so long days stay comfortable." },
  { num: "04", title: "Slip-resistant treads", desc: "Confident grip from city pavement to monsoon streets." },
];

export function KineticLab({ product }: { product?: KineticLabProduct }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0.5);
  const reduce = useReducedMotion();
  const near = useInView(sectionRef, { once: true, margin: "500px 0px" });
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const handleError = useCallback(() => setFailed(true), []);
  const handleReady = useCallback(() => setReady(true), []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });
  const wordX = useTransform(scrollYProgress, [0, 1], ["8%", "-18%"]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A] text-white py-24 sm:py-32"
    >
      <div aria-hidden="true" className="bg-grid-dark pointer-events-none absolute inset-0" />

      {/* Giant outlined word drifting with scroll */}
      <motion.p
        aria-hidden="true"
        style={reduce ? { y: "-50%" } : { x: wordX, y: "-50%" }}
        className="pointer-events-none absolute top-1/2 left-0 whitespace-nowrap select-none text-[22vw] font-black uppercase leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.045)]"
      >
        Kinetic Lab
      </motion.p>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        {/* Copy */}
        <div className="lg:col-span-4 relative z-10">
          <Reveal y={12} className="flex items-center gap-3">
            <span className="h-px w-10 bg-white/60" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              KINETIC LAB // 03
            </span>
          </Reveal>
          <SplitText
            as="h2"
            delay={100}
            lines={["Comfort,", [{ text: "Engineered.", className: "italic font-light text-neutral-400" }]]}
            className="mt-4 text-4xl sm:text-6xl font-black uppercase tracking-tight leading-[1.02]"
          />
          <Reveal delay={300} y={16}>
            <p className="mt-6 max-w-sm text-sm text-neutral-400 leading-relaxed">
              Precision stitching, slip-resistant treads, breathable uppers and
              dual-density cushioning: the quiet details that carry you
              through the day.
            </p>
          </Reveal>
          <Reveal delay={450} y={16} className="mt-8">
            <Magnetic>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                <RollText>Explore The Range</RollText>
                <ArrowUpRight className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        {/* 3D stage: the real product floating (falls back to the chrome sculpture) */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <div
              aria-hidden="true"
              className="absolute inset-[12%] rounded-full bg-emerald-400/10 blur-3xl"
            />
            {/* Orbit hairlines */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-[3%] rounded-full border border-white/[0.06]" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-[-4%] rounded-full border border-dashed border-white/[0.05] animate-spin-slow [animation-duration:60s]" />

            {product ? (
              <>
                {/* Static photo until the 3D cut-out is ready, or if WebGL fails */}
                <div
                  className="absolute inset-[16%] transition-opacity duration-700"
                  style={{ opacity: near && !failed && ready ? 0 : 1 }}
                >
                  <Image
                    src={product.image.url}
                    alt={product.image.altText || product.title}
                    fill
                    sizes="(max-width: 1024px) 70vw, 360px"
                    className="object-contain rounded-2xl"
                  />
                </div>
                {near && !failed && (
                  <FloatingProduct
                    src={product.image.url}
                    tone="dark"
                    progressRef={progressRef}
                    still={!!reduce}
                    onError={handleError}
                    onReady={handleReady}
                    className="absolute inset-0 cursor-grab"
                  />
                )}
              </>
            ) : (
              <>
                <div
                  aria-hidden="true"
                  className="absolute inset-[14%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f5f5f5_0%,#8a8a8a_22%,#1d1d1d_55%,#050505_75%)]"
                  style={{ opacity: near && !failed ? 0 : 1, transition: "opacity 900ms ease" }}
                />
                {near && !failed && (
                  <KineticSculpture
                    progressRef={progressRef}
                    still={!!reduce}
                    onError={handleError}
                    className="absolute inset-0"
                  />
                )}
              </>
            )}
          </div>

          {/* Product caption */}
          {product && (
            <Reveal delay={300} y={12} className="mt-2 flex flex-col items-center text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                {ready && !failed ? "Drag to turn · Best seller" : "Best seller"}
              </span>
              <Link
                href={`/products/${product.handle}`}
                className="group mt-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white"
              >
                <span className="link-underline">{product.title}</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
              <span className="mt-1 font-mono text-xs text-neutral-400">
                {product.vendor ? `${product.vendor} · ` : ""}
                {product.price}
              </span>
            </Reveal>
          )}
        </div>

        {/* Feature list */}
        <StaggerGroup step={110} delay={200} y={20} className="lg:col-span-3 relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {features.map((f) => (
            <div
              key={f.num}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors duration-500 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-linear-to-b from-emerald-400/80 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
              />
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] font-bold text-neutral-500 transition-colors duration-500 group-hover:text-emerald-400">
                  {f.num}
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider">{f.title}</h3>
              </div>
              <p className="mt-1.5 pl-7 text-xs text-neutral-400 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
