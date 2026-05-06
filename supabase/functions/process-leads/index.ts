// Operon Flooring automated close processor.
// Runs safely in dry-run/queue mode by default. It scores leads, updates stage,
// and queues next actions. It does not send SMS/email unless a separate
// follow-up processor is explicitly enabled with provider credentials.

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type LeadStage = "cold" | "warm" | "hot" | "closing" | "unknown";
type Channel = "sms" | "email" | "manual_call";

type QuoteRequest = {
  id: string;
  created_at: string;
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  lead_stage: LeadStage | null;
  engagement_score: number | null;
  close_score: number | null;
  close_band: "high" | "medium" | "low" | "very_low" | null;
  close_probability: number | null;
  next_action: string | null;
  last_activity: string | null;
  last_action: string | null;
  followup_paused: boolean | null;
  consent_sms: boolean | null;
  consent_email: boolean | null;
  raw_payload: Record<string, unknown> | null;
};

type QuoteEvent = {
  quote_id: string | null;
  event_name: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

type FollowupTemplate = {
  template_key: string;
  channel: Channel;
  subject: string | null;
  body: string;
  active: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const HUMAN_ESCALATION_ACTIONS = new Set([
  "user_replied",
  "customer_replied",
  "user_called",
  "customer_called",
  "site_visit_booked",
  "site_assessment_booked",
  "final_quote_confirmed",
  "job_booked",
  "won",
  "lost"
]);

const STOP_STATUSES = new Set([
  "site_visit_booked",
  "site_assessment_booked",
  "quoted",
  "won",
  "lost",
  "completed",
  "cancelled"
]);

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

function getTablePath(path: string): string {
  const mode = getEnv("OPERON_SUPABASE_SCHEMA_MODE").trim().toLowerCase();
  if (!(mode === "v2" || mode === "clean" || mode === "operon_v2")) return path;
  const questionIndex = path.indexOf("?");
  const tableName = questionIndex >= 0 ? path.slice(0, questionIndex) : path;
  const suffix = questionIndex >= 0 ? path.slice(questionIndex) : "";
  return tableName.startsWith("operon_") ? path : `operon_${tableName}${suffix}`;
}

function hoursSince(value: string | null | undefined) {
  if (!value) {
    return Number.POSITIVE_INFINITY;
  }
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    return Number.POSITIVE_INFINITY;
  }
  return (Date.now() - timestamp) / (60 * 60 * 1000);
}

function normaliseStage(value: unknown): LeadStage {
  if (value === "closing" || value === "hot" || value === "warm" || value === "cold") {
    return value;
  }
  return "unknown";
}

function stageFromScore(score: number): LeadStage {
  if (score >= 80) return "closing";
  if (score >= 55) return "hot";
  if (score >= 25) return "warm";
  return "cold";
}

function scoreEvent(event: QuoteEvent) {
  const name = event.event_name;
  const metadata = event.metadata || {};
  let score = 0;

  if (name === "quote_submit_success") score += 45;
  if (name === "quote_submit") score += 30;
  if (name === "summary_view") score += 20;
  if (name === "chatbot_interaction") score += 12;
  if (name === "CTA_click" || name === "cta_click" || name === "thank_you_page_cta_click") score += 8;
  if (name === "quote_email_send_success") score += 15;
  if (name === "lead_stage_selected") {
    if (metadata.lead_stage === "hot") score += 35;
    if (metadata.lead_stage === "warm") score += 20;
    if (metadata.lead_stage === "cold") score += 5;
  }
  if (name === "chatbot_hesitation_detected") score += 18;
  if (name === "site_assessment_requested") score += 40;

  return score;
}

function latestEvent(events: QuoteEvent[]) {
  return events.slice().sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0] || null;
}

function renderTemplate(value: string, lead: QuoteRequest) {
  const name = String(lead.customer_name || "there").trim() || "there";
  return value.replace(/\{\{name\}\}/g, name);
}

