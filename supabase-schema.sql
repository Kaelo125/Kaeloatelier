-- ===========================================================================
-- Kaelō Atelier — Supabase schema
-- Run this once in Supabase: Dashboard → SQL Editor → New query → paste → Run
-- ===========================================================================

-- Products table — the shared catalog everyone sees
create table if not exists products (
  id text primary key,
  name text not null,
  variant text,
  price integer not null,
  old_price integer not null,
  category text not null,
  image text not null,
  images text[],
  rating numeric not null default 0,
  reviews integer not null default 0,
  description text,
  sizes text[],
  colors text[],
  stock integer default 0,
  on_sale boolean default false,
  created_at timestamptz default now()
);

-- Orders table — every order placed, visible to the admin dashboard
create table if not exists orders (
  id text primary key,
  order_number text not null,
  created_at timestamptz default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  customer_address text not null,
  items jsonb not null,
  total integer not null,
  payment_method text not null,
  status text not null default 'Placed'
);

-- Reviews table — shared product reviews
create table if not exists reviews (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  name text not null,
  rating integer not null,
  comment text not null,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security (RLS)
--
-- This is a no-login storefront: the admin dashboard is protected only by
-- the password screen in the app itself, not by a real Supabase user
-- account. To keep the admin dashboard able to add/edit/delete products and
-- update order status using just the public (publishable) key, these
-- policies are permissive — anyone with your public key can read and write
-- these tables directly via the API, not just through your website.
--
-- This is an acceptable tradeoff for a small store getting started, but if
-- you scale up, the next step is adding real Supabase authentication for
-- the admin and tightening these policies to require it.
-- ---------------------------------------------------------------------------

alter table products enable row level security;
alter table orders enable row level security;
alter table reviews enable row level security;

create policy "Public can read products" on products
  for select using (true);
create policy "Public can write products" on products
  for insert with check (true);
create policy "Public can update products" on products
  for update using (true);
create policy "Public can delete products" on products
  for delete using (true);

create policy "Public can read orders" on orders
  for select using (true);
create policy "Public can create orders" on orders
  for insert with check (true);
create policy "Public can update orders" on orders
  for update using (true);

create policy "Public can read reviews" on reviews
  for select using (true);
create policy "Public can create reviews" on reviews
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- Storage bucket for product photos uploaded via the admin dashboard
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Public can upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images');
create policy "Public can delete product images" on storage.objects
  for delete using (bucket_id = 'product-images');

-- ---------------------------------------------------------------------------
-- Seed the original 10-product catalog (only runs if products table is
-- currently empty, so it's safe to re-run this whole script later without
-- duplicating rows)
-- ---------------------------------------------------------------------------

insert into products (id, name, variant, price, old_price, category, image, images, rating, reviews, description, sizes, colors, stock, on_sale)
select * from (values
  ('p1', 'Luxury Silk Scarf', 'Navy', 85000, 120000, 'Silk scarves',
   'https://placehold.co/400x500/1A2B4C/FFFFFF?text=Silk+Scarf',
   array['https://placehold.co/400x500/1A2B4C/FFFFFF?text=Silk+Scarf+1','https://placehold.co/400x500/2C4270/FFFFFF?text=Silk+Scarf+2','https://placehold.co/400x500/1A2B4C/FFFFFF?text=Silk+Scarf+3','https://placehold.co/400x500/2C4270/FFFFFF?text=Silk+Scarf+4'],
   4.6, 43, 'Mulberry silk scarf in deep navy with a soft hand and subtle sheen. Quietly essential.',
   array['One Size'], array['Navy','Sage','Cream'], 24, true),

  ('p2', 'Leather Tote Bag', 'Tan', 320000, 450000, 'Handbags',
   'https://placehold.co/400x500/A9784F/FFFFFF?text=Tote+Bag',
   array['https://placehold.co/400x500/A9784F/FFFFFF?text=Tote+Bag+1','https://placehold.co/400x500/8A6440/FFFFFF?text=Tote+Bag+2','https://placehold.co/400x500/A9784F/FFFFFF?text=Tote+Bag+3','https://placehold.co/400x500/8A6440/FFFFFF?text=Tote+Bag+4'],
   5.0, 152, 'Full-grain leather tote with a sculpted silhouette. Ages beautifully with wear.',
   array['One Size'], array['Tan','Black','Olive'], 12, true),

  ('p3', 'Minimalist Smart Watch', null, 280000, 380000, 'Watches',
   'https://placehold.co/400x500/1A2B4C/FFFFFF?text=Smart+Watch',
   array['https://placehold.co/400x500/1A2B4C/FFFFFF?text=Smart+Watch+1','https://placehold.co/400x500/2C4270/FFFFFF?text=Smart+Watch+2','https://placehold.co/400x500/1A2B4C/FFFFFF?text=Smart+Watch+3','https://placehold.co/400x500/2C4270/FFFFFF?text=Smart+Watch+4'],
   4.7, 74, 'Clean-faced smart watch with heart-rate, sleep tracking, and a week-long battery.',
   array['Small','Large'], array['Black','Silver'], 30, true),

  ('p4', 'Gold Hoop Earrings', null, 95000, 140000, 'Jewelry',
   'https://placehold.co/400x500/D4AF37/1A2B4C?text=Hoop+Earrings',
   array['https://placehold.co/400x500/D4AF37/1A2B4C?text=Hoop+Earrings+1','https://placehold.co/400x500/C49B2F/1A2B4C?text=Hoop+Earrings+2','https://placehold.co/400x500/D4AF37/1A2B4C?text=Hoop+Earrings+3','https://placehold.co/400x500/C49B2F/1A2B4C?text=Hoop+Earrings+4'],
   4.8, 96, '18k gold-plated hoops with a featherweight feel. Everyday statement jewelry.',
   array['Small','Medium','Large'], array['Gold'], 40, true),

  ('p5', 'UV400 Aviator Sunglasses', null, 120000, 180000, 'Sunglasses',
   'https://placehold.co/400x500/1A2B4C/FFFFFF?text=Aviators',
   array['https://placehold.co/400x500/1A2B4C/FFFFFF?text=Aviators+1','https://placehold.co/400x500/2C4270/FFFFFF?text=Aviators+2','https://placehold.co/400x500/1A2B4C/FFFFFF?text=Aviators+3','https://placehold.co/400x500/2C4270/FFFFFF?text=Aviators+4'],
   4.5, 61, 'Full UV400 protection aviators with a polished metal frame and gradient lens.',
   array['One Size'], array['Gold/Green','Black/Grey'], 18, true),

  ('p6', 'iPhone 15 Pro Case', 'Black', 65000, 90000, 'Phone cases',
   'https://placehold.co/400x500/111111/FFFFFF?text=Phone+Case',
   array['https://placehold.co/400x500/111111/FFFFFF?text=Phone+Case+1','https://placehold.co/400x500/222222/FFFFFF?text=Phone+Case+2','https://placehold.co/400x500/111111/FFFFFF?text=Phone+Case+3','https://placehold.co/400x500/222222/FFFFFF?text=Phone+Case+4'],
   4.4, 38, 'Slim protective case with a soft-touch matte finish and reinforced corners.',
   array['iPhone 15','iPhone 15 Pro','iPhone 15 Pro Max'], array['Black','Navy','Clear'], 60, true),

  ('p7', 'USB-C Fast Charger 20W', null, 75000, 110000, 'Chargers/cables',
   'https://placehold.co/400x500/2E6F40/FFFFFF?text=Fast+Charger',
   array['https://placehold.co/400x500/2E6F40/FFFFFF?text=Fast+Charger+1','https://placehold.co/400x500/3F9457/FFFFFF?text=Fast+Charger+2','https://placehold.co/400x500/2E6F40/FFFFFF?text=Fast+Charger+3','https://placehold.co/400x500/3F9457/FFFFFF?text=Fast+Charger+4'],
   4.6, 52, 'Compact 20W USB-C wall charger — fast, safe charging for phones and earbuds.',
   array['One Size'], array['White','Black'], 50, true),

  ('p8', 'Wireless Bluetooth Earphones', null, 180000, 250000, 'Earphones',
   'https://placehold.co/400x500/1A2B4C/FFFFFF?text=Earphones',
   array['https://placehold.co/400x500/1A2B4C/FFFFFF?text=Earphones+1','https://placehold.co/400x500/2C4270/FFFFFF?text=Earphones+2','https://placehold.co/400x500/1A2B4C/FFFFFF?text=Earphones+3','https://placehold.co/400x500/2C4270/FFFFFF?text=Earphones+4'],
   4.7, 88, 'True wireless earbuds with active noise cancellation and a 30-hour case battery.',
   array['One Size'], array['Black','White'], 35, true),

  ('p9', '10000mAh Power Bank Slim', null, 130000, 190000, 'Power banks',
   'https://placehold.co/400x500/1A2B4C/FFFFFF?text=Power+Bank',
   array['https://placehold.co/400x500/1A2B4C/FFFFFF?text=Power+Bank+1','https://placehold.co/400x500/2C4270/FFFFFF?text=Power+Bank+2','https://placehold.co/400x500/1A2B4C/FFFFFF?text=Power+Bank+3','https://placehold.co/400x500/2C4270/FFFFFF?text=Power+Bank+4'],
   4.5, 47, 'Pocket-slim 10000mAh power bank with dual output for charging on the go.',
   array['One Size'], array['Black','White'], 28, true),

  ('p10', 'Rose Quartz Face Roller', null, 55000, 80000, 'Small beauty/lifestyle accessories',
   'https://placehold.co/400x500/E8B4B8/1A2B4C?text=Face+Roller',
   array['https://placehold.co/400x500/E8B4B8/1A2B4C?text=Face+Roller+1','https://placehold.co/400x500/D8A4A8/1A2B4C?text=Face+Roller+2','https://placehold.co/400x500/E8B4B8/1A2B4C?text=Face+Roller+3','https://placehold.co/400x500/D8A4A8/1A2B4C?text=Face+Roller+4'],
   4.6, 29, 'Genuine rose quartz facial roller for a calming, de-puffing skincare ritual.',
   array['One Size'], array['Rose Quartz'], 45, true)
) as seed(id, name, variant, price, old_price, category, image, images, rating, reviews, description, sizes, colors, stock, on_sale)
where not exists (select 1 from products limit 1);
