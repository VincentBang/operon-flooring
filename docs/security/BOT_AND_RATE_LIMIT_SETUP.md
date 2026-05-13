# Bot Protection And Rate Limit Setup

This site uses two layers of abuse protection:

1. Durable IP-based rate limits stored in Supabase through `operon_check_rate_limit`.
2. Cloudflare Turnstile bot checks on high-abuse customer actions when a Turnstile secret is configured.

## Supabase Migration

Run this file in Supabase before relying on durable rate limits:

`supabase/migrations/20260512_security_rate_limits.sql`

It creates:

- `public.operon_rate_limits`
- `public.operon_check_rate_limit(...)`

The table stores hashed client identifiers only. It does not store customer names, phone numbers, emails, addresses, quote payloads, files, or pricing data.

## Netlify Environment Variables

Set these in Netlify production:

- `OPERON_RATE_LIMIT_SALT`: long random value used to hash client IPs for rate limiting.
- `OPERON_TURNSTILE_SECRET`: Cloudflare Turnstile secret key.
- `OPERON_ALLOWED_ORIGINS`: comma-separated production origins, for example `https://operonflooring.com.au,https://www.operonflooring.com.au`.

Existing required server secrets still apply:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPERON_ADMIN_TOKEN`
- email/OCR provider keys where used

## Frontend Turnstile Site Key

Set the public Cloudflare Turnstile site key in:

`apps/web/security-config.js`

```js
window.OPERON_SECURITY_CONFIG = {
  turnstileSiteKey: "your_public_site_key"
};
```

If the site key is empty, the browser sends no challenge token. If `OPERON_TURNSTILE_SECRET` is also empty, server-side bot checks are skipped so local development keeps working.

Do not set `OPERON_TURNSTILE_SECRET` in Netlify until the public site key is deployed, otherwise protected actions will return `403 Bot check is required`.

## Protected Actions

Durable rate limiting now covers:

- quote request save/email/submit function
- quote review OCR/upload
- customer file upload
- quote review save
- operator request from chatbot
- lead admin endpoint
- follow-up admin endpoint
- private quote calculation endpoint

Turnstile tokens are sent for:

- quote email copy
- customer file upload
- quote review OCR upload
- quote review save
- chatbot operator request

## Operational QA

After deploying:

1. Confirm `supabase/migrations/20260512_security_rate_limits.sql` has run successfully.
2. Confirm `operon_rate_limits` receives rows after endpoint traffic.
3. Confirm quote email copy works.
4. Confirm quote review upload/OCR works.
5. Confirm floor plan or quote file upload works.
6. Confirm chatbot operator request works.
7. Confirm admin dashboard still loads with `OPERON_ADMIN_TOKEN`.
8. Confirm unauthorised admin requests return `401`.
9. Confirm repeated abuse returns `429`.
10. Confirm no personal data appears in `operon_rate_limits`.

