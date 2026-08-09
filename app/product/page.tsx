"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingCart, ChevronLeft } from "lucide-react";
import { Product, Review } from "@/lib/types";
import { getProducts, getReviewsForProduct, addReview } from "@/lib/storage";
import { formatUGX, discountPercent, getProductImages, generateId } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";

// A rough color-name -> swatch-color map for common color words. Falls back
// to a neutral gray dot with the label shown alongside if not recognized.
const COLOR_SWATCHES: Record<string, string> = {
  navy: "#1A2B4C",
  black: "#111111",
  white: "#FFFFFF",
  tan: "#C9A574",
  olive: "#6B7A4A",
  sage: "#9CAF88",
  cream: "#F1EAD9",
  gold: "#D4AF37",
  silver: "#C0C0C0",
  grey: "#9AA0A6",
  gray: "#9AA0A6",
  clear: "#E8E8E8",
  rose: "#E8B4B8",
};

function swatchColor(name: string): string {
  const key = name.toLowerCase().split(/[\s/]/)[0];
  return COLOR_SWATCHES[key] ?? "#D8D8D8";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const id = params?.id as string;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const products = getProducts();
    setAllProducts(products);
    const found = products.find((p) => p.id === id) ?? null;
    setProduct(found);
    if (found) {
      setSelectedSize(found.sizes?.[0]);
      setSelectedColor(found.colors?.[0]);
      setReviews(getReviewsForProduct(found.id));
    }
  }, [id]);

  if (product === undefined) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-navy/50">Loading…</div>;
  }

  if (product === null) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-navy mb-2">
          Product not found
        </h1>
        <Link href="/" className="text-green font-medium text-sm">
          Back to shop
        </Link>
      </div>
    );
  }

  const images = getProductImages(product);
  const discount = discountPercent(product.price, product.oldPrice);
  const liveRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;
  const liveReviewCount = reviews.length > 0 ? reviews.length : product.reviews;

  const related = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  function handleAddToCart() {
    if (!product) return;
    addToCart(product, qty, { size: selectedSize, color: selectedColor });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-16">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-navy/60 hover:text-green transition-colors mb-4"
      >
        <ChevronLeft size={16} /> Back
      </button>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <div className="relative w-full aspect-[4/5] rounded-card overflow-hidden bg-cream">
            {discount > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                SALE
              </span>
            )}
            <Image
              src={images[activeImage]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 480px"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                  activeImage === i ? "border-green" : "border-transparent"
                }`}
              >
                <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-xs uppercase tracking-wide text-navy/50">
            {product.category}
          </p>
          <h1 className="font-display text-3xl font-semibold text-navy mt-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-1.5 text-sm mt-2">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold text-navy">{liveRating.toFixed(1)}</span>
            <span className="text-navy/50">({liveReviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2 mt-4 flex-wrap">
            <span className="text-2xl font-bold text-navy">
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

          <p className="text-navy/70 text-sm mt-4 leading-relaxed">
            {product.description}
          </p>

          {/* Size selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-navy mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? "bg-navy text-white border-navy"
                        : "bg-white text-navy border-navy/20 hover:border-navy/50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium text-navy mb-2">
                Color{selectedColor ? ` — ${selectedColor}` : ""}
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    aria-label={color}
                    className={`w-9 h-9 rounded-full border-2 ${
                      selectedColor === color ? "border-green" : "border-navy/15"
                    }`}
                    style={{ backgroundColor: swatchColor(color) }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity selector */}
          <div className="mt-6">
            <p className="text-sm font-medium text-navy mb-2">Quantity</p>
            <div className="flex items-center gap-3 border border-navy/15 rounded-full px-3 py-1.5 w-fit">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="text-navy"
              >
                <Minus size={15} />
              </button>
              <span className="text-sm font-medium w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
                className="text-navy"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleAddToCart}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-navy text-white font-medium py-3.5 rounded-full hover:bg-navy-light transition-colors"
          >
            <ShoppingCart size={17} />
            {justAdded ? "Added to Cart" : "Add to Cart"}
          </motion.button>

          {typeof product.stock === "number" && (
            <p className="text-xs text-navy/50 mt-2 text-center">
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          )}
        </div>
      </div>

      <ReviewsSection productId={product.id} reviews={reviews} onReviewAdded={setReviews} />

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-semibold text-navy mb-4">
            You may also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

function ReviewsSection({
  productId,
  reviews,
  onReviewAdded,
}: {
  productId: string;
  reviews: Review[];
  onReviewAdded: (reviews: Review[]) => void;
}) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !comment) return;

    const review: Review = {
      id: generateId("rev"),
      productId,
      name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    addReview(review);
    onReviewAdded([review, ...reviews]);
    setName("");
    setComment("");
    setRating(5);
    setShowForm(false);
  }

  return (
    <div className="mt-16 border-t border-navy/10 pt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy">Reviews</h2>
          {average !== null ? (
            <div className="flex items-center gap-1.5 text-sm mt-1">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              <span className="font-semibold text-navy">{average.toFixed(1)}</span>
              <span className="text-navy/50">({reviews.length} reviews)</span>
            </div>
          ) : (
            <p className="text-sm text-navy/50 mt-1">No reviews yet — be the first.</p>
          )}
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-sm font-medium bg-green text-white px-4 py-2 rounded-full hover:bg-green-dark transition-colors"
        >
          Write a Review
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cream rounded-2xl p-5 mb-6 space-y-3"
        >
          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Your Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-sm bg-white"
            />
          </label>

          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setRating(n)}
                  aria-label={`${n} stars`}
                >
                  <Star
                    size={22}
                    className={n <= rating ? "fill-amber-400 text-amber-400" : "text-navy/20"}
                  />
                </button>
              ))}
            </div>
          </label>

          <label className="block">
            <span className="text-sm text-navy/70 mb-1 block">Your Review</span>
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full border border-navy/15 rounded-xl px-4 py-2.5 text-sm bg-white"
            />
          </label>

          <button
            type="submit"
            className="bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-navy-light transition-colors"
          >
            Submit Review
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-navy/40 text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-navy/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium text-navy text-sm">{r.name}</p>
                <p className="text-xs text-navy/40">
                  {new Date(r.createdAt).toLocaleDateString("en-UG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-0.5 mb-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    size={13}
                    className={n <= r.rating ? "fill-amber-400 text-amber-400" : "text-navy/15"}
                  />
                ))}
              </div>
              <p className="text-sm text-navy/70">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
