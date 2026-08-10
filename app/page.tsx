"use client";

import { useEffect, useMemo, useState } from "react";
import { Product, Category } from "@/lib/types";
import { getProducts } from "@/lib/storage";
import { CATEGORIES } from "@/lib/data";
import NewArrivalsSlider from "@/components/NewArrivalsSlider";
import CategoryFilter from "@/components/CategoryFilter";
import PriceRangeFilter from "@/components/PriceRangeFilter";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";

const PRICE_FLOOR = 0;
const PRICE_CEILING = 1000000; // UGX — comfortably above the priciest seed item

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_FLOOR,
    PRICE_CEILING,
  ]);
  const { query } = useSearch();

  // Load the shared catalog from Supabase on mount
  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [products, activeCategory, query, priceRange]);

  return (
    <div className="pb-16">
      <NewArrivalsSlider />

      <CategoryFilter
        categories={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Category dropdown + price range — a compact filter bar above the grid */}
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row gap-4 sm:items-center mb-6">
        <label className="flex-1 sm:max-w-[220px]">
          <span className="text-xs text-navy/50 mb-1 block">Category</span>
          <select
            value={activeCategory}
            onChange={(e) =>
              setActiveCategory(e.target.value as Category | "All")
            }
            className="w-full border border-navy/15 rounded-xl px-3 py-2.5 text-sm bg-white"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <div className="flex-1 sm:max-w-xs">
          <span className="text-xs text-navy/50 mb-1 block">
            Price range (UGX)
          </span>
          <PriceRangeFilter
            min={PRICE_FLOOR}
            max={PRICE_CEILING}
            value={priceRange}
            onChange={setPriceRange}
          />
        </div>
      </div>

      <section id="shop" className="max-w-6xl mx-auto px-4">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-semibold text-navy">
            {query
              ? `Results for "${query}"`
              : activeCategory === "All"
              ? "Featured"
              : activeCategory}
          </h2>
          <span className="text-sm text-navy/50">{filtered.length} pieces</span>
        </div>

        {loading ? (
          <p className="text-navy/50 text-center py-16">Loading products…</p>
        ) : filtered.length === 0 ? (
          <p className="text-navy/50 text-center py-16">
            No pieces match your search — try a different keyword or filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
