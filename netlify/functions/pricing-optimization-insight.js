"use strict";

function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
  };
}

function getAreaBand(area) {
  const value = Number(area) || 0;
  if (value <= 0) return "unknown";
  if (value < 30) return "small";
  if (value < 70) return "medium";
  if (value < 120) return "large";
  return "xlarge";
}

function getSuburbCluster(suburb, postcode) {
  const name = String(suburb || "").trim().toLowerCase();
  const post = String(postcode || "").trim();
  if (/parramatta|auburn|granville|westmead/.test(name) || /^21/.test(post)) return "central_west";
  if (/liverpool|cabramatta|fairfield/.test(name) || /^216/.test(post)) return "south_west";
  if (/blacktown|doonside|rooty hill/.test(name) || /^214|^276/.test(post)) return "west";
  if (/miranda|sutherland|cronulla/.test(name) || /^22/.test(post)) return "shire";
  if (/bondi|randwick|maroubra|eastern/.test(name) || /^20/.test(post)) return "east";
  return "sydney_general";
}

async function supabaseRequest(path, query) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const url = new URL(config.url + "/rest/v1/" + path);
  Object.keys(query || {}).forEach(function (key) {
    url.searchParams.set(key, query[key]);
  });

  const response = await fetch(url.toString(), {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Pricing optimisation lookup failed: " + await response.text());
  }

  return response.json();
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, { ok: false, error: "Invalid JSON payload." });
  }

  const suburbCluster = body.suburb_cluster || getSuburbCluster(body.suburb, body.postcode);
  const flooringType = body.flooring_type || body.product_category || "unknown";
  const areaBand = body.area_band || getAreaBand(body.real_area);
  const stairsFlag = body.stairs_flag === true;

  try {
    const rows = await supabaseRequest("pricing_optimization_buckets", {
      suburb_cluster: "eq." + suburbCluster,
      flooring_type: "eq." + flooringType,
      area_band: "eq." + areaBand,
      stairs_flag: "eq." + String(stairsFlag),
      select: "suburb_cluster,flooring_type,area_band,stairs_flag,sample_size,win_rate,avg_price,median_price,p25,p50,p75,avg_winning_price,median_winning_price,target_low,target_high,target_price,confidence_level,updated_at",
      limit: "1"
    });

    return jsonResponse(200, {
      ok: true,
      bucket: Array.isArray(rows) && rows.length ? rows[0] : null,
      lookup: {
        suburb_cluster: suburbCluster,
        flooring_type: flooringType,
        area_band: areaBand,
        stairs_flag: stairsFlag
      }
    });
  } catch (error) {
    return jsonResponse(200, {
      ok: false,
      bucket: null,
      error: error && error.message ? error.message : "Pricing optimisation lookup unavailable."
    });
  }
};
