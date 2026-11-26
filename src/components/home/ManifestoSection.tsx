import { ArrowDownRight } from "lucide-react";
import { ScrollText } from "@/components/motion/ScrollText";
import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { SpinBadge } from "@/components/motion/SpinBadge";

const stats = [
  { value: 100, prefix: "", suffix: "%", label: "Genuine inventory from authorized partners" },
  { value: 64, prefix: "", suffix: "", label: "Districts with express tracked dispatch" },
  { value: 7, prefix: "", suffix: "-Day", label: "Concierge size exchange window" },
  { value: 2500, prefix: "৳", suffix: "+", label: "Orders ship complimentary nationwide" },
];

/**
 * Studio manifesto: a scroll-lit statement followed by count-up proof points.
 */
export function ManifestoSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F4F1] py-24 sm:py-32 border-t border-neutral-200/70">
      {/* Fine architectural grid, faded at the edges */}
      <div aria-hidden="true" className="bg-grid-light pointer-events-none absolute inset-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 mb-10 sm:mb-14">
          <Reveal y={12} className="flex items-center gap-3">
            <span className="h-px w-10 bg-neutral-900" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
              STUDIO NOTE
            </span>
          </Reveal>
          <SpinBadge
            tone="light"
            text="KINETIC STUDIO • CERTIFIED AUTHENTIC • "
            className="h-24 w-24 sm:h-28 sm:w-28 shrink-0"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-neutral-900 text-white">
              <ArrowDownRight className="h-4 w-4" />
            </span>
          </SpinBadge>
        </div>

        <ScrollText
          as="blockquote"
          text="“True comfort is quiet. It is the absence of pressure points, the resilience of good leather, and the confidence of every step.”"
          className="max-w-5xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-neutral-900 uppercase"
        />

        <StaggerGroup
          step={110}
          y={28}
          className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
        >
          {stats.map((s) => (
            <div key={s.label} className="group relative pt-6">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-neutral-300" />
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-neutral-900 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
              <p className="flex items-baseline text-4xl sm:text-6xl font-black tracking-tighter text-neutral-900 tabular-nums">
                {s.prefix && <span className="mr-1 text-2xl sm:text-4xl font-light">{s.prefix}</span>}
                <CountUp to={s.value} />
                {s.suffix && <span className="ml-0.5 text-xl sm:text-3xl font-light">{s.suffix}</span>}
              </p>
              <p className="mt-3 max-w-[16rem] text-[11px] sm:text-xs font-medium uppercase tracking-wider text-neutral-500 leading-relaxed">
                {s.label}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
