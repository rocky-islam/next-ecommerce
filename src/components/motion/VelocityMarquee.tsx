"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
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
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const skewX = useTransform(smooth, [-2000, 0, 2000], [maxSkew, 0, -maxSkew], { clamp: true });
  // Four copies; one copy = 25% of the track.
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (!inView || reduce) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    const move = direction.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    base.set(base.get() - move / 4);
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
