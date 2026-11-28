import "server-only";

import {
  addOrderTags,
  cancelAdminOrder,
  getAdminOrder,
  markAdminOrderPaid,
  SSLCOMMERZ_TRAN_ATTR,
  toOrderGid,
} from "@/lib/shopify/admin";

/* -------------------------------------------------------------------------- */
/*                                   Config                                   */
/* -------------------------------------------------------------------------- */

function getConfig() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  const isLive = process.env.SSLCOMMERZ_IS_LIVE === "true";

  if (!storeId || !storePassword) {
    throw new Error(
      "SSLCommerz is not configured. Add SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD to your environment variables."
    );
  }

  return {
    storeId,
    storePassword,
    baseUrl: isLive
      ? "https://securepay.sslcommerz.com"
      : "https://sandbox.sslcommerz.com",
  };
}

/** Generates a unique transaction id (SSLCommerz limit: 30 chars). */
export function generateTranId(): string {
  const random = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  return `NX${Date.now()}${random}`.toUpperCase();
}

/* -------------------------------------------------------------------------- */
/*                              Session (payment)                             */
/* -------------------------------------------------------------------------- */

export type InitPaymentInput = {
  tranId: string;
  orderLegacyId: string;
  totalAmount: string;
  currency: string;
  siteUrl: string;
  customer: {
    name: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
  };
  productName: string;
  itemCount: number;
};

export async function initSslcommerzPayment(
  input: InitPaymentInput
): Promise<string> {
  const { storeId, storePassword, baseUrl } = getConfig();
  const callback = (path: string) =>
    `${input.siteUrl}/api/sslcommerz/${path}?oid=${input.orderLegacyId}`;

  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: input.totalAmount,
    currency: input.currency,
    tran_id: input.tranId,
    success_url: callback("success"),
    fail_url: callback("fail"),
    cancel_url: callback("cancel"),
    ipn_url: callback("ipn"),
    cus_name: input.customer.name,
    // SSLCommerz requires an email; email is optional on our form
    cus_email: input.customer.email || "customer@example.com",
    cus_add1: input.customer.address,
    cus_city: input.customer.city,
    cus_country: "Bangladesh",
    cus_phone: input.customer.phone,
    shipping_method: "NO",
    num_of_item: String(input.itemCount),
    product_name: input.productName.slice(0, 255),
    product_category: "Footwear",
    product_profile: "physical-goods",
    value_a: input.orderLegacyId,
  });

  const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const json = (await response.json()) as {
    status?: string;
    failedreason?: string;
    GatewayPageURL?: string;
  };

  if (json.status !== "SUCCESS" || !json.GatewayPageURL) {
    throw new Error(
      `SSLCommerz could not start the payment: ${
        json.failedreason || json.status || response.status
      }`
    );
  }

  return json.GatewayPageURL;
}

/* -------------------------------------------------------------------------- */
/*                            Validation (server-side)                        */
/* -------------------------------------------------------------------------- */

type SslTransaction = {
  status: string;
  tran_id: string;
  val_id?: string;
  amount?: string;
  currency_type?: string;
  currency_amount?: string;
  bank_tran_id?: string;
  card_type?: string;
  risk_level?: string;
};

const PAID_STATUSES = new Set(["VALID", "VALIDATED"]);

async function validateByValId(valId: string): Promise<SslTransaction | null> {
  const { storeId, storePassword, baseUrl } = getConfig();
  const params = new URLSearchParams({
    val_id: valId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });
  const res = await fetch(
    `${baseUrl}/validator/api/validationserverAPI.php?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return (await res.json()) as SslTransaction;
}

async function queryByTranId(tranId: string): Promise<SslTransaction[]> {
  const { storeId, storePassword, baseUrl } = getConfig();
  const params = new URLSearchParams({
    tran_id: tranId,
    store_id: storeId,
    store_passwd: storePassword,
    format: "json",
  });
  const res = await fetch(
    `${baseUrl}/validator/api/merchantTransIDvalidationAPI.php?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = (await res.json()) as { element?: SslTransaction[] };
  return json.element || [];
}

/* -------------------------------------------------------------------------- */
/*                     Reconcile gateway result → Shopify order               */
/* -------------------------------------------------------------------------- */

export type ReconcileResult = {
  status: "paid" | "cancelled" | "pending" | "not_found";
  orderName?: string;
};

/**
 * Never trusts what the browser posts back. It looks the payment up with
 * SSLCommerz directly, checks it belongs to this order and covers the full
 * amount, and only then marks the Shopify order paid.
 */
export async function reconcileSslcommerzOrder({
  orderId,
  postedTranId,
  valId,
  cancelIfUnpaid,
}: {
  orderId: string;
  postedTranId?: string | null;
  valId?: string | null;
  cancelIfUnpaid: boolean;
}): Promise<ReconcileResult> {
  const order = await getAdminOrder(toOrderGid(orderId));
  if (!order) return { status: "not_found" };

  const storedTranId = order.customAttributes.find(
    (a) => a.key === SSLCOMMERZ_TRAN_ATTR
  )?.value;

  // Not an SSLCommerz order, or the callback is for another transaction
  if (!storedTranId || (postedTranId && postedTranId !== storedTranId)) {
    return { status: "not_found" };
  }

  if (order.displayFinancialStatus === "PAID") {
    return { status: "paid", orderName: order.name };
  }
  if (order.cancelledAt) {
    return { status: "cancelled", orderName: order.name };
  }

  // Find a successful transaction for this order
  let paidTxn: SslTransaction | undefined;
  if (valId) {
    const txn = await validateByValId(valId);
    if (txn && PAID_STATUSES.has(txn.status) && txn.tran_id === storedTranId) {
      paidTxn = txn;
    }
  }
  if (!paidTxn) {
    const txns = await queryByTranId(storedTranId);
    paidTxn = txns.find(
      (t) => PAID_STATUSES.has(t.status) && t.tran_id === storedTranId
    );
  }

  if (paidTxn) {
    const paidAmount = parseFloat(paidTxn.currency_amount || paidTxn.amount || "0");
    const currencyOk =
      !paidTxn.currency_type || paidTxn.currency_type === order.currencyCode;
    const amountOk = paidAmount + 0.01 >= parseFloat(order.totalAmount);

    if (!currencyOk || !amountOk) {
      await addOrderTags(order.id, ["SSLCommerz-Amount-Mismatch"]);
      return { status: "pending", orderName: order.name };
    }

    await markAdminOrderPaid(order, {
      sslcommerz_val_id: paidTxn.val_id,
      sslcommerz_bank_tran_id: paidTxn.bank_tran_id,
      sslcommerz_card_type: paidTxn.card_type,
    });
    if (paidTxn.risk_level === "1") {
      await addOrderTags(order.id, ["SSLCommerz-Risk-Review"]);
    }
    return { status: "paid", orderName: order.name };
  }

  // Only cancel when the caller proved it knows this order's random tran_id
  if (cancelIfUnpaid && postedTranId === storedTranId) {
    await cancelAdminOrder(
      order.id,
      `SSLCommerz payment not completed (tran_id: ${storedTranId})`
    );
    return { status: "cancelled", orderName: order.name };
  }

  return { status: "pending", orderName: order.name };
}
