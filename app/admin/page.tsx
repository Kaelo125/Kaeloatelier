"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, X, LogOut, Upload } from "lucide-react";
import { Product, Order, OrderStatus, Category } from "@/lib/types";
import { getProducts, saveProducts, getOrders, saveOrders } from "@/lib/storage";
import { CATEGORIES } from "@/lib/data";
import { formatUGX, generateId } from "@/lib/utils";

const ADMIN_PASSWORD = "Rg6_Q7tRg6_Q7t";
const SESSION_KEY = "kaelo_admin_session";
const STATUS_OPTIONS: OrderStatus[] = ["Placed", "Processing", "Shipped", "Delivered"];
const MAX_IMAGES = 4;

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
    <div className="max-w-5xl mx-auto px-4 py-8">
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

          {/* Products table */}
          <div className="border border-navy/10 rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead className="bg-cream text-navy/60 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Product</th>
                  <th className="text-left px-4 py-3">Price</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-navy/10">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={p.images?.[0] ?? p.image}
                          alt={p.name}
                          className="w-11 h-13 object-cover rounded-lg shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-navy truncate">{p.name}</p>
                          <p className="text-xs text-navy/50">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-navy whitespace-nowrap">
                      {formatUGX(p.price)}
                    </td>
                    <td className="px-4 py-3 text-navy">
                      {p.stock ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                <p className="font-semibold text-navy text-sm">
                  {order.orderNumber ?? order.id}
                </p>
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
          onDelete={
            editing
              ? () => {
                  handleDelete(editing.id);
                  setShowForm(false);
                  setEditing(null);
                }
              : undefined
          }
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

// Reads a File as a base64 data URL. In this no-backend build there is no
// server to write into /public/uploads, so uploaded images are stored as
// data URLs directly inside the product record in localStorage — visually
// identical to a hosted image, just self-contained instead of a file path.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ProductForm({
  initial,
  onCancel,
  onSave,
  onDelete,
}: {
  initial: Product | null;
  onCancel: () => void;
  onSave: (p: Product) => void;
  onDelete?: () => void;
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
      images: [],
      rating: 4.5,
      reviews: 0,
      description: "",
      sizes: [],
      colors: [],
      stock: 0,
      onSale: false,
    }
  );
  const [sizesInput, setSizesInput] = useState(initial?.sizes?.join(", ") ?? "");
  const [colorsInput, setColorsInput] = useState(initial?.colors?.join(", ") ?? "");
  const [uploading, setUploading] = useState(false);

  function update<K extends keyof Product>(field: K, value: Product[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const current = form.images ?? [];
      const remainingSlots = MAX_IMAGES - current.length;
      const toRead = Array.from(files).slice(0, Math.max(0, remainingSlots));
      const dataUrls = await Promise.all(toRead.map(fileToDataUrl));
      const updatedImages = [...current, ...dataUrls];
      update("images", updatedImages);
      // Keep the legacy single `image` field pointed at the first photo
      if (updatedImages[0]) update("image", updatedImages[0]);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    const updated = (form.images ?? []).filter((_, i) => i !== index);
    update("images", updated);
    if (updated[0]) update("image", updated[0]);
  }

  function handleSubmit() {
    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const colors = colorsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    onSave({
      ...form,
      sizes,
      colors,
      onSale: form.onSale ?? form.price < form.oldPrice,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-card sm:rounded-card p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            {initial ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onCancel} aria-label="Close">
            <X size={20} className="text-navy/60" />
          </button>
        </div>

        <div className="space-y-3">
          <TextField label="Product Name" value={form.name} onChange={(v) => update("name", v)} />

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

          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Description</span>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full border border-navy/15 rounded-xl px-4 py-3 text-sm"
            />
          </label>

          {/* Image upload — up to 4 photos with previews */}
          <div>
            <span className="text-sm text-navy/70 mb-1 block">
              Product Images (up to {MAX_IMAGES})
            </span>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {(form.images ?? []).map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-navy/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove image"
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-navy/80 text-white rounded-full flex items-center justify-center"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
            {(form.images?.length ?? 0) < MAX_IMAGES && (
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-navy/20 rounded-xl py-3 text-sm text-navy/60 cursor-pointer hover:border-green/50">
                <Upload size={15} />
                {uploading ? "Uploading..." : "Upload images"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
              </label>
            )}
          </div>

          <TextField
            label="Sizes (comma-separated, e.g. S, M, L, XL)"
            value={sizesInput}
            onChange={setSizesInput}
          />
          <TextField
            label="Colors (comma-separated, e.g. Navy, Tan, Black)"
            value={colorsInput}
            onChange={setColorsInput}
          />

          <div className="grid grid-cols-2 gap-3 items-end">
            <TextField
              label="Stock Quantity"
              type="number"
              value={String(form.stock ?? 0)}
              onChange={(v) => update("stock", Number(v))}
            />
            <label className="flex items-center gap-2 pb-3">
              <input
                type="checkbox"
                checked={form.onSale ?? false}
                onChange={(e) => update("onSale", e.target.checked)}
                className="w-4 h-4 accent-green"
              />
              <span className="text-sm text-navy/70">On Sale</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-5 py-3.5 rounded-full border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!form.name || form.price <= 0}
            className="flex-1 bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors disabled:opacity-40"
          >
            {initial ? "Update Product" : "Save Product"}
          </button>
        </div>
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
