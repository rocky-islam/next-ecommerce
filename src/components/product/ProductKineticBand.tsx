import { VelocityMarquee } from "@/components/motion/VelocityMarquee";

/**
 * Oversized product name band that drifts, speeds up and leans with scroll.
 * Decorative: the name is already the page's h1.
 */
export function ProductKineticBand({ title, vendor }: { title: string; vendor?: string }) {
  const words = [vendor, title].filter(Boolean) as string[];
  return (
    <div aria-hidden="true" className="relative mt-24 sm:mt-32 -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden border-y border-neutral-200/80 py-6 sm:py-8 [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
      <VelocityMarquee baseVelocity={2.2} maxSkew={6}>
        {words.map((w, i) => (
          <span key={w + i} className="flex items-center">
            <span
              className={`px-6 sm:px-10 text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none whitespace-nowrap ${
                i % 2 === 0 ? "text-neutral-900" : "text-transparent [-webkit-text-stroke:1.5px_#171717]"
              }`}
            >
              {w}
            </span>
            <span className="text-neutral-300 text-2xl sm:text-4xl">✦</span>
          </span>
        ))}
      </VelocityMarquee>
    </div>
  );
}
