# Operon Flooring Floorplan Real Sample Request Runbook

## Purpose

This runbook creates a local-only request packet for the five approved, redacted real reviewed floorplan samples needed before Phase 3 detection can move beyond synthetic fixtures.

It does not add samples, approve training, approve deployment, or enable customer-visible detection.

## Generate The Request Packet

From the repository root:

```bash
npm run benchmark:floorplan:real-sample-request -- --write-artifacts --output-dir=internal-qa/reports/floorplan-real-sample-request
```

For machine-readable output:

```bash
npm run --silent benchmark:floorplan:real-sample-request -- --json --write-artifacts --output-dir=internal-qa/reports/floorplan-real-sample-request
```

The command writes:

- `floorplan-real-sample-request-packet.json`
- `floorplan-real-sample-request-packet.md`

## Requested Sample Slots

The current request packet asks for:

- `low_contrast_scan`
- `mixed_boundary`
- `void_or_stairs`
- `multipage_pdf`
- `irregular_geometry`

## Safe Data To Provide

Each sample should include only:

- redacted fixture metadata
- reviewed section geometry
- reviewed total area
- scale basis
- non-identifying reviewer notes

## Must Remove

Before a sample is provided or committed, remove:

- customer name
- direct contact details
- street or unit details
- original upload references
- temporary access links
- raw plan contents
- raw quote contents
- private commercial logic

## Validation

When a redacted fixture batch is ready, run:

```bash
npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<redacted-fixture-batch>
npm run benchmark:floorplan:real-sample-intake -- --fixture-file=<redacted-fixture-batch> --json
npm run test:floorplan-full
npm run check:public-leaks
git diff --check
```

Do not add samples to the active benchmark corpus until validation and intake both pass.
