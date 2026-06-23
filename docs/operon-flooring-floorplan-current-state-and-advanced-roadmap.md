# Operon Flooring Floorplan Current State And Advanced Roadmap

Date: 2026-06-23

Scope: Operon Flooring only. This is a documentation audit and roadmap. It does not change public runtime behavior, pricing, Supabase settings, Netlify deploy settings, or production data.

## Verdict

Phase 1 is partially complete and customer-useful, but not yet operationally complete.

The current `/floorplan.html` tool is beyond a proof-only mockup. It gives customers a practical browser-side measurement path: upload a plan, set scale, trace rooms, review selected rooms, and send measured real area into the quote form. It also includes early quick-room detection and confidence labels.

It is not yet a complete Quote OS measurement system because measurements are not persisted as internal review records, there is no measurement version history, no protected reviewer console, no server-side geometry verification, and no operator workflow to approve or correct customer-submitted floorplan measurements.

Recommended next implementation task: Task 2.1 - Internal Measurement Review Console plus measurement versioning.

## Evidence Reviewed

Requested research docs were not present:

- `docs/operon-flooring-auto-floorplan-measurement-research.md`
- `docs/operon-flooring-auto-floorplan-measurement-phase-1-implementation-plan.md`

Existing architecture and policy docs reviewed:

- `docs/operon-flooring-quote-os-architecture.md`
- `docs/operon-flooring-quote-os-schema-gap-and-migration-draft.md`
- `docs/quote-flow/QUOTE_FLOW_POLICY.md`
- `docs/quote-flow/QUOTE_FLOW_V1_BASELINE.md`
- `docs/security/SECURITY_POLICY.md`

Relevant code and tests reviewed:

- `apps/web-tsx/src/app/floorplan/page.tsx`
- `apps/web-tsx/src/app/floorplan/FloorplanRuntime.tsx`
- `apps/web-tsx/public/floorplanRuntime.js`
- `apps/web-tsx/public/floorplanQuickRoom.js`
- `apps/web-tsx/public/quoteRuntime.js`
- `netlify/functions/upload-customer-file.js`
- `supabase/migrations/20260604_stage3_lead_operating_system.sql`
- `internal-qa/tests/web/floorplanMeasurement.test.js`
- `internal-qa/tests/web/floorplanQuickRoom.test.js`
- `internal-qa/tests/web/uploadLeadLinkContract.test.js`

## Current Public Floorplan Features

### Page And Runtime

`/floorplan.html` is generated from the TSX app and is indexable. The generated page includes:

- canonical `https://operonflooring.com.au/floorplan.html`
- title and meta description for floor plan measurement intent
- WebPage and FAQ structured data
- one public H1: `Measure your flooring area from a floor plan.`
- scripts loaded by `FloorplanRuntime`

Runtime scripts:

- `floorplanQuickRoom.js`
- `siteConfig.js`
- `tracking.js`
- PDF.js from CDN
- `floorplanRuntime.js`
- `mobile-nav.js`

### Upload And File Support

Current customer page supports:

- PDF
- JPG/JPEG
- PNG
- WebP via upload function validation

The browser-side floorplan tool renders PDF pages with PDF.js. For multipage PDFs it selects the page with the largest page area as the clearest readable view and renders that page into an image. It does not currently provide an explicit customer page selector.

The public page currently loads the chosen plan image into browser memory/session storage for editing and draft recovery. This is useful for the public tool but should not become the internal review storage model.

### Scale And Measurement

Current tool supports:

- set scale by clicking two points on a known wall
- enter known wall distance in metres
- scale quality warnings for short physical distances or too-short pixel distances
- verify scale against another wall
- status levels such as `set`, `verified`, `needs_review`, and `verification_recommended`
- manual polygon tracing by clicking around room boundaries
- auto-close when the final click is near the first point
- finish room from button
- undo point
- clear trace
- reset scale
- clear rooms
- editable saved room geometry by dragging corner or edge handles
- include/exclude room toggle
- room names and labels
- selected total area
- measurement confidence panel

