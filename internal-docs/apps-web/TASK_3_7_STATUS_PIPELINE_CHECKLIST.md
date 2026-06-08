# Task 3.7 Status Pipeline Checklist

Date: 2026-06-04

Purpose: define the status-pipeline implementation guardrails before building admin status controls.

Local status: first protected status-pipeline slice implemented.

## Scope

Build internal-only status changes for leads:

- New
- Needs review
- Missing info
- Quote sent
- Follow-up needed
- Site measure booked
- Won
- Lost
- Archived

## Required Behavior

- Status changes require admin authentication.
- Every status change updates `operon_leads.status`.
- Every status change inserts `operon_lead_status_history`.
- Every status change inserts an `operon_lead_events` row.
- `last_activity_at` updates on status changes.
- `updated_at` updates on status changes.
- Status change reason is optional but should be stored when provided.

## Non-Goals

- No auto-email.
- No customer-facing status page.
- No contractor assignment.
- No pricing edits.
- No quote recalculation.

## API Contract

Use the approved `admin-update-lead-status` function from `STAGE3_ADMIN_WRITE_FUNCTION_CONTRACT.md`.

Request:

```json
{
  "lead_id": "uuid",
  "status": "Needs review",
  "reason": "Missing stairs and removal details"
}
```

Success:

```json
{ "ok": true }
```

Implemented local function:

- `netlify/functions/lead-status-admin.js`

Implemented local UI:

- Status update form inside `apps/web-tsx/src/app/admin/AdminLeadDetail.tsx`

Implemented local tests:

- `internal-qa/tests/web/leadStatusAdminContract.test.js`
- `internal-qa/tests/web/adminLeadDetailClientContract.test.js`

Current behavior:

- Status changes require admin token auth.
- Writes use service-role credentials server-side only.
- Valid statuses match the current `operon_leads.status` database constraint:
  - New
  - Needs review
  - Waiting customer
  - Quote sent
  - Site measure booked
  - Won
  - Lost
  - Archived
- Status changes update `operon_leads.status`, `updated_at`, and `last_activity_at`.
- Status changes insert `operon_lead_status_history`.
- Status changes insert `operon_lead_events` with `event_type = lead_status_changed`.
- Terminal statuses `Won`, `Lost`, and `Archived` require browser confirmation.
- Responses return only safe status state.
- No public quote/pricing/product/floorplan/quote-review/chatbot logic is changed.

Preview/live verification still required before operator use.

## UI Requirements

- Show current status clearly.
- Provide a compact status menu.
- Confirm destructive/terminal statuses: Won, Lost, Archived.
- Show latest status change in the lead timeline.
- Keep status controls out of public pages.

## Security Requirements

- Unauthenticated requests return 401/403.
- Non-admin users return 403.
- Response uses `Cache-Control: no-store`.
- No private pricing fields are returned.
- No raw OCR text or storage paths are returned.

## Tests Before Preview

- Valid status writes lead row, history row, and event row.
- Invalid status is rejected.
- Missing lead ID is rejected.
- Unauthenticated request is rejected.
- Public website quote/contact/review/upload flows still pass.
