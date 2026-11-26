"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { CartLine } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

export function CartItemRow({
  line,
  onClose,
}: {
  line: CartLine;
  onClose?: () => void;
}) {
  const { updateItem, removeItem, isMutating } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const merchandise = line.merchandise;
  const product = merchandise.product;

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    await updateItem(line.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await removeItem(line.id);
    setIsUpdating(false);
  };

  const lineTotal = line.cost?.totalAmount?.amount
    ? formatPrice(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)
    : formatPrice(merchandise.price.amount, merchandise.price.currencyCode);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0"
    >
      {/* Product Image */}
      <div className="relative w-20 h-20 bg-neutral-100 rounded-xl overflow-hidden shrink-0 border border-neutral-200/60">
        {merchandise.image || product.featuredImage ? (
          <Image
            src={merchandise.image?.url || product.featuredImage!.url}
            alt={
              merchandise.image?.altText ||
              product.featuredImage?.altText ||
              merchandise.title
            }
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              href={`/products/${product.handle}`}
              onClick={onClose}
              className="text-xs sm:text-sm font-bold text-neutral-900 hover:text-black line-clamp-1 transition-colors uppercase tracking-tight"
            >
              {product.title}
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              disabled={isUpdating || isMutating}
              className="text-neutral-400 hover:text-red-600 transition-colors p-1 -mr-1 cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Variant title */}
          {merchandise.title !== "Default Title" && (
            <p className="text-[11px] text-neutral-500 mt-0.5 uppercase tracking-wider font-mono">
              {merchandise.title}
            </p>
          )}
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={() => handleQuantityChange(line.quantity - 1)}
              disabled={isUpdating || isMutating}
              className="p-1.5 text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </motion.button>
            <span className="px-3 text-xs font-bold text-neutral-900 min-w-6 text-center font-mono">
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin inline-block" />
              ) : (
                line.quantity
              )}
            </span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              type="button"
              onClick={() => handleQuantityChange(line.quantity + 1)}
              disabled={isUpdating || isMutating}
              className="p-1.5 text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40 cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </motion.button>
          </div>

          <span className="text-xs font-black text-neutral-900 font-mono">
            {lineTotal}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
