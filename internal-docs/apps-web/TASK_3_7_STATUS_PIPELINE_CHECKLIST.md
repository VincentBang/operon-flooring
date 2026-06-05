# Task 3.7 Status Pipeline Checklist

Date: 2026-06-04

Purpose: define the status-pipeline implementation guardrails before building admin status controls.

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
