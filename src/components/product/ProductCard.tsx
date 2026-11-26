"use client";

import { useState, ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "motion/react";
import { Product } from "@/lib/shopify/types";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";
import { EASE, setPointerVars, toTransitionName } from "@/lib/motion";
import { useCart } from "@/context/cart-context";
import { useFinePointer } from "@/hooks/use-media-query";
import { useReveal } from "@/components/motion/use-reveal";

const TILT_SPRING = { stiffness: 180, damping: 22 };

const labelSwap = {
  initial: { y: 14, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -14, opacity: 0 },
  transition: { duration: 0.28, ease: EASE.out },
};

export function ProductCard({
  product,
  priority = false,
  index = 0,
  morph = true,
}: {
  product: Product;
  priority?: boolean;
  /** Position in the grid, used to stagger entrance per row. */
  index?: number;
  morph?: boolean;
}) {
  const { addItem, isMutating } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { ref: revealRef, visible } = useReveal<HTMLDivElement>({ amount: 0.15 });

  // Subtle 3D tilt — precise pointers only, never for reduced motion
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const tiltEnabled = fine && !reduce;
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -7);
    rotateY.set((x - 0.5) * 7);
    setPointerVars(e);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.compareAtPriceRange?.minVariantPrice;
  const discount = calculateDiscountPercentage(
    price.amount,
    compareAtPrice?.amount
  );

  const images = product.images?.nodes || [];
  const primaryImage = product.featuredImage || images[0];
  const secondaryImage = images.length > 1 ? images[1] : null;

  // Determine if single variant for direct Quick Add
  const variants = product.variants?.nodes || [];
  const hasMultipleVariants = variants.length > 1;
  const defaultVariant = variants[0];
  const isAvailable = product.availableForSale;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || !isAvailable) return;

    setIsAdding(true);
    const success = await addItem(defaultVariant.id, 1);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const imageLink = (
    <Link
      href={`/products/${product.handle}`}
      data-cursor-label="View"
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F4F2] border border-neutral-200/60 transition-[border-color,box-shadow] duration-500 group-hover:border-neutral-400 group-hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.35)] block"
    >
      {primaryImage ? (
        <>
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || product.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-106 ${
              secondaryImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt={secondaryImage.altText || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100"
            />
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
          Silhouette Pending
        </div>
      )}

      {/* Cursor-following glare */}
      <div
        aria-hidden="true"
        className="spotlight absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-soft-light"
        style={
          {
            "--spot-size": "260px",
            "--spot-color": "rgba(255,255,255,0.55)",
          } as CSSProperties
        }
      />

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
        {!isAvailable && (
          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-neutral-900 text-white rounded-md shadow-xs">
            Sold Out
          </span>
        )}
        {discount !== null && isAvailable && (
          <span className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-red-600 text-white rounded-md shadow-xs">
            -{discount}%
          </span>
        )}
      </div>

      {/* Quick Add Overlay on Desktop */}
      {isAvailable && (
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hidden sm:block z-10">
          {hasMultipleVariants ? (
            <span className="w-full py-2.5 px-3 bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center gap-1.5 hover:bg-black hover:text-white transition-colors">
              Select Options
            </span>
          ) : (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              disabled={isAdding || isMutating}
              className="btn-shine w-full py-2.5 px-3 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors disabled:opacity-70 cursor-pointer overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdding ? (
                  <motion.span key="adding" {...labelSwap} className="flex items-center">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </motion.span>
                ) : justAdded ? (
                  <motion.span key="added" {...labelSwap} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added to Bag</span>
                  </motion.span>
                ) : (
                  <motion.span key="idle" {...labelSwap} className="flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Bag</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )}
        </div>
      )}
    </Link>
  );

  return (
    // Outer layer: scroll reveal (CSS) + perspective for the tilt below
    <div
      ref={revealRef}
      data-reveal=""
      data-visible={visible}
      style={{ "--d": `${(index % 4) * 70}ms`, "--ry": "32px", perspective: 1000 } as CSSProperties}
    >
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={tiltEnabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="group relative flex flex-col bg-white h-full"
      >
        {/* Image container (morphs into the product gallery on navigation) */}
        {morph ? (
          <ViewTransition
            name={toTransitionName("product-image", product.handle)}
            share="product-morph"
            default="none"
          >
            {imageLink}
          </ViewTransition>
        ) : (
          imageLink
        )}

        {/* Product Details */}
        <div className="pt-3.5 pb-1 flex flex-col flex-1">
          {product.vendor && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {product.vendor}
            </span>
          )}
          <Link
            href={`/products/${product.handle}`}
            className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 hover:text-black line-clamp-1 transition-colors uppercase tracking-tight"
          >
            <span className="link-underline">{product.title}</span>
          </Link>

          {/* Price & Compare-at price */}
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-black text-neutral-900 font-mono">
              {formatPrice(price.amount, price.currencyCode)}
            </span>
            {compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount) && (
              <span className="text-xs text-neutral-400 line-through font-mono">
                {formatPrice(compareAtPrice.amount, compareAtPrice.currencyCode)}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
