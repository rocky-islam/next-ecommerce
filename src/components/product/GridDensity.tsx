"use client";

import { useSyncExternalStore } from "react";
import { Grid2X2, Grid3X3 } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import { SPRING } from "@/lib/motion";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";

export type Density = "comfort" | "compact";

// Session-wide choice shared by the toggle and the grid. Not persisted, so
// the server-rendered layout always matches the first client render.
let density: Density = "compact";
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
function setDensity(next: Density) {
  if (next === density) return;
  density = next;
  listeners.forEach((l) => l());
}
function useDensity(): Density {
  return useSyncExternalStore(subscribe, () => density, () => "compact");
}

const options: { value: Density; label: string; Icon: typeof Grid2X2 }[] = [
  { value: "comfort", label: "Larger product tiles", Icon: Grid2X2 },
  { value: "compact", label: "More products per row", Icon: Grid3X3 },
];

export function DensityToggle() {
  const current = useDensity();
  return (
    <LayoutGroup id="density-toggle">
      <div role="radiogroup" aria-label="Grid density" className="inline-flex items-center rounded-full border border-neutral-200 p-0.5">
        {options.map(({ value, label, Icon }) => {
          const active = current === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              onClick={() => setDensity(value)}
              className={`relative grid h-8 w-8 place-items-center rounded-full transition-colors duration-300 cursor-pointer ${
                active ? "text-white" : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="density-active"
                  transition={SPRING.glide}
                  className="absolute inset-0 rounded-full bg-neutral-900"
                />
              )}
              <Icon className="relative h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

const gridClass: Record<Density, string> = {
  compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10",
  comfort: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-14",
};

/** Product grid that re-flows with a layout animation when density changes. */
export function DensityProductGrid({
  products,
  priorityCount = 4,
}: {
  products: Product[];
  priorityCount?: number;
}) {
  const current = useDensity();
  return (
    <LayoutGroup id="density-grid">
      <div className={`grid ${gridClass[current]}`}>
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            layout="position"
            transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.9 }}
          >
            <ProductCard
              product={product}
              priority={index < priorityCount}
              index={index}
            />
          </motion.div>
        ))}
      </div>
    </LayoutGroup>
  );
}
