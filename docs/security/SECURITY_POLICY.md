# Operon Flooring Security Policy

This policy protects customer data, uploaded files, quote logic, email endpoints, analytics, AI processing, Supabase data and future admin workflows. Read it before editing quote, upload, storage, email, OpenAI, analytics, admin or security-sensitive code.

## 1. Threat Model

Primary risks:

- Customer data exposure: names, phone numbers, emails, addresses, quote notes and project details.
- Uploaded file exposure: floor plans, written quotes, invoices, images and extracted document text.
- Secret leakage: OpenAI, Resend, Supabase service role, admin tokens and webhook secrets.
- Abuse of endpoints: quote submission spam, email endpoint abuse, OCR/file-processing abuse and admin endpoint probing.
- Pricing logic exposure: labour, material, stair, removal, underlay, margin and location adjustment logic.
- XSS: uploaded/extracted text, customer notes, file names, quote text or admin data inserted as HTML.
- Analytics leakage: personal data, raw quote payloads, file names, extracted text or internal pricing sent to GA4.
- Admin workflow compromise: weak tokens, shared accounts, excessive permissions or no audit trail.

## 2. Data Classification

- Public: static page copy, customer-safe product names, broad service areas and general guide content.
- Customer personal data: name, phone, email, site address, suburb/postcode when tied to an enquiry, notes and access details.
- Customer project data: product choices, area, stairs, removal, floor prep, underlay, acoustic/access risks and quote scope.
- Sensitive customer files: uploaded floor plans, written quotes, invoices, images and OCR/extracted text.
- Internal commercial data: pricing formulas, labour rates, margins, supplier costs, adjustment rules and lead scoring logic.
- Secrets: API keys, service-role keys, admin tokens, OAuth tokens, webhook secrets and SMTP/provider credentials.

## 3. Secret Handling Rules

- Never put OpenAI, Resend, Supabase service role, admin tokens or webhook secrets in frontend HTML or public JavaScript.
- Use Netlify/Supabase environment variables for secrets.
- Use Supabase anon keys only for customer-safe browser operations protected by RLS and storage policies.
- Do not log secrets, request headers or full provider responses that may include tokens.
- If a real secret is committed or appears in frontend code, rotate it immediately and remove it from git history if needed.
- Keep `.env` and `.env.*` ignored. Commit only `.env.example` files with placeholder values.

## 4. File Upload Rules

- Allowed file types: PDF, JPG, JPEG, PNG and WEBP only unless a specific security review approves more.
- Enforce max file size on client and server. Current online review target: 6 MB.
- Validate extension, MIME type and file signature/magic bytes where server-side processing exists.
- Reject executable/script formats, SVG, HTML, JavaScript, archives and Office documents for customer uploads.
- Randomise server-side storage paths. Do not trust or use original file names for storage paths.
- Store uploads in private buckets only. Do not expose customer uploads through public URLs.
- Use signed URLs with short expiry only when a backend workflow explicitly needs temporary access.
- Render OCR/extracted text with `textContent` or escaped HTML only.
- Never execute uploaded content or render uploaded SVG/HTML inline.
- Delete uploaded files according to retention rules when backend retention tooling supports it.

## 5. Supabase RLS and Storage Rules

- RLS must be enabled for quote, review, uploaded file, event, lead and admin tables.
- Anonymous users may insert customer submissions only where required.
- Anonymous users must not select/list all quote requests, quote reviews, uploaded files, leads, admin data or pricing optimisation data.
- Supabase service role may be used server-side only in Netlify or Supabase functions.
- Storage buckets for customer uploads must be private.
- Anonymous storage policies may allow insert only into the intended private bucket and must not allow select/list/update/delete.
- Admin read/update workflows must use server-side functions plus an admin token or authenticated role.

## 6. Netlify Function Rules

