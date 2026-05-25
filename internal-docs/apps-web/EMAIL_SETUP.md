# Operon Flooring Email Setup

This document covers customer quote summary emails and internal lead notification emails.

The current backend method is Netlify Functions:

- `netlify/functions/send-quote-email.js`
- `netlify/functions/save-quote-request.js`

The frontend never calls Resend directly and no email API key is exposed in browser JavaScript.

## Required Environment Variables

Add these in Netlify site settings:

```text
RESEND_API_KEY=
OPERON_FROM_EMAIL=quotes@operonflooring.com.au
OPERON_FROM_NAME=Operon Flooring Quotes
OPERON_REPLY_TO=quotes@operonflooring.com.au
OPERON_INTERNAL_EMAIL=quotes@operonflooring.com.au
```

Supabase save still requires:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Future follow-up automation remains disabled unless explicitly enabled:

```text
ENABLE_FOLLOWUP_SEND=false
DRY_RUN_FOLLOWUP_STATUS=queued
```

Do not commit real API keys.

## Resend Domain Authentication

In Resend:

1. Add the domain `operonflooring.com.au`.
2. Follow Resend's DNS instructions.
3. Add the required DNS records with your DNS/domain host.
4. Wait until Resend shows the domain as verified.
5. Use `quotes@operonflooring.com.au` as the from and reply-to email.

Typical DNS records include:

- SPF/TXT record for sending permission.
- DKIM records for email authentication.
- Optional DMARC TXT record for domain policy.

Use the exact values shown inside Resend, because they are domain-specific.

## What Gets Sent

Customer email:

- Subject: `Your flooring estimate - Operon Flooring`
- From: `Operon Flooring Quotes <quotes@operonflooring.com.au>`
- Reply-to: `quotes@operonflooring.com.au`
- Includes estimate total, selected product/category, measured area, estimated off-cut area, line item totals, included scope, and final confirmation note.
- Does not expose unit rates, margins, internal formulas, installer costs, or raw pricing logic.
- The final quote submit path honors the checked `Email me a copy of this estimate` option and sends the customer copy through the same non-blocking quote-save function.

Internal notification:

- To: `OPERON_INTERNAL_EMAIL`
- Subject format: `New Operon quote request - [Suburb] - [$Total]`
- Includes customer details, product/category, total, area, quote confidence, notes, warning flags, line items, source page, timestamp, and quote review payload if present.
- On quote submit, internal notification is attempted when Resend and `OPERON_INTERNAL_EMAIL` are configured, even if the customer email copy is not requested.

## Local Testing

Use Netlify Functions locally rather than opening `file://` directly.

1. Create a local env file from the example:

```bash
cp .env.example .env
```

2. Add real test values locally. Do not commit `.env`.

3. Start Netlify dev:

```bash
netlify dev
```

4. Open the local Netlify URL, complete the quote flow, and submit.

5. Check:

- Quote still appears before email sending.
- Quote submission does not fail if email fails.
- Customer email arrives if a customer email is provided.
- Internal notification arrives at `OPERON_INTERNAL_EMAIL`.
- No unit rates appear in either email.

## Production Testing

After deploy:

1. Confirm Netlify env vars are added.
2. Confirm Resend domain is verified.
3. Submit a real test quote with a safe test email.
4. Confirm customer email.
5. Confirm internal notification email.
6. Reply to the customer email and confirm reply-to works.
7. Check Netlify function logs for errors.
8. Check Resend logs for delivery status.

## Error Handling

If email sending fails:

- Quote submission should still be saved.
- Customer sees: `Your request was saved, but email copy could not be sent. We will follow up directly.`
- Raw provider errors stay in server logs only.
- Tracking emits `quote_email_send_failed` for the email layer while preserving the primary `quote_submit` conversion.

## Future Follow-Up Templates

The email module is prepared for future follow-up sequences:

- `immediate_quote_email`
- `day_1_scope_explainer`
- `day_3_quote_validation`
- `day_5_site_confirmation_prompt`

Scheduled follow-up sending remains disabled until explicitly approved and connected to the follow-up queue.

## Troubleshooting

If emails do not send:

- Check `RESEND_API_KEY`.
- Check domain verification in Resend.
- Check `OPERON_FROM_EMAIL` matches the authenticated domain.
- Check Netlify function logs.
- Check Resend delivery logs.
- Check spam/junk folders.
- Confirm the site is not running in direct `file://` mode.

If emails go to spam:

- Verify SPF and DKIM records.
- Add DMARC.
- Avoid spammy subject lines.
- Keep reply-to aligned with the same domain.
- Send from `quotes@operonflooring.com.au`, not a free email address.

## Manual QA Checklist

- Customer quote still appears instantly.
- Pricing total unchanged.
- Line item totals unchanged.
- No unit rates exposed.
- Customer email sends successfully.
- Internal notification sends successfully.
- Failed email does not break quote submission.
- Environment variables are not exposed in frontend.
- API key is not committed.
- Reply-to works.
- Email displays well on mobile.
