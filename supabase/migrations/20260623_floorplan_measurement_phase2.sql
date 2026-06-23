-- Operon Flooring Floorplan Phase 2: measurement persistence and internal review foundation.
-- Additive only. Public browser access remains function-routed through service-role Netlify Functions.

create extension if not exists pgcrypto;

create table if not exists public.operon_floorplan_measurement_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.operon_leads(id) on delete set null,
  quote_request_id uuid references public.operon_quote_requests(id) on delete set null,
  uploaded_file_id uuid references public.operon_uploaded_files(id) on delete set null,
  idempotency_key_hash text unique,
  source text not null default 'floorplan_tool',
  status text not null default 'customer_submitted'
    check (status in ('customer_submitted', 'review_draft', 'approved', 'linked_to_quote', 'site_confirmed', 'archived')),
  measurement_mode text not null default 'manual_trace',
  selected_area_m2 numeric(10, 3) not null default 0 check (selected_area_m2 >= 0),
  measured_area_m2 numeric(10, 3) not null default 0 check (measured_area_m2 >= 0),
  adjusted_area_m2 numeric(10, 3) not null default 0 check (adjusted_area_m2 >= 0),
  confidence_level text not null default 'unknown' check (confidence_level in ('low', 'medium', 'high', 'unknown')),
  review_required boolean not null default true,
  current_customer_version_id uuid,
  current_review_version_id uuid,
  approved_version_id uuid,
  submitted_at timestamptz,
  approved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.operon_floorplan_measurement_versions (
  id uuid primary key default gen_random_uuid(),
  measurement_session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade,
  parent_version_id uuid references public.operon_floorplan_measurement_versions(id) on delete set null,
  version_number integer not null check (version_number > 0),
  version_source text not null check (version_source in ('customer', 'reviewer', 'system')),
  version_status text not null check (version_status in ('customer_submitted', 'review_draft', 'approved', 'site_confirmed', 'archived')),
  page_width numeric(12, 3) not null check (page_width > 0),
  page_height numeric(12, 3) not null check (page_height > 0),
  pixels_per_metre numeric(14, 6) not null default 0 check (pixels_per_metre >= 0),
  selected_area_m2 numeric(10, 3) not null default 0 check (selected_area_m2 >= 0),
  measured_area_m2 numeric(10, 3) not null default 0 check (measured_area_m2 >= 0),
  adjusted_area_m2 numeric(10, 3) not null default 0 check (adjusted_area_m2 >= 0),
  confidence_level text not null default 'unknown' check (confidence_level in ('low', 'medium', 'high', 'unknown')),
  review_required boolean not null default true,
  geometry_summary jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (measurement_session_id, version_number)
);

alter table public.operon_floorplan_measurement_sessions
  drop constraint if exists operon_floorplan_sessions_customer_version_fkey;
alter table public.operon_floorplan_measurement_sessions
  add constraint operon_floorplan_sessions_customer_version_fkey
  foreign key (current_customer_version_id) references public.operon_floorplan_measurement_versions(id) on delete set null;

alter table public.operon_floorplan_measurement_sessions
  drop constraint if exists operon_floorplan_sessions_review_version_fkey;
alter table public.operon_floorplan_measurement_sessions
  add constraint operon_floorplan_sessions_review_version_fkey
  foreign key (current_review_version_id) references public.operon_floorplan_measurement_versions(id) on delete set null;

alter table public.operon_floorplan_measurement_sessions
  drop constraint if exists operon_floorplan_sessions_approved_version_fkey;
alter table public.operon_floorplan_measurement_sessions
  add constraint operon_floorplan_sessions_approved_version_fkey
  foreign key (approved_version_id) references public.operon_floorplan_measurement_versions(id) on delete set null;

