import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { RollText } from "@/components/motion/RollText";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
  /** Replaces the link on the right (e.g. supporting copy). */
  aside?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/** Eyebrow + masked headline + rolling CTA link, shared by home/product sections. */
export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel,
  aside,
  tone = "light",
  className,
}: SectionHeaderProps) {
  const dark = tone === "dark";

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-end justify-between mb-12",
        className
      )}
    >
      <div>
        <Reveal y={12}>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2 flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn("inline-block h-px w-6", dark ? "bg-neutral-600" : "bg-neutral-300")}
            />
            {eyebrow}
          </p>
        </Reveal>
        <SplitText
          as="h2"
          text={title}
          delay={80}
          className={cn(
            "text-3xl sm:text-5xl font-black tracking-tight font-sans uppercase",
            dark ? "text-white" : "text-neutral-900"
          )}
        />
      </div>

      {aside ? (
        <Reveal delay={200} y={16}>
          {aside}
        </Reveal>
      ) : href && linkLabel ? (
        <Reveal delay={200} y={16}>
          <Link
            href={href}
            className={cn(
              "group mt-4 md:mt-0 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 transition-colors",
              dark ? "text-white hover:text-neutral-300" : "text-neutral-900 hover:text-neutral-600"
            )}
          >
            <RollText>{linkLabel}</RollText>
            <span
              className={cn(
                "w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-500 group-hover:rotate-45",
                dark
                  ? "border-neutral-700 group-hover:bg-white group-hover:text-black group-hover:border-white"
                  : "border-neutral-300 group-hover:bg-neutral-900 group-hover:text-white group-hover:border-neutral-900"
              )}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </Reveal>
      ) : null}
    </div>
  );
}
