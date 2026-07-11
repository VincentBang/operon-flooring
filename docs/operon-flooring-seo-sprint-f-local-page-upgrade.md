# Operon Flooring SEO Sprint F - Thin Local Page Upgrade

Date: 2026-07-10

## Goal

Improve existing sitemap suburb pages before creating new URLs. This sprint does not add pages, does not change sitemap count and does not touch quote, pricing, product, floorplan, quote-review, chatbot, upload/OCR or backend logic.

## Pages Updated

| URL | Change |
| --- | --- |
| `/flooring-balmain.html` | Title/meta shifted from generic premium product wording to Balmain terrace and apartment quote intent. |
| `/flooring-drummoyne.html` | Title/meta shifted to Drummoyne apartment, townhouse and family-home quote intent. |
| `/flooring-woollahra.html` | Title/meta shifted to premium timber and scope clarity intent. |
| `/flooring-mosman.html` | Title/meta shifted to premium timber, apartment and access/stair scope intent. |
| `/flooring-coogee.html` | Title/meta shifted to coastal apartment/home/rental flooring quote intent. |
| `/flooring-vaucluse.html` | Title/meta shifted to premium coastal timber, stairs, preparation and finishing intent. |
| `/flooring-neutral-bay.html` | Title/meta shifted to apartment quote, acoustic underlay, access and product guide intent. |
| `/flooring-double-bay.html` | Title/meta shifted to premium home/apartment, preparation, access and trims intent. |

## Current Content State

These pages already use the shared local authority expansion component with:

- local property context;
- product suggestions;
- quote clarity notes;
- relevant nearby links;
- quote CTA;
- quote-review CTA;
- floorplan CTA;
- visible local FAQs.

Sprint F therefore focused on confirmed duplicated/generic metadata rather than creating new content blocks or routes.

## Safeguards

- No new URLs.
- Sitemap count remains 87.
- `/blog.html` remains absent from sitemap.
- Each changed page has one H1 in generated output.
- Each changed page has a self-referencing canonical in generated output.
- No internal pricing, supplier cost, margin, storage path or raw OCR language was added.

## Verification

- `npm run build` in `apps/web-tsx`: passed.
- `npm run check:public-leaks`: passed.
- `git diff --check`: passed.
- `node internal-qa/tests/web/staticOutputContract.test.js`: passed.
- Generated output spot check for all eight changed pages: title, meta description, canonical and H1 count passed.

## Follow-Up

Next local SEO work should only continue after either:

1. Search Console data shows a specific page/query opportunity; or
2. Human approves another local-only depth pass on existing thin pages.

Do not create or deploy another expansion batch until the held-back page release criteria in `docs/operon-flooring-seo-master-plan.md` are satisfied.
