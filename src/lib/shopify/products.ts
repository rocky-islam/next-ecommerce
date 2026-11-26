import { shopifyFetch } from "./client";
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_RECOMMENDATIONS_QUERY,
  SEARCH_PRODUCTS_QUERY,
} from "./queries/product";
import { PageInfo, Product, ProductSortKey } from "./types";

export type GetProductsParams = {
  first?: number;
  after?: string;
  sortKey?: ProductSortKey;
  reverse?: boolean;
  query?: string;
};

export type ProductsResponse = {
  products: Product[];
  pageInfo: PageInfo;
};

export async function getProducts({
  first = 24,
  after,
  sortKey = "BEST_SELLING",
  reverse = false,
  query,
}: GetProductsParams = {}): Promise<ProductsResponse> {
  const data = await shopifyFetch<{
    products: {
      pageInfo: PageInfo;
      nodes: Product[];
    };
  }>({
    query: GET_PRODUCTS_QUERY,
    variables: {
      first,
      after,
      sortKey,
      reverse,
      query,
    },
    revalidate: 60,
  });

  return {
    products: data.products?.nodes || [],
    pageInfo: data.products?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

export async function getProduct(handle: string): Promise<Product | null> {
  const data = await shopifyFetch<{
    product: Product | null;
  }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
    revalidate: 60,
  });

  return data.product;
}

export async function getFeaturedProducts(count: number = 8): Promise<Product[]> {
  const { products } = await getProducts({
    first: count,
    sortKey: "BEST_SELLING",
  });
  return products;
}

export async function getNewArrivals(count: number = 8): Promise<Product[]> {
  const { products } = await getProducts({
    first: count,
    sortKey: "CREATED_AT",
    reverse: true,
  });
  return products;
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  try {
    const data = await shopifyFetch<{
      productRecommendations: Product[];
    }>({
      query: GET_PRODUCT_RECOMMENDATIONS_QUERY,
      variables: { productId },
      revalidate: 300,
    });

    return data.productRecommendations || [];
  } catch (error) {
    console.error("Error fetching product recommendations:", error);
    return [];
  }
}

export async function searchProducts({
  query,
  first = 20,
  after,
}: {
  query: string;
  first?: number;
  after?: string;
}): Promise<{ products: Product[]; totalCount: number; pageInfo: PageInfo }> {
  if (!query || query.trim() === "") {
    return {
      products: [],
      totalCount: 0,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  const data = await shopifyFetch<{
    search: {
      totalCount: number;
      pageInfo: PageInfo;
      nodes: Product[];
    };
  }>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query, first, after },
    revalidate: 60,
  });

  return {
    products: data.search?.nodes || [],
    totalCount: data.search?.totalCount || 0,
    pageInfo: data.search?.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}
