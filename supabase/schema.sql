create extension if not exists pgcrypto;

create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  customer_name text,
  phone text,
  email text,
  site_address text,
  suburb text,
  postcode text,

  property_type text,
  property_level text,
  has_lift text,
  parking_access text,

  quote_mode text,
  product_category text,
  product_name text,
  flooring_pattern text,

  measurement_method text,
  real_area numeric,
  chargeable_area numeric,
  room_count integer,

  subtotal_ex_gst numeric,
  gst numeric,
  total_inc_gst numeric,

  manual_review_required boolean default false,
  status text not null default 'new',
  source_page text default 'index.html',

  raw_payload jsonb
);

create table if not exists quote_rooms (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),

  room_name text,
  length_m numeric,
  width_m numeric,
  area_m2 numeric,
  included boolean default true,
  source text,
  raw_payload jsonb
);

create table if not exists quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),

  item_type text,
  label text,
  quantity numeric,
  unit text,
  unit_basis text,
  amount_ex_gst numeric,
  raw_payload jsonb
);

create table if not exists uploaded_files (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid references quote_requests(id) on delete cascade,
  created_at timestamptz not null default now(),

  file_name text,
  file_path text,
  file_type text,
  file_size_bytes bigint,
  storage_bucket text default 'quote-files',
  source text,
  raw_payload jsonb
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_quote_requests_updated_at on quote_requests;
create trigger set_quote_requests_updated_at
before update on quote_requests
for each row
execute function set_updated_at();

alter table quote_requests enable row level security;
alter table quote_rooms enable row level security;
alter table quote_items enable row level security;
alter table uploaded_files enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.quote_requests to anon, authenticated;
grant insert on table public.quote_rooms to anon, authenticated;
grant insert on table public.quote_items to anon, authenticated;
grant insert on table public.uploaded_files to anon, authenticated;

drop policy if exists "Allow anon quote request insert" on quote_requests;
drop policy if exists "Allow public quote request insert" on quote_requests;
create policy "Allow public quote request insert"
on public.quote_requests
for insert
to public
with check (true);

drop policy if exists "Allow anon quote rooms insert" on quote_rooms;
drop policy if exists "Allow public quote rooms insert" on quote_rooms;
create policy "Allow public quote rooms insert"
on public.quote_rooms
for insert
to public
with check (true);

drop policy if exists "Allow anon quote items insert" on quote_items;
drop policy if exists "Allow public quote items insert" on quote_items;
create policy "Allow public quote items insert"
on public.quote_items
for insert
to public
with check (true);

drop policy if exists "Allow anon uploaded files insert" on uploaded_files;
drop policy if exists "Allow public uploaded files insert" on uploaded_files;
create policy "Allow public uploaded files insert"
on public.uploaded_files
for insert
to public
with check (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
select
  'quote-files',
  'quote-files',
  false,
  6291456,
  array['application/pdf', 'image/jpeg', 'image/png']
where not exists (
  select 1 from storage.buckets where id = 'quote-files'
);

drop policy if exists "Allow anon upload to quote-files" on storage.objects;
create policy "Allow anon upload to quote-files"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'quote-files'
);

-- Storage/RLS notes:
-- 1. This keeps `quote-files` private. Anonymous users can upload, but they cannot list or read files by default.
-- 2. No anonymous select/update/delete policies are added for `storage.objects`.
-- 3. Future admin access should use authenticated policies, not the anon key.
-- 4. If you later allow public downloads, do it with signed URLs or explicit select policies.
