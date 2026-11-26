"use client";

import { useEffect, type CSSProperties } from "react";

const WORD = "KINETIC";

/**
 * Brand intro curtain shown once per browser session.
 *
 * Entirely CSS-driven so it plays before hydration: an inline script in
 * the root layout sets `html[data-intro]` (first visit, motion allowed),
 * which un-hides this overlay and pushes page mount animations back by
 * `--intro` so they start as the curtain lifts.
 */
export function IntroCurtain() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute("data-intro")) return;
    // Clear once every delayed mount animation has finished, so later
    // client-side navigations animate without the intro offset.
    const t = window.setTimeout(() => root.removeAttribute("data-intro"), 4500);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="intro" aria-hidden="true">
      <div className="intro-inner">
        <div className="flex items-baseline gap-3">
          <span className="intro-word">
            {WORD.split("").map((ch, i) => (
              <span key={i} className="intro-letter" style={{ "--i": i } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
          <span className="intro-sub">{"// STUDIO"}</span>
        </div>
        <span className="intro-bar">
          <span />
        </span>
      </div>
    </div>
  );
}

/** Runs before first paint: decides whether this load gets the intro. */
export const introScript = `try{var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(!m&&!sessionStorage.getItem('ks-intro')){document.documentElement.setAttribute('data-intro','');sessionStorage.setItem('ks-intro','1')}}catch(e){}`;
