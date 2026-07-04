# Operon Flooring Floorplan Real Sample Intake Checklist

## Purpose

This checklist controls when a real reviewed floorplan can be added to the internal benchmark corpus.

The goal is to improve Phase 3 detection quality without exposing customer data, storage locations, raw document contents, or private commercial information.

## Rule

Real samples are not allowed in the committed benchmark corpus until every item below is satisfied.

## Required Approval Fields

Use `internal-qa/templates/floorplanApprovedRealSampleFixtureTemplate.js` as the starting shape for future reviewed sample fixtures. The template is intentionally outside `internal-qa/fixtures/` so it does not enter the active benchmark corpus.

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

Before selecting samples, run the collection plan:

```bash
npm run benchmark:floorplan:real-sample-collection -- --json
```

Use the output to confirm which coverage slots are still missing.

If using the worksheet flow, convert the completed worksheet into a fixture batch before validation:

```bash
npm run benchmark:floorplan:convert-real-sample-worksheet -- --worksheet-file=<completed-worksheet-json> --output-file=<redacted-fixture-batch>
```

A safe local batch template is available at:

```text
internal-qa/templates/floorplanApprovedRealSampleBatchTemplate.js
```

Copy the shape only. Replace each template item with reviewed, redacted, customer-safe measurement data before running the fixture validator.

## Acceptance Gate

Before committing real fixtures:

```bash
npm run test:floorplan-full
npm run benchmark:floorplan:real-sample-collection -- --json
npm run benchmark:floorplan:convert-real-sample-worksheet -- --worksheet-file=<completed-worksheet-json> --output-file=<redacted-fixture-batch>
npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<path-to-redacted-fixture>
npm run benchmark:floorplan:real-sample-intake -- --fixture-file=<path-to-redacted-fixture> --json
npm run benchmark:floorplan:coverage -- --json
npm run check:public-leaks
git diff --check
```

Expected:

- all floorplan tests pass
- each proposed real-sample fixture passes the local validator before joining the benchmark corpus
- real sample intake gate confirms the approved real-sample batch is ready for benchmark use
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
