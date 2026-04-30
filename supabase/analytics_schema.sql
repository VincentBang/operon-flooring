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

create table if not exists quote_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null,
  quote_id uuid references quote_requests(id) on delete set null,
  event_name text not null,
  step_number integer,
  step_name text,
  page_url text,
  device_type text,
  metadata jsonb default '{}'::jsonb
);

create table if not exists quote_funnel_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text not null unique,
  landing_page text,
  traffic_source text,
  device_type text,
  started_quote boolean default false,
  completed_quote boolean default false,
  last_step_completed integer,
  quote_id uuid references quote_requests(id) on delete set null,
  estimated_quote_value numeric,
  abandoned_at_step integer,
  raw_payload jsonb default '{}'::jsonb
);

create table if not exists quote_revenue (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  quote_id uuid references quote_requests(id) on delete cascade,
  status text not null default 'lead' check (status in ('lead','contacted','site_visit_booked','quoted','won','lost','completed')),
  estimated_quote_value numeric,
  final_quote_value numeric,
  material_cost numeric default 0,
  labour_cost numeric default 0,
  subcontractor_cost numeric default 0,
  other_cost numeric default 0,
  gross_profit numeric generated always as (
    coalesce(final_quote_value, 0)
    - coalesce(material_cost, 0)
    - coalesce(labour_cost, 0)
    - coalesce(subcontractor_cost, 0)
    - coalesce(other_cost, 0)
  ) stored,
  gross_margin_pct numeric generated always as (
    case
      when coalesce(final_quote_value, 0) > 0 then
        (
          (
            coalesce(final_quote_value, 0)
            - coalesce(material_cost, 0)
            - coalesce(labour_cost, 0)
            - coalesce(subcontractor_cost, 0)
            - coalesce(other_cost, 0)
          ) / final_quote_value
        )
      else null
    end
  ) stored,
  loss_reason text,
  notes text
);

create table if not exists seo_keywords (
  id uuid primary key default gen_random_uuid(),
  keyword text not null,
  target_page text,
  search_intent text,
  priority_score numeric,
  estimated_volume numeric,
  competition_level text,
  status text default 'planned'
);

create table if not exists seo_pages (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  page_type text,
  primary_keyword text,
  status text,
  word_count integer,
  internal_links_count integer,
  last_updated timestamptz,
  notes text
);

create table if not exists seo_rank_snapshots (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  keyword text not null,
  target_page text,
  rank_position integer,
  impressions integer,
  clicks integer,
  ctr numeric,
  notes text
);

create table if not exists backlink_targets (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  website_name text,
  url text,
  type text,
  priority text,
  status text default 'not_started' check (status in ('not_started','contacted','follow_up','accepted','rejected','live')),
  contact_email text,
  outreach_message text,
  notes text
);

create table if not exists agent_tasks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  category text,
  priority_score numeric,
  impact_score numeric,
  effort_score numeric,
  confidence_score numeric,
  status text default 'todo',
  assigned_agent text,
  reason text,
  expected_impact text,
  completed_at timestamptz
);

create table if not exists blog_ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  target_keyword text,
  intent text,
  related_pages jsonb default '[]'::jsonb,
  priority_score numeric,
  status text default 'idea',
  outline jsonb default '{}'::jsonb,
  notes text
);

alter table quote_requests enable row level security;
alter table quote_events enable row level security;
alter table quote_funnel_sessions enable row level security;
alter table quote_revenue enable row level security;
alter table seo_keywords enable row level security;
alter table seo_pages enable row level security;
alter table seo_rank_snapshots enable row level security;
alter table backlink_targets enable row level security;
alter table agent_tasks enable row level security;
alter table blog_ideas enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on table public.quote_requests to anon, authenticated;
grant insert on table public.quote_events to anon, authenticated;
grant insert on table public.quote_funnel_sessions to anon, authenticated;
grant update on table public.quote_funnel_sessions to anon, authenticated;

drop policy if exists "Allow public quote request insert analytics" on public.quote_requests;
create policy "Allow public quote request insert analytics"
on public.quote_requests
for insert
to public
with check (true);

drop policy if exists "Allow public quote events insert" on public.quote_events;
create policy "Allow public quote events insert"
on public.quote_events
for insert
to public
with check (true);

drop policy if exists "Allow public funnel insert" on public.quote_funnel_sessions;
create policy "Allow public funnel insert"
on public.quote_funnel_sessions
for insert
to public
with check (true);

drop policy if exists "Allow public funnel update" on public.quote_funnel_sessions;
create policy "Allow public funnel update"
on public.quote_funnel_sessions
for update
to public
using (true)
with check (true);

-- Analytics setup notes:
-- 1. `quote_events` and `quote_funnel_sessions` are safe public insert/update targets for anonymous tracking.
-- 2. Admin tables such as `quote_revenue`, `seo_rank_snapshots`, `backlink_targets`, `agent_tasks`, and `blog_ideas`
--    should be protected before production using authenticated policies.
-- 3. Do not expose a service role key in frontend code.