The geometry calculation is browser-side. Tests cover rectangle, L-shape, rotated rectangle, scale quality, duplicate closing point, aggregation, and exclusion behavior.

### Quick Room Mode

Current quick-room helper supports:

- thresholding/grayscale/contrast/noise handling
- click-inside-room detection from image data
- flood-fill style candidate detection
- region confidence classification
- low/medium/high confidence wording
- customer-safe labels:
  - `Looks clean`
  - `Review suggested boundary`
  - `Manual trace recommended`
- `Suggest areas` mode for multiple candidates
- automatic include only for high-confidence suggested candidates
- manual edit path for suggested rooms
- merge suggested areas
- split manually by switching back to trace mode

This is a useful Phase 1 assisted-measurement feature. It should still be treated as advisory because it relies on plan image contrast and wall closure quality, not a reviewed internal measurement model.

### Quote Handoff

`floorplanRuntime.js` writes a structured handoff to:

- `operon_floorplan_quote_handoff_v1`
- `operon_confirmed_floorplan_area`
- `operon_floorplan_rooms`
- `operon_floorplan_source`

Handoff payload includes:

- `realArea`
- `rooms`
- `measurementSource: "floorplan"`
- `measurementMode`
- `source`
- `savedAt`

Measurement modes currently include:

- `manual_trace`
- `quick_room`
- `suggest_all`

The tool sends customers back to:

- `quote.html?quoteStep=3&from=floorplan`

Quote runtime reads the structured handoff first, falls back to legacy keys, and can fill `confirmedFloorplanArea` with `measurementMethod = "floorplan_upload"`.

Important policy boundary: the floorplan tool sends measured real flooring area only. It does not calculate wastage, chargeable area, final price, or quote submission. The quote system owns pricing, wastage, and scope review.

## Current Upload Privacy And Storage Posture

`upload-customer-file.js` currently:

- validates file size, MIME type, extension, and file signature
- supports PDF, JPEG, PNG, WebP
- writes to Supabase Storage with service-role credentials
- uses UUID-based storage paths
- stores metadata server-side
- can link uploaded files to leads when quote context exists
- returns a customer-safe response

Current upload response includes:

- `ok`
- `status`
- `safe_filename`
- `file_type`
- `file_size_bytes`
- `metadata_saved`
- `uploaded_file_id`

Current upload response does not include:

- `storage_bucket`
- `file_path`
- `signed_url`

The upload privacy contract is covered by `internal-qa/tests/web/uploadLeadLinkContract.test.js`.

Server-side metadata still stores bucket/path internally, which is expected and should remain server/admin-only.

## Current Supabase And Lead System Fit

Existing Stage 3 lead foundation includes:

- `operon_lead_files`
- `operon_floorplan_reviews`
- `operon_follow_ups`
- `operon_lead_status_history`
- `operon_uploaded_files` lead linkage

`operon_floorplan_reviews` currently supports a high-level review record:

- `lead_id`
- `uploaded_file_id`
- `status`
- `estimated_area_m2`
- `confidence_level`
- `review_summary`
- `missing_items`
- `metadata`

This is useful but not enough for a true measurement-review console. It does not model:

- measurement session
- floorplan pages
- scale references
- room geometry
- included/excluded polygons
- measurement versions
- operator approvals
- reviewer notes by version
- server-recalculated area snapshots

New floorplan measurement tables should be additive and private, not a destructive replacement for current public flow.

## Missing Operational Features

The main gaps before advanced detection are operational, not AI:

1. Protected internal measurement review console.
2. Measurement session persistence.
3. Measurement versioning and audit trail.
4. Server-side geometry recalculation from stored normalized coordinates.
5. Review statuses such as `needs_review`, `reviewing`, `approved`, `returned_to_customer`, `sent_to_quote`.
6. Operator notes and correction reasons.
7. Page-aware PDF handling for internal reviewers.
8. Internal signed access to private plan files without exposing bucket/path.
9. Linkage from measurement sessions to leads, uploaded files, quote requests, and follow-up tasks.
10. A benchmark set for testing detection accuracy.
11. Safe retention policy for floorplan images and generated derived images.
12. Admin access model stronger than temporary token gate before scaling.

