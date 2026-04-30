# Project Memory

## Business
- Flooring quote system
- Sydney focus
- laminate, hybrid, engineered timber

## Structure
- Homepage = conversion
- Product pages = SEO
- Suburb pages = local ranking
- Blog = authority

## Deployment Workflow
- `main` = production
- `dev` = development
- workflow = `dev -> test preview -> merge -> main -> deploy`
- never push development work directly to production

## Pricing Logic
- real_area vs chargeable_area
- wastage rules
- labour vs material separation

## SEO System
- expandable SEO sections
- internal linking network
- suburb targeting

## Analytics System
- Supabase analytics schema added
- funnel tracking planned/implemented
- quote-to-revenue tracking added
- SEO dashboard added
- task queue added
- ranking tracker added

## Product Catalogue System
- product data now stored centrally
- product pages can show brand/range/colour/price
- customer can select product from product page
- selected product feeds quote engine
- laminate implemented first
- hybrid and engineered follow the same system

## Completed
- homepage redesign
- floorplan tool
- SEO structure setup
- agent system memory
- local tracking scaffold
- dashboard scaffold
- analytics schema scaffold
- revenue admin scaffold
- backlink and ranking tracker scaffold
- task queue execution mode upgrade

## Next Priorities
- suburb pages
- backlinks
- blog expansion

## Analytics Rollout Order

Implement analytics and operating-system work in this order:

1. `tracking.js`
2. Supabase analytics schema
3. quote funnel events
4. revenue admin page
5. dashboard
6. task queue
7. SEO tracker
8. backlink tracker
9. blog generator

Reason:

- this reduces fragile code
- keeps each layer testable
- prioritises traffic → quote → job → margin → next action

## Last Iteration
- Task completed: improved measurement clarity, product-page conversion cues, and product-to-suburb linking
- Changes made: added a Step 4 measurement helper in the quote wizard, added shared selected-product banners on product pages, and linked laminate, hybrid, and engineered pages more directly into relevant suburb landing pages
- Next improvement idea: add real supplier ranges and images to the catalogue, then deepen blog-to-suburb internal links around the strongest money pages

## Execution Queue

- `continue execution` now means:
  - generate top 10 tasks
  - save queue
  - complete top 3 tasks unless blocked
- queue file:
  - `apps/web/task_queue.json`
