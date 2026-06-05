-- Stage 3 lead schema rollback draft.
-- Do not run unless an approved rollback is required.
-- This removes additive Stage 3 lead tables and nullable links.
-- It does not touch legacy quote/contact/review data except dropping lead_id links.

begin;

alter table if exists public.operon_quote_requests
  drop constraint if exists operon_quote_requests_lead_id_fkey;

alter table if exists public.operon_quote_reviews
  drop constraint if exists operon_quote_reviews_lead_id_fkey;

alter table if exists public.operon_uploaded_files
  drop constraint if exists operon_uploaded_files_lead_id_fkey;

drop index if exists public.operon_quote_requests_lead_id_idx;
drop index if exists public.operon_quote_reviews_lead_id_idx;
drop index if exists public.operon_uploaded_files_lead_id_idx;
drop index if exists public.operon_leads_status_priority_activity_idx;
drop index if exists public.operon_leads_primary_source_created_idx;
drop index if exists public.operon_leads_suburb_created_idx;
drop index if exists public.operon_leads_product_category_created_idx;
drop index if exists public.operon_lead_events_lead_created_idx;
drop index if exists public.operon_follow_ups_status_due_idx;
drop index if exists public.operon_lead_status_history_lead_changed_idx;

alter table if exists public.operon_quote_requests
  drop column if exists lead_id;

alter table if exists public.operon_quote_reviews
  drop column if exists lead_id;

alter table if exists public.operon_uploaded_files
  drop column if exists lead_id;

drop table if exists public.operon_lead_status_history;
drop table if exists public.operon_floorplan_reviews;
drop table if exists public.operon_follow_ups;
drop table if exists public.operon_lead_files;
drop table if exists public.operon_lead_notes;
drop table if exists public.operon_lead_events;
drop table if exists public.operon_leads;

-- Verification queries after commit:
-- select to_regclass('public.operon_leads') is null as leads_table_removed;
-- select column_name from information_schema.columns
-- where table_schema = 'public'
--   and table_name in ('operon_quote_requests', 'operon_quote_reviews', 'operon_uploaded_files')
--   and column_name = 'lead_id';

-- Keep transaction open for manual inspection in SQL editor.
-- commit;
rollback;
