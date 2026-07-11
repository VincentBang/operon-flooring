# Operon Flooring Testing Standard

Reviewed: 2026-07-11

Governance: Operon AI Development System v1.0.0

## Principle

Testing must be proportional to the changed risk and must verify the generated static output where customer URLs are involved. Never claim a command passed unless it was run in the current task.

Do not modify unrelated product code merely to make a pre-existing failure pass.

## Command inventory

| Purpose | Command | Availability |
| --- | --- | --- |
| App install | npm --prefix apps/web-tsx ci | Available; Netlify uses it |
| Development | npm --prefix apps/web-tsx run dev | Available |
| Production build | npm --prefix apps/web-tsx run build | Available |
| Typecheck | npm --prefix apps/web-tsx run typecheck | Available |
| Lint | npm --prefix apps/web-tsx run lint | Declared but not a usable non-interactive gate; next lint opens setup |
| Static output | npm run test:static-output | Available |
| Conversion | npm run test:conversion | Available |
| Public leak scan | npm run check:public-leaks | Available |
| Quote fixtures | npm run test:calculate-quote | Available |
| Stage 3 leads | npm run test:stage3 | Available |
| Stage 3 broader contracts | npm run test:stage3-full | Available |
| Floorplan | npm run test:floorplan-full | Available |
| Broad local gates | npm run test:local-gates | Available; large suite |
| Diff whitespace | git diff --check | Available; does not cover untracked files |

The root package has no generic npm test or npm run build script. Select explicit scripts.

## Minimum validation by change type

### Documentation and governance only

- parse machine-readable YAML or JSON that changed;
- verify required files and required headings;
- scan new text files for trailing whitespace;
- run git diff --check for tracked diffs;
- confirm no product path changed;
- application build/tests are optional only when the worktree is clean and the documentation cannot affect runtime. When an overarching task explicitly requires application validation, run the safe sequence and label results as whole-worktree results.

### Static page, SEO or route

- npm --prefix apps/web-tsx run build
- npm --prefix apps/web-tsx run typecheck
- npm run test:static-output
- npm run check:public-leaks
- relevant conversion tests
- inspect generated canonical, title, description, H1, schema, links and .html output
- git diff --check

### Quote, pricing or product

- all static page gates;
- npm run test:calculate-quote;
- npm run test:conversion;
- targeted pricing/public-leak contracts;
- fixture comparison proving quote outcomes and private fields did not regress;
- explicit security and data review.

Pricing changes require separate approval and must never be hidden inside content or UI work.

### Floorplan, upload or room visualiser

- build, typecheck, static-output and leak gates;
- npm run test:floorplan-full for floorplan behaviour;
- conversion tests for quote handoff;
- supported type/size and privacy boundaries;
- browser object URL/storage cleanup where applicable;
- desktop and mobile viewport QA;
- physical-device or clearly labelled proxy QA when required by the specification.

Do not treat /room-visualiser.html returning 404 in Next development as a product failure: the development route is /room-visualiser, while the .html contract is verified in static export.

### Lead, admin, Netlify Function or Supabase

- targeted function contract tests;
- npm run test:stage3 or npm run test:stage3-full when relevant;
- public response safety and auth-negative tests;
- schema/RLS verification against an explicitly approved non-production or target environment;
- no customer data or secret values in logs;
- no side-effect test against production without explicit approval.

## Safe command order

Run build and typecheck sequentially:

1. npm --prefix apps/web-tsx run build
2. npm --prefix apps/web-tsx run typecheck
3. targeted repository tests
4. npm run check:public-leaks
5. git diff --check

Do not run build and typecheck concurrently because build regenerates .next/types and can cause transient missing-file typecheck failures.

## Dirty-worktree rule

Before testing:

1. record git status;
2. identify pre-existing changes;
3. do not clean, reset, stash or overwrite them without approval;
4. distinguish whole-worktree validation from tests specific to the current task;
5. do not attribute an existing product failure to documentation-only work without evidence.

Generated ignored output may change during build. Never stage it automatically.

## Lint limitation

apps/web-tsx declares next lint, but the current Next version deprecates that workflow and the repository has no ESLint configuration. The command opens an interactive setup prompt.

Until an approved tooling task installs a deliberate lint configuration:

- record lint as unavailable/not run;
- do not treat the prompt as a code lint result;
- rely on TypeScript, builds, targeted tests and diff checks;
- do not create lint configuration as an incidental side effect.

## Test evidence

Every implementation report must include:

- exact command;
- working directory if not the repository root;
- exit/result;
- failure classification: caused by task, pre-existing, environment/tooling, or unknown;
- commands not run and why;
- build status;
- live or side-effect boundaries.

Screenshots, crawl files and provider evidence should be dated and stored only when safe and useful.

## Failure handling

- Stop on a task-caused security, data, route or quote regression.
- Do not weaken a test to fit a change without explicit rationale and approval.
- Reproduce suspected pre-existing failures on the relevant baseline when safe.
- If the baseline cannot be isolated because the worktree is dirty, report uncertainty.
- Never fabricate a pass.
