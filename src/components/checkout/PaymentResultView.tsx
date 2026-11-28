"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { clearCartAfterPaymentAction } from "@/actions/checkout";

const CONTENT = {
  success: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-700",
    title: "Payment Successful",
    message:
      "Thank you! Your payment was received and your order is confirmed. We will call you before delivery.",
  },
  pending: {
    icon: Clock,
    iconClass: "bg-amber-100 text-amber-700",
    title: "Payment Being Verified",
    message:
      "We could not confirm your payment yet. If money was deducted, don't pay again: our team will verify it and contact you shortly.",
  },
  cancelled: {
    icon: XCircle,
    iconClass: "bg-neutral-200 text-neutral-700",
    title: "Payment Cancelled",
    message:
      "You cancelled the payment, so no order was placed. Your bag is still saved if you want to try again.",
  },
  failed: {
    icon: XCircle,
    iconClass: "bg-red-100 text-red-700",
    title: "Payment Failed",
    message:
      "The payment did not go through and no money was taken. Your bag is still saved: try again or choose Cash on Delivery.",
  },
} as const;

type Status = keyof typeof CONTENT;

export function PaymentResultView() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  const rawStatus = searchParams.get("status") as Status | null;
  const status: Status =
    rawStatus && rawStatus in CONTENT ? rawStatus : "failed";
  const orderName = searchParams.get("order");
  const content = CONTENT[status];
  const Icon = content.icon;

  useEffect(() => {
    if (status !== "success") return;
    clearCartAfterPaymentAction()
      .then(() => clearCart())
      .catch((e) => console.error("Failed to clear cart:", e));
    // Run once for this result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className="max-w-2xl mx-auto px-4 py-16 sm:py-24"
    >
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-xl text-center space-y-6">
        <div
          className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${content.iconClass}`}
        >
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
            {content.title}
          </h1>
          {orderName && (
            <p className="text-sm font-mono text-neutral-500">
              Order {orderName}
            </p>
          )}
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed max-w-md mx-auto">
          {content.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {status === "success" || status === "pending" ? (
            <Link
              href="/products"
              className="px-8 py-3.5 bg-[#111111] text-white rounded-full font-bold text-xs uppercase tracking-[0.18em] hover:bg-black transition-colors"
            >
              Continue Shopping
            </Link>
          ) : (
            <>
              <Link
                href="/checkout"
                className="px-8 py-3.5 bg-[#111111] text-white rounded-full font-bold text-xs uppercase tracking-[0.18em] hover:bg-black transition-colors"
              >
                Try Again
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3.5 border border-neutral-300 text-neutral-900 rounded-full font-bold text-xs uppercase tracking-[0.18em] hover:border-black transition-colors"
              >
                Contact Support
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
