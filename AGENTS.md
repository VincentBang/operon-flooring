# Operon Flooring Repository Governance

Status: active root-level instructions for this repository

Governance: Operon AI Development System v1.0.0

Installed: 2026-07-11

Last reviewed: 2026-07-11

## 1. Project identity

- Project: Operon Flooring
- Project code: flooring
- Business identity: Flooring Quote OS
- Repository: isolated product repository

## 2. Business purpose

Operon Flooring is a quote-led flooring authority and operating platform supporting products, instant quote, quote review, floorplan upload, manual review, future AI measurement, room visualisation and internal quote operations.

The primary operating path is:

Traffic -> Trust -> Instant Quote -> Quote Validation -> Data Capture -> System Intelligence

Product behaviour, data, routes, SEO strategy and deployment remain specific to Operon Flooring.

## 3. Repository root

The verified repository root is:

    /Users/daibang/Documents/New project

Do not infer another checkout from the product name. Confirm the Git root before every write.

## 4. Shared governance version

- Standard: Operon AI Development System
- Version: 1.0.0
- Source: /Users/daibang/Documents/operon-development-system
- Installed: 2026-07-11
- Last reviewed: 2026-07-11

Governance upgrades require an explicit comparison against local rules. Never overwrite product facts automatically.

## 5. Local authority hierarchy

Use this order when instructions conflict:

1. This root AGENTS.md
2. operon-project.yml
3. docs/NEXT_TASK.md
4. The approved specification referenced by docs/NEXT_TASK.md
5. docs/DECISIONS.md, but only APPROVED decisions
6. docs/CURRENT_STATE.md
7. Operon AI Development System v1.0.0
8. docs/MASTER_PLAN.md
9. Scoped or historical agent files, prompts, brainstorms and old discussions

Repository reality wins over documentation when they conflict. Stop and record the conflict before changing code.

The existing internal-docs/apps-web/AGENTS.md is preserved as product history and detailed domain guidance. It is subordinate to this file. Its unattended execution rules and any “safe without approval” provisions are suspended when they conflict with the approval gate here.

## 6. Allowed work

Allowed work is limited to the scope of the single task explicitly marked APPROVED in docs/NEXT_TASK.md, plus the approved specification it references.

Within that boundary:

- inspect the repository and relevant source-of-truth documents;
- make the smallest reversible change that satisfies the acceptance criteria;
- add or update proportionate tests;
- update required governance records;
- run local, non-production validation;
- report blockers without widening scope.

Read-only investigation is not implementation approval.

### Path-level allowlist

An approved specification must name the exact paths it may change. The normal Operon Flooring path set is:

- `apps/web-tsx/` — primary customer and internal application;
- `apps/web/` — legacy rollback/reference surface, read-only unless a migration or rollback task explicitly allows edits;
- `netlify/functions/` — server functions, only when the approved task names backend scope;
- `supabase/` — schemas, migrations and Edge Functions, only when the approved task names data scope; production application remains separately approval-gated;
- `internal-qa/` and `scripts/` — tests and local validation supporting the approved task;
- `docs/` and `internal-docs/apps-web/` — Flooring documentation, subject to the authority hierarchy in this file;
- root Flooring configuration files — only when the approved task explicitly names them.

Presence in this list is not standing edit permission. Files are writable only when they are inside the current approved task scope.

## 7. Forbidden work

Unless an approved task states otherwise, do not:

- change customer-facing functionality, routes, architecture or product logic;
- change quote calculations, pricing rules, supplier costs, margins or product data;
- change upload, OCR, email, analytics, admin or chatbot integrations;
- add runtime dependencies;
- change database schemas, RLS, storage policies or production data;
- change Netlify settings, environment variables or deployment pipelines;
- commit, push, merge, deploy or trigger production work;
- delete or overwrite existing dirty-worktree changes;
- turn a roadmap, research document, historical prompt or conversation into implementation authority.

## 8. Forbidden repositories

Do not inspect, modify or reference another Operon product repository unless the current approved task explicitly authorises a bounded read-only comparison.

