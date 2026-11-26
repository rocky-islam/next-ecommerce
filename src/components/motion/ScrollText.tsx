"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

type ScrollTextProps = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Opacity of words not yet reached. */
  dim?: number;
};

/**
 * Words light up one after another as the paragraph scrolls through the
 * viewport. Scroll progress is written to a single CSS variable (`--p`);
 * each word derives its own opacity/offset from it in CSS, so a scroll
 * frame costs one style write instead of one per word.
 * Text stays a single real string for SEO and screen readers.
 */
export function ScrollText({ text, as: Tag = "p", className, dim = 0.14 }: ScrollTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    ref.current?.style.setProperty("--p", p.toFixed(4));
  });

  return (
    <Tag
      ref={ref}
      data-scroll-text={reduce ? undefined : ""}
      className={cn("flex flex-wrap", className)}
      style={{ "--n": words.length, "--dim": dim } as CSSProperties}
    >
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className="mr-[0.25em] inline-block">
          <span className="scroll-word inline-block" style={{ "--i": i } as CSSProperties}>
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
