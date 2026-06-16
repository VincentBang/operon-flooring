-- Operon Flooring Quote OS foundation rollback draft.
-- DRAFT ONLY: review before use. Intended to reverse only objects introduced by
-- quote_os_foundation_draft.sql.
--
-- Safety rules:
-- - Do not drop existing production tables such as operon_leads, operon_lead_events,
--   operon_quote_requests, operon_uploaded_files, operon_follow_ups, operon_product_ranges,
--   operon_quote_reviews, or operon_chatbot_qualifications.
-- - Drop new Quote OS foundation child tables first.
-- - Only drop extension columns from existing tables if the approved migration created them
--   and no production runtime depends on them.

begin;

-- Remove FK constraints from existing tables back to draft-created tables.
alter table if exists public.operon_leads
  drop constraint if exists operon_leads_current_quote_version_id_fkey,
  drop constraint if exists operon_leads_current_site_visit_id_fkey;

alter table if exists public.operon_quote_requests
  drop constraint if exists operon_quote_requests_current_quote_version_id_fkey,
  drop constraint if exists operon_quote_requests_latest_site_visit_id_fkey;

-- Drop draft-created tables in dependency order.
drop table if exists public.operon_job_outcomes;
drop table if exists public.operon_follow_up_tasks;
drop table if exists public.operon_quote_line_items;
drop table if exists public.operon_quote_versions;
drop table if exists public.operon_site_visit_photos;
drop table if exists public.operon_site_visit_rooms;
drop table if exists public.operon_site_visits;

-- Drop columns added by the draft to existing tables.
-- Keep these commented until confirming they were introduced only by the draft
-- and no later approved runtime code depends on them.
--
-- alter table if exists public.operon_leads
--   drop column if exists site_visit_status,
--   drop column if exists proposal_status,
--   drop column if exists current_quote_version_id,
--   drop column if exists current_site_visit_id;
--
-- alter table if exists public.operon_quote_requests
--   drop column if exists current_quote_version_id,
--   drop column if exists latest_site_visit_id,
--   drop column if exists proposal_status,
--   drop column if exists customer_safe_summary;
--
-- alter table if exists public.operon_uploaded_files
--   drop column if exists retention_status,
--   drop column if exists expires_at;

drop function if exists public.operon_quote_os_set_updated_at();

commit;
