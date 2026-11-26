"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { ShopifyImage } from "@/lib/shopify/types";
import { ScrollRow } from "@/components/motion/ScrollRow";

type InFocusTrackProps = {
  images: ShopifyImage[];
  title: string;
  /** Left column content (product info), stays put while images travel. */
  children: React.ReactNode;
};

/**
 * Desktop: the section pins and its image strip travels horizontally as the
 * page scrolls (scroll-jacked gallery). Mobile / reduced motion: a plain
 * swipeable strip, no pinning.
 */
export function InFocusTrack({ images, title, children }: InFocusTrackProps) {
  const desktop = useMediaQuery("(min-width: 1024px)");
  const reduce = useReducedMotion();
  const pinned = desktop && !reduce && images.length > 1;

  if (!pinned) {
    return (
      // grid-cols-1 = minmax(0, 1fr): without it the column grows to the
      // image strip's full width and mobile browsers zoom the page out
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4 min-w-0">{children}</div>
        <div className="lg:col-span-8 min-w-0">
          <ScrollRow label={`${title} images`}>
            <div className="flex w-max gap-4 p-1">
              {images.map((img, i) => (
                <Frame key={img.url + i} img={img} title={title} index={i} total={images.length} />
              ))}
            </div>
          </ScrollRow>
        </div>
      </div>
    );
  }

  return <PinnedTrack images={images} title={title}>{children}</PinnedTrack>;
}

function PinnedTrack({ images, title, children }: InFocusTrackProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  // Horizontal travel = track overflow beyond its viewport
  useEffect(() => {
    const measure = () => {
      const t = trackRef.current;
      const v = viewportRef.current;
      if (t && v) setDistance(Math.max(0, t.scrollWidth - v.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, (p) => -p * distance);
  const bar = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(images.length - 1, Math.round(p * (images.length - 1)));
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    // Height sets how long the pin lasts: ~70vh of scroll per image
    <div ref={sectionRef} style={{ height: `${100 + images.length * 70}vh` }} className="relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 grid grid-cols-12 gap-10 items-center">
          <div className="col-span-4">
            {children}
            {/* Progress */}
            <div className="mt-10 flex items-center gap-4">
              <span className="font-mono text-xs font-bold tabular-nums text-neutral-900">
                {String(active + 1).padStart(2, "0")}
              </span>
              <span className="relative h-px flex-1 bg-neutral-300 overflow-hidden">
                <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-neutral-900" />
              </span>
              <span className="font-mono text-xs text-neutral-400 tabular-nums">
                {String(images.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Clipped to its column on the left (soft fade), bleeding off the
              right edge of the screen so frames enter from beyond it */}
          <div
            ref={viewportRef}
            className="col-span-8 overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,#000_7%)]"
            style={{ marginRight: "calc(-1 * (max(100vw - 80rem, 0px) / 2 + 2rem))" }}
          >
            <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-8 pr-16 will-change-transform">
              {images.map((img, i) => (
                <Frame key={img.url + i} img={img} title={title} index={i} total={images.length} large active={i === active} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame({
  img,
  title,
  index,
  total,
  large = false,
  active = true,
}: {
  img: ShopifyImage;
  title: string;
  index: number;
  total: number;
  large?: boolean;
  active?: boolean;
}) {
  return (
    <figure
      className={`relative shrink-0 overflow-hidden rounded-3xl bg-white ring-1 ring-neutral-200/80 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        large ? "h-[62vh] aspect-4/5" : "w-[72vw] sm:w-[46vw] aspect-4/5"
      } ${active ? "opacity-100 scale-100" : "opacity-60 scale-[0.96]"}`}
    >
      <Image
        src={img.url}
        alt={img.altText || `${title} view ${index + 1}`}
        fill
        sizes={large ? "(max-width: 1440px) 45vw, 600px" : "72vw"}
        className="object-contain p-6"
      />
      <figcaption className="absolute left-5 bottom-4 font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-400">
        View {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </figcaption>
    </figure>
  );
}
