import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type SpinBadgeProps = {
  text: string;
  className?: string;
  /** Centre glyph. */
  children?: ReactNode;
  /** Seconds per revolution. */
  duration?: number;
  tone?: "light" | "dark";
};

/**
 * Circular rotating type badge (SVG textPath, CSS rotation only).
 * Decorative: hidden from assistive tech.
 */
export function SpinBadge({ text, className, children, duration = 18, tone = "dark" }: SpinBadgeProps) {
  const id = useId().replace(/:/g, "");
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative grid place-items-center rounded-full select-none",
        tone === "dark" ? "text-white" : "text-neutral-900",
        className
      )}
    >
      <svg
        viewBox="0 0 120 120"
        className="animate-spin-slow absolute inset-0 h-full w-full"
        style={{ animationDuration: `${duration}s` }}
      >
        <defs>
          <path id={`spin-${id}`} d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-current text-[10.5px] font-bold uppercase" style={{ letterSpacing: "0.32em" }}>
          <textPath href={`#spin-${id}`} textLength="286" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
