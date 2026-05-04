# Chatbot Mobile Overlap Audit

Purpose: keep the floating assistant safe on mobile while it remains mounted on approved pages.

This audit is isolated to `apps/web/chatbot/`. It does not change quote, pricing, product, form, lead capture, Supabase, or live page behavior.

## Mobile Safety Checklist

| Check | Required behaviour |
| --- | --- |
| Closed by default | Panel starts closed and does not auto-open on live pages |
| Minimal footprint | Floating toggle is the only visible element while closed |
| Pointer safety | Root ignores pointer events; only panel/toggle can receive clicks |
| Safe area | Bottom position includes `env(safe-area-inset-bottom)` |
| Mobile width | Widget uses left/right mobile constraints instead of full-screen takeover |
| Panel height | Panel max-height stays below viewport height |
| Route CTA stacking | Suggested route CTA stacks full-width on small screens |
| Reduced motion | Reduced-motion media query disables transitions |
| Z-index | Widget stays high enough to be usable but not globally dominant |
| No full-screen takeover | Mobile panel remains constrained and closeable |

## Required Static Signals

- `position: fixed`
- `z-index: 30`
- `pointer-events: none` on root
- `pointer-events: auto` on panel/toggle
- `bottom: calc(... env(safe-area-inset-bottom, 0px))`
- `width: min(360px, calc(100vw - 24px))`
- `@media (max-width: 640px)`
- `max-height: min(68vh, 560px)` on mobile
- `.operon-chatbot-route { flex-direction: column; }` on mobile
- `.operon-chatbot-route-link { width: 100%; }` on mobile
- `@media (prefers-reduced-motion: reduce)`

## Manual QA Before Wider Release

Check these screens in a browser before deeper integration:

- `index.html` mobile width
- `products.html` mobile width
- `quote.html` mobile width
- quote page with bottom CTA visible
- open/close behavior
- keyboard focus into the input
- route CTA does not overflow
- long assistant response scrolls inside panel

## Risk Notes

The assistant should remain closed by default on live pages. The preview may open automatically for QA, but live pages must keep `openOnInit: false`.
