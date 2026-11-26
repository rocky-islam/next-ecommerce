"use client";

import { useState } from "react";
import {
  Loader2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  RotateCcw,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { EASE, SPRING } from "@/lib/motion";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { RollingValue } from "@/components/motion/RollingValue";
import { AccordionItem } from "@/components/motion/Accordion";
import { Product, ProductVariant } from "@/lib/shopify/types";
import { calculateDiscountPercentage, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { ProductGallery } from "./ProductGallery";

const labelSwap = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -16, opacity: 0 },
  transition: { duration: 0.3, ease: EASE.out },
};

/** Check mark that draws itself: success feedback for Add to Bag. */
function DrawnCheck() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600" fill="none" aria-hidden="true">
      <motion.path
        d="M4 12.5l5 5L20 6.5"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: EASE.out, delay: 0.1 }}
      />
    </svg>
  );
}

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

  const accordionButton =
    "flex items-center justify-between text-left font-bold text-xs uppercase tracking-widest text-neutral-900 py-1";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
      {/* Left Column: Gallery */}
      <div>
        <ProductGallery
          images={product.images?.nodes || []}
          title={product.title}
          selectedImage={selectedVariant?.image}
          handle={product.handle}
        />
      </div>

      {/* Right Column: Info & Purchase, staggered entrance on load */}
      <StaggerGroup trigger="mount" delay={120} step={80} className="flex flex-col space-y-7">
        <div>
          {product.vendor && (
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-2 font-mono">
              {product.vendor}
            </p>
          )}
          <SplitText
            as="h1"
            trigger="mount"
            delay={180}
            stagger={45}
            text={product.title}
            className="text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 font-sans uppercase"
          />

          {/* Price rolls when the variant changes */}
          <div className="mt-4 flex items-baseline gap-3 flex-wrap">
            <RollingValue
              value={formatPrice(currentPrice.amount, currentPrice.currencyCode)}
              className="text-2xl sm:text-3xl font-black text-neutral-900 font-mono"
            />
            <AnimatePresence mode="popLayout" initial={false}>
              {currentCompareAtPrice &&
                parseFloat(currentCompareAtPrice.amount) >
                  parseFloat(currentPrice.amount) && (
                  <motion.span
                    key={`compare-${currentCompareAtPrice.amount}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE.out }}
                    className="text-base text-neutral-400 line-through font-mono"
                  >
                    {formatPrice(
                      currentCompareAtPrice.amount,
                      currentCompareAtPrice.currencyCode
                    )}
                  </motion.span>
                )}
              {discount !== null && isAvailable && (
                <motion.span
                  key={`discount-${discount}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={SPRING.snappy}
                  className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200 rounded-md"
                >
                  Save {discount}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Stock badge */}
          <div className="mt-4 flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              {isAvailable && (
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              )}
              <span
                className={`relative inline-flex w-2 h-2 rounded-full transition-colors duration-500 ${
                  isAvailable ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isAvailable ? "in" : "out"}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.25 }}
                className="text-xs font-semibold uppercase tracking-wider text-neutral-700"
              >
                {isAvailable ? "In Stock & Ready for Dispatch" : "Temporarily Sold Out"}
              </motion.span>
            </AnimatePresence>
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
                      <RollingValue value={currentValue ?? ""} className="text-neutral-500 font-mono text-xs" />
                    </div>

                    {/* Selected chip background glides between values */}
                    <LayoutGroup id={`option-${option.id}`}>
                      <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label={option.name}>
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
                            <motion.button
                              key={val}
                              type="button"
                              role="radio"
                              aria-checked={isSelected}
                              whileTap={{ scale: 0.94 }}
                              onClick={() => handleOptionSelect(option.name, val)}
                              className={`relative isolate min-w-14 px-4 py-2.5 text-xs font-bold uppercase rounded-xl border transition-colors duration-300 cursor-pointer ${
                                isSelected
                                  ? "text-white border-black"
                                  : isComboAvailable
                                  ? "bg-white text-neutral-800 border-neutral-200 hover:border-black"
                                  : "bg-neutral-50 text-neutral-300 border-neutral-200 line-through opacity-50 cursor-not-allowed"
                              }`}
                            >
                              {isSelected && (
                                <motion.span
                                  layoutId="option-active"
                                  transition={SPRING.glide}
                                  className="absolute -inset-px -z-10 rounded-xl bg-black shadow-md"
                                />
                              )}
                              {val}
                            </motion.button>
                          );
                        })}
                      </div>
                    </LayoutGroup>
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
            <div className="flex items-center border border-neutral-200 rounded-xl bg-white shadow-2xs focus-within:border-neutral-400 transition-colors">
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || !isAvailable}
                className="p-2.5 text-neutral-500 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>
              <span className="w-10 flex justify-center text-xs font-mono font-bold text-neutral-900" aria-live="polite">
                <RollingValue value={quantity} />
              </span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!isAvailable}
                className="p-2.5 text-neutral-500 hover:text-black disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {/* Add to Bag: label morphs through loading to a drawn check */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable || isAdding || isMutating}
              aria-live="polite"
              className={`group relative overflow-hidden w-full py-4 px-6 border-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors duration-500 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:border-neutral-300 disabled:hover:bg-white shadow-xs cursor-pointer text-black ${
                justAdded ? "border-emerald-600 bg-emerald-50" : "border-black bg-white hover:bg-neutral-50"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isAdding ? (
                  <motion.span key="adding" {...labelSwap} className="flex items-center gap-2.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding to Bag...</span>
                  </motion.span>
                ) : justAdded ? (
                  <motion.span key="added" {...labelSwap} className="flex items-center gap-2.5">
                    <DrawnCheck />
                    <span>Added to Bag</span>
                  </motion.span>
                ) : (
                  <motion.span key="idle" {...labelSwap} className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-12" />
                    <span>{isAvailable ? "Add to Bag" : "Sold Out"}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Buy Now */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleBuyNow}
              disabled={!isAvailable || isBuyingNow}
              className="btn-shine w-full py-4 px-6 bg-[#111111] text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isBuyingNow ? (
                  <motion.span key="buying" {...labelSwap} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Securing Order...</span>
                  </motion.span>
                ) : (
                  <motion.span key="buy" {...labelSwap} className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Instant Purchase</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 py-5 border-y border-neutral-100 text-center text-[11px] text-neutral-600 uppercase tracking-wider">
          <div className="group flex flex-col items-center gap-1.5">
            <Truck className="w-4 h-4 text-neutral-900 transition-transform duration-500 group-hover:translate-x-1" />
            <span className="font-semibold">Nationwide Dispatch</span>
          </div>
          <div className="group flex flex-col items-center gap-1.5 border-x border-neutral-100">
            <ShieldCheck className="w-4 h-4 text-neutral-900 transition-transform duration-500 group-hover:scale-115" />
            <span className="font-semibold">100% Genuine Origin</span>
          </div>
          <div className="group flex flex-col items-center gap-1.5">
            <RotateCcw className="w-4 h-4 text-neutral-900 transition-transform duration-700 group-hover:-rotate-180" />
            <span className="font-semibold">7-Day Exchanges</span>
          </div>
        </div>

        {/* Accordions with Smooth Height Transitions */}
        <div className="divide-y divide-neutral-100">
          <AccordionItem
            className="py-3.5"
            title={<>Silhouettes &amp; Craftsmanship</>}
            isOpen={openSection === "description"}
            onToggle={() => toggleSection("description")}
            buttonClassName={accordionButton}
            iconClassName="text-neutral-500"
            panelClassName="pt-3 text-xs sm:text-sm text-neutral-600 leading-relaxed space-y-2"
          >
            {product.descriptionHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                className="prose prose-sm max-w-none text-neutral-600"
              />
            ) : (
              <p>{product.description || "Specifications detailed by manufacturer."}</p>
            )}
          </AccordionItem>

          <AccordionItem
            className="py-3.5"
            title={<>Fulfillment &amp; Delivery</>}
            isOpen={openSection === "shipping"}
            onToggle={() => toggleSection("shipping")}
            buttonClassName={accordionButton}
            iconClassName="text-neutral-500"
            panelClassName="pt-3 text-xs text-neutral-600 leading-relaxed space-y-2 font-light"
          >
            <p>
              <strong>Metropolitan Dhaka:</strong> Handed over to courier within 24 hours. Expected arrival 2–3 business days.
            </p>
            <p>
              <strong>All 64 Districts:</strong> Tracked regional delivery within 3–5 business days. Free for orders totaling ৳2,500+.
            </p>
          </AccordionItem>

          <AccordionItem
            className="py-3.5"
            title="Exchange Concierge"
            isOpen={openSection === "returns"}
            onToggle={() => toggleSection("returns")}
            buttonClassName={accordionButton}
            iconClassName="text-neutral-500"
            panelClassName="pt-3 text-xs text-neutral-600 leading-relaxed space-y-2 font-light"
          >
            <p>
              We offer a guaranteed 7-day size exchange window. Items must be unworn outdoors with original boxing and brand tags intact.
            </p>
          </AccordionItem>
        </div>
      </StaggerGroup>
    </div>
  );
}
