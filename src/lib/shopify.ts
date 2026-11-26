import "server-only";
import { shopifyFetch as modernFetch } from "./shopify/client";

export * from "./shopify";

// Backwards-compatible wrapper for any existing code expecting shopifyFetch<T>(query: string)
export async function shopifyFetch<T>(query: string): Promise<T> {
  return modernFetch<T>({ query });
}
