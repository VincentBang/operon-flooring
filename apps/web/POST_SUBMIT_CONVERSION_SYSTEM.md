# Operon Post-Submit Conversion System

This document defines the post-submit follow-up layer for Operon Flooring. It is a future-ready operating playbook only: the current website does not send SMS or email automatically.

Related close-stage script pack:

- `apps/web/OPERON_CLOSE_SCRIPTS.md`

## Current Live Behaviour

- `quote.html` submits the quote request and redirects to `thank-you.html`.
- `thank-you.html` confirms the estimate was received, explains next steps, and offers immediate actions.
- Project timing is captured as `lead_stage` in browser storage after submission:
  - `hot` = ready soon
  - `warm` = comparing
  - `cold` = planning
- The chatbot appears on `thank-you.html` as an assistant-only prompt to confirm timing.
- Supabase automation schema and function stubs exist, but real SMS/email sending is disabled by default.
- No pricing logic is changed and no internal rates are exposed.

## Lead Stage Logic

| Lead stage | User wording | Follow-up intent | Cadence |
| --- | --- | --- | --- |
| `hot` | Ready soon | Confirm scope, timing and next available booking path | Faster |
| `warm` | Comparing | Help clarify product, scope and quote inclusions | Moderate |
| `cold` | Planning | Support planning without pressure | Slower |

## Immediate Thank-You Page Goals

The thank-you page should prevent a dead end after submit. It must:

- Confirm the estimate was received.
- Set expectation that scope and assumptions are reviewed.
- Give the customer a next action: call, message, confirm timing, browse products, or check quote scope.
- Reassure the customer that the final decision remains with them.

## Follow-Up Sequence Templates

These templates are intentionally calm and human. Do not use discounts, fake urgency, or pressure.

### Layer 1: Immediate, 0-10 Minutes

Use for all stages. Hot leads can receive the SMS faster and may be called if a phone number is available.

SMS:

```text
Hi [Name], we received your flooring estimate.

I'm reviewing your details now to confirm scope and final pricing.

You can reply here or call if you want to move faster.
```

Email subject:

```text
Your flooring estimate - next steps
```

Email body:

```text
Hi [Name],

Thanks for sending your flooring estimate details.

We'll review the product direction, measured area, removal or preparation requirements, access details, and any notes you included. The final quote is confirmed before work is booked.

If you have a floor plan or room photos, reply with them and we can check the scope faster.

Regards,
Operon Flooring
```

### Layer 2: Short Cycle, 24-72 Hours

Use for hot and warm leads. Use softer timing for cold leads.

Day 1 SMS:

```text
Hi [Name], just checking - have you had a chance to review your flooring estimate?

Happy to clarify scope, products or next steps.
```

Day 2-3 email subject:

```text
Quick check on your flooring project
```

Day 2-3 email body:

```text
Hi [Name],

A quick follow-up on your flooring project.

The main details that usually need confirmation are product selection, floor preparation, removal or disposal, trims, and access. If any of those are unclear, we can help check the scope before you decide.

You can reply with questions, send a floor plan, or continue from your saved estimate.

Regards,
Operon Flooring
```

### Layer 3: Long Cycle, 3-14 Days

Use for warm and cold leads. Hot leads should be handled manually before this point if possible.

Day 5-7 SMS:

```text
Hi [Name], if you're still comparing options, we can help review scope or confirm details.

No pressure - just let me know.
```

Day 10-14 email subject:

```text
Still planning your flooring project?
```

Day 10-14 email body:

```text
Hi [Name],

Just checking whether your flooring project is still being planned.

Your estimate details can still be used as a starting point. If the product, area, access or timing has changed, we can update the scope before final confirmation.

No pressure. Reply whenever you are ready.

Regards,
Operon Flooring
```

## Stage-Based Adjustment

### Hot

- Immediate SMS within 0-10 minutes.
- Call escalation is appropriate if phone number is available and business capacity allows.
- Keep the message focused on scope confirmation and timing.

### Warm

- Immediate receipt message.
- Follow up after 24 hours.
- Focus on product clarity, missing scope, and decision confidence.

### Cold

- Immediate receipt message only.
- Delay follow-up and keep tone planning-oriented.
- Avoid frequent SMS. Use email for helpful planning content.

## Analytics Events

Current/future events:

- `quote_submit_success`: emitted at successful quote submission.
- `quote_thank_you_view`: emitted when `thank-you.html` loads.
- `thank_you_page_cta_click`: emitted when a thank-you CTA is clicked.
- `thank_you_lead_stage_select`: emitted when project timing is selected.
- `lead_stage_selected`: emitted when project timing is selected.
- `chatbot_post_submit_engagement`: emitted when the thank-you page chatbot prompt appears.
- `followup_sms_sent`: future server/CRM event.
- `followup_email_sent`: future server/CRM event.
- `followup_reply`: future CRM event.
- `conversion_to_site_assessment`: future CRM/admin event.
- `conversion_to_booking`: future CRM event.

## Future Integration Notes

Future SMS/email must run server-side only. Do not place provider keys in frontend code.

Current safe-mode backend files:

- `supabase/migrations/20260504_followup_automation_schema.sql`
- `supabase/functions/create-followup-queue/index.ts`
- `supabase/functions/process-followups/index.ts`
- `apps/web/FOLLOWUP_AUTOMATION_SETUP.md`

Recommended environment variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SMS_PROVIDER_API_KEY`
- `EMAIL_PROVIDER_API_KEY`
- `ENABLE_FOLLOWUP_SEND=false`
- `DRY_RUN_FOLLOWUP_STATUS=queued`

The website should remain usable even if follow-up providers fail. A failed SMS or email must never block the customer from viewing the thank-you page.

## Safety Rules

- Do not pressure the customer.
- Do not offer discounts automatically.
- Do not create fake urgency.
- Do not expose internal rates.
- Do not calculate pricing in chatbot.
- Do not send repeated messages without consent and compliance review.
- Do not store large uploaded files in localStorage.
