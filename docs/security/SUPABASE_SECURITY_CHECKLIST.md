# Supabase Security Checklist

Use this checklist in the Supabase dashboard before production traffic relies on shared quote, file or admin workflows. Do not assume RLS/storage policies are active just because schema files exist in the repo.

For copy/paste SQL, run `docs/security/SUPABASE_LIVE_RLS_VERIFICATION.sql` in the production Supabase SQL editor.

## Tables to Verify

Current repo references these customer/security-sensitive tables:

- `quote_requests` / `operon_quote_requests`
- `quote_rooms` / `operon_quote_rooms`
- `quote_items` / `operon_quote_items`
- `uploaded_files` / `operon_uploaded_files`
- `quote_reviews` / `operon_quote_reviews`
- `quote_events` / `operon_quote_events`
- `quote_funnel_sessions` / `operon_quote_funnel_sessions`
- `quote_leads` / `operon_quote_leads`
- `followup_templates` / `operon_followup_templates`
- `followup_messages` / `operon_followup_messages`
- `quote_pricing_outcomes` / `operon_quote_pricing_outcomes`
- `pricing_optimization_buckets` / `operon_pricing_optimization_buckets`

## RLS Checks

Run in Supabase SQL editor:

```sql
select schemaname, tablename, rowsecurity
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
```

Expected:

- RLS is enabled for every table that exists.
- Anonymous users can insert only where the website needs customer submissions/events.
- Anonymous users cannot select all quote requests, reviews, files, leads, follow-ups or pricing optimisation records.
- `quote_reviews`, lead/admin tables and pricing optimisation tables are service-role/admin only unless a specific policy is approved.

## Storage Checks

Run:

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id in ('quote-files', 'floorplan-files');
```

Expected:

- Customer upload buckets are `public = false`.
- File size limit is set.
- Allowed MIME types are restricted to PDF/JPG/JPEG/PNG/WEBP where applicable.

Run:

```sql
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
order by policyname;
```

Expected:

- Anonymous users may insert into the intended private upload bucket only.
- Anonymous users cannot select/list/update/delete customer uploads.
- Admin reads happen through service-role server functions or authenticated admin policies.

## Service Role Rules

- `SUPABASE_SERVICE_ROLE_KEY` must exist only in Netlify/Supabase function environment variables.
- It must not appear in `apps/web/*.html`, public JavaScript or browser config.
- Rotate the service-role key if it was ever exposed in frontend code or logs.

## Known Repo Status

- Repo schema files enable RLS for main quote/file/review tables.
- `supabase/schema.sql` creates a private `quote-files` bucket and anonymous insert-only object policy.
- Live Supabase dashboard state still must be verified manually because migrations may not all be applied.
