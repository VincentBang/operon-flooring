-- Operon Flooring Quote OS RLS, grant, storage and GraphQL exposure checks.
-- READ-ONLY VERIFICATION QUERIES.
-- Do not paste customer rows or secrets into reports. Export counts/status only.

-- ---------------------------------------------------------------------------
-- 1. Operating table inventory.
-- ---------------------------------------------------------------------------

select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p', 'v', 'm')
  and c.relname in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_follow_up_tasks',
    'operon_floorplan_reviews',
    'operon_lead_status_history',
    'operon_chatbot_qualifications',
    'operon_quote_requests',
    'operon_quote_rooms',
    'operon_quote_items',
    'operon_quote_events',
    'operon_quote_reviews',
    'operon_uploaded_files',
    'operon_site_visits',
    'operon_site_visit_rooms',
    'operon_site_visit_photos',
    'operon_quote_versions',
    'operon_quote_line_items',
    'operon_job_outcomes',
    'operon_product_ranges',
    'operon_private_rate_cards',
    'operon_stair_pricing_profiles',
    'operon_stair_profile_prices',
    'operon_range_stair_price_overrides',
    'pricing_stair_rates',
    'stair_rates'
  )
order by c.relname;

-- Expected:
-- - RLS enabled for all tables in this list that exist.
-- - Views, if any are added later, should either be in an unexposed schema or use
--   security_invoker with no anon grants.

-- ---------------------------------------------------------------------------
-- 2. Role grants for anon/authenticated/service_role.
-- ---------------------------------------------------------------------------

select
  table_schema,
  table_name,
  grantee,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_follow_up_tasks',
    'operon_floorplan_reviews',
    'operon_lead_status_history',
    'operon_chatbot_qualifications',
    'operon_quote_requests',
    'operon_quote_rooms',
    'operon_quote_items',
    'operon_quote_events',
    'operon_quote_reviews',
    'operon_uploaded_files',
    'operon_site_visits',
    'operon_site_visit_rooms',
    'operon_site_visit_photos',
    'operon_quote_versions',
    'operon_quote_line_items',
    'operon_job_outcomes',
    'operon_product_ranges',
    'operon_private_rate_cards',
    'operon_stair_pricing_profiles',
    'operon_stair_profile_prices',
    'operon_range_stair_price_overrides',
    'pricing_stair_rates',
    'stair_rates'
  )
  and grantee in ('anon', 'authenticated', 'service_role')
order by table_name, grantee, privilege_type;

-- Expected:
-- - No anon SELECT on lead, quote, upload, event, review, internal quote,
--   site visit, job outcome, private rate-card or private stair-pricing tables.
-- - No authenticated access until real admin auth/RLS is designed.
-- - service_role may have required privileges for Netlify Functions.

-- ---------------------------------------------------------------------------
-- 3. RLS policies that mention public roles.
-- ---------------------------------------------------------------------------

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_follow_up_tasks',
    'operon_floorplan_reviews',
    'operon_lead_status_history',
    'operon_chatbot_qualifications',
    'operon_quote_requests',
    'operon_quote_rooms',
    'operon_quote_items',
    'operon_quote_events',
    'operon_quote_reviews',
    'operon_uploaded_files',
    'operon_site_visits',
    'operon_site_visit_rooms',
    'operon_site_visit_photos',
    'operon_quote_versions',
    'operon_quote_line_items',
    'operon_job_outcomes',
    'operon_product_ranges',
    'operon_private_rate_cards',
    'operon_stair_pricing_profiles',
    'operon_stair_profile_prices',
    'operon_range_stair_price_overrides'
  )
order by tablename, policyname;

-- Expected:
-- - No anon SELECT policies on private/internal tables.
-- - Prefer no anon INSERT policies on quote/upload/lead/event tables when Netlify Functions
--   are the write path.

-- ---------------------------------------------------------------------------
-- 4. Direct anon SELECT probe without returning customer rows.
-- Run in SQL editor to inspect grants. Do not dump row data.
-- ---------------------------------------------------------------------------

