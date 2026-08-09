"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { getOrders } from "@/lib/storage";
import { Order } from "@/lib/types";
import { formatUGX } from "@/lib/utils";

// useSearchParams needs a Suspense boundary at the page level in the App Router
export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <OrderConfirmationContent />
    </Suspense>
  );
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    const found = getOrders().find((o) => o.id === orderId) ?? null;
    setOrder(found);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">
          Order not found
        </h1>
        <Link href="/" className="text-green font-medium text-sm">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14 }}
      >
        <CheckCircle2 size={56} className="mx-auto text-green" />
      </motion.div>

      <h1 className="font-display text-3xl font-semibold text-navy mt-4">
        Thank you for your order!
      </h1>
      <p className="text-navy/60 text-sm mt-2">
        Your order number is
      </p>
      <p className="font-display text-2xl font-semibold text-green mt-1">
        {order.orderNumber}
      </p>

      {/* Order summary */}
      <div className="bg-cream rounded-2xl p-5 mt-8 text-left">
        <h2 className="font-semibold text-navy mb-3 text-sm">Order Summary</h2>
        <div className="space-y-2 text-sm">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-navy/70">
              <span>
                {item.name}
                {item.size ? ` (${item.size}${item.color ? ", " + item.color : ""})` : ""}
                {" "}× {item.quantity}
              </span>
              <span>{formatUGX(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-navy/10 mt-3 pt-3 flex justify-between font-semibold text-navy text-sm">
          <span>Total</span>
          <span>{formatUGX(order.total)}</span>
        </div>
        <p className="text-xs text-navy/50 mt-3">
          Paid via {order.paymentMethod} · Delivering to {order.customer.address}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-navy/70 mt-6">
        <MessageCircle size={16} className="text-green" />
        We will contact you via WhatsApp to confirm delivery.
      </div>

      <Link
        href="/"
        className="inline-block mt-8 bg-navy text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-navy-light transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
