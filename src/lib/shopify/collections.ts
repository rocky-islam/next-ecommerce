import { shopifyFetch } from "./client";
import {
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_BY_HANDLE_QUERY,
  GET_COLLECTION_COVERS_QUERY,
} from "./queries/collection";
import { Collection, PageInfo, Product, ShopifyImage } from "./types";

export async function getCollections(first: number = 20): Promise<Collection[]> {
  const data = await shopifyFetch<{
    collections: {
      nodes: Collection[];
    };
  }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first },
    revalidate: 120,
  });

  return data.collections?.nodes || [];
}

export async function getCollection(
  handle: string,
  {
    first = 24,
    after,
    sortKey = "BEST_SELLING",
    reverse = false,
  }: {
    first?: number;
    after?: string;
    sortKey?: "TITLE" | "PRICE" | "CREATED" | "BEST_SELLING" | "MANUAL" | "COLLECTION_DEFAULT";
    reverse?: boolean;
  } = {}
): Promise<{
  collection: Collection | null;
  products: Product[];
  pageInfo: PageInfo;
}> {
  const data = await shopifyFetch<{
    collection: (Collection & {
      products: {
        pageInfo: PageInfo;
        nodes: Product[];
      };
    }) | null;
  }>({
    query: GET_COLLECTION_BY_HANDLE_QUERY,
    variables: {
      handle,
      first,
      after,
      sortKey,
      reverse,
    },
    revalidate: 60,
  });

  if (!data.collection) {
    return {
      collection: null,
      products: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  const { products, ...collection } = data.collection;

  return {
    collection,
    products: products.nodes || [],
    pageInfo: products.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
  };
}

export type CollectionCover = {
  id: string;
  title: string;
  handle: string;
  image: ShopifyImage | null;
};

/**
 * Collections for merchandising rails. Uses the collection image when set,
 * otherwise its best-selling product's photo. Skips the storefront's
 * "frontpage" system collection and anything without an image.
 */
export async function getCollectionCovers(first: number = 20): Promise<CollectionCover[]> {
  const data = await shopifyFetch<{
    collections: {
      nodes: {
        id: string;
        title: string;
        handle: string;
        image: ShopifyImage | null;
        products: { nodes: { featuredImage: ShopifyImage | null }[] };
      }[];
    };
  }>({
    query: GET_COLLECTION_COVERS_QUERY,
    variables: { first },
    revalidate: 300,
  });

  return (data.collections?.nodes || [])
    .filter((c) => c.handle !== "frontpage")
    .map((c) => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
      image: c.image ?? c.products.nodes[0]?.featuredImage ?? null,
    }))
    .filter((c) => c.image !== null);
}
