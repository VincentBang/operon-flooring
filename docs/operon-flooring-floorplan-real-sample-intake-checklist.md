# Operon Flooring Floorplan Real Sample Intake Checklist

## Purpose

This checklist controls when a real reviewed floorplan can be added to the internal benchmark corpus.

The goal is to improve Phase 3 detection quality without exposing customer data, storage locations, raw document contents, or private commercial information.

## Rule

Real samples are not allowed in the committed benchmark corpus until every item below is satisfied.

## Required Approval Fields

Each future real fixture must declare:

- `fixture_origin: "approved_real_reviewed_sample"`
- `usage_status: "approved_for_internal_benchmark"`
- `privacy_status: "customer_identifiers_removed"`
- `customer_identifiers_removed: true`

Synthetic fixtures must continue to declare:

- `fixture_origin: "synthetic"`
- `usage_status: "approved_for_local_qa"`
- `privacy_status: "no_customer_data"`
- `customer_identifiers_removed: true`

## Redaction Checklist

Before a real reviewed sample is added:

- remove customer name
- remove phone number
- remove email address
- remove street address
- remove exact property address
- remove storage bucket names
- remove storage paths
- remove signed URLs
- remove raw file names if they identify a customer or address
- remove OCR text or quote text
- remove supplier costs, margins, rates and private pricing notes
- replace labels with generic room or page names

## Usage Approval Checklist

Before a real reviewed sample is added:

- confirm the file is allowed for internal QA use
- confirm it will not be used for model training
- confirm it will not be sent to a third party
- confirm it will not be published
- confirm it will not be customer-visible
- confirm it has a reviewed measurement result
- confirm the reviewed measurement was created or accepted by an internal reviewer
- confirm it improves one or more benchmark coverage gaps

## Fixture Naming Rules

Do:

- use a neutral id such as `reviewed-sample-low-contrast-01`
- use generic labels such as `Living room`, `Bedroom`, `Hallway`, `Excluded wet area`
- use plan-quality and confidence metadata

Do not:

- include suburb if it could identify a project
- include customer initials
- include address fragments
- include builder or contractor names
- include original file names
- include upload ids or storage ids

## Minimum Future Real Sample Batch

The first real-sample batch should include at least:

- 1 low-contrast scan
- 1 mixed-boundary plan
- 1 void or stair-adjacent plan
- 1 multipage PDF page
- 1 irregular non-rectangular layout

This closes the current `real_reviewed_samples` coverage gap without requiring a large dataset.

## Acceptance Gate

Before committing real fixtures:

```bash
npm run test:floorplan-full
npm run benchmark:floorplan:coverage -- --json
npm run check:public-leaks
git diff --check
```

Expected:

- all floorplan tests pass
- coverage report shows real reviewed samples present
- no public leak check failure
- no customer identifiers in fixture text
- no storage path or file path in committed fixture data
- no selected candidate area is used before reviewer approval

## Production Boundary

Adding real samples to the local benchmark does not approve:

- production deploy
- customer-visible detection
- automatic measurement approval
- third-party processing
- use for model training

Those remain separate approval gates.
