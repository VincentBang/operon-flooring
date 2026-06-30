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
- manual-seed, classical contour and hybrid-selector candidate comparison
- local decision, calibration, tuning and coverage reports

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
- `internal-qa/fixtures/floorplanManualSeedBaselineCandidates.js`
- `internal-qa/fixtures/floorplanClassicalContourCandidates.js`
- `internal-qa/fixtures/floorplanHybridSelectorCandidates.js`
- `internal-qa/lib/floorplanBenchmarkHarness.js`
- `internal-qa/lib/floorplanBenchmarkCoverageReport.js`
- `internal-qa/lib/floorplanBenchmarkReportComparator.js`
- `internal-qa/lib/floorplanBenchmarkReportWriter.js`
- `internal-qa/lib/floorplanHybridSelectorDecisionReport.js`
- `internal-qa/lib/floorplanHybridSelectorCalibrationReport.js`
- `internal-qa/lib/floorplanHybridSelectorTuningReport.js`
- `internal-qa/scripts/compareFloorplanBenchmarkReports.js`
- `internal-qa/scripts/rankFloorplanBenchmarkMethods.js`
- `internal-qa/scripts/reportFloorplanBenchmarkCoverage.js`
- `internal-qa/scripts/reportFloorplanHybridSelectorDecisions.js`
- `internal-qa/scripts/reportFloorplanHybridSelectorCalibration.js`
- `internal-qa/scripts/reportFloorplanHybridSelectorTuning.js`
- `internal-qa/scripts/runFloorplanManualSeedExperiment.js`
- `internal-qa/scripts/runFloorplanBenchmark.js`
- `internal-qa/tests/web/floorplanBenchmarkCorpusContract.test.js`
- `internal-qa/tests/web/floorplanBenchmarkCoverageReportContract.test.js`
- `internal-qa/tests/web/floorplanBenchmarkComparatorContract.test.js`
- `internal-qa/tests/web/floorplanCandidateAdapterContract.test.js`
- `internal-qa/tests/web/floorplanQuickRoomBaselineCandidateContract.test.js`
- `internal-qa/tests/web/floorplanManualSeedBaselineCandidateContract.test.js`
- `internal-qa/tests/web/floorplanClassicalContourCandidateContract.test.js`
- `internal-qa/tests/web/floorplanHybridSelectorCandidateContract.test.js`
- `internal-qa/tests/web/floorplanHybridSelectorDecisionReportContract.test.js`
- `internal-qa/tests/web/floorplanHybridSelectorCalibrationReportContract.test.js`
- `internal-qa/tests/web/floorplanHybridSelectorTuningReportContract.test.js`
- `internal-qa/tests/web/floorplanManualSeedExperimentCliContract.test.js`
- `internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js`

## Benchmark Coverage

The first corpus uses synthetic geometry only. This keeps the benchmark safe to commit while still covering the measurement behaviours that matter before assisted detection:

- clean single-room and long open-plan rectangles
- L-shaped and irregular room geometry
- two-room and multi-section layouts
- wet area, stair void and threshold exclusions
- not-sure boundary sections
- low-confidence scan-like traces
- mixed-boundary plans
- multipage PDF-style page context

Current committed corpus status:

- 14 synthetic fixtures
- 23 reviewed sections
- 9 of 10 coverage targets covered
- remaining gap: approved real reviewed samples

The synthetic corpus is enough for local detection experiments. It is not enough for real detection training or customer-visible detection.

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

## Manual-Seed Baseline Fixture

The manual-seed baseline fixture simulates the recommended human-assisted Phase 3 path: an operator supplies a seed point inside each reviewed section and the system proposes a candidate outline.

This fixture is intentionally conservative:

- it uses synthetic reviewed geometry only
- it records normalized seed points
- it downshifts all candidate confidence to `low` or `medium`
- every candidate enters review as `not_sure`
- selected quote area remains `0`
- candidates are never final, approved or customer-visible

The manual-seed baseline gives future Phase 3 experiments a second comparison target beside quick-room detection. It does not approve assisted detection for public use.

## Manual-Seed Experiment Runner

The local runner lets a future Phase 3 experiment test operator seed points against the synthetic benchmark corpus:

```bash
node internal-qa/scripts/runFloorplanManualSeedExperiment.js \
  --fixture=synthetic-two-room-apartment \
  --seed=0.2,0.2 \
  --seed=0.6,0.2 \
  --json
```

Optional local artifacts:

```bash
node internal-qa/scripts/runFloorplanManualSeedExperiment.js \
  --fixture=synthetic-rectangle-clean \
  --seed=0.2,0.2 \
  --write-artifacts
```

The runner:

- reads synthetic benchmark fixtures only
- rejects seed points outside reviewed sections
- writes no Supabase rows
- reads no real uploads
- creates no customer handoff
- keeps selected quote area at `0`
- reports whether it is safe to continue the local experiment

## Local Artifact Reports

Benchmark reports can be written locally for reviewer comparison and future Phase 3 experiments:

```bash
node internal-qa/scripts/runFloorplanBenchmark.js --write-artifacts
```

or:

```bash
npm run benchmark:floorplan:write
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

## Coverage, Decision, Calibration and Tuning Reports

Phase 3 now has four local-only report types for reviewer planning:

```bash
npm run benchmark:floorplan:coverage
npm run benchmark:floorplan:hybrid-decisions
npm run benchmark:floorplan:hybrid-calibration
npm run benchmark:floorplan:hybrid-tuning
```

They answer different questions:

- coverage: which fixture categories are covered or missing
- hybrid decisions: why the selector chose a method for each fixture
- hybrid calibration: how close the selector is to the best benchmark method
- hybrid tuning: which selector rules to keep, watch or improve

Latest local benchmark direction:

- coverage is strong enough for local synthetic detection spikes
- all hybrid-selector candidates remain review-only
- selected quote area remains `0`
- the only material corpus gap is approved real reviewed samples
- real uploaded plans must be added only after privacy and usage approval

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
- manual-seed contract output is retained in artifacts for reviewer comparison
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
npm run benchmark:floorplan
node internal-qa/tests/web/floorplanBenchmarkCorpusContract.test.js
node internal-qa/tests/web/floorplanCandidateAdapterContract.test.js
node internal-qa/tests/web/floorplanQuickRoomBaselineCandidateContract.test.js
node internal-qa/tests/web/floorplanManualSeedBaselineCandidateContract.test.js
node internal-qa/tests/web/floorplanManualSeedExperimentCliContract.test.js
node internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js
node internal-qa/tests/web/floorplanBenchmarkCliContract.test.js
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
node internal-qa/tests/web/floorplanManualSeedBaselineCandidateContract.test.js
node internal-qa/tests/web/floorplanManualSeedExperimentCliContract.test.js
node internal-qa/tests/web/floorplanBenchmarkReportWriterContract.test.js
node internal-qa/tests/web/floorplanBenchmarkCliContract.test.js
```

## Next Use

Before Phase 3 detection, a candidate detector can be run against this harness by producing candidate sections through the adapter contract. The reviewer-approved geometry remains the source of truth.

Phase 3 should remain blocked until:

- the benchmark passes
- internal reviewer console remains protected
- candidate measurements are reviewer-editable
- candidates are never final by default
- public floorplan and quote handoff still work without detection
