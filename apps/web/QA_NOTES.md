# QA Notes

Date: 2026-05-02
Scope: safe non-core SEO, content structure, internal links, sitemap consistency, and content QA only.

## Checks Completed

- Broken-link audit across the homepage, products page, three money pages, five suburb pages, and blog hub: no broken links found in the audited set.
- Title tag, meta description, canonical, and H1 presence checked on:
  - `hybrid-flooring-sydney.html`
  - `laminate-flooring-sydney.html`
  - `engineered-timber-flooring-sydney.html`
  - `blog/index.html`
  - maintenance blog articles reviewed in this pass
- FAQ schema checked against visible FAQ content on:
  - `hybrid-flooring-sydney.html`
  - `laminate-flooring-sydney.html`
  - `engineered-timber-flooring-sydney.html`
- Suburb page uniqueness and CTA paths reviewed on:
  - `parramatta-flooring.html`
  - `liverpool-flooring.html`
  - `auburn-flooring.html`
  - `blacktown-flooring.html`
  - `miranda-flooring.html`
- Sitemap and crawl directives reviewed in:
  - `sitemap.xml`
  - `robots.txt`
- Canonical alignment reviewed for active sitemap pages, suburb handoff pages, and policy pages:
  - active sitemap targets exist locally
  - old `flooring-[suburb].html` pages remain `noindex,follow` handoffs to the new `[suburb]-flooring.html` pages
  - privacy and terms canonicals now point to `operonflooring.com.au`
- Quote lead-capture fallback reviewed in `index.html`:
  - Netlify Forms remains the live submit path.
  - Simple localhost/static preview now builds and saves the quote payload locally before showing the runtime warning.
  - Failed submit attempts show recovery guidance only when a saved failed quote request exists.
- Active supplier catalogue image alt text reviewed:
  - each active hybrid product has unique descriptive alt text
  - `products.js` now exposes a normalised `imageAlt` alias while preserving the existing `alt` field used by current cards and galleries
- Product placeholder messaging reviewed:
  - pending product details use customer-facing confirmation language, not old pending-price labels
  - selected pending products continue to explain that the standard category estimate is used until review
  - no internal rates or formulas are exposed on catalogue cards
- Maintenance blog conversion paths reviewed:
  - `how-to-clean-hybrid-flooring.html` links to hybrid flooring, product browsing, floor plan measurement, and quote CTAs
  - `laminate-floor-water-damage.html` links replacement-ready users to laminate products, floor plan measurement, and quote CTAs
  - `flooring-gaps-and-expansion.html` keeps diagnosis first, then offers product, floor plan, and quote next steps
  - `why-is-my-floor-lifting.html` links repair-versus-replace decisions into product categories, floor plan measurement, and quote CTAs
  - `floor-repair-or-replace.html` provides product-category, floor plan, and quote pathways without repetitive filler
- Schema coverage reviewed:
  - homepage FAQ schema now matches the visible homepage FAQ questions
  - product money pages, cost pages, floor care page, and core blog guides were checked for valid JSON-LD
  - visible FAQ blocks on the checked pages have FAQPage schema coverage with no invalid JSON-LD detected
- Dashboard task queue rollup reviewed:
  - `dashboard.html` now reads `task_queue.json` as a read-only backlog source
  - the dashboard shows total, completed, pending, completion rate, status counts, and completed categories
  - inline dashboard scripts parse cleanly, and the current local queue count is 50 total / 41 done / 9 pending before this status note is applied
- Agent task helper reviewed:
  - `agent-task-engine.js` now exposes run limits for default, long, and overnight modes
  - execution batches filter out completed tasks and sort pending work by priority score
  - generated placeholder tasks no longer overwrite a loaded source queue unless the local queue is empty or already generated
- Backlink preparation reviewed:
  - `OPERON_SEO_STRATEGY.md` now maps backlink assets to supplier, product, suburb, maintenance, and floor plan destinations
  - `backlink-tracker.html` now includes an internal asset map and citation checklist for consistent manual tracking
  - no live outreach, external account access, or citation submission was performed
