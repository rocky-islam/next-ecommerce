"use client";

import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Odometer-style value swap for prices, counts and subtotals.
 * The old value slides out upward while the new one rises in.
 * Skips the animation on first render to avoid any layout flash.
 */
export function RollingValue({
  value,
  className,
}: {
  value: string | number;
  className?: string;
}) {
  return (
    <span className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          className="inline-block whitespace-nowrap"
          initial={{ y: "90%", opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-90%", opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.45, ease: EASE.out }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
