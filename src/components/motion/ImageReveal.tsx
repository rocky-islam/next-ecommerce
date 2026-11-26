"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal, type RevealTrigger } from "./use-reveal";

type ImageRevealProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  /** Wipe direction. "expand" grows from an inset rounded frame. */
  direction?: "up" | "down" | "left" | "right" | "expand";
  trigger?: RevealTrigger;
  /** ms */
  delay?: number;
  /** Starting scale of the inner layer (settles to 1). */
  innerScale?: number;
};

/**
 * Cinematic clip-path reveal: the frame wipes open while the content
 * inside settles from a slight zoom. Pure CSS once triggered.
 */
export function ImageReveal({
  children,
  className,
  innerClassName,
  direction = "up",
  trigger = "inView",
  delay = 0,
  innerScale = 1.18,
}: ImageRevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>({ trigger, amount: 0.2 });

  const frame = (
    <div
      data-image-reveal={direction}
      data-trigger={trigger}
      data-visible={trigger === "mount" ? undefined : visible}
      className={cn("relative overflow-hidden", className)}
      style={
        { "--d": `${delay}ms`, "--inner-scale": innerScale } as CSSProperties
      }
    >
      <div data-image-reveal-inner="" className={cn("relative h-full w-full", innerClassName)}>
        {children}
      </div>
    </div>
  );

  if (trigger === "mount") return frame;

  // IntersectionObserver ignores a fully clip-path'd target, so observe an
  // unclipped wrapper and let the clip live on the inner frame.
  return <div ref={ref}>{frame}</div>;
}
