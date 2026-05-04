# Operon Flooring Business Objectives, Marketing & SEO Brief

Source-of-truth status: active business, positioning, and marketing brief for the Operon website and quote system.

## Business Direction

Operon Flooring is a Sydney flooring quote and measurement website designed to generate qualified leads for:

- laminate flooring
- hybrid flooring
- engineered timber flooring

Long term, the business direction is a trade-focused operating system for:

- quoting
- measurement
- pricing intelligence
- SEO lead capture
- margin tracking

Do not describe the business or product as:

- demo
- prototype
- AI toy
- generic calculator
- ecommerce store
- customer-facing visualiser platform

## Priority Order

Current operating priorities are:

1. Conversion
2. Quote accuracy
3. SEO structure
4. Product selection catalogue
5. Analytics and revenue feedback
6. Backlinks and distribution
7. Future SaaS infrastructure

## Approved Customer-Facing Positioning

Primary homepage headline:

`Professional Flooring Installation & Quotes in Sydney`

Supporting message:

`Estimate your laminate, hybrid or engineered timber flooring cost. Enter your area, measure room by room, or upload a floor plan.`

Trust message:

`Final quote confirmed before work starts.`

Brand positioning:

Operon Flooring is not only a quick quote tool. The site must also communicate clear flooring estimates, professional installation, quality workmanship, experienced installers, reliable Sydney service, clean product selection, correct scope, quote transparency, and final site confirmation before work.

Quote validation positioning:

Any quote-validation flow must be framed as quote clarity or scope review, not price comparison.

Homepage direction:

Homepage should stay clean, visual, premium, and not overloaded with tool or form language.

## Customer Experience Principles

The website should feel:

- practical
- premium
- calm
- easy to understand
- trade-informed

Avoid:

- hype
- fake automation claims
- backend explanations
- technical implementation language
- AI-first wording

## Site Role Definitions

- Homepage: clean premium conversion and trust page with concise SEO support, not the full quote wizard
- Quote page: dedicated `quote.html` pricing engine and lead capture
- All quote CTAs: navigate to `quote.html`
- Floorplan page: measurement assistant only
- Product pages: SEO plus product selection
- Suburb pages: local SEO support and quote intent capture
- Blog pages: authority, education, and internal-link support
- Analytics and Supabase: tracking layer

## SEO Direction

Core commercial targets:

- flooring quote Sydney
- laminate flooring Sydney
- hybrid flooring Sydney
- engineered timber flooring Sydney
- flooring installation cost Sydney

Content must be:

- useful
- practical
- trade-informed
- locally relevant

Do not publish generic AI filler or keyword-stuffed pages.

## Product Catalogue Direction

Product selection is not ecommerce.

There is:

- no cart
- no checkout
- no public margin logic

Product pages should let a customer:

1. browse a flooring category
2. select a product or range
3. return to the quote form
4. use that selection inside the pricing engine

## Floorplan Direction

`floorplan.html` is a measurement assistant only.

Primary flow:

Upload floor plan -> set scale -> trace rooms -> select included rooms -> use area in quote

Quick Room Mode is future-only and must stay hidden from customer UI until reliable.

## Deployment Direction

Repository structure:

- repo root contains `netlify.toml`
- public site lives in `apps/web`
- backend/data work lives under `supabase`

Branch roles:

- `main` = production
- `dev` = active development and review
