"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, ShoppingBag, ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/cart-context";
import { CartItemRow } from "@/components/cart/CartItem";
import { formatPrice } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import { RollingValue } from "@/components/motion/RollingValue";
import { SplitText } from "@/components/motion/SplitText";
import { StaggerGroup } from "@/components/motion/StaggerGroup";
import { Magnetic } from "@/components/motion/Magnetic";
import { RollText } from "@/components/motion/RollText";

export function CartView() {
  const { cart, isLoading, totalQuantity } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const lines = cart?.lines?.nodes || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? formatPrice(
        cart.cost.subtotalAmount.amount,
        cart.cost.subtotalAmount.currencyCode
      )
    : "৳0";

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) {
      alert("Checkout is currently unavailable. Please refresh and try again.");
      return;
    }
    setIsCheckingOut(true);
    window.location.href = cart.checkoutUrl;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-3" />
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium font-mono">
          Loading your shopping bag...
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400"
        >
          <ShoppingBag className="w-8 h-8 animate-float" />
        </motion.div>
        <SplitText
          as="h1"
          trigger="mount"
          delay={150}
          text="Your Shopping Bag is Empty"
          className="text-2xl sm:text-4xl font-black text-neutral-900 font-sans uppercase tracking-tight"
        />
        <StaggerGroup trigger="mount" delay={450} step={120}>
          <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Discover our curated footwear lines, precision dress shoes, and everyday comfort essentials.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Link
                href="/products"
                className="group btn-shine inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors shadow-xl"
              >
                <RollText>Explore The Collection</RollText>
                <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
          </div>
        </StaggerGroup>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <StaggerGroup trigger="mount" step={90} className="mb-10">
        <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400 font-mono">
          ORDER SUMMARY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 font-sans uppercase tracking-tight mt-1 flex items-center">
          Shopping Bag (<RollingValue value={totalQuantity} />)
        </h1>
        <p className="text-xs text-neutral-500 mt-2 font-light">
          Review your selected footwear before proceeding to 256-bit SSL encrypted checkout.
        </p>
      </StaggerGroup>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Items list */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE.out }}
          className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-10 shadow-xs"
        >
          <div className="divide-y divide-neutral-100">
            <AnimatePresence>
              {lines.map((line, i) => (
                <CartItemRow key={line.id} line={line} index={i} />
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-6 border-t border-neutral-100 mt-6 flex justify-between items-center text-xs uppercase tracking-wider">
            <Link
              href="/products"
              className="group text-neutral-500 hover:text-black font-bold flex items-center gap-2 transition-colors"
            >
              <span className="inline-block transition-transform duration-500 group-hover:-translate-x-1">←</span>
              <span className="link-underline">Continue Shopping</span>
            </Link>
          </div>
        </motion.div>

        {/* Right: Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE.out }}
          className="lg:col-span-4 lg:sticky lg:top-28 bg-[#F8F8F6] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 space-y-6"
        >
          <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 font-sans">
            Summary
          </h2>

          <div className="space-y-3.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Items Total ({totalQuantity})</span>
              <RollingValue value={subtotal} className="font-bold text-neutral-900 font-mono" />
            </div>
            <div className="flex justify-between">
              <span>Nationwide Shipping</span>
              <span className="text-neutral-500">Calculated at checkout</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="text-neutral-500">Included</span>
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
              <span className="uppercase text-xs tracking-wider">Subtotal</span>
              <RollingValue value={subtotal} className="font-mono" />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="group btn-shine w-full py-4 bg-[#111111] text-white rounded-full font-bold text-xs uppercase tracking-[0.15em] hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 cursor-pointer"
          >
            {isCheckingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Initializing Checkout...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-500 group-hover:translate-x-1" />
              </>
            )}
          </motion.button>

          {/* Guarantees */}
          <div className="pt-4 border-t border-neutral-200 space-y-3 text-xs text-neutral-500 font-light">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Level 1 PCI-DSS certified encrypted payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>Nationwide delivery with live SMS tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-800 shrink-0" />
              <span>7-Day size exchange guarantee</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
