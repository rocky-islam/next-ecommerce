"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query without effects or re-render loops.
 * Returns `false` during SSR so desktop-only effects never hydrate mismatched.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on devices with a precise hovering pointer (mouse / trackpad). */
export function useFinePointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}
