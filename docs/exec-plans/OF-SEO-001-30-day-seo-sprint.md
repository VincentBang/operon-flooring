# OF-SEO-001 - 30-Day SEO Implementation Sprint

- Task ID: OF-SEO-001
- Project: Operon Flooring
- Status: READY_FOR_REVIEW
- Date approved: 2026-07-12
- Execution boundary: local implementation only
- Approved specification: `/Users/daibang/.codex/attachments/2d001fbc-8570-4b19-8fc8-8b7ab692bd87/pasted-text.txt`

## Verified current state

- Repository root: `/Users/daibang/Documents/New project`
- Branch: `codex/room-visualiser-local-inference-spike`
- Primary app: Next.js 15, React 19 and TypeScript under `apps/web-tsx`
- Build output: static export under `apps/web-tsx/out`
- Deploy source: repository-controlled `netlify.toml`
- Canonical convention: `.html` for generated pages, `/` for home and `/blog/` for the blog hub
- Current dirty sitemap: 88 URLs, including prior uncommitted room-visualiser work
- Existing worktree: mixed SEO, room-visualiser, route, layout, test and governance changes; preserve all prior edits
- Parallel-work check: no Git lock, recent overlapping writer or local Next/Netlify dev server found before implementation
- Known tooling limitation: `next lint` opens interactive setup and is not a usable lint gate

## Approved scope

1. Verify and consolidate the seven named duplicate URL sources.
2. Protect mobile conversion controls from sticky CTA/chatbot/navigation collisions.
3. Reduce approved image-delivery weight without changing brand identity or product data.
4. Improve search-intent ownership on existing quote, quote-review, floorplan, quote guide, checklist, cost and apartment pages.
5. Improve contextual internal links into the Quote OS workflow.
6. Change metadata only where intent ownership is materially unclear.
7. Audit customer-safe analytics event coverage without adding personal or sensitive payloads.
8. Create business-proof and provider-export requirement documents.

## Out of scope

- New indexable pages, suburb pages, product-suburb pages or facets
- Room visualiser implementation or QA
- Quote calculations, pricing, product catalogue data or lead scoring
- Floorplan geometry, detection, OCR, storage or handoff logic
- Supabase migrations, RLS, storage, production data or provider settings
- Admin, authentication, email or backend behaviour
- GA4, GSC, GBP or Tag Manager account changes
- Deployment, push, merge or production changes
- Operon Kitchens, Operon Bathrooms, Oz Timber or parent/shared repositories

## Milestones

### M0 - Baseline and verification

- Record commands, route ownership, sitemap, redirects, canonicals, image pipeline, fixed mobile elements, analytics and schema.
- Run build, typecheck, static-output, conversion, leak and safest local route checks.

### M1 - Canonical URL consolidation

- Add one-hop permanent redirects for the six approved extensionless quote-guide URLs and `/blog`.
- Preserve canonical targets, query strings, `/blog/` ownership and `/blog.html` 404.
- Add redirect and internal-link regression coverage.

### M2 - Mobile conversion protection

- Inspect 320, 375, 390 and 430 px layouts plus zoom/focus/keyboard-safe states where locally reproducible.
- Apply the smallest CSS/layout fix required to prevent CTA, chatbot, navigation and form overlap.

### M3 - Image and payload optimisation

- Inventory delivered logo, product, project and above-fold assets.
- Generate or select smaller delivery variants only where source quality and path ownership are clear.
- Preserve originals, alt text, dimensions and stable layout.

### M4 - Existing-page ownership

- Improve only `/quote.html`, `/quote-review.html`, `/floorplan.html`, `/flooring-quote-sydney.html`, the existing quote checklist, `/flooring-installation-cost-sydney.html` and `/apartment-flooring-sydney.html` where verified gaps remain.

### M5 - Internal links

- Build a generated-output inbound-link baseline.
- Add useful contextual links to high-value tools and owner pages without footer stuffing or exact-match repetition.

### M6 - Metadata and structured-data discipline

- Preserve existing aligned metadata and valid schema.
- Add no unsupported reviews, ratings, offers, business facts or compliance claims.

### M7 - Analytics and provider boundary

- Verify safe funnel-event coverage.
- Create `docs/SEO_DATA_EXPORT_REQUIREMENTS.md`.
- Create `docs/SEO_BUSINESS_PROOF_REQUIRED.md` if business proof is incomplete.

### M8 - Full validation and handoff

- Run all applicable local gates, crawl checks, structured-data checks, responsive visual QA and smoke checks.
- Update governance documents and mark the task READY_FOR_REVIEW only.

## Likely files

- `netlify.toml`
- `internal-qa/tests/web/staticOutputContract.test.js`
- `apps/web-tsx/src/app/quote/page.tsx`
- `apps/web-tsx/src/app/quote-review/page.tsx`
- `apps/web-tsx/src/app/floorplan/page.tsx`
- `apps/web-tsx/src/app/apartment-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/flooring-quote-sydney/page.tsx`
- `apps/web-tsx/src/app/flooring-installation-cost-sydney/page.tsx`
- `apps/web-tsx/src/app/blog/flooring-quote-checklist/page.tsx`
- shared CSS/layout files only if verified mobile/image issues require them
- `docs/SEO_BUSINESS_PROOF_REQUIRED.md`
- `docs/SEO_DATA_EXPORT_REQUIREMENTS.md`
- governance and task-report documents