- Suburb internal linking reviewed:
  - Parramatta, Liverpool, Auburn, Blacktown, and Miranda pages now include suburb-specific guide links alongside product and quote paths
  - local validation confirmed the linked guide, product, floor plan, and quote targets exist
  - anchor text varies by suburb context rather than repeating one template
- 2026-05-08 SEO continuation:
  - `robots.txt` and `sitemap.xml` were rechecked for crawl basics; the sitemap URL is declared and all sitemap targets resolve to local files in this workspace.
  - customer-facing SEO pages were scanned for backend/system wording and clipped placeholder fragments; affected guide copy was rewritten in `floor-care-maintenance.html`, `blog/how-to-measure-floor-area.html`, `blog/laminate-vs-hybrid.html`, and `blog/hybrid-flooring-problems.html`.
  - product SEO pages were audited for preserved catalogue interaction; each still loads `products.js`, renders the category range catalogue, keeps category-specific quote CTAs, and keeps quote-review CTAs visible.
  - product SEO intent mapping and suburb intent audit notes were added to `SEO_CONTENT_REFRESH_REGISTER.md`.
  - priority suburb proof mapping was added to `PROJECT_CASE_STUDY_BACKLOG.md` without publishing fake case-study pages.
- 2026-05-08 SEO audit continuation:
  - quote-review entry points were counted across public pages; strongest coverage is on homepage, quote/quote-review, thank-you, and product SEO pages, while suburb and maintenance pages should only add quote-review links when the local page discusses scope uncertainty.
  - image SEO audit found 11 visible/static image tags. Current static homepage and quote-review logo/media images have alt text and dimensions; dynamic catalogue image strings in `products.html` have alt and lazy loading but no fixed width/height attributes.
  - product SEO section density audit found one H1 per product page. Current section counts are 10 on hybrid, 9 on laminate, and 9 on engineered timber; no immediate structural change was made because live product interaction is preserved.
  - CTA accessible-name audit found visible button text across audited anchors. Existing `thank-you.html` hash-only actions for `Call now` and `Send message` should be resolved when contact actions are finalized.
  - floorplan entry links remain strong where measurement uncertainty exists, especially product pages, suburb pages, cost guides, measurement guide, and quote flow.
  - contact/help path audit found most public pages include footer contact access; quote and floorplan pages intentionally prioritize task completion.
- 2026-05-08 SEO-safe next batch:
  - `floor-care-maintenance.html` now adds natural product browsing and quote-review CTAs in the repair-vs-replace section while keeping quote as the primary action and floorplan as the measurement path.
  - Homepage CTA hierarchy was audited without restructuring: hero quote and quote-review CTAs, three-path intent router, quote-process CTA, quote-review section CTA, floorplan CTA, SEO links, and final quote CTA are all present.
  - Product page heading hierarchy was audited: hybrid, laminate and engineered pages each have one H1, no heading-level jumps, and logical H2 sections after the refresh.
  - Trust-copy scan found no fake guarantees, cheapest-price promises, fake reviews, urgency claims, or "Sydney's best" claims. The only `cheapest` hits are defensive quote-review positioning such as "not cheapest-price comparison."
  - `seo-pages.css` guide-card pattern audit confirmed `section-card`, `mini-card`, `faq-card`, `link-card`, `grid-2`, `grid-3`, and `link-grid` are already reusable and responsive; no CSS refactor was needed in this pass.
- 2026-05-08 SEO planning/audit continuation:
  - Comparison and problem guide overlap was mapped in `SEO_CONTENT_REFRESH_REGISTER.md`; no pages were merged, deleted, or created.
  - Product catalogue UX was audited against the range-first content policy. `products.html` already supports category cards, range details, colour preview, range selection, selected-range banner, and quote handoff without needing a product data or `products.js` edit.
  - CTA tracking coverage on the three product SEO pages was audited. The pages have quote, product, quote-review, guide, and floorplan CTAs, and category quote CTAs preserve `data-save-category`, but the visible anchors do not yet use explicit `data-track-cta` labels.
  - The CTA tracking gap is suitable for a later careful HTML metadata pass; no `tracking.js`, backend analytics, quote flow, or pricing logic change was made.
  - Quote-validation support content was planned as educational pre-review guidance only, with `quote-review.html` retaining upload/review intent.
  - Breadcrumb schema was deferred because the product SEO pages do not currently display visible breadcrumb navigation; schema-only breadcrumbs should be avoided.
  - Queue rollup after this batch is 50 total / 42 done / 8 pending.
