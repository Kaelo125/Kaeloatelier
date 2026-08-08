"use client";

import Image from "next/image";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Product } from "@/lib/types";
import { formatUGX, discountPercent } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const discount = discountPercent(product.price, product.oldPrice);

  function handleAddToCart() {
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-card shadow-card overflow-hidden border border-navy/5"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] bg-cream">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-10 bg-green text-white text-xs font-semibold px-3 py-1 rounded-full">
            SALE
          </span>
        )}
        <Image
          src={product.image}
          alt={`${product.name}${product.variant ? " - " + product.variant : ""}`}
          fill
          sizes="(max-width: 640px) 100vw, 320px"
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-sm">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="font-semibold text-navy">{product.rating.toFixed(1)}</span>
          <span className="text-navy/50">({product.reviews})</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-navy mt-1.5">
          {product.name}
          {product.variant && (
            <span className="text-navy/50 font-body text-sm font-normal">
              {" "}
              — {product.variant}
            </span>
          )}
        </h3>
        <p className="text-navy/60 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mt-3 flex-wrap">
          <span className="text-lg font-bold text-navy">
            {formatUGX(product.price)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-sm text-navy/40 line-through">
                {formatUGX(product.oldPrice)}
              </span>
              <span className="text-sm font-semibold text-green">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-navy text-white text-sm font-medium py-2.5 rounded-full hover:bg-navy-light transition-colors"
          >
            <motion.span
              animate={justAdded ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              {justAdded ? "Added" : "Add to Cart"}
            </motion.span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setWishlisted((w) => !w)}
            aria-label="Toggle wishlist"
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border-2 border-green"
          >
            <Heart
              size={16}
              className={wishlisted ? "fill-green text-green" : "text-green"}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
