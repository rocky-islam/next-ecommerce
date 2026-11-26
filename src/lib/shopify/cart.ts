import { shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  GET_CART_QUERY,
} from "./mutations/cart";
import { Cart, UserError } from "./types";

export async function getCart(cartId: string): Promise<Cart | null> {
  if (!cartId) return null;

  try {
    const data = await shopifyFetch<{
      cart: Cart | null;
    }>({
      query: GET_CART_QUERY,
      variables: { id: cartId },
      cache: "no-store",
    });

    return data.cart;
  } catch (error) {
    console.warn(`Failed to fetch cart (${cartId}):`, error);
    return null;
  }
}

export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartCreate: {
      cart: Cart;
      userErrors: UserError[];
    };
  }>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: lines ? { lines } : {},
    },
    cache: "no-store",
  });

  if (data.cartCreate.userErrors?.length) {
    throw new Error(
      data.cartCreate.userErrors.map((e) => e.message).join(", ")
    );
  }

  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesAdd: {
      cart: Cart;
      userErrors: UserError[];
    };
  }>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  if (data.cartLinesAdd.userErrors?.length) {
    throw new Error(
      data.cartLinesAdd.userErrors.map((e) => e.message).join(", ")
    );
  }

  return data.cartLinesAdd.cart;
}

export async function updateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: {
      cart: Cart;
      userErrors: UserError[];
    };
  }>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  if (data.cartLinesUpdate.userErrors?.length) {
    throw new Error(
      data.cartLinesUpdate.userErrors.map((e) => e.message).join(", ")
    );
  }

  return data.cartLinesUpdate.cart;
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  const data = await shopifyFetch<{
    cartLinesRemove: {
      cart: Cart;
      userErrors: UserError[];
    };
  }>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  if (data.cartLinesRemove.userErrors?.length) {
    throw new Error(
      data.cartLinesRemove.userErrors.map((e) => e.message).join(", ")
    );
  }

  return data.cartLinesRemove.cart;
}