- 2026-05-08 SEO/mobile and routing continuation:
  - Browser workflow loaded `hybrid-flooring-sydney.html` and confirmed the refreshed product page renders the hero CTAs, selected-range banner, product range cards, range-detail buttons and quote continuation links in the DOM. Screenshot capture timed out in the in-app browser, so the mobile QA was completed with browser DOM confirmation plus static CSS checks.
  - Static mobile CSS checks confirmed the product pages use the shared responsive `seo-pages.css` breakpoints: mobile nav at 980px, single-column grids at 768px, full-width hero/catalogue CTAs, smaller catalogue images, mobile modal sizing and `overflow-x: hidden` on `body`.
  - Suburb pages were audited for local relationships and quote visibility. Parramatta, Liverpool, Auburn, Blacktown and Miranda keep visible quote/product/floorplan paths and now include more contextual guide links where they answer a local concern.
  - Clipped or generic suburb snippets were corrected on Parramatta, Auburn, Blacktown and Miranda pages; the cost page area/layout sentence and blog hub hero line were also corrected.
  - Blog index CRO now includes a direct quote-review route in the "Use the Site" card set and footer actions while keeping quote, product, floorplan and floor-care paths visible.
  - Commercial FAQ/answer blocks were audited for AI-search readiness; product and cost pages have concise visible answers without keyword stuffing or generic AI filler.
  - Quote-clarity guide planning was added to the refresh register only; no new guide page was published.
  - Queue rollup after this batch is 50 total / 47 done / 3 pending.
- 2026-05-08 final technical SEO queue close:
  - Blog FAQ schema coverage was audited across all blog HTML files. Article pages with visible FAQ blocks already had `FAQPage` JSON-LD; `blog/index.html` was the only gap and now has FAQ schema matching its four visible FAQ answers.
  - `seo-pages.css` was audited as a shared 34 KB SEO layout stylesheet. Existing reusable grid, card, catalogue, modal and mobile breakpoint patterns are active across product, suburb, blog and guide pages, so no CSS refactor was made without visual-regression coverage.
  - LocalBusiness/Organization schema was audited on homepage, quote page and contact page. Homepage remains the main `LocalBusiness` owner; contact page carries `Organization`/`ContactPoint`; no fake ratings, reviews, opening hours, phone or address details were added.
  - Queue rollup after this batch is 50 total / 50 done / 0 pending.

## Issues Found

### Safe fixes completed in this pass

- Product money pages now have clearer SEO titles and descriptions, stronger quote CTA wording, and more relevant internal links into maintenance/problem guides.
- Blog hub now surfaces the five maintenance/problem topics more clearly:
  - cleaning hybrid flooring
  - laminate water damage
  - floating floor gaps
  - floorboards lifting
  - repair vs replace flooring
- Priority suburb pages now use more specific local CTA language and direct category/product links without relying on catalogue edits.
- Internal SEO support files had stale suburb URL patterns corrected to match the live suburb page naming structure.

### Deferred because they touch core areas

- Any change to live category/product rendering on money pages that depends on `products.js` or `products.html`.
- Any quote-flow changes tied to `index.html` product selection, `productSelection.js`, `quoteCalculator.js`, `pricingRules.js`, or localStorage product carry-over logic.
- Any pricing presentation change that would require editing quote calculation or pricing rules.

## SEO / Content Risks To Revisit

