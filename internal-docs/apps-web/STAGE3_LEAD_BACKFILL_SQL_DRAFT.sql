-- Stage 3 lead backfill draft.
-- Do not run without a fresh backup and approval.
-- Purpose: create parent operon_leads rows for existing quote/review rows
-- that predate the Stage 3 lead writer, then link detail rows by lead_id.

begin;

-- 1. Backfill quote request leads.
with source_quotes as (
  select
    qr.id,
    qr.created_at,
    qr.customer_name,
    qr.email,
    qr.phone,
    qr.suburb,
    qr.postcode,
    qr.product_category,
    qr.product_name,
    qr.real_area,
    qr.chargeable_area,
    qr.total_inc_gst,
    qr.close_score,
    coalesce(nullif(qr.confidence_level, ''), qr.close_band) as confidence_level,
    coalesce(qr.lead_missing_fields, '[]'::jsonb) as missing_info_flags,
    coalesce(qr.lead_risk_flags, '[]'::jsonb) as risk_flags,
    qr.quote_review_attached,
    qr.floorplan_attached,
    qr.followup_status,
    coalesce(nullif(qr.lead_next_action, ''), nullif(qr.next_action, ''), 'Review quote request') as next_action,
    qr.status,
    qr.quote_reference
  from public.operon_quote_requests qr
  where qr.lead_id is null
),
inserted_quote_leads as (
  insert into public.operon_leads (
    created_at,
    primary_source,
    source_detail,
    status,
    priority,
    customer_name,
    email,
    phone,
    suburb,
    postcode,
    product_category,
    product_name,
    area_m2,
    estimated_order_area_m2,
    estimate_total_inc_gst,
    confidence_score,
    confidence_level,
    missing_info_flags,
    risk_flags,
    quote_review_status,
    floorplan_status,
    follow_up_status,
    next_action,
    last_activity_at,
    metadata
  )
  select
    created_at,
    'quote',
    case
      when floorplan_attached then 'floorplan_handoff'
      when quote_review_attached then 'quote_review_handoff'
      when status = 'emailed' then 'email_quote'
      when status = 'draft_saved' then 'direct_quote_draft'
      else 'direct_quote_submit'
    end,
    case
      when status = 'emailed' then 'Quote sent'
      when jsonb_array_length(risk_flags) > 0 or jsonb_array_length(missing_info_flags) > 0 then 'Needs review'
      else 'New'
    end,
    case
      when total_inc_gst >= 12000 then 'high'
      when total_inc_gst < 1500 then 'low'
      else 'normal'
    end,
    nullif(customer_name, ''),
    lower(nullif(email, '')),
    nullif(phone, ''),
    nullif(suburb, ''),
    nullif(postcode, ''),
    nullif(product_category, ''),
    nullif(product_name, ''),
    nullif(real_area, 0),
    nullif(chargeable_area, 0),
    nullif(total_inc_gst, 0),
    close_score,
    nullif(confidence_level, ''),
    missing_info_flags,
    risk_flags,
    case when quote_review_attached then 'attached' else 'none' end,
    case when floorplan_attached then 'attached' else 'none' end,
    coalesce(nullif(followup_status, ''), 'none'),
    next_action,
    created_at,
    jsonb_build_object(
      'backfill_source', 'operon_quote_requests',
      'quote_request_id', id,
      'quote_reference', quote_reference
    )
  from source_quotes
  returning id, (metadata->>'quote_request_id')::uuid as quote_request_id
)
update public.operon_quote_requests qr
set lead_id = iql.id
from inserted_quote_leads iql
where qr.id = iql.quote_request_id;

