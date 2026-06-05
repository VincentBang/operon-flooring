# Stage 4 Operon Kitchens Infrastructure Integration Plan

Date: 2026-06-04

Purpose: define how Operon Kitchens should reuse Operon OS infrastructure without coupling public sites or exposing Flooring pricing logic.

## Strategic Goal

Use Flooring as the first proven vertical, then reuse the internal operating system for Kitchens.

## Reusable Infrastructure

- `operon_leads`
- `operon_lead_events`
- `operon_lead_notes`
- `operon_lead_files`
- `operon_follow_ups`
- Shared upload/review pattern
- Admin dashboard shell
- Status pipeline
- Follow-up queue
- Reporting dashboard

## Vertical Separation

Add or reserve:

- `vertical = flooring`
- `vertical = kitchens`

Do not mix:

- Flooring pricing logic
- Kitchen pricing logic
- Product catalogues
- Customer-facing site routes

## Kitchens Lead Sources

Future sources:

- Kitchen quote form
- Kitchen plan upload
- Supplier quote review
- Contact form
- Chatbot/operator request

## Kitchens Project Fields

- Kitchen type
- Property type
- Layout
- Cabinet scope
- Benchtop scope
- Appliance scope
- Demolition/removal scope
- Installation scope
- Site measure needed
- Budget range if customer-provided

## Shared Dashboard Behavior

- Same lead list.
- Same lead detail shell.
- Vertical filter.
- Source labels.
- Notes.
- Follow-ups.
- Files.
- Timeline.

## Privacy/Security Boundary

- Kitchen pricing support stays server-side.
- No supplier costs/margins in public browser.
- Uploaded kitchen plans stay private.
- Admin access stays protected.

## Implementation Sequence

1. Stabilize Flooring Stage 3 admin dashboard.
2. Add `vertical` filtering and labels.
3. Add Kitchens lead schema extensions as nullable fields or vertical detail table.
4. Add Kitchens ingestion functions.
5. Reuse upload/review framework.
6. Run internal SaaS alpha before contractor-facing expansion.

## Risks

- Premature multi-vertical complexity.
- Blending incompatible pricing models.
- Dashboard noise if source labels are weak.
- Privacy risk from uploaded plans.
- Operational overload before Flooring process is stable.

## Decision Gate

Do not start Kitchens integration until Flooring lead capture, follow-up, and review queues are stable.