- `hybrid-flooring-sydney.html` still includes a featured-product section driven by `products.js`. Content around that module should be reviewed again after the catalogue upload finishes so the live catalogue state and supporting copy stay aligned.
- `laminate-flooring-sydney.html` and `engineered-timber-flooring-sydney.html` still reference category-filtered product browsing while the broader catalogue upload is in progress. Re-check category landing expectations after the upload is complete.
- Visual mobile QA is still pending. This pass was structural and content-focused, not browser-render verified.
- Duplicate-content risk across suburb pages is improved, but each suburb page should still get another post-upload review once product/category content stabilises and more local proof points are available.
- Live Netlify form submission still needs deployed runtime testing because plain localhost and direct file mode cannot submit Netlify Forms.

## 2026-05-08 Overnight SEO Queue 002

- Scope: completed the top 25 SEO-safe tasks from the refreshed 50-task queue: queue creation, final QA, memory rollup, clipped-copy scan, suburb proof data needs, internal link gap map, crawl snapshot, blog schema matching, quote clarity brief, premium suburb roadmap, quote-review link policy, suburb thin-copy risk, blog index schema validation, AI answer block map, product SEO link destinations, apartment cluster plan, cost cluster map, measurement utility map, product checklist reuse map, subfloor prep cluster plan, blog hub density, homepage support density, thank-you contact action audit, commercial FAQ schema match, and floorplan SEO copy audit.
- Schema fixes: added the missing `Is the online quote final?` FAQ item to `blog/flooring-cost-sydney.html` JSON-LD and aligned the `floor-care-maintenance.html` FAQ schema question with the visible manufacturer-care question.
- Copy fixes: tightened selected generic guide snippets on cost, installation-cost, engineered-vs-laminate, gaps/expansion, hybrid cleaning, laminate cleaning and maintenance checklist pages.
- Crawl snapshot: sitemap targets exist locally and have canonical tags in the static crawl check.
- Link audit: product SEO pages resolve their static quote, product, floorplan, quote-review and guide destinations. Quote-review links should stay selective and intent-based.
- Blog hub: current hub has useful action routes but the article list is getting dense; future CRO should group guide cards by category.
- Thank-you audit: existing hidden `Call now` and `Send message` anchors still use `href="#"`; leave for the future contact-action cleanup task.
- Floorplan audit: SEO title/meta/schema and content remain focused on measuring from a floor plan. No floorplan runtime or tool logic was changed.
- Remaining content risk: older maintenance/problem guides still contain generic snippets and should be a future copy-refresh batch.

## 2026-05-08 Overnight SEO Queue 002 Closeout

- Scope: completed the remaining 25 SEO-safe tasks from Queue 002: maintenance cluster link map, privacy quote-review copy audit, suburb orphan audit, quote path parameter consistency, quote-review SEO copy guard, products page SEO copy audit, blog orphan audit, image dimension follow-up, suburb title/meta audit, sitemap blog coverage, chatbot SEO routing candidate, robots draft guard, contact schema match, LocalBusiness details backlog, mobile nav SEO audit, guide title/meta audit, chatbot guide coverage candidate, footer link consistency, image alt second pass, backlink asset gap map, product-page schema opportunity, Search Console metrics placeholder, clean URL roadmap, social meta coverage, and rank-tracker keyword groups.
- Content fixes: replaced placeholder privacy-policy copy with clear quote/floorplan/quote-review data handling language; aligned contact-page visible FAQ questions/answers with existing schema; added homepage links to Cabramatta and Eastern Suburbs service pages; added missing legal footer links to homepage and quote-review footer.
- Orphan checks: blog pages have inbound and outbound local links; Cabramatta and Eastern Suburbs now have homepage inbound links.
- Metadata checks: scanned 52 HTML pages. No duplicate page titles or duplicate descriptions were found; important public SEO pages have title, description and canonical coverage.
- Sitemap checks: all 19 blog URLs are represented in `sitemap.xml`; no extra blog URLs were listed.
- Robots/noindex checks: noindex remains on admin/tracker/thank-you/visualiser/moved-handoff pages; public SEO pages remain indexable.
- Image checks: static image tags have alt text; homepage images have width/height. Dynamic catalogue images still need a future product-UI dimension pass.
- Schema checks: contact JSON-LD parses and visible FAQ wording now matches schema; product category pages should not receive `Product`/`Offer` schema without exact visible product/offer data.
- Protected-file status: no quote calculation, pricing logic, product data, floorplan runtime, backend/email, Supabase, chatbot runtime, tracking runtime or analytics runtime changes were made.

