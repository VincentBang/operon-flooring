# Operon Flooring Quote OS Schema Gap And Migration Draft

Status: draft package only
Related architecture: `docs/operon-flooring-quote-os-architecture.md`
Generated for: Quote OS Task 1.1
Production impact: none. No migration applied, no deploy, no Netlify trigger, no Supabase setting changed.

## Scope And Constraints

This pass inspected the Operon Flooring TSX app, current Supabase migrations, Netlify Functions, public quote/quote-review/chatbot/upload/floorplan paths and existing docs. It creates a backend implementation draft only.

Hard boundaries preserved:

- No pricing logic changes.
- No product id, slug, price, margin, supplier data or handoff changes.
- No public route changes.
- No production Supabase setting changes.
- No deploy or push.
- No changes to existing unrelated local edits in `apps/web-tsx/public/products.js` or `apps/web-tsx/src/app/quote/page.tsx`.
- Browser must never receive storage bucket/path, raw OCR text, service-role secrets, internal rates, margins, supplier costs or private pricing formulas.

## Files Created

- `docs/operon-flooring-quote-os-schema-gap-and-migration-draft.md`
- `supabase/migrations/drafts/quote_os_foundation_draft.sql`
- `supabase/migrations/drafts/quote_os_foundation_rollback_draft.sql`
- `supabase/migrations/drafts/quote_os_rls_verification_queries.sql`

## Current Tables Found

### Legacy pricing and quote tables

From `supabase/migrations/20260502_operon_pricing_lead_schema.sql` and related migrations:

- `product_ranges`
- `products`
- `install_rates`
- `underlay_options`
- `skirting_scotia_options`
- `removal_rates`
- `location_zones`
- `pricing_rules`
- `quote_leads`
- `quote_requests`
- `quote_rooms`
- `quote_items`
- `uploaded_files`
- `quote_events`
- `quote_funnel_sessions`
- `quote_reviews`
- `followup_templates`
- `followup_messages`
- `close_automation_runs`
- `quote_pricing_outcomes`
- `pricing_optimization_buckets`
- `stair_rates`
- `pricing_stair_rates`
- `operon_rate_limits`

These are a mix of early MVP tables and later pricing/follow-up tables. They should not be deleted inside Quote OS foundation work.

### Current v2 Operon tables

From Stage 3 and product range migrations:

- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- `operon_floorplan_reviews`
- `operon_lead_status_history`
- `operon_chatbot_qualifications`
- `operon_product_ranges`

Nullable `lead_id` links were added to:

- `operon_quote_requests`
- `operon_quote_reviews`
- `operon_uploaded_files`

The current function table mapper in `netlify/functions/_supabaseTables.js` defaults to v2 table names by prefixing legacy names with `operon_`.

## Current Functions Found

### Public/customer-facing functions

- `calculate-quote.js`: public estimate endpoint. Normalises browser quote input and returns customer-safe estimate output.
- `save-quote-request.js`: saves quote requests and child rows, sends quote emails, records Stage 3 lead data.
- `send-quote-email.js`: wrapper around quote save/email behaviour.
- `contact-enquiry.js`: contact form handling and lead creation.
- `upload-customer-file.js`: service-role upload to private Supabase storage with file validation and safe response.
- `quote-review-ocr.js`: OCR and quote-review extraction/reporting.
- `save-quote-review.js`: quote-review persistence and lead linking.
- `send-quote-review-email.js`: quote-review email.
- `operator-chat-request.js`: chatbot/operator handoff lead path.
- `save-chatbot-lead-event.js`: strict safe chatbot qualification event writer.
- `chatbot-lead-event.js`: earlier chatbot handoff event writer.
- `public-catalogue-pricing.js`: returns sanitised public catalogue/range pricing data.
- `runtime-health.js`: environment health checks.

### Admin/internal functions

- `admin-session-status.js`
- `lead-dashboard.js`
- `lead-admin.js`
- `lead-status-admin.js`
- `lead-followup-admin.js`
- `followup-admin.js`
- `calculate-private-quote.js`
- `pricing-optimization-insight.js`
- `process-followups.js`