function getActionForLead(lead: QuoteRequest, score: number, stage: LeadStage, lastActivity: string | null) {
  const lastAction = lead.last_action || "";
  const inactiveHours = hoursSince(lastActivity || lead.last_activity || lead.created_at);
  const closeBand = lead.close_band || "";
  const closeScore = Number(lead.close_score || 0);

  if (closeBand === "high" || closeScore >= 75) {
    return {
      action: "immediate_human_contact",
      templateKey: "manual_close_call",
      channel: "manual_call" as Channel,
      scheduleHours: 0
    };
  }

  if (closeBand === "medium") {
    return {
      action: "guided_followup",
      templateKey: lead.consent_sms ? "day1_sms_checkin" : "day3_email_guidance",
      channel: lead.consent_sms ? "sms" as Channel : "email" as Channel,
      scheduleHours: inactiveHours >= 24 ? 0 : Math.max(0, 24 - inactiveHours)
    };
  }

  if (!lastAction || lastAction === "quote_submit" || lastAction === "summary_view") {
    return {
      action: "send_immediate_response",
      templateKey: lead.consent_email === false ? "" : "immediate_email_received",
      channel: "email" as Channel,
      scheduleHours: 0.1
    };
  }

  if (stage === "closing" || score >= 80) {
    return {
      action: "trigger_close_script",
      templateKey: "manual_close_call",
      channel: "manual_call" as Channel,
      scheduleHours: 0
    };
  }

  if (inactiveHours >= 168) {
    return {
      action: "send_soft_reminder",
      templateKey: lead.consent_sms ? "day7_sms_soft_reminder" : "day14_email_planning",
      channel: lead.consent_sms ? "sms" as Channel : "email" as Channel,
      scheduleHours: 0
    };
  }

  if (inactiveHours >= 24) {
    return {
      action: "send_24h_followup",
      templateKey: stage === "hot" && lead.consent_sms ? "day1_sms_checkin" : "day3_email_guidance",
      channel: stage === "hot" && lead.consent_sms ? "sms" as Channel : "email" as Channel,
      scheduleHours: 0
    };
  }

  return {
    action: "monitor",
    templateKey: "",
    channel: "manual_call" as Channel,
    scheduleHours: 0
  };
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const supabaseUrl = getEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const tablePath = getTablePath(path);

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${tablePath}`, {
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
    throw new Error(`Supabase request failed for ${tablePath}: ${text}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function postgrestIn(values: string[]) {
  return `(${values.map((value) => `"${String(value).replace(/"/g, '\\"')}"`).join(",")})`;
}

async function getRecentLeads(limit: number) {
  return supabaseFetch(
    "quote_requests?select=id,created_at,customer_name,phone,email,status,lead_stage,engagement_score,close_score,close_band,close_probability,next_action,last_activity,last_action,followup_paused,consent_sms,consent_email,raw_payload&order=created_at.desc&limit=" + limit
  ) as Promise<QuoteRequest[]>;
}

async function getEventsForLeads(quoteIds: string[]) {
  if (!quoteIds.length) {
    return [] as QuoteEvent[];
  }
  return supabaseFetch(
    "quote_events?quote_id=in." + postgrestIn(quoteIds) + "&created_at=gte." + new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() + "&select=quote_id,event_name,created_at,metadata"
  ) as Promise<QuoteEvent[]>;
}

async function getTemplate(templateKey: string) {
  const rows = await supabaseFetch(
    "followup_templates?template_key=eq." + encodeURIComponent(templateKey) + "&active=eq.true&select=template_key,channel,subject,body,active&limit=1"
  ) as FollowupTemplate[];
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function hasQueuedAction(quoteRequestId: string, templateKey: string) {
  const rows = await supabaseFetch(
    "followup_messages?quote_request_id=eq." + quoteRequestId + "&template_key=eq." + encodeURIComponent(templateKey) + "&select=id&limit=1"
  ) as Array<{ id: string }>;
  return Array.isArray(rows) && rows.length > 0;
}

async function queueAction(lead: QuoteRequest, action: ReturnType<typeof getActionForLead>, stage: LeadStage) {
  if (!action.templateKey) {
    return false;
  }

  if (action.channel === "sms" && !lead.consent_sms) {
    return false;
  }

  if (action.channel === "email" && lead.consent_email === false) {
    return false;
  }

  if (await hasQueuedAction(lead.id, action.templateKey)) {
    return false;
  }

  let template = await getTemplate(action.templateKey);
  if (!template && action.templateKey === "manual_close_call") {
    template = {
      template_key: "manual_close_call",
      channel: "manual_call",
      subject: null,
      body: "Use OPERON_CLOSE_SCRIPTS.md phone close script. Confirm scope, preparation, access, stairs, removal/disposal and next step without pressure.",
      active: true
    };
  }

  if (!template) {
    return false;
  }

  const scheduledFor = new Date(Date.now() + action.scheduleHours * 60 * 60 * 1000).toISOString();
  await supabaseFetch("followup_messages", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      quote_request_id: lead.id,
      channel: template.channel,
      template_key: template.template_key,
      scheduled_for: scheduledFor,
      status: "queued",
      payload: {
        dry_run_required: true,
        close_action: action.action,
        lead_stage: stage,
        engagement_score: lead.engagement_score || 0,
        close_score: lead.close_score || 0,
        close_band: lead.close_band || "",
        close_probability: lead.close_probability || 0,
        to_phone: lead.phone || "",
        to_email: lead.email || "",
        subject: template.subject ? renderTemplate(template.subject, lead) : null,
        body: renderTemplate(template.body, lead)
      }
    })
  });

  await supabaseFetch("quote_requests?id=eq." + lead.id, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      last_action: action.action,
      next_followup_at: scheduledFor,
      followup_status: "queued"
    })
  });

  return true;
}