## 2026-05-08 Overnight Full Agent Loop Queue 003

- Scope: generated Queue 003 and completed a Scope Standard policy, SEO, CRO, quote-review, chatbot, analytics and QA documentation batch.
- New audit artifact: `OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md` now maps the internal Scope Standard across quote review, product pages, suburb pages, comparison guides, problem/cost guides, chatbot support and future workflow logic.
- Policy updates: site copy, marketing, SEO strategy, quote-review policy, agent rules and project memory now treat scope clarity as a foundational internal framework without turning it into public slogan copy.
- Quote-review data engine: added future outcome fields for estimate request, site confirmation, decision state, won/lost outcome, variations, returned-after-competitor and follow-up education path.
- Funnel system: added Scope Standard funnel principle and future safe signals for scope definition, missing scope categories, decision state, next best action and observed variations.
- Chatbot docs: added Scope Standard memory and a concise flow for customers asking what to check in a flooring quote.
- Project proof: case-study backlog now captures product, area, installation, site/access, prep, finishing, commercial clarity and final-confirmation fields before future publishing.
- Static validation: sitemap has 37 local URLs and no missing files; quote/quote-review links across 52 HTML files resolve locally; homepage, quote-review, contact and blog hub JSON-LD parse; no public HTML page uses “Operon Scope Standard” branding; whitespace diff check passed.
- Queue state: Queue 003 now has 50 tasks: 27 done, 18 pending and 5 blocked because they require explicit approval for protected quote, product, floorplan, backend or Supabase areas.
- Protected-file status: this pass did not edit quote calculation logic, pricing rules, product data, floorplan logic, backend/API/email functions, or Supabase migrations. Some protected files remain dirty from earlier work and were intentionally left untouched.

## 2026-05-08 200-Task Full Agent Loop

- Scope: generated and ran a 200-task full-agent queue in safe local mode. The pass executed broad static audits, strategy mapping, queue governance, and policy-aligned planning while leaving protected runtime systems untouched.
- Queue state after this pass: 200 tasks total: 145 done, 43 pending, and 12 blocked. Blocked tasks are deliberately retained for areas requiring explicit approval before editing quote flow, product data, pricing logic, floorplan runtime, backend/email, Supabase, or live chatbot injection.
- Static page audit covered 19 high-value public pages: product SEO pages, `products.html`, `quote-review.html`, priority guides, and five suburb pages.
- Heading audit result: all 19 audited pages have exactly one H1.
- Funnel path audit result: all 19 audited pages link to `quote.html`, `products.html`, and `floorplan.html`. Quote-review links are intentionally selective and appear on 5 audited pages where scope uncertainty or quote comparison intent is strongest.
- Progressive disclosure audit result: audited pages use a mix of visible sections and `<details>` blocks; commercial product pages and suburb pages carry the strongest expandable explanation coverage.
- Schema audit result: 13 of the 19 audited pages include JSON-LD. Pages without schema in this audit are mainly `products.html` and suburb pages, which should only receive schema if the visible content supports it cleanly.
- Image audit result: 3 static image tags were found across the audited set, with 2 missing static alt text in `products.html`. Dynamic product catalogue images still need a later product-UI accessibility pass because they are generated by script.
- Mobile/CRO static audit result: quote/product/floorplan routes remain visible; no runtime layout was changed. Browser/mobile visual QA remains recommended for `quote.html`, `products.html`, `floorplan.html`, and `quote-review.html`.
- Analytics planning completed: safe future scope-intelligence signals were mapped conceptually for cost guides, preparation guides, comparison guides, repair/replacement guides, problem guides, and suburb pages. No analytics runtime or backend write was changed.
- SEO cluster planning completed: scope-clarity clusters were mapped around quote clarity, floor preparation, quote comparison, product choice, suburb access/site risk, measurement, and quote-review decision support.
- Internal linking audit completed: high-intent pages have quote/product/floorplan routes; future edits should add quote-review links only where the page naturally discusses scope uncertainty, not everywhere.
- Performance/static risk audit completed: no new assets or scripts were added in this pass. Dynamic catalogue image dimensions remain the main future performance/accessibility target.
- Accessibility/static risk audit completed: audited pages preserve visible CTA text and one-H1 structure. Product page static image alt text remains a later safe fix if it can be done without touching product data.
- Protected-file status: no quote calculation logic, pricing rules, product data, floorplan logic, backend/API/email functions, Supabase migrations/functions, tracking runtime, or live chatbot runtime integration was edited during this 200-task pass. Existing dirty protected files predated the pass and were not reverted.
- Validation performed: task queue parsed, sitemap local targets resolved, quote/quote-review links resolved, selected JSON-LD blocks parsed, public HTML scan found no forced "Operon Scope Standard" branding, and whitespace validation passed for the files changed by this pass.