-- 2. Backfill quote-review leads that are not already linked.
with source_reviews as (
  select
    qrv.id,
    qrv.created_at,
    qrv.review_mode,
    qrv.customer_name,
    qrv.email,
    qrv.phone,
    qrv.suburb,
    qrv.postcode,
    qrv.flooring_type,
    qrv.area_m2,
    qrv.quote_total,
    coalesce(qrv.missing_items, '[]'::jsonb) as missing_items,
    coalesce(qrv.risk_items, '[]'::jsonb) as risk_items,
    qrv.risk_level,
    qrv.confidence_level,
    qrv.converted_to_quote
  from public.operon_quote_reviews qrv
  where qrv.lead_id is null
),
inserted_review_leads as (
  insert into public.operon_leads (
    created_at,
    primary_source,
    source_detail,
    status,
    priority,
    customer_name,
    email,
    phone,
    suburb,
    postcode,
    product_category,
    area_m2,
    estimate_total_inc_gst,
    confidence_level,
    missing_info_flags,
    risk_flags,
    quote_review_status,
    next_action,
    last_activity_at,
    metadata
  )
  select
    created_at,
    'quote_review',
    case when review_mode = 'detailed' then 'uploaded_quote_review' else 'quick_check' end,
    'Needs review',
    case when risk_level = 'high' or quote_total >= 12000 or confidence_level = 'low' then 'high' else 'normal' end,
    nullif(customer_name, ''),
    lower(nullif(email, '')),
    nullif(phone, ''),
    nullif(suburb, ''),
    nullif(postcode, ''),
    nullif(flooring_type, ''),
    area_m2,
    quote_total,
    nullif(confidence_level, ''),
    missing_items,
    risk_items,
    'saved',
    'Review quote comparison and offer Operon comparison quote',
    created_at,
    jsonb_build_object(
      'backfill_source', 'operon_quote_reviews',
      'quote_review_id', id,
      'review_mode', review_mode,
      'risk_level', risk_level,
      'converted_to_quote', converted_to_quote
    )
  from source_reviews
  returning id, (metadata->>'quote_review_id')::uuid as quote_review_id
)
update public.operon_quote_reviews qrv
set lead_id = irl.id
from inserted_review_leads irl
where qrv.id = irl.quote_review_id;

-- 3. Link uploaded files to quote-request leads where possible.
update public.operon_uploaded_files uf
set lead_id = qr.lead_id
from public.operon_quote_requests qr
where uf.lead_id is null
  and uf.quote_id = qr.id
  and qr.lead_id is not null;

-- 4. Create lead file records for linked uploads not already represented.
insert into public.operon_lead_files (
  lead_id,
  uploaded_file_id,
  file_role,
  safe_filename,
  file_type,
  file_size_bytes,
  storage_status,
  metadata
)
select
  uf.lead_id,
  uf.id,
  case
    when uf.source = 'floorplan' then 'floorplan_upload'
    when uf.source = 'quote_review' then 'quote_review_upload'
    else 'quote_attachment'
  end,
  uf.file_name,
  uf.file_type,
  uf.file_size_bytes,
  'stored_private',
  jsonb_build_object('backfill_source', 'operon_uploaded_files', 'source', uf.source)
from public.operon_uploaded_files uf
where uf.lead_id is not null
  and not exists (
    select 1
    from public.operon_lead_files lf
    where lf.uploaded_file_id = uf.id
  );

-- 5. Event backfill markers for auditability.
insert into public.operon_lead_events (lead_id, event_type, source, source_table, source_id, metadata)
select
  qr.lead_id,
  'lead_backfilled',
  'stage3_backfill',
  'operon_quote_requests',
  qr.id,
  jsonb_build_object('quote_reference', qr.quote_reference)
from public.operon_quote_requests qr
where qr.lead_id is not null
  and not exists (
    select 1
    from public.operon_lead_events e
    where e.lead_id = qr.lead_id
      and e.event_type = 'lead_backfilled'
      and e.source_table = 'operon_quote_requests'
      and e.source_id = qr.id
  );

insert into public.operon_lead_events (lead_id, event_type, source, source_table, source_id, metadata)
select
  qrv.lead_id,
  'lead_backfilled',
  'stage3_backfill',
  'operon_quote_reviews',
  qrv.id,
  jsonb_build_object('review_mode', qrv.review_mode)
from public.operon_quote_reviews qrv
where qrv.lead_id is not null
  and not exists (
    select 1
    from public.operon_lead_events e
    where e.lead_id = qrv.lead_id
      and e.event_type = 'lead_backfilled'
      and e.source_table = 'operon_quote_reviews'
      and e.source_id = qrv.id
  );

-- Verification queries to run before commit:
-- select count(*) from public.operon_quote_requests where lead_id is null;
-- select count(*) from public.operon_quote_reviews where lead_id is null;
-- select primary_source, count(*) from public.operon_leads group by 1 order by 1;
-- select event_type, count(*) from public.operon_lead_events group by 1 order by 1;

-- Keep transaction open for manual inspection in SQL editor.
-- commit;
rollback;
