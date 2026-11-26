import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Seconds per full loop */
  duration?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

/**
 * Seamless infinite marquee (CSS transform only, GPU-composited).
 * The track renders two copies and slides exactly -50%; the second copy
 * is aria-hidden so screen readers hear the content once.
 */
export function Marquee({
  children,
  className,
  trackClassName,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("marquee", className)}
      data-reverse={reverse}
      data-pause={pauseOnHover}
      style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
    >
      <div className="marquee-track">
        <div className={cn("flex shrink-0 items-center", trackClassName)}>{children}</div>
        <div className={cn("flex shrink-0 items-center", trackClassName)} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
