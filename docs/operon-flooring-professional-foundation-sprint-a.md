# Operon Flooring Professional Foundation Sprint A

Audit date: 2026-07-09

Scope: local-only Operon Flooring public acquisition hardening. No production deploy, no Netlify draft deploy, no push, no Supabase migration and no pricing, quote-calculation, product identity, floorplan, quote-review OCR/upload, chatbot or backend business-logic changes are included in this sprint record.

## Branch And Working State

- Branch: main.
- Production-impacting actions: none.
- Known unrelated file excluded from this sprint: `operon-bathrooms/.next/trace`.
- Current sprint work is still local and needs preview approval before any deployment.

## Pages Inspected

- `/`
- `/quote.html`
- `/products.html`
- `/floorplan.html`
- `/quote-review.html`
- `/contact.html`
- `/blog/`
- `/flooring-miranda.html`
- `/flooring-liverpool.html`
- `/flooring-parramatta.html`
- `/flooring-auburn.html`
- `/flooring-edmondson-park.html`
- `/flooring-quote-sydney.html`
- `/hybrid-flooring-sydney.html`
- `/laminate-flooring-sydney.html`
- `/engineered-timber-flooring-sydney.html`
- Selected local authority pages updated by the current SEO worktree.

## Before-State Findings

Confirmed or likely issues from the repo and generated-output checks:

- Quote page support copy could drift from the real six-step quote wizard.
- Products page static output risked relying too heavily on client-side product rendering.
- Local pages used customer-weak wording such as `Internal links`.
- Location and redirect hygiene needed explicit test coverage so approved `.html` URLs remain canonical.
- Homepage, quote page and flooring quote guide needed light intent separation rather than broad SEO rewriting.
- Contact and quote-review conversion paths were already present but needed to be checked against the acquisition path.
- Honeypot copy needed to stay hidden from normal users and crawler-visible snippets.
- Public bundle/privacy checks needed to keep storage paths, raw OCR text and private pricing terms out of exported customer pages.

Rejected or unconfirmed issues:

- No evidence that a full 111-page expansion has been published in the generated sitemap.
- No evidence that `/blog.html` is generated.
- No evidence from local static output that extensionless tool URLs are duplicate 200 pages.
- No production-secret value was reviewed or written into this document.

## Fixes Implemented

### Quote Step Consistency

The quote page supporting copy now reflects the real six-step quote flow:

1. Property details
2. Flooring and product path
3. Area or floorplan measurement
4. Stairs
5. Extras and finish details
6. Summary and review

The change is copy-only. It does not alter the form state machine, calculation, submit path or product/floorplan/quote-review handoff behaviour.

### Product Static Fallback

The products page now includes crawlable, customer-useful category and range fallback content before client-side filters hydrate. The fallback gives crawlers and no-JS users meaningful hybrid, laminate and engineered timber content, while the interactive search/filter/selection interface remains the primary enhanced experience.

Guardrail: product IDs, slugs, supplier data and pricing logic were not changed.

### Local Link Heading Copy

Generic SEO-facing headings such as `Internal links` were replaced with customer-facing wording such as `Next flooring resources` and `Useful next pages`. Useful internal links were preserved.

### Route, Redirect, Canonical And Sitemap Hygiene

Local checks confirmed the intended strategy:

- Sitemap count remains 87 in the current generated output.
- Sitemap includes approved canonical URLs only.
- Held-back weak expansion URLs are not in the sitemap.
- `/blog.html` is absent from static output and should remain 404.
- Extensionless raw static paths such as `/quote`, `/products`, `/floorplan`, `/quote-review`, `/hybrid-flooring-sydney` and `/flooring-bankstown` do not create duplicate raw static 200 pages.
- `/index.html` remains a redirect-source concern rather than an indexable canonical page.
- `/blog/index.html` is documented as a redirect-source/canonical-hygiene concern and is not a sitemap canonical.

Live redirect chains were not changed in this sprint.

### Light Quote Intent Separation

The quote page retains ownership of instant/online flooring quote intent. The flooring quote Sydney guide is positioned as a scope/inclusions/comparison guide. The homepage remains broad and brand/platform-led.

Allowed changes were limited to title/meta/H1/opening-copy/internal-anchor level where needed. No URL structure or canonical consolidation was introduced.

### Contact Page Conversion Clarity

The contact page already includes clear pathing for:

- Start a flooring quote
- Upload a floor plan
- Check an existing quote
- Browse flooring products

It also uses existing approved email/contact details only. No phone number or unsupported response promise was invented.

### Quote-Review CTA Clarity

Quote-review guide and page paths now make the comparison quote next step clearer with customer-safe language around checking written scope, missing items and then starting an Operon comparison quote. OCR, upload, storage and backend save logic were not changed.

### Honeypot And Accessibility

The contact form honeypot uses a hidden, `aria-hidden` input with `tabIndex={-1}`. The quote page static contract now confirms that crawler-visible text does not include `Do not fill this out if you are human`.

No spam protection was removed.

## Files Changed

SEO/content and crawl hygiene:

- `apps/web-tsx/src/app/blog/index/page.tsx`
- `apps/web-tsx/src/app/engineered-timber-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/flooring-balmain/page.tsx`
- `apps/web-tsx/src/app/flooring-coogee/page.tsx`
- `apps/web-tsx/src/app/flooring-double-bay/page.tsx`
- `apps/web-tsx/src/app/flooring-drummoyne/page.tsx`
- `apps/web-tsx/src/app/flooring-killara/page.tsx`
- `apps/web-tsx/src/app/flooring-miranda/page.tsx`
- `apps/web-tsx/src/app/flooring-mosman/page.tsx`
- `apps/web-tsx/src/app/flooring-neutral-bay/page.tsx`
- `apps/web-tsx/src/app/flooring-pymble/page.tsx`
- `apps/web-tsx/src/app/flooring-rose-bay/page.tsx`
- `apps/web-tsx/src/app/flooring-vaucluse/page.tsx`
- `apps/web-tsx/src/app/flooring-wahroonga/page.tsx`
- `apps/web-tsx/src/app/flooring-woollahra/page.tsx`
- `apps/web-tsx/src/app/hybrid-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/laminate-flooring-sydney/page.tsx`
- `apps/web-tsx/src/app/products/page.tsx`
- `apps/web-tsx/src/app/quote/page.tsx`
- `apps/web-tsx/src/components/seo/LocalAuthorityExpansion.tsx`
- `apps/web-tsx/src/lib/legacyAdditionalPages.ts`
- `apps/web-tsx/src/lib/legacySeoPages.ts`
- `apps/web-tsx/src/lib/productSeoGuides.tsx`
- `apps/web-tsx/src/lib/quoteReviewGuides.tsx`
- `apps/web-tsx/src/lib/routes.ts`

Tests/contracts:

- `internal-qa/tests/web/staticOutputContract.test.js`

Scripts/docs:

- `scripts/generate-seo-architecture.mjs`
- `docs/operon-flooring-professional-foundation-sprint-a.md`

Existing local audit documents are present in the worktree and should be reviewed before staging a final commit.

## Performance Audit

Lighthouse/browser performance collection was not run in this local-only pass because the task is not approved for a Netlify deploy and prior automated browser screenshot QA in this workspace has been limited. This is a preview gate item.

Current documented risk areas to check in preview/manual QA:

- Product catalogue image weight and hydration cost.
- Quote page JS bundle size from the full quote runtime.
- Floorplan tool image/PDF handling on mobile.
- Quote-review upload/report path on mobile.
- Header and chatbot/sticky CTA overlap on 390px mobile.

No broad performance optimisation was performed in this sprint.

## Privacy And Leak Check

The generated-output contract and public leak checks are expected to classify sensitive terms by context:

- Customer public output must not include service-role secrets, raw OCR text, storage bucket/path responses, private rates, supplier costs or pricing formulas.
- Source-only function/test references can contain blocked-field names as contract guards.
- Documentation can mention risk categories without secrets or customer data.

No exact secret values were printed or recorded.

## Tests And QA

Required local checks for the current worktree:

- `npm run build` in `apps/web-tsx`
- `npm run check:public-leaks`
- `git diff --check`
- `node internal-qa/tests/web/staticOutputContract.test.js`
- `npm run test:conversion`
- route/static checks for core pages and `/blog.html`
- sitemap/robots/canonical checks

Current local audit result:

- Build passed with the recurring Next.js multiple-lockfile warning only.
- Public leak check passed.
- `git diff --check` passed.
- Static output contract passed.
- Conversion suite passed.
- Local static route checks passed for `/`, `/quote.html`, `/products.html`, `/quote-review.html`, `/floorplan.html`, `/blog/`, `/sitemap.xml`, `/robots.txt`, with `/blog.html` absent/404.
- Sitemap count is 87.
- `/blog.html`, `/quote`, `/products`, `/floorplan`, `/quote-review`, `/hybrid-flooring-sydney` and `/flooring-bankstown` are absent as raw static duplicate files in `apps/web-tsx/out`.
- Literal sensitive-term scan produced two policy-language false positives in public output: one chatbot guardrail saying not to expose internal pricing logic, and one pricing-source comment saying private rate tables are not exposed. Neither exposes a rate table, formula, storage path, OCR text or secret value.

This document change itself does not alter executable code.

## Browser QA Status

Pending human/manual preview review. Production deploy is blocked until desktop and mobile visual QA are confirmed.

Manual checklist for preview:

- 1440px desktop, 1280px laptop, 768px tablet and 390px mobile.
- No horizontal overflow.
- No content overlap.
- Product fallback and hydrated filters both work.
- Product-to-quote handoff remains valid.
- Quote, floorplan, quote-review and contact flows still work.
- Sticky CTA and chatbot do not block product or quote controls.
- Footer and header remain visually consistent.

## Rollback Notes

Rollback is simple at source level because this sprint is additive/copy-focused and local-only:

- Revert the Sprint A commit once created.
- Do not revert unrelated pre-existing worktree changes.
- Do not remove legacy HTML rollback source under `apps/web`.

## Deployment Notes

- No production deploy performed.
- No draft preview performed in this task.
- Draft preview is required before production because the work touches revenue pages: `/quote.html`, `/products.html`, `/quote-review.html` and local SEO pages.

## Known Limitations

- Lighthouse/performance scores still need real preview/browser collection.
- Browser console and layout QA need manual or browser-tool validation.
- The existing broader security architecture still has a separate server-side pricing migration plan; this sprint does not move pricing support data server-side.
- The unrelated `operon-bathrooms/.next/trace` file remains out of scope.

## Next Recommended Sprint

Sprint B - Conversion Data and Quote OS Foundation:

- customer-safe event tracking
- lead readiness score
- quote-review to comparison-quote context handoff refinement
- floorplan measurement session persistence
- quote versioning foundation
- internal follow-up queue dry-run

Do not start Sprint B until Sprint A is committed, previewed and approved.
