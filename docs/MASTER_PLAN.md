# Operon Flooring Master Plan

Reviewed: 2026-07-11

Governance: Operon AI Development System v1.0.0

This is a controlled roadmap index. It does not approve implementation. An item becomes implementable only when docs/NEXT_TASK.md marks one task APPROVED and references an approved specification.

Each item below appears once in this document. Detailed historical plans remain preserved in their original files.

## Completed

### Governance foundation — COMPLETED

Root governance, project manifest, current-state record, authority hierarchy, decision registry, controlled task queue, architecture, testing, deployment, reporting and templates were installed on 2026-07-11.

### Next.js static-export foundation — COMPLETED

The primary site is implemented in apps/web-tsx and deployed through static export, with the legacy apps/web surface retained for rollback/reference. Historical migration evidence lives under docs/html-to-tsx-migration.

### SEO foundation and recorded sprint history — COMPLETED

The SEO master plan records technical/crawl hygiene and page-improvement sprints as completed through its historical sprint series. Current production performance must still be refreshed before making new outcome claims.

## In progress

### Room visualiser local prototype and device QA — IN_PROGRESS before governance

The branch codex/room-visualiser-local-inference-spike contains uncommitted sample-room, browser-local manual masking and canvas/ImageData assist work. The 2026-07-11 device QA record says it is not ready to merge.

Governance treatment: frozen for review. Prior branch documents record a narrow local prototype approval, but docs/NEXT_TASK.md does not currently approve continuation, merge or deploy.

### Dirty SEO/page worktree reconciliation — IN_PROGRESS before governance

Modified product/local page support files and untracked SEO planning documents exist. Their provenance, acceptance state and intended grouping have not been reconciled by this governance task.

Governance treatment: preserve until the user approves a bounded review or disposition task.

## Approved

No implementation roadmap item is APPROVED under governance v1.0.0.

The governance documentation installation itself was explicitly approved and is recorded as completed, not queued implementation.

## Planned

### Scheduled follow-up fail-closed hardening — PROPOSED

The scheduled follow-up processor currently defaults to sending when its enable flag is absent, while operating documents require dry-run-first behaviour. Prepare a narrowly scoped security specification to make sending fail closed, protect manual invocation, add regression tests and verify provider configuration before any runtime change.

### Product-page no-JS and performance remediation — PROPOSED

The 2026-07-05 audit identifies the product page as the largest measured performance risk and notes weak static/no-JS content. Reproduce the issue and define a revenue-safe preview plan before approval.

### Quote copy and form-hardening cleanup — PROPOSED

The 2026-07-05 audit records a quote step-count copy mismatch and honeypot visibility concerns. Reproduce each finding and specify acceptance checks before implementation.

### Local authority quality cleanup — PROPOSED

Historical audits identify template-like headings, repeated FAQ patterns and thin or weakly differentiated local pages. Prioritise from current Search Console evidence and avoid broad template churn.

### Server-side pricing exposure reduction — PROPOSED

Continue reducing public pricing-support surface without changing quote outcomes or exposing private pricing. This requires a dedicated architecture/security specification and regression fixtures.

### Admin authentication hardening — PROPOSED

Replace the temporary shared-token model with least-privilege authenticated access before operational scale. Requires an approved identity, migration and rollback design.

## Research

### Live provider state verification — RESEARCH

Establish dated evidence for the production deploy commit, Netlify configuration, Supabase migrations/RLS/storage policy state, analytics health and Search Console performance. Provider access and any side effects require explicit approval.

### Room visualiser QA completion and disposition — RESEARCH

Review the current branch, complete permission-safe device evidence where possible, and prepare a merge/reject/defer decision. Do not add model assets, storage, vendor calls or production changes during research.

### Floorplan real-sample and operational-readiness evidence — RESEARCH

Existing documents describe a locally implemented internal review/versioning foundation and a real-sample evidence gate. Any live admin or Supabase verification requires separate approval.

## Ideas

### Private Quote OS operations console — IDEA

Potential future lead, site-measure, quote-version, proposal and follow-up workflow. Existing architecture documents are planning material only.

### Proposal generation and quote versioning — IDEA

Potential future server-side proposal workflow using reviewed project and pricing data. No implementation approval exists.

### Commercial room-visualiser or 3D evaluation — IDEA

Potential vendor integration, supplier catalogue mapping or 3D planning only after the current customer value, privacy and performance gates are proven.

## Deferred

### Cross-product infrastructure reuse — DEFERRED

Historical files discuss future Operon Kitchens reuse. Under governance v1.0.0, product repositories, data, routes and runtime dependencies remain isolated. Any comparison must be bounded, read-only and explicitly approved.

### Production release of current dirty work — DEFERRED

No current branch work may be pushed, merged or deployed until provenance, validation and approval are explicit.

### Nested operon-bathrooms cache disposition — DEFERRED

The untracked operon-bathrooms/.next/trace cache is out of scope and untouched. Removal or relocation needs a separately approved cleanup task.

## Rejected

No repository-specific roadmap item is recorded as REJECTED in this governance index.

Repository-wide prohibitions such as merging product repositories are governance constraints, not roadmap items.

## Future

### Mature private pricing engine — FUTURE

Move sensitive calculation inputs and commercial rules behind customer-safe server responses while preserving quote fixtures and public estimate behaviour.

### Authenticated operational platform — FUTURE

Evolve admin, measurement review, lead operations and audit trails into a least-privilege internal platform.

### Privacy-governed assisted measurement and visualisation — FUTURE

Consider assisted detection or visualisation only with explicit data-flow, consent, retention, performance, model-source, manual-correction and rollback decisions.

## Roadmap maintenance

- Move an item between sections; never duplicate it.
- Record user approval in docs/NEXT_TASK.md, not here.
- Record durable architecture decisions in docs/DECISIONS.md.
- Update docs/CURRENT_STATE.md when verified reality changes.
- Mark obsolete source plans as historical rather than deleting them silently.
