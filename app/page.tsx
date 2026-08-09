"use client";

import { useEffect, useMemo, useState } from "react";
import { Product, Category } from "@/lib/types";
import { getProducts } from "@/lib/storage";
import { CATEGORIES } from "@/lib/data";
import NewArrivalsSlider from "@/components/NewArrivalsSlider";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="pb-16">
      <NewArrivalsSlider />

      <CategoryFilter
        categories={CATEGORIES}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <section id="shop" className="max-w-6xl mx-auto px-4">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-2xl font-semibold text-navy">
            {activeCategory === "All" ? "Featured" : activeCategory}
          </h2>
          <span className="text-sm text-navy/50">{filtered.length} pieces</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-navy/50 text-center py-16">
            No pieces in this category yet — check back soon.
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
