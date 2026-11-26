"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { Product } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { SplitText } from "@/components/motion/SplitText";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { CountUp } from "@/components/motion/CountUp";

const isCode = (v: string) => v.startsWith("#");

/**
 * "The Details" — a spec sheet built only from the product's own data,
 * beside a large photo that settles from a zoom as it scrolls through.
 */
export function ProductSpecSheet({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  const images = product.images?.nodes ?? [];
  const photo = images[1] ?? images[0] ?? product.featuredImage;

  const optionValues = (re: RegExp) =>
    product.options?.find((o) => re.test(o.name))?.values.filter((v) => !isCode(v)) ?? [];
  const sizes = optionValues(/size/i);
  const colours = optionValues(/colou?r/i);

  const variants = product.variants?.nodes ?? [];
  const inStock = variants.filter((v) => v.availableForSale).length;
  // A size is available if any variant with that size is
  const sizeAvailable = (size: string) =>
    variants.some((v) => v.availableForSale && v.selectedOptions.some((o) => /size/i.test(o.name) && o.value === size));

  const min = product.priceRange.minVariantPrice;
  const max = product.priceRange.maxVariantPrice;
  const priceText =
    max && Number(max.amount) > Number(min.amount)
      ? `${formatPrice(min.amount, min.currencyCode)} – ${formatPrice(max.amount, max.currencyCode)}`
      : formatPrice(min.amount, min.currencyCode);

  const rows: { label: string; value: React.ReactNode }[] = [
    ...(product.vendor ? [{ label: "Brand", value: product.vendor }] : []),
    ...(product.productType ? [{ label: "Category", value: product.productType }] : []),
    ...(sizes.length
      ? [
          {
            label: "Sizes",
            value: (
              <span className="flex flex-wrap justify-end gap-1.5">
                {sizes.map((s) => (
                  <span
                    key={s}
                    className={`min-w-8 rounded-md border px-1.5 py-0.5 text-center font-mono text-[11px] ${
                      sizeAvailable(s)
                        ? "border-neutral-300 text-neutral-900"
                        : "border-neutral-200 text-neutral-300 line-through"
                    }`}
                  >
                    {s}
                  </span>
                ))}
              </span>
            ),
          },
        ]
      : []),
    ...(colours.length ? [{ label: "Colour", value: colours.join(", ") }] : []),
    ...(variants.length
      ? [
          {
            label: "In stock",
            value: (
              <span className="font-mono">
                <CountUp to={inStock} duration={1200} /> of {variants.length} variants
              </span>
            ),
          },
        ]
      : []),
    { label: "Price", value: <span className="font-mono font-bold">{priceText}</span> },
  ];

  return (
    <section ref={ref} aria-label="Product details" className="mt-24 sm:mt-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {photo && (
          <div className="lg:col-span-5 min-w-0">
          <ImageReveal
            direction="up"
            className="relative aspect-square rounded-3xl bg-[#F4F4F2] ring-1 ring-neutral-200/70"
          >
            {/* Own background: the transform makes this a new layer, and the
                photo's multiply blend needs something to blend into */}
            <motion.div style={reduce ? undefined : { scale, y }} className="absolute inset-0 bg-[#F4F4F2]">
              <Image
                src={photo.url}
                alt={photo.altText || `${product.title} detail`}
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-contain p-6 sm:p-10 mix-blend-multiply"
              />
            </motion.div>
            <span className="absolute left-5 top-5 rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neutral-700 ring-1 ring-neutral-200">
              Detail // 02
            </span>
          </ImageReveal>
          </div>
        )}

        <div className={photo ? "lg:col-span-7 min-w-0" : "lg:col-span-12"}>
          <Reveal y={12} className="flex items-center gap-3">
            <span className="h-px w-10 bg-neutral-900" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-500">
              THE DETAILS
            </span>
          </Reveal>
          <SplitText
            as="h2"
            delay={100}
            text="Spec Sheet"
            className="mt-3 text-3xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900"
          />
          <Reveal delay={200} y={10}>
            <p className="mt-2 text-sm text-neutral-500 line-clamp-2">{product.title}</p>
          </Reveal>

          <StaggerGroup step={70} delay={150} y={16} className="mt-8 border-t border-neutral-200">
            {rows.map((row) => (
              <div
                key={row.label}
                className="group relative flex items-center justify-between gap-6 border-b border-neutral-200 py-3.5"
              >
                <span
                  aria-hidden="true"
                  className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-neutral-900 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500 shrink-0">
                  {row.label}
                </span>
                <span className="text-right text-sm font-medium text-neutral-900">{row.value}</span>
              </div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