Existing dirty files remain owned by their prior work unless this sprint records a specific compatible edit.

## Risks

- Mixed worktree can hide provenance or create accidental room-visualiser inclusion.
- `netlify.toml`, route tests, header/footer and sitemap already contain prior changes.
- Static export cannot reproduce Netlify redirects without a local redirect-aware server.
- Mobile keyboard behaviour cannot be fully proven without physical-device testing.
- Image conversion can degrade genuine project/product fidelity if done mechanically.
- Content claims around strata, acoustics, warranties, reviews and business identity require verified proof.
- Live ranking, CTR and provider state cannot be inferred from local output.

## Validation commands

- `npm --prefix apps/web-tsx run build`
- `npm --prefix apps/web-tsx run typecheck`
- `CI=1 npm --prefix apps/web-tsx run lint` (expected tooling limitation unless configuration changes separately)
- `npm run test:static-output`
- `npm run test:conversion`
- `npm run check:public-leaks`
- `npm run test:local-gates`
- `git diff --check`
- focused redirect, canonical, sitemap, internal-link, image, schema and accessibility checks added by this task
- local desktop/mobile browser QA at 320, 375, 390 and 430 px

## Progress log

- 2026-07-12: repository, branch, dirty worktree and no-active-writer state verified.
- 2026-07-12: approved specification read; governance and relevant SEO/route/security documents reviewed.
- 2026-07-12: ExecPlan created and task activation prepared before application edits.
- 2026-07-12: isolated baseline build, typecheck, static-output, conversion and leak checks passed; lint was confirmed interactive/unavailable.
- 2026-07-12: seven canonical redirects and direct `/blog/` breadcrumb ownership implemented with regression coverage.
- 2026-07-12: browser QA reproduced a 26 px expanded-chatbot overlap at 320 by 640; a bounded dynamic-height fix removed the collision.
- 2026-07-12: canonical logo delivery moved from a 373,209-byte PNG to a 16,422-byte WebP while preserving the PNG source.
- 2026-07-12: four 19-25 MB product gallery JPEGs reduced to 333-440 KB each without changing URLs or product records.
- 2026-07-12: quote-review, floorplan, apartment, installation-cost and blog-hub content/internal links strengthened.
- 2026-07-12: provider export and business-proof requirement documents created.
- 2026-07-12: final build, typecheck, static-output, conversion, public-leak and full local gate passed.
- 2026-07-12: generated crawl returned 0 issues across 88 sitemap URLs and 95 HTML outputs; responsive browser checks passed at 320, 390 and 1440 px.

## Discovery log

- Current dirty sitemap has 88 entries, not the research baseline of 87, because prior room-visualiser work adds one URL.
- `netlify.toml` already redirects most extensionless pages but not the six named quote guides or `/blog`.
- `/blog.html` has an explicit forced 404 and must remain unchanged.
- The current worktree contains prior edits to route, sitemap, header/footer, product/category pages and static contracts; this sprint must preserve them.
- The lint command is interactive and cannot currently produce a lint result.
- Next Link normalised `routes.blog` to `/blog` in generated breadcrumbs even though the route constant included a trailing slash. Plain canonical anchors were required for `/blog/` ownership.
- The first full local-gate run failed only at the final logo contract because it hard-coded the old PNG filename; the contract was updated to require WebP delivery and retained PNG source, then the complete gate passed.
- Existing safe analytics events already cover quote, quote-review, floorplan, product and contact funnels, so no analytics runtime change was needed.

## Decision log

- Treat the attached specification as explicit approval for OF-SEO-001 and replace the inactive task record in `docs/NEXT_TASK.md`.
- Keep room-visualiser files, route ownership and QA out of this sprint even though they share the branch.
- Prefer repository redirects over provider-console changes because `netlify.toml` is the established deployment source.
- Do not change application copy, metadata, images or mobile layout until the corresponding baseline gap is reproduced.
- Keep metadata and FAQ schema unchanged where the generated owner page was already unique, aligned and valid.
- Optimise the four extreme gallery JPEGs at their existing URLs to avoid catalogue-data changes.
- Treat provider data, reviews, business identity, acoustic evidence and compliance claims as evidence dependencies rather than publishing assumptions.

## Final acceptance criteria

1. All seven approved duplicate sources have permanent, one-hop canonical redirects in repository configuration.
2. `/blog.html` remains a 404 and `/blog/` remains the owner.
3. Sitemap and internal links use canonical URLs only.
4. No new indexable page is introduced by this sprint.
5. Required mobile widths show no important fixed-element collision.
6. Approved image changes preserve visual quality, alt text and stable dimensions and reduce delivered bytes where changed.
7. Approved existing pages have distinct intent, useful links and customer-safe claims.
8. Quote, review, floorplan, upload, product and pricing behaviour remain unchanged.
9. Build, typecheck, applicable tests, crawl/leak checks and visual QA pass or have explicit evidence-backed limitations.
10. Governance reports are updated and OF-SEO-001 is READY_FOR_REVIEW, not completed or accepted.

## Rollback considerations

- Remove only OF-SEO-001 redirect blocks, content/CSS/image references and tests if review rejects the sprint.
- Preserve every pre-existing dirty change and untracked file.
- Keep original image assets when adding delivery variants.
- No data, provider or production rollback is required because the task is local-only.
