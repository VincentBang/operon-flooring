// Operon Flooring pricing optimisation aggregation.
// Aggregates historical quote outcomes into bucket metrics. It never changes
// quote calculation rates and does not expose internal margin/cost data.

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type Outcome = {
  suburb_cluster: string;
  flooring_type: string;
  area_band: string;
  stairs_flag: boolean;
  quote_total: number;
  close_status: "won" | "lost" | "no_response";
  final_price: number | null;
};

type BucketMetric = {
  suburb_cluster: string;
  flooring_type: string;
  area_band: string;
  stairs_flag: boolean;
  sample_size: number;
  won_count: number;
  lost_count: number;
  no_response_count: number;
  win_rate: number;
  avg_price: number;
  median_price: number;
  p25: number;
  p40: number;
  p50: number;
  p65: number;
  p75: number;
  avg_winning_price: number;
  median_winning_price: number;
  target_low: number;
  target_high: number;
  target_price: number;
  confidence_level: "low" | "medium" | "high";
  updated_at: string;
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

function getTablePath(path: string): string {
  const mode = getEnv("OPERON_SUPABASE_SCHEMA_MODE").trim().toLowerCase();
  if (!(mode === "v2" || mode === "clean" || mode === "operon_v2")) return path;
  const questionIndex = path.indexOf("?");
  const tableName = questionIndex >= 0 ? path.slice(0, questionIndex) : path;
  const suffix = questionIndex >= 0 ? path.slice(questionIndex) : "";
  return tableName.startsWith("operon_") ? path : `operon_${tableName}${suffix}`;
}

function roundMoney(value: number) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function percentile(values: number[], percentileValue: number) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  if (sorted.length === 1) return sorted[0];
  const index = (sorted.length - 1) * percentileValue;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function getBucketKey(outcome: Outcome) {
  return [
    outcome.suburb_cluster || "sydney_general",
    outcome.flooring_type || "unknown",
    outcome.area_band || "unknown",
    outcome.stairs_flag ? "stairs" : "no_stairs"
  ].join("|");
}

function getConfidenceLevel(sampleSize: number): "low" | "medium" | "high" {
  if (sampleSize >= 30) return "high";
  if (sampleSize >= 10) return "medium";
  return "low";
}

function calculateBucket(outcomes: Outcome[]): BucketMetric {
  const first = outcomes[0];
  const quotePrices = outcomes.map((row) => Number(row.quote_total || 0)).filter((value) => value > 0);
  const won = outcomes.filter((row) => row.close_status === "won");
  const lost = outcomes.filter((row) => row.close_status === "lost");
  const noResponse = outcomes.filter((row) => row.close_status === "no_response");
  const winningPrices = won
    .map((row) => Number(row.final_price || row.quote_total || 0))
    .filter((value) => value > 0);
  const sampleSize = outcomes.length;
  const p40 = percentile(quotePrices, 0.40);
  const p65 = percentile(quotePrices, 0.65);
  const medianWinningPrice = percentile(winningPrices, 0.50);
  const medianPrice = percentile(quotePrices, 0.50);

  return {
    suburb_cluster: first.suburb_cluster || "sydney_general",
    flooring_type: first.flooring_type || "unknown",
    area_band: first.area_band || "unknown",
    stairs_flag: !!first.stairs_flag,
    sample_size: sampleSize,
    won_count: won.length,
    lost_count: lost.length,
    no_response_count: noResponse.length,
    win_rate: sampleSize ? roundMoney(won.length / sampleSize) : 0,
    avg_price: roundMoney(average(quotePrices)),
    median_price: roundMoney(medianPrice),
    p25: roundMoney(percentile(quotePrices, 0.25)),
    p40: roundMoney(p40),
    p50: roundMoney(medianPrice),
    p65: roundMoney(p65),
    p75: roundMoney(percentile(quotePrices, 0.75)),
    avg_winning_price: roundMoney(average(winningPrices)),
    median_winning_price: roundMoney(medianWinningPrice),
    target_low: roundMoney(p40 || medianPrice),
    target_high: roundMoney(p65 || medianPrice),
    target_price: roundMoney(medianWinningPrice || medianPrice),
    confidence_level: getConfidenceLevel(sampleSize),
    updated_at: new Date().toISOString()
  };
}

async function supabaseFetch(path: string, init: RequestInit = {}) {
  const supabaseUrl = getEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const tablePath = getTablePath(path);
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase server credentials.");

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

  if (!response.ok) throw new Error(`Supabase request failed for ${tablePath}: ${await response.text()}`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function loadOutcomes(limit: number) {
  return supabaseFetch(
    `quote_pricing_outcomes?select=suburb_cluster,flooring_type,area_band,stairs_flag,quote_total,close_status,final_price&quote_total=gt.0&order=created_at.desc&limit=${limit}`
  ) as Promise<Outcome[]>;
}

async function upsertBuckets(buckets: BucketMetric[]) {
  if (!buckets.length) return;
  await supabaseFetch("pricing_optimization_buckets?on_conflict=suburb_cluster,flooring_type,area_band,stairs_flag", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(buckets)
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse(405, { ok: false, error: "Method not allowed." });

  try {
    const body = await request.json().catch(() => ({})) as { limit?: number; dry_run?: boolean };
    const limit = Math.min(Number(body.limit) || 5000, 10000);
    const dryRun = body.dry_run === true;
    const outcomes = await loadOutcomes(limit);
    const grouped = new Map<string, Outcome[]>();

    (outcomes || []).forEach((outcome) => {
      const key = getBucketKey(outcome);
      const rows = grouped.get(key) || [];
      rows.push(outcome);
      grouped.set(key, rows);
    });

    const buckets = Array.from(grouped.values()).map(calculateBucket);
    if (!dryRun) await upsertBuckets(buckets);

    return jsonResponse(200, {
      ok: true,
      dry_run: dryRun,
      outcome_count: outcomes.length,
      bucket_count: buckets.length,
      buckets: buckets.slice(0, 25)
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Pricing optimisation calculation failed."
    });
  }
});
