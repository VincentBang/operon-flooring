# Operon Flooring Floorplan Phase 3 Detection Spike Plan

Date: 2026-06-23

Scope: planning only. Do not start this before Phase 2 internal review console and measurement versioning are working.

## Objective

Test whether semi-automatic floorplan detection can reduce manual measuring time without reducing quote accuracy, privacy, or operator control.

The detection layer should suggest rooms and boundaries. It should not become an autonomous estimator or quote engine.

## Preconditions

Before this spike starts, Operon should have:

- private measurement sessions
- measurement pages
- versioned reviewed measurements
- internal review console
- server-side geometry recalculation
- admin-only signed file access
- reviewed examples suitable for benchmark testing

Without these, detection has nowhere safe to land.

## Detection Boundaries

Allowed:

- local browser-side heuristics for customer suggestions
- server-side or local processing for internal candidates
- room boundary candidates
- confidence scores
- reviewer-facing explanations
- benchmark reports

Not allowed:

- automatic final quote area without human approval
- third-party processing without explicit privacy approval
- customer plan use for model training
- storage paths in browser responses
- raw uploaded file contents in analytics
- internal pricing/rate logic in detection payloads

## Existing Detection Baseline

Current `floorplanQuickRoom.js` already provides a lightweight baseline:

- wall mask creation from image data
- dilation / gap closing
- flood-fill connected region detection
- region confidence classification
- click-inside-room suggestion
- suggest-all candidates
- high-confidence auto-include behavior
- low-confidence manual trace recommendation

This should be benchmarked before adding heavier detection.

## Spike Questions

1. Does current quick-room detection save operator time on clean plans?
2. Which plan types fail most often?
3. Is bounding-box room geometry too crude for real plans?
4. Can better preprocessing improve recall without too many false positives?
5. Does multipage PDF handling need page classification?
6. Is operator correction faster from a candidate than drawing manually?
7. What confidence threshold is safe for auto-including suggested rooms?
8. What explanations help an operator trust or reject candidates?

## Benchmark Dataset

Create a private benchmark set from real uploaded/project plans only when usage rights and privacy allow.

Each benchmark item should include:

- file type
- page count
- plan quality
- scale availability
- reviewed total area
- reviewed room count
- reviewed included/excluded sections
- reviewer notes
- expected confidence

Do not include customer PII in benchmark labels.

## Candidate Methods

### Method A - Current Quick Room Baseline

Use existing:

- thresholding
- wall mask
- flood fill
- connected regions
- rectangular candidate polygons

Advantages:

- already exists
- browser-testable
- no external data transfer
- privacy-safe

Limitations:

- candidate polygons are often rectangular approximations
- struggles with open boundaries, furniture, text, low contrast, scans and plan noise

### Method B - Improved Classical Vision

Possible additions:

- adaptive thresholding
- morphology presets
- line detection
- contour simplification
- edge confidence
- text/noise suppression
- page margin detection

Advantages:

- still deterministic
- can run server-side or client-side
- explainable

Limitations:

- more code complexity
- still brittle on messy residential plans

### Method C - Human-Assisted Detection

Operator starts with:

- set scale
- choose page
- select plan quality preset
- click or box-select room area
- system proposes polygon
- operator corrects

Advantages:

- practical for real operations
- keeps human in control
- avoids black-box behavior

This is the recommended first serious spike path.

Current local QA support:

- `internal-qa/fixtures/floorplanManualSeedBaselineCandidates.js`
- `internal-qa/tests/web/floorplanManualSeedBaselineCandidateContract.test.js`
- benchmark artifacts include a `manual_seed_baseline` section

This baseline is not a detector. It is a safe candidate-method contract for the future human-assisted spike: seed-point input, proposed outline, reviewer inspection, and no selected quote area until approval.

### Method D - External AI / OCR / Vision

Only consider later.

Requirements before use:

- explicit approval
- no training agreement
- no retention or strict retention controls
- redaction where practical
- server-only processing
- audit log
- human approval gate

## Metrics

Track:

- candidate recall
- false positive count
- average area error versus reviewed measurement
- operator correction time
- percentage accepted without redraw
- percentage rejected
- confidence calibration
- failure reason categories

Suggested pass criteria for continuing:

- clean plans: median area difference below 5 percent after operator correction
- messy plans: detection saves time or clearly falls back to manual trace
- no raw data leak
- no direct customer-facing auto-approval

## Prototype Architecture

Input:

- measurement session id
- uploaded file id
- page id
- safe processing settings

Output:

