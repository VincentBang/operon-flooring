# Operon Flooring GSC Page With Redirect Fix - 2026-07-05

## Issue

Google Search Console coverage drilldown:

`https___operonflooring.com.au_-Coverage-Drilldown-2026-07-05.xlsx`

Issue type: `Page with redirect`

Affected redirect-source URLs:

| Source URL | Last crawled | Expected canonical destination | Decision |
| --- | ---: | --- | --- |
| `https://operonflooring.com.au/index.html` | 2026-06-29 | `https://operonflooring.com.au/` | Keep permanent redirect. Do not sitemap or internally link source. |
| `https://operonflooring.com.au/flooring-edmondson-park` | 2026-06-12 | `https://operonflooring.com.au/flooring-edmondson-park.html` | Keep permanent redirect for known extensionless source. |
| `https://operonflooring.com.au/auburn-flooring.html` | 2026-05-26 | `https://operonflooring.com.au/flooring-auburn.html` | Keep permanent legacy slug redirect. |
| `https://operonflooring.com.au/blog/index.html` | 2026-05-21 | `https://operonflooring.com.au/blog/` | Keep permanent redirect to canonical blog index. |

These are legitimate redirect-source URLs. The fix is to avoid feeding them through sitemap, internal links, canonical tags, or future generated SEO HTML.

## Before-State Live Redirects

Captured from production with `curl -I` and `curl -I -L` on 2026-07-05.

| URL | Initial status | Redirect target | Redirect type | Final status | Single hop |
| --- | ---: | --- | --- | ---: | --- |
| `/index.html` | 301 | `/` | Netlify redirect | 200 | Yes |
| `/flooring-edmondson-park` | 301 | `/flooring-edmondson-park.html` | Netlify redirect | 200 | Yes |
| `/auburn-flooring.html` | 301 | `/flooring-auburn.html` | Netlify redirect | 200 | Yes |
| `/blog/index.html` | 301 | `/blog/` | Netlify redirect | 200 | Yes |

## Canonical Destination Checks

| Destination | Status | Robots | Canonical observed |
| --- | ---: | --- | --- |
| `/` | 200 | `index,follow` | `https://operonflooring.com.au` |
| `/flooring-edmondson-park.html` | 200 | `index,follow` | `https://operonflooring.com.au/flooring-edmondson-park.html` |
| `/flooring-auburn.html` | 200 | `index,follow` | `https://operonflooring.com.au/flooring-auburn.html` |
| `/blog/` | 200 | `index,follow` | `https://operonflooring.com.au/blog/` |

Note: Next currently emits the homepage canonical without a trailing slash. It resolves to the same root resource and is not a redirect-source URL. The sitemap uses `https://operonflooring.com.au/`.

## Sitemap Findings

Production sitemap exact `<loc>` checks:

| URL | In sitemap |
| --- | --- |
| `https://operonflooring.com.au/index.html` | No |
| `https://operonflooring.com.au/flooring-edmondson-park` | No |
| `https://operonflooring.com.au/auburn-flooring.html` | No |
| `https://operonflooring.com.au/blog/index.html` | No |
| `https://operonflooring.com.au/` | Yes |
| `https://operonflooring.com.au/flooring-edmondson-park.html` | Yes |
| `https://operonflooring.com.au/flooring-auburn.html` | Yes |
| `https://operonflooring.com.au/blog/` | Yes |

Fresh local build sitemap count: `87` canonical URLs.

## Internal-Link Findings

Active TSX source and fresh generated output did not contain production internal links to:

- `/index.html`
- `/flooring-edmondson-park`
- `/auburn-flooring.html`
- `/blog/index.html`

One legacy generator still had old-style `index.html#top` and `blog/index.html` links. That generator was updated so future generated SEO HTML uses:

- `/` for Home when no relative prefix is needed
- `blog/` for Guides

Legacy `apps/web` HTML still contains historical references, but it is not the active TSX publish output for production.

## Redirect Rule Findings

Netlify redirect rules intentionally preserve old URL equity:

- `/index.html` -> `/` (`301`, forced)
- `/blog/index.html` -> `/blog/` (`301`, forced)
- `/auburn-flooring.html` -> `/flooring-auburn.html` (`301`, forced)
- `/flooring-edmondson-park` -> `/flooring-edmondson-park.html` (`301`, forced)

These redirects should remain. Removing them would not improve SEO hygiene; it would just turn known URLs into errors.

## Extensionless Duplicate Check

Production checks:

| URL | Status | Destination |
| --- | ---: | --- |
| `/quote` | 301 | `/quote.html` |
| `/products` | 301 | `/products.html` |
| `/floorplan` | 301 | `/floorplan.html` |
| `/quote-review` | 301 | `/quote-review.html` |
| `/contact` | 301 | `/contact.html` |
| `/flooring-edmondson-park` | 301 | `/flooring-edmondson-park.html` |
| `/flooring-miranda` | 301 | `/flooring-miranda.html` |
| `/flooring-liverpool` | 301 | `/flooring-liverpool.html` |
| `/laminate-flooring-sydney` | 301 | `/laminate-flooring-sydney.html` |
| `/hybrid-flooring-sydney` | 301 | `/hybrid-flooring-sydney.html` |
| `/engineered-timber-flooring-sydney` | 301 | `/engineered-timber-flooring-sydney.html` |
| `/blog.html` | 404 | intentionally not a page |

No extensionless duplicate 200 surface was found for the checked routes.

## Files Changed

- `scripts/generate-seo-architecture.mjs`
  - Updated future generated SEO nav/footer links away from `/index.html` and `/blog/index.html`.
- `internal-qa/tests/web/staticOutputContract.test.js`
  - Added exact sitemap exclusions for redirect-source URLs.
  - Added generated HTML/XML guards against redirect-source URL signals.

## Tests Run

- `npm run build` in `apps/web-tsx` - passed.
  - Known warning remains: multiple lockfiles detected.
- `node internal-qa/tests/web/staticOutputContract.test.js` - passed.
- `npm run check:public-leaks` - passed.
- `git diff --check` - passed.
- Generated output redirect-source signal grep - passed.
- Live route checks for affected URLs and key extensionless routes - passed.

## Remaining Acceptable References

- `netlify.toml` retains redirect source rules by design.
- `internal-qa/tests/web/staticOutputContract.test.js` contains forbidden redirect-source strings as test fixtures.
- `apps/web-tsx/src/lib/legacyBlogPages.ts` contains `source: "apps/web/blog/index.html"` as a historical source-file label, not a public URL signal.
- `apps/web` legacy HTML contains historical references but is not the active TSX publish output.

## GSC Follow-Up After Deployment

After the next approved production deploy that includes this change:

1. In Search Console, inspect:
   - `https://operonflooring.com.au/index.html`
   - `https://operonflooring.com.au/flooring-edmondson-park`
   - `https://operonflooring.com.au/auburn-flooring.html`
   - `https://operonflooring.com.au/blog/index.html`
2. Confirm each is a redirect-source URL and final destination is indexable.
3. Validate the `Page with redirect` issue.
4. Resubmit `https://operonflooring.com.au/sitemap.xml` only if the sitemap timestamp changes after deploy.

Expected delay: GSC coverage counts can lag for days to weeks after validation, even when production signals are correct.
