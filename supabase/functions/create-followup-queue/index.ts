// Operon Flooring follow-up queue creator.
// Safe mode: creates followup_messages only. It never sends SMS/email.
//
// Required Supabase function secrets:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type LeadStage = "hot" | "warm" | "cold" | "closing" | "unknown";
type Channel = "sms" | "email" | "manual_call";

type QueueRequest = {
  lead_id?: string;
  quote_request_id?: string;
  lead_stage?: LeadStage;
  consent_sms?: boolean;
  consent_email?: boolean;
};

type FollowupTemplate = {
  template_key: string;
  channel: Channel;
  lead_stage: LeadStage | "all";
  timing_offset_hours: number;
  subject: string | null;
  body: string;
  active: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function getEnv(name: string): string {
  return Deno.env.get(name) || "";
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function normaliseStage(value: unknown): LeadStage {
  return value === "closing" || value === "hot" || value === "warm" || value === "cold" ? value : "unknown";
}

function getTemplateKeys(stage: LeadStage, consentSms: boolean, consentEmail: boolean): Set<string> {
  const keys = new Set<string>();

  if (stage === "closing") {
    keys.add("manual_close_call");
    if (consentSms) {
      keys.add("immediate_sms_received");
    }
    if (consentEmail) {
      keys.add("immediate_email_received");
    }
  } else if (stage === "hot") {
    if (consentSms) {
      keys.add("immediate_sms_received");
      keys.add("day1_sms_checkin");
    }
    if (consentEmail) {
      keys.add("immediate_email_received");
    }
  } else if (stage === "warm") {
    if (consentSms) {
      keys.add("immediate_sms_received");
      keys.add("day7_sms_soft_reminder");
    }
    if (consentEmail) {
      keys.add("immediate_email_received");
      keys.add("day3_email_guidance");
    }
  } else if (stage === "cold") {
    if (consentEmail) {
      keys.add("immediate_email_received");
      keys.add("day14_email_planning");
    }
    if (consentSms) {
      keys.add("day7_sms_soft_reminder");
    }
  } else {
    if (consentEmail) {
      keys.add("immediate_email_received");
    }
    if (consentSms) {
      keys.add("immediate_sms_received");
    }
  }

  return keys;
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const supabaseUrl = getEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase request failed for ${path}: ${text}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function getLeadSnapshot(request: QueueRequest) {
  if (isUuid(request.lead_id)) {
    const rows = await supabaseFetch(`quote_leads?id=eq.${request.lead_id}&select=id,customer_name,phone,email,lead_stage,consent_sms,consent_email,followup_paused`);
    return Array.isArray(rows) ? rows[0] || null : null;
  }

  if (isUuid(request.quote_request_id)) {
    const rows = await supabaseFetch(`quote_requests?id=eq.${request.quote_request_id}&select=id,customer_name,phone,email,lead_stage,consent_sms,consent_email,followup_paused`);
    return Array.isArray(rows) ? rows[0] || null : null;
  }

  return null;
}

function renderTemplate(value: string, lead: Record<string, unknown>) {
  const name = String(lead.customer_name || "there").trim() || "there";
  return value.replace(/\{\{name\}\}/g, name);
}

function postgrestIn(values: string[]) {
  return `(${values.map((value) => `"${String(value).replace(/"/g, '\\"')}"`).join(",")})`;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const body = await request.json().catch(() => ({})) as QueueRequest;
    const leadId = isUuid(body.lead_id) ? body.lead_id : "";
    const quoteRequestId = isUuid(body.quote_request_id) ? body.quote_request_id : "";

    if (!leadId && !quoteRequestId) {
      return jsonResponse(400, { ok: false, error: "A valid lead_id or quote_request_id is required." });
    }

    const lead = await getLeadSnapshot(body);
    if (!lead) {
      return jsonResponse(404, { ok: false, error: "Lead not found." });
    }

    if (lead.followup_paused === true) {
      return jsonResponse(200, { ok: true, queued: 0, skipped: "followup_paused" });
    }

    const leadStage = normaliseStage(body.lead_stage || lead.lead_stage);
    const consentSms = Boolean(body.consent_sms ?? lead.consent_sms);
    const consentEmail = Boolean(body.consent_email ?? lead.consent_email ?? true);
    const allowedKeys = getTemplateKeys(leadStage, consentSms, consentEmail);

    if (!allowedKeys.size) {
      return jsonResponse(200, { ok: true, queued: 0, skipped: "no_consented_channels" });
    }

    const templates = await supabaseFetch("followup_templates?active=eq.true&select=template_key,channel,lead_stage,timing_offset_hours,subject,body,active") as FollowupTemplate[];
    const now = Date.now();
    const candidateRows = templates
      .filter((template) => allowedKeys.has(template.template_key))
      .filter((template) => template.channel !== "sms" || consentSms)
      .filter((template) => template.channel !== "email" || consentEmail)
      .map((template) => ({
        lead_id: leadId || null,
        quote_request_id: quoteRequestId || null,
        channel: template.channel,
        template_key: template.template_key,
        scheduled_for: new Date(now + Number(template.timing_offset_hours || 0) * 60 * 60 * 1000).toISOString(),
        status: "queued",
        payload: {
          dry_run_required: true,
          lead_stage: leadStage,
          consent_sms: consentSms,
          consent_email: consentEmail,
          to_phone: lead.phone || "",
          to_email: lead.email || "",
          subject: template.subject ? renderTemplate(template.subject, lead) : null,
          body: renderTemplate(template.body, lead)
        }
      }));

    if (!candidateRows.length) {
      return jsonResponse(200, { ok: true, queued: 0, skipped: "no_matching_templates" });
    }

    const existingPath = leadId
      ? `followup_messages?lead_id=eq.${leadId}&template_key=in.${postgrestIn(candidateRows.map((row) => row.template_key))}&select=template_key`
      : `followup_messages?quote_request_id=eq.${quoteRequestId}&template_key=in.${postgrestIn(candidateRows.map((row) => row.template_key))}&select=template_key`;
    const existingRows = await supabaseFetch(existingPath) as Array<{ template_key: string }>;
    const existingKeys = new Set((existingRows || []).map((row) => row.template_key));
    const rows = candidateRows.filter((row) => !existingKeys.has(row.template_key));

    if (!rows.length) {
      return jsonResponse(200, { ok: true, queued: 0, skipped: "already_queued" });
    }

    await supabaseFetch("followup_messages", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(rows)
    });

    const nextFollowupAt = rows
      .map((row) => row.scheduled_for)
      .sort()[0];

    if (leadId) {
      await supabaseFetch(`quote_leads?id=eq.${leadId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          lead_stage: leadStage,
          consent_sms: consentSms,
          consent_email: consentEmail,
          followup_status: "queued",
          next_followup_at: nextFollowupAt
        })
      });
    } else {
      await supabaseFetch(`quote_requests?id=eq.${quoteRequestId}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          lead_stage: leadStage,
          consent_sms: consentSms,
          consent_email: consentEmail,
          followup_status: "queued",
          next_followup_at: nextFollowupAt
        })
      });
    }

    return jsonResponse(200, {
      ok: true,
      queued: rows.length,
      lead_stage: leadStage,
      dry_run_only: true
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Follow-up queue creation failed."
    });
  }
});
