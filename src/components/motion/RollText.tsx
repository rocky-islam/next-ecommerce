import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Label that rolls up to reveal an identical copy on hover of the nearest
 * `.group` (or `.roll-trigger`). The clone is hidden from assistive tech.
 * Server-safe: pure CSS.
 */
export function RollText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("roll", className)}>
      <span>{children}</span>
      <span aria-hidden="true">{children}</span>
    </span>
  );
}
