// Format a number as Ugandan Shillings, e.g. 280000 -> "UGX 280,000"
export function formatUGX(amount: number): string {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

// Compute the discount percentage between an old and new price
export function discountPercent(price: number, oldPrice: number): number {
  if (oldPrice <= 0) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

// Generate a short, human-friendly unique id (order ids, product ids, etc.)
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
