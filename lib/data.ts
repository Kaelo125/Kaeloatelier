import { Product } from "./types";

// ---------------------------------------------------------------------------
// Default catalog. This seeds localStorage on first load. The admin
// dashboard can add/edit/delete on top of this, all persisted client-side.
// ---------------------------------------------------------------------------

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Luxury Silk Scarf",
    variant: "Navy",
    price: 85000,
    oldPrice: 120000,
    category: "Silk scarves",
    image: "https://placehold.co/400x500/1A2B4C/FFFFFF?text=Silk+Scarf",
    rating: 4.6,
    reviews: 43,
    description:
      "Mulberry silk scarf in deep navy with a soft hand and subtle sheen. Quietly essential.",
  },
  {
    id: "p2",
    name: "Leather Tote Bag",
    variant: "Tan",
    price: 320000,
    oldPrice: 450000,
    category: "Handbags",
    image: "https://placehold.co/400x500/A9784F/FFFFFF?text=Tote+Bag",
    rating: 5.0,
    reviews: 152,
    description:
      "Full-grain leather tote with a sculpted silhouette. Ages beautifully with wear.",
  },
  {
    id: "p3",
    name: "Minimalist Smart Watch",
    price: 280000,
    oldPrice: 380000,
    category: "Watches",
    image: "https://placehold.co/400x500/1A2B4C/FFFFFF?text=Smart+Watch",
    rating: 4.7,
    reviews: 74,
    description:
      "Clean-faced smart watch with heart-rate, sleep tracking, and a week-long battery.",
  },
  {
    id: "p4",
    name: "Gold Hoop Earrings",
    price: 95000,
    oldPrice: 140000,
    category: "Jewelry",
    image: "https://placehold.co/400x500/D4AF37/1A2B4C?text=Hoop+Earrings",
    rating: 4.8,
    reviews: 96,
    description:
      "18k gold-plated hoops with a featherweight feel. Everyday statement jewelry.",
  },
  {
    id: "p5",
    name: "UV400 Aviator Sunglasses",
    price: 120000,
    oldPrice: 180000,
    category: "Sunglasses",
    image: "https://placehold.co/400x500/1A2B4C/FFFFFF?text=Aviators",
    rating: 4.5,
    reviews: 61,
    description:
      "Full UV400 protection aviators with a polished metal frame and gradient lens.",
  },
  {
    id: "p6",
    name: "iPhone 15 Pro Case",
    variant: "Black",
    price: 65000,
    oldPrice: 90000,
    category: "Phone cases",
    image: "https://placehold.co/400x500/111111/FFFFFF?text=Phone+Case",
    rating: 4.4,
    reviews: 38,
    description:
      "Slim protective case with a soft-touch matte finish and reinforced corners.",
  },
  {
    id: "p7",
    name: "USB-C Fast Charger 20W",
    price: 75000,
    oldPrice: 110000,
    category: "Chargers/cables",
    image: "https://placehold.co/400x500/2E6F40/FFFFFF?text=Fast+Charger",
    rating: 4.6,
    reviews: 52,
    description:
      "Compact 20W USB-C wall charger — fast, safe charging for phones and earbuds.",
  },
  {
    id: "p8",
    name: "Wireless Bluetooth Earphones",
    price: 180000,
    oldPrice: 250000,
    category: "Earphones",
    image: "https://placehold.co/400x500/1A2B4C/FFFFFF?text=Earphones",
    rating: 4.7,
    reviews: 88,
    description:
      "True wireless earbuds with active noise cancellation and a 30-hour case battery.",
  },
  {
    id: "p9",
    name: "10000mAh Power Bank Slim",
    price: 130000,
    oldPrice: 190000,
    category: "Power banks",
    image: "https://placehold.co/400x500/1A2B4C/FFFFFF?text=Power+Bank",
    rating: 4.5,
    reviews: 47,
    description:
      "Pocket-slim 10000mAh power bank with dual output for charging on the go.",
  },
  {
    id: "p10",
    name: "Rose Quartz Face Roller",
    price: 55000,
    oldPrice: 80000,
    category: "Small beauty/lifestyle accessories",
    image: "https://placehold.co/400x500/E8B4B8/1A2B4C?text=Face+Roller",
    rating: 4.6,
    reviews: 29,
    description:
      "Genuine rose quartz facial roller for a calming, de-puffing skincare ritual.",
  },
];

export const CATEGORIES: Product["category"][] = [
  "Silk scarves",
  "Handbags",
  "Watches",
  "Jewelry",
  "Sunglasses",
  "Phone cases",
  "Chargers/cables",
  "Earphones",
  "Power banks",
  "Small beauty/lifestyle accessories",
];
