"use server";

import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify/cart";
import { createShopifyAdminOrder } from "@/lib/shopify/admin";

const CART_COOKIE_NAME = "shopify_cart_id";

export type CheckoutFormPayload = {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  deliveryZone: "dhaka" | "outside_dhaka";
  paymentMethod: "cod" | "mobile_banking";
  mobileWallet?: string;
  transactionId?: string;
  note?: string;
};

export type CheckoutActionResult = {
  success: boolean;
  error?: string;
  order?: {
    orderName: string;
    totalAmount: string;
    currencyCode: string;
    customerName: string;
    phone: string;
    paymentMethod: string;
    deliveryZone: string;
  };
};

const FREE_SHIPPING_THRESHOLD = 2500;
const DHAKA_SHIPPING_FEE = 80;
const OUTSIDE_DHAKA_SHIPPING_FEE = 150;

function normalizeBangladeshPhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return `+88${cleaned}`;
  }
  if (/^\+?8801[3-9]\d{8}$/.test(cleaned)) {
    return cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  }
  return cleaned;
}

export async function submitCustomCheckoutAction(
  payload: CheckoutFormPayload
): Promise<CheckoutActionResult> {
  try {
    const fullName = payload.fullName?.trim();
    const rawPhone = payload.phone?.trim();
    const email = payload.email?.trim();
    const city = payload.city?.trim();
    const address = payload.address?.trim();

    if (!fullName || fullName.length < 2) {
      return { success: false, error: "Please enter your full name." };
    }

    if (!rawPhone) {
      return { success: false, error: "Please enter your mobile phone number." };
    }

    const normalizedPhone = normalizeBangladeshPhone(rawPhone);
    if (!/^\+8801[3-9]\d{8}$/.test(normalizedPhone) && normalizedPhone.length < 10) {
      return {
        success: false,
        error: "Please enter a valid Bangladeshi phone number (e.g. 017XXXXXXXX).",
      };
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Please enter a valid email address." };
    }

    if (!city || city.length < 2) {
      return { success: false, error: "Please enter your district or city." };
    }

    if (!address || address.length < 5) {
      return {
        success: false,
        error: "Please enter your full delivery address (house, road, area).",
      };
    }

    if (
      payload.paymentMethod === "mobile_banking" &&
      (!payload.transactionId || payload.transactionId.trim().length < 4)
    ) {
      return {
        success: false,
        error: "Please enter your bKash/Nagad Transaction ID (TrxID).",
      };
    }

    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

    if (!cartId) {
      return {
        success: false,
        error: "Your shopping bag is empty or expired. Please add an item first.",
      };
    }

    // Fetch authoritative cart from Shopify Storefront API
    const cart = await getCart(cartId);
    if (!cart || !cart.lines?.nodes || cart.lines.nodes.length === 0) {
      return {
        success: false,
        error: "Your shopping bag is empty. Please add items before checking out.",
      };
    }

    const subtotalAmount = parseFloat(cart.cost.subtotalAmount.amount || "0");
    const currencyCode = cart.cost.subtotalAmount.currencyCode || "BDT";

    // Server-side shipping fee calculation
    const shippingCost =
      subtotalAmount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : payload.deliveryZone === "dhaka"
        ? DHAKA_SHIPPING_FEE
        : OUTSIDE_DHAKA_SHIPPING_FEE;

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "-";

    const lineItems = cart.lines.nodes.map((line) => ({
      variantId: line.merchandise.id,
      quantity: line.quantity,
    }));

    const createdOrder = await createShopifyAdminOrder({
      firstName,
      lastName,
      phone: normalizedPhone,
      email: email || undefined,
      address,
      city,
      deliveryZone: payload.deliveryZone,
      shippingCost,
      currencyCode,
      paymentMethod: payload.paymentMethod,
      mobileWallet: payload.mobileWallet,
      transactionId: payload.transactionId?.trim(),
      note: payload.note?.trim(),
      lineItems,
    });

    // Clear the active cart cookie now that the order is placed
    cookieStore.delete(CART_COOKIE_NAME);

    return {
      success: true,
      order: {
        orderName: createdOrder.name,
        totalAmount: createdOrder.totalAmount,
        currencyCode: createdOrder.currencyCode,
        customerName: fullName,
        phone: normalizedPhone,
        paymentMethod:
          payload.paymentMethod === "cod"
            ? "Cash on Delivery"
            : `${payload.mobileWallet || "Mobile Banking"} (TrxID: ${
                payload.transactionId
              })`,
        deliveryZone:
          payload.deliveryZone === "dhaka"
            ? "Inside Dhaka (2–3 Days)"
            : "Nationwide 64 Districts (3–5 Days)",
      },
    };
  } catch (error: unknown) {
    console.error("Custom checkout failed:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Unable to complete your order right now. Please try again.";
    return { success: false, error: message };
  }
}
