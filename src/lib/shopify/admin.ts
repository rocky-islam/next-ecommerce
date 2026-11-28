import "server-only";

type AdminFetchOptions = {
  query: string;
  variables?: Record<string, unknown>;
};

export async function shopifyAdminFetch<T>({
  query,
  variables,
}: AdminFetchOptions): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || "2026-10";

  if (!domain) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN environment variable.");
  }

  if (!adminToken) {
    throw new Error(
      "SHOPIFY_ADMIN_ACCESS_TOKEN is not configured. Please add your Shopify Admin API access token to .env.local (and Vercel Environment Variables) to create orders directly."
    );
  }

  const endpoint = `https://${domain}/admin/api/${version}/graphql.json`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": adminToken,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Shopify Admin API Error (${response.status}): ${errorText}`
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(
      `Shopify Admin GraphQL Error: ${json.errors
        .map((e: { message: string }) => e.message)
        .join(", ")}`
    );
  }

  return json.data;
}

const ORDER_CREATE_MUTATION = /* GraphQL */ `
  mutation orderCreate(
    $order: OrderCreateOrderInput!
    $options: OrderCreateOptionsInput
  ) {
    orderCreate(order: $order, options: $options) {
      userErrors {
        field
        message
      }
      order {
        id
        name
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        displayFinancialStatus
      }
    }
  }
`;

export type CreateAdminOrderInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  deliveryZone: "dhaka" | "outside_dhaka";
  shippingCost: number;
  currencyCode: string;
  paymentMethod: "cod" | "mobile_banking";
  mobileWallet?: string;
  transactionId?: string;
  note?: string;
  lineItems: {
    variantId: string;
    quantity: number;
    unitPrice?: string;
  }[];
};

export type CreatedAdminOrder = {
  id: string;
  name: string;
  totalAmount: string;
  currencyCode: string;
  financialStatus: string;
};

export async function createShopifyAdminOrder(
  input: CreateAdminOrderInput
): Promise<CreatedAdminOrder> {
  const shippingTitle =
    input.shippingCost === 0
      ? `Complimentary Shipping (${
          input.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"
        })`
      : input.deliveryZone === "dhaka"
      ? "Inside Dhaka Express Delivery"
      : "Nationwide 64-District Delivery";

  const paymentLabel =
    input.paymentMethod === "cod"
      ? "Cash on Delivery (COD)"
      : `Mobile Banking (${input.mobileWallet || "bKash/Nagad"}) - TrxID: ${
          input.transactionId || "Pending"
        }`;

  const orderNoteParts = [
    `Payment Method: ${paymentLabel}`,
    `Delivery Zone: ${
      input.deliveryZone === "dhaka" ? "Inside Dhaka" : "Outside Dhaka"
    }`,
    input.note ? `Customer Note: ${input.note}` : null,
  ].filter(Boolean);

  const tags = [
    "custom-nextjs-checkout",
    input.paymentMethod === "cod" ? "COD" : "Mobile-Banking",
    input.deliveryZone === "dhaka" ? "Dhaka" : "Outside-Dhaka",
  ];

  const address = {
    firstName: input.firstName,
    lastName: input.lastName || "-",
    address1: input.address,
    city: input.city,
    countryCode: "BD",
    phone: input.phone,
  };

  const data = await shopifyAdminFetch<{
    orderCreate: {
      userErrors: { field: string[]; message: string }[];
      order: {
        id: string;
        name: string;
        totalPriceSet: {
          shopMoney: {
            amount: string;
            currencyCode: string;
          };
        };
        displayFinancialStatus: string;
      } | null;
    };
  }>({
    query: ORDER_CREATE_MUTATION,
    variables: {
      order: {
        ...(input.email ? { email: input.email } : {}),
        phone: input.phone,
        currency: input.currencyCode || "BDT",
        financialStatus: "PENDING",
        note: orderNoteParts.join(" | "),
        tags,
        sourceName: "nextjs-custom-checkout",
        lineItems: input.lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
          ...(item.unitPrice
            ? {
                priceSet: {
                  shopMoney: {
                    amount: item.unitPrice,
                    currencyCode: input.currencyCode || "BDT",
                  },
                },
              }
            : {}),
        })),
        shippingAddress: address,
        billingAddress: address,
        shippingLines: [
          {
            title: shippingTitle,
            priceSet: {
              shopMoney: {
                amount: input.shippingCost.toFixed(2),
                currencyCode: input.currencyCode || "BDT",
              },
            },
          },
        ],
      },
      options: {
        inventoryBehaviour: "DECREMENT_OBEYING_POLICY",
      },
    },
  });

  if (data.orderCreate.userErrors && data.orderCreate.userErrors.length > 0) {
    throw new Error(
      data.orderCreate.userErrors.map((e) => e.message).join(", ")
    );
  }

  if (!data.orderCreate.order) {
    throw new Error("Order creation failed without a returned order.");
  }

  return {
    id: data.orderCreate.order.id,
    name: data.orderCreate.order.name,
    totalAmount: data.orderCreate.order.totalPriceSet.shopMoney.amount,
    currencyCode: data.orderCreate.order.totalPriceSet.shopMoney.currencyCode,
    financialStatus: data.orderCreate.order.displayFinancialStatus,
  };
}
