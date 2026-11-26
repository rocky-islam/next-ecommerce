"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Loader2 } from "lucide-react";
import { Product } from "@/lib/shopify/types";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem, isMutating } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

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

  return (
    <div className="group relative flex flex-col bg-white">
      {/* Image container */}
      <Link
        href={`/products/${product.handle}`}
        className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F4F2] border border-neutral-200/60 transition-all duration-300 group-hover:border-neutral-400 group-hover:shadow-md"
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText || product.title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-cover transition-transform duration-700 ease-out group-hover:scale-106 ${
                secondaryImage ? "group-hover:opacity-0" : ""
              }`}
            />
            {secondaryImage && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.altText || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100 group-hover:scale-106"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
            Silhouette Pending
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
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
          <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden sm:block z-10">
            {hasMultipleVariants ? (
              <span className="w-full py-2.5 px-3 bg-white/95 backdrop-blur-md text-neutral-900 text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-lg border border-neutral-200 flex items-center justify-center gap-1.5 hover:bg-black hover:text-white transition-colors">
                Select Options
              </span>
            ) : (
              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={isAdding || isMutating}
                className="w-full py-2.5 px-3 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors disabled:opacity-70"
              >
                {isAdding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Quick Bag</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </Link>

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
          {product.title}
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
    </div>
  );
}
