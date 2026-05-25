# Operon Automated Close System

Updated: 2026-05-04

Purpose: convert submitted estimates into confirmed jobs with behaviour-based scoring, scheduled follow-up queues, chatbot signals, and human escalation.

This system is intentionally safe by default:

- it scores leads
- it updates `lead_stage`
- it queues close actions
- it records audit runs
- it does not send real SMS/email unless a separate sending processor is explicitly configured
- it does not change quote calculation, product selection, or pricing rules

## Database Updates

Migration:

- `supabase/migrations/20260504_automated_close_system.sql`

Adds to `quote_requests` and `quote_leads`:

- `lead_stage`
- `engagement_score`
- `close_score`
- `close_probability`
- `close_band`
- `close_reasons`
- `next_action`
- `priority_rank`
- `last_activity`
- `last_action`
- `followup_paused`
- `last_followup_at`
- `next_followup_at`

Adds:

- `close_automation_runs`
- supporting indexes for lead-stage processing and event lookup
- `manual_close_call` follow-up template

Close probability model:

- `apps/web/CLOSE_PROBABILITY_MODEL.md`
- `supabase/migrations/20260504_close_probability_system.sql`
- `supabase/functions/calculate-close-score/index.ts`

Allowed lead stages:

- `cold`
- `warm`
- `hot`
- `closing`
- `unknown`

## Event Tracking

Core events used by scoring:

- `quote_submit`
- `quote_submit_success`
- `CTA_click`
- `cta_click`
- `chatbot_interaction`
- `chatbot_hesitation_detected`
- `summary_view`
- `lead_stage_selected`
- `thank_you_page_cta_click`

Tracking updates:

- `apps/web/tracking.js` now aliases `cta_click` to `CTA_click` for the close processor.
- `apps/web/quote.html` emits `summary_view` when the user reaches the summary step.
- `apps/web/chatbot/chatbot.js` emits `chatbot_interaction` for actions, text input, and triggers.
- Hesitation-like chatbot triggers emit `chatbot_hesitation_detected`.

## Scoring System

The processor assigns points from recent behaviour:

- `quote_submit_success`: +45
- `quote_submit`: +30
- `summary_view`: +20
- `chatbot_interaction`: +12
- `CTA_click` / `cta_click` / thank-you CTA: +8
- `quote_email_send_success`: +15
- selected `hot` on thank-you page: +35
- selected `warm` on thank-you page: +20
- selected `cold` on thank-you page: +5
- `chatbot_hesitation_detected`: +18
- `site_assessment_requested`: +40

Stage mapping:

- `0-24`: `cold`
- `25-54`: `warm`
- `55-79`: `hot`
- `80+`: `closing`

## Automation Function

Function:

- `supabase/functions/calculate-close-score/index.ts`
- `supabase/functions/process-leads/index.ts`

Suggested run interval:

- every 5-10 minutes

What it does:

`calculate-close-score`:

- reads recent `quote_requests`
- reads related `quote_events`
- calculates explainable close probability
- updates `close_score`, `close_probability`, `close_band`, `close_reasons`, `next_action`, and `priority_rank`

`process-leads`:

- reads recent `quote_requests`
- reads related `quote_events`
- calculates `engagement_score`
- updates `lead_stage`
- updates `last_activity`
- uses `close_band` and `close_score` to route high/medium/low leads
- queues the next follow-up/close action in `followup_messages`
- records the run in `close_automation_runs`

Action logic:

- New lead: queue immediate response.
- No activity after 24 hours: queue follow-up.
- High engagement: queue manual close script.
- Inactive 7+ days: queue soft reminder.

## Human Escalation

Automation stops or skips when:

- `followup_paused = true`
- user replied
- user called
- site visit / site assessment booked
- final quote confirmed
- job won/lost/completed/cancelled

Human escalation actions are stored through `last_action`, for example:

- `user_replied`
- `user_called`
- `site_assessment_booked`
- `final_quote_confirmed`
- `job_booked`

## Chatbot Integration

Chatbot signals support closing by identifying:

- hesitation
- quote-review intent
- product uncertainty
- post-submit engagement
- next-step questions

The chatbot still must not:

- calculate final price
- compare cheapest quote directly
- expose internal rates
- submit forms by itself
- override quote fields without explicit customer confirmation

## Conversion Logic

The close system follows the close-script framework:

1. Acknowledge.
2. Clarify details.
3. Control risk.
4. Guide next step.
5. Offer choice.

The key conversion idea is to move the customer from “estimate received” to “scope confirmed” before asking for job commitment.

## Deployment Notes

Before enabling real sending:

- run the migration in Supabase
- deploy `process-leads`
- schedule it every 5-10 minutes
- confirm provider credentials
- confirm consent and opt-out rules
- keep `ENABLE_FOLLOWUP_SEND=false` until the messaging processor is approved

This system is ready to queue and audit close actions before sending is enabled.