## Mobile Layout Notes

- No browser rendering issues were detected from static review alone.
- A visual pass is still recommended on:
  - money page hero sections
  - suburb page FAQ sections
  - blog hub link grids

## Recommended Post-Upload Follow-Up

- Reconnect money-page product sections to the final uploaded catalogue state.
- Review category filters and selected-product carry-over on the product pages after the other Codex session finishes.
- Run a visual browser QA pass across mobile breakpoints once catalogue work is complete.

## Quote Submit Event QA Checklist

- Success path to test on Netlify runtime: complete the quote flow, press `Submit quote request`, confirm `quote_submit` fires before submission, confirm `quote_submit_success` fires once after a successful form response, and confirm the page redirects to `thank-you.html`.
- Error path to test on simple localhost/static preview: complete the quote flow, press `Submit quote request`, confirm the lead payload is saved to `operon_last_submitted_lead_result_v1`, confirm `quote_submit_error` fires once, and confirm the recovery banner appears.
- Error path to test on Netlify runtime with form failure: block the form endpoint or inspect a failed response, confirm the saved recovery payload remains available, and confirm no duplicate success/error events fire.

## 2026-05-09 Continue Execution Overnight

- Scope: completed a safe continuation batch focused on chatbot guidance and compact guide-page scope confirmation.
- Chatbot QA: Quote Advisor result awareness now has isolated tests confirming read-only page state, no price calculation, no competitor judgment, and correct routing to `quote.html?from=quote-review`.
- Guide QA: refreshed `blog/floor-repair-or-replace.html`, `blog/why-is-my-floor-lifting.html`, `blog/laminate-floor-water-damage.html`, and `blog/hybrid-flooring-problems.html` with concise scope-check sections and quote-review/preparation/gaps guide routes.
- Suburb QA: Parramatta, Liverpool, Auburn, Blacktown and Miranda pages now include compact local scope-check sections with quote-review and practical guide routes; generic or clipped snippets found during review were corrected.
- Product/commercial QA: hybrid, laminate and engineered money pages plus installation-cost, products and quote-review pages now have tighter scope-first guidance without exposing rates or changing product/pricing logic.
- Project-proof QA: `PROJECT_CASE_STUDY_BACKLOG.md` now has planning-only proof intake fields for product pages, suburb pages and problem guides. No public project claims or fake case studies were published.
- Backlog QA: `OPERON_SCOPE_STANDARD_APPLICATION_AUDIT.md` now records safe future backlog categories for copy, quote-review routing, product education, suburb proof, guide consolidation, mobile skim and analytics planning.
- Queue QA: the 200-task queue now parses at 189 done, 0 pending and 11 blocked. Blocked items remain approval-gated because they touch protected quote, product, floorplan, backend, email, Supabase or live runtime areas.
- Validation performed: chatbot test suite passed, updated guide/page JSON-LD parsed where present, H1 checks passed for refreshed pages, linked targets exist locally, the public HTML scan avoids forced “Operon Scope Standard” branding, and whitespace diff checks passed for touched files.
- Protected-file status: no quote calculation logic, pricing rules, product data, floorplan runtime, backend/API/email functions, Supabase files, or tracking runtime were edited in this pass.

