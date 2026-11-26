import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/shopify/products";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ products: [], totalCount: 0 });
  }

  try {
    const { products, totalCount } = await searchProducts({
      query: q.trim(),
      first: 8,
    });

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        featuredImage: p.featuredImage,
        priceRange: p.priceRange,
      })),
      totalCount,
    });
  } catch (error) {
    console.error("Live search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products", products: [], totalCount: 0 },
      { status: 500 }
    );
  }
}