### Shared helpers

- `_security.js`
- `_supabaseTables.js`
- `_supabasePricing.js`
- `shared/adminAuth.js`
- `shared/leadWriter.js`

## Current Public Write And Read Paths

### Quote flow

Files:

- `apps/web-tsx/src/app/quote/page.tsx`
- `apps/web-tsx/public/quoteRuntime.js`
- `netlify/functions/calculate-quote.js`
- `netlify/functions/save-quote-request.js`

Current path:

1. Browser collects customer quote details.
2. Browser calls `/.netlify/functions/calculate-quote`.
3. Browser submits to `/.netlify/functions/save-quote-request`.
4. Function writes through Supabase service-role credentials and sends email where configured.

Public response should remain customer-safe and must not expose private pricing internals.

### Quote-review flow

Files:

- `apps/web-tsx/src/app/quote-review/page.tsx`
- `apps/web-tsx/public/quoteReviewReport.js`
- `netlify/functions/quote-review-ocr.js`
- `netlify/functions/save-quote-review.js`
- `netlify/functions/send-quote-review-email.js`

Current path:

1. Browser uploads a quote file or uses quick check.
2. OCR happens server-side.
3. Browser receives structured review output.
4. Save/email functions persist/send customer-safe review data.

Raw OCR text must remain out of browser, DOM datasets, analytics and local/session storage.

### Upload/floorplan flow

Files:

- `apps/web-tsx/src/app/floorplan/page.tsx`
- `apps/web-tsx/public/floorplanRuntime.js`
- `netlify/functions/upload-customer-file.js`

Current path:

1. Browser uploads through Netlify Function.
2. Function validates MIME, extension, signature and size.
3. Function writes object to Supabase Storage using service-role key.
4. Function writes metadata row.
5. Function returns safe upload metadata only.

Current safe response fields:

- `ok`
- `status`
- `safe_filename`
- `file_type`
- `file_size_bytes`
- `metadata_saved`
- `uploaded_file_id`

Browser must not receive `storage_bucket`, `file_path`, permanent public URL or signed URL by default.

### Chatbot lead flow

Files:

- `apps/web-tsx/public/chatbot/*`
- `apps/web-tsx/src/lib/chatbotLeadQualification.ts`
- `netlify/functions/save-chatbot-lead-event.js`

Current path:

1. Browser chatbot qualifies intent and safe project details.
2. Function validates allowlisted fields.
3. Function rejects transcripts, raw quote/OCR text, pricing/rate/margin fields, file contents, storage paths and obvious PII unless approved.
4. Function writes safe lead/event/qualification data server-side.

### Product/range flow

Files:

- `apps/web-tsx/public/products.js`
- `apps/web-tsx/public/preference-floors-import.js`
- `apps/web-tsx/public/productSelection.js`
- `netlify/functions/public-catalogue-pricing.js`
- `supabase/migrations/20260605_operon_product_ranges_seed.sql`

Current path:

1. Products page loads public catalogue and customer-safe product selection data.
2. Product/range/category handoff is stored locally and sent to quote page.
3. Public catalogue pricing endpoint reads Supabase server-side and returns customer-safe range data.

Public catalogue may include product/range names, colours, images and customer-safe price anchors, but not internal rate cards, margins or supplier costs.

## Current Upload And Storage Assumptions

Current code assumes:

- Default upload bucket is `quote-files`.
- Uploads are service-role function writes.
- Storage paths are randomised with UUIDs and source/quote context.
- Metadata rows can be linked to leads where a valid quote id exists.
- Buckets should be private.
- Signed URLs should be short-lived and internal/admin-only unless explicitly approved.

Verification still required in Supabase dashboard/SQL:

- `quote-files` bucket is private.
- `floorplan-files`, if used, is private.
- anon cannot list/read objects.
- anon direct insert is removed if all uploads are function-routed.

## Current Lead, Quote And Event Data Model

Current model:

