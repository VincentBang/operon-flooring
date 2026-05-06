-- DANGER: run only after operon_v2_clean_schema.sql is created, pricing data is
-- re-entered/imported, Netlify is using OPERON_SUPABASE_SCHEMA_MODE=v2, and a
-- real quote save + review save + tracking event have been verified.
--
-- This script removes the confusing legacy/parallel tables from public schema.
-- Export any rows you care about first. Do not run during active customer traffic.

begin;

drop view if exists public.quotes_public_view;

drop table if exists public.agent_tasks;
drop table if exists public.backlink_targets;
drop table if exists public.blog_ideas;
drop table if exists public.seo_keywords;
drop table if exists public.seo_pages;
drop table if exists public.seo_rank_snapshots;

drop table if exists public.quote_files;
drop table if exists public.quote_revenue;
drop table if exists public.customers;
drop table if exists public.quotes;

drop table if exists public.quote_pricing_outcomes;
drop table if exists public.pricing_optimization_buckets;
drop table if exists public.close_automation_runs;
drop table if exists public.followup_messages;
drop table if exists public.followup_templates;
drop table if exists public.quote_reviews;
drop table if exists public.quote_leads;
drop table if exists public.uploaded_files;
drop table if exists public.quote_items;
drop table if exists public.quote_rooms;
drop table if exists public.quote_events;
drop table if exists public.quote_funnel_sessions;
drop table if exists public.quote_requests;

drop table if exists public.pricing_stair_rates;
drop table if exists public.stair_rates;
drop table if exists public.pricing_rules;
drop table if exists public.pricing_location_zones;
drop table if exists public.pricing_removal_rates;
drop table if exists public.pricing_trim_options;
drop table if exists public.pricing_underlay_options;
drop table if exists public.pricing_install_rates;
drop table if exists public.pricing_products;
drop table if exists public.pricing_categories;

drop table if exists public.location_zones;
drop table if exists public.removal_rates;
drop table if exists public.skirting_scotia_options;
drop table if exists public.underlay_options;
drop table if exists public.install_rates;
drop table if exists public.products;
drop table if exists public.product_ranges;

commit;
