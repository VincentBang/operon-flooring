-- Operon Flooring live follow-up email activation.
-- Run after supabase/operon_v2_clean_schema.sql.
-- This seeds the v2 follow-up templates used by netlify/functions/process-followups.js.

insert into public.operon_followup_templates (
  template_key,
  channel,
  lead_stage,
  timing_offset_hours,
  subject,
  body,
  active
) values
  (
    'manual_quote_review',
    'manual_call',
    'all',
    0,
    null,
    'Review the submitted quote request. Confirm product, measured area, preparation, removal/disposal, trims, stairs, access and the best next step before contacting the customer.',
    true
  ),
  (
    'immediate_email_received',
    'email',
    'all',
    0,
    'Your flooring estimate - next steps',
    'Hi {{name}},

Thanks for sending your flooring estimate through Operon Flooring.

We will review the product, measured area and scope details before final confirmation. If anything needs clarification, we will contact you before work is booked.

Regards,
Operon Flooring',
    true
  ),
  (
    'day1_sms_checkin',
    'sms',
    'hot',
    24,
    null,
    'Hi {{name}}, just checking if you had any questions about your Operon flooring estimate. We can confirm scope before you make a decision.',
    true
  ),
  (
    'day3_email_guidance',
    'email',
    'warm',
    72,
    'Flooring quote clarity',
    'Hi {{name}},

A quick follow-up on your flooring estimate.

The main items worth checking before booking are product range, measured area, floor preparation, removal/disposal, trims and access. These are the details that usually affect final scope.

If you would like us to review anything, reply to this email and we can help clarify the next step.

Regards,
Operon Flooring',
    true
  ),
  (
    'day7_sms_soft_reminder',
    'sms',
    'all',
    168,
    null,
    'Hi {{name}}, if your flooring project is still moving ahead, we can help confirm scope and next steps from your Operon estimate.',
    true
  ),
  (
    'day14_email_planning',
    'email',
    'cold',
    336,
    'Planning your flooring project',
    'Hi {{name}},

Just checking in while you are planning your flooring project.

When you are ready, the next useful step is to confirm area, product direction and any site details such as access, preparation or removal.

Regards,
Operon Flooring',
    true
  )
on conflict (template_key) do update set
  channel = excluded.channel,
  lead_stage = excluded.lead_stage,
  timing_offset_hours = excluded.timing_offset_hours,
  subject = excluded.subject,
  body = excluded.body,
  active = excluded.active,
  updated_at = now();
