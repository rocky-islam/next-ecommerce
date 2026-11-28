import { Suspense } from "react";
import { PaymentResultView } from "@/components/checkout/PaymentResultView";

export const metadata = {
  title: "Payment Status | KINETIC // STUDIO",
  robots: { index: false },
};

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={<div className="min-h-[60vh]" aria-busy="true" />}
    >
      <PaymentResultView />
    </Suspense>
  );
}
