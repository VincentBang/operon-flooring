# Task 3.10 Floorplan Review Queue Checklist

Date: 2026-06-04

Purpose: define the internal floorplan review queue before implementation.

## Scope

Show leads where floorplan/upload data exists and may need manual review.

## Data Sources

- `operon_leads`
- `operon_floorplan_reviews`
- `operon_uploaded_files`
- `operon_lead_files`
- `operon_lead_events`

## List Fields

- Created date
- Customer name
- Suburb
- File type
- Area estimate
- Confidence level
- Review status
- Linked quote status
- Next action

## Detail Fields

- Safe file metadata
- Area method
- Room count
- Estimated area
- Confidence notes
- Customer notes
- Related quote lead
- Timeline events

## Privacy Rules

- No public bucket/path exposure.
- No raw file URLs by default.
- No direct browser Supabase storage reads.
- Admin file access requires protected function and short-lived signed URL if approved later.

## First Version Actions

- Mark floorplan as reviewed.
- Add internal note.
- Schedule follow-up.
- Link floorplan to quote lead.

## Non-Goals

- No geometry refactor.
- No automatic CAD parsing.
- No customer-facing floorplan account.
- No quote calculation changes.

## Tests Before Preview

- Unauthenticated queue access blocked.
- File response includes safe metadata only.
- Floorplan public tool still works.
- Quote handoff remains intact.
