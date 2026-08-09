import { Product } from "./types";

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

// Return a product's gallery images, falling back to its single legacy
// `image` field (repeated) so older/seed products still show a gallery.
export function getProductImages(product: Product): string[] {
  if (product.images && product.images.length > 0) return product.images;
  return [product.image];
}

// Generate a customer-facing order number, e.g. "KAEL-20260809-001".
// The sequence number is based on how many orders already exist today,
// which is good enough for a localStorage-only demo store.
export function generateOrderNumber(existingOrdersToday: number): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const seq = String(existingOrdersToday + 1).padStart(3, "0");
  return `KAEL-${y}${m}${d}-${seq}`;
}
