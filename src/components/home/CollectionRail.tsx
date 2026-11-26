import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCollectionCovers } from "@/lib/shopify/collections";
import { ScrollRow } from "@/components/motion/ScrollRow";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { SectionHeader } from "./SectionHeader";

/** Horizontal rail of the store's real Shopify collections. */
export async function CollectionRail() {
  const collections = await getCollectionCovers(20);
  if (collections.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="SHOP BY COLLECTION"
          title="The Collections"
          href="/products"
          linkLabel="Browse Everything"
        />

        <ScrollRow label="Collections" className="-mx-1">
          <StaggerGroup step={80} y={36} className="flex w-max gap-4 sm:gap-5 p-1 pb-3">
            {collections.map((c, i) => (
              <Link
                key={c.id}
                href={`/collections/${c.handle}`}
                data-cursor-label="Explore"
                className="group relative flex w-[68vw] sm:w-[40vw] md:w-[30vw] lg:w-[17.5rem] shrink-0 flex-col overflow-hidden rounded-3xl bg-[#F4F4F2] ring-1 ring-neutral-200/70 transition-[box-shadow,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]"
              >
                {/* Index + arrow */}
                <div className="relative z-10 flex items-center justify-between p-5">
                  <span className="font-mono text-[11px] font-bold text-neutral-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-neutral-900 shadow-sm transition-all duration-500 group-hover:rotate-45 group-hover:bg-neutral-900 group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                {/* Product photo lifts and tilts on hover */}
                <div className="relative mx-5 aspect-square">
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-[12%] bottom-[6%] h-[10%] rounded-[50%] bg-black/15 blur-xl transition-all duration-700 group-hover:inset-x-[20%] group-hover:bg-black/10"
                  />
                  <Image
                    src={c.image!.url}
                    alt={c.image!.altText || c.title}
                    fill
                    sizes="(max-width: 640px) 68vw, (max-width: 1024px) 40vw, 280px"
                    className="object-contain mix-blend-multiply transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:-rotate-6 group-hover:scale-110"
                  />
                </div>

                <div className="relative z-10 mt-auto p-5 pt-6">
                  <h3 className="text-lg font-black uppercase tracking-tight text-neutral-900">
                    {c.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-px w-full origin-left scale-x-0 bg-neutral-900 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                </div>
              </Link>
            ))}
          </StaggerGroup>
        </ScrollRow>
      </div>
    </section>
  );
}
