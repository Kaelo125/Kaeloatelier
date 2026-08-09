"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatUGX } from "@/lib/utils";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <ShoppingBag size={40} className="mx-auto text-navy/30 mb-4" />
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">
          Your cart is empty
        </h1>
        <p className="text-navy/50 text-sm mb-6">
          Browse the collection and add pieces you love.
        </p>
        <Link
          href="/"
          className="inline-block bg-navy text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-navy-light transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
      <h1 className="font-display text-3xl font-semibold text-navy mb-6">
        Your Cart
      </h1>

      <div className="space-y-4">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex gap-4 bg-white border border-navy/10 rounded-2xl p-3 shadow-card"
            >
              <div className="relative w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-cream">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-navy text-sm leading-snug">
                    {item.name}
                    {item.variant && (
                      <span className="text-navy/50"> — {item.variant}</span>
                    )}
                  </h3>
                  {(item.size || item.color) && (
                    <p className="text-xs text-navy/50 mt-0.5">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.size && item.color && <span> · </span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-navy mt-0.5">
                    {formatUGX(item.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3 border border-navy/15 rounded-full px-2 py-1">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1, item.size, item.color)
                      }
                      aria-label="Decrease quantity"
                      className="text-navy"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1, item.size, item.color)
                      }
                      aria-label="Increase quantity"
                      className="text-navy"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId, item.size, item.color)}
                    aria-label="Remove item"
                    className="text-navy/40 hover:text-green transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-navy/10 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-navy/50">Total</p>
            <p className="font-display text-xl font-semibold text-navy">
              {formatUGX(totalPrice)}
            </p>
          </div>
          <Link
            href="/checkout"
            className="bg-navy text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-navy-light transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
