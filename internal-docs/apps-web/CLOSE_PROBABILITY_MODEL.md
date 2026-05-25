# Operon Close Probability Model

Updated: 2026-05-04

Purpose: prioritise leads for human and automated follow-up without changing quote calculation, product logic, or pricing rules.

## Scoring Model

Formula:

```text
close_score = intent + engagement + completeness - friction
```

Range:

- `0-100`

Outputs:

- `close_score`
- `close_probability`
- `close_band`
- `close_reasons`
- `next_action`
- `priority_rank`

## Database Updates

Migration:

- `supabase/migrations/20260504_close_probability_system.sql`

Adds to `quote_requests` and `quote_leads`:

- `close_score`
- `close_probability`
- `close_band`
- `close_reasons`
- `next_action`
- `priority_rank`

Close bands:

- `high`: strong intent and enough scope clarity for immediate human contact
- `medium`: good lead, needs guided follow-up
- `low`: nurture with helpful content or light check-in
- `very_low`: minimal automation only

## Signals Used

Intent:

- `lead_stage`
- ready soon / comparing / planning timeline
- thank-you page timing selection
- site assessment request

Engagement:

- `quote_submit`
- `quote_submit_success`
- `summary_view`
- `CTA_click`
- `cta_click`
- `thank_you_page_cta_click`
- `chatbot_interaction`
- `SMS reply` or customer reply events

Completeness:

- name
- phone or email
- site address
- area provided
- measurement known
- product/category selected
- extras captured
- estimate total available

Friction:

- measurement unknown
- no area
- manual review required
- warnings
- no contact details
- inactivity
- hesitation signal

## Function Implementation

Function:

- `supabase/functions/calculate-close-score/index.ts`

Triggers supported:

- Lead creation: initial score is written by `netlify/functions/save-quote-request.js`.
- Event update: call `calculate-close-score` with `quote_id` after important events if needed.
- Scheduled batch: call `calculate-close-score` every 5-10 minutes or before `process-leads`.

Request examples:

```json
{ "quote_id": "00000000-0000-4000-8000-000000000000" }
```

```json
{ "limit": 50 }
```

```json
{ "limit": 50, "dry_run": true }
```

## Action Mapping

High:

- `next_action`: `immediate_human_contact`
- Use phone script from `OPERON_CLOSE_SCRIPTS.md`.
- Queue manual close action for the operator dashboard.

Medium:

- `next_action`: `guided_followup`
- Use helpful SMS/email follow-up.
- Focus on missing scope, area, preparation, access, and product confidence.

Low:

- `next_action`: `nurture`
- Use light planning support.
- Do not push for booking.

Very low:

- `next_action`: `minimal`
- Minimal automation only.
- Avoid over-follow-up.

Special action:

- If measurement is unknown, `next_action` becomes `request_site_assessment_or_floorplan` even if the band is otherwise promising.

## Example Lead Scenarios

### Scenario 1: Ready Soon Lead

Signals:

- selected `hot`
- quote submitted
- summary viewed
- area provided
- contact details complete
- product selected

Likely output:

- `close_score`: 75-90
- `close_band`: `high`
- `close_probability`: roughly `0.65-0.77`
- `next_action`: `immediate_human_contact`

Reason:

- strong intent, strong engagement, complete enough scope.

### Scenario 2: Comparing Quotes

Signals:

- selected `warm`
- clicked quote review
- chatbot interaction
- area provided
- some extras unclear

Likely output:

- `close_score`: 45-70
- `close_band`: `medium`
- `next_action`: `guided_followup`

Reason:

- good engagement but decision is still comparison-based.

### Scenario 3: Measurement Unknown

Signals:

- quote started
- measurement status unknown
- selected site assessment or floorplan lookup
- contact details complete

Likely output:

- `close_score`: 35-65
- `close_band`: `medium` or `low`
- `next_action`: `request_site_assessment_or_floorplan`

Reason:

- useful lead, but price confidence depends on measurement.

### Scenario 4: Planning Only

Signals:

- selected `cold`
- product browsing only
- no area
- inactive for 7+ days

Likely output:

- `close_score`: 0-25
- `close_band`: `very_low` or `low`
- `next_action`: `minimal` or `nurture`

Reason:

- low intent and high friction.

## Validation Rules

- No random values.
- Score must be explainable through `close_reasons`.
- Quote calculation remains untouched.
- Internal rates and formulas are never exposed to customers.
- Automation should prioritise operator attention, not pressure customers.
