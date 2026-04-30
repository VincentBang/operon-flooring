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
- Task completed: added the first product catalogue layer across product pages and the quote wizard
- Changes made: created a central `products.js` data source, added catalogue sections to laminate, hybrid and engineered product pages, and wired selected products into the quote pricing flow with localStorage handoff
- Next improvement idea: replace the sample catalogue rows with confirmed supplier ranges and add product images once the final supplier list is available

## Execution Queue

- `continue execution` now means:
  - generate top 10 tasks
  - save queue
  - complete top 3 tasks unless blocked
- queue file:
  - `apps/web/task_queue.json`
