# Operon Flooring Approved Specification Template

Delete all instructional placeholder text before approval. A specification is not authoritative while its Status is IDEA, RESEARCH or PROPOSED.

## Task metadata

- Task ID:
- Project: Operon Flooring
- Status: PROPOSED
- Priority:
- Requested by:
- Approval date:
- Approval evidence:
- Owner:

## Business objective

Describe the user or operating outcome. Do not use a feature name as the objective.

## Technical objective

Describe the smallest technical outcome required to achieve the business objective.

## Scope

List the exact behaviours and deliverables included.

## Out of scope

List adjacent features, refactors, integrations, provider changes and cleanup that are explicitly excluded.

## Repository boundary

- Repository root: /Users/daibang/Documents/New project
- Allowed directories/files:
- Forbidden directories/files:
- Cross-repository access: forbidden unless a bounded read-only comparison is explicitly described here

## Dependencies

List code, data, credentials, provider state, design decisions or prerequisite tasks. State None when there are none.

## Likely files

List expected files. This is a planning aid, not permission to widen scope when implementation reveals more work.

## Acceptance criteria

Use observable, testable statements.

1.
2.
3.

## Required tests

List exact commands and manual checks. Include build, typecheck and risk-specific contracts where applicable.

- Command:
- Expected result:

## Security considerations

- Data classification:
- Threats introduced or changed:
- Secret handling:
- Auth/RLS/storage impact:
- Upload/OCR/logging impact:
- Required security tests:

State No security impact only after explaining why.

## SEO considerations

- Route/canonical impact:
- Metadata/schema/sitemap/robots impact:
- Internal-link impact:
- Content/claim risks:
- Required exported-output checks:

State No SEO impact only after explaining why.

## Data considerations

- Schema/migration impact:
- Read/write impact:
- Retention/deletion impact:
- Analytics impact:
- Production data action:

Any production Supabase action requires separate explicit approval.

## Deployment instruction

Choose one and delete the others:

- Local validation only; do not commit, push, merge or deploy.
- Prepare for review; do not push, merge or deploy.
- Commit only with explicit follow-up instruction.
- Preview deploy explicitly authorised to:
- Production deploy explicitly authorised to:

Build success never implies deployment approval.

## Rollback

Describe code, configuration and data rollback. Identify any irreversible or data-loss risk.

## Completion-report requirements

The completion report must include:

- Task ID
- Result
- Files changed
- Behaviour changed
- Tests run
- Test results
- Build result
- Security review
- SEO review
- Data impact
- Known limitations
- Deferred items
- Recommended follow-up
- Deployment status

## Approval checklist

- [ ] Scope and out-of-scope boundaries are explicit.
- [ ] Repository boundary is correct.
- [ ] Acceptance criteria are testable.
- [ ] Required tests are proportionate.
- [ ] Security, SEO and data impacts are addressed.
- [ ] Deployment and rollback are explicit.
- [ ] The user has explicitly approved this specification.
- [ ] docs/NEXT_TASK.md references this file and marks the matching task APPROVED.
