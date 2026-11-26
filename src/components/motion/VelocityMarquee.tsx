"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

type VelocityMarqueeProps = {
  children: ReactNode;
  /** Base drift in % of one copy per second; negative scrolls right. */
  baseVelocity?: number;
  className?: string;
  /** Max skew (deg) applied while the page is scrolling fast. */
  maxSkew?: number;
};

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Scroll-reactive marquee: drifts at a base speed, accelerates with scroll
 * velocity, flips direction with scroll direction, and leans into motion.
 * Frames are skipped while off-screen.
 */
export function VelocityMarquee({
  children,
  baseVelocity = 2,
  className,
  maxSkew = 7,
}: VelocityMarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();

  const base = useMotionValue(0);
  const skewX = useMotionValue(0);
  const { scrollY } = useScroll();
  // Four copies; one copy = 25% of the track.
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);
  const boost = useRef(0);

  // All per-frame work (velocity sampling, easing, skew) happens here and
  // only while on screen, so off-screen marquees cost nothing on scroll.
  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const v = scrollY.getVelocity(); // px/s
    // Ease toward the target boost so speed changes feel weighted
    const target = Math.max(-4, Math.min(4, v / 250));
    boost.current += (target - boost.current) * Math.min(1, delta / 120);
    if (boost.current < -0.05) direction.current = -1;
    else if (boost.current > 0.05) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(boost.current));
    base.set(base.get() - move / 4);
    const skew = Math.max(-maxSkew, Math.min(maxSkew, -(boost.current / 6) * maxSkew));
    if (Math.abs(skew - skewX.get()) > 0.01) skewX.set(skew);
  });

  return (
    <div ref={ref} className={cn("overflow-hidden whitespace-nowrap", className)}>
      <motion.div
        className="flex w-max flex-nowrap will-change-transform"
        style={reduce ? undefined : { x, skewX }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center" aria-hidden={i > 0 || undefined}>
            {children}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