## Privacy And Security Issues To Watch

No critical public leak was found in this audit pass, but these are the key constraints for the next phases:

- Browser stores floorplan image data temporarily in session storage for draft recovery. This is acceptable for the public tool but not suitable for internal source of truth.
- Browser stores room geometry and quote handoff in local/session storage. Keep this customer-safe and avoid storage paths or uploaded file contents.
- Do not return Supabase bucket/path/signed URL to public browser responses.
- Do not put storage paths, raw OCR, raw quote text, or uploaded file contents into analytics.
- Do not create anon SELECT on measurement/session/review tables.
- Do not expose measurement tables through GraphQL/Data API to anon/authenticated roles.
- Signed URLs for internal review should be short-lived and generated server-side only.
- If plan detection services are introduced later, customer files must not be used for third-party training and must not be sent off-platform without explicit approval.

## Reusable Components

Reusable now:

- polygon area calculation
- included-area aggregation
- scale-quality assessment
- quick-room confidence labels
- region confidence classification
- safe quote handoff structure
- upload validation and safe response pattern
- lead file linkage pattern
- admin token pattern for early internal tools

Should be extracted before heavier reuse:

- geometry utilities from browser runtime into shared testable module
- normalized coordinate schema
- room confidence model
- measurement event shape
- admin file view/signing function pattern

## Duplicate Or Abandoned Code Signals

Known duplication:

- `floorplanQuickRoom.js` exists under both old HTML app and TSX public app paths. Current tests still import `apps/web/floorplanQuickRoom.js`, while TSX serves `apps/web-tsx/public/floorplanQuickRoom.js`. Keep both until test imports and rollback needs are deliberately cleaned up.
- Quote flow docs reference old `apps/web/floorplan.html` alongside TSX files. Treat old app as rollback/history until explicitly retired.
- Runtime has legacy keys such as `operon-floorplan-area` preserved for fallback. Do not remove until quote handoff history and browser recovery behavior are intentionally migrated.

No deletion is recommended in this task.

## Advanced Roadmap

### Phase 1 - Current Customer Measurement Tool

Status: partially complete / customer-useful.

Already present:

- upload floorplan into browser
- PDF/JPG/PNG customer support
- scale set and verify
- manual trace
- quick-room assist
- suggest-all assist
- include/exclude rooms
- customer confidence guidance
- quote handoff
- geometry tests
- upload privacy tests

Still missing from Phase 1 if the definition includes operational readiness:

- persistent measurement session
- internal review
- versioning
- server-side validation
- reviewed quote linkage

### Phase 2 - Internal Measurement Review Console

Build before advanced detection.

Goal:

- give Operon an admin-only way to review customer floorplan uploads and customer traced rooms
- store each measurement session as private operational data
- create versioned reviewed measurements
- send approved area into quote workflow safely

Details are in `docs/operon-flooring-floorplan-phase-2-internal-review-console-plan.md`.

### Phase 3 - Assisted Detection Spike

Only after Phase 2 review/versioning exists.

Goal:

- test semi-automatic detection safely against reviewed examples
- keep suggestions advisory
- require human approval before quote use

Details are in `docs/operon-flooring-floorplan-phase-3-detection-spike-plan.md`.

## Recommended Next Implementation Task

Task 2.1 - Internal Measurement Review Console + measurement versioning.

Deliverables should be:

1. Additive schema draft for measurement sessions/pages/sections/versions.
2. Admin-only read endpoint for floorplan measurement queue.
3. Admin-only signed plan view endpoint.
4. Read-only console first.
5. Version creation second.
6. Server-side geometry recalculation before approval.
7. Tests for access denial, safe payloads, and quote handoff compatibility.

Do not start semi-automatic detection until the review console and versioning layer exists.
