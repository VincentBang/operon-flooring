# Account Security Checklist

Use this before production scale or paid acquisition.

## GitHub

- Require 2FA for all contributors.
- Enable branch protection on `main`.
- Require PR review for production-affecting changes.
- Enable secret scanning and push protection.
- Enable Dependabot security updates.
- Avoid shared personal accounts for production access.

## Netlify

- Enable MFA.
- Limit team access by role.
- Store secrets only as Netlify environment variables.
- Protect production deploys where possible.
- Rotate `OPERON_ADMIN_TOKEN` if shared or exposed.
- Rotate `RESEND_API_KEY` if exposed.
- Review function logs for accidental personal data or secret logging.

## Supabase

- Enable MFA on owner/admin accounts.
- Verify RLS and storage policies before production traffic.
- Keep service role keys server-side only.
- Rotate service role keys if exposed.
- Use private storage buckets for customer uploads.
- Avoid broad public select/update/delete policies.

## OpenAI and Resend

- Keep API keys server-side only.
- Use separate production and development keys where possible.
- Rotate keys if exposed in code, logs, screenshots or shared chats.
- Do not send unnecessary customer personal data to AI providers.

## Password and Access Hygiene

- Use a password manager.
- No shared passwords for production services.
- Remove access for old collaborators.
- Record who owns each production credential.