- Restrict HTTP methods. Use POST for writes and GET only for read endpoints that are intentionally read-only.
- Validate JSON bodies and expected fields. Reject oversized bodies and files.
- Use safe CORS. Avoid `*` for admin endpoints where possible.
- Do not return stack traces, provider internals, secrets or raw customer payloads to users.
- Do not log full request bodies, uploaded file contents, raw OCR text, customer notes or secrets.
- Email functions must not allow arbitrary recipient lists. They may email the customer tied to the request and approved Operon internal addresses.
- OpenAI calls must be server-side only.
- High-abuse functions must use durable rate limiting and, where customer-facing, Turnstile bot protection. See `docs/security/BOT_AND_RATE_LIMIT_SETUP.md`.

## 7. Analytics Privacy Rules

GA4 Measurement ID: `G-T2LEXZJM3Q`.

Allowed analytics data:

- page
- step index/name
- product category
- quote mode
- area method
- confidence level
- review required true/false
- missing scope count
- file uploaded true/false
- source/event context

Never send to GA4:

- name, phone, email or full address
- customer notes or messages
- uploaded quote/floorplan content
- file names if they may identify a customer or address
- raw OCR text
- raw quote payloads
- internal prices, rates, margins, formulas or supplier costs

## 8. Email Sending Rules

- Resend API keys must remain server-side.
- Email functions must validate recipient intent and avoid arbitrary public relay behaviour.
- Customer emails should include only customer-safe estimate language and no internal formulas.
- Internal emails may contain lead details needed for follow-up but should not include secrets.
- Avoid logging full rendered email content when it contains personal data.

## 9. Pricing Logic Exposure Rules

- Public frontend calculators are allowed as MVP fallback but should not expose margins, labour assumptions or sensitive supplier logic long term.
- Private Netlify pricing should become the primary calculator for real quote requests.
- Frontend should receive customer-safe estimate totals, scope assumptions and confidence only.
- Internal diagnostics, payload dumps, runtime details and rate tables must not be shown to customers.

## 10. Admin Access Rules

- Admin dashboards must not be public data views. Use an admin token or authenticated role.
- Admin token values must be long, random, stored only in Netlify/Supabase secrets and rotated if shared.
- Do not store admin tokens in localStorage. Session storage is acceptable for temporary browser use, but a real auth layer is preferred.
- Founder/team workflows should move to least-privilege authenticated accounts before scaling.

## 11. Retention Rules

- Quote leads may be retained for business operations and customer follow-up.
- Uploaded quote files should be deleted after 30-90 days unless converted to a job, required for dispute/support, or the customer consents to longer retention.
- Floor plan uploads should be deleted after 30-90 days unless needed for an active job.
- Raw OCR text should be minimised and retained only where useful for quote review support.
- Structured extraction may be retained where it supports quoting, scope clarity and operational improvement.
- Analytics must not contain personal data.

## 12. Incident Response Checklist

1. Identify affected system: frontend, Netlify function, Supabase table/storage, email provider, OpenAI or analytics.
2. Stop active leakage: disable endpoint, revoke token, tighten RLS/policy or remove public object access.
3. Preserve evidence safely: timestamps, affected paths, logs without spreading secrets.
4. Rotate exposed secrets immediately.
5. Review affected customer records/files and exposure window.
6. Notify required parties if customer personal data was exposed.
7. Patch code and policies.
8. Add regression test/checklist item.
9. Record root cause and prevention action.

## 13. Security QA Checklist

- No real secrets in frontend, docs or committed env files.
- GA4 loads once and does not receive personal data.
- Uploads reject unsupported types and oversized files.
- Server upload endpoints validate extension, MIME and magic bytes where available.
- Uploaded files are private and not publicly listable/readable.
- Admin endpoints require a configured token/auth layer.
- Netlify functions restrict methods and return safe errors.
- User-provided/extracted text is escaped or rendered with `textContent`.
- Quote flow, quote review, floorplan and product pages still work after security changes.
- Pricing formulas were not changed during security-only work.
