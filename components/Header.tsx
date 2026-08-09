"use client";

import Link from "next/link";
import { ShoppingBag, User as UserIcon, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-navy/10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
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

        <div className="flex items-center gap-3">
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
    </header>
  );
}
