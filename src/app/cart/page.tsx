import { CartView } from "@/components/cart/CartView";

export const instant = false;

export const metadata = {
  title: "Shopping Bag | KINETIC // STUDIO",
  description: "Review items in your shopping bag and proceed to 256-bit SSL encrypted checkout.",
};

export default function CartPage() {
  return <CartView />;
}