- `operon_leads` is the Stage 3 parent lead table.
- `operon_lead_events` stores safe timeline records.
- `operon_lead_notes`, `operon_lead_files`, `operon_follow_ups`, `operon_floorplan_reviews`, `operon_lead_status_history` support internal operations.
- `operon_chatbot_qualifications` stores safe chatbot qualification summaries.
- `operon_quote_requests`, `operon_quote_rooms`, `operon_quote_items`, `operon_quote_reviews` and `operon_uploaded_files` hold detailed source records.

Gap:

- There is not yet a formal Quote OS quote version table.
- There is not yet a formal Quote OS line-item version table.
- There is not yet a site visit checklist table set.
- There is not yet a Quote OS job outcome table.
- Existing follow-up table exists as `operon_follow_ups`, while the architecture uses the clearer logical name `follow_up_tasks`.

## Current RLS And Grant Risks

Known from repo/docs:

- Stage 3 migrations intend RLS to be enabled and anon/authenticated grants revoked for new lead tables.
- Supabase advisor history previously flagged anon GraphQL/data exposure on lead/upload/quote/event tables.
- Storage bucket policy must be verified live, not assumed from repo migrations.

Risks:

1. New tables in public schema may be exposed by grants/Data API settings if RLS/grants are not locked down.
2. RLS without grant checks is not sufficient.
3. Views can bypass RLS unless created carefully.
4. Admin dashboard functions use service-role reads; public browser must never read these tables directly.
5. If direct browser Supabase writes reappear, strict RLS may break public flows.

Mitigation in draft:

- New tables enable RLS.
- New tables revoke all from `anon` and `authenticated`.
- New tables grant all to `service_role`.
- Verification SQL checks grants, policies, storage and GraphQL exposure.

## Current GraphQL And Anon Exposure Risks

Supabase GraphQL/Data API exposure depends on table grants and exposed schema configuration.

Risk categories:

- `operon_leads`, `operon_quote_requests`, `operon_uploaded_files`, `operon_quote_reviews`, `operon_lead_events`, `operon_quote_versions`, `operon_quote_line_items`, `operon_site_visits` and rate-card tables must not be anon-readable.
- `operon_product_ranges` may be used for public catalogue data only through a sanitising function; direct anon SELECT should remain avoided unless a public-safe view is deliberately designed.
- Private pricing/stair/rate-card tables should be service-role/admin-only.

The verification file includes `has_table_privilege` checks to surface any anon-readable relations.

## Missing Tables Required For Quote OS

| Logical table | Proposed physical table | Current status | Recommendation |
| --- | --- | --- | --- |
| leads | `operon_leads` | exists | Extend now with nullable site visit/proposal pointers only after approval |
| lead_events | `operon_lead_events` | exists | Use now |
| quote_requests | `operon_quote_requests` | exists in v2 mode | Extend now with current quote/site/proposal summary fields after approval |
| quote_versions | `operon_quote_versions` | missing | Create now in foundation migration |
| quote_line_items | `operon_quote_line_items` | missing | Create now in foundation migration |
| site_visits | `operon_site_visits` | missing | Create now in foundation migration |
| site_visit_rooms | `operon_site_visit_rooms` | missing | Create now in foundation migration |
| site_visit_photos | `operon_site_visit_photos` | missing | Create now in foundation migration |
| product_ranges | `operon_product_ranges` | exists | Hold structural changes; do not alter pricing behaviour now |
| private_rate_cards | `operon_private_rate_cards` | missing | Later; draft comments only |
| stair_pricing_profiles | `operon_stair_pricing_profiles` | missing | Later; existing `pricing_stair_rates` supports current flow |
| stair_profile_prices | `operon_stair_profile_prices` | missing | Later |
| range_stair_price_overrides | `operon_range_stair_price_overrides` | missing | Later |
| follow_up_tasks | `operon_follow_up_tasks` or existing `operon_follow_ups` | `operon_follow_ups` exists | Hold runtime wiring; draft table included but naming decision needed |
| job_outcomes | `operon_job_outcomes` | missing | Create now in foundation migration |

## Naming Conflicts And Migration Risks

