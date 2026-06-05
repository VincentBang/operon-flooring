-- Stage 3 Operon OS lead operating system foundation.
-- Additive only: creates service-role/admin-ready tables and nullable links from
-- existing detail tables without changing public website write behaviour.

create table if not exists public.operon_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary_source text not null default 'quote'
    check (primary_source in ('quote', 'contact', 'quote_review', 'upload', 'floorplan', 'product', 'chatbot', 'operator', 'system')),
  source_detail text,
  status text not null default 'New'
    check (status in ('New', 'Needs review', 'Waiting customer', 'Quote sent', 'Site measure booked', 'Won', 'Lost', 'Archived')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  customer_name text,
  email text,
  phone text,
  suburb text,
  postcode text,
  product_category text,
  product_name text,
  area_m2 numeric,
  estimated_order_area_m2 numeric,
  estimate_total_inc_gst numeric,
  confidence_score numeric,
  confidence_level text,
  missing_info_flags jsonb not null default '[]'::jsonb,
  risk_flags jsonb not null default '[]'::jsonb,
  quote_review_status text not null default 'none',
  floorplan_status text not null default 'none',
  contact_status text not null default 'none',
  follow_up_status text not null default 'none',
  next_action text,
  last_activity_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,
  source text,
  source_table text,
  source_id uuid,
  customer_safe boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  note text not null,
  note_type text not null default 'operator',
  created_by text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_lead_files (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  uploaded_file_id uuid,
  file_role text not null default 'customer_upload',
  safe_filename text,
  file_type text,
  file_size_bytes bigint,
  storage_status text not null default 'stored_private',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_follow_ups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  due_at timestamptz,
  status text not null default 'open'
    check (status in ('open', 'done', 'snoozed', 'cancelled')),
  channel text
    check (channel is null or channel in ('phone', 'email', 'sms', 'manual')),
  next_action text,
  assigned_to text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_floorplan_reviews (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete set null,
  uploaded_file_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'new'
    check (status in ('new', 'needs_review', 'reviewed', 'sent_to_quote', 'archived')),
  estimated_area_m2 numeric,
  confidence_level text,
  review_summary text,
  missing_items jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_lead_status_history (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  changed_at timestamptz not null default now(),
  from_status text,
  to_status text not null,
  changed_by text,
  reason text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.operon_quote_requests
  add column if not exists lead_id uuid;

alter table public.operon_quote_reviews
  add column if not exists lead_id uuid;

alter table public.operon_uploaded_files
  add column if not exists lead_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'operon_quote_requests_lead_id_fkey'
  ) then
    alter table public.operon_quote_requests
      add constraint operon_quote_requests_lead_id_fkey
      foreign key (lead_id) references public.operon_leads(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'operon_quote_reviews_lead_id_fkey'
  ) then
    alter table public.operon_quote_reviews
      add constraint operon_quote_reviews_lead_id_fkey
      foreign key (lead_id) references public.operon_leads(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'operon_uploaded_files_lead_id_fkey'
  ) then
    alter table public.operon_uploaded_files
      add constraint operon_uploaded_files_lead_id_fkey
      foreign key (lead_id) references public.operon_leads(id) on delete set null;
  end if;
end $$;

create index if not exists operon_leads_status_priority_activity_idx
  on public.operon_leads (status, priority, last_activity_at desc);
create index if not exists operon_leads_primary_source_created_idx
  on public.operon_leads (primary_source, created_at desc);
create index if not exists operon_leads_suburb_created_idx
  on public.operon_leads (suburb, created_at desc);
create index if not exists operon_leads_product_category_created_idx
  on public.operon_leads (product_category, created_at desc);
create index if not exists operon_lead_events_lead_created_idx
  on public.operon_lead_events (lead_id, created_at desc);
create index if not exists operon_follow_ups_status_due_idx
  on public.operon_follow_ups (status, due_at);
create index if not exists operon_lead_status_history_lead_changed_idx
  on public.operon_lead_status_history (lead_id, changed_at desc);
create index if not exists operon_quote_requests_lead_id_idx
  on public.operon_quote_requests (lead_id);
create index if not exists operon_quote_reviews_lead_id_idx
  on public.operon_quote_reviews (lead_id);
create index if not exists operon_uploaded_files_lead_id_idx
  on public.operon_uploaded_files (lead_id);

alter table public.operon_leads enable row level security;
alter table public.operon_lead_events enable row level security;
alter table public.operon_lead_notes enable row level security;
alter table public.operon_lead_files enable row level security;
alter table public.operon_follow_ups enable row level security;
alter table public.operon_floorplan_reviews enable row level security;
alter table public.operon_lead_status_history enable row level security;

revoke all on table public.operon_leads from anon, authenticated;
revoke all on table public.operon_lead_events from anon, authenticated;
revoke all on table public.operon_lead_notes from anon, authenticated;
revoke all on table public.operon_lead_files from anon, authenticated;
revoke all on table public.operon_follow_ups from anon, authenticated;
revoke all on table public.operon_floorplan_reviews from anon, authenticated;
revoke all on table public.operon_lead_status_history from anon, authenticated;

grant all on table public.operon_leads to service_role;
grant all on table public.operon_lead_events to service_role;
grant all on table public.operon_lead_notes to service_role;
grant all on table public.operon_lead_files to service_role;
grant all on table public.operon_follow_ups to service_role;
grant all on table public.operon_floorplan_reviews to service_role;
grant all on table public.operon_lead_status_history to service_role;
