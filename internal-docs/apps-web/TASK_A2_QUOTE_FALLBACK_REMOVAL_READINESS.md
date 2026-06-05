# Task A2 Quote Fallback Removal Readiness

Purpose: record the server Function readiness and local removal status for direct browser Supabase quote writes from `quoteRuntime.js`.

Current preferred path:
- Draft saves call `/.netlify/functions/save-quote-request` with `mode: "draft"`.
- Final submits call `/.netlify/functions/save-quote-request` with `mode: "submit_quote"`.
- Email-copy sends call `/.netlify/functions/save-quote-request` with `mode: "email_quote"`.

Server Function capabilities already present:
- `save-quote-request` accepts `draft`, `submit_quote`, and `email_quote` modes.
- Draft and submit paths upsert the quote request by `id`.
- Draft and submit paths call `replaceChildRows(...)` to write room and line-item detail rows server-side.
- Submit path queues follow-ups and sends customer/internal quote emails through server-side logic.
- Public success responses return customer-safe fields only: `ok`, `mode`, `quoteId`, `quoteReference`, email flags, and follow-up flags.
- Public responses must not return `lead_id`, storage bucket/path, signed URLs, raw payload, internal rates, supplier costs, margins, or pricing table names.

Quote fallback removal status:
- Removed locally: `saveQuoteRequest(payload)` direct browser write to `quote_requests`.
- Removed locally: `saveQuoteRooms(quoteId, rooms)` direct browser write to `quote_rooms`.
- Removed locally: `saveQuoteItems(quoteId, items)` direct browser write to `quote_items`.
- No `.from("quote_requests")`, `.from("quote_rooms")`, or `.from("quote_items")` direct browser writes remain in `quoteRuntime.js`.
- `directBrowserSupabaseInventory.test.js` now blocks direct browser write targets in the checked quote/tracking public runtimes.
- Tracking direct writes were removed locally in Phase 2.
- Public `window.OPERON_SUPABASE_CONFIG` was removed locally in Phase 3.

Required preview QA before production:
1. Confirm preview quote submit path returns 200 through `save-quote-request`.
2. Confirm product, floorplan, and quote-review handoffs still submit through `save-quote-request`.
3. Ensure quote failure copy remains customer-safe if the Function path fails.
4. Confirm browser storage does not gain `lead_id`, storage path, raw payload, or internal pricing fields.
5. Confirm public runtime does not expose `OPERON_SUPABASE_CONFIG`, public Supabase project ref, anon key, or quote-files bucket name.

Rollback:
- Restore the previous quoteRuntime fallback block if preview quote submit fails after removal.
- Do not apply strict RLS/GraphQL hardening until the no-direct-browser-write contract passes.
