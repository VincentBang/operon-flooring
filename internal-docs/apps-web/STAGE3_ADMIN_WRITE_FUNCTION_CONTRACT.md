# Stage 3 Admin Write Function Contract

Date: 2026-06-04

Purpose: define the safe server-side write API for the internal dashboard before coding status, notes, and follow-up actions.

## Principles

- All writes require admin auth.
- Writes go through protected Netlify Functions.
- Browser never writes directly to Supabase lead tables.
- Every status-changing write records an event or status-history row.
- Admin writes must not mutate pricing, quote calculations, uploaded files, OCR output, or public customer flow state.

## `admin-update-lead-status`

Method:

- `POST`

Request:

```json
{
  "lead_id": "uuid",
  "status": "Needs review",
  "reason": "Missing area and floor preparation detail"
}
```

Allowed statuses:

- New
- Needs review
- Waiting customer
- Quote sent
- Site measure booked
- Won
- Lost
- Archived

Server action:

- Validate admin.
- Load current lead status.
- Update `operon_leads.status`.
- Update `updated_at` and `last_activity_at`.
- Insert `operon_lead_status_history`.
- Insert `operon_lead_events` with `event_type = lead_status_changed`.

## `admin-update-lead-priority`

Method:

- `POST`

Request:

```json
{
  "lead_id": "uuid",
  "priority": "high",
  "reason": "Large apartment job and ready to proceed"
}
```

Allowed priorities:

- low
- normal
- high
- urgent

## `admin-create-lead-note`

Method:

- `POST`

Request:

```json
{
  "lead_id": "uuid",
  "note": "Called customer; waiting on strata access details.",
  "note_type": "operator"
}
```

Rules:

- Max note length should be enforced server-side.
- Notes are internal-only.
- Notes should not include internal rate tables or secrets.

## `admin-update-next-action`

Method:

- `POST`

Request:

```json
{
  "lead_id": "uuid",
  "next_action": "Call customer about stairs and disposal"
}
```

Server action:

- Update `operon_leads.next_action`.
- Insert `operon_lead_events` with `event_type = next_action_updated`.

## `admin-schedule-follow-up`

Method:

- `POST`

Request:

```json
{
  "lead_id": "uuid",
  "due_at": "iso",
  "channel": "phone",
  "next_action": "Call after customer checks floorplan"
}
```

MVP behavior:

- Dry-run/manual queue only.
- Do not auto-send SMS/email until separately approved.

## Response Contract

Success:

```json
{ "ok": true }
```

Error:

```json
{ "ok": false, "error": "Customer-safe admin error." }
```

Do not return:

- Service-role keys
- Full row dumps
- Private pricing fields
- Storage paths
- Raw OCR text

## Audit Events

Recommended event types:

- `lead_status_changed`
- `lead_priority_changed`
- `lead_note_created`
- `next_action_updated`
- `follow_up_scheduled`

## Test Requirements Before Coding

- Unauthenticated calls fail.
- Invalid statuses/priorities fail.
- Valid writes update only intended fields.
- Status updates create both history and event rows.
- Notes are length-limited.
- Public website functions remain unchanged.
