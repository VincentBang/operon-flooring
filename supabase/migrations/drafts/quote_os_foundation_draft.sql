-- Operon Flooring Quote OS foundation draft.
-- DRAFT ONLY: do not apply without human approval, rollback review, and preview QA.
--
-- Scope:
-- - Additive schema foundation for private Quote OS operations.
-- - Keeps existing public .html website flows untouched.
-- - Does not change pricing formulas.
-- - Does not expose private rates, margins, supplier costs, OCR text, storage paths, or service-role secrets.
--
-- Naming:
-- - Uses existing Operon v2 convention: public.operon_* tables.
-- - Existing Stage 3 tables are extended only with nullable/status columns.
-- - New Quote OS tables are created with IF NOT EXISTS and service-role-only posture.

create extension if not exists pgcrypto;

create or replace function public.operon_quote_os_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------------------------
-- Existing lead/event/request table extensions.
-- ---------------------------------------------------------------------------

alter table if exists public.operon_leads
  add column if not exists site_visit_status text not null default 'none',
  add column if not exists proposal_status text not null default 'none',
  add column if not exists current_quote_version_id uuid,
  add column if not exists current_site_visit_id uuid;

alter table if exists public.operon_quote_requests
  add column if not exists current_quote_version_id uuid,
  add column if not exists latest_site_visit_id uuid,
  add column if not exists proposal_status text not null default 'none',
  add column if not exists customer_safe_summary jsonb not null default '{}'::jsonb;

alter table if exists public.operon_uploaded_files
  add column if not exists retention_status text not null default 'active',
  add column if not exists expires_at timestamptz;

-- ---------------------------------------------------------------------------
-- Site visit foundation.
-- ---------------------------------------------------------------------------

create table if not exists public.operon_site_visits (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete set null,
  quote_request_id uuid references public.operon_quote_requests(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  scheduled_at timestamptz,
  completed_at timestamptz,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'completed', 'cancelled', 'archived')),
  inspector_name text,
  site_address text,
  property_type text,
  access_notes text,
  parking_notes text,
  lift_notes text,
  subfloor_condition text,
  moisture_notes text,
  acoustic_notes text,
  removal_scope text,
  disposal_scope text,
  floor_preparation_scope text,
  stairs_summary text,
  trim_summary text,
  risk_flags jsonb not null default '[]'::jsonb,
  customer_preferences jsonb not null default '{}'::jsonb,
  internal_notes text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_site_visit_rooms (
  id uuid primary key default gen_random_uuid(),
  site_visit_id uuid not null references public.operon_site_visits(id) on delete cascade,
  room_order integer not null default 0,
  room_name text,
  length_m numeric,
  width_m numeric,
  area_m2 numeric,
  included_in_quote boolean not null default true,
  existing_floor text,
  removal_required text,
  subfloor_notes text,
  prep_required text,
  stairs_or_transitions text,
  photo_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.operon_site_visit_photos (
  id uuid primary key default gen_random_uuid(),
  site_visit_id uuid not null references public.operon_site_visits(id) on delete cascade,
  lead_id uuid references public.operon_leads(id) on delete set null,
  uploaded_file_id uuid,
  photo_role text not null default 'site_photo',
  safe_filename text,
  file_type text,
  file_size_bytes bigint,
  caption text,
  room_label text,
  storage_status text not null default 'stored_private',
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Quote versioning foundation.
-- ---------------------------------------------------------------------------

create table if not exists public.operon_quote_versions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete set null,
  quote_request_id uuid references public.operon_quote_requests(id) on delete set null,
  site_visit_id uuid references public.operon_site_visits(id) on delete set null,
  version_number integer not null default 1,
  status text not null default 'draft'
    check (status in ('draft', 'internal_review', 'ready_to_send', 'sent', 'accepted', 'declined', 'superseded', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text,
  supersedes_quote_version_id uuid references public.operon_quote_versions(id) on delete set null,
  rate_card_id uuid,
  product_range_id text,
  product_category text,
  area_m2 numeric,
  order_area_m2 numeric,
  subtotal_ex_gst numeric,
  gst numeric,
  total_inc_gst numeric,
  customer_summary text,
  assumptions jsonb not null default '[]'::jsonb,
  exclusions jsonb not null default '[]'::jsonb,
  internal_notes text,
  sent_at timestamptz,
  accepted_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  unique (quote_request_id, version_number)
);

create table if not exists public.operon_quote_line_items (
  id uuid primary key default gen_random_uuid(),
  quote_version_id uuid not null references public.operon_quote_versions(id) on delete cascade,
  line_order integer not null default 0,
  line_type text not null default 'scope',
  customer_label text not null,
  internal_label text,
  quantity numeric,
  unit text,
  unit_basis text,
  amount_ex_gst numeric,
  gst numeric,
  amount_inc_gst numeric,
  cost_basis jsonb not null default '{}'::jsonb,
  customer_visible boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

-- Add FK links after quote_versions exists.
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'operon_leads')
    and not exists (select 1 from pg_constraint where conname = 'operon_leads_current_quote_version_id_fkey') then
    alter table public.operon_leads
      add constraint operon_leads_current_quote_version_id_fkey
      foreign key (current_quote_version_id) references public.operon_quote_versions(id) on delete set null;
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'operon_leads')
    and not exists (select 1 from pg_constraint where conname = 'operon_leads_current_site_visit_id_fkey') then
    alter table public.operon_leads
      add constraint operon_leads_current_site_visit_id_fkey
      foreign key (current_site_visit_id) references public.operon_site_visits(id) on delete set null;
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'operon_quote_requests')
    and not exists (select 1 from pg_constraint where conname = 'operon_quote_requests_current_quote_version_id_fkey') then
    alter table public.operon_quote_requests
      add constraint operon_quote_requests_current_quote_version_id_fkey
      foreign key (current_quote_version_id) references public.operon_quote_versions(id) on delete set null;
  end if;

  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'operon_quote_requests')
    and not exists (select 1 from pg_constraint where conname = 'operon_quote_requests_latest_site_visit_id_fkey') then
    alter table public.operon_quote_requests
      add constraint operon_quote_requests_latest_site_visit_id_fkey
      foreign key (latest_site_visit_id) references public.operon_site_visits(id) on delete set null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Follow-up task foundation.
