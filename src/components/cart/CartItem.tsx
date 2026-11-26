"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
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
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
      {/* Product Image */}
      <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
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
              className="text-sm font-semibold text-gray-900 hover:text-black line-clamp-1 transition-colors"
            >
              {product.title}
            </Link>
            <button
              onClick={handleRemove}
              disabled={isUpdating || isMutating}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 -mr-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Selected variant details */}
          {merchandise.selectedOptions && merchandise.selectedOptions.length > 0 && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {merchandise.selectedOptions
                .filter((opt) => opt.value !== "Default Title")
                .map((opt) => `${opt.name}: ${opt.value}`)
                .join(" / ")}
            </p>
          )}
        </div>

        {/* Quantity Controls & Line Total */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-md bg-white">
            <button
              type="button"
              onClick={() => handleQuantityChange(line.quantity - 1)}
              disabled={isUpdating || isMutating}
              className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold text-gray-800">
              {isUpdating ? (
                <Loader2 className="w-3 h-3 animate-spin mx-auto text-gray-400" />
              ) : (
                line.quantity
              )}
            </span>
            <button
              type="button"
              onClick={() => handleQuantityChange(line.quantity + 1)}
              disabled={isUpdating || isMutating}
              className="p-1.5 text-gray-500 hover:text-black disabled:opacity-30 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="text-right">
            <span className="text-sm font-bold text-gray-900">{lineTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
