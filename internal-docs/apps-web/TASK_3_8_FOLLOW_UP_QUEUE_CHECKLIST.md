# Task 3.8 Follow-Up Queue Checklist

Date: 2026-06-04

Goal: build a dry-run/manual follow-up queue only. Do not auto-send until separately approved.

Local status: first protected dry-run/manual follow-up queue slice implemented.

## MVP View

Show:

- Lead
- Status
- Priority
- Source
- Due date
- Channel
- Next action
- Assigned operator
- Last activity

## Allowed Actions

- Mark done.
- Snooze.
- Cancel.
- Update next action.
- Add note.

## Explicitly Not Allowed Yet

- Auto-send SMS.
- Auto-send email.
- Bulk outreach.
- Contractor dispatch.
- Customer account messages.

## Data Sources

- `operon_follow_ups`
- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`

## Security

- Admin-only.
- Server-side reads/writes only.
- No direct Supabase browser writes.
- No private pricing fields.

## Tests

- Unauthenticated access fails.
- Follow-up list returns only due/open records by default.
- Mark done writes event.
- Snooze writes event.
- Cancel writes event.
- No external email/SMS function is called.

## Stop Condition

If a requested action sends communication automatically, stop and ask for approval.

## Local Implementation

Implemented local function:

- `netlify/functions/lead-followup-admin.js`

Implemented local UI:

- `apps/web-tsx/src/app/admin/AdminFollowUpQueue.tsx`

Implemented local tests:

- `internal-qa/tests/web/leadFollowupAdminContract.test.js`
- `internal-qa/tests/web/adminFollowUpQueueClientContract.test.js`

Current behavior:

- Queue appears only after admin token verification.
- Reads open manual follow-ups through `/.netlify/functions/lead-followup-admin?status=open&limit=50`.
- Actions are protected by admin token auth.
- Supported actions:
  - Mark done
  - Snooze two days
  - Cancel
- Actions update `operon_follow_ups`.
- Actions insert `operon_lead_events`.
- No email is sent.
- No SMS is sent.
- No bulk outreach exists.
- No direct browser Supabase reads or writes.
- No private pricing fields, raw OCR text, storage paths, or signed URLs are rendered.

Remaining later:

- Add note from follow-up action.
- Manual follow-up filter views.
- Operator assignment workflow.
- Due-only view refinement.
