"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RotateCcw,
  Lock,
} from "lucide-react";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { ProductGallery } from "./ProductGallery";

export function ProductDetails({ product }: { product: Product }) {
  const { addItem, isMutating } = useCart();

  // Find initial variant (first available or first)
  const initialVariant =
    product.variants?.nodes.find((v) => v.availableForSale) ||
    product.variants?.nodes[0];

  // Selected options state: { Size: "10", Color: "Black", ... }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      if (initialVariant?.selectedOptions) {
        initialVariant.selectedOptions.forEach((opt) => {
          initial[opt.name] = opt.value;
        });
      } else if (product.options) {
        product.options.forEach((opt) => {
          if (opt.values.length > 0) {
            initial[opt.name] = opt.values[0];
          }
        });
      }
      return initial;
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>("description");

  // Find the exact variant matching all currently selected options
  const selectedVariant: ProductVariant | undefined = product.variants?.nodes.find(
    (variant) =>
      variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      )
  );

  const currentPrice = selectedVariant
    ? selectedVariant.price
    : product.priceRange.minVariantPrice;

  const currentCompareAtPrice = selectedVariant
    ? selectedVariant.compareAtPrice
    : product.compareAtPriceRange?.minVariantPrice;

  const discount = calculateDiscountPercentage(
    currentPrice.amount,
    currentCompareAtPrice?.amount
  );

  const isAvailable = selectedVariant ? selectedVariant.availableForSale : false;

  const handleOptionSelect = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !isAvailable) return;

    setIsAdding(true);
    const success = await addItem(selectedVariant.id, quantity);
    setIsAdding(false);

    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || !isAvailable) return;

    setIsBuyingNow(true);
    try {
      const { addToCartAction, getCheckoutUrlAction } = await import(
        "@/actions/cart"
      );
      const res = await addToCartAction(selectedVariant.id, quantity);
      if (res.success && res.cart?.checkoutUrl) {
        window.location.href = res.cart.checkoutUrl;
        return;
      }
      const checkoutRes = await getCheckoutUrlAction();
      if (checkoutRes.success && checkoutRes.checkoutUrl) {
        window.location.href = checkoutRes.checkoutUrl;
      }
    } catch (err) {
      console.error("Direct checkout failed:", err);
      alert("Unable to proceed to checkout directly. Please try adding to bag.");
    } finally {
      setIsBuyingNow(false);
    }
  };

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      {/* Left Column: Gallery */}
      <div>
        <ProductGallery
          images={product.images?.nodes || []}
          title={product.title}
          selectedImage={selectedVariant?.image}
        />
      </div>

      {/* Right Column: Info & Purchase */}
      <div className="flex flex-col space-y-7">
        <div>
          {product.vendor && (
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2 font-mono">
              {product.vendor}
            </p>
          )}
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 font-sans uppercase">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-black text-neutral-900 font-mono">
              {formatPrice(currentPrice.amount, currentPrice.currencyCode)}
            </span>
            {currentCompareAtPrice &&
              parseFloat(currentCompareAtPrice.amount) >
                parseFloat(currentPrice.amount) && (
                <span className="text-base text-neutral-400 line-through font-mono">
                  {formatPrice(
                    currentCompareAtPrice.amount,
                    currentCompareAtPrice.currencyCode
                  )}
                </span>
              )}
            {discount !== null && isAvailable && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 rounded-md">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
              {isAvailable ? "In Stock & Ready for Dispatch" : "Temporarily Sold Out"}
            </span>
          </div>
        </div>

        {/* Dynamic Variant Options (Size, Color, etc.) */}
        {product.options &&
          product.options.length > 0 &&
          product.options.some((opt) => opt.name !== "Title") && (
            <div className="space-y-5 pt-4 border-t border-neutral-100">
              {product.options.map((option) => {
                if (option.name === "Title") return null;

                const currentValue = selectedOptions[option.name];

                return (
                  <div key={option.id} className="space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-neutral-900 uppercase tracking-widest text-[11px]">
                        Select {option.name}:
                      </span>
                      <span className="text-neutral-500 font-mono text-xs">
                        {currentValue}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {option.values.map((val) => {
                        const isSelected = currentValue === val;

                        // Check if combination exists
                        const testOptions = { ...selectedOptions, [option.name]: val };
                        const match = product.variants?.nodes.find((v) =>
                          v.selectedOptions.every(
                            (opt) => testOptions[opt.name] === opt.value
                          )
                        );
                        const isComboAvailable = match ? match.availableForSale : false;

                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleOptionSelect(option.name, val)}
                            className={`min-w-14 px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-all ${
                              isSelected
                                ? "bg-black text-white border-black shadow-md scale-102"
                                : isComboAvailable
                                ? "bg-white text-neutral-800 border-neutral-200 hover:border-black"
                                : "bg-neutral-50 text-neutral-300 border-neutral-200 line-through opacity-50 cursor-not-allowed"
                            }`}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* Quantity and Actions */}
        <div className="pt-4 border-t border-neutral-100 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-700">
              Quantity:
            </span>
            <div className="flex items-center border border-neutral-200 rounded-xl bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !isAvailable}
                className="p-2.5 text-neutral-500 hover:text-black disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center text-xs font-mono font-bold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!isAvailable}
                className="p-2.5 text-neutral-500 hover:text-black disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {/* Add to Bag */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding || isMutating}
              className="w-full py-4 px-6 bg-white text-black border-2 border-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:border-neutral-300 disabled:hover:bg-white active:scale-[0.99] shadow-xs"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding to Bag...</span>
                </>
              ) : justAdded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAvailable ? "Add to Bag" : "Sold Out"}</span>
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isAvailable || isBuyingNow}
              className="w-full py-4 px-6 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] shadow-xl"
            >
              {isBuyingNow ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Order...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Instant Purchase</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 py-5 border-y border-neutral-100 text-center text-[11px] text-neutral-600 uppercase tracking-wider">
          <div className="flex flex-col items-center gap-1.5">
            <Truck className="w-4 h-4 text-neutral-900" />
            <span className="font-semibold">Nationwide Dispatch</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 border-x border-neutral-100">
            <ShieldCheck className="w-4 h-4 text-neutral-900" />
            <span className="font-semibold">100% Genuine Origin</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-neutral-900" />
            <span className="font-semibold">7-Day Exchanges</span>
          </div>
        </div>

        {/* Accordions */}
        <div className="divide-y divide-neutral-100">
          {/* Description */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => toggleSection("description")}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-widest text-neutral-900 py-1"
            >
              <span>Silhouettes &amp; Craftsmanship</span>
              {openSection === "description" ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>
            {openSection === "description" && (
              <div className="mt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-2">
                {product.descriptionHtml ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    className="prose prose-sm max-w-none text-neutral-600"
                  />
                ) : (
                  <p>{product.description || "Specifications detailed by manufacturer."}</p>
                )}
              </div>
            )}
          </div>

          {/* Delivery & Shipping */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => toggleSection("shipping")}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-widest text-neutral-900 py-1"
            >
              <span>Fulfillment &amp; Delivery</span>
              {openSection === "shipping" ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>
            {openSection === "shipping" && (
              <div className="mt-3 text-xs text-neutral-600 leading-relaxed space-y-2 font-light">
                <p>
                  <strong>Metropolitan Dhaka:</strong> Handed over to courier within 24 hours. Expected arrival 2–3 business days.
                </p>
                <p>
                  <strong>All 64 Districts:</strong> Tracked regional delivery within 3–5 business days. Free for orders totaling ৳2,500+.
                </p>
              </div>
            )}
          </div>

          {/* Returns & Exchange */}
          <div className="py-3.5">
            <button
              type="button"
              onClick={() => toggleSection("returns")}
              className="w-full flex items-center justify-between text-left font-bold text-xs uppercase tracking-widest text-neutral-900 py-1"
            >
              <span>Exchange Concierge</span>
              {openSection === "returns" ? (
                <ChevronUp className="w-4 h-4 text-neutral-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-neutral-500" />
              )}
            </button>
            {openSection === "returns" && (
              <div className="mt-3 text-xs text-neutral-600 leading-relaxed space-y-2 font-light">
                <p>
                  We offer a guaranteed 7-day size exchange window. Items must be unworn outdoors with original boxing and brand tags intact.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
