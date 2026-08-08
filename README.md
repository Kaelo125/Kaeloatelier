# Kaelō Atelier

A mobile-first e-commerce storefront built with Next.js (App Router), Tailwind
CSS, and Framer Motion. All data — products, cart, orders, and accounts — is
stored in the browser's `localStorage`, so the whole app runs with no backend
or database.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new and import the repository.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

Or from the CLI:

```bash
npm install -g vercel
vercel
```

## How it's organized

- `app/` — pages (App Router): homepage, cart, checkout, login, register,
  account, admin.
- `components/` — UI building blocks: Header, Footer, product card, category
  filter, the New Arrivals slider, the payment modal, and the captcha.
- `context/` — React context providers for cart state and auth state, both
  backed by `localStorage`.
- `lib/` — types, the seed product catalog, `localStorage` read/write helpers,
  and small formatting utilities (currency, discount %, ids).

## Key flows

- **Shop → Cart → Checkout**: add items from the product grid, review the
  cart, fill in guest delivery details, then confirm payment via the MTN
  Mobile Money / Airtel Money modal. Placing an order clears the cart and
  saves the order to `localStorage`.
- **Accounts**: register or log in with email + phone + password, guarded by
  a lightweight arithmetic captcha (no external services required). Logged-in
  customers see their order history and delivery status at `/account`.
- **Admin**: visit `/admin` and enter the password `admin123` to add, edit, or
  delete products, and to update any order's status through
  Placed → Processing → Shipped → Delivered. This is a demo-grade password
  gate suitable for prototypes — replace with real authentication before
  handling real customers or payments.

## Notes for going to production

This build intentionally keeps everything client-side so it works without a
server. Before using it for real transactions, you'd want to:

- Replace `localStorage` with a real database and API routes (or a backend
  like Supabase/Postgres) so data isn't lost when a browser cache clears and
  isn't limited to one device.
- Move the admin password and payment account details out of client code and
  into environment variables / a proper auth system.
- Integrate a real mobile money API (e.g. MTN MoMo API, Airtel Money API) to
  confirm payments automatically instead of the "I've sent payment" honor
  system.
