// ---------------------------------------------------------------------------
// Shared types used across the Kaelo Atelier app
// ---------------------------------------------------------------------------

export type Category =
  | "Silk scarves"
  | "Handbags"
  | "Watches"
  | "Jewelry"
  | "Sunglasses"
  | "Phone cases"
  | "Chargers/cables"
  | "Earphones"
  | "Power banks"
  | "Small beauty/lifestyle accessories";

export interface Product {
  id: string;
  name: string;
  variant?: string; // e.g. color, "Navy", "Black" — legacy single-variant label
  price: number; // current price, UGX
  oldPrice: number; // original price, UGX
  category: Category;
  image: string; // primary/legacy image — kept for backward compatibility
  images?: string[]; // up to 4 gallery images; falls back to [image] if absent
  rating: number; // 0-5 (seeded average; live average is computed from reviews when any exist)
  reviews: number; // seeded review count
  description: string;
  sizes?: string[]; // e.g. ["S","M","L","XL"]
  colors?: string[]; // e.g. ["Navy","Tan","Black"]
  stock?: number; // units in stock
  onSale?: boolean; // manual sale flag (falls back to price < oldPrice if unset)
}

export interface CartItem {
  productId: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export type OrderStatus = "Placed" | "Processing" | "Shipped" | "Delivered";

export interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  color?: string;
}

export interface Order {
  id: string; // internal id, e.g. KAE_xxxxx
  orderNumber: string; // human-friendly, e.g. KAEL-20260809-001
  createdAt: string; // ISO date
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: "MTN Mobile Money" | "Airtel Money";
  status: OrderStatus;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  password: string; // demo only — plain text, localStorage-based auth
}

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO date
}
