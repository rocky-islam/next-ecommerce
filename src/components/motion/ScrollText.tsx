"use client";

import { useRef, type ElementType } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
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
 * viewport. Text stays a single real string for SEO and screen readers.
 */
export function ScrollText({ text, as: Tag = "p", className, dim = 0.14 }: ScrollTextProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={cn("flex flex-wrap", className)}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          dim={reduce ? 1 : dim}
        >
          {word}
        </Word>
      ))}
    </Tag>
  );
}

function Word({
  children,
  progress,
  range,
  dim,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  dim: number;
}) {
  const opacity = useTransform(progress, range, [dim, 1]);
  const y = useTransform(progress, range, [dim === 1 ? 0 : 6, 0]);
  return (
    <span aria-hidden="true" className="mr-[0.25em] inline-block">
      <motion.span className="inline-block" style={{ opacity, y }}>
        {children}
      </motion.span>
    </span>
  );
}