select
  table_name,
  has_table_privilege('anon', format('public.%I', table_name), 'SELECT') as anon_can_select,
  has_table_privilege('anon', format('public.%I', table_name), 'INSERT') as anon_can_insert,
  has_table_privilege('anon', format('public.%I', table_name), 'UPDATE') as anon_can_update,
  has_table_privilege('anon', format('public.%I', table_name), 'DELETE') as anon_can_delete,
  has_table_privilege('authenticated', format('public.%I', table_name), 'SELECT') as authenticated_can_select
from (
  values
    ('operon_leads'),
    ('operon_lead_events'),
    ('operon_lead_notes'),
    ('operon_lead_files'),
    ('operon_follow_ups'),
    ('operon_follow_up_tasks'),
    ('operon_quote_requests'),
    ('operon_quote_rooms'),
    ('operon_quote_items'),
    ('operon_quote_events'),
    ('operon_quote_reviews'),
    ('operon_uploaded_files'),
    ('operon_site_visits'),
    ('operon_site_visit_rooms'),
    ('operon_site_visit_photos'),
    ('operon_quote_versions'),
    ('operon_quote_line_items'),
    ('operon_job_outcomes'),
    ('operon_private_rate_cards'),
    ('operon_stair_pricing_profiles'),
    ('operon_stair_profile_prices'),
    ('operon_range_stair_price_overrides')
) as t(table_name)
where to_regclass(format('public.%I', table_name)) is not null
order by table_name;

-- Expected:
-- - anon_can_select = false for every private/internal table.
-- - anon_can_insert should usually be false because public writes go through Netlify Functions.

-- ---------------------------------------------------------------------------
-- 5. Sensitive columns inventory.
-- ---------------------------------------------------------------------------

select
  table_schema,
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and (
    column_name ilike '%margin%'
    or column_name ilike '%cost%'
    or column_name ilike '%rate%'
    or column_name ilike '%supplier%'
    or column_name ilike '%storage_bucket%'
    or column_name ilike '%file_path%'
    or column_name ilike '%signed_url%'
    or column_name ilike '%ocr%'
    or column_name ilike '%extracted%'
    or column_name ilike '%service_role%'
    or column_name ilike '%secret%'
  )
order by table_name, column_name;

-- Expected:
-- - Any sensitive columns are on service-role/admin-only tables.
-- - Public browser responses must not include these columns.

-- ---------------------------------------------------------------------------
-- 6. Storage bucket privacy and storage object policies.
-- ---------------------------------------------------------------------------

select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id in ('quote-files', 'floorplan-files');

select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;

-- Expected:
-- - quote-files and floorplan-files are private (public = false).
-- - anon cannot list/read arbitrary objects.
-- - If uploads are function-only, anon direct storage INSERT should be removed.

-- ---------------------------------------------------------------------------
-- 7. GraphQL exposure visibility.
-- ---------------------------------------------------------------------------

select
  n.nspname as schema_name,
  c.relname as relation_name,
  c.relkind as relation_kind,
  has_table_privilege('anon', c.oid, 'SELECT') as anon_can_select,
  has_table_privilege('authenticated', c.oid, 'SELECT') as authenticated_can_select
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind in ('r', 'p', 'v', 'm')
  and (
    c.relname like 'operon_%'
    or c.relname in ('quote_requests', 'quote_items', 'quote_rooms', 'quote_events', 'uploaded_files', 'quote_reviews')
  )
order by c.relname;

-- Expected:
-- - Any relation with anon_can_select = true is a GraphQL/Data API exposure candidate.
-- - Internal lead/quote/upload/rate-card relations should not be anon-readable.

-- ---------------------------------------------------------------------------
-- 8. Public write path assumptions.
-- ---------------------------------------------------------------------------

select
  'public writes should be Netlify Function validated' as rule,
  'quote/contact/review/upload/chatbot writes should use service_role server-side, not browser anon table writes' as expected_state;

-- Confirm in code as part of QA:
-- - upload-customer-file response does not include storage_bucket or file_path.
-- - save-quote-request response does not include private rates, margins, supplier costs, storage paths, raw OCR text, or service-role data.
-- - quote-review-ocr response does not include extractedText/extracted_text/raw OCR text.
-- - chatbot event function rejects transcript, OCR, raw quote text, pricing/rate/margin fields and PII unless approved.
