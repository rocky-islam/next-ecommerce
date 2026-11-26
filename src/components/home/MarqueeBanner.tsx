import { Marquee } from "@/components/motion/Marquee";

const items = [
  "POWER ATHLETICS",
  "HUSH PUPPIES LEATHER",
  "NORTH STAR STREETWEAR",
  "BUBBLEGUMMERS SCHOOL",
  "COMFIT ERGONOMICS",
  "WEINBRENNER TRAIL",
  "FLOATZ WATERPROOF",
  "64 DISTRICTS EXPRESS DISPATCH",
  "OFFICIAL BDT PRICING",
  "7-DAY CONCIERGE EXCHANGE",
];

export function MarqueeBanner() {
  return (
    <div className="w-full bg-[#0B0B0B] text-neutral-300 py-3.5 border-y border-neutral-800">
      <Marquee duration={40}>
        {items.map((text) => (
          <div
            key={text}
            className="flex items-center mx-6 whitespace-nowrap text-[11px] font-bold tracking-[0.25em] uppercase text-neutral-400 hover:text-white transition-colors"
          >
            <span>{text}</span>
            <span className="ml-12 text-neutral-600 text-[8px]">◆</span>
          </div>
        ))}
      </Marquee>
    </div>
  );
}
