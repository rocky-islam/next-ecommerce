"use server";

import { cookies, headers } from "next/headers";
import { getCart } from "@/lib/shopify/cart";
import {
  cancelAdminOrder,
  createShopifyAdminOrder,
  toOrderLegacyId,
} from "@/lib/shopify/admin";
import { generateTranId, initSslcommerzPayment } from "@/lib/sslcommerz";

const CART_COOKIE_NAME = "shopify_cart_id";

/** The URL the customer is on, so SSLCommerz returns them to the same site. */
async function getSiteUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ||
      (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/** Called from the payment result page once payment is confirmed. */
export async function clearCartAfterPaymentAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export type CheckoutFormPayload = {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  deliveryZone: "dhaka" | "outside_dhaka";
  paymentMethod: "cod" | "sslcommerz";
  note?: string;
};

export type CheckoutActionResult = {
  success: boolean;
  error?: string;
  /** Set for online payments: send the browser here to pay */
  redirectUrl?: string;
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
    if (!/^\+8801[3-9]\d{8}$/.test(normalizedPhone)) {
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

    if (payload.paymentMethod !== "cod" && payload.paymentMethod !== "sslcommerz") {
      return { success: false, error: "Please choose a payment method." };
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
      // Lock the order price to the price the customer saw in the cart
      unitPrice: line.merchandise.price?.amount,
    }));

    const gatewayTranId =
      payload.paymentMethod === "sslcommerz" ? generateTranId() : undefined;

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
      gatewayTranId,
      note: payload.note?.trim(),
      lineItems,
    });

    if (payload.paymentMethod === "sslcommerz" && gatewayTranId) {
      // Order is created as PENDING; send the customer to SSLCommerz.
      // The cart is kept until payment is confirmed.
      try {
        const redirectUrl = await initSslcommerzPayment({
          tranId: gatewayTranId,
          orderLegacyId: toOrderLegacyId(createdOrder.id),
          totalAmount: createdOrder.totalAmount,
          currency: createdOrder.currencyCode,
          siteUrl: await getSiteUrl(),
          customer: {
            name: fullName,
            email: email || undefined,
            phone: normalizedPhone,
            address,
            city,
          },
          productName: cart.lines.nodes
            .map((line) => line.merchandise.product.title)
            .join(", "),
          itemCount: cart.totalQuantity,
        });
        return { success: true, redirectUrl };
      } catch (error) {
        // Release the stock if the payment page could not be opened
        await cancelAdminOrder(
          createdOrder.id,
          "SSLCommerz session could not be created"
        ).catch((e) => console.error("Failed to cancel order:", e));
        throw error;
      }
    }

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
        paymentMethod: "Cash on Delivery",
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
