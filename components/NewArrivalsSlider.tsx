"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// Each slide pairs a headline with a gradient treatment, echoing the
// original "New Arrivals" hero card (navy -> green gradient, pill CTA).
const SLIDES = [
  {
    eyebrow: "JUST IN",
    title: "New Arrivals",
    body: "Quiet luxury, loud presence. The season's essentials, cut to last and priced to move.",
    cta: "Shop the drop",
    gradient: "linear-gradient(120deg, #1A2B4C 0%, #2E6F40 100%)",
  },
  {
    eyebrow: "LIMITED TIME",
    title: "Up to 26% Off",
    body: "Handpicked leather, silk, and everyday tech — this week's sale edit, while stocks last.",
    cta: "Shop the sale",
    gradient: "linear-gradient(120deg, #2E6F40 0%, #1A2B4C 100%)",
  },
  {
    eyebrow: "ATELIER FAVORITE",
    title: "Made to Outlast",
    body: "Hand-finished pieces built for years of wear, not one season. Discover the essentials.",
    cta: "Explore essentials",
    gradient: "linear-gradient(120deg, #101B33 0%, #2E6F40 100%)",
  },
];

export default function NewArrivalsSlider() {
  const [index, setIndex] = useState(0);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="px-4 pt-4">
      <div className="relative w-full h-64 sm:h-72 rounded-card overflow-hidden max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12"
            style={{ background: slide.gradient }}
          >
            <span className="inline-flex items-center gap-1.5 w-fit bg-white/15 text-white text-xs font-medium tracking-wide px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={12} /> {slide.eyebrow}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-white/85 text-sm sm:text-base mt-3 max-w-md">
              {slide.body}
            </p>
            <Link
              href="#shop"
              className="mt-6 inline-flex items-center gap-2 bg-white text-navy font-medium text-sm px-5 py-2.5 rounded-full w-fit hover:bg-cream transition-colors"
            >
              {slide.cta} <ArrowRight size={15} />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicator dots */}
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
