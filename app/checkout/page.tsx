"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatUGX, generateId, generateOrderNumber } from "@/lib/utils";
import { addOrder, getOrders } from "@/lib/storage";
import { Order } from "@/lib/types";
import PaymentModal, { PaymentMethod } from "@/components/PaymentModal";

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  function handleChange(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all fields to continue.");
      return;
    }
    setError("");
    setModalOpen(true);
  }

  async function handleConfirmPayment(method: PaymentMethod) {
    setPlacingOrder(true);

    // Count today's orders so far, to build a friendly sequential order number
    const todayStr = new Date().toDateString();
    const existingOrders = await getOrders();
    const ordersToday = existingOrders.filter(
      (o) => new Date(o.createdAt).toDateString() === todayStr
    ).length;

    const order: Order = {
      id: generateId("KAE"),
      orderNumber: generateOrderNumber(ordersToday),
      createdAt: new Date().toISOString(),
      customer: form,
      items: cart.map((item) => ({
        productId: item.productId,
        name: item.name,
        variant: item.variant,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
      })),
      total: totalPrice,
      paymentMethod: method,
      status: "Placed",
    };

    const ok = await addOrder(order);
    setPlacingOrder(false);

    if (!ok) {
      alert("Sorry, we couldn't place your order — please check your connection and try again.");
      return;
    }

    clearCart();
    setModalOpen(false);
    router.push(`/order-confirmation?order=${order.id}`);
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">
          Nothing to check out
        </h1>
        <p className="text-navy/50 text-sm">Add something to your cart first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-semibold text-navy mb-6">
        Checkout
      </h1>

      <div className="grid gap-8">
        {/* Order summary */}
        <div className="bg-cream rounded-2xl p-5">
          <h2 className="font-semibold text-navy mb-3">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {cart.map((item) => (
              <div
                key={`${item.productId}-${item.size ?? ""}-${item.color ?? ""}`}
                className="flex justify-between text-navy/70"
              >
                <span>
                  {item.name}
                  {item.size ? ` (${item.size}${item.color ? ", " + item.color : ""})` : ""}
                  {" "}× {item.quantity}
                </span>
                <span>{formatUGX(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-navy/10 mt-3 pt-3 flex justify-between font-semibold text-navy">
            <span>Total</span>
            <span>{formatUGX(totalPrice)}</span>
          </div>
        </div>

        {/* Guest checkout form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-navy">Delivery Details</h2>

          <Field
            label="Full Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(v) => handleChange("email", v)}
          />
          <Field
            label="Phone Number"
            type="tel"
            placeholder="0782 628 624"
            value={form.phone}
            onChange={(v) => handleChange("phone", v)}
          />
          <Field
            label="Delivery Address"
            placeholder="Street, area, city — Kampala, Uganda"
            value={form.address}
            onChange={(v) => handleChange("address", v)}
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors"
          >
            Continue to Payment
          </button>
        </form>
      </div>

      <PaymentModal
        open={modalOpen}
        total={totalPrice}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPayment}
        submitting={placingOrder}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-navy/70 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
      />
    </label>
  );
}
