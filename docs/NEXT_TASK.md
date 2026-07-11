# Operon Flooring Next Task

Governance: Operon AI Development System v1.0.0

Last reviewed: 2026-07-12

## Approval gate

One implementation task is explicitly approved for local execution.

Current queue state: implementation ready for user review.

## Active task

- ID: OF-SEO-001
- Status: READY_FOR_REVIEW
- Priority: High
- Business objective: Strengthen the Flooring Quote OS search and conversion path while protecting working indexation and customer trust.
- Technical objective: Consolidate the seven approved duplicate URL sources, reproduce and correct verified mobile/image/content/internal-link issues on existing pages, and establish a measured local baseline.
- Approved specification: `/Users/daibang/.codex/attachments/2d001fbc-8570-4b19-8fc8-8b7ab692bd87/pasted-text.txt`
- ExecPlan: `docs/exec-plans/OF-SEO-001-30-day-seo-sprint.md`
- Repository scope: Operon Flooring repository only; local implementation with no deploy, push, merge or provider change.
- Files likely affected: repository redirect configuration, static-output contracts, approved existing page modules, customer-safe shared layout/CSS where verified, and SEO task documentation.
- Testing: build, typecheck, static output, conversion, public leak, redirect/canonical/sitemap/internal-link checks, responsive browser QA and applicable local gates.
- Risk: mixed prior work in route, sitemap, layout and SEO files; unsupported public claims; mobile collision regressions; accidental room-visualiser inclusion.

## Acceptance criteria

1. Only the approved OF-SEO-001 scope is implemented.
2. Existing quote, product, quote-review, floorplan, upload, pricing and data behaviour is preserved.
3. The seven named duplicate sources resolve through one-hop permanent redirects to canonical owners.
4. No new indexable page, unsupported claim or private-data exposure is introduced.
5. Full local validation and desktop/mobile QA are recorded.
6. The task is marked READY_FOR_REVIEW at implementation handoff, never COMPLETED or ACCEPTED by the implementer.

## Review evidence

- Seven canonical redirects are implemented in repository configuration.
- The 320 px expanded-chatbot collision is corrected and browser verified.
- Existing quote-review, floorplan, apartment, cost-guide and blog-hub ownership is strengthened.
- The repeated logo payload and four extreme gallery images are materially smaller.
- Build, typecheck, static-output, conversion, public-leak and full `test:local-gates` checks pass.
- Generated crawl: 88 sitemap URLs, 95 HTML outputs and zero metadata/canonical/H1/JSON-LD/broken-local-asset issues.
- No deploy, commit, push, merge or provider change occurred.
- Detailed evidence: `docs/IMPLEMENTATION_REPORT.md` and `docs/exec-plans/OF-SEO-001-30-day-seo-sprint.md`.

## Existing worktree treatment

- The room-visualiser branch contains prior local prototype work and incomplete QA. Preserve it, but do not continue, merge, push or deploy it without a new explicit approval here.
- Existing modified SEO/page files and untracked planning documents remain unreviewed by this governance install.
- The nested operon-bathrooms/.next/trace cache is out of scope and must remain untouched.

Historical approval language in other documents does not activate a task in this queue.

## Suggested priorities for user review

These are suggestions only. They are not APPROVED.

1. PROPOSED — Specify fail-closed scheduled follow-up behaviour, manual-invocation protection and regression checks without changing runtime until separately approved.
2. RESEARCH — Review the current room-visualiser branch and decide whether to continue device QA, prepare a merge review, defer it or reject it.
3. RESEARCH — Reconcile the dirty SEO/page work into explicit ownership groups without changing product behaviour.
4. PROPOSED — Reproduce and scope the product-page no-JS/performance findings from the 2026-07-05 audit.
5. PROPOSED — Decide whether the nested operon-bathrooms cache should be removed or relocated in a dedicated cleanup task.
6. PROPOSED — Review historical autonomous agent/task-queue documents for stale authority labels.

## How to approve the next task

1. Copy docs/templates/NEXT_TASK_TEMPLATE.md into this file or populate its fields here.
2. Assign a unique Flooring task ID.
3. Set Status to APPROVED only after explicit user approval.
4. Reference an approved specification containing every required field.
5. Keep at most one task IN_PROGRESS.
6. Do not use a roadmap item or conversation history as approval evidence.

Allowed lifecycle statuses:

- IDEA
- RESEARCH
- PROPOSED
- APPROVED
- IN_PROGRESS
- BLOCKED
- READY_FOR_REVIEW
- ACCEPTED
- REJECTED
- DEFERRED
- SUPERSEDED
- COMPLETED
