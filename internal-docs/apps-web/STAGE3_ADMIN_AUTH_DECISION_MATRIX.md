# Stage 3 Admin Auth Decision Matrix

Date: 2026-06-04

Purpose: choose the admin authentication approach before any Operon OS dashboard reads or writes are connected.

The locked `/admin.html` shell exists locally, but no real admin auth or lead data access is implemented yet.

## Decision Rule

Do not connect `admin-leads-list`, `admin-lead-detail`, status updates, notes, file access, or follow-up actions until one admin auth approach is approved.

Every option must satisfy:

- Admin routes stay `noindex,nofollow`.
- Admin routes are excluded from sitemap.
- Unauthenticated admin Functions return 401 or 403.
- Admin Functions use `Cache-Control: no-store`.
- Supabase service-role credentials remain server-side only.
- Browser never directly selects `operon_leads` or related lead tables.
- Admin responses never include storage bucket/path by default.
- Admin responses never include raw OCR text by default.
- Admin responses never include internal pricing/rate fields.

## Option A: Netlify Identity Invite-Only

Fit:

- Good short-term fit if Operon operators can use Netlify-managed invite-only accounts.
- Works naturally with Netlify Functions as the server boundary.

Required proof before coding data reads:

- Invite-only user creation flow works in preview.
- Admin role or allowlist is available to Functions.
- Non-admin identity users receive 403.
- Expired/invalid identity token receives 401 or 403.
- Logout clears admin access.

Risks:

- Netlify Identity setup must be tested carefully in preview and production.
- Future multi-vertical permissions may need more structure later.

## Option B: Supabase Auth Admin Claims

Fit:

- Better long-term fit if Operon OS will share admin access across Flooring, Kitchens, and future verticals.
- Keeps identity closer to Supabase lead data.

Required proof before coding data reads:

- Admin claim/role is stored server-verifiably.
- Functions validate claims server-side.
- Browser still does not directly select lead tables.
- Non-admin authenticated users receive 403.
- RLS remains closed for public anon roles.

Risks:

- More integration work than Netlify Identity.
- Easy to accidentally introduce direct browser Supabase reads if the boundary is not enforced.

## Option C: Temporary Environment Admin Token

Fit:

- Private proof-of-concept only.
- Useful for a short internal preview when Identity/Auth setup is not ready.

Required proof before coding data reads:

- Token is supplied only through Netlify environment variables.
- Token is short-lived or rotated before production.
- Token is never committed or printed.
- Admin Functions compare token server-side only.
- Browser storage does not persist the raw token longer than necessary.

Risks:

- Not acceptable as the long-term production admin model.
- Higher operational risk if shared manually.

## Recommendation

Preferred production path:

1. Use Netlify Identity for the first flooring-only internal admin if speed matters.
2. Use Supabase Auth admin claims if multi-vertical Operon OS access is the priority.
3. Use temporary admin token only for a private proof and only with explicit approval.

## Approval Checklist

Before coding admin data reads, record:

- Chosen auth approach.
- Who can access admin.
- How admin role is represented.
- How Functions validate the role.
- How logout/session expiry works.
- Whether `/admin` redirects, 404s, or remains documented separately from `/admin.html`.
- Route-surface decision recorded in `STAGE3_ADMIN_ROUTE_SURFACE_DECISION.md`.
- Which preview URL will be used for auth testing.
- Rollback plan for removing admin routes/functions.

## Stop Conditions

Stop before implementation if:

- Auth approach is not selected.
- `/admin` route behavior is not approved.
- Lead write preview verification has not passed.
- Admin Functions cannot reliably return 401/403 without leaking details.
- Any public conversion test fails.
