"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  AlertCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import {
  submitCustomCheckoutAction,
  CheckoutActionResult,
} from "@/actions/checkout";

const FREE_SHIPPING_THRESHOLD = 2500;
const DHAKA_SHIPPING_FEE = 80;
const OUTSIDE_DHAKA_SHIPPING_FEE = 150;

export function CheckoutView() {
  const { cart, isLoading, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "outside_dhaka">(
    "dhaka"
  );
  const [city, setCity] = useState("Dhaka");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "sslcommerz"
  >("cod");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<
    CheckoutActionResult["order"] | null
  >(null);

  const lines = cart?.lines?.nodes || [];
  const subtotalAmount = parseFloat(cart?.cost?.subtotalAmount?.amount || "0");
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || "BDT";

  const shippingCost =
    subtotalAmount >= FREE_SHIPPING_THRESHOLD
      ? 0
      : deliveryZone === "dhaka"
      ? DHAKA_SHIPPING_FEE
      : OUTSIDE_DHAKA_SHIPPING_FEE;

  const grandTotalAmount = subtotalAmount + shippingCost;

  const handleZoneChange = (zone: "dhaka" | "outside_dhaka") => {
    setDeliveryZone(zone);
    if (zone === "dhaka") {
      setCity("Dhaka");
    } else if (city.toLowerCase() === "dhaka") {
      setCity("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    let redirecting = false;

    try {
      const result = await submitCustomCheckoutAction({
        fullName,
        phone,
        email,
        city,
        address,
        deliveryZone,
        paymentMethod,
        note,
      });

      if (result.success && result.redirectUrl) {
        // Online payment: hand off to the SSLCommerz payment page
        redirecting = true;
        window.location.assign(result.redirectUrl);
      } else if (result.success && result.order) {
        setConfirmedOrder(result.order);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(
          result.error || "Unable to place order. Please check your details."
        );
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Network error while placing order."
      );
    } finally {
      // Keep the button locked while the browser leaves for the payment page
      if (!redirecting) setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="max-w-2xl mx-auto px-4 py-16 sm:py-24"
      >
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-12 shadow-xl text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-600 font-mono">
              ORDER CONFIRMED
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-sans uppercase tracking-tight mt-2">
              Thank You, {confirmedOrder.customerName}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-light">
              Your order has been registered directly with our fulfillment desk.
            </p>
          </div>

          <div className="bg-[#F8F8F6] rounded-2xl p-6 border border-neutral-200/80 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="uppercase tracking-wider text-neutral-500 font-semibold">
                Order Reference
              </span>
              <span className="text-base font-black font-mono text-neutral-900">
                {confirmedOrder.orderName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Contact Number</span>
              <span className="font-mono font-semibold text-neutral-900">
                {confirmedOrder.phone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Delivery Zone</span>
              <span className="font-semibold text-neutral-900">
                {confirmedOrder.deliveryZone}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Method</span>
              <span className="font-semibold text-neutral-900">
                {confirmedOrder.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-neutral-200 text-sm">
              <span className="font-bold uppercase tracking-wider text-neutral-900">
                Total Amount
              </span>
              <span className="font-black font-mono text-neutral-900">
                {formatPrice(
                  confirmedOrder.totalAmount,
                  confirmedOrder.currencyCode
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Continue Exploring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all inline-flex items-center justify-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-28 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-black mb-3" />
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-mono">
          Preparing your checkout...
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 font-sans uppercase tracking-tight">
          Your Shopping Bag is Empty
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto">
          Add footwear or accessories to your bag before proceeding to checkout.
        </p>
        <div className="mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all shadow-xl"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bag</span>
          </Link>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 font-mono">
            DIRECT STUDIO CHECKOUT
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-sans uppercase tracking-tight mt-1">
            Express Checkout
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit Encrypted · Direct Fulfillment</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
      >
        {/* Left Column: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-8">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs sm:text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </motion.div>
          )}

          {/* 1. Contact Details */}
          <section className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center font-mono">
                01
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Md Rocky Islam"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Mobile Number (BD) *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* 2. Delivery Zone & Address */}
          <section className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center font-mono">
                02
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Delivery Zone &amp; Address
              </h2>
            </div>

            {/* Delivery Zone Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => handleZoneChange("dhaka")}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  deliveryZone === "dhaka"
                    ? "border-black bg-neutral-50 shadow-xs"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    Inside Dhaka
                  </span>
                  <span className="text-xs font-black font-mono text-neutral-900">
                    {subtotalAmount >= FREE_SHIPPING_THRESHOLD
                      ? "FREE"
                      : `৳${DHAKA_SHIPPING_FEE}`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Express 2–3 business days
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleZoneChange("outside_dhaka")}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  deliveryZone === "outside_dhaka"
                    ? "border-black bg-neutral-50 shadow-xs"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    Outside Dhaka
                  </span>
                  <span className="text-xs font-black font-mono text-neutral-900">
                    {subtotalAmount >= FREE_SHIPPING_THRESHOLD
                      ? "FREE"
                      : `৳${OUTSIDE_DHAKA_SHIPPING_FEE}`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  All 64 districts (3–5 days)
                </p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  District / City *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Dhaka, Chattogram, Sylhet"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Delivery Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Call before delivery"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Full Delivery Address *
                </label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House No, Road No, Sector/Area, Thana..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-black transition-colors bg-[#FAFAFA] focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* 3. Payment Method */}
          <section className="bg-white rounded-3xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
              <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-bold flex items-center justify-center font-mono">
                03
              </span>
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0">
                  <Banknote className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Most Popular
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 font-light">
                    Pay in cash directly to the delivery rider when you receive your parcel.
                  </p>
                </div>
              </button>

              {/* Online payment via SSLCommerz */}
              <button
                type="button"
                onClick={() => setPaymentMethod("sslcommerz")}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                  paymentMethod === "sslcommerz"
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-400"
                }`}
              >
                <div className="p-2 rounded-xl bg-white border border-neutral-200 text-neutral-900 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Pay Online (SSLCommerz)
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Instant
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 font-light">
                    Card, bKash, Nagad, Rocket or net banking on the secure SSLCommerz payment page.
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 bg-[#F8F8F6] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 pb-3 border-b border-neutral-200">
            Order Summary ({cart?.totalQuantity || 0})
          </h2>

          {/* Line Items */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {lines.map((line) => {
              const img =
                line.merchandise.image ||
                line.merchandise.product.featuredImage;
              return (
                <div key={line.id} className="flex items-center gap-3.5">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white border border-neutral-200 shrink-0">
                    {img ? (
                      <Image
                        src={img.url}
                        alt={img.altText || line.merchandise.product.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : null}
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center font-mono">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate uppercase">
                      {line.merchandise.product.title}
                    </p>
                    {line.merchandise.title !== "Default Title" && (
                      <p className="text-[11px] text-neutral-500 font-mono">
                        {line.merchandise.title}
                      </p>
                    )}
                  </div>
                  <span className="text-xs font-black font-mono text-neutral-900">
                    {formatPrice(
                      line.cost.totalAmount.amount,
                      line.cost.totalAmount.currencyCode
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-neutral-200 space-y-2.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold font-mono text-neutral-900">
                {formatPrice(subtotalAmount.toString(), currencyCode)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                Delivery (
                {deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"})
              </span>
              <span className="font-bold font-mono text-neutral-900">
                {shippingCost === 0 ? (
                  <span className="text-emerald-700">FREE</span>
                ) : (
                  formatPrice(shippingCost.toString(), currencyCode)
                )}
              </span>
            </div>
            <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline text-base font-black text-neutral-900">
              <span className="uppercase text-xs tracking-wider">
                Total Payable
              </span>
              <span className="text-xl font-mono">
                {formatPrice(grandTotalAmount.toString(), currencyCode)}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#111111] text-white rounded-full font-bold text-xs uppercase tracking-[0.18em] hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {paymentMethod === "sslcommerz"
                    ? "Opening Secure Payment..."
                    : "Confirming Order..."}
                </span>
              </>
            ) : (
              <>
                {paymentMethod === "sslcommerz" ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  <PackageCheck className="w-4 h-4" />
                )}
                <span>
                  {paymentMethod === "sslcommerz" ? "Pay Securely" : "Confirm Order"} ·{" "}
                  {formatPrice(grandTotalAmount.toString(), currencyCode)}
                </span>
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Orders sync directly with official inventory</span>
          </div>
        </div>
      </form>
    </div>
  );
}
