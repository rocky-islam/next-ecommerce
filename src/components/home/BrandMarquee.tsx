import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

const houses = [
  "POWER",
  "HUSH PUPPIES",
  "NORTH STAR",
  "BUBBLEGUMMERS",
  "COMFIT",
  "WEINBRENNER",
  "FLOATZ",
];

/**
 * Oversized editorial type band: two counter-scrolling rows that speed up,
 * reverse and lean with scroll velocity; solid and outlined letterforms.
 */
export function BrandMarquee() {
  return (
    <section
      aria-label="Brand houses"
      className="py-14 sm:py-20 bg-white overflow-hidden border-t border-neutral-200/70"
    >
      <VelocityMarquee baseVelocity={3} className="py-1">
        {houses.map((name, i) => (
          <span key={name} className="flex items-center">
            <span
              className={`px-6 sm:px-10 text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap transition-colors duration-500 ${
                i % 2 === 0
                  ? "text-neutral-900 hover:text-neutral-500"
                  : "text-transparent [-webkit-text-stroke:1.5px_#171717] hover:text-neutral-900"
              }`}
            >
              {name}
            </span>
            <span aria-hidden="true" className="text-neutral-300 text-2xl sm:text-4xl">
              ✦
            </span>
          </span>
        ))}
      </VelocityMarquee>
      <VelocityMarquee baseVelocity={-2.4} className="mt-3 sm:mt-5 py-1">
        {houses.map((name, i) => (
          <span key={name} className="flex items-center">
            <span
              className={`px-6 sm:px-10 text-3xl sm:text-5xl lg:text-6xl font-light italic uppercase tracking-tight leading-none whitespace-nowrap transition-colors duration-500 ${
                i % 2 === 0 ? "text-neutral-300 hover:text-neutral-900" : "text-neutral-400 hover:text-neutral-900"
              }`}
            >
              {name}
            </span>
            <span aria-hidden="true" className="text-neutral-200 text-xl sm:text-3xl">
              —
            </span>
          </span>
        ))}
      </VelocityMarquee>
    </section>
  );
}