## 2026-05-09 Blocked Queue Closeout

- Scope: completed the remaining 11 previously blocked tasks after explicit approval to continue them.
- Queue QA: `task_queue.json` now parses at 200 done, 0 pending and 0 blocked.
- Calculator QA: `quoteCalculator.js` now adds read-only `scopeSignals` to the result object. The existing validation suite still passes, confirming supply/install, install-only, removal/disposal and stair pricing scenarios remain intact.
- Product QA: `products.js` now derives scope metadata from existing product/range fields only; no product prices, ranges, colours or selection logic were changed.
- Floorplan QA: floorplan copy now clarifies that the tool sends measured area into quote and that product/site scope is handled in the quote flow. No floorplan measurement logic was changed.
- Backend/save QA: `save-quote-request.js` syntax passes and stores `scopeSignals` in the existing raw payload path. Customer/internal email copy can list missing scope items when present; sending behavior and provider configuration were not changed.
- Supabase QA: added one additive migration, `20260509_scope_standard_signals.sql`, for future scope signal columns. It does not drop or rewrite data.
- Page QA: `products.html` and `quote-review.html` received one compact decision-focused FAQ each; quote/pricing/product interaction logic was not changed.
- Validation performed: queue parse check, `node apps/web/tests/quoteCalculator.validation.js`, `node --check apps/web/quoteCalculator.js`, `node --check apps/web/products.js`, `node --check netlify/functions/save-quote-request.js`, and chatbot test suite passed.
- Remaining deployment note: the Supabase migration still needs to be applied in the database environment before the new scope signal columns are available for direct querying.

## 2026-05-09 Worker B Technical SEO / QA Documentation

Scope: documentation-only technical SEO QA pass for sitemap, robots, core SEO pages, blog pages, and obvious crawl/link/meta/H1 risks. No public page, quote flow, floorplan runtime, product catalogue, pricing logic, Supabase, Netlify function, chatbot runtime, or tracking architecture files were edited in this pass.

### Completed Task IDs

- `B-SEO-QA-001` - Sitemap and robots crawl directive snapshot.
- `B-SEO-QA-002` - Public sitemap title/meta/canonical/H1 coverage audit.
- `B-SEO-QA-003` - Local href and conversion-route crawl audit.
- `B-SEO-QA-004` - Safe technical SEO next-task documentation.

### Validation Performed

- Read-only sitemap audit found 37 URLs in `sitemap.xml`; every sitemap target resolves to a local file in the workspace.
- `robots.txt` allows crawling and declares `https://operonflooring.com.au/sitemap.xml`.
- Public sitemap pages were checked for title tag, meta description, canonical tag, and H1 count; no missing title, missing description, missing canonical, or multi/missing-H1 issue was found.
- JSON-LD on the 37 sitemap pages was parsed; no invalid JSON-LD blocks were found.
- Sitemap pages were checked for accidental `noindex`; no sitemap-listed page is currently marked `noindex`.
- Local hrefs across 53 HTML files were resolved after removing hash/query fragments; no missing local link targets were found.
- Conversion-route coverage remains strong in the static crawl: `quote.html` links appear 229 times, `quote-review.html` links 53 times, `products.html` links 149 times, and `floorplan.html` links 126 times across the audited HTML set.

### Findings

- No urgent sitemap, robots, canonical, H1, schema-parse, or broken-local-link defect was found in this pass.
- Quote-review links are present but still selective compared with quote/product/floorplan paths, which matches the current policy to use quote review where scope uncertainty or quote comparison intent is natural.
- The existing `href="#"` contact actions on `thank-you.html` remain a known deferred item, but they were not changed because this pass avoided live page edits and the actions are hidden until contact details are finalized.
- Homepage placeholder phone-number TODO comments remain a known business-data dependency. Do not replace them until the real Operon phone number is confirmed.
- Dynamic catalogue image dimension/accessibility follow-up remains the main future technical SEO item, but any fix must be coordinated carefully because product rendering and `products.js` are protected unless explicitly approved.

