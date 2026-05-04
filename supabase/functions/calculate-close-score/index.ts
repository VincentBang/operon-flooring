// Operon Flooring close probability scorer.
// Score = intent + engagement + completeness - friction, clamped to 0-100.
// The output is explainable and deterministic. No random values are used.

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type CloseBand = "high" | "medium" | "low" | "very_low";
type LeadStage = "cold" | "warm" | "hot" | "closing" | "unknown";

type QuoteRequest = {
  id: string;
  created_at: string;
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  site_address: string | null;
  status: string | null;
  lead_stage: LeadStage | null;
  engagement_score: number | null;
  last_activity: string | null;
  last_action: string | null;
  followup_paused: boolean | null;
  measurement_method: string | null;
  real_area: number | null;
  total_inc_gst: number | null;
  manual_review_required: boolean | null;
  raw_payload: Record<string, unknown> | null;
};

type QuoteEvent = {
  quote_id: string | null;
  event_name: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
};

type CloseScoreResult = {
  close_score: number;
  close_probability: number;
  close_band: CloseBand;
  close_reasons: Record<string, unknown>;
  next_action: string;
  priority_rank: number;
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

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function hoursSince(value: string | null | undefined) {
  if (!value) return Number.POSITIVE_INFINITY;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? (Date.now() - parsed) / (60 * 60 * 1000) : Number.POSITIVE_INFINITY;
}

function readPath(source: Record<string, unknown> | null | undefined, path: string) {
  let current: unknown = source || {};
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object" || !(key in current)) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function getBand(score: number): CloseBand {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  if (score >= 20) return "low";
  return "very_low";
}

function getProbability(score: number) {
  // Conservative, human-friendly probability. A perfect online signal still
  // does not mean a guaranteed job.
  const probability = 0.03 + (clamp(score, 0, 100) / 100) * 0.82;
  return Number(probability.toFixed(4));
}

function getNextAction(band: CloseBand, lead: QuoteRequest, reasons: Record<string, unknown>) {
  const friction = reasons.friction as Record<string, unknown>;
  const hasReply = ["user_replied", "customer_replied", "user_called", "customer_called"].includes(String(lead.last_action || ""));
  if (lead.followup_paused || hasReply) return "human_review_no_automation";
  if (friction && friction.measurement_unknown === true) return "request_site_assessment_or_floorplan";
  if (band === "high") return "immediate_human_contact";
  if (band === "medium") return "guided_followup";
  if (band === "low") return "nurture";
  return "minimal";
}

function getPriorityRank(score: number, band: CloseBand) {
  const bandOffset = band === "high" ? 0 : band === "medium" ? 100 : band === "low" ? 200 : 300;
  return bandOffset + (100 - clamp(Math.round(score), 0, 100));
}

function scoreIntent(lead: QuoteRequest, events: QuoteEvent[]) {
  const reasons: Record<string, unknown> = {};
  let score = 0;
  const stage = lead.lead_stage || "unknown";
  const raw = lead.raw_payload || {};
  const timeline = asString(readPath(raw, "leadAutomation.timeline")) || asString(readPath(raw, "timeline"));

  if (stage === "closing") { score += 35; reasons.lead_stage = "closing"; }
  else if (stage === "hot") { score += 30; reasons.lead_stage = "hot"; }
  else if (stage === "warm") { score += 18; reasons.lead_stage = "warm"; }
  else if (stage === "cold") { score += 6; reasons.lead_stage = "cold"; }

  if (/ready/i.test(timeline)) { score += 10; reasons.timeline = "ready_soon"; }
  if (/compar/i.test(timeline)) { score += 5; reasons.timeline = "comparing"; }
  if (/planning/i.test(timeline)) { score += 2; reasons.timeline = "planning"; }

  if (events.some((event) => event.event_name === "lead_stage_selected" && event.metadata && event.metadata.lead_stage === "hot")) {
    score += 10;
    reasons.thank_you_timing = "ready_soon";
  }
  if (events.some((event) => event.event_name === "site_assessment_requested")) {
    score += 12;
    reasons.site_assessment = "requested";
  }

  return { score: clamp(score, 0, 35), reasons };
}

function scoreEngagement(lead: QuoteRequest, events: QuoteEvent[]) {
  const counts: Record<string, number> = {};
  const reasons: Record<string, unknown> = {};
  let score = 0;

  events.forEach((event) => {
    counts[event.event_name] = (counts[event.event_name] || 0) + 1;
  });

  if (counts.quote_submit_success) score += 12;
  if (counts.summary_view) score += 8;
  if (counts.CTA_click || counts.cta_click || counts.thank_you_page_cta_click) score += Math.min(8, (counts.CTA_click || 0) * 3 + (counts.cta_click || 0) * 3 + (counts.thank_you_page_cta_click || 0) * 3);
  if (counts.chatbot_interaction) score += Math.min(8, counts.chatbot_interaction * 3);
  if (counts.quote_email_send_success) score += 5;
  if (counts.sms_reply || counts.user_replied || counts.customer_replied) score += 10;

  reasons.event_counts = counts;
  reasons.prior_engagement_score = lead.engagement_score || 0;
  return { score: clamp(score, 0, 30), reasons };
}

function scoreCompleteness(lead: QuoteRequest) {
  const reasons: Record<string, unknown> = {};
  const raw = lead.raw_payload || {};
  const measurementStatus = asString(readPath(raw, "measurement.status"));
  const extras = readPath(raw, "extras");
  let score = 0;

  if (lead.customer_name) { score += 3; reasons.name = true; }
  if (lead.phone || lead.email) { score += 4; reasons.contact = true; }
  if (lead.site_address) { score += 3; reasons.address = true; }

  const area = asNumber(lead.real_area || readPath(raw, "measurement.realArea"));
  if (area > 0) {
    score += area >= 30 ? 5 : 3;
    reasons.area_m2 = area;
  }

  if (measurementStatus && measurementStatus !== "unknown") {
    score += 4;
    reasons.measurement_status = measurementStatus;
  }

  if (readPath(raw, "job.productName") || readPath(raw, "job.productCategory")) {
    score += 3;
    reasons.product = readPath(raw, "job.productName") || readPath(raw, "job.productCategory");
  }

  if (extras && typeof extras === "object") {
    score += 4;
    reasons.extras_completion = "captured";
  }

  if (asNumber(lead.total_inc_gst || readPath(raw, "pricing.totalIncGst")) > 0) {
    score += 2;
    reasons.estimate_total = true;
  }

  return { score: clamp(score, 0, 25), reasons };
}

function scoreFriction(lead: QuoteRequest, events: QuoteEvent[]) {
  const reasons: Record<string, unknown> = {};
  const raw = lead.raw_payload || {};
  const measurementStatus = asString(readPath(raw, "measurement.status"));
  const warnings = readPath(raw, "warnings");
  let score = 0;

  const inactiveHours = hoursSince(lead.last_activity || lead.created_at);
  if (inactiveHours >= 168) { score += 18; reasons.inactivity = "7_days_plus"; }
  else if (inactiveHours >= 72) { score += 10; reasons.inactivity = "3_days_plus"; }
  else if (inactiveHours >= 24) { score += 5; reasons.inactivity = "24h_plus"; }

  if (measurementStatus === "unknown" || !asNumber(lead.real_area || readPath(raw, "measurement.realArea"))) {
    score += 8;
    reasons.measurement_unknown = true;
  }

  if (lead.manual_review_required) {
    score += 5;
    reasons.manual_review_required = true;
  }

  if (Array.isArray(warnings) && warnings.length) {
    score += Math.min(6, warnings.length * 2);
    reasons.warning_count = warnings.length;
  }

  if (!lead.phone && !lead.email) {
    score += 8;
    reasons.no_contact = true;
  }

  if (events.some((event) => event.event_name === "chatbot_hesitation_detected")) {
    score += 3;
    reasons.hesitation_signal = true;
  }

  return { score: clamp(score, 0, 30), reasons };
}

function calculateCloseScore(lead: QuoteRequest, events: QuoteEvent[]): CloseScoreResult {
  const intent = scoreIntent(lead, events);
  const engagement = scoreEngagement(lead, events);
  const completeness = scoreCompleteness(lead);
  const friction = scoreFriction(lead, events);
  const closeScore = clamp(Math.round(intent.score + engagement.score + completeness.score - friction.score), 0, 100);
  const closeBand = getBand(closeScore);
  const closeReasons = {
    formula: "intent + engagement + completeness - friction",
    intent,
    engagement,
    completeness,
    friction
  };
  const nextAction = getNextAction(closeBand, lead, { friction: friction.reasons });

  return {
    close_score: closeScore,
    close_probability: getProbability(closeScore),
    close_band: closeBand,
    close_reasons: closeReasons,
    next_action: nextAction,
    priority_rank: getPriorityRank(closeScore, closeBand)
  };
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const supabaseUrl = getEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase server credentials.");

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
  if (!response.ok) throw new Error(`Supabase request failed for ${path}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function postgrestIn(values: string[]) {
  return `(${values.map((value) => `"${String(value).replace(/"/g, '\\"')}"`).join(",")})`;
}

async function getLeads(quoteId: string, limit: number) {
  const select = "id,created_at,customer_name,phone,email,site_address,status,lead_stage,engagement_score,last_activity,last_action,followup_paused,measurement_method,real_area,total_inc_gst,manual_review_required,raw_payload";
  if (quoteId) {
    return supabaseFetch(`quote_requests?id=eq.${quoteId}&select=${select}&limit=1`) as Promise<QuoteRequest[]>;
  }
  return supabaseFetch(`quote_requests?select=${select}&order=created_at.desc&limit=${limit}`) as Promise<QuoteRequest[]>;
}

async function getEvents(quoteIds: string[]) {
  if (!quoteIds.length) return [] as QuoteEvent[];
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  return supabaseFetch(`quote_events?quote_id=in.${postgrestIn(quoteIds)}&created_at=gte.${since}&select=quote_id,event_name,created_at,metadata`) as Promise<QuoteEvent[]>;
}

async function updateLead(leadId: string, result: CloseScoreResult) {
  await supabaseFetch(`quote_requests?id=eq.${leadId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(result)
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { ok: false, error: "Method not allowed." });

  try {
    const body = await request.json().catch(() => ({})) as { quote_id?: string; limit?: number; dry_run?: boolean };
    const quoteId = isUuid(body.quote_id) ? body.quote_id : "";
    const limit = Math.min(Number(body.limit) || 50, 100);
    const dryRun = body.dry_run === true;
    const leads = await getLeads(quoteId, limit);
    const events = await getEvents((leads || []).map((lead) => lead.id));
    const byQuote = new Map<string, QuoteEvent[]>();

    events.forEach((event) => {
      if (!event.quote_id) return;
      const rows = byQuote.get(event.quote_id) || [];
      rows.push(event);
      byQuote.set(event.quote_id, rows);
    });

    const results = [];
    for (const lead of leads || []) {
      const result = calculateCloseScore(lead, byQuote.get(lead.id) || []);
      if (!dryRun) await updateLead(lead.id, result);
      results.push({ quote_id: lead.id, ...result });
    }

    return jsonResponse(200, {
      ok: true,
      dry_run: dryRun,
      processed: results.length,
      results
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Close score calculation failed."
    });
  }
});
