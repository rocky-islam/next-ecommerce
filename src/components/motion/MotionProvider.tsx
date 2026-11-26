"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * App-wide Motion defaults. `reducedMotion="user"` makes every Motion
 * component drop transform/layout animation when the OS asks for reduced
 * motion (opacity fades are kept, which is the accessible default).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}
