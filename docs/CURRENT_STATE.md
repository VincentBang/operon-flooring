# Operon Flooring Current State

Snapshot date: 2026-07-12

Governance: Operon AI Development System v1.0.0

This file records verified repository reality. It does not approve implementation.

## Repository

- Confirmed root: /Users/daibang/Documents/New project
- Git root: /Users/daibang/Documents/New project
- Branch at inspection: codex/room-visualiser-local-inference-spike
- HEAD at inspection: 5c5ec07
- Upstream-visible branches at HEAD: main, dev, origin/main and origin/dev
- Package manager: npm
- Lockfiles: package-lock.json at the root and apps/web-tsx/package-lock.json for the deployable app

## Working tree at governance inspection

The repository contained substantial uncommitted work before governance files were added.

- 13 tracked paths were modified.
- 16 untracked status entries were present.
- Product work includes a room-visualiser route, routing, navigation, sitemap, Netlify redirect and static-output contract changes.
- Untracked product documentation includes room-visualiser research, plans, privacy review, QA and SEO planning files.
- apps/web-tsx/tsconfig.tsbuildinfo was already untracked.
- operon-bathrooms/.next/trace was already present as an unrelated untracked nested cache.

The governance install preserves and does not claim authorship of that work. See the Uncommitted work section for the inspection list.

## Framework and application layout

### Deployable frontend

- Path: apps/web-tsx
- Framework: Next.js 15
- UI: React 19
- Language: TypeScript with strict mode
- Output: static export
- Image mode: unoptimized static images
- Generated output: apps/web-tsx/out

At inspection, apps/web-tsx/src/app contained 92 page.tsx routes:

- 31 blog routes;
- 42 routes beginning with /flooring-;
- 19 other public or internal routes.

The count includes the uncommitted /room-visualiser route on the current branch.

### Legacy frontend

- Path: apps/web
- Form: static HTML, CSS and JavaScript
- Observed HTML files: 87
- Role: rollback, reference and some test imports

The legacy app is not the Netlify publish directory. Do not retire or copy from it without an approved migration task.

## Routes and major pages

The production URL contract uses static .html output with explicit extensionless redirects in netlify.toml. The main exceptions are the root route and /blog/ index convention.

Major customer surfaces:

- / — homepage and primary acquisition surface
- /quote.html — multi-step flooring estimate and quote request
- /products.html — product and colour catalogue
- /quote-review.html — quote completeness check and uploaded-document review
- /floorplan.html — floorplan measurement and quote handoff
- /room-visualiser.html — current uncommitted local prototype route
- /contact.html — enquiry
- /recent-flooring-projects.html — project proof
- /hybrid-flooring-sydney.html, /laminate-flooring-sydney.html and /engineered-timber-flooring-sydney.html — product authority
- /flooring-*.html — Sydney local authority pages
- /blog/ and /blog/*.html — decision-support guides
- /privacy-policy.html and /terms.html — policy pages

Internal surfaces:

- /admin.html
- /internal/floorplan-measurements.html

Both internal routes are statically discoverable and must remain noindex and protected through server-side admin controls.

Route ownership is implemented across apps/web-tsx/src/app, apps/web-tsx/src/lib/routes.ts, apps/web-tsx/public/sitemap.xml and netlify.toml.

## Forms

Verified form and interactive workflows include:

- contact enquiry posting to the contact-enquiry Netlify Function;
- hidden Netlify form registration in apps/web-tsx/public/__forms.html;
- instant quote wizard with quote calculation, draft save, email and file-upload stages;
- quote review with quick completeness mode, document upload, OCR, report save and email;
- floorplan upload, scale, manual tracing, quick-room support and quote handoff;
- product selection and quote handoff;
- chatbot routing, qualification and operator-request events.

Side-effect submissions were not run during the governance inspection.

## Lead workflows

Netlify handlers support:

- contact enquiries;
- quote calculation and quote-request persistence;
- quote-review persistence and email;
- customer file upload;
- floorplan measurement-session save and internal review;
- chatbot lead events and operator requests;
- lead status, follow-up and dashboard operations;
- pricing optimisation and follow-up processing.

The root package exposes Stage 3 lead-contract tests and broader local gates. Server-side writes use shared lead and Supabase helpers.

## Netlify Functions

The repository contains 33 top-level JavaScript modules under netlify/functions plus shared helpers under netlify/functions/shared.

Customer-facing handlers include quote calculation, catalogue pricing, quote save, contact, upload, OCR, email, chatbot and runtime-health endpoints.

Admin/internal handlers include session status, lead dashboards and updates, follow-up queues, private quote support and floorplan review/versioning endpoints.

Environment-managed secrets and service-role credentials must remain server-side. No production function or environment configuration was inspected through a live provider during this governance task.

## Supabase usage

Verified repository assets include:

- SQL schemas and seed files under supabase;
- versioned migrations under supabase/migrations;
- draft migrations and RLS verification SQL;
- six Supabase Edge Functions for lead processing, close score, follow-up and pricing-outcome workflows;
- server-side Supabase access from Netlify Functions;
- private storage workflow for customer uploads.

Existing documentation describes operon-prefixed lead, event, note, file, follow-up, floorplan, chatbot, quote and product-range data. Repository files do not prove the live production migration or RLS state. Live Supabase state is an unknown until an explicitly approved verification task checks the target project.

## Uploads

Customer upload surfaces include written quotes and floorplans. The documented security boundary is:

- PDF, JPG, JPEG, PNG and WEBP only unless separately reviewed;
- client and server size/type validation;
- private storage only;
- no public storage paths or permanent URLs;
- short-lived signed access for approved internal workflows;
- no raw OCR or upload content in analytics or public responses.

The current room-visualiser branch is documented as browser-local and must not upload or persist photos or masks.

## Admin tools

The Next app contains:

- an admin shell with session-status check;
- lead list and detail;
- follow-up queue;
- review queues and reporting summary;
- chatbot lead views;
- an internal floorplan measurement console.

Protected data is requested through Netlify Functions. Current token-based admin access is documented as an MVP boundary, not a final least-privilege authentication model.

## Analytics

- GA4 measurement ID is documented as G-T2LEXZJM3Q.
- Tracking is present in shared public runtime and quote/quote-review surfaces.
- Allowed events cover page, funnel step, product category, quote mode, area method, confidence, review flags and source context.
- Personal information, notes, uploaded content, file names, raw OCR, raw quote payloads and internal pricing are forbidden from analytics.

Analytics configuration and live data collection were not verified against the production property during this governance task.

## SEO implementation

Verified local SEO surfaces include:

- static exported pages with per-route metadata;
- canonical .html URLs;
- XML sitemap and robots.txt in apps/web-tsx/public;
- Netlify redirects for extensionless and legacy aliases;
- structured data and Open Graph metadata on relevant pages;
- product, suburb, guide, comparison and project content;
- static-output regression coverage for route, CTA, canonical and public-content boundaries.

The 2026-07-05 audit recorded 87 canonical sitemap URLs and healthy sampled route behaviour at that time. The current dirty worktree contains 88 sitemap entries because the uncommitted room-visualiser work adds another route. Neither count should be treated as current production truth without a fresh production crawl.

## Deployment model

netlify.toml defines:

- build command: npm --prefix apps/web-tsx ci && npm --prefix apps/web-tsx run build
- publish directory: apps/web-tsx/out
- security and caching headers;
- explicit redirects and 404 protections;
- Netlify Functions from netlify/functions.

Next.js uses output: export. No deployment, push, merge, Netlify production change or production Supabase change is authorised by this file.

## Active work

### OF-SEO-001 local review candidate

The approved 30-day SEO implementation sprint is locally `READY_FOR_REVIEW`.

- Repository redirects now consolidate `/blog` and six extensionless quote-guide sources onto their canonical owners.
- `/blog.html` remains a forced 404.
- Current local sitemap count remains 88, including the preserved prior room-visualiser route; the SEO sprint added no new indexable page.
- Quote review, floorplan, apartment flooring, installation-cost and blog-hub content/link ownership is stronger.
- The site-wide delivered logo uses a 16,422-byte WebP while the original PNG remains.
- Four extreme product gallery JPEGs were resized/recompressed in place without changing catalogue records or URLs.
- Browser checks at 320, 390 and 1440 px found no horizontal overflow or broken images on priority routes.
- Build, typecheck, static-output, conversion, leak and the full local gate passed.
- No deployment, push, merge, Supabase change or production-provider change occurred.

See `docs/IMPLEMENTATION_REPORT.md` for exact evidence and limitations.

### Room visualiser local prototype

The current branch contains uncommitted room-visualiser work. Existing project documents record:

- a sample-room visualiser and browser-local manual mask;
- a browser-native canvas/ImageData assist prototype;
- no model package or model asset;
- no server upload, storage, vendor API or quote handoff of photo/mask state;
- incomplete real upload/prototype execution QA and incomplete physical iPhone/Android checks;
- a not-ready-to-merge decision dated 2026-07-11.

This work predates governance v1.0. It is not an active approved task in docs/NEXT_TASK.md.

### SEO planning and page changes

The dirty worktree also contains modified product/local page support files and untracked SEO planning/monitoring documents. They were not reconciled, accepted or changed by the governance install.

## Current risks

1. Dirty-worktree provenance: existing product and documentation changes are interleaved and uncommitted.
2. Nested product-name cache: operon-bathrooms/.next/trace is inside the Flooring Git root. It is not a separate Git repository or runtime dependency, but it is an isolation and accidental-inclusion risk.
3. Conflicting historical agent rules: internal-docs/apps-web/AGENTS.md permits unattended work and some changes without approval. Root governance now suspends those provisions.
4. Historical cross-product planning: internal documents contain a proposed Operon Kitchens reuse/integration path. It is not authority and must not create a dependency.
5. Public pricing-support JavaScript remains an architectural exposure even though no critical public leak was confirmed by the 2026-07-05 audit.
6. Admin token access is an MVP gate and should not be treated as scalable least-privilege authentication.
7. Live Supabase RLS, storage and migration state is not proven by local SQL.
8. Revenue-sensitive route, quote, product and redirect changes require preview and proportionate regression testing before any future release decision.
9. `netlify/functions/process-followups.js` is scheduled every ten minutes and treats a missing `OPERON_FOLLOWUP_SEND_ENABLED`/`ENABLE_FOLLOWUP_SEND` value as enabled. Repository documents describe follow-up sending as dry-run or disabled until approved, so the function currently fails open if deployed without an explicit false setting. Production environment state is unknown and the runtime must not be changed inside this documentation task.

## Technical debt

- Legacy apps/web and apps/web-tsx coexist, with duplicated runtime/support files and some tests still importing legacy paths.
- The app lint script uses deprecated next lint and is not a non-interactive gate because no ESLint configuration exists.
- Public products output is JavaScript-dependent and the 2026-07-05 audit identified product-page performance and no-JS content as major weaknesses.
- Public pricing-support files should shrink as server-side pricing matures.
- Browser storage and floorplan draft behaviour need a deliberate long-term privacy/retention design.
- Admin auth should move beyond a shared token before operational scale.
- Historical planning documents need authority labels and conflict review under governance v1.0.

## Known bugs

The latest repository audit, dated 2026-07-05, recorded:

- quote explainer copy did not match the active six-step wizard;
- product static/no-JS output was weak;
- some older local pages displayed a template-like Internal links heading;
- quote honeypot accessibility/crawl visibility needed hardening;
- repeated local FAQ patterns and weak local-page uniqueness remained;
- product-page Total Blocking Time and hydration were the largest measured performance risk.
- scheduled follow-up processing defaults to sending when its enable flag is absent, which conflicts with the documented dry-run-first policy.

Some may have changed in the current dirty worktree. Reproduce before fixing.

## Unknowns

- Current production deploy commit and whether it matches this checkout
- Current Netlify environment and function configuration
- Whether production explicitly sets `OPERON_FOLLOWUP_SEND_ENABLED=false` (or the legacy equivalent) for the scheduled follow-up processor
- Current production Supabase migrations, RLS, grants, storage policies and data
- Current GA4 event health and Search Console performance
- Full side-effect QA for quote, contact, email, OCR and upload workflows
- Physical device results for the room-visualiser prototype
- Ownership and intended disposition of operon-bathrooms/.next/trace

## Documentation gaps

- Historical autonomous task-queue guidance conflicts with governance v1.0.
- Several roadmap documents mix current facts, proposals and future reuse concepts.
- The large quote architecture plan contains a future Operon Kitchens reuse section that is non-authoritative under repository isolation.
- No governance-standard approved implementation task existed at installation.
- Live provider state needs dated evidence whenever it becomes relevant.

## Uncommitted work

Pre-governance tracked modifications:

- apps/web-tsx/public/sitemap.xml
- apps/web-tsx/src/app/engineered-timber-flooring-sydney/page.tsx
- apps/web-tsx/src/app/hybrid-flooring-sydney/page.tsx
- apps/web-tsx/src/app/laminate-flooring-sydney/page.tsx
- apps/web-tsx/src/app/page.tsx
- apps/web-tsx/src/components/layout/Footer.tsx
- apps/web-tsx/src/components/layout/Header.tsx
- apps/web-tsx/src/lib/legacyAdditionalPages.ts
- apps/web-tsx/src/lib/legacySeoPages.ts
- apps/web-tsx/src/lib/routes.ts
- docs/operon-flooring-keyword-url-ownership-map.md
- internal-qa/tests/web/staticOutputContract.test.js
- netlify.toml

Pre-governance untracked status entries:

- apps/web-tsx/src/app/room-visualiser/
- apps/web-tsx/tsconfig.tsbuildinfo
- docs/operon-flooring-room-visualiser-assisted-mask-architecture-comparison.md
- docs/operon-flooring-room-visualiser-browser-inference-spike-plan.md
- docs/operon-flooring-room-visualiser-device-qa-report.md
- docs/operon-flooring-room-visualiser-local-prototype-branch.md
- docs/operon-flooring-room-visualiser-master-plan.md
- docs/operon-flooring-room-visualiser-privacy-performance-review.md
- docs/operon-flooring-room-visualiser-qa-report.md
- docs/operon-flooring-room-visualiser-research.md
- docs/operon-flooring-seo-ctr-test-log.md
- docs/operon-flooring-seo-master-plan.md
- docs/operon-flooring-seo-monitoring-template.md
- docs/operon-flooring-seo-next-sprint-plan.md
- docs/operon-flooring-seo-sprint-f-local-page-upgrade.md
- operon-bathrooms/

This list is a provenance snapshot, not approval to modify, stage or commit any item.
