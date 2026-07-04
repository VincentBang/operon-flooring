# Operon Flooring Floorplan Phase 3 Review Packet Runbook

## Purpose

This runbook creates one local-only reviewer packet for the advanced floorplan Phase 3 work.

The packet is for internal review only. It helps decide whether to add approved real reviewed samples, run manual reviewer QA, or continue synthetic-only experiments.

## Boundary

The packet does not approve:

- production deployment
- public customer-visible detection
- automatic measurement approval
- automatic quote handoff
- third-party processing
- use of customer plans for model training

All candidate output remains review-only until an internal reviewer approves a measurement version.

## Command

From the repository root:

```bash
npm run benchmark:floorplan:phase3-handoff -- --packet-dir=internal-qa/reports/floorplan-phase3-review-packet --request-dir=internal-qa/reports/floorplan-real-sample-request
```

This prepares the packet, validates it, and writes the real-sample request artifacts.

If you only need to rebuild the packet:

```bash
npm run benchmark:floorplan:phase3-packet -- --output-dir=internal-qa/reports/floorplan-phase3-review-packet
```

For machine-readable output:

```bash
npm run --silent benchmark:floorplan:phase3-packet -- --json --output-dir=internal-qa/reports/floorplan-phase3-review-packet
```

The command writes:

- `packet-manifest.json`
- Phase 3 status report
- Phase 3 review bundle
- Phase 3 next-actions report
- Phase 3 local gate plan
- reviewer readiness gate
- real-sample intake gate
- real-sample collection plan
- real-sample request packet
- geometry-redacted inspection packet

Validate the generated packet before sharing it:

```bash
npm run benchmark:floorplan:phase3-validate-packet -- --packet-dir=internal-qa/reports/floorplan-phase3-review-packet
```

## What To Review

Review the packet in this order:

1. `phase3-next-actions`
2. `phase3-review-bundle`
3. `reviewer-readiness`
4. `phase3-local-gates`
5. `real-sample-intake`
6. `real-sample-collection`
7. `real-sample-request`
8. `inspection-packet`
9. `phase3-status`

The current expected decision is:

- reviewer QA can continue on synthetic fixtures
- real reviewed sample intake remains blocked until approved redacted fixtures are supplied
- customer-visible detection remains blocked

## Privacy Checks

Packet artifacts must not contain:

- customer identifiers
- original upload references
- temporary access links
- raw plan contents
- raw OCR or quote text
- private commercial logic
- internal rates

The packet should only contain safe fixture ids, candidate method labels, measured-area summaries, outcome labels, readiness flags, and next actions.

## Verification

Run:

```bash
node internal-qa/tests/web/floorplanPhase3ReviewPacketContract.test.js
npm run benchmark:floorplan:phase3-validate-packet -- --packet-dir=internal-qa/reports/floorplan-phase3-review-packet
npm run test:floorplan-full
npm run check:public-leaks
git diff --check
```

Expected:

- packet contract passes
- generated packet validator passes
- full floorplan suite passes
- public leak check passes
- no whitespace errors
- generated packet stays local and is not needed for production

## Next Step After A Clean Packet

If the packet is clean, first generate the reviewer request handoff:

```bash
npm run benchmark:floorplan:real-sample-request -- --write-artifacts --output-dir=internal-qa/reports/floorplan-real-sample-request
```

Then collect a small approved real reviewed sample batch using:

```bash
npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<redacted-fixture-batch>
npm run benchmark:floorplan:real-sample-intake -- --fixture-file=<redacted-fixture-batch> --json
```

Do not add real samples to the active benchmark corpus until the validator and intake gate pass.
