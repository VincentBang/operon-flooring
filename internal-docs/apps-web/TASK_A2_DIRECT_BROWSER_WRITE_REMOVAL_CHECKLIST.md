# Task A2 Direct Browser Write Removal Checklist

Date: 2026-06-04

Purpose: convert the remaining browser Supabase writes into server-side or analytics-only paths without breaking quote conversion. This is an implementation checklist only; it does not approve a deploy or production change.

## Non-Negotiables

- No production deploy without explicit approval.
- No Netlify draft deploy unless browser/runtime verification is explicitly approved.
- No pricing, rate, product catalogue, quote calculation, floorplan geometry, quote-review OCR/email, upload, chatbot, or backend behavior changes outside the direct-write removal scope.
- Do not apply strict RLS/GraphQL hardening until the no-direct-browser-write contract passes.
- Do not remove public Supabase browser config until quote fallback writes and tracking writes are both removed or function-routed.
- Do not expose `lead_id`, storage bucket/path, signed URLs, raw OCR text, internal rates, supplier costs, margins, access multipliers, or debug fields in browser responses.

## Current Direct Browser Write Baseline

Known direct browser writes remain in:

- none in the checked quote/tracking public runtimes

The current inventory test now blocks direct browser write targets in the checked quote/tracking public runtimes.

## Preconditions Before Any Runtime Edit

Run locally:

```bash
npm run build --prefix apps/web-tsx
npm run test:local-gates
git diff --check
```

Confirm before editing:

- `save-quote-request` still supports `mode: "draft"`.
- `save-quote-request` still supports `mode: "submit_quote"`.
- `save-quote-request` still supports `mode: "email_quote"`.
- Quote upload returns only `uploaded_file_id` plus safe display metadata.
- Contact, quote-review, upload, product handoff, floorplan handoff, and quote-review handoff paths are not being changed in the same patch.

## Phase 1: Remove Quote Runtime Direct Table Fallback

Status: completed locally, pending preview QA before production.

Target file:

- `apps/web-tsx/public/quoteRuntime.js`

Remove or disable these direct Supabase anon writes:

- `saveQuoteRequest(payload)` calling `.from("quote_requests")`
- `saveQuoteRooms(quoteId, rooms)` calling `.from("quote_rooms")`
- `saveQuoteItems(quoteId, items)` calling `.from("quote_items")`

Keep:

- `saveQuoteDraftToNetlify(payload)`
- `submitLeadToNetlifyForm(leadPayload, submitPayload)`
- `sendQuoteEmailCopy(payload, emailTo)`
- customer-safe error copy if the server Function fails
- existing quote summary and submit behavior

Do not add:

- new browser storage of `lead_id`
- storage bucket/path
- private pricing fields
- raw quote payload echoes
- debug fallback output

After Phase 1, `directBrowserSupabaseInventory.test.js` is updated from five known writes to two known tracking writes. It should fail if `.from("quote_requests")`, `.from("quote_rooms")`, or `.from("quote_items")` returns.

Phase 1 QA:

- House, hybrid, 60m2, no extras.
- Apartment, laminate, 45m2, access notes.
- Engineered timber, 80m2, stairs.
- Carpet removal with disposal.
- Product not sure.
- Area not sure.
- Product page handoff to quote.
- Floorplan handoff to quote.
- Quote-review handoff to quote.
- Final contact fields and email copy.
- `save-quote-request` returns 200 for submit.
- Customer/internal email flags remain customer-safe.

## Phase 2: Remove Tracking Direct Supabase Writes

Status: completed locally, pending preview QA before production.

Target file:

- `apps/web-tsx/public/tracking.js`

Preferred path:

- Keep `window.operonTrack(...)`.
- Keep GA4/customer-safe analytics aliases.
- Keep local same-device funnel state if useful.
- Remove or disable `sendToSupabase("quote_funnel_sessions", ...)`.
- Remove or disable `sendToSupabase("quote_events", ...)`.
- Do not add a high-volume `track-event` Netlify Function yet.
- Rely on existing revenue Functions for server-side lead/revenue events until reporting needs are clearer.

After Phase 2, `directBrowserSupabaseInventory.test.js` is updated from two known tracking writes to a blocking no-direct-browser-write contract.

Use `TASK_A2_NO_DIRECT_BROWSER_WRITE_ACCEPTANCE_CONTRACT.md` as the acceptance target when replacing the current inventory baseline.

The no-direct-browser-write contract should fail on:

- `sendToSupabase("quote_funnel_sessions"`
- `sendToSupabase("quote_events"`
- `.from("quote_`
- `.from("operon_`
- `createClient(` in public browser runtime, except documented read-only false positives if any remain

Phase 2 QA:

- GA/customer-safe events still fire where available.
- Quote flow still works if analytics is unavailable.
- Contact, quote-review, product, and floorplan flows do not depend on tracking writes.
- No raw OCR text, uploaded file contents, storage paths, internal pricing fields, or full customer message bodies enter analytics payloads.

## Phase 3: Remove Public Supabase Browser Config

Status: completed locally, pending preview QA before production.

- Remove public runtime dependency on `window.OPERON_SUPABASE_CONFIG`.
- Remove unused browser Supabase client helpers.
- Confirm public runtime no longer needs anon table writes.
- Keep Supabase service-role usage server-side in Netlify Functions only.

After Phase 3, `quoteRuntime.js` no longer publishes the Supabase project ref, anon config object, anon key, or quote-files bucket name to `window.OPERON_SUPABASE_CONFIG`.

Verification:

```bash
rg "OPERON_SUPABASE_CONFIG|createClient\\(|sendToSupabase\\(|\\.from\\(" apps/web-tsx/public
```

Expected result: no direct browser write path, or only documented customer-safe false positives.

## Phase 4: Strict RLS And GraphQL Hardening

Only after no-direct-browser-write contract passes:

- Revoke remaining anon INSERT/UPSERT policies for quote/funnel/event tables that are no longer needed.
- Confirm anon GraphQL cannot select lead, quote, upload, or event tables.
- Confirm storage remains private with no anon list/read.
- Confirm service-role Function writes still create quote/contact/review/upload records.

## Rollback

- Phase 1 rollback: restore the prior `quoteRuntime.js` fallback block if preview proves quote submit is broken.
- Phase 2 rollback: restore best-effort tracking writes only if analytics/business reporting requires it and RLS still permits it.
- Phase 3 rollback: restore public config only if a documented browser feature still needs it.
- Never apply strict RLS in the same change as fallback removal.

## Required Final Checks

Run locally:

```bash
npm run build --prefix apps/web-tsx
npm run test:local-gates
git diff --check
```

Browser/runtime preview QA requires explicit approval before any Netlify draft deploy.