Cross-repository modification is forbidden.

Forbidden product repositories include:

- Operon Kitchens
- Operon Bathrooms
- Oz Timber

The untracked operon-bathrooms directory inside this Git root is an isolation risk, not a dependency. Leave it untouched unless a separately approved cleanup task explicitly names it.

### Path-level denylist

Unless a separate approved task explicitly changes the boundary, do not edit or stage:

- `operon-bathrooms/`;
- any Operon Kitchens or Oz Timber checkout;
- parent-directory repositories or shared external governance sources;
- `.git/`, provider state folders, local credential stores or environment files;
- generated `node_modules/`, `.next/`, `apps/web-tsx/out/`, cache, trace, screenshot or report output as source changes;
- production Netlify or Supabase state through a local documentation or application task.

## 9. Architecture summary

- Primary deployable frontend: apps/web-tsx
- Frontend framework: Next.js 15 with React 19 and TypeScript
- Output model: static export to apps/web-tsx/out
- Legacy rollback/reference frontend: apps/web
- Server layer: Netlify Functions under netlify/functions
- Data layer: Supabase SQL migrations and Edge Functions under supabase
- Hosting: Netlify
- Public URL contract: canonical .html pages with explicit extensionless redirects, plus the root and blog index conventions
- Internal surfaces: /admin.html and /internal/floorplan-measurements.html, protected through server-side admin controls

See docs/ARCHITECTURE.md for the verified current-state detail.

## 10. Product-specific routes and workflows

Major public workflows include:

- /quote.html for the instant estimate and quote request;
- /products.html for product and range browsing;
- /quote-review.html for quote completeness and document review;
- /floorplan.html for customer measurement and floorplan handoff;
- /room-visualiser.html on the current uncommitted prototype branch;
- /contact.html for enquiries;
- product, local authority, project and blog routes for acquisition and decision support.

Sensitive workflows include customer file upload, OCR, lead writes, email, floorplan review, admin reporting, follow-up processing and private pricing support.

Do not assume the legacy apps/web implementation is the deployed source. Verify netlify.toml and apps/web-tsx first.

## 11. Build commands

Package manager: npm.

- Install for the deployable app: npm --prefix apps/web-tsx ci
- Local development: npm --prefix apps/web-tsx run dev
- Production build: npm --prefix apps/web-tsx run build
- Netlify-equivalent build: npm --prefix apps/web-tsx ci && npm --prefix apps/web-tsx run build
- Typecheck: npm --prefix apps/web-tsx run typecheck

The root package supplies Netlify tooling and repository QA commands. It does not define a single generic build script.

## 12. Test commands

Choose tests based on changed risk:

- Static export contract: npm run test:static-output
- Conversion workflows: npm run test:conversion
- Public leak scan: npm run check:public-leaks
- Quote fixtures: npm run test:calculate-quote
- Stage 3 lead contracts: npm run test:stage3
- Floorplan suite: npm run test:floorplan-full
- Broad local gates: npm run test:local-gates
- Whitespace: git diff --check

The app exposes npm --prefix apps/web-tsx run lint, but the current next lint command opens an ESLint setup prompt because no ESLint configuration is installed. Do not claim lint passed unless that command actually completes non-interactively.

See docs/TESTING.md for the validation matrix and reporting rules.

## 13. Coding standards

- Follow the existing TypeScript, React, JavaScript and CommonJS patterns in the affected area.
- Keep the static-export and .html route contract intact.
- Prefer existing components and helpers over duplicated product or pricing logic.
- Keep changes narrow, reversible and testable.
- Do not hand-edit generated apps/web-tsx/out output.
- Do not remove legacy files until an approved migration or retirement task authorises it.
- Preserve mobile-first, accessible and plain-English customer experiences.
- Never invent customer proof, reviews, guarantees, projects or compliance claims.

## 14. Security rules

Before editing quote, upload, storage, email, OpenAI, analytics, admin or security-sensitive code, read docs/security/SECURITY_POLICY.md.

