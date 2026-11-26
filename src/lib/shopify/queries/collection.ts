import { PRODUCT_FRAGMENT } from "./product";

export const GET_COLLECTIONS_QUERY = `
  query GetCollections($first: Int = 20) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
          width
          height
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE_QUERY = `
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle(
    $handle: String!
    $first: Int = 24
    $after: String
    $sortKey: ProductCollectionSortKeys = BEST_SELLING
    $reverse: Boolean = false
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        url
        altText
        width
        height
      }
      products(
        first: $first
        after: $after
        sortKey: $sortKey
        reverse: $reverse
      ) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          ...ProductFragment
        }
      }
    }
  }
`;

/** Collections with a cover drawn from their first product (none have their own image). */
export const GET_COLLECTION_COVERS_QUERY = `
  query GetCollectionCovers($first: Int = 20) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        image {
          url
          altText
          width
          height
        }
        products(first: 1, sortKey: BEST_SELLING) {
          nodes {
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
`;