-- Existing repo already has public.operon_follow_ups wired to functions.
-- This table is a future Quote OS task model. Do not wire runtime functions to it
-- until the operon_follow_ups vs operon_follow_up_tasks naming decision is approved.
-- ---------------------------------------------------------------------------

create table if not exists public.operon_follow_up_tasks (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete cascade,
  quote_version_id uuid references public.operon_quote_versions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  due_at timestamptz,
  status text not null default 'open'
    check (status in ('open', 'done', 'snoozed', 'cancelled', 'archived')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  task_type text not null default 'manual_follow_up',
  channel text
    check (channel is null or channel in ('phone', 'email', 'sms', 'manual')),
  reason text,
  suggested_message text,
  assigned_to text,
  completed_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Job outcome foundation.
-- ---------------------------------------------------------------------------

create table if not exists public.operon_job_outcomes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete set null,
  quote_version_id uuid references public.operon_quote_versions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  outcome text not null
    check (outcome in ('won', 'lost', 'cancelled', 'deferred', 'unknown')),
  won_at timestamptz,
  lost_at timestamptz,
  lost_reason text,
  accepted_total_inc_gst numeric,
  final_total_inc_gst numeric,
  gross_margin_band text,
  job_start_date date,
  job_completed_date date,
  customer_feedback text,
  internal_notes text,
  metadata jsonb not null default '{}'::jsonb
);

-- ---------------------------------------------------------------------------
-- Indexes.
-- ---------------------------------------------------------------------------

create index if not exists operon_site_visits_lead_status_idx
  on public.operon_site_visits (lead_id, status, updated_at desc);
create index if not exists operon_site_visits_quote_request_idx
  on public.operon_site_visits (quote_request_id, updated_at desc);
create index if not exists operon_site_visit_rooms_visit_order_idx
  on public.operon_site_visit_rooms (site_visit_id, room_order);
create index if not exists operon_site_visit_photos_visit_created_idx
  on public.operon_site_visit_photos (site_visit_id, created_at desc);
create index if not exists operon_quote_versions_lead_status_idx
  on public.operon_quote_versions (lead_id, status, updated_at desc);
create index if not exists operon_quote_versions_request_version_idx
  on public.operon_quote_versions (quote_request_id, version_number desc);
create index if not exists operon_quote_line_items_version_order_idx
  on public.operon_quote_line_items (quote_version_id, line_order);
create index if not exists operon_follow_up_tasks_status_due_idx
  on public.operon_follow_up_tasks (status, due_at);
create index if not exists operon_follow_up_tasks_lead_status_idx
  on public.operon_follow_up_tasks (lead_id, status, due_at);
create index if not exists operon_job_outcomes_lead_created_idx
  on public.operon_job_outcomes (lead_id, created_at desc);
create index if not exists operon_job_outcomes_outcome_created_idx
  on public.operon_job_outcomes (outcome, created_at desc);

-- ---------------------------------------------------------------------------
-- Updated_at triggers.
-- ---------------------------------------------------------------------------

drop trigger if exists operon_site_visits_set_updated_at on public.operon_site_visits;
create trigger operon_site_visits_set_updated_at
before update on public.operon_site_visits
for each row execute function public.operon_quote_os_set_updated_at();

drop trigger if exists operon_quote_versions_set_updated_at on public.operon_quote_versions;
create trigger operon_quote_versions_set_updated_at
before update on public.operon_quote_versions
for each row execute function public.operon_quote_os_set_updated_at();

drop trigger if exists operon_follow_up_tasks_set_updated_at on public.operon_follow_up_tasks;
create trigger operon_follow_up_tasks_set_updated_at
before update on public.operon_follow_up_tasks
for each row execute function public.operon_quote_os_set_updated_at();

drop trigger if exists operon_job_outcomes_set_updated_at on public.operon_job_outcomes;
create trigger operon_job_outcomes_set_updated_at
before update on public.operon_job_outcomes
for each row execute function public.operon_quote_os_set_updated_at();

-- ---------------------------------------------------------------------------
-- RLS and grants.
-- ---------------------------------------------------------------------------

alter table public.operon_site_visits enable row level security;
alter table public.operon_site_visit_rooms enable row level security;
alter table public.operon_site_visit_photos enable row level security;
alter table public.operon_quote_versions enable row level security;
alter table public.operon_quote_line_items enable row level security;
alter table public.operon_follow_up_tasks enable row level security;
alter table public.operon_job_outcomes enable row level security;

revoke all on table public.operon_site_visits from anon, authenticated;
revoke all on table public.operon_site_visit_rooms from anon, authenticated;
revoke all on table public.operon_site_visit_photos from anon, authenticated;
revoke all on table public.operon_quote_versions from anon, authenticated;
revoke all on table public.operon_quote_line_items from anon, authenticated;
revoke all on table public.operon_follow_up_tasks from anon, authenticated;
revoke all on table public.operon_job_outcomes from anon, authenticated;

grant all on table public.operon_site_visits to service_role;
grant all on table public.operon_site_visit_rooms to service_role;
grant all on table public.operon_site_visit_photos to service_role;
grant all on table public.operon_quote_versions to service_role;
grant all on table public.operon_quote_line_items to service_role;
grant all on table public.operon_follow_up_tasks to service_role;
grant all on table public.operon_job_outcomes to service_role;

-- Existing tables that this draft extends should remain service-role/admin only
-- according to their existing migrations. Verify grants with the companion
-- quote_os_rls_verification_queries.sql before applying this draft.

comment on table public.operon_site_visits is
  'Quote OS private site visit checklist records. Admin/service-role only.';
comment on table public.operon_site_visit_rooms is
  'Quote OS private room measurements and site scope records. Admin/service-role only.';
comment on table public.operon_site_visit_photos is
  'Quote OS private site visit photo metadata. Stores safe metadata only, not public file URLs.';
comment on table public.operon_quote_versions is
  'Quote OS internal quote version records. Customer-safe proposal fields plus admin-only internal notes.';
comment on table public.operon_quote_line_items is
  'Quote OS quote version line items. cost_basis is internal and must never be returned to public browser.';
comment on table public.operon_follow_up_tasks is
  'Quote OS dry-run follow-up task model. Do not auto-send customer messages from this table.';
comment on table public.operon_job_outcomes is
  'Quote OS job outcome records for conversion and operational reporting. Admin/service-role only.';

comment on column public.operon_quote_line_items.cost_basis is
  'Internal costing/pricing basis. Must not be returned to public browser, analytics, public emails, or unauthenticated APIs.';
comment on column public.operon_job_outcomes.gross_margin_band is
  'Internal reporting band only. Do not expose exact margin or supplier cost publicly.';

-- ---------------------------------------------------------------------------
-- Later-stage private pricing placeholders.
-- ---------------------------------------------------------------------------

-- Later, after parity tests and explicit approval, add:
-- - public.operon_private_rate_cards
-- - public.operon_stair_pricing_profiles
-- - public.operon_stair_profile_prices
-- - public.operon_range_stair_price_overrides
-- - product/range pricing inheritance rules
--
-- Do not create these in this foundation draft unless Task 1.1 is expanded.
-- Existing public.operon_product_ranges and public.pricing_stair_rates already
-- support current range/stair pricing. The next pricing task should first
-- create parity/leak tests and define how public catalogue fields are sanitised.
