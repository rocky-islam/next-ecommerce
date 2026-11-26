import { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  products,
  priorityCount = 4,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-base font-medium text-gray-900">No products found</p>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter selections.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 sm:gap-x-6 sm:gap-y-10">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
