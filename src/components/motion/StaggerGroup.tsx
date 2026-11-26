"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReveal, type RevealTrigger } from "./use-reveal";

type StaggerProps = {
  children: ReactNode;
  as?: "div" | "section" | "ul" | "ol" | "nav" | "dl";
  className?: string;
  /** Delay before the first child, ms */
  delay?: number;
  /** Gap between children, ms */
  step?: number;
  /** Rise distance in px */
  y?: number;
  trigger?: RevealTrigger;
  amount?: number;
  "aria-label"?: string;
};

/**
 * Staggers its DIRECT children into view with CSS only — no wrapper
 * elements are injected, so grids, flex layouts and lists stay intact.
 */
export function StaggerGroup({
  children,
  as = "div",
  className,
  delay = 0,
  step = 70,
  y = 24,
  trigger = "inView",
  amount = 0.1,
  ...rest
}: StaggerProps) {
  const { ref, visible } = useReveal<HTMLElement>({ trigger, amount });
  const Tag = as as ElementType;

  return (
    <Tag
      ref={trigger === "mount" ? undefined : ref}
      data-stagger={trigger === "mount" ? "mount" : ""}
      data-visible={trigger === "mount" ? undefined : visible}
      className={className}
      style={
        {
          "--d": `${delay}ms`,
          "--step": `${step}ms`,
          "--ry": `${y}px`,
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}
