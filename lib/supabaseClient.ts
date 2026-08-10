import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Shared products, orders, and reviews now live in Supabase (a hosted
// Postgres database) instead of the browser's local storage, so every
// visitor — on any device or browser — sees the same catalog and the shop
// owner sees every order in one place.
//
// Cart contents and the logged-in session stay in localStorage on purpose:
// a shopping cart is naturally per-device, so there's no need to centralize
// it, and it keeps checkout working instantly with no network round-trip.
//
// The two values below come from Vercel's Environment Variables (see
// README) — never hard-code real keys directly into this file.
// ---------------------------------------------------------------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
