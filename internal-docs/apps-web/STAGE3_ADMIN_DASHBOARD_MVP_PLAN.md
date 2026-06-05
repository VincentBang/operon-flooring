# Stage 3 Admin Dashboard MVP Plan

Date: 2026-06-04

Purpose: define the first internal Operon Flooring lead dashboard before building the protected admin shell.

## MVP Goal

Give Operon Flooring one internal operating view for website demand:

- Quote leads
- Contact enquiries
- Quote-review leads
- Product-to-quote handoffs
- Floorplan/upload-assisted quotes
- Chatbot/operator requests

The dashboard should help decide: who needs action, what is missing, what the next action is, and which leads are closest to revenue.

## Non-Goals

- No customer login.
- No contractor login.
- No marketplace.
- No payment.
- No direct browser access to lead tables.
- No internal rates, supplier costs, margins, access multipliers, or private pricing logic in the admin frontend payload.

## Proposed Routes

- `/admin`
  - Redirect to `/admin/leads` after auth.
- `/admin/leads`
  - Lead list, filters, status pipeline, source mix.
- `/admin/leads/[id]`
  - Lead detail, quote/review/upload context, notes, timeline, next action.
- `/admin/follow-ups`
  - Due follow-ups in dry-run/manual mode only.
- `/admin/quote-reviews`
  - Quote-review queue filtered by missing/risk items.
- `/admin/floorplans`
  - Floorplan/upload review queue.
- `/admin/reports`
  - Lightweight source/product/suburb/estimate reporting.

## Lead List MVP

Columns:

- Created date
- Last activity
- Source
- Status
- Priority
- Name
- Suburb/postcode
- Product category
- Area
- Estimate total
- Confidence
- Missing flags count
- Risk flags count
- Next action

Filters:

- Status
- Source
- Priority
- Product category
- Suburb
- Date range
- Missing info
- Quote review attached
- Floorplan attached

Default sort:

- `priority`, then `last_activity_at desc`.

## Lead Detail MVP

Sections:

- Customer details: name, phone, email, suburb, postcode.
- Project summary: property type when available, product category/name, area, estimated order area.
- Quote summary: customer-safe total, confidence, missing/risk flags, quote reference.
- Quote review: readiness/confidence, missing items, top questions, review status.
- Uploads/files: safe filename, file type, size, role, storage status, created date. No bucket/path shown.
- Follow-up: status, due date, next action.
- Notes: internal notes only.
- Timeline: lead events.
- Status controls: update lead status and priority.

Backing tables:

- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- `operon_floorplan_reviews`
- `operon_lead_status_history`

## Status Pipeline

Allowed statuses:

- New
- Needs review
- Waiting customer
- Quote sent
- Site measure booked
- Won
- Lost
- Archived

Recommended operator workflow:

1. Review New leads first.
2. Move unclear quotes/uploads to Needs review.
3. Move sent quotes to Quote sent.
4. Set Waiting customer when information is requested.
5. Set Site measure booked when a site visit is scheduled.
6. Mark Won/Lost only after confirmed outcome.
7. Archive test/spam/internal rows.

## Security Model

Dashboard should not use public Supabase anon reads.

Recommended MVP access:

- Protected admin route in `apps/web-tsx`.
- Admin session checked by server-side Netlify Functions.
- Admin Functions use service-role Supabase access.
- Browser calls protected Functions only.
- No service-role keys in browser.
- No direct Supabase table select from browser.

Admin authorization options:

1. Short-term: Netlify Identity or signed admin session checked in Functions.
2. Medium-term: Supabase Auth with admin claims, but Functions still perform reads/writes.
3. Avoid: shipping Supabase anon dashboard queries with RLS complexity on sensitive lead tables.

## Function API Surface

Read functions:

- `admin-leads-list`
- `admin-lead-detail`
- `admin-lead-events`
- `admin-lead-files`
- `admin-reports-summary`

Write functions:

- `admin-update-lead-status`
- `admin-create-lead-note`
- `admin-update-next-action`
- `admin-schedule-follow-up`

All admin functions should:

- Require admin auth.
- Return customer-safe/internal-operator-safe fields only.
- Never return private pricing tables or raw OCR text by default.
- Log admin action metadata without secrets.

## Reporting MVP

Cards:

- Leads by source
- Leads by status
- Quote-review count
- Floorplan/upload count
- Product category mix
- Top suburbs
- Average estimate total
- High-priority open leads

No forecasting or contractor allocation in MVP.

## Future Operon Kitchens Path

Keep the parent lead schema generic:

- Add `vertical` later, default `flooring`.
- Reuse `operon_leads`, `operon_lead_events`, notes, files, and follow-ups.
- Keep detail tables vertical-specific when needed:
  - `operon_quote_reviews`
  - future `operon_kitchen_quote_requests`
  - future `operon_kitchen_upload_reviews`

## Build Phases

1. Admin auth shell.
2. Lead list read function and page.
3. Lead detail read function and page.
4. Status/priority/notes writes.
5. Follow-up queue dry-run.
6. Quote-review and floorplan queues.
7. Reporting dashboard.
8. Stage 3 security audit.

## Risks

- Dashboard misses leads if function write paths are incomplete.
- Admin auth shortcut could expose sensitive customer data.
- Returning raw quote/OCR/upload text would create privacy debt.
- Public pricing architecture still needs Stage 4 server-side pricing migration.
- Duplicate legacy/v2 tables can confuse reports unless source tables are explicit.

## Approval Gate

Before coding Task 3.4:

- Verify Stage 3 lead-write functions in a preview.
- Confirm at least one quote, contact, quote-review, and operator test lead reaches `operon_leads`.
- Confirm uploaded files link only when parent context exists.
- Approve admin auth approach.
