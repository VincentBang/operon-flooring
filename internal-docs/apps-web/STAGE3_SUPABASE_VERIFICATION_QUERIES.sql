-- Stage 3 Supabase verification queries.
-- Read-only checks. Do not print customer rows.

-- 1. Confirm Stage 3 tables exist.
select
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_floorplan_reviews',
    'operon_lead_status_history'
  )
order by table_name;

-- 2. Confirm nullable lead links exist.
select
  table_name,
  column_name,
  data_type
from information_schema.columns
where table_schema = 'public'
  and table_name in ('operon_quote_requests', 'operon_quote_reviews', 'operon_uploaded_files')
  and column_name = 'lead_id'
order by table_name;

-- 3. Confirm RLS enabled on new tables.
select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_floorplan_reviews',
    'operon_lead_status_history'
  )
order by tablename;

-- 4. Confirm public roles do not have table grants on new private tables.
select
  grantee,
  table_name,
  privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in (
    'operon_leads',
    'operon_lead_events',
    'operon_lead_notes',
    'operon_lead_files',
    'operon_follow_ups',
    'operon_floorplan_reviews',
    'operon_lead_status_history'
  )
  and grantee in ('anon', 'authenticated')
order by grantee, table_name, privilege_type;

-- Expected result for query 4: zero rows.

-- 5. Counts only, no customer data.
select primary_source, status, count(*) as lead_count
from public.operon_leads
group by primary_source, status
order by primary_source, status;

select event_type, count(*) as event_count
from public.operon_lead_events
group by event_type
order by event_type;

-- 6. Link coverage counts only.
select
  'operon_quote_requests' as table_name,
  count(*) as total_rows,
  count(lead_id) as linked_rows
from public.operon_quote_requests
union all
select
  'operon_quote_reviews',
  count(*),
  count(lead_id)
from public.operon_quote_reviews
union all
select
  'operon_uploaded_files',
  count(*),
  count(lead_id)
from public.operon_uploaded_files;
