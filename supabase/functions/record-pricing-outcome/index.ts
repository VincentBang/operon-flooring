// Records won/lost/no_response outcomes for pricing optimisation.
// This updates historical learning data only. It does not change quote pricing.

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type QuoteRequest = {
  id: string;
  created_at: string;
  suburb: string | null;
  postcode: string | null;
  product_category: string | null;
  real_area: number | null;
  total_inc_gst: number | null;
  manual_review_required: boolean | null;
  raw_payload: Record<string, unknown> | null;
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
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value);
}

function asNumber(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function readPath(source: Record<string, unknown> | null | undefined, path: string) {
  let current: unknown = source || {};
  for (const key of path.split(".")) {
    if (!current || typeof current !== "object" || !(key in current)) return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function getAreaBand(area: number) {
  if (area <= 0) return "unknown";
  if (area < 30) return "small";
  if (area < 70) return "medium";
  if (area < 120) return "large";
  return "xlarge";
}

function getSuburbCluster(suburb: string, postcode: string) {
  const name = suburb.trim().toLowerCase();
  const post = postcode.trim();
  if (/parramatta|auburn|granville|westmead/.test(name) || /^21/.test(post)) return "central_west";
  if (/liverpool|cabramatta|fairfield/.test(name) || /^216/.test(post)) return "south_west";
  if (/blacktown|doonside|rooty hill/.test(name) || /^214|^276/.test(post)) return "west";
  if (/miranda|sutherland|cronulla/.test(name) || /^22/.test(post)) return "shire";
  if (/bondi|randwick|maroubra|eastern/.test(name) || /^20/.test(post)) return "east";
  return "sydney_general";
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

async function getQuote(quoteId: string) {
  const rows = await supabaseFetch(
    `quote_requests?id=eq.${quoteId}&select=id,created_at,suburb,postcode,product_category,real_area,total_inc_gst,manual_review_required,raw_payload&limit=1`
  ) as QuoteRequest[];
  return Array.isArray(rows) ? rows[0] || null : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { ok: false, error: "Method not allowed." });

  try {
    const body = await request.json().catch(() => ({})) as {
      quote_id?: string;
      close_status?: "won" | "lost" | "no_response";
      final_price?: number;
      close_time_hours?: number;
      lost_reason?: string;
    };

    if (!isUuid(body.quote_id)) return jsonResponse(400, { ok: false, error: "Valid quote_id is required." });
    const closeStatus = body.close_status === "won" || body.close_status === "lost" ? body.close_status : "no_response";
    const quote = await getQuote(body.quote_id);
    if (!quote) return jsonResponse(404, { ok: false, error: "Quote not found." });

    const raw = quote.raw_payload || {};
    const area = asNumber(quote.real_area || readPath(raw, "measurement.realArea"));
    const suburb = quote.suburb || String(readPath(raw, "customer.suburb") || "");
    const postcode = quote.postcode || String(readPath(raw, "customer.postcode") || "");
    const flooringType = quote.product_category || String(readPath(raw, "job.productCategory") || "unknown");
    const stairsFlag = readPath(raw, "job.stairsIncluded") === true || asNumber(readPath(raw, "job.stairCount")) > 0;
    const pricing = readPath(raw, "pricing") as Record<string, unknown> || {};

    const row = {
      quote_request_id: quote.id,
      suburb,
      postcode,
      suburb_cluster: getSuburbCluster(suburb, postcode),
      flooring_type: flooringType,
      area_band: getAreaBand(area),
      stairs_flag: stairsFlag,
      extras_flags: raw.extras || {},
      quote_total: asNumber(quote.total_inc_gst || readPath(raw, "pricing.totalIncGst")),
      breakdown_totals: {
        material_total: asNumber(pricing.materialTotal),
        installation_total: asNumber(pricing.installationTotal),
        removal_total: asNumber(pricing.removalTotal),
        disposal_total: asNumber(pricing.disposalTotal),
        floor_prep_total: asNumber(pricing.floorPrepTotal),
        skirting_total: asNumber(pricing.skirtingTotal),
        scotia_total: asNumber(pricing.scotiaTotal)
      },
      confidence_level: String(readPath(raw, "measurement.quoteConfidence") || "low").toLowerCase(),
      close_status: closeStatus,
      final_price: closeStatus === "won" ? asNumber(body.final_price) : null,
      close_time_hours: asNumber(body.close_time_hours),
      lost_reason: closeStatus === "lost" ? String(body.lost_reason || "") : null,
      raw_payload: raw
    };

    await supabaseFetch("quote_pricing_outcomes?on_conflict=quote_request_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(row)
    });

    return jsonResponse(200, { ok: true, quote_id: quote.id, close_status: closeStatus });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Pricing outcome save failed."
    });
  }
});
