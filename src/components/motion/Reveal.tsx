"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal, type RevealTrigger } from "./use-reveal";

type RevealTag =
  | "div"
  | "section"
  | "header"
  | "footer"
  | "article"
  | "aside"
  | "nav"
  | "ul"
  | "ol"
  | "li"
  | "p"
  | "span";

type RevealProps = {
  children: ReactNode;
  as?: RevealTag;
  className?: string;
  /** Delay in ms */
  delay?: number;
  /** Start offset in px */
  y?: number;
  x?: number;
  /** Starting scale, e.g. 0.96 */
  scale?: number;
  trigger?: RevealTrigger;
  amount?: number;
  id?: string;
};

/**
 * Fade + rise into view. Renders its own wrapper so it never fights
 * with transition/transform utilities on the content inside.
 */
export function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  trigger = "inView",
  amount,
  id,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLElement>({ trigger, amount });
  const Tag = as as ElementType;

  const style = {
    "--d": `${delay}ms`,
    "--ry": `${y}px`,
    "--rx": `${x}px`,
    "--rs": scale,
  } as CSSProperties;

  if (trigger === "mount") {
    return (
      <Tag id={id} data-reveal-mount="" className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Tag
      id={id}
      ref={ref}
      data-reveal=""
      data-visible={visible}
      className={cn(className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
