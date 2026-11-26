"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { EASE } from "@/lib/motion";

/**
 * Floating back-to-top control whose ring traces page scroll progress.
 */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 700;
    setShow((prev) => (prev === next ? prev : next));
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.45, ease: EASE.out }}
          className="back-to-top group fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 grid h-12 w-12 place-items-center rounded-full bg-neutral-950/90 text-white shadow-2xl ring-1 ring-white/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="24" cy="24" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />
          </svg>
          <span className="relative block h-4 w-4 overflow-hidden">
            <ArrowUp className="absolute inset-0 h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full" />
            <ArrowUp className="absolute inset-0 h-4 w-4 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
