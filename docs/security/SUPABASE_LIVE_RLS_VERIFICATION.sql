-- Operon Flooring live Supabase RLS/storage verification.
-- Run this in the Supabase SQL editor for the production project.

select
  schemaname,
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'quote_requests',
    'quote_rooms',
    'quote_items',
    'uploaded_files',
    'quote_reviews',
    'quote_events',
    'quote_funnel_sessions',
    'quote_leads',
    'followup_templates',
    'followup_messages',
    'quote_pricing_outcomes',
    'pricing_optimization_buckets',
    'operon_quote_requests',
    'operon_quote_rooms',
    'operon_quote_items',
    'operon_uploaded_files',
    'operon_quote_reviews',
    'operon_quote_events',
    'operon_quote_funnel_sessions',
    'operon_quote_leads',
    'operon_followup_templates',
    'operon_followup_messages',
    'operon_quote_pricing_outcomes',
    'operon_pricing_optimization_buckets'
  )
order by tablename;

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
    'quote_requests',
    'quote_rooms',
    'quote_items',
    'uploaded_files',
    'quote_reviews',
    'quote_events',
    'quote_funnel_sessions',
    'quote_leads',
    'followup_templates',
    'followup_messages',
    'quote_pricing_outcomes',
    'pricing_optimization_buckets',
    'operon_quote_requests',
    'operon_quote_rooms',
    'operon_quote_items',
    'operon_uploaded_files',
    'operon_quote_reviews',
    'operon_quote_events',
    'operon_quote_funnel_sessions',
    'operon_quote_leads',
    'operon_followup_templates',
    'operon_followup_messages',
    'operon_quote_pricing_outcomes',
    'operon_pricing_optimization_buckets'
  )
order by tablename, policyname;

select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
where id in ('quote-files', 'floorplan-files');

select
  policyname,
  cmd,
  roles,
  qual,
  with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