async function updateLeadScore(lead: QuoteRequest, events: QuoteEvent[]) {
  const eventScore = events.reduce((total, event) => total + scoreEvent(event), 0);
  const baseScore = lead.status === "emailed" ? 20 : 0;
  const score = Math.min(100, Math.max(0, baseScore + eventScore));
  const stage = stageFromScore(score);
  const last = latestEvent(events);
  const lastActivity = last ? last.created_at : (lead.last_activity || lead.created_at);
  const lastEventAction = last ? last.event_name : lead.last_action || "created";

  await supabaseFetch("quote_requests?id=eq." + lead.id, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      engagement_score: score,
      lead_stage: stage,
      last_activity: lastActivity,
      last_action: HUMAN_ESCALATION_ACTIONS.has(lead.last_action || "") ? lead.last_action : lastEventAction
    })
  });

  return { score, stage, lastActivity, lastEventAction };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const limit = Math.min(Number(new URL(request.url).searchParams.get("limit")) || 50, 100);
    const leads = await getRecentLeads(limit);
    const events = await getEventsForLeads((leads || []).map((lead) => lead.id));
    const eventsByQuote = new Map<string, QuoteEvent[]>();

    (events || []).forEach((event) => {
      if (!event.quote_id) return;
      const rows = eventsByQuote.get(event.quote_id) || [];
      rows.push(event);
      eventsByQuote.set(event.quote_id, rows);
    });

    let queuedCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const lead of leads || []) {
      if (lead.followup_paused || STOP_STATUSES.has(String(lead.status || "")) || HUMAN_ESCALATION_ACTIONS.has(String(lead.last_action || ""))) {
        skippedCount += 1;
        results.push({ id: lead.id, skipped: true, reason: "human_escalation_or_paused" });
        continue;
      }

      const leadEvents = eventsByQuote.get(lead.id) || [];
      const scored = await updateLeadScore(lead, leadEvents);
      const scoredLead = Object.assign({}, lead, {
        engagement_score: scored.score,
        lead_stage: normaliseStage(scored.stage),
        last_activity: scored.lastActivity,
        last_action: scored.lastEventAction
      });
      const action = getActionForLead(scoredLead, scored.score, scored.stage, scored.lastActivity);
      const queued = await queueAction(scoredLead, action, scored.stage);

      if (queued) {
        queuedCount += 1;
      } else {
        skippedCount += 1;
      }

      results.push({
        id: lead.id,
        engagement_score: scored.score,
        lead_stage: scored.stage,
        action: action.action,
        queued
      });
    }

    await supabaseFetch("close_automation_runs", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        processed_count: (leads || []).length,
        queued_count: queuedCount,
        skipped_count: skippedCount,
        dry_run: getEnv("ENABLE_CLOSE_AUTOMATION_SEND") !== "true",
        notes: { results: results.slice(0, 25) }
      })
    });

    return jsonResponse(200, {
      ok: true,
      processed: (leads || []).length,
      queued: queuedCount,
      skipped: skippedCount,
      results
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Lead processing failed."
    });
  }
});
