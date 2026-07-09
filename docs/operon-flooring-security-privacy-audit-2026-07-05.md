# Operon Flooring Security And Privacy Audit - 2026-07-05

## Summary

No critical public file leak was found in this pass. Public leak checks and source-map probes passed.

Remaining risks are mostly architectural:

- public pricing-support/catalogue JavaScript still exists;
- some public JS comments/knowledge strings mention internal-pricing concepts as policy text;
- admin/internal pages are discoverable but protected by token/function checks;
- Supabase RLS and GraphQL posture should continue to be verified after schema changes.

No secrets were printed or stored in this report.

## Public Probe Results

| Probe | Status |
| --- | ---: |
| `/_next/static/chunks/main-app.js.map` | 404 |
| `/_next/static/css/app.css.map` | 404 |
| `/.env` | 404 |
| `/.git/config` | 404 |
| `/package.json` | 404 |
| `/netlify.toml` | 404 |
| `/internal-qa/` | 404 |

`npm run check:public-leaks` passed.

## Public Output Search Findings

Search terms checked included:

- `service_role`
- `SUPABASE_SERVICE_ROLE`
- `storage_bucket`
- `file_path`
- `raw OCR`
- `extractedText`
- `supplier cost`
- `margin`
- `private rate`
- `pricing formula`
- `internal pricing`
- `install rates`
- `stair rates`
- `uploaded file paths`

Important results:

| Finding | Classification | Notes |
| --- | --- | --- |
| `margin` appears widely | False positive | Mostly CSS `margin`, not commercial margin data. |
| `internal pricing` in `chatbotKnowledgeIndex.js` | Low | Customer-facing policy/guardrail string says not to expose internal pricing logic. Not a rate leak. |
| `private rate tables` in `pricingSourceConfig.js` comment | Low/Medium | Public JS comment references private rate tables. Not a secret, but should be removed/minified in a cleanup pass. |
| Service-role env var names in Netlify Functions | Expected server-side source | Env names are in repo source, not values. Do not expose actual values. |
| `file_path` / `storage_bucket` in internal functions | Expected server-side | Used for internal streaming and metadata, not public output by default. |

## Upload Flow

`netlify/functions/upload-customer-file.js` currently returns a customer-safe upload response:

- `ok`
- `status`
- `safe_filename`
- `file_type`
- `file_size_bytes`
- `metadata_saved`
- `uploaded_file_id`

It does not return `storage_bucket` or `file_path` in the response shown by the current source.

Server-side metadata still stores storage path and bucket, which is expected for internal review and file retrieval. That data must remain server/admin only.

## Quote Review OCR Flow

`netlify/functions/quote-review-ocr.js` returns:

- browser-safe OCR result via `buildBrowserSafeOcrResult`
- structured fields with raw quote text stripped
- safe comparison/report fields
- file hash reference only

Current source does not return raw `extractedText` directly to the browser response. Raw OCR text is still used server-side during extraction and comparison, which is expected.

## Admin/Internal Routes

Known admin/internal routes:

- `/admin.html`
- `/internal/floorplan-measurements.html`

Risk:

- URLs are discoverable in static output.
- Access must remain token-protected and server-side data must be returned only through protected functions.

Recommendation:

- Keep noindex on admin/internal pages.
- Keep no anon SELECT for lead/upload/internal tables.
- Keep protected Netlify Function access.
- Add tests ensuring no sensitive admin fields are returned without a valid token.

## Pricing Exposure

Current public risk remains:

- product/catalogue data and some pricing-support JS are public;
- server-side private pricing migration is still the correct target architecture.

Do not treat public catalogue names and customer-safe product data as a critical leak. Do treat private rate tables, supplier costs, margins, access multipliers, and internal pricing formulas as server-only.

Recommended next security task:

1. Remove public comments that mention private rate tables.
2. Continue function-routing and server-side pricing migration.
3. Add leak tests that fail on private pricing field names in public output.
4. Keep Supabase anon SELECT/GraphQL locked down for lead/upload/quote tables.

## LocalStorage / SessionStorage

Fresh browser sample on key pages showed no relevant Operon quote/product/floorplan/chatbot localStorage or sessionStorage keys before user interaction.

Side-effect flows were not submitted in this audit. A separate staging/preview QA should inspect storage after:

- quote submit
- product selection handoff
- quote-review upload
- floorplan upload
- chatbot qualification

## Severity Summary

| Severity | Finding |
| --- | --- |
| Critical | None found |
| High | None confirmed in public output |
| Medium | Public pricing-support JS remains architectural exposure until server-side pricing migration completes |
| Medium | Admin/internal route exposure requires ongoing token/RLS discipline |
| Low | Public JS contains policy/comment language mentioning internal/private pricing concepts |

## Recommended Security Sprint

Security Sprint A:

- remove public comments mentioning private rate tables;
- lock leak tests around public JS;
- verify Supabase RLS/GraphQL after Stage 3 schema changes;
- keep upload/OCR response privacy tests active;
- do not change pricing logic during this sprint.
