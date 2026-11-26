import "server-only";

type ShopifyFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
  revalidate?: number | false;
  tags?: string[];
  buyerIp?: string;
};

export async function shopifyFetch<T>({
  query,
  variables,
  cache,
  revalidate = 60,
  tags,
  buyerIp,
}: ShopifyFetchOptions): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || "2026-10";

  if (!domain || !token) {
    throw new Error(
      "Missing Shopify API credentials: SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_PRIVATE_TOKEN is not defined."
    );
  }

  const endpoint = `https://${domain}/api/${version}/graphql.json`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": token,
  };

  if (buyerIp) {
    headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
  }

  const fetchOptions: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  };

  if (cache) {
    fetchOptions.cache = cache;
  } else if (revalidate !== undefined) {
    fetchOptions.next = {
      revalidate,
      ...(tags ? { tags } : {}),
    };
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(endpoint, fetchOptions);

      // Handle gateway errors by retrying once
      if ([502, 503, 504].includes(response.status) && attempt < 2) {
        console.warn(`Shopify API returned ${response.status}. Retrying in 500ms...`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Shopify API HTTP Error:", {
          status: response.status,
          requestId: response.headers.get("x-request-id"),
          details: errorBody.slice(0, 300),
        });

        throw new Error(`Shopify API request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result.errors?.length) {
        const errorMsg = result.errors
          .map((e: { message: string }) => e.message)
          .join(", ");
        throw new Error(`Shopify GraphQL Error: ${errorMsg}`);
      }

      if (!result.data) {
        throw new Error("No data returned from Shopify Storefront API");
      }

      return result.data as T;
    } catch (err: unknown) {
      if (attempt === 2 || !(err instanceof Error && err.name === "FetchError")) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("Shopify API request failed after retry");
}
