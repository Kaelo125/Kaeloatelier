import { CartItem, Order, OrderItem, Product, Review, User } from "./types";
import { supabase } from "./supabaseClient";

// ---------------------------------------------------------------------------
// Products, orders, and reviews are shared data — they live in Supabase so
// every visitor sees the same catalog and the shop owner sees every order,
// regardless of device or browser.
//
// Cart contents, the logged-in user list, and the current session are kept
// in the browser's localStorage on purpose: a cart is naturally per-device,
// and this keeps that part of the app instant with no network wait.
// ---------------------------------------------------------------------------

const KEYS = {
  cart: "kaelo_cart",
  users: "kaelo_users",
  session: "kaelo_session", // currently logged-in user's email
};

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): boolean {
  if (!isBrowser()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Kaelo storage: failed to save "${key}"`, err);
    return false;
  }
}

// ----------------------------- Products -----------------------------------
// Stored in Supabase's `products` table (snake_case columns), mapped to/from
// our camelCase Product type at the boundary.

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    variant: row.variant ?? undefined,
    price: row.price,
    oldPrice: row.old_price,
    category: row.category,
    image: row.image,
    images: row.images ?? undefined,
    rating: Number(row.rating) || 0,
    reviews: row.reviews ?? 0,
    description: row.description ?? "",
    sizes: row.sizes ?? undefined,
    colors: row.colors ?? undefined,
    stock: row.stock ?? undefined,
    onSale: row.on_sale ?? undefined,
  };
}

function productToRow(p: Product) {
  return {
    id: p.id,
    name: p.name,
    variant: p.variant ?? null,
    price: p.price,
    old_price: p.oldPrice,
    category: p.category,
    image: p.image,
    images: p.images ?? null,
    rating: p.rating,
    reviews: p.reviews,
    description: p.description ?? null,
    sizes: p.sizes ?? null,
    colors: p.colors ?? null,
    stock: p.stock ?? null,
    on_sale: p.onSale ?? null,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Kaelo: failed to load products", error);
    return [];
  }
  return (data ?? []).map(rowToProduct);
}

// Add a brand-new product (used by the admin "Add Product" form)
export async function addProduct(product: Product): Promise<boolean> {
  const { error } = await supabase.from("products").insert(productToRow(product));
  if (error) {
    console.error("Kaelo: failed to add product", error);
    return false;
  }
  return true;
}

// Update an existing product (used by the admin "Edit Product" form)
export async function updateProduct(product: Product): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update(productToRow(product))
    .eq("id", product.id);
  if (error) {
    console.error("Kaelo: failed to update product", error);
    return false;
  }
  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Kaelo: failed to delete product", error);
    return false;
  }
  return true;
}

// Upload a product photo to Supabase Storage and return its public URL.
export async function uploadProductImage(file: File): Promise<string | null> {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) {
    console.error("Kaelo: failed to upload image", error);
    return null;
  }
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

// ------------------------------- Cart ---------------------------------------
// Stays in localStorage — naturally per-device, no need to centralize.

export function getCart(): CartItem[] {
  return read<CartItem[]>(KEYS.cart, []);
}

export function saveCart(cart: CartItem[]): boolean {
  return write(KEYS.cart, cart);
}

// ------------------------------ Orders --------------------------------------

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    createdAt: row.created_at,
    customer: {
      name: row.customer_name,
      email: row.customer_email,
      phone: row.customer_phone,
      address: row.customer_address,
    },
    items: row.items as OrderItem[],
    total: row.total,
    paymentMethod: row.payment_method,
    status: row.status,
  };
}

export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Kaelo: failed to load orders", error);
    return [];
  }
  return (data ?? []).map(rowToOrder);
}

export async function addOrder(order: Order): Promise<boolean> {
  const { error } = await supabase.from("orders").insert({
    id: order.id,
    order_number: order.orderNumber,
    created_at: order.createdAt,
    customer_name: order.customer.name,
    customer_email: order.customer.email,
    customer_phone: order.customer.phone,
    customer_address: order.customer.address,
    items: order.items,
    total: order.total,
    payment_method: order.paymentMethod,
    status: order.status,
  });
  if (error) {
    console.error("Kaelo: failed to save order", error);
    return false;
  }
  return true;
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<boolean> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) {
    console.error("Kaelo: failed to update order status", error);
    return false;
  }
  return true;
}

// -------------------------- Users / session ---------------------------------
// Stays in localStorage — this is a lightweight demo auth system, not tied
// to Supabase's own auth product.

export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]) {
  write(KEYS.users, users);
}

export function getSession(): string | null {
  return read<string | null>(KEYS.session, null);
}

export function setSession(email: string | null) {
  write(KEYS.session, email);
}

export function getCurrentUser(): User | null {
  const email = getSession();
  if (!email) return null;
  return getUsers().find((u) => u.email === email) ?? null;
}

// ------------------------------ Reviews -------------------------------------

function rowToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Kaelo: failed to load reviews", error);
    return [];
  }
  return (data ?? []).map(rowToReview);
}

export async function addReview(review: Review): Promise<boolean> {
  const { error } = await supabase.from("reviews").insert({
    id: review.id,
    product_id: review.productId,
    name: review.name,
    rating: review.rating,
    comment: review.comment,
    created_at: review.createdAt,
  });
  if (error) {
    console.error("Kaelo: failed to save review", error);
    return false;
  }
  return true;
}
