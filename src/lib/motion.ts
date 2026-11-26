/**
 * Global motion design tokens.
 * Mirrors the CSS custom properties in globals.css so JS-driven (Motion)
 * and CSS-driven animations share one timing language.
 */

export const EASE = {
  /** Signature curve: fast start, long luxurious settle */
  out: [0.16, 1, 0.3, 1],
  outQuart: [0.25, 1, 0.5, 1],
  inOut: [0.76, 0, 0.24, 1],
  in: [0.11, 0, 0.5, 0],
} as const;

export const SPRING = {
  /** Micro-interactions: taps, toggles, badges */
  snappy: { type: "spring", stiffness: 480, damping: 32 },
  /** Layout morphs: active pills, indicators */
  glide: { type: "spring", stiffness: 380, damping: 34, mass: 0.8 },
  /** Panels and drawers */
  drawer: { type: "spring", stiffness: 300, damping: 34 },
  /** Cursor-following elements */
  follow: { stiffness: 200, damping: 18, mass: 0.5 },
} as const;

/** Updates --mx / --my CSS vars for `.spotlight` overlays. No React re-render. */
export function setPointerVars(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/** Builds a CSS-ident-safe view-transition name. */
export function toTransitionName(prefix: string, value: string) {
  return `${prefix}-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}
