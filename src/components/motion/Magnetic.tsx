"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/hooks/use-media-query";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** 0–1: how far the element follows the cursor. */
  strength?: number;
};

/**
 * Magnetic hover: the wrapped CTA leans toward the cursor and springs back.
 * Only active on precise pointers; touch and reduced-motion get a static element.
 */
export function Magnetic({ children, className, strength = 0.3 }: MagneticProps) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const x = useSpring(0, SPRING.follow);
  const y = useSpring(0, SPRING.follow);
  const enabled = fine && !reduce;

  return (
    <motion.span
      className={cn("inline-block", className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={(e) => {
        if (!enabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={{ scale: 0.96 }}
    >
      {children}
    </motion.span>
  );
}
