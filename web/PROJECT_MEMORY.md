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
- Task completed: expanded suburb-page SEO and aligned supporting pages to the production domain
- Changes made: upgraded Auburn and Blacktown into fuller suburb landing pages with stronger local copy, quote-ready sections and FAQ schema, and switched the remaining suburb and blog canonicals / social URLs from the Netlify hostname to operonflooring.com.au
- Next improvement idea: tighten internal linking between blog pages, product pages and suburb pages, then expand suburb coverage into the next Sydney locations

## Execution Queue

- `continue execution` now means:
  - generate top 10 tasks
  - save queue
  - complete top 3 tasks unless blocked
- queue file:
  - `apps/web/task_queue.json`