- Never print, commit or expose secret values.
- Keep service-role, email-provider, admin and model credentials server-side.
- Treat personal data, project data, uploads, OCR text and internal commercial data according to their classifications.
- Validate untrusted input and files on the server.
- Never log full customer payloads, upload contents, raw OCR text or secrets.
- Keep analytics free of personal data and internal pricing.
- Add a regression check for every corrected security failure.

## 15. Supabase rules

- Production Supabase changes always require explicit approval.
- Schema migrations, RLS, grants, storage policies, Edge Function deployment and production data changes are separate approval boundaries.
- Public browsers must not select lead, quote, upload, event, review, pricing or admin tables directly.
- Service-role credentials are server-only.
- Customer upload buckets must remain private; public responses must not expose bucket names, storage paths or permanent URLs.
- Run RLS verification only against an explicitly approved target and never infer production authority from local SQL files.

## 16. Netlify rules

- netlify.toml is production-sensitive.
- Do not change build, publish, redirect, header, function or environment configuration without explicit task scope.
- Preserve publish = apps/web-tsx/out and the established .html routing contract unless an approved architecture decision changes them.
- Netlify Functions must restrict methods, validate payloads, return safe errors and protect admin paths.
- Never trigger a Netlify deploy or production environment change unless explicitly approved.

## 17. SEO rules

- Preserve canonical, sitemap, robots, metadata, structured-data and .html URL ownership.
- Keep /blog.html as the approved 404 route and preserve redirect-only aliases.
- Do not create thin, duplicate or doorway suburb pages.
- Use practical flooring-specific content and natural contextual links.
- Keep quote, quote review, products and floorplan conversion paths clear.
- Do not use fake authority, unsupported superlatives, legal-advice wording or promise-like guarantees.
- Validate title, description, canonical, H1, schema, internal links and exported output for affected pages.

## 18. Deployment restrictions

- Automatic deployment: forbidden.
- Push to main: forbidden.
- Production changes: forbidden by default.
- Commit, push, merge and deploy each require explicit instruction.
- A successful build is not deployment approval.
- Preview or staging validation must not create customer-facing side effects without separate approval.

See docs/DEPLOYMENT.md.

## 19. Approved-task rule

Never implement from historical discussion, brainstorms, abandoned prompts or inferred intent. Implement only work explicitly marked APPROVED in `docs/NEXT_TASK.md` or in an approved specification referenced by it.

Only one task may be IN_PROGRESS at a time. If docs/NEXT_TASK.md says no task is approved, stop after read-only inspection and request approval.

The current room-visualiser worktree records prior local prototype approval in historical project documents, but it is not automatically an active APPROVED task under this governance queue. Do not continue, merge or deploy it until docs/NEXT_TASK.md explicitly authorises that action.

## 20. Completion-report rule

Every completed implementation must update:

- docs/IMPLEMENTATION_REPORT.md
- docs/CURRENT_STATE.md
- docs/CHANGELOG_AI.md

The report must list the exact files changed, behaviour changed, commands actually run, results, build status, security review, SEO review, data impact, known limitations, deferred work, recommended follow-up and deployment status.

Never claim success for a test that was not run.

## 21. Documentation-update rule

- Update documentation in the same task when behaviour or verified state changes.
- Record durable architecture decisions in docs/DECISIONS.md.
- Move roadmap items between sections rather than duplicating them.
- Keep docs/NEXT_TASK.md controlled and approval-specific.
- Mark stale historical documentation clearly; do not delete it silently.
- Record governance upgrades, deviations and review dates.

## 22. Escalation rule for contradictions

Stop and report before writing when:

- repository reality conflicts with the approved specification;
- two authoritative local documents disagree;
- a task crosses a repository, production, secret, data or deployment boundary;
- dirty changes overlap the intended files and ownership is unclear;
- a requested change would weaken security, route ownership or product isolation;
- continuing would require guessing approval.

Record the contradiction, the files involved and the smallest decision needed from the user. Do not resolve high-risk ambiguity by assumption.
