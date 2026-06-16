# Stage 3 Admin Function Gap Register

Purpose: prevent the internal dashboard from quietly depending on legacy admin endpoints before the unified operon_leads parent model is active.

Current local Function surfaces:
- `lead-dashboard.js` is the current protected read API for the Stage 3 dashboard MVP. It reads `operon_leads`, safe lead detail fields, safe event metadata, safe file metadata, reporting summary rows, and chatbot qualification rows.
- `lead-status-admin.js` is the current protected status-write API for the Stage 3 dashboard MVP.
- `lead-followup-admin.js` is the current protected manual follow-up queue API for the Stage 3 dashboard MVP.
- `admin-session-status.js` verifies the temporary admin-token shell.
- `lead-admin.js` exists as a legacy/local proof endpoint, but its list/update flow reads and patches the legacy quote request table through `getSupabaseTables().quoteRequests`.
- `followup-admin.js` exists as a legacy/local proof endpoint, but it reads the existing follow-up message and quote request tables.
- The TSX `/admin.html` shell now renders protected dashboard modules after token verification. It must not fetch `lead-admin.js` or `followup-admin.js` for the Stage 3 MVP.

Approved Stage 3 target:
- New dashboard read APIs should use operon_leads as the parent record.
- Lead detail APIs may join detail tables by lead_id.
- Existing quote/contact/review/upload writes should create or link operon_leads through server-side Netlify Functions.
- Admin browser access must go through protected Functions, never direct Supabase reads.

Resolved local gap:
- `lead-dashboard.js` replaced `lead-admin.js` as the local Stage 3 lead-list/detail/reporting/chatbot read API.
- The admin shell points to component modules that call `lead-dashboard`, `lead-status-admin`, and `lead-followup-admin` only after token verification.

Remaining live gap:
- The `operon_chatbot_qualifications` table used by the chatbot lead panel must exist in the target Supabase project before that panel is enabled in live preview/production.
- `lead-admin.js` and `followup-admin.js` should remain out of the Stage 3 MVP UI unless they are retired or migrated.

Risk if ignored:
- The dashboard could show only quote request rows and miss contact, quote-review, floorplan, upload, product handoff, and chatbot/operator leads.
- Operators could assume the internal OS is complete while non-quote leads are invisible.

Guardrail:
- Do not wire the /admin shell to lead-admin.js for the Stage 3 MVP unless the Function is first updated to read operon_leads.
- Keep `lead-admin.js` and `followup-admin.js` as legacy/proof endpoints only.
- Do not expose direct browser Supabase reads for dashboard data.
- Keep /admin.html noindex,nofollow and out of sitemap.

Recommended next Function design:
- lead-admin-read.js or an updated lead-admin.js should support:
  - list leads from operon_leads
  - filter by status, primary_source, suburb, product_category, next_action
  - detail by lead_id with joined safe events, notes, files, quote review status, floorplan status, and quote summary fields
  - safe pagination limits
  - no storage bucket/path, raw OCR text, internal rates, supplier costs, margins, or service credentials

Compatibility note:
- followup-admin.js can remain separate for dry-run follow-up queue work, but any customer/contact lead context should eventually resolve through lead_id.
