"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, LogOut } from "lucide-react";
import { Product, Order, OrderStatus, Category } from "@/lib/types";
import { getProducts, saveProducts, getOrders, saveOrders } from "@/lib/storage";
import { CATEGORIES } from "@/lib/data";
import { formatUGX, generateId } from "@/lib/utils";

const ADMIN_PASSWORD = "admin123";
const SESSION_KEY = "kaelo_admin_session";
const STATUS_OPTIONS: OrderStatus[] = ["Placed", "Processing", "Shipped", "Delivered"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);

  // Check for an existing admin session (sessionStorage clears on tab close)
  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "true") {
      setAuthed(true);
    }
  }, []);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return <AdminDashboard onLogout={() => setAuthed(false)} />;
}

// ---------------------------------------------------------------------------

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      onSuccess();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-24">
      <h1 className="font-display text-2xl font-semibold text-navy mb-1">
        Admin Access
      </h1>
      <p className="text-navy/50 text-sm mb-6">Enter the admin password to continue.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
  }, []);

  function persistProducts(updated: Product[]) {
    setProducts(updated);
    saveProducts(updated);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this product?")) return;
    persistProducts(products.filter((p) => p.id !== id));
  }

  function handleSave(product: Product) {
    const exists = products.some((p) => p.id === product.id);
    const updated = exists
      ? products.map((p) => (p.id === product.id ? product : p))
      : [...products, product];
    persistProducts(updated);
    setShowForm(false);
    setEditing(null);
  }

  function handleStatusChange(orderId: string, status: OrderStatus) {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    setOrders(updated);
    saveOrders(updated);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    onLogout();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-semibold text-navy">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-navy/60 hover:text-green transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <TabButton active={tab === "products"} onClick={() => setTab("products")}>
          Products ({products.length})
        </TabButton>
        <TabButton active={tab === "orders"} onClick={() => setTab("orders")}>
          Orders ({orders.length})
        </TabButton>
      </div>

      {tab === "products" && (
        <>
          <button
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1.5 bg-green text-white text-sm font-medium px-4 py-2.5 rounded-full mb-4 hover:bg-green-dark transition-colors"
          >
            <Plus size={15} /> Add Product
          </button>

          <div className="space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 border border-navy/10 rounded-xl p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="w-14 h-16 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-navy text-sm truncate">{p.name}</p>
                  <p className="text-xs text-navy/50">
                    {p.category} · {formatUGX(p.price)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditing(p);
                    setShowForm(true);
                  }}
                  aria-label="Edit"
                  className="text-navy/60 hover:text-green"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  aria-label="Delete"
                  className="text-navy/60 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 && (
            <p className="text-navy/50 text-sm text-center py-8">No orders yet.</p>
          )}
          {orders.map((order) => (
            <div key={order.id} className="border border-navy/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-semibold text-navy text-sm">{order.id}</p>
                <p className="text-xs text-navy/50">
                  {new Date(order.createdAt).toLocaleDateString("en-UG")}
                </p>
              </div>
              <p className="text-xs text-navy/60">
                {order.customer.name} · {order.customer.phone} · {order.customer.email}
              </p>
              <p className="text-xs text-navy/60 mb-2">{order.customer.address}</p>
              <p className="text-sm text-navy mb-3">
                {order.items.length} item(s) · {formatUGX(order.total)} ·{" "}
                {order.paymentMethod}
              </p>

              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order.id, e.target.value as OrderStatus)
                }
                className="text-sm border border-navy/15 rounded-lg px-3 py-2"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProductForm
          initial={editing}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        active ? "bg-navy text-white border-navy" : "bg-white text-navy border-navy/20"
      }`}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------

function ProductForm({
  initial,
  onCancel,
  onSave,
}: {
  initial: Product | null;
  onCancel: () => void;
  onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>(
    initial ?? {
      id: generateId("p"),
      name: "",
      variant: "",
      price: 0,
      oldPrice: 0,
      category: CATEGORIES[0],
      image: "https://placehold.co/400x500",
      rating: 4.5,
      reviews: 0,
      description: "",
    }
  );

  function update<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-card sm:rounded-card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            {initial ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onCancel} aria-label="Close">
            <X size={20} className="text-navy/60" />
          </button>
        </div>

        <div className="space-y-3">
          <TextField label="Name" value={form.name} onChange={(v) => update("name", v)} />
          <TextField
            label="Variant (optional)"
            value={form.variant ?? ""}
            onChange={(v) => update("variant", v)}
          />
          <div className="grid grid-cols-2 gap-3">
            <TextField
              label="Price (UGX)"
              type="number"
              value={String(form.price)}
              onChange={(v) => update("price", Number(v))}
            />
            <TextField
              label="Old Price (UGX)"
              type="number"
              value={String(form.oldPrice)}
              onChange={(v) => update("oldPrice", Number(v))}
            />
          </div>

          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Category</span>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value as Category)}
              className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <TextField
            label="Image URL"
            value={form.image}
            onChange={(v) => update("image", v)}
          />
          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm"
            />
          </label>
        </div>

        <button
          onClick={() => onSave(form)}
          disabled={!form.name || form.price <= 0}
          className="w-full mt-5 bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors disabled:opacity-40"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-navy/70 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm focus:border-green outline-none"
      />
    </label>
  );
}
