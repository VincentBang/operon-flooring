# Operon Flooring Keyword URL Ownership Map

Status: Sprint 1 implementation map
Date: 2026-06-24

## Purpose

This map defines which existing URL should own each Page-1 SEO target so Operon does not split relevance across the homepage, quote tool and quote guide.

The main correction is:

- `/quote.html` owns instant quote and online estimate intent.
- `/flooring-quote-sydney.html` owns quote scope, inclusions and comparison education.
- `/` remains the broad brand and quote-clarity platform page.

## Primary Ownership

| Query cluster | Primary URL | Role | Supporting URLs |
| --- | --- | --- | --- |
| instant flooring quote Sydney | `/quote.html` | Transactional quote tool | `/`, `/flooring-quote-sydney.html`, `/products.html`, `/floorplan.html` |
| instant floor quote Sydney | `/quote.html` | Transactional quote tool | `/flooring-quote-sydney.html` |
| flooring quotes online | `/quote.html` | Online estimate entry point | `/`, `/floorplan.html` |
| floor quote Sydney | `/quote.html` | Estimate/action page | `/flooring-quote-sydney.html` |
| flooring quote Sydney | `/quote.html` | Primary action page | `/flooring-quote-sydney.html` |
| what should be included in a flooring quote | `/flooring-quote-sydney.html` | Guide and scope page | `/quote-review.html`, `/quote.html` |
| compare flooring quotes Sydney | `/flooring-quote-sydney.html` | Guide and comparison support | `/quote-review.html`, `/quote.html` |
| flooring quote exclusions | `/blog/common-flooring-quote-exclusions.html` | Specific guide | `/flooring-quote-sydney.html`, `/quote-review.html` |
| why flooring quotes vary | `/blog/why-flooring-quotes-vary.html` | Specific guide | `/flooring-quote-sydney.html` |

## Local Ownership

| Query cluster | Primary URL | Role | Supporting URLs |
| --- | --- | --- | --- |
| flooring Miranda | `/flooring-miranda.html` | Local service page | `/quote.html`, `/products.html`, `/quote-review.html`, `/floorplan.html` |
| laminate flooring Miranda | `/flooring-miranda.html` | Local product/service page | `/laminate-flooring-sydney.html`, `/products.html` |
| hybrid flooring Miranda | `/flooring-miranda.html` | Local product/service page | `/hybrid-flooring-sydney.html`, `/products.html` |
| timber flooring Miranda | `/flooring-miranda.html` | Local product/service page | `/engineered-timber-flooring-sydney.html` |
| flooring Liverpool | `/flooring-liverpool.html` | Local service page | `/quote.html`, `/products.html`, `/quote-review.html`, `/floorplan.html` |
| timber flooring Liverpool | `/flooring-liverpool.html` | Local timber/product page | `/engineered-timber-flooring-sydney.html` |
| timber flooring Edmondson Park | `/flooring-edmondson-park.html` | Protected local asset | `/quote.html`, `/products.html`, `/floorplan.html` |

## Homepage Boundaries

The homepage should not be the main target for "instant flooring quote Sydney". It should support the broader brand proposition:

- flooring choices
- quote clarity
- product exploration
- floor plan support
- quote review
- Sydney service coverage

Recommended homepage anchors may mention "instant flooring quote" naturally, but the homepage should link users to `/quote.html` instead of competing with it.

## Quote Tool Boundaries

`/quote.html` should be the strongest URL for:

- instant flooring quote Sydney
- online flooring estimate
- floor quote Sydney
- flooring quotes online

It should not become a long guide page. The page should keep action-first intent and use FAQs only to remove objections.

## Quote Guide Boundaries

`/flooring-quote-sydney.html` should support, not compete with, `/quote.html`.

It should target:

- quote inclusions
- scope clarity
- comparison questions
- why quotes vary
- exclusions

It should link prominently to `/quote.html` using action anchors such as "Start an instant flooring quote".

## Redirect and Sitemap Rules

- Keep `/quote` as a redirect source only, not an indexable page.
- Keep `/blog.html` returning 404.
- Keep `/index.html` and `/blog/index.html` out of the sitemap.
- Keep sitemap entries canonical and `.html` shaped where already approved.
- Do not add held-back expansion URLs to the sitemap until content quality and visual QA pass.

