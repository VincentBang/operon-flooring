# Task 3.8 Follow-Up Queue Checklist

Date: 2026-06-04

Goal: build a dry-run/manual follow-up queue only. Do not auto-send until separately approved.

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
