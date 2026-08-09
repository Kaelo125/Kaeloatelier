"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/lib/types";
import { getCart, saveCart } from "@/lib/storage";

interface CartContextValue {
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    options?: { size?: string; color?: string }
  ) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // Tracks the id of the most recently added product so components can
  // trigger a one-off "flying to cart" animation.
  lastAdded: string | null;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

// A cart line is uniquely identified by product + chosen size + chosen color,
// so the same product in two different sizes shows as two separate lines.
function sameLine(
  item: CartItem,
  productId: string,
  size?: string,
  color?: string
) {
  return (
    item.productId === productId &&
    (item.size ?? "") === (size ?? "") &&
    (item.color ?? "") === (color ?? "")
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage once, on mount (client only)
  useEffect(() => {
    setCart(getCart());
    setHydrated(true);
  }, []);

  // Persist every change back to localStorage
  useEffect(() => {
    if (hydrated) saveCart(cart);
  }, [cart, hydrated]);

  function addToCart(
    product: Product,
    quantity = 1,
    options?: { size?: string; color?: string }
  ) {
    const size = options?.size;
    const color = options?.color;

    setCart((prev) => {
      const existing = prev.find((item) =>
        sameLine(item, product.id, size, color)
      );
      if (existing) {
        return prev.map((item) =>
          sameLine(item, product.id, size, color)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          variant: product.variant,
          price: product.price,
          image: product.image,
          quantity,
          size,
          color,
        },
      ];
    });
    setLastAdded(product.id);
    // Clear the "lastAdded" flag shortly after, so the animation can retrigger
    setTimeout(() => setLastAdded(null), 900);
  }

  function removeFromCart(productId: string, size?: string, color?: string) {
    setCart((prev) => prev.filter((item) => !sameLine(item, productId, size, color)));
  }

  function updateQuantity(
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        sameLine(item, productId, size, color) ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        lastAdded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
