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
  variant?: string; // e.g. color, "Navy", "Black"
  price: number; // current price, UGX
  oldPrice: number; // original price, UGX
  category: Category;
  image: string;
  rating: number; // 0-5
  reviews: number;
  description: string;
}

export interface CartItem {
  productId: string;
  name: string;
  variant?: string;
  price: number;
  image: string;
  quantity: number;
}

export type OrderStatus = "Placed" | "Processing" | "Shipped" | "Delivered";

export interface OrderItem {
  productId: string;
  name: string;
  variant?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
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
