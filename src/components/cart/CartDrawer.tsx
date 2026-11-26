"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight, Loader2, AlertCircle, Lock, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/cart-context";
import { CartItemRow } from "./CartItem";
import { formatPrice } from "@/lib/utils";
import { EASE, SPRING } from "@/lib/motion";
import { useOverlay } from "@/hooks/use-overlay";
import { RollingValue } from "@/components/motion/RollingValue";

const emptyStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};
const emptyItem = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.out } },
};

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    isLoading,
    totalQuantity,
    errorMessage,
    clearError,
  } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Close drawer on Escape key + lock page scroll while open
  useOverlay(isOpen, closeCart);

  const lines = cart?.lines?.nodes || [];
  const subtotalAmount = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const subtotal = cart?.cost?.subtotalAmount?.amount
    ? formatPrice(
        cart.cost.subtotalAmount.amount,
        cart.cost.subtotalAmount.currencyCode
      )
    : "৳0";

  // Free shipping threshold
  const freeShippingThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((subtotalAmount / freeShippingThreshold) * 100));
  const diffToFreeShipping = freeShippingThreshold - subtotalAmount;

  const handleCheckout = () => {
    if (!cart?.checkoutUrl) {
      alert("Unable to reach checkout right now. Please try again.");
      return;
    }
    setIsCheckingOut(true);
    window.location.href = cart.checkoutUrl;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping bag">
          {/* Backdrop with fade motion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            onClick={closeCart}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer panel with smooth spring physics */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%", transition: { duration: 0.4, ease: EASE.inOut } }}
              transition={SPRING.drawer}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-neutral-900" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900 font-sans flex items-center">
                    Your Bag (<RollingValue value={totalQuantity} />)
                  </h2>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.3 }}
                  onClick={closeCart}
                  className="p-1.5 text-neutral-400 hover:text-black rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
                  aria-label="Close cart drawer"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-100 text-xs">
                <AnimatePresence mode="wait" initial={false}>
                  {subtotalAmount >= freeShippingThreshold ? (
                    <motion.p
                      key="unlocked"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35, ease: EASE.out }}
                      className="text-emerald-700 font-medium flex items-center gap-1.5"
                    >
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </motion.span>
                      <span>You unlocked complimentary nationwide shipping!</span>
                    </motion.p>
                  ) : (
                    <motion.div
                      key="progress"
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-1.5"
                    >
                      <p className="text-neutral-600">
                        Add <span className="font-bold text-neutral-900 inline-flex"><RollingValue value={`৳${diffToFreeShipping.toFixed(0)}`} /></span> more for free delivery
                      </p>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          className="bg-black h-full origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: progressPercent / 100 }}
                          transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.25 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Alert */}
              <AnimatePresence initial={false}>
                {errorMessage && (
                  <motion.div
                    key="cart-error"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE.out }}
                    className="overflow-hidden"
                  >
                    <motion.div
                      initial={{ x: 0 }}
                      animate={{ x: [0, -6, 6, -3, 3, 0] }}
                      transition={{ duration: 0.45, delay: 0.15 }}
                      className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-red-700 text-xs"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span>{errorMessage}</span>
                      </div>
                      <button
                        onClick={clearError}
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        aria-label="Dismiss error"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 divide-y divide-neutral-100">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-neutral-400 py-16">
                    <Loader2 className="w-7 h-7 animate-spin mb-3 text-black" />
                    <p className="text-xs uppercase tracking-widest font-semibold">Updating bag...</p>
                  </div>
                ) : lines.length === 0 ? (
                  <motion.div
                    variants={emptyStagger}
                    initial="hidden"
                    animate="show"
                    className="h-full flex flex-col items-center justify-center text-center py-16 px-4"
                  >
                    <motion.div variants={emptyItem} className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                      <ShoppingBag className="w-7 h-7 animate-float" />
                    </motion.div>
                    <motion.h3 variants={emptyItem} className="text-base font-bold text-neutral-900 uppercase tracking-tight mb-1">
                      Your bag is empty
                    </motion.h3>
                    <motion.p variants={emptyItem} className="text-xs text-neutral-500 mb-6 max-w-xs leading-relaxed">
                      Discover refined dress shoes, comfort loafers, and everyday footwear.
                    </motion.p>
                    <motion.button
                      variants={emptyItem}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={closeCart}
                      className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                    >
                      Explore Collection
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="py-2">
                    <AnimatePresence initial={true}>
                      {lines.map((line, i) => (
                        <CartItemRow key={line.id} line={line} index={i} onClose={closeCart} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer with Checkout CTA */}
              {lines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.2, ease: EASE.out }}
                  className="p-6 border-t border-neutral-100 bg-[#FAFAFA] space-y-4"
                >
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between font-bold text-neutral-900 text-base">
                      <span className="uppercase text-xs tracking-wider">Subtotal</span>
                      <RollingValue value={subtotal} className="font-mono" />
                    </div>
                    <p className="text-[11px] text-neutral-500 font-light">
                      Taxes included. Delivery calculated at checkout.
                    </p>
                  </div>

                  {/* Secure Checkout Button with spring physics */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="group btn-shine w-full py-4 bg-[#111111] text-white rounded-full font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-xl disabled:opacity-70 cursor-pointer"
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Connecting to Secure Checkout...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Proceed to Secure Checkout</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform duration-500 group-hover:translate-x-1" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="link-underline hover:text-black font-semibold"
                    >
                      View Full Bag
                    </Link>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      256-Bit SSL Encrypted
                    </span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
