# Task A2 Tracking Write Decision

Purpose: choose the safest path for removing browser-side Supabase tracking writes before strict RLS/GraphQL hardening.

Current browser tracking behavior:
- `tracking.js` keeps same-device funnel/session state in `sessionStorage` and `localStorage`.
- `tracking.js` sends GA4 events through `window.gtag` using `sanitizeAnalyticsParams(...)`.
- Direct browser Supabase tracking writes have been removed locally in Task A2 Phase 2.

Removed direct browser tracking targets:
- `quote_funnel_sessions`
- `quote_events`

Decision:
- Prefer analytics-only plus server-side revenue events from existing Functions for the next removal step.
- Do not add a high-volume `track-event` Netlify Function yet.
- Keep GA/local storage behavior if useful for customer UX and local same-device recovery.
- `sendToSupabase(...)` browser writes are removed locally; production still requires approved preview QA.

Why:
- High-volume event Functions can increase cost, logs, and operational noise before dashboard reporting requirements are clear.
- Revenue-path Functions already create durable events for important submissions: quote, contact, quote review, operator request, and upload link events.
- Removing browser Supabase tracking writes reduces anon table permissions and GraphQL exposure pressure without changing customer-facing UX.

Revenue events that should remain server-side:
- `quote_submitted`
- `quote_emailed`
- `quote_draft_saved`
- `contact_submitted`
- `quote_review_saved`
- `operator_request_submitted`
- upload file linked to an existing lead context

Customer-safe browser analytics that may remain:
- `quote_started`
- `quote_step_completed`
- `product_selected`
- `product_to_quote`
- `quote_review_started`
- `quote_review_completed`
- `floorplan_uploaded`
- `floorplan_to_quote`
- `contact_form_started`

Do not send to analytics or browser storage:
- raw OCR text
- uploaded file contents
- storage bucket/path/signed URLs
- internal rates, supplier costs, margins, pricing rules, or access multipliers
- full customer message bodies
- service keys or admin tokens

Implementation acceptance:
1. `tracking.js` no longer calls `sendToSupabase("quote_funnel_sessions", ...)`.
2. `tracking.js` no longer calls `sendToSupabase("quote_events", ...)`.
3. `sendToSupabase(...)` and `getSupabaseConfig()` are removed from public tracking runtime.
4. `window.operonTrack(...)` and GA4 event aliases remain customer-safe.
5. Local funnel state remains if needed for same-device UX, but it must not include raw OCR text, uploaded file content, storage paths, or private pricing fields.
6. `directBrowserSupabaseInventory.test.js` is updated to expect zero direct browser write targets.

Preview acceptance:
- Quote submit still works.
- Product handoff still works.
- Floorplan handoff still works.
- Quote-review handoff and email still work.
- Contact form still works.
- GA/browser tracking does not block UX if unavailable.
- Public leak and source map probes still pass.

Rollback:
- Restore previous `tracking.js` Supabase write block only if an approved preview shows a required dashboard/reporting dependency was lost.
- Do not restore broad anon SELECT/GraphQL access for tracking tables.