- candidate version with `source = detection_candidate`
- candidate sections
- confidence
- reasons
- processing metadata

Store candidate output as a non-approved version. Reviewer must approve or supersede it.

## Functions

### `admin-floorplan-detection-candidates.js`

Admin-only.

Responsibilities:

- read private uploaded file through service-role
- render or process selected page
- generate candidate sections
- save candidate version
- return safe summary

Response:

- `ok`
- `candidate_version_id`
- `candidate_count`
- `confidence_summary`
- `review_required: true`

Never return:

- storage path
- raw file bytes
- private pricing
- service credentials

## Tests

Unit tests:

- clean rectangle detection
- two adjacent rooms
- open wall gap
- page margin rejection
- tiny text/noise rejection
- low-confidence threshold
- area calculation parity

Integration tests:

- admin-only endpoint denies public access
- candidate version is not approved by default
- operator must approve before quote linkage
- no storage path in response
- benchmark item processing creates safe event log

## Rollout Gate

Do not enable detection broadly until:

- benchmark results are acceptable
- reviewer console can inspect and edit candidates
- detection candidates are never final by default
- public quote flow still works without detection
- privacy review passes

## Recommended First Spike

Run a local-only benchmark using current `floorplanQuickRoom.js` against 10 to 20 known-safe plan samples and produce a report:

- candidate count
- area error versus reviewer area
- confidence distribution
- false positives
- common failure modes
- whether improved classical vision is worth building

Do not deploy this spike to production until the internal review console exists.

## Recommended Next Spike Step

Add a local-only `manual-seed` experiment runner that accepts a benchmark fixture id plus seed points, outputs review-only candidates through the existing adapter, and compares them against the `manual_seed_baseline` artifact.

The runner should:

- never read real uploads by default
- never write Supabase rows
- never mark candidates approved
- never produce customer handoff payloads
- write local benchmark artifacts only when explicitly requested

Status: implemented locally as `internal-qa/scripts/runFloorplanManualSeedExperiment.js`.

Example:

```bash
node internal-qa/scripts/runFloorplanManualSeedExperiment.js \
  --fixture=synthetic-two-room-apartment \
  --seed=0.2,0.2 \
  --seed=0.6,0.2 \
  --json
```

The next detection step can now focus on producing better candidate polygons from seed points, while this runner enforces the review-only safety contract.

## Current Local Phase 3 Progress

Implemented locally:

- quick-room baseline candidate adapter
- manual-seed baseline candidate adapter
- classical contour spike candidate adapter
- hybrid selector spike candidate adapter
- manual-seed experiment runner
- timestamped benchmark artifact writer
- benchmark report comparator
- candidate method ranking report
- hybrid selector decision report
- hybrid selector calibration report
- hybrid selector tuning report
- candidate acceptance/rejection taxonomy
- operator-time estimate report
- benchmark coverage report

Current synthetic corpus:

- 14 synthetic fixtures
- 23 reviewed sections
- clean vector, low-confidence scan, mixed-boundary, multi-section, excluded, not-sure, void/stair-adjacent, multipage and irregular-geometry coverage
- no real customer documents or customer identifiers

Current local result:

- local benchmark harness passes
- hybrid selector stays review-only
- hybrid selector average measured error is inside the current local tolerance
- candidate selected area remains `0` until internal approval
- public/customer floorplan behaviour is unchanged

Remaining gate before operational detection work:

- add approved real reviewed samples with privacy-safe labels and no customer identifiers
- run live/staging admin QA against a safe uploaded file
- keep candidate output internal until a reviewer approves it
- do not expose storage paths or document contents in browser responses

## Next Recommended Local Tasks

1. Add an approved-real-sample intake checklist and fixture redaction template.
2. Add a benchmark fixture manifest contract so synthetic and future real fixtures declare usage/privacy status.
3. Only after the above, consider a disabled admin-only candidate generation endpoint.

Candidate review taxonomy status: implemented locally as `internal-qa/scripts/reportFloorplanCandidateReviewTaxonomy.js`.

The taxonomy classifies candidate output into internal reviewer outcomes such as accept after review, adjust boundary, split or merge sections, exclude section, manual trace fallback, low-confidence fallback, false positive, missing room, and scale/page issue. Every outcome blocks automated approval and stays customer-invisible.

Operator-time estimate status: implemented locally as `internal-qa/scripts/reportFloorplanOperatorTimeEstimates.js`.

The operator-time report compares a manual-trace baseline with review-only candidate handling. It is an internal planning artifact for deciding whether Phase 3 detection saves enough reviewer effort to justify deeper implementation.