### Next Safe Tasks

- `B-SEO-NEXT-001` - Run a rendered mobile browser QA pass for homepage, product pages, `products.html`, `quote-review.html`, and floorplan entry points after current dirty page edits settle.
- `B-SEO-NEXT-002` - Add explicit CTA tracking metadata to product SEO page anchors in a careful HTML-only pass, without editing `tracking.js` or quote/product runtime logic.
- `B-SEO-NEXT-003` - Resolve `thank-you.html` hidden `Call now` and `Send message` hash actions once real phone/message destinations are confirmed.
- `B-SEO-NEXT-004` - Review dynamic catalogue image width/height and alt rendering with product-owner approval before touching protected catalogue logic.

## 2026-05-09 Overnight Full Agents Floorplan QA Notes

Scope: documentation-only QA follow-up after the floor plan measurement upgrade. No quote flow, floorplan runtime, product catalogue, pricing logic, Supabase, Netlify function, or tracking runtime file was edited for this QA section.

### Completed Task IDs

- `OVN-001` - Document floorplan public QA checklist.
- `OVN-013` - Audit floorplan page for hidden debug text exposure.
- `OVN-014` - Document mobile QA checklist for floorplan tool.
- `OVN-029` - Add floorplan manual QA result placeholder.

### Public Workflow Checks To Run In Browser

- Open `floorplan.html` with no query string and confirm the visible workflow is only upload, set scale, trace rooms, review selected area, and use area in quote.
- Confirm customer-facing copy describes the tool as a measured starting area, not a final site measurement or pricing engine.
- Upload one JPG, one PNG, and one PDF if supported; verify the plan displays without pushing the footer under the tool on mobile.
- Set scale from a long labelled wall where possible and confirm scale status, known distance, pixel distance, pixels per metre, metres per pixel, and scale quality messaging appear.
- Try a short known distance under 2m and confirm the warning recommends using a longer known wall.
- Trace a simple rectangle, an L-shaped room, and two separate rooms; confirm point count, open/closed state, Finish room, Undo point, Clear trace, and saved area display behave cleanly.
- Save a room under 1 m2 and over 150 m2 in a test plan only; confirm the tool asks for confirmation before saving unusual room sizes.
- Exclude one saved room and confirm total selected area updates.
- Click `Use this area in quote`; if the quote already has an area, confirm the replacement warning appears.
- Confirm `quote.html` receives real measured area only and explains that off-cuts/final pricing are handled later in quote review.

### Mobile QA Checklist

- Confirm the upload control, scale controls, trace controls, selected area panel, and `Use this area in quote` button fit within the viewport without overlapping the sticky chatbot or footer.
- Confirm canvas pan/zoom does not break point placement or measured area after scale is set.
- Confirm the selected area section stacks below the tool without hiding the instruction card or room list.
- Confirm the footer sits below the tool after rooms are added and after the quote handoff panel appears.
- Confirm the scale modal fits a narrow mobile viewport and the keyboard does not hide the confirm action.

### Debug / Prototype UI Exposure

- The assisted/quick room code remains in source for developer-only use, but public CSS hides it behind `quick-room-hidden` by default.
- Developer mode can expose the assisted workflow with the approved dev flag only; it should not be visible to customers from normal navigation.
- Source searches may still find terms such as threshold, quick room, or detection because those are internal code paths. The public QA requirement is that those labels are not visible in the default customer workflow.

### Precision Test Status

- `npm run test:floorplan` passed after the floorplan upgrade.
- Synthetic area fixtures cover rectangles, L-shape, multi-room aggregation, rotated rectangle, duplicate closing point handling, and viewport scaling independence.
- Manual browser QA is still required before describing the tool as visually verified on mobile.
