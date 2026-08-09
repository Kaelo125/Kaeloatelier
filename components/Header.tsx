"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, User as UserIcon, Leaf, Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSearch } from "@/context/SearchContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { query, setQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  function handleSearchChange(value: string) {
    setQuery(value);
    // Real-time filtering only makes sense on the homepage, where the
    // product grid reads this query — jump there if searching elsewhere.
    if (value && pathname !== "/") {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-navy/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
            <Leaf size={16} className="text-green-light" />
          </span>
          <span className="leading-none">
            <span className="block font-display font-semibold text-xl text-navy tracking-wide">
              Kaelō
            </span>
            <span className="block text-[10px] tracking-[0.2em] text-navy/60 -mt-0.5">
              FASHION ATELIER
            </span>
          </span>
        </Link>

        {/* Desktop / wide search bar */}
        <div className="hidden sm:flex flex-1 max-w-xs relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products or categories..."
            className="w-full bg-cream rounded-full pl-9 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-green/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-navy/40"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className="sm:hidden text-navy"
            aria-label="Toggle search"
          >
            <Search size={20} />
          </button>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-navy hover:text-green transition-colors"
          >
            <UserIcon size={18} />
            {user ? user.name.split(" ")[0] : "Login"}
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className="sm:hidden text-navy"
            aria-label="Account"
          >
            <UserIcon size={20} />
          </Link>

          <Link
            href="/cart"
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-cream hover:bg-navy/10 transition-colors"
            aria-label="View cart"
          >
            <ShoppingBag size={18} className="text-navy" />
            {totalItems > 0 && (
              <motion.span
                key={totalItems}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 bg-green text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile search bar — expands below the header row */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 relative">
          <Search
            size={16}
            className="absolute left-7 top-1/2 -translate-y-1/2 text-navy/40"
          />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products or categories..."
            className="w-full bg-cream rounded-full pl-9 pr-8 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-7 top-1/2 -translate-y-1/2 text-navy/40"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
