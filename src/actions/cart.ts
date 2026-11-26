"use server";

import { cookies } from "next/headers";
import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCartLines,
} from "@/lib/shopify/cart";
import { Cart } from "@/lib/shopify/types";

const CART_COOKIE_NAME = "shopify_cart_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function getStoredCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

async function setStoredCartId(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function clearStoredCartId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CART_COOKIE_NAME);
}

export async function getCartAction(): Promise<Cart | null> {
  const cartId = await getStoredCartId();
  if (!cartId) return null;

  try {
    const cart = await getCart(cartId);
    if (!cart) {
      await clearStoredCartId();
      return null;
    }
    return cart;
  } catch (error) {
    console.error("Failed to get cart in action:", error);
    await clearStoredCartId();
    return null;
  }
}

export async function addToCartAction(
  variantId: string,
  quantity: number = 1
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    const cartId = await getStoredCartId();
    let cart: Cart | null = null;

    if (!cartId) {
      cart = await createCart([{ merchandiseId: variantId, quantity }]);
      await setStoredCartId(cart.id);
      return { success: true, cart };
    }

    try {
      cart = await addToCart(cartId, [{ merchandiseId: variantId, quantity }]);
      return { success: true, cart };
    } catch {
      // Cart might have expired or been deleted on Shopify's side
      console.warn("Cart expired or invalid, creating new cart...");
      cart = await createCart([{ merchandiseId: variantId, quantity }]);
      await setStoredCartId(cart.id);
      return { success: true, cart };
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add to cart";
    return { success: false, error: message };
  }
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    const cartId = await getStoredCartId();
    if (!cartId) {
      return { success: false, error: "No active cart found" };
    }

    if (quantity <= 0) {
      const cart = await removeFromCart(cartId, [lineId]);
      return { success: true, cart };
    }

    const cart = await updateCartLines(cartId, [{ id: lineId, quantity }]);
    return { success: true, cart };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update quantity";
    return { success: false, error: message };
  }
}

export async function removeCartLineAction(
  lineId: string
): Promise<{ success: boolean; cart?: Cart; error?: string }> {
  try {
    const cartId = await getStoredCartId();
    if (!cartId) {
      return { success: false, error: "No active cart found" };
    }

    const cart = await removeFromCart(cartId, [lineId]);
    return { success: true, cart };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to remove item";
    return { success: false, error: message };
  }
}

export async function getCheckoutUrlAction(): Promise<{
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}> {
  try {
    const cartId = await getStoredCartId();
    if (!cartId) {
      return { success: false, error: "No active cart found" };
    }

    const cart = await getCart(cartId);
    if (!cart || !cart.checkoutUrl) {
      return { success: false, error: "Unable to retrieve checkout URL" };
    }

    return { success: true, checkoutUrl: cart.checkoutUrl };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to proceed to checkout";
    return { success: false, error: message };
  }
}
