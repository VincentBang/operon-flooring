# Task A2 Direct Browser Supabase Function-Route Plan

Date: 2026-06-04

Goal: remove remaining direct browser Supabase writes without breaking quote/contact/review/floorplan/product behavior.

Implementation sequence: use `TASK_A2_DIRECT_BROWSER_WRITE_REMOVAL_CHECKLIST.md` as the controlling checklist before editing runtime code.

## Scope

Known remaining direct browser writes:

- none in the checked quote/tracking public runtimes

## Phase 1: Quote Runtime Fallback

Quote Runtime Fallback Status: removed locally.

- Preferred submit path uses `/.netlify/functions/save-quote-request`.
- Legacy fallback no longer writes directly from browser using Supabase anon config.

Exact runtime locations:

- `saveQuoteDraftToNetlify(payload)` already posts drafts to `/.netlify/functions/save-quote-request`.
- `submitLeadToNetlifyForm(leadPayload, submitPayload)` already posts final submits to `/.netlify/functions/save-quote-request`.
- No `.from("quote_requests")`, `.from("quote_rooms")`, or `.from("quote_items")` direct browser writes remain in `quoteRuntime.js`.

Production requirement:

- Run approved draft preview proving server function submit is stable.
- Keep customer-facing error copy if the primary Function call fails.
- Do not add `lead_id`, storage paths, internal pricing fields, raw payload, or debug details to browser responses.

Tests before production:

- Quote submit success with valid payload.
- Quote submit failure displays customer-safe error.
- Product handoff still submits.
- Floorplan handoff still submits.
- Quote-review handoff still submits.
- No `.from("quote_requests")`, `.from("quote_rooms")`, `.from("quote_items")` remain in public runtime.

Implementation acceptance:

- `quoteRuntime.js` no longer needs `operonSupabase` for quote saving.
- `saveQuoteRequest`, `saveQuoteRooms`, and `saveQuoteItems` have been removed from `quoteRuntime.js`.
- Final submit still uses the existing `save-quote-request` Function contract.
- Draft save still uses `mode: "draft"` on the existing Function contract.
- Quote file upload still receives only `uploaded_file_id` and safe display metadata.
- Public response shape remains customer-safe.

## Phase 2: Tracking Writes

Tracking Write Status: removed locally.

Current:

- Tracking stores local funnel state.
- Tracking sends customer-safe GA events where `window.gtag` is available.
- Tracking no longer attempts direct Supabase writes with anon key.
- No `sendToSupabase("quote_funnel_sessions", ...)` or `sendToSupabase("quote_events", ...)` direct browser writes remain in `tracking.js`.

Former table targets:
  - `quote_funnel_sessions`
  - `quote_events`

Options for future server tracking, if needed:

1. Function-route tracking:
   - Add `track-event` Function.
   - Accept customer-safe event payload.
   - Validate/sanitize metadata server-side.
   - Write to tracking/event table with service role.

2. Analytics-only:
   - Disable Supabase tracking writes.
   - Keep Google Analytics and localStorage summary.
   - Add server-side events only for revenue actions through existing Functions.

Recommendation:

- Start with analytics-only or server events from existing revenue Functions.
- Avoid a high-volume tracking Function until reporting requirements are clear.

Implementation acceptance if analytics-only is selected:

- Keep localStorage funnel state if still useful for same-device UX.
- Keep Google Analytics events with the existing sanitized parameter allowlist.
- Remove or disable `sendToSupabase(...)` network writes from the browser.
- No public page should need `window.OPERON_SUPABASE_CONFIG` for tracking.

Implementation acceptance if a `track-event` Function is selected:

- Validate event name against an allowlist.
- Sanitize metadata server-side.
- Reject raw OCR text, uploaded file contents, storage paths, internal pricing fields, supplier costs, margins, and customer message bodies.
- Rate-limit or deduplicate high-volume events.
- Do not let tracking failure block quote/contact/review/upload customer flows.

## Phase 3: Remove Public Supabase Anon Config

Public Supabase Anon Config Status: removed locally.

After quote fallback and tracking writes no longer need anon Supabase:

- Remove public anon config from `quoteRuntime.js`.
- Remove any remaining browser dependency on `window.OPERON_SUPABASE_CONFIG`.
- Remove `window.OPERON_SUPABASE_CONFIG` dependency where possible.
- Keep Supabase calls server-side in Netlify Functions.

Local implementation:

- `quoteRuntime.js` no longer publishes `window.OPERON_SUPABASE_CONFIG`.
- `quoteRuntime.js` no longer publishes the browser Supabase project ref, anon key, or quote-files bucket name.
- `tracking.js` does not require public Supabase config.

Verification:

- `rg "OPERON_SUPABASE_CONFIG|createClient\\(|sendToSupabase\\(|\\.from\\(\\\"quote_" apps/web-tsx/public` returns only documented false positives or no direct write paths.
- `directBrowserSupabaseInventory.test.js` now blocks direct browser write targets.
- Strict RLS migration is not applied until this no-direct-write contract passes.

## Phase 4: Strict RLS

Only after browser writes are gone:

- Revoke remaining anon INSERT/UPSERT policies for quote/funnel tables where no longer needed.
- Confirm anon GraphQL no longer exposes lead/quote/upload/event tables.
- Keep service-role Function writes.

## Preview QA

- Full quote flow.
- Product handoff.
- Floorplan handoff.
- Quote-review handoff.
- Contact form.
- Quote-review quick/save/upload/email.
- Public leak probes.
- Source map probes.
- Direct anon REST probes.
- Direct browser storage inspection.

## Rollback

- Restore previous runtime fallback code if quote submit fails.
- Do not apply strict RLS until function-routed behavior passes preview.
- Keep current production deploy as rollback candidate for any production attempt.
