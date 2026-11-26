"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

export type RevealTrigger = "inView" | "mount";

type Options = {
  trigger?: RevealTrigger;
  /** Fraction of the element that must be visible (0–1). */
  amount?: number;
  /** Shrinks the viewport bottom so reveals fire slightly after entering. */
  margin?: `${number}px ${number}px ${number}px ${number}px` | `${number}px ${number}px ${number}% ${number}px`;
};

/**
 * Shared in-view detection for every CSS-driven reveal primitive.
 * Returns a ref plus the `data-visible` value to spread onto the element.
 */
export function useReveal<T extends Element>({
  trigger = "inView",
  amount = 0.15,
  margin = "0px 0px -8% 0px",
}: Options = {}) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, amount, margin });
  const visible = trigger === "mount" || inView;
  return { ref, visible: visible ? "true" : "false" } as const;
}
