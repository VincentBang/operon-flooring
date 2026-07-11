# Operon Flooring Decision Register

Governance: Operon AI Development System v1.0.0

Only entries with Status: APPROVED are authoritative. PROPOSED, REJECTED, DEPRECATED and SUPERSEDED entries are retained for context only.

Required decision statuses:

- PROPOSED
- APPROVED
- REJECTED
- DEPRECATED
- SUPERSEDED

## FLR-DEC-001 — Install shared governance without disturbing existing work

- Decision ID: FLR-DEC-001
- Project: Operon Flooring
- Date: 2026-07-11
- Status: APPROVED
- Context: The repository was confirmed on branch codex/room-visualiser-local-inference-spike with substantial tracked and untracked work. A nested untracked operon-bathrooms/.next/trace cache also creates an isolation risk. The user explicitly approved installing governance alongside the dirty worktree while preserving all current changes and leaving the nested cache out of scope.
- Decision: Install Operon AI Development System v1.0.0 as root-level documentation and governance only. Preserve all pre-existing product changes and historical documents. Make the root APPROVED-task rule authoritative over conflicting autonomous provisions in the preserved internal agent file. Do not remove, relocate or inspect the nested cache beyond the minimum path confirmation.
- Rationale: A controlled root authority hierarchy makes future scope and approval auditable without rewriting or claiming existing product work.
- Alternatives considered: Delay governance until the worktree is clean; discard or stash existing changes; edit the historical internal agent file in place; remove the nested cache. These alternatives were rejected for this installation because they risk loss, provenance confusion or scope expansion.
- Consequences: Future implementation must be queued through docs/NEXT_TASK.md. Historical plans and the current dirty branch no longer provide implicit continuation, merge or deploy authority. Existing work remains available for a later bounded review.
- Risks: Agents may follow the lower-level historical file without reading the root; the dirty worktree may still be accidentally mixed into a future task; the nested cache may be accidentally staged.
- Related files: AGENTS.md, operon-project.yml, docs/CURRENT_STATE.md, docs/NEXT_TASK.md, internal-docs/apps-web/AGENTS.md
- Related tasks: GOV-FLR-001
- Supersedes: None
- Superseded by: None

## Decision template

- Decision ID:
- Project: Operon Flooring
- Date:
- Status: PROPOSED
- Context:
- Decision:
- Rationale:
- Alternatives considered:
- Consequences:
- Risks:
- Related files:
- Related tasks:
- Supersedes:
- Superseded by:

Do not mark a decision APPROVED without explicit evidence of approval. Link the evidence in Context or Related tasks.
