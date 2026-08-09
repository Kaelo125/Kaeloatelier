import { CartItem, Order, Product, Review, User } from "./types";
import { INITIAL_PRODUCTS } from "./data";

// ---------------------------------------------------------------------------
// Everything in this file talks to window.localStorage. Since Kaelo Atelier
// has no backend yet, localStorage plays the role of a database. Each helper
// is defensive about running in the browser (Next.js also renders on the
// server, where `window` doesn't exist).
// ---------------------------------------------------------------------------

const KEYS = {
  products: "kaelo_products",
  cart: "kaelo_cart",
  orders: "kaelo_orders",
  users: "kaelo_users",
  session: "kaelo_session", // currently logged-in user's email
  reviews: "kaelo_reviews",
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

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ----------------------------- Products -----------------------------------

export function getProducts(): Product[] {
  const existing = read<Product[] | null>(KEYS.products, null);
  if (existing && existing.length > 0) return existing;
  // First run: seed with the default catalog
  write(KEYS.products, INITIAL_PRODUCTS);
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  write(KEYS.products, products);
}

// ------------------------------- Cart ---------------------------------------

export function getCart(): CartItem[] {
  return read<CartItem[]>(KEYS.cart, []);
}

export function saveCart(cart: CartItem[]) {
  write(KEYS.cart, cart);
}

// ------------------------------ Orders --------------------------------------

export function getOrders(): Order[] {
  return read<Order[]>(KEYS.orders, []);
}

export function saveOrders(orders: Order[]) {
  write(KEYS.orders, orders);
}

export function addOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  saveOrders(orders);
}

// -------------------------- Users / session ---------------------------------

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

export function getAllReviews(): Review[] {
  return read<Review[]>(KEYS.reviews, []);
}

export function getReviewsForProduct(productId: string): Review[] {
  return getAllReviews()
    .filter((r) => r.productId === productId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addReview(review: Review) {
  const reviews = getAllReviews();
  reviews.unshift(review);
  write(KEYS.reviews, reviews);
}