create table if not exists public.operon_floorplan_measurement_sections (
  id uuid primary key default gen_random_uuid(),
  measurement_version_id uuid not null references public.operon_floorplan_measurement_versions(id) on delete cascade,
  client_section_id text,
  section_order integer not null default 1 check (section_order > 0),
  label text not null default 'Room',
  section_type text not null default 'room' check (section_type in ('room', 'wet_area', 'outdoor', 'void', 'other')),
  selection_state text not null default 'include' check (selection_state in ('include', 'exclude', 'not_sure')),
  geometry_json jsonb not null,
  area_m2 numeric(10, 3) not null default 0 check (area_m2 >= 0),
  confidence_level text not null default 'unknown' check (confidence_level in ('low', 'medium', 'high', 'unknown')),
  reviewer_notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.operon_floorplan_measurement_review_events (
  id uuid primary key default gen_random_uuid(),
  measurement_session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade,
  measurement_version_id uuid references public.operon_floorplan_measurement_versions(id) on delete set null,
  event_type text not null check (event_type in (
    'customer_submitted',
    'review_opened',
    'review_draft_saved',
    'approved',
    'linked_to_quote_os',
    'site_confirmed',
    'archived'
  )),
  actor_type text not null default 'system' check (actor_type in ('customer', 'admin', 'system')),
  actor_label text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.operon_floorplan_quote_links (
  id uuid primary key default gen_random_uuid(),
  measurement_session_id uuid not null references public.operon_floorplan_measurement_sessions(id) on delete cascade,
  approved_version_id uuid not null references public.operon_floorplan_measurement_versions(id) on delete restrict,
  quote_request_id uuid references public.operon_quote_requests(id) on delete set null,
  lead_id uuid references public.operon_leads(id) on delete set null,
  approved_area_m2 numeric(10, 3) not null default 0 check (approved_area_m2 >= 0),
  confidence_level text not null default 'unknown' check (confidence_level in ('low', 'medium', 'high', 'unknown')),
  review_status text not null default 'approved' check (review_status in ('approved', 'linked', 'superseded')),
  metadata jsonb not null default '{}'::jsonb,
  linked_at timestamptz not null default now()
);

create index if not exists operon_floorplan_measurement_sessions_status_idx
  on public.operon_floorplan_measurement_sessions (status, updated_at desc);
create index if not exists operon_floorplan_measurement_sessions_lead_idx
  on public.operon_floorplan_measurement_sessions (lead_id, updated_at desc);
create index if not exists operon_floorplan_measurement_sessions_quote_idx
  on public.operon_floorplan_measurement_sessions (quote_request_id, updated_at desc);
create index if not exists operon_floorplan_measurement_sessions_upload_idx
  on public.operon_floorplan_measurement_sessions (uploaded_file_id, updated_at desc);
create index if not exists operon_floorplan_measurement_versions_session_idx
  on public.operon_floorplan_measurement_versions (measurement_session_id, version_number desc);
create index if not exists operon_floorplan_measurement_sections_version_idx
  on public.operon_floorplan_measurement_sections (measurement_version_id, section_order);
create index if not exists operon_floorplan_measurement_events_session_idx
  on public.operon_floorplan_measurement_review_events (measurement_session_id, created_at desc);
create index if not exists operon_floorplan_quote_links_quote_idx
  on public.operon_floorplan_quote_links (quote_request_id, linked_at desc);

create or replace function public.operon_floorplan_sessions_set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists operon_floorplan_sessions_set_updated_at on public.operon_floorplan_measurement_sessions;
create trigger operon_floorplan_sessions_set_updated_at
before update on public.operon_floorplan_measurement_sessions
for each row execute function public.operon_floorplan_sessions_set_updated_at();

create or replace function public.operon_floorplan_measurement_version_immutable_guard()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' and old.version_status in ('customer_submitted', 'approved', 'site_confirmed') then
    raise exception 'Immutable floorplan measurement versions cannot be updated';
  end if;
  if tg_op = 'DELETE' and old.version_status in ('customer_submitted', 'approved', 'site_confirmed') then
    raise exception 'Immutable floorplan measurement versions cannot be deleted';
  end if;
  return old;
end;
$$;

drop trigger if exists operon_floorplan_measurement_version_immutable_guard
  on public.operon_floorplan_measurement_versions;
create trigger operon_floorplan_measurement_version_immutable_guard
before update or delete on public.operon_floorplan_measurement_versions
for each row execute function public.operon_floorplan_measurement_version_immutable_guard();

alter table public.operon_floorplan_measurement_sessions enable row level security;
alter table public.operon_floorplan_measurement_versions enable row level security;
alter table public.operon_floorplan_measurement_sections enable row level security;
alter table public.operon_floorplan_measurement_review_events enable row level security;
alter table public.operon_floorplan_quote_links enable row level security;

revoke all on table public.operon_floorplan_measurement_sessions from anon, authenticated;
revoke all on table public.operon_floorplan_measurement_versions from anon, authenticated;
revoke all on table public.operon_floorplan_measurement_sections from anon, authenticated;
revoke all on table public.operon_floorplan_measurement_review_events from anon, authenticated;
revoke all on table public.operon_floorplan_quote_links from anon, authenticated;

grant all on table public.operon_floorplan_measurement_sessions to service_role;
grant all on table public.operon_floorplan_measurement_versions to service_role;
grant all on table public.operon_floorplan_measurement_sections to service_role;
grant all on table public.operon_floorplan_measurement_review_events to service_role;
grant all on table public.operon_floorplan_quote_links to service_role;

revoke execute on function public.operon_floorplan_sessions_set_updated_at() from public;
revoke execute on function public.operon_floorplan_measurement_version_immutable_guard() from public;
