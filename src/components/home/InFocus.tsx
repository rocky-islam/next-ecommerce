import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getFeaturedProducts } from "@/lib/shopify/products";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";
import { InFocusTrack } from "./InFocusTrack";

/**
 * Spotlight on the store's #1 best-seller: info stays pinned while its
 * photography travels past (desktop).
 */
export async function InFocus() {
  const [product] = await getFeaturedProducts(1);
  if (!product) return null;

  const images = product.images?.nodes?.length
    ? product.images.nodes
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  if (images.length === 0) return null;

  const price = product.priceRange.minVariantPrice;
  const compare = product.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscountPercentage(price.amount, compare?.amount);
  const sizes =
    product.options?.find((o) => /size/i.test(o.name))?.values.filter((v) => !v.startsWith("#")) ?? [];

  return (
    <section aria-label="In focus" className="relative bg-[#F4F4F1] border-t border-neutral-200/70">
      <InFocusTrack images={images} title={product.title}>
        <Reveal y={12} className="flex items-center gap-3">
          <span className="h-px w-10 bg-neutral-900" />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
            IN FOCUS // BEST SELLER
          </span>
        </Reveal>

        {product.vendor && (
          <Reveal delay={80} y={10}>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
              {product.vendor}
            </p>
          </Reveal>
        )}

        <SplitText
          as="h2"
          delay={120}
          stagger={55}
          text={product.title}
          className="mt-2 text-3xl xl:text-4xl font-black uppercase tracking-tight leading-[1.05] text-neutral-900"
        />

        <StaggerGroup delay={300} step={90} y={14} className="mt-6 space-y-5">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-mono font-bold text-neutral-900">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {compare && discount !== null && discount > 0 && (
              <>
                <span className="text-sm font-mono text-neutral-400 line-through">
                  {formatPrice(compare.amount, compare.currencyCode)}
                </span>
                <span className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  -{discount}%
                </span>
              </>
            )}
          </div>

          {sizes.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                Available sizes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className="min-w-9 rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-center font-mono text-xs text-neutral-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <Magnetic>
              <Link
                href={`/products/${product.handle}`}
                className="group btn-shine inline-flex items-center gap-2.5 rounded-full bg-neutral-900 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-black transition-colors"
              >
                <RollText>View The Product</RollText>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>
          </div>
        </StaggerGroup>
      </InFocusTrack>
    </section>
  );
}
