export function formatPrice(
  amount: string | number,
  currencyCode: string = "BDT"
): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return `${currencyCode} 0.00`;
  }

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  } catch {
    return `${currencyCode} ${numericAmount.toFixed(2)}`;
  }
}

export function calculateDiscountPercentage(
  price: string | number,
  compareAtPrice: string | number | null | undefined
): number | null {
  if (!compareAtPrice) return null;

  const current = typeof price === "string" ? parseFloat(price) : price;
  const original =
    typeof compareAtPrice === "string" ? parseFloat(compareAtPrice) : compareAtPrice;

  if (isNaN(current) || isNaN(original) || original <= current) {
    return null;
  }

  const discount = Math.round(((original - current) / original) * 100);
  return discount > 0 ? discount : null;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
