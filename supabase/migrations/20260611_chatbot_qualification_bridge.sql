-- Stage 3 chatbot qualification bridge.
-- Additive only: stores customer-safe chatbot qualification summaries linked to
-- the parent lead/event model. No raw transcripts, quote text, OCR text, file
-- contents, storage paths, or private pricing data belong in this table.

create table if not exists public.operon_chatbot_qualifications (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.operon_leads(id) on delete cascade,
  event_id uuid references public.operon_lead_events(id) on delete set null,
  created_at timestamptz not null default now(),
  chatbot_session_id text,
  source_page text,
  source_url text,
  intent text not null
    check (intent in (
      'start_quote',
      'existing_quote_review',
      'product_help',
      'floorplan_help',
      'price_question',
      'stairs_removal_scope',
      'suburb_service',
      'contact_human',
      'general_question'
    )),
  suburb text,
  property_type text
    check (property_type is null or property_type in ('house', 'townhouse', 'apartment', 'unit_apartment', 'commercial', 'commercial_other', 'not_sure', 'skipped')),
  product_category text
    check (product_category is null or product_category in ('hybrid', 'laminate', 'engineered', 'engineered_timber', 'timber', 'not_sure', 'skipped')),
  area_status text
    check (area_status is null or area_status in ('known', 'unknown', 'not_sure', 'skipped')),
  approx_area_m2 numeric,
  stairs_status text
    check (stairs_status is null or stairs_status in ('yes', 'no', 'not_sure', 'skipped')),
  removal_status text
    check (removal_status is null or removal_status in ('yes', 'no', 'not_sure', 'skipped')),
  floorplan_status text
    check (floorplan_status is null or floorplan_status in ('yes', 'no', 'not_sure', 'skipped')),
  existing_quote_status text
    check (existing_quote_status is null or existing_quote_status in ('yes', 'no', 'not_sure', 'skipped')),
  urgency text
    check (urgency is null or urgency in ('now', 'soon', 'planning', 'flexible', 'not_sure', 'skipped')),
  next_action text,
  handoff_url text,
  missing_info jsonb not null default '[]'::jsonb,
  confidence text
    check (confidence is null or confidence in ('low', 'medium', 'high', 'unknown')),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists operon_chatbot_qualifications_lead_created_idx
  on public.operon_chatbot_qualifications (lead_id, created_at desc);

create index if not exists operon_chatbot_qualifications_session_created_idx
  on public.operon_chatbot_qualifications (chatbot_session_id, created_at desc);

create index if not exists operon_chatbot_qualifications_intent_created_idx
  on public.operon_chatbot_qualifications (intent, created_at desc);

alter table public.operon_chatbot_qualifications enable row level security;

revoke all on table public.operon_chatbot_qualifications from anon, authenticated;
grant all on table public.operon_chatbot_qualifications to service_role;

comment on table public.operon_chatbot_qualifications is
  'Customer-safe chatbot qualification summaries for Operon dashboard lead intelligence. No raw transcript, raw quote text, OCR text, upload content, storage paths, or private pricing data.';
