"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Package, Truck, Home, CircleDot } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/lib/storage";
import { Order, OrderStatus } from "@/lib/types";
import { formatUGX } from "@/lib/utils";

const STATUS_STEPS: OrderStatus[] = ["Placed", "Processing", "Shipped", "Delivered"];
const STATUS_ICONS = { Placed: CircleDot, Processing: Package, Shipped: Truck, Delivered: Home };

// useSearchParams needs a Suspense boundary at the page level in the App Router
export default function AccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountContent />
    </Suspense>
  );
}

function AccountContent() {
  const { user, logout } = useAuth();
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get("order");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !highlightedOrderId) {
      setLoading(false);
      return;
    }
    getOrders()
      .then((all) => {
        if (user) {
          setOrders(all.filter((o) => o.customer.email === user.email));
        } else if (highlightedOrderId) {
          // Guest just checked out — show them their single order without login
          setOrders(all.filter((o) => o.id === highlightedOrderId));
        }
      })
      .finally(() => setLoading(false));
  }, [user, highlightedOrderId]);

  if (!user && !highlightedOrderId) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">
          My Account
        </h1>
        <p className="text-navy/50 text-sm mb-6">
          Login to view your order history and track deliveries.
        </p>
        <Link
          href="/login"
          className="inline-block bg-navy text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-navy-light transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-navy">
            {user ? `Hi, ${user.name.split(" ")[0]}` : "Order Confirmed"}
          </h1>
          {user && <p className="text-navy/50 text-sm">{user.email}</p>}
        </div>
        {user && (
          <button
            onClick={logout}
            className="text-sm font-medium text-navy/60 hover:text-green transition-colors"
          >
            Logout
          </button>
        )}
      </div>

      {highlightedOrderId && (
        <div className="bg-green/10 border border-green/30 text-green-dark rounded-xl p-4 mb-6 text-sm font-medium">
          Thank you! Your order {highlightedOrderId} has been placed.
        </div>
      )}

      <h2 className="font-semibold text-navy mb-3">Order History</h2>

      {loading ? (
        <p className="text-navy/50 text-sm py-8 text-center">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-navy/50 text-sm py-8 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="border border-navy/10 rounded-2xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-navy text-sm">{order.orderNumber ?? order.id}</p>
        <p className="text-xs text-navy/50">
          {new Date(order.createdAt).toLocaleDateString("en-UG", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <p className="text-sm text-navy/60 mb-4">
        {order.items.length} item{order.items.length > 1 ? "s" : ""} ·{" "}
        {formatUGX(order.total)}
      </p>

      {/* Status tracker */}
      <div className="flex items-center mb-4">
        {STATUS_STEPS.map((step, i) => {
          const Icon = STATUS_ICONS[step];
          const reached = i <= currentStepIndex;
          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    reached ? "bg-green text-white" : "bg-cream text-navy/30"
                  }`}
                >
                  {reached && i < currentStepIndex ? (
                    <Check size={14} />
                  ) : (
                    <Icon size={14} />
                  )}
                </div>
                <span
                  className={`text-[10px] ${
                    reached ? "text-navy font-medium" : "text-navy/40"
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mb-4 ${
                    i < currentStepIndex ? "bg-green" : "bg-cream"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm text-navy/70">
            <span>
              {item.name}
              {item.size ? ` (${item.size}${item.color ? ", " + item.color : ""})` : ""}
              {" "}× {item.quantity}
            </span>
            <span>{formatUGX(item.price * item.quantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
