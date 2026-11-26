"use client";

import { Fragment, type CSSProperties, type ElementType } from "react";
import { useReveal, type RevealTrigger } from "./use-reveal";

export type TextSegment = { text: string; className?: string };
export type TextLine = string | TextSegment[];

type SplitTextProps = {
  /** Single string, or explicit lines (each a string or styled segments). */
  text?: string;
  lines?: TextLine[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  /** Delay before first word, ms */
  delay?: number;
  /** Gap between words, ms */
  stagger?: number;
  trigger?: RevealTrigger;
};

/**
 * Masked word-by-word headline reveal. Words stay real text nodes
 * (separated by spaces), so SEO and screen readers read the full phrase.
 */
export function SplitText({
  text,
  lines,
  as = "h2",
  className,
  delay = 0,
  stagger = 55,
  trigger = "inView",
}: SplitTextProps) {
  const { ref, visible } = useReveal<HTMLElement>({ trigger, amount: 0.4 });
  const Tag = as as ElementType;

  const normalized: TextSegment[][] = (lines ?? [text ?? ""]).map((line) =>
    typeof line === "string" ? [{ text: line }] : line
  );
  const multiline = normalized.length > 1;

  let wordIndex = 0;

  return (
    <Tag
      ref={trigger === "mount" ? undefined : ref}
      data-split={trigger === "mount" ? "mount" : "inview"}
      data-visible={trigger === "mount" ? undefined : visible}
      className={className}
    >
      {normalized.map((segments, lineIdx) => {
        const words = segments.flatMap((seg) =>
          seg.text
            .split(/\s+/)
            .filter(Boolean)
            .map((word) => ({ word, className: seg.className }))
        );

        const content = words.map(({ word, className: wordClass }, i) => {
          const d = delay + wordIndex++ * stagger;
          return (
            <Fragment key={`${lineIdx}-${i}`}>
              <span className="split-mask">
                <span
                  className={wordClass ? `split-word ${wordClass}` : "split-word"}
                  style={{ "--d": `${d}ms` } as CSSProperties}
                >
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          );
        });

        return multiline ? (
          <Fragment key={lineIdx}>
            <span className="block">{content}</span>
            {lineIdx < normalized.length - 1 ? " " : null}
          </Fragment>
        ) : (
          <Fragment key={lineIdx}>{content}</Fragment>
        );
      })}
    </Tag>
  );
}
