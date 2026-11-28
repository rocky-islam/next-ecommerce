import type { NextRequest } from "next/server";
import { handleSslcommerzCallback } from "@/lib/sslcommerz-callback";

export async function POST(request: NextRequest) {
  return handleSslcommerzCallback(request, "fail");
}

export async function GET(request: NextRequest) {
  return handleSslcommerzCallback(request, "fail");
}
