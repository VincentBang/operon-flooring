# Direct Browser Supabase Write Inventory

Date: 2026-06-04

Purpose: identify remaining browser-side Supabase writes before strict RLS/GraphQL hardening and server-side pricing migration.

## Summary

No direct browser Supabase write targets remain in the checked public runtimes.

The public Supabase browser config previously published by `quoteRuntime.js` has also been removed locally in Task A2 Phase 3. Preview QA is still required before production because the quote runtime now relies on server Function paths for quote saves, uploads, and lead writes.

## Browser Write Paths

Current exact direct browser write baseline:

- none

`directBrowserSupabaseInventory.test.js` is intentionally strict: a new direct browser write target should fail the local gate until Task A2 is updated and approved.

## Public Supabase Browser Config

Status: removed locally in Task A2 Phase 3.

Removed public browser config:

- `window.OPERON_SUPABASE_CONFIG`
- public runtime Supabase project ref
- public runtime Supabase anon key
- public runtime quote-files bucket name

Current behavior:

- Quote, upload, review, contact, and tracking writes use Netlify Functions or customer-safe analytics/local state.
- Browser runtime does not initialize Supabase for lead, quote, upload, or tracking writes.

### `quoteRuntime.js` quote fallback writes

Status: removed locally in Task A2 Phase 1.

Removed direct browser writes:

- `quote_requests`
- `quote_rooms`
- `quote_items`

Current behavior:

- Draft saves use `/.netlify/functions/save-quote-request` with `mode: "draft"`.
- Final submits use `/.netlify/functions/save-quote-request` with `mode: "submit_quote"`.
- Email copy uses server-side Function paths.
- No `.from("quote_requests")`, `.from("quote_rooms")`, or `.from("quote_items")` direct browser writes remain in `quoteRuntime.js`.

Risk:

- Preview QA is still required before production because quote submission now depends fully on the Function path.

Recommended action before production:

- Run approved draft preview quote submit scenarios.
- Verify product, floorplan, and quote-review handoffs submit through `save-quote-request`.
- Keep quote submission function-routed only.

### `tracking.js` funnel/session writes

Status: removed locally in Task A2 Phase 2.

Removed direct browser writes:

- `quote_funnel_sessions`
- `quote_events`

Current behavior:

- `tracking.js` keeps same-device funnel/session state in `sessionStorage` and `localStorage`.
- `tracking.js` sends GA4 events through `window.gtag` using `sanitizeAnalyticsParams(...)`.
- No `sendToSupabase("quote_funnel_sessions", ...)` or `sendToSupabase("quote_events", ...)` direct browser writes remain in `tracking.js`.

Risk:

- Preview QA is still required before production because analytics/reporting behavior changed from Supabase-plus-GA to GA/local-only.

Recommended action before production:

- Verify GA/local tracking does not block customer UX.
- Rely on Google Analytics/local storage until dashboard analytics requirements are clearer.
- Ensure tracking never sends raw OCR text, uploaded file content, storage paths, or internal pricing fields.

## Already Function-Routed Paths

These are already server-routed in the TSX app:

- `calculate-quote`
- `save-quote-request`
- `contact-enquiry`
- `save-quote-review`
- `send-quote-review-email`
- `upload-customer-file`
- `quote-review-ocr`
- `operator-chat-request`

## RLS Implication

Strict anon revocation is safe only after:

1. Direct quote fallback writes remain removed.
2. Tracking writes remain removed or disabled.
3. Public browser no longer relies on anon Supabase writes for revenue paths.

## Recommended Next Task

Task A2:

- Run approved preview QA with no direct browser write targets.
- Then decide whether to remove public Supabase browser config in Phase 3.

No code change should be made without a local contract test and preview QA.
