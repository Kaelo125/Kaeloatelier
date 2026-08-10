# Kaelō Atelier

A mobile-first e-commerce storefront built with Next.js (App Router), Tailwind
CSS, and Framer Motion. Products, orders, and reviews are stored in
**Supabase** (a hosted Postgres database) so every visitor sees the same
shared catalog. The shopping cart and login session stay in the browser's
`localStorage`, since those are naturally per-device.

## One-time Supabase setup

1. Create a free project at https://supabase.com
2. Open the SQL Editor in your Supabase project, paste in the contents of
   `supabase-schema.sql` from this repo, and run it. This creates the
   `products`, `orders`, and `reviews` tables, sets up permissive access
   policies for this no-login demo store, creates a `product-images` storage
   bucket, and seeds the original 10-product catalog.
3. In Supabase, go to **Settings → API** and copy your **Project URL** and
   **anon public / Publishable key**.

## Getting started (local development)

```bash
cp .env.local.example .env.local
# then edit .env.local and paste in your Supabase URL + key
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new and import the repository.
3. Before deploying, add two **Environment Variables** in the import screen
   (or later under Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**.

## How it's organized

- `app/` — pages (App Router): homepage, product detail, cart, checkout,
  order confirmation, login, register, account, admin, privacy, refund.
- `components/` — UI building blocks: Header (with search), Footer, product
  card, category filter, price range filter, the New Arrivals slider, the
  payment modal, and the captcha.
- `context/` — React context providers for cart state, auth state, and the
  header search query.
- `lib/` — types, the seed product catalog, the Supabase client, the
  storage layer (Supabase for products/orders/reviews, `localStorage` for
  cart/auth), and small formatting utilities (currency, discount %, order
  numbers, ids).
- `supabase-schema.sql` — run once in Supabase's SQL editor to set up all
  tables, policies, the image storage bucket, and seed data.

## Key flows

- **Shop → Cart → Checkout**: search or filter products (category, price
  range), open a product for its gallery/size/color/reviews, add to cart,
  fill in guest delivery details, then confirm payment via the MTN Mobile
  Money / Airtel Money modal. Placing an order saves it to Supabase and
  lands on `/order-confirmation` with a generated order number.
- **Accounts**: register or log in with email + phone + password, guarded by
  a lightweight arithmetic captcha (no external services required). Logged-in
  customers see their order history and delivery status at `/account`.
- **Admin**: visit `/admin` and enter the password `admin123` to add, edit,
  or delete products (with real photo uploads to Supabase Storage, sizes,
  colors, stock, and a sale toggle), and to update any order's status through
  Placed → Processing → Shipped → Delivered. This is a demo-grade password
  gate suitable for prototypes — replace with real authentication before
  handling real customers or payments.

## Notes for going further

- The admin password and payment account details currently live in client
  code. Fine for a small store getting started, but before scaling up, move
  the admin password behind real Supabase authentication and tighten the
  database policies in `supabase-schema.sql` (they're currently permissive
  so the password-only admin panel can read/write directly with the public
  key).
- Integrate a real mobile money API (e.g. MTN MoMo API, Airtel Money API) to
  confirm payments automatically instead of the "I've sent payment" honor
  system.
