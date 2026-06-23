# Operon Flooring Floorplan Phase 2.5 Benchmark Corpus

## Purpose

Phase 2.5 creates a local-only reviewer validation benchmark before any Phase 3 detection work starts.

The benchmark does not try to detect rooms automatically. It checks that known-safe measurement cases can be represented, validated, compared against reviewed areas, and used later as a stable baseline for detection experiments.

## Scope

Included:

- synthetic benchmark fixtures with reviewed geometry
- privacy-safe metadata only
- server-side geometry validation through the existing Phase 2 validator
- selected-area and measured-area assertions
- excluded and not-sure section coverage
- low-confidence and mixed-boundary cases
- a reusable local harness for future candidate methods
- a candidate adapter contract for future Phase 3 detector outputs
- a quick-room baseline fixture that runs the current detector against synthetic reviewed geometry

Excluded:

- automatic room detection
- real customer uploads
- customer names, phone numbers, email addresses or addresses
- storage bucket names or storage paths
- OCR or raw quote text
- pricing, supplier costs, margins, rates or private quote logic
- production deployment

## Files

- `internal-qa/fixtures/floorplanBenchmarkCorpus.js`
- `internal-qa/fixtures/floorplanQuickRoomBaselineCandidates.js`
- `internal-qa/lib/floorplanBenchmarkHarness.js`
- `internal-qa/lib/floorplanBenchmarkReportComparator.js`
- `internal-qa/lib/floorplanBenchmarkReportWriter.js`
- `internal-qa/scripts/compareFloorplanBenchmarkReports.js`
- `internal-qa/scripts/runFloorplanBenchmark.js`
- `internal-qa/tests/web/floorplanBenchmarkCorpusContract.test.js`
- `internal-qa/tests/web/floorplanBenchmarkComparatorContract.test.js`
- `internal-qa/tests/web/floorplanCandidateAdapterContract.test.js`
- `internal-qa/tests/web/floorplanQuickRoomBaselineCandidateContract.test.js`
- `internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js`

## Benchmark Coverage

The first corpus uses synthetic geometry only. This keeps the benchmark safe to commit while still covering the measurement behaviours that matter before assisted detection:

- clean single-room rectangle
- long open-plan rectangle
- L-shaped living and hallway area
- two-room apartment
- wet area excluded from quote area
- stair void excluded from quote area
- outdoor/balcony threshold marked not sure
- low-confidence scan-like trace
- multipage PDF-style page context
- irregular hallway with nook

## Scoring

The harness reports:

- item count
- pass/fail count
- warning count
- reviewed selected area
- reviewed measured area
- expected area delta
- section count delta
- customer trace area error when a customer version exists
- whether the current corpus is ready for Phase 3 detection spike work

The Phase 3 readiness flag only means the local benchmark foundation is valid. It does not approve a detection model or production behaviour.

## Candidate Adapter Contract

Future Phase 3 detection experiments can feed proposed sections into the harness through `adaptCandidatePayload`.

Candidate payloads are deliberately constrained:

- candidates must not be final
- candidates must not be customer-visible
- candidates must not include quote handoff or publish fields
- candidate sections enter review as `not_sure`
- candidate confidence may be `low` or `medium`, not `high`
- candidate selected area remains `0` until reviewed
- candidate measured area can be scored against reviewer geometry
- sensitive fields are rejected before adaptation

This keeps detection work useful for benchmarking while preserving reviewer control.

## Quick-Room Baseline Fixture

The quick-room baseline fixture turns each eligible synthetic reviewed plan into a simple wall mask, runs the current `floorplanQuickRoom.js` candidate detector, and adapts the output through the candidate adapter.

This provides a stable comparison point for Phase 3 without changing production:

- it uses the existing quick-room baseline code
- it produces detector-like candidates
- it downshifts candidate confidence to review-only values
- it keeps selected quote area at `0`
- it reports candidate measured area versus reviewed area
- it blocks handoff, approval and customer-visible fields

The current baseline fixture is not an accuracy claim. It is a contract that makes future detector experiments comparable and safe.

## Local Artifact Reports

Benchmark reports can be written locally for reviewer comparison and future Phase 3 experiments:

```bash
node internal-qa/scripts/runFloorplanBenchmark.js --write-artifacts
```

Optional naming:

```bash
node internal-qa/scripts/runFloorplanBenchmark.js --write-artifacts --method=quick-room-baseline
```

The writer creates timestamped JSON and Markdown under:

```text
internal-qa/reports/floorplan-benchmarks/
```

That folder is intentionally gitignored. Reports are local evidence artifacts, not production source.

## Local Report Comparison

Future Phase 3 detection experiments should compare their local artifact against the last accepted baseline before any reviewer-facing code is considered:

```bash
node internal-qa/scripts/compareFloorplanBenchmarkReports.js \
  --baseline=internal-qa/reports/floorplan-benchmarks/<baseline>.json \
  --candidate=internal-qa/reports/floorplan-benchmarks/<candidate>.json
```

The comparator reports:

- corpus failure delta
- quick-room contract pass delta
- average candidate area error
- per-fixture area error deltas
- regression count
- whether it is safe to continue the detection spike

A passing comparison does not approve customer-visible detection. It only means a candidate method did not regress against the local benchmark contract.

## Privacy Rules

Benchmark fixtures must not include:

- real customer identifiers
- real addresses
- raw upload paths
- bucket names
- signed URLs
- OCR text
- raw transcripts
- internal pricing language

Real uploaded or project plans can only be added later if usage rights and privacy review are explicit. When real examples are added, labels should remain generic and PII-free.

## How To Run

```bash
node internal-qa/scripts/runFloorplanBenchmark.js
node internal-qa/tests/web/floorplanBenchmarkCorpusContract.test.js
node internal-qa/tests/web/floorplanCandidateAdapterContract.test.js
node internal-qa/tests/web/floorplanQuickRoomBaselineCandidateContract.test.js
node internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js
```

Recommended floorplan gate after Phase 2.5 changes:

```bash
node internal-qa/tests/web/floorplanMeasurement.test.js
node internal-qa/tests/web/floorplanQuickRoom.test.js
node internal-qa/tests/web/floorplanMeasurementPhase2Contract.test.js
node internal-qa/tests/web/floorplanBenchmarkCorpusContract.test.js
node internal-qa/tests/web/floorplanBenchmarkComparatorContract.test.js
node internal-qa/tests/web/floorplanCandidateAdapterContract.test.js
node internal-qa/tests/web/floorplanQuickRoomBaselineCandidateContract.test.js
node internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js
```

## Next Use

Before Phase 3 detection, a candidate detector can be run against this harness by producing candidate sections through the adapter contract. The reviewer-approved geometry remains the source of truth.

Phase 3 should remain blocked until:

- the benchmark passes
- internal reviewer console remains protected
- candidate measurements are reviewer-editable
- candidates are never final by default
- public floorplan and quote handoff still work without detection
