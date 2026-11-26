export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number | null;
  price: Money;
  compareAtPrice: Money | null;
  image: ShopifyImage | null;
  selectedOptions: SelectedOption[];
  product?: {
    title: string;
    handle: string;
    featuredImage: ShopifyImage | null;
  };
};

export type Product = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  vendor: string;
  tags: string[];
  options: ProductOption[];
  featuredImage: ShopifyImage | null;
  images: {
    nodes: ShopifyImage[];
  };
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice?: Money;
  };
  compareAtPriceRange?: {
    minVariantPrice: Money;
    maxVariantPrice?: Money;
  };
  variants: {
    nodes: ProductVariant[];
  };
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string | null;
  endCursor: string | null;
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  image: ShopifyImage | null;
  products?: {
    nodes: Product[];
    pageInfo?: PageInfo;
  };
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
    subtotalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    price: Money;
    compareAtPrice: Money | null;
    image: ShopifyImage | null;
    selectedOptions: SelectedOption[];
    product: {
      id: string;
      title: string;
      handle: string;
      featuredImage: ShopifyImage | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money | null;
  };
  lines: {
    nodes: CartLine[];
  };
  discountCodes?: {
    code: string;
    applicable: boolean;
  }[];
};

export type UserError = {
  field: string[];
  message: string;
};

export type Shop = {
  name: string;
  description: string | null;
  primaryDomain: {
    url: string;
  };
};

export type ProductSortKey =
  | "TITLE"
  | "PRICE"
  | "CREATED_AT"
  | "BEST_SELLING"
  | "RELEVANCE";
