# Stage 3 Admin Function Gap Register

Purpose: prevent the internal dashboard from quietly depending on legacy admin endpoints before the unified operon_leads parent model is active.

Current local Function surfaces:
- lead-admin.js exists, but its list/update flow currently reads and patches the legacy quote request table through getSupabaseTables().quoteRequests.
- followup-admin.js exists, but it currently reads the existing follow-up message and quote request tables.
- The TSX /admin shell remains static and locked. It does not fetch lead-admin.js or followup-admin.js.

Approved Stage 3 target:
- New dashboard read APIs should use operon_leads as the parent record.
- Lead detail APIs may join detail tables by lead_id.
- Existing quote/contact/review/upload writes should create or link operon_leads through server-side Netlify Functions.
- Admin browser access must go through protected Functions, never direct Supabase reads.

Gap:
- lead-admin.js is not yet the final Stage 3 lead-list/detail API.
- It should not be used as the source of truth for the new dashboard until it is migrated to operon_leads or replaced by a new protected read Function.

Risk if ignored:
- The dashboard could show only quote request rows and miss contact, quote-review, floorplan, upload, product handoff, and chatbot/operator leads.
- Operators could assume the internal OS is complete while non-quote leads are invisible.

Guardrail:
- Do not wire the /admin shell to lead-admin.js for the Stage 3 MVP unless the Function is first updated to read operon_leads.
- Do not expose direct browser Supabase reads for dashboard data.
- Keep /admin noindex,nofollow and static until the protected operon_leads read contract is approved.

Recommended next Function design:
- lead-admin-read.js or an updated lead-admin.js should support:
  - list leads from operon_leads
  - filter by status, primary_source, suburb, product_category, next_action
  - detail by lead_id with joined safe events, notes, files, quote review status, floorplan status, and quote summary fields
  - safe pagination limits
  - no storage bucket/path, raw OCR text, internal rates, supplier costs, margins, or service credentials

Compatibility note:
- followup-admin.js can remain separate for dry-run follow-up queue work, but any customer/contact lead context should eventually resolve through lead_id.