### `operon_follow_ups` vs `operon_follow_up_tasks`

Existing functions read/write `operon_follow_ups`. The architecture names the logical model `follow_up_tasks`.

Recommendation:

- Do not switch runtime code yet.
- Either keep `operon_follow_ups` as the canonical table and treat `follow_up_tasks` as a UI label, or create `operon_follow_up_tasks` later and migrate deliberately.
- The draft includes `operon_follow_up_tasks` as a future foundation table but explicitly warns not to wire it until the naming decision is approved.

### Legacy vs v2 table mode

`_supabaseTables.js` can return legacy or v2 table names. Default is v2.

Risk:

- Any future function that hardcodes table names could bypass the mode switch.

Recommendation:

- New Quote OS functions should target `operon_` tables explicitly because they are private/admin-only.
- Public quote save functions should continue using `_supabaseTables.js` where they touch existing quote tables.

### Private pricing table timing

Existing pricing/stair support already exists through `_supabasePricing.js`, `operon_product_ranges`, `pricing_stair_rates` and old pricing-support tables.

Risk:

- Creating new private rate-card tables before parity tests may fragment pricing logic.

Recommendation:

- Hold private rate-card tables until the server-side pricing migration task.
- Add comments/placeholders only in this foundation draft.

## Function Impact Notes

### `upload-customer-file`

Eventually should:

- Continue returning only safe upload metadata.
- Link uploads to `operon_lead_files`.
- Link site-visit photos to `operon_site_visit_photos` when `site_visit_id` context exists.
- Keep bucket/path server-side only.

No immediate behaviour change required.

### Quote submit/save function

Function: `save-quote-request.js`

Eventually should:

- Continue creating/updating `operon_quote_requests`.
- Ensure `operon_leads` parent is created/linked.
- Optionally create initial `operon_quote_versions` only after internal quote versioning is approved.
- Avoid writing private calculation diagnostics to public-facing tables.

No immediate pricing change required.

### Quote-review save function

Function: `save-quote-review.js`

Eventually should:

- Link review records to `operon_leads`.
- Record lead event.
- Optionally flag follow-up task when quote-review shows missing scope.
- Avoid raw OCR text in lead events and browser responses.

### Chatbot/operator request functions

Functions:

- `save-chatbot-lead-event.js`
- `chatbot-lead-event.js`
- `operator-chat-request.js`

Eventually should:

- Continue writing safe structured events only.
- Link chatbot events to existing leads where dedupe context exists.
- Create dry-run follow-up tasks for contact_human/high-intent cases.
- Avoid raw transcript storage by default.

### Future `save-site-visit`

New admin-only function.

Responsibilities:

- Create/update `operon_site_visits`.
- Replace room rows safely.
- Link private photos by uploaded file id.
- Record lead events.
- Update lead `site_visit_status`, `current_site_visit_id` and `next_action`.

### Future `create-quote-version`

New admin-only function.

Responsibilities:

- Create immutable quote version and line items.
- Store customer-safe summary and admin-only notes.
- Record lead events.
- Update lead/quote request current version pointers.

### Future `calculate-internal-quote`

Current partial function: `calculate-private-quote.js`.

Eventually should:

- Require admin auth.
- Read site visit + quote request + private rate cards.
- Return internal diagnostics only to admin.
- Not be used by public pages.

### Future `generate-quote-proposal`

New admin-only function.

Responsibilities:

- Generate PDF/email proposal from an approved quote version.
- Use customer-safe labels and assumptions.
- Never include internal cost basis, margins, storage paths or raw OCR.

### Future `create-follow-up-task`

Current partial equivalents:

- `lead-followup-admin.js`
- `followup-admin.js`

Eventually should:

- Create dry-run task rows.
- No auto-send.
- Record lead event.
- Support mark done/snooze/archive.

## Privacy And Security Rules

The draft package follows these rules:

- Browser must never receive `storage_bucket`.
- Browser must never receive `file_path`.
- Browser must never receive permanent public upload URLs.
- Browser must never receive raw OCR text or uploaded file contents.
- Browser must never receive internal rates, margins, supplier costs, cost basis, access multipliers or private pricing formulas.
- Browser must never receive service-role keys, admin tokens or secrets.
- Public users submit safe input only through Netlify Functions.
- Admin/internal users can see operational data only after proper auth.
- Service-role writes must stay server-side.
- GraphQL/anon exposure must be verified before new tables are applied.
- Pricing engine should continue moving server-side, but formulas must not change in this foundation task.

## Draft Migration Objects

Draft file: `supabase/migrations/drafts/quote_os_foundation_draft.sql`

Objects drafted:

- Extend `operon_leads` with site/proposal/current quote pointers.
- Extend `operon_quote_requests` with current quote/site/proposal summary pointers.
- Extend `operon_uploaded_files` with retention metadata.
- Create `operon_site_visits`.
- Create `operon_site_visit_rooms`.
- Create `operon_site_visit_photos`.
- Create `operon_quote_versions`.
- Create `operon_quote_line_items`.
- Create `operon_follow_up_tasks`.
- Create `operon_job_outcomes`.
- Add indexes.
- Add updated-at trigger helper.
- Enable RLS on new tables.
- Revoke anon/authenticated access.
- Grant service-role access.
- Add later-stage comments for private rate-card/stair tables.

Private pricing tables are intentionally held back.

## Rollback Approach

Draft file: `supabase/migrations/drafts/quote_os_foundation_rollback_draft.sql`

Rollback strategy:

1. Drop FK constraints from existing tables to draft-created tables.
2. Drop new child tables in dependency order.
3. Leave existing production tables intact.
4. Leave existing-table column drops commented until the operator confirms they were created only by the draft and no runtime depends on them.
5. Drop the draft updated-at helper function.

This avoids accidentally dropping existing Stage 3 or production data tables.

## RLS And Grant Verification Approach

Draft file: `supabase/migrations/drafts/quote_os_rls_verification_queries.sql`

Verification covers:

- Operating table inventory and RLS status.
- Role grants for anon/authenticated/service_role.
- RLS policies on private/internal tables.
- `has_table_privilege` checks for anon SELECT/INSERT/UPDATE/DELETE.
- Sensitive column inventory for cost/rate/margin/storage/OCR/secret terms.
- Storage bucket privacy.
- Storage object policies.
- GraphQL/Data API exposure visibility.
- Public write path assumptions.

These queries are read-only and should be run before and after applying any future approved migration.

## Implementation Order

Recommended order:

1. Human reviews this report and draft SQL.
2. Run verification queries against production Supabase read-only.
3. Decide `operon_follow_ups` vs `operon_follow_up_tasks`.
4. If approved, apply a revised additive migration in a controlled Supabase change window.
5. Verify RLS/grants/storage/GraphQL.
6. Build `save-site-visit` admin-only function.
7. Build read-only site visit/quote version UI in admin shell.
8. Build `create-quote-version`.
9. Add proposal generation only after quote versioning is stable.
10. Keep private rate-card tables for the server-side pricing migration phase.

## Risks

- Adding new tables without live grant verification could create GraphQL/Data API exposure.
- Creating `operon_follow_up_tasks` while `operon_follow_ups` already exists may confuse future function routing.
- Adding quote versioning before internal pricing boundaries are final may duplicate calculation snapshots.
- Existing public pricing-support files still exist; this task does not remove them.
- Admin token auth is an MVP gate, not long-term role-based access control.
- Site visit photos require strict private storage and signed URL discipline.

## Deployment Requirement

No deployment is required for this task.

No build is required because only docs and draft SQL were created.

No Supabase migration should be applied until the draft is reviewed and approved.

## Next Safest Implementation Task

**Quote OS Task 1.2 - Read-Only Supabase Security Verification**

Goal:

- Run `supabase/migrations/drafts/quote_os_rls_verification_queries.sql` against the live project.
- Report only counts/status/policy names.
- Do not dump customer rows.
- Do not apply changes.

This should happen before any migration is approved, because it confirms whether the existing production security posture is ready for the Quote OS foundation tables.
