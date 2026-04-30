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
  const url = (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, "");
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "";
  return { url: url, serviceRoleKey: serviceRoleKey };
}

async function supabaseRequest(path, options) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const settings = Object.assign({
    method: "GET",
    query: null,
    body: null,
    headers: {}
  }, options || {});

  const url = new URL(config.url + "/rest/v1/" + path);
  if (settings.query) {
    Object.keys(settings.query).forEach(function (key) {
      url.searchParams.set(key, settings.query[key]);
    });
  }

  const headers = Object.assign({
    apikey: config.serviceRoleKey,
    Authorization: "Bearer " + config.serviceRoleKey,
    Accept: "application/json"
  }, settings.headers || {});

  if (settings.body !== null && typeof settings.body !== "undefined") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url.toString(), {
    method: settings.method,
    headers: headers,
    body: settings.body !== null && typeof settings.body !== "undefined"
      ? JSON.stringify(settings.body)
      : undefined
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase write failed for " + path + ": " + text);
  }

  const responseText = await response.text();
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    return responseText;
  }
}

function parseNumber(value) {
  if (value === "" || value === null || typeof value === "undefined") {
    return 0;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function createQuoteUuid() {
  if (typeof crypto !== "undefined" && crypto && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "quote-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
}

function getQuoteRow(quoteId, payload, status) {
  return {
    id: quoteId,
    customer_name: payload.customer && payload.customer.name || "",
    phone: payload.customer && payload.customer.phone || "",
    email: payload.customer && payload.customer.email || "",
    site_address: payload.customer && payload.customer.siteAddress || "",
    suburb: payload.customer && payload.customer.suburb || "",
    postcode: payload.customer && payload.customer.postcode || "",
    property_type: payload.property && payload.property.type || "",
    property_level: payload.property && payload.property.level || "",
    has_lift: payload.property && payload.property.hasLift || "",
    parking_access: payload.property && payload.property.parking || "",
    quote_mode: payload.job && payload.job.quoteMode || "",
    product_category: payload.job && payload.job.productCategory || "",
    product_name: payload.job && payload.job.productName || "",
    flooring_pattern: payload.job && payload.job.flooringPattern || "",
    measurement_method: payload.measurement && payload.measurement.method || "",
    real_area: parseNumber(payload.measurement && payload.measurement.realArea),
    chargeable_area: parseNumber(payload.measurement && payload.measurement.chargeableArea),
    room_count: Math.round(parseNumber(payload.measurement && payload.measurement.roomCount)),
    subtotal_ex_gst: parseNumber(payload.pricing && payload.pricing.subtotalExGst),
    gst: parseNumber(payload.pricing && payload.pricing.gst),
    total_inc_gst: parseNumber(payload.pricing && payload.pricing.totalIncGst),
    manual_review_required: !!payload.manualReviewRequired,
    status: status,
    source_page: payload.sourcePage || "index.html",
    raw_payload: payload
  };
}

function getRoomRows(quoteId, rooms) {
  return (Array.isArray(rooms) ? rooms : []).map(function (room) {
    return {
      quote_id: quoteId,
      room_name: room.roomName || room.name || "Room",
      length_m: room.lengthM || room.length || null,
      width_m: room.widthM || room.width || null,
      area_m2: room.areaM2 || room.area || null,
      included: room.included !== false,
      source: room.source || "index_room_by_room",
      raw_payload: room
    };
  });
}

function getItemRows(quoteId, items) {
  return (Array.isArray(items) ? items : []).map(function (item) {
    return {
      quote_id: quoteId,
      item_type: item.type || item.itemType || "item",
      label: item.label || item.name || "Quote item",
      quantity: item.quantity || null,
      unit: item.unit || null,
      unit_basis: item.unitBasis || null,
      amount_ex_gst: item.amountExGst || item.amount || null,
      raw_payload: item.rawPayload || item
    };
  });
}

async function replaceChildRows(quoteId, rooms, items) {
  await supabaseRequest("quote_rooms", {
    method: "DELETE",
    query: {
      quote_id: "eq." + quoteId
    }
  });

  await supabaseRequest("quote_items", {
    method: "DELETE",
    query: {
      quote_id: "eq." + quoteId
    }
  });

  const roomRows = getRoomRows(quoteId, rooms);
  if (roomRows.length) {
    await supabaseRequest("quote_rooms", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: roomRows
    });
  }

  const itemRows = getItemRows(quoteId, items);
  if (itemRows.length) {
    await supabaseRequest("quote_items", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: itemRows
    });
  }
}

async function updateQuoteRow(quoteId, row) {
  return supabaseRequest("quote_requests", {
    method: "PATCH",
    query: {
      id: "eq." + quoteId
    },
    headers: {
      Prefer: "return=representation"
    },
    body: row
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatArea(value) {
  return Number(Number(value || 0).toFixed(1)).toFixed(1) + " m²";
}

function buildEmailLines(payload) {
  const pricing = payload.pricing || {};
  const lines = Array.isArray(pricing.lineItems) ? pricing.lineItems : [];
  return lines.map(function (item) {
    return "<tr><td style=\"padding:8px 0;color:#111827;\">" + escapeHtml(item.label || "Item") + "</td><td style=\"padding:8px 0;color:#6b7280;\">" + escapeHtml(item.quantity ? String(item.quantity) + " " + (item.unit || "") : (item.note || "")) + "</td><td style=\"padding:8px 0;text-align:right;color:#111827;\">" + escapeHtml(formatCurrency(item.amountExGst || item.amount || 0)) + "</td></tr>";
  }).join("");
}

function buildQuoteEmail(payload, quoteId) {
  const pricing = payload.pricing || {};
  const customerName = payload.customer && payload.customer.name ? payload.customer.name : "Customer";
  const productName = payload.job && payload.job.productName ? payload.job.productName : "Flooring estimate";
  const lineRows = buildEmailLines(payload);
  const html = [
    "<div style=\"font-family:Arial,sans-serif;background:#f5f7fb;padding:32px;color:#111827;\">",
    "<div style=\"max-width:720px;margin:0 auto;background:#ffffff;border-radius:18px;padding:32px;border:1px solid #e5e7eb;\">",
    "<p style=\"margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#2563eb;\">Operon Flooring</p>",
    "<h1 style=\"margin:0 0 12px;font-size:28px;line-height:1.2;\">Your flooring estimate</h1>",
    "<p style=\"margin:0 0 24px;color:#4b5563;\">Hi " + escapeHtml(customerName) + ", here is your Operon Flooring estimate for " + escapeHtml(productName) + ".</p>",
    "<div style=\"border:1px solid #e5e7eb;border-radius:16px;padding:20px;margin-bottom:24px;background:#f8fafc;\">",
    "<div style=\"display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;\">",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Selected product</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(pricing.productLabel || productName) + "</span></div>",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Real area</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(formatArea(pricing.realArea || 0)) + "</span></div>",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Total inc GST</strong><span style=\"font-size:24px;color:#111827;\">" + escapeHtml(formatCurrency(pricing.totalIncGst || 0)) + "</span></div>",
    "</div></div>",
    "<table style=\"width:100%;border-collapse:collapse;margin-bottom:20px;\">",
    "<thead><tr><th style=\"text-align:left;padding-bottom:10px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;\">Item</th><th style=\"text-align:left;padding-bottom:10px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;\">Details</th><th style=\"text-align:right;padding-bottom:10px;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb;\">Ex GST</th></tr></thead>",
    "<tbody>" + lineRows + "</tbody>",
    "</table>",
    "<div style=\"border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px;\">",
    "<p style=\"margin:0 0 8px;color:#111827;\">Subtotal ex GST: <strong>" + escapeHtml(formatCurrency(pricing.subtotalExGst || 0)) + "</strong></p>",
    "<p style=\"margin:0 0 8px;color:#111827;\">GST: <strong>" + escapeHtml(formatCurrency(pricing.gst || 0)) + "</strong></p>",
    "<p style=\"margin:0 0 16px;color:#111827;font-size:18px;\">Total inc GST: <strong>" + escapeHtml(formatCurrency(pricing.totalIncGst || 0)) + "</strong></p>",
    "<p style=\"margin:0;color:#4b5563;\">" + escapeHtml(pricing.disclaimer || "Estimate only — final quote confirmed after review and site check.") + "</p>",
    "</div>",
    "<p style=\"margin:24px 0 0;color:#6b7280;font-size:13px;\">Reference: " + escapeHtml(String(quoteId).slice(0, 8)) + "</p>",
    "</div></div>"
  ].join("");

  const text = [
    "Operon Flooring estimate",
    "",
    "Reference: " + String(quoteId).slice(0, 8),
    "Selected product: " + (pricing.productLabel || productName),
    "Real area: " + formatArea(pricing.realArea || 0),
    "Subtotal ex GST: " + formatCurrency(pricing.subtotalExGst || 0),
    "GST: " + formatCurrency(pricing.gst || 0),
    "Total inc GST: " + formatCurrency(pricing.totalIncGst || 0),
    "",
    pricing.disclaimer || "Estimate only — final quote confirmed after review and site check."
  ].join("\n");

  return { html: html, text: text };
}

async function sendQuoteEmail(emailTo, payload, quoteId) {
  const apiKey = process.env.RESEND_API_KEY || "";
  const fromEmail = process.env.OPERON_QUOTE_FROM_EMAIL || process.env.QUOTE_FROM_EMAIL || "";
  const replyTo = process.env.OPERON_QUOTE_REPLY_TO || "";

  if (!apiKey || !fromEmail) {
    throw new Error("Quote email is not configured. Add RESEND_API_KEY and OPERON_QUOTE_FROM_EMAIL in Netlify.");
  }

  const emailContent = buildQuoteEmail(payload, quoteId);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [emailTo],
      reply_to: replyTo ? [replyTo] : undefined,
      subject: "Your Operon Flooring Quote Estimate",
      html: emailContent.html,
      text: emailContent.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Quote email failed: " + text);
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

  const mode = body.mode === "email_quote" ? "email_quote" : "draft";
  const payload = body.payload || null;
  const emailTo = String(body.emailTo || (payload && payload.customer && payload.customer.email) || "").trim();

  if (!payload || typeof payload !== "object") {
    return jsonResponse(400, { ok: false, error: "Quote payload is required." });
  }

  if (mode === "email_quote" && (!emailTo || !/.+@.+\..+/.test(emailTo))) {
    return jsonResponse(400, { ok: false, error: "A valid email address is required to send the quote." });
  }

  const quoteId = String(body.quoteId || payload.id || "").trim() || createQuoteUuid();
  const status = mode === "email_quote" ? "emailed" : "draft_saved";

  try {
    const row = getQuoteRow(quoteId, payload, status);
    if (mode === "draft") {
      await supabaseRequest("quote_requests", {
        method: "POST",
        query: {
          on_conflict: "id"
        },
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: row
      });

      await replaceChildRows(
        quoteId,
        payload.measurement && payload.measurement.rooms || [],
        payload.pricing && payload.pricing.lineItems || []
      );
    } else {
      if (!String(body.quoteId || "").trim()) {
        throw new Error("Draft quote reference is missing. Save the estimate first.");
      }
      await updateQuoteRow(quoteId, row);
      await sendQuoteEmail(emailTo, payload, quoteId);
    }

    return jsonResponse(200, {
      ok: true,
      mode: mode,
      quoteId: quoteId
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Quote save failed."
    });
  }
};
