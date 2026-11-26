"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

type CountUpProps = {
  to: number;
  /** ms */
  duration?: number;
  /** ms */
  delay?: number;
  className?: string;
  locale?: string;
};

/**
 * Counts up to `to` when scrolled into view. The final value is server
 * rendered (SEO, no-JS, reduced motion); the count writes straight to the
 * DOM so it never re-renders React per frame.
 */
export function CountUp({ to, duration = 1800, delay = 0, className, locale = "en-US" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (v: number) => Math.round(v).toLocaleString(locale);

  // Start from zero while still off-screen.
  useEffect(() => {
    if (reduce || !ref.current || inView) return;
    ref.current.textContent = format(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  useEffect(() => {
    if (!inView || reduce || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: duration / 1000,
      delay: delay / 1000,
      ease: EASE.out,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, to, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {format(to)}
    </span>
  );
}
