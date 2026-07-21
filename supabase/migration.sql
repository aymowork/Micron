-- MICRON SITE — Supabase Migration
-- Run this in your Supabase SQL editor

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric(10,2) not null default 0,
  category text not null default 'vetement',
  status text not null default 'coming_soon',
  whop_url text,
  images text[] not null default '{}',
  drop_date timestamptz,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Drops (countdowns)
create table if not exists drops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  drop_date timestamptz not null,
  is_active boolean not null default true,
  product_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

-- RLS: read-only public access, no public writes
alter table products enable row level security;
alter table drops enable row level security;

-- Anyone can read non-archived products
create policy "public_read_products" on products
  for select using (status != 'archived');

-- Anyone can read active drops
create policy "public_read_drops" on drops
  for select using (is_active = true);

-- Supabase Storage bucket: create manually in dashboard
-- Name: micron
-- Public: true
-- Allowed MIME types: image/*

-- Indexes
create index if not exists products_slug_idx on products (slug);
create index if not exists products_status_idx on products (status);
create index if not exists products_featured_idx on products (is_featured);
create index if not exists drops_active_idx on drops (is_active, drop_date);
