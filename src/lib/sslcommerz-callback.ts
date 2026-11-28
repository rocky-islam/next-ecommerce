import "server-only";

import { NextResponse, type NextRequest } from "next/server";
import { reconcileSslcommerzOrder } from "@/lib/sslcommerz";

type CallbackKind = "success" | "fail" | "cancel" | "ipn";

async function readParams(request: NextRequest): Promise<URLSearchParams> {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  if (request.method === "POST") {
    try {
      const form = await request.formData();
      form.forEach((value, key) => {
        if (typeof value === "string") params.set(key, value);
      });
    } catch {
      // Body was not form data; query params are enough
    }
  }
  return params;
}

/**
 * Shared handler for SSLCommerz callbacks. The browser is sent to
 * success/fail/cancel; SSLCommerz's server calls ipn. Either way the order
 * is reconciled against SSLCommerz directly, never against the posted data.
 */
export async function handleSslcommerzCallback(
  request: NextRequest,
  kind: CallbackKind
): Promise<Response> {
  const params = await readParams(request);
  const orderId = params.get("oid") || params.get("value_a");
  const gatewayStatus = (params.get("status") || "").toUpperCase();

  const shouldCancel =
    kind === "fail" ||
    kind === "cancel" ||
    (kind === "ipn" &&
      ["FAILED", "CANCELLED", "EXPIRED"].includes(gatewayStatus));

  let result: Awaited<ReturnType<typeof reconcileSslcommerzOrder>> = {
    status: "not_found",
  };

  if (orderId && /^\d+$/.test(orderId)) {
    try {
      result = await reconcileSslcommerzOrder({
        orderId,
        postedTranId: params.get("tran_id"),
        valId: params.get("val_id"),
        cancelIfUnpaid: shouldCancel,
      });
    } catch (error) {
      console.error(`SSLCommerz ${kind} callback failed:`, error);
      result = { status: "pending" };
    }
  }

  if (kind === "ipn") {
    return NextResponse.json({ received: true, status: result.status });
  }

  const statusParam =
    result.status === "paid"
      ? "success"
      : result.status === "pending"
      ? "pending"
      : kind === "cancel"
      ? "cancelled"
      : "failed";

  const target = new URL("/checkout/result", request.url);
  target.searchParams.set("status", statusParam);
  if (result.orderName) target.searchParams.set("order", result.orderName);

  // 303 turns SSLCommerz's POST into a normal GET page load
  return NextResponse.redirect(target, 303);
}
