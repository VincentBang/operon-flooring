# Operon Follow-Up Automation Setup

This guide explains how the post-submit follow-up engine works.

Current default: email follow-up can send through the Netlify/Resend server path when `RESEND_API_KEY` and `OPERON_FROM_EMAIL` are configured. SMS remains queued-only.

## Files

- `supabase/migrations/20260504_followup_automation_schema.sql`
- `supabase/functions/create-followup-queue/index.ts`
- `supabase/functions/process-followups/index.ts`
- `netlify/functions/process-followups.js`
- `apps/web/POST_SUBMIT_CONVERSION_SYSTEM.md`

## Database Setup

Run this migration in Supabase SQL Editor after the existing Operon schema migrations:

```sql
supabase/migrations/20260504_followup_automation_schema.sql
```

It adds follow-up fields to:

- `quote_leads`
- `quote_requests`

It creates:

- `followup_templates`
- `followup_messages`

It also seeds the initial SMS/email templates.

## Required Supabase Function Secrets

Set these in Supabase Edge Function secrets:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ENABLE_FOLLOWUP_SEND=false
DRY_RUN_FOLLOWUP_STATUS=queued
SMS_PROVIDER_API_KEY=
EMAIL_PROVIDER_API_KEY=
FROM_EMAIL=
FROM_PHONE=
```

Important:

- Supabase Edge Functions are still dry-run unless separately deployed and enabled.
- Netlify email follow-up uses `RESEND_API_KEY`, `OPERON_FROM_EMAIL`, and `SUPABASE_SERVICE_ROLE_KEY`.
- Keep SMS disabled until consent, reply, and opt-out handling are approved.
- Keep `DRY_RUN_FOLLOWUP_STATUS=queued` if you want dry-run checks without consuming queued messages.
- Use `DRY_RUN_FOLLOWUP_STATUS=skipped` only in a test database when you want to verify status updates.

## Netlify Live Email Worker

Function:

```text
netlify/functions/process-followups.js
```

Behaviour:

- Finds due queued email follow-ups.
- Sends them through Resend.
- Marks successful messages as `sent`.
- Marks failed messages as `failed`.
- Leaves SMS/manual-call tasks untouched.
- Runs on a 10-minute Netlify schedule.
- Can also be called manually at `/.netlify/functions/process-followups`.

Quote submit behaviour:

- `netlify/functions/save-quote-request.js` queues follow-ups after a submitted quote.
- It immediately attempts due email follow-ups for that quote.
- A follow-up failure does not block quote saving.

## Deploy Functions

Future deployment command:

```bash
supabase functions deploy create-followup-queue
supabase functions deploy process-followups
```

Do not deploy to production with sending enabled until the provider integration is reviewed.

## Queue Creation

Function:

```text
supabase/functions/create-followup-queue/index.ts
```

Input:

```json
{
  "lead_id": "uuid",
  "lead_stage": "hot",
  "consent_sms": false,
  "consent_email": true
}
```

Compatibility input for the current `quote_requests` table:

```json
{
  "quote_request_id": "uuid",
  "lead_stage": "warm",
  "consent_sms": false,
  "consent_email": true
}
```

Behaviour:

- Reads active templates.
- Selects templates by lead stage and consent.
- Inserts rows into `followup_messages`.
- Does not send SMS or email.
- Updates `followup_status` and `next_followup_at`.

## Template Rules

Hot:

- Immediate SMS if `consent_sms=true`
- Immediate email if `consent_email=true`
- Day 1 SMS if `consent_sms=true`

Warm:

- Immediate SMS if `consent_sms=true`
- Immediate email if `consent_email=true`
- Day 3 email if `consent_email=true`
- Day 7 SMS if `consent_sms=true`

Cold:

- Immediate email if `consent_email=true`
- Day 7 SMS if `consent_sms=true`
- Day 14 email if `consent_email=true`

Unknown:

- Immediate email if `consent_email=true`
- Immediate SMS if `consent_sms=true`

## Processing Follow-Ups

Function:

```text
supabase/functions/process-followups/index.ts
```

Default behaviour:

- Finds due `queued` messages.
- Does not send real messages when `ENABLE_FOLLOWUP_SEND=false`.
- Leaves rows queued when `DRY_RUN_FOLLOWUP_STATUS=queued`.
- Marks rows skipped only when `DRY_RUN_FOLLOWUP_STATUS=skipped`.

Real sending:

- Email sending is implemented in Netlify through Resend.
- SMS provider calls are still placeholders only.

## Scheduling

Recommended future schedule:

- Netlify `process-followups` runs every 10 minutes.
- Supabase scheduled functions are optional and should remain disabled unless we choose Supabase Edge Functions as the worker.

Example future cron:

```text
*/10 * * * * process-followups
```

## Safety Controls

The system supports:

- `followup_paused=true`
- `consent_sms=false`
- `consent_email=false`
- `followup_status`
- `last_followup_at`
- `next_followup_at`
- `followup_messages.status`

Placeholders still needed before real sending:

- Reply/opt-out handling.
- Booking conversion sync.
- Manual pause from admin dashboard.
- Provider webhook for delivery and replies.

## Frontend Connection

Current frontend preparation:

- `quote.html` includes `lead_stage`, `consent_sms`, and `consent_email` in the lead payload.
- Default `lead_stage` is `unknown`.
- Default `consent_sms` is `false`.
- Default `consent_email` is `true`.
- `thank-you.html` lets the user select timing:
  - Ready soon -> `hot`
  - Comparing -> `warm`
  - Planning -> `cold`
- The selected stage is stored in localStorage for future backend sync.

This is additive. Netlify Forms and localStorage backup remain the fallback.

## Validation Checklist

Before enabling real sending:

- Run the SQL migration in a test Supabase project.
- Confirm `followup_templates` has six active templates.
- Create a queue for a hot lead with `consent_sms=false` and confirm no SMS rows are queued.
- Create a queue for a warm lead with `consent_email=true` and confirm immediate/day3 email rows.
- Run `process-followups` with `ENABLE_FOLLOWUP_SEND=false` and confirm no provider call is made.
- Confirm no service role key appears in frontend files.
- Confirm `followup_paused=true` prevents queue creation.
- Confirm failed function calls do not break quote submission.

## Enabling Real Sending Later

Real sending requires:

1. Provider selection and implementation.
2. SMS consent wording reviewed.
3. Opt-out handling implemented.
4. Reply webhooks implemented.
5. Admin pause/override available.
6. `ENABLE_FOLLOWUP_SEND=true` set only after production test approval.
