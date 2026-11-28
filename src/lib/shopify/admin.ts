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

export const SSLCOMMERZ_TRAN_ATTR = "sslcommerz_tran_id";
export const PAYMENT_PENDING_TAG = "Payment-Pending";

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
  paymentMethod: "cod" | "mobile_banking" | "sslcommerz";
  mobileWallet?: string;
  transactionId?: string;
  /** Our own gateway transaction id (SSLCommerz tran_id), stored on the order */
  gatewayTranId?: string;
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
      : input.paymentMethod === "sslcommerz"
      ? `SSLCommerz Online Payment - tran_id: ${input.gatewayTranId}`
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
    input.paymentMethod === "cod"
      ? "COD"
      : input.paymentMethod === "sslcommerz"
      ? "SSLCommerz"
      : "Mobile-Banking",
    input.deliveryZone === "dhaka" ? "Dhaka" : "Outside-Dhaka",
    ...(input.paymentMethod === "sslcommerz" ? [PAYMENT_PENDING_TAG] : []),
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
        ...(input.gatewayTranId
          ? {
              customAttributes: [
                { key: SSLCOMMERZ_TRAN_ATTR, value: input.gatewayTranId },
              ],
            }
          : {}),
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

/* -------------------------------------------------------------------------- */
/*                    Order lookup / payment state (SSLCommerz)               */
/* -------------------------------------------------------------------------- */

export type AdminOrderSummary = {
  id: string;
  name: string;
  displayFinancialStatus: string;
  cancelledAt: string | null;
  totalAmount: string;
  currencyCode: string;
  tags: string[];
  customAttributes: { key: string; value: string | null }[];
};

export function toOrderGid(orderId: string): string {
  return orderId.startsWith("gid://") ? orderId : `gid://shopify/Order/${orderId}`;
}

export function toOrderLegacyId(orderGid: string): string {
  return orderGid.split("/").pop() || orderGid;
}

export async function getAdminOrder(
  orderId: string
): Promise<AdminOrderSummary | null> {
  const data = await shopifyAdminFetch<{
    order: {
      id: string;
      name: string;
      displayFinancialStatus: string;
      cancelledAt: string | null;
      tags: string[];
      customAttributes: { key: string; value: string | null }[];
      totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
    } | null;
  }>({
    query: /* GraphQL */ `
      query getOrder($id: ID!) {
        order(id: $id) {
          id
          name
          displayFinancialStatus
          cancelledAt
          tags
          customAttributes {
            key
            value
          }
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
        }
      }
    `,
    variables: { id: toOrderGid(orderId) },
  });

  if (!data.order) return null;
  const { totalPriceSet, ...rest } = data.order;
  return {
    ...rest,
    totalAmount: totalPriceSet.shopMoney.amount,
    currencyCode: totalPriceSet.shopMoney.currencyCode,
  };
}

async function updateOrderTags(
  orderGid: string,
  add: string[],
  remove: string[]
): Promise<void> {
  await shopifyAdminFetch({
    query: /* GraphQL */ `
      mutation updateTags($id: ID!, $add: [String!]!, $remove: [String!]!) {
        tagsAdd(id: $id, tags: $add) {
          userErrors {
            message
          }
        }
        tagsRemove(id: $id, tags: $remove) {
          userErrors {
            message
          }
        }
      }
    `,
    variables: { id: orderGid, add, remove },
  });
}

export async function addOrderTags(orderGid: string, tags: string[]) {
  await updateOrderTags(orderGid, tags, []);
}

/**
 * Marks the order as paid and records the gateway details on it.
 * Safe to call twice (success redirect + IPN can race).
 */
export async function markAdminOrderPaid(
  order: AdminOrderSummary,
  details: Record<string, string | undefined>
): Promise<void> {
  const data = await shopifyAdminFetch<{
    orderMarkAsPaid: { userErrors: { message: string }[] };
  }>({
    query: /* GraphQL */ `
      mutation markPaid($input: OrderMarkAsPaidInput!) {
        orderMarkAsPaid(input: $input) {
          userErrors {
            message
          }
        }
      }
    `,
    variables: { input: { id: order.id } },
  });

  const errors = data.orderMarkAsPaid.userErrors;
  if (errors.length > 0) {
    // Another request may have already marked it paid
    const fresh = await getAdminOrder(order.id);
    if (fresh?.displayFinancialStatus !== "PAID") {
      throw new Error(errors.map((e) => e.message).join(", "));
    }
    return;
  }

  // Keep existing attributes and append gateway details
  const existing = order.customAttributes.filter(
    (a) => !(a.key in details)
  );
  const extra = Object.entries(details)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => ({ key, value }));

  await shopifyAdminFetch({
    query: /* GraphQL */ `
      mutation updateAttrs($input: OrderInput!) {
        orderUpdate(input: $input) {
          userErrors {
            message
          }
        }
      }
    `,
    variables: {
      input: {
        id: order.id,
        customAttributes: [
          ...existing.map((a) => ({ key: a.key, value: a.value ?? "" })),
          ...extra,
        ],
      },
    },
  });

  await updateOrderTags(order.id, ["Paid-Online"], [PAYMENT_PENDING_TAG]);
}

/** Cancels an unpaid order and puts the stock back. */
export async function cancelAdminOrder(
  orderGid: string,
  staffNote: string
): Promise<void> {
  const data = await shopifyAdminFetch<{
    orderCancel: { orderCancelUserErrors: { message: string }[] };
  }>({
    query: /* GraphQL */ `
      mutation cancelOrder($orderId: ID!, $staffNote: String) {
        orderCancel(
          orderId: $orderId
          reason: DECLINED
          restock: true
          notifyCustomer: false
          staffNote: $staffNote
        ) {
          orderCancelUserErrors {
            message
          }
        }
      }
    `,
    variables: { orderId: orderGid, staffNote },
  });

  const errors = data.orderCancel.orderCancelUserErrors;
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(", "));
  }

  await updateOrderTags(orderGid, ["Payment-Failed"], [PAYMENT_PENDING_TAG]);
}
