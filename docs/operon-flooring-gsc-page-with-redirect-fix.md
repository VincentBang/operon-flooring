# Operon Flooring GSC Page With Redirect Verification

Date: 2026-06-12

## Affected Google Search Console URLs

Google Search Console reported "Page with redirect" validation failed for:

- `https://operonflooring.com.au/index.html`
- `https://operonflooring.com.au/auburn-flooring.html`
- `https://operonflooring.com.au/blog/index.html`

## Redirect Behaviour

These redirects are intentional legacy/canonical hygiene redirects and should remain:

| Source URL | Status | Canonical destination | Destination status |
| --- | --- | --- | --- |
| `/index.html` | 301 | `/` | 200 |
| `/auburn-flooring.html` | 301 | `/flooring-auburn.html` | 200 |
| `/blog/index.html` | 301 | `/blog/` | 200 |

No redirect chains were found for these three URLs during verification.

## Sitemap Status

The sitemap should not include redirected source URLs.

Current canonical sitemap entries are:

- `https://operonflooring.com.au/`
- `https://operonflooring.com.au/flooring-auburn.html`
- `https://operonflooring.com.au/blog/`

The following redirect-source URLs should remain excluded from the sitemap:

- `https://operonflooring.com.au/index.html`
- `https://operonflooring.com.au/auburn-flooring.html`
- `https://operonflooring.com.au/blog/index.html`

## Canonical Tags

Canonical tags should point to final indexable destinations:

- Homepage canonical: `https://operonflooring.com.au/`
- Auburn canonical: `https://operonflooring.com.au/flooring-auburn.html`
- Blog index canonical: `https://operonflooring.com.au/blog/`

## Internal Links

Generated TSX output should not link internally to:

- `/index.html`
- `/auburn-flooring.html`
- `/blog/index.html`

Legacy `apps/web` HTML may still contain `index.html#top` links for rollback/reference. Those files are not the TSX production source and should not be edited solely for this GSC issue unless they become part of generated production output again.

## Static Export Note

The files `apps/web-tsx/out/index.html` and `apps/web-tsx/out/blog/index.html` are normal static-export files for the canonical `/` and `/blog/` routes. They should not be noindexed because the same file content serves the canonical destination route. Netlify redirect rules should continue to intercept explicit `/index.html` and `/blog/index.html` requests.

## GSC Follow-Up

After the next approved production deployment, use Search Console to:

1. Inspect `https://operonflooring.com.au/index.html`.
2. Confirm Google sees a 301 to `https://operonflooring.com.au/`.
3. Inspect `https://operonflooring.com.au/auburn-flooring.html`.
4. Confirm Google sees a 301 to `https://operonflooring.com.au/flooring-auburn.html`.
5. Inspect `https://operonflooring.com.au/blog/index.html`.
6. Confirm Google sees a 301 to `https://operonflooring.com.au/blog/`.
7. Retry validation for the "Page with redirect" issue.

These source URLs are expected to remain non-indexed because they redirect. The success condition is that Google is no longer being encouraged to crawl them from sitemap, canonicals, or internal production links.
