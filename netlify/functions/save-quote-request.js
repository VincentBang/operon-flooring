"use strict";

const { getSupabaseTables } = require("./_supabaseTables");

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

function getEmailConfig() {
  const fromEmail = process.env.OPERON_FROM_EMAIL
    || process.env.OPERON_QUOTE_FROM_EMAIL
    || process.env.QUOTE_FROM_EMAIL
    || "quotes@operonflooring.com.au";
  return {
    resendApiKey: process.env.RESEND_API_KEY || "",
    fromEmail: fromEmail,
    fromName: process.env.OPERON_FROM_NAME || "Operon Flooring Quotes",
    replyTo: process.env.OPERON_REPLY_TO || process.env.OPERON_QUOTE_REPLY_TO || fromEmail,
    internalEmail: process.env.OPERON_INTERNAL_EMAIL || fromEmail
  };
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

function getCloseBand(score) {
  if (score >= 75) return "high";
  if (score >= 45) return "medium";
  if (score >= 20) return "low";
  return "very_low";
}

function getCloseProbability(score) {
  return Number((0.03 + (Math.max(0, Math.min(100, score)) / 100) * 0.82).toFixed(4));
}

function getInitialCloseScore(payload, status, leadStage) {
  const measurement = payload.measurement || {};
  const customer = payload.customer || {};
  const job = payload.job || {};
  const extras = payload.extras || {};
  const area = parseNumber(measurement.realArea);
  const reasons = {
    formula: "intent + engagement + completeness - friction",
    intent: {},
    engagement: {},
    completeness: {},
    friction: {}
  };
  let intent = 0;
  let engagement = status === "emailed" ? 18 : 10;
  let completeness = 0;
  let friction = 0;

  if (leadStage === "hot") { intent += 25; reasons.intent.lead_stage = "hot"; }
  else if (leadStage === "warm") { intent += 16; reasons.intent.lead_stage = "warm"; }
  else if (leadStage === "cold") { intent += 6; reasons.intent.lead_stage = "cold"; }

  reasons.engagement.quote_status = status;

  if (customer.name) { completeness += 3; reasons.completeness.name = true; }
  if (customer.phone || customer.email) { completeness += 4; reasons.completeness.contact = true; }
  if (customer.siteAddress) { completeness += 3; reasons.completeness.address = true; }
  if (area > 0) { completeness += area >= 30 ? 5 : 3; reasons.completeness.area_m2 = area; }
  if (measurement.status && measurement.status !== "unknown") { completeness += 4; reasons.completeness.measurement_status = measurement.status; }
  if (job.productName || job.productCategory) { completeness += 3; reasons.completeness.product = job.productName || job.productCategory; }
  if (extras && typeof extras === "object") { completeness += 4; reasons.completeness.extras_completion = "captured"; }
  if (parseNumber(payload.pricing && payload.pricing.totalIncGst) > 0) { completeness += 2; reasons.completeness.estimate_total = true; }

  if (measurement.status === "unknown" || area <= 0) { friction += 8; reasons.friction.measurement_unknown = true; }
  if (payload.manualReviewRequired) { friction += 5; reasons.friction.manual_review_required = true; }
  if (Array.isArray(payload.warnings) && payload.warnings.length) { friction += Math.min(6, payload.warnings.length * 2); reasons.friction.warning_count = payload.warnings.length; }
  if (!customer.phone && !customer.email) { friction += 8; reasons.friction.no_contact = true; }

  const closeScore = Math.max(0, Math.min(100, Math.round(intent + engagement + completeness - friction)));
  const closeBand = getCloseBand(closeScore);
  const nextAction = closeBand === "high"
    ? "immediate_human_contact"
    : closeBand === "medium"
      ? "guided_followup"
      : closeBand === "low"
        ? "nurture"
        : "minimal";

  reasons.intent.score = intent;
  reasons.engagement.score = engagement;
  reasons.completeness.score = completeness;
  reasons.friction.score = friction;

  return {
    closeScore: closeScore,
    closeBand: closeBand,
    closeProbability: getCloseProbability(closeScore),
    closeReasons: reasons,
    nextAction: measurement.status === "unknown" ? "request_site_assessment_or_floorplan" : nextAction,
    priorityRank: (closeBand === "high" ? 0 : closeBand === "medium" ? 100 : closeBand === "low" ? 200 : 300) + (100 - closeScore)
  };
}

function getQuoteRow(quoteId, payload, status) {
  const now = new Date().toISOString();
  const leadAutomation = payload.leadAutomation || payload.lead_automation || {};
  const requestedLeadStage = payload.leadStage || payload.lead_stage || leadAutomation.leadStage || leadAutomation.lead_stage || "";
  const inferredLeadStage = payload.leadPriority === "high" ? "hot" : status === "draft_saved" ? "cold" : "warm";
  const leadStage = requestedLeadStage && requestedLeadStage !== "unknown" ? requestedLeadStage : inferredLeadStage;
  const engagementScore = Number(payload.engagementScore || payload.engagement_score || (status === "emailed" ? 55 : 30)) || 0;
  const close = getInitialCloseScore(payload, status, leadStage);
  const consentSms = Boolean(payload.consentSms || payload.consent_sms || leadAutomation.consentSms || leadAutomation.consent_sms);
  const consentEmail = payload.consentEmail === false || payload.consent_email === false || leadAutomation.consentEmail === false || leadAutomation.consent_email === false
    ? false
    : true;
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
    lead_stage: ["cold", "warm", "hot", "closing", "unknown"].indexOf(leadStage) >= 0 ? leadStage : "cold",
    consent_sms: consentSms,
    consent_email: consentEmail,
    followup_status: "pending",
    source: "website",
    engagement_score: Math.max(0, Math.min(100, Math.round(engagementScore))),
    close_score: close.closeScore,
    close_probability: close.closeProbability,
    close_band: close.closeBand,
    close_reasons: close.closeReasons,
    next_action: close.nextAction,
    priority_rank: close.priorityRank,
    last_activity: now,
    last_action: status === "emailed" ? "quote_submit" : "summary_view",
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
  const tables = getSupabaseTables();
  await supabaseRequest(tables.quoteRooms, {
    method: "DELETE",
    query: {
      quote_id: "eq." + quoteId
    }
  });

  await supabaseRequest(tables.quoteItems, {
    method: "DELETE",
    query: {
      quote_id: "eq." + quoteId
    }
  });

  const roomRows = getRoomRows(quoteId, rooms);
  if (roomRows.length) {
    await supabaseRequest(tables.quoteRooms, {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: roomRows
    });
  }

  const itemRows = getItemRows(quoteId, items);
  if (itemRows.length) {
    await supabaseRequest(tables.quoteItems, {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: itemRows
    });
  }
}

async function updateQuoteRow(quoteId, row) {
  return supabaseRequest(getSupabaseTables().quoteRequests, {
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

function normaliseFollowupStage(value) {
  return value === "closing" || value === "hot" || value === "warm" || value === "cold" ? value : "unknown";
}

function getFollowupTemplateKeys(stage, consentSms, consentEmail) {
  const keys = new Set();
  keys.add("manual_quote_review");

  if (stage === "closing") {
    keys.add("manual_close_call");
    if (consentSms) keys.add("immediate_sms_received");
    if (consentEmail) keys.add("immediate_email_received");
  } else if (stage === "hot") {
    if (consentSms) {
      keys.add("immediate_sms_received");
      keys.add("day1_sms_checkin");
    }
    if (consentEmail) keys.add("immediate_email_received");
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
    if (consentSms) keys.add("day7_sms_soft_reminder");
  } else {
    if (consentEmail) keys.add("immediate_email_received");
    if (consentSms) keys.add("immediate_sms_received");
  }

  return keys;
}

function renderFollowupTemplate(value, quoteRow) {
  const name = String(quoteRow.customer_name || "there").trim() || "there";
  return String(value || "").replace(/\{\{name\}\}/g, name);
}

function postgrestIn(values) {
  return "(" + values.map(function (value) {
    return "\"" + String(value).replace(/"/g, "\\\"") + "\"";
  }).join(",") + ")";
}

async function queueFollowupsForQuote(quoteId, quoteRow) {
  const tables = getSupabaseTables();

  if (!quoteId) {
    return { queued: 0, skipped: "missing_quote_id", dryRunOnly: true };
  }

  if (quoteRow.followup_paused === true) {
    return { queued: 0, skipped: "followup_paused", dryRunOnly: true };
  }

  const leadStage = normaliseFollowupStage(quoteRow.lead_stage);
  const consentSms = Boolean(quoteRow.consent_sms);
  const consentEmail = quoteRow.consent_email !== false;
  const allowedKeys = getFollowupTemplateKeys(leadStage, consentSms, consentEmail);

  if (!allowedKeys.size) {
    return { queued: 0, skipped: "no_consented_channels", dryRunOnly: true };
  }

  const templates = await supabaseRequest(tables.followupTemplates, {
    query: {
      active: "eq.true",
      select: "template_key,channel,lead_stage,timing_offset_hours,subject,body,active"
    }
  });
  const now = Date.now();
  const candidateRows = (Array.isArray(templates) ? templates : [])
    .filter(function (template) {
      return allowedKeys.has(template.template_key);
    })
    .filter(function (template) {
      return template.channel !== "sms" || consentSms;
    })
    .filter(function (template) {
      return template.channel !== "email" || consentEmail;
    })
    .map(function (template) {
      return {
        lead_id: null,
        quote_request_id: quoteId,
        channel: template.channel,
        template_key: template.template_key,
        scheduled_for: new Date(now + Number(template.timing_offset_hours || 0) * 60 * 60 * 1000).toISOString(),
        status: "queued",
        payload: {
          dry_run_required: true,
          source: "quote_submission",
          lead_stage: leadStage,
          consent_sms: consentSms,
          consent_email: consentEmail,
          to_phone: quoteRow.phone || "",
          to_email: quoteRow.email || "",
          subject: template.subject ? renderFollowupTemplate(template.subject, quoteRow) : null,
          body: renderFollowupTemplate(template.body, quoteRow)
        }
      };
    });

  if (!candidateRows.length) {
    return { queued: 0, skipped: "no_matching_templates", dryRunOnly: true };
  }

  const existingRows = await supabaseRequest(tables.followupMessages, {
    query: {
      quote_request_id: "eq." + quoteId,
      template_key: "in." + postgrestIn(candidateRows.map(function (row) { return row.template_key; })),
      select: "template_key"
    }
  });
  const existingKeys = new Set((Array.isArray(existingRows) ? existingRows : []).map(function (row) {
    return row.template_key;
  }));
  const rows = candidateRows.filter(function (row) {
    return !existingKeys.has(row.template_key);
  });

  if (!rows.length) {
    return { queued: 0, skipped: "already_queued", dryRunOnly: true };
  }

  await supabaseRequest(tables.followupMessages, {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: rows
  });

  await updateQuoteRow(quoteId, {
    lead_stage: leadStage,
    consent_sms: consentSms,
    consent_email: consentEmail,
    followup_status: "queued",
    next_followup_at: rows.map(function (row) { return row.scheduled_for; }).sort()[0]
  });

  return {
    queued: rows.length,
    leadStage: leadStage,
    dryRunOnly: true
  };
}

async function safelyQueueFollowupsForQuote(quoteId, quoteRow) {
  try {
    const result = await queueFollowupsForQuote(quoteId, quoteRow);
    return Object.assign({ ok: true }, result);
  } catch (error) {
    console.error("Follow-up queue creation failed", error);
    return {
      ok: false,
      queued: 0,
      dryRunOnly: true,
      error: error && error.message ? error.message : "Follow-up queue creation failed."
    };
  }
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

function formatFromAddress(config) {
  return config.fromName + " <" + config.fromEmail + ">";
}

function getCustomerName(payload) {
  return payload.customer && payload.customer.name ? payload.customer.name : "there";
}

function getProductLabel(payload) {
  const pricing = payload.pricing || {};
  const job = payload.job || {};
  return pricing.productLabel || job.productName || job.productRange || job.productCategory || "Flooring estimate";
}

function buildCustomerEmailLines(payload) {
  const pricing = payload.pricing || {};
  const lines = Array.isArray(pricing.lineItems) ? pricing.lineItems : [];
  return lines.map(function (item) {
    return "<tr><td style=\"padding:10px 0;color:#111827;border-bottom:1px solid #eef0f3;\">" + escapeHtml(item.label || "Item") + "</td><td style=\"padding:10px 0;text-align:right;color:#111827;border-bottom:1px solid #eef0f3;\"><strong>" + escapeHtml(formatCurrency(item.amountExGst || item.amount || 0)) + "</strong></td></tr>";
  }).join("");
}

function buildInternalEmailLines(payload) {
  const pricing = payload.pricing || {};
  const lines = Array.isArray(pricing.lineItems) ? pricing.lineItems : [];
  return lines.map(function (item) {
    return [
      "- ",
      item.label || "Item",
      ": ",
      item.quantity ? String(item.quantity) + " " + (item.unit || "") + " - " : "",
      formatCurrency(item.amountExGst || item.amount || 0),
      " ex GST"
    ].join("");
  }).join("\n");
}

function buildScopeList(payload) {
  const extras = payload.extras || {};
  const job = payload.job || {};
  const scope = [];
  scope.push(job.quoteMode === "install_only" ? "Installation only" : "Supply and installation");
  if (job.productCategory) scope.push("Flooring category: " + job.productCategory);
  if (job.installationMethod) scope.push("Installation method: " + job.installationMethod);
  if (extras.removal && extras.removal.type && extras.removal.type !== "none") scope.push("Existing floor removal");
  if (extras.disposal && extras.disposal.included) scope.push("Take away removed flooring");
  if (extras.floorPrep && extras.floorPrep.type && extras.floorPrep.type !== "none") scope.push("Floor preparation");
  if (extras.moistureBarrier && extras.moistureBarrier.selected === "yes") scope.push("Moisture protection");
  if (extras.skirting && extras.skirting.type && extras.skirting.type !== "no") scope.push("Skirting");
  if (extras.scotia && extras.scotia.type && extras.scotia.type !== "no") scope.push("Edge trim");
  if (extras.furniture && extras.furniture.type && extras.furniture.type !== "no") scope.push("Furniture handling");
  if (extras.doorTrimming && extras.doorTrimming.selected === "yes") scope.push("Door trimming");
  if (extras.stairs && Number(extras.stairs.count || 0) > 0) scope.push("Stairs require confirmation");
  return scope;
}

function buildScopeHtml(payload) {
  return buildScopeList(payload).map(function (item) {
    return "<li style=\"margin:0 0 8px;color:#374151;\">" + escapeHtml(item) + "</li>";
  }).join("");
}

function buildScopeText(payload) {
  return buildScopeList(payload).map(function (item) {
    return "- " + item;
  }).join("\n");
}

function getQuoteReviewSummary(payload) {
  const review = payload.quoteReview || payload.quote_review || null;
  if (!review) {
    return "";
  }
  try {
    return JSON.stringify(review, null, 2);
  } catch (error) {
    return String(review);
  }
}

function getWarningsText(payload) {
  const warnings = Array.isArray(payload.warnings) ? payload.warnings : [];
  if (!warnings.length && !payload.manualReviewRequired) {
    return "No major warning flags.";
  }
  const lines = warnings.map(function (warning) {
    return "- " + String(warning);
  });
  if (payload.manualReviewRequired) {
    lines.unshift("- Manual review required.");
  }
  return lines.join("\n");
}

function buildCustomerQuoteEmail(payload, quoteId) {
  const pricing = payload.pricing || {};
  const measurement = payload.measurement || {};
  const customerName = getCustomerName(payload);
  const productName = getProductLabel(payload);
  const lineRows = buildCustomerEmailLines(payload);
  const chargeableAreaLine = measurement.chargeableArea
    ? "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Estimated area including off-cuts</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(formatArea(measurement.chargeableArea)) + "</span></div>"
    : "";
  const html = [
    "<div style=\"font-family:Inter,Arial,sans-serif;background:#faf8f4;padding:32px;color:#111820;\">",
    "<div style=\"max-width:720px;margin:0 auto;background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e8e2d8;\">",
    "<p style=\"margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#a67c52;\">Operon Flooring</p>",
    "<h1 style=\"margin:0 0 12px;font-size:28px;line-height:1.2;color:#111820;\">Your flooring estimate</h1>",
    "<p style=\"margin:0 0 24px;color:#4b5563;line-height:1.6;\">Hi " + escapeHtml(customerName) + ", here is your starting flooring estimate. We will confirm product, area and site details before anything is booked.</p>",
    "<div style=\"border:1px solid #e8e2d8;border-radius:16px;padding:20px;margin-bottom:24px;background:#f6f2ec;\">",
    "<div style=\"display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;\">",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Selected product</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(pricing.productLabel || productName) + "</span></div>",
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Measured area</strong><span style=\"font-size:18px;color:#111827;\">" + escapeHtml(formatArea(measurement.realArea || pricing.realArea || 0)) + "</span></div>",
    chargeableAreaLine,
    "<div><strong style=\"display:block;font-size:13px;color:#6b7280;\">Estimate total inc GST</strong><span style=\"font-size:24px;color:#111827;\">" + escapeHtml(formatCurrency(pricing.totalIncGst || 0)) + "</span></div>",
    "</div></div>",
    "<table style=\"width:100%;border-collapse:collapse;margin-bottom:20px;\">",
    "<thead><tr><th style=\"text-align:left;padding-bottom:10px;color:#6b7280;font-size:13px;border-bottom:1px solid #e8e2d8;\">Estimate breakdown</th><th style=\"text-align:right;padding-bottom:10px;color:#6b7280;font-size:13px;border-bottom:1px solid #e8e2d8;\">Total only</th></tr></thead>",
    "<tbody>" + lineRows + "</tbody>",
    "</table>",
    "<div style=\"border:1px solid #e8e2d8;border-radius:16px;padding:18px;margin:20px 0;\">",
    "<strong style=\"display:block;margin-bottom:12px;color:#111820;\">Included scope</strong>",
    "<ul style=\"padding-left:18px;margin:0;\">" + buildScopeHtml(payload) + "</ul>",
    "</div>",
    "<div style=\"border-top:1px solid #e8e2d8;padding-top:16px;margin-top:8px;\">",
    "<p style=\"margin:0 0 8px;color:#111827;\">Subtotal ex GST: <strong>" + escapeHtml(formatCurrency(pricing.subtotalExGst || 0)) + "</strong></p>",
    "<p style=\"margin:0 0 8px;color:#111827;\">GST: <strong>" + escapeHtml(formatCurrency(pricing.gst || 0)) + "</strong></p>",
    "<p style=\"margin:0 0 16px;color:#111827;font-size:18px;\">Total inc GST: <strong>" + escapeHtml(formatCurrency(pricing.totalIncGst || 0)) + "</strong></p>",
    "<p style=\"margin:0 0 14px;color:#4b5563;line-height:1.6;\">" + escapeHtml(pricing.disclaimer || "Starting estimate only. Final site scope is confirmed before booking.") + "</p>",
    "<p style=\"margin:0 0 14px;color:#4b5563;line-height:1.6;\">Reply to this email if you want us to confirm the next step. Already have another quote? Send it through and we can review scope and missing items.</p>",
    "</div>",
    "<p style=\"margin:24px 0 0;color:#6b7280;font-size:13px;\">Reference: " + escapeHtml(String(quoteId).slice(0, 8)) + "</p>",
    "</div></div>"
  ].join("");

  const text = [
    "Operon Flooring estimate",
    "",
    "Reference: " + String(quoteId).slice(0, 8),
    "Selected product: " + (pricing.productLabel || productName),
    "Measured area: " + formatArea(measurement.realArea || pricing.realArea || 0),
    measurement.chargeableArea ? "Estimated area including off-cuts: " + formatArea(measurement.chargeableArea) : "",
    "",
    "Estimate breakdown:",
    (payload.pricing && Array.isArray(payload.pricing.lineItems) ? payload.pricing.lineItems : []).map(function (item) {
      return "- " + (item.label || "Item") + ": " + formatCurrency(item.amountExGst || item.amount || 0);
    }).join("\n"),
    "",
    "Included scope:",
    buildScopeText(payload),
    "",
    "Subtotal ex GST: " + formatCurrency(pricing.subtotalExGst || 0),
    "GST: " + formatCurrency(pricing.gst || 0),
    "Total inc GST: " + formatCurrency(pricing.totalIncGst || 0),
    "",
    pricing.disclaimer || "Starting estimate only. Final site scope is confirmed before booking.",
    "",
    "Reply to this email if you want us to confirm the next step. Already have another quote? Send it through and we can review scope and missing items."
  ].filter(Boolean).join("\n");

  return { html: html, text: text };
}

function buildInternalQuoteEmail(payload, quoteId) {
  const pricing = payload.pricing || {};
  const customer = payload.customer || {};
  const property = payload.property || {};
  const job = payload.job || {};
  const measurement = payload.measurement || {};
  const reviewSummary = getQuoteReviewSummary(payload);
  const subjectParts = [
    "New Operon quote request",
    customer.suburb || "Unknown suburb",
    formatCurrency(pricing.totalIncGst || 0)
  ];
  const text = [
    "New Operon quote request",
    "",
    "Reference: " + quoteId,
    "Submitted: " + (payload.submittedAt || new Date().toISOString()),
    "Source page: " + (payload.sourcePage || ""),
    "",
    "Customer",
    "Name: " + (customer.name || ""),
    "Phone: " + (customer.phone || ""),
    "Email: " + (customer.email || ""),
    "Address: " + (customer.siteAddress || ""),
    "Suburb: " + (customer.suburb || ""),
    "Postcode: " + (customer.postcode || ""),
    "",
    "Quote",
    "Mode: " + (job.quoteMode || ""),
    "Product/category: " + getProductLabel(payload),
    "Category: " + (job.productCategory || ""),
    "Install method: " + (job.installationMethod || ""),
    "Property type: " + (property.type || ""),
    "Level/lift/parking: " + [property.level, property.hasLift, property.parking].filter(Boolean).join(" / "),
    "Quote confidence: " + (measurement.quoteConfidence || ""),
    "Next step required: " + (measurement.nextStepRequired || ""),
    "Manual review: " + (payload.manualReviewRequired ? "Yes" : "No"),
    "",
    "Areas",
    "Real area: " + formatArea(measurement.realArea || pricing.realArea || 0),
    "Chargeable area: " + (measurement.chargeableArea ? formatArea(measurement.chargeableArea) : "Not shown / not applicable"),
    "",
    "Totals",
    "Subtotal ex GST: " + formatCurrency(pricing.subtotalExGst || 0),
    "GST: " + formatCurrency(pricing.gst || 0),
    "Total inc GST: " + formatCurrency(pricing.totalIncGst || 0),
    "",
    "Line items",
    buildInternalEmailLines(payload) || "No line items.",
    "",
    "Scope",
    buildScopeText(payload) || "No scope items captured.",
    "",
    "Risk flags / warnings",
    getWarningsText(payload),
    "",
    "Notes",
    "Site notes: " + (payload.notes && payload.notes.site || ""),
    "Customer notes: " + (payload.notes && payload.notes.customer || ""),
    "",
    "Quote review payload",
    reviewSummary || "No quote review payload."
  ].join("\n");

  const html = "<pre style=\"font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5;color:#111827;\">" + escapeHtml(text) + "</pre>";
  return {
    subject: subjectParts.join(" - "),
    html: html,
    text: text
  };
}

async function sendResendEmail(message) {
  const config = getEmailConfig();

  if (!config.resendApiKey || !config.fromEmail) {
    throw new Error("Quote email is not configured. Add RESEND_API_KEY and OPERON_FROM_EMAIL in Netlify.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + config.resendApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: formatFromAddress(config),
      to: Array.isArray(message.to) ? message.to : [message.to],
      reply_to: config.replyTo ? [config.replyTo] : undefined,
      subject: message.subject,
      html: message.html,
      text: message.text
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Quote email failed: " + text);
  }

  return response.json();
}

async function sendQuoteEmails(emailTo, payload, quoteId) {
  const config = getEmailConfig();
  const result = {
    customerEmailSent: false,
    internalNotificationSent: false,
    internalNotificationError: ""
  };

  let customerError = null;
  if (emailTo) {
    const customerContent = buildCustomerQuoteEmail(payload, quoteId);
    try {
      await sendResendEmail({
        to: emailTo,
        subject: "Your flooring estimate - Operon Flooring",
        html: customerContent.html,
        text: customerContent.text
      });
      result.customerEmailSent = true;
    } catch (error) {
      customerError = error;
    }
  }

  if (config.internalEmail) {
    const internalContent = buildInternalQuoteEmail(payload, quoteId);
    try {
      await sendResendEmail({
        to: config.internalEmail,
        subject: internalContent.subject,
        html: internalContent.html,
        text: internalContent.text
      });
      result.internalNotificationSent = true;
    } catch (error) {
      result.internalNotificationError = error && error.message ? error.message : "Internal notification failed.";
      console.error("Internal quote notification failed", error);
    }
  }

  if (customerError) {
    throw customerError;
  }

  return result;
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

  const allowedMode = String(body.mode || "").trim();
  const mode = allowedMode === "email_quote" || allowedMode === "submit_quote" ? allowedMode : "draft";
  const payload = body.payload || null;
  const emailTo = String(body.emailTo || (payload && payload.customer && payload.customer.email) || "").trim();

  if (!payload || typeof payload !== "object") {
    return jsonResponse(400, { ok: false, error: "Quote payload is required." });
  }

  if (mode === "email_quote" && (!emailTo || !/.+@.+\..+/.test(emailTo))) {
    return jsonResponse(400, { ok: false, error: "A valid email address is required to send the quote." });
  }

  const quoteId = String(body.quoteId || payload.id || "").trim() || createQuoteUuid();
  const status = mode === "email_quote" ? "emailed" : mode === "submit_quote" ? "submitted" : "draft_saved";

  try {
    const row = getQuoteRow(quoteId, payload, status);
    if (mode === "draft" || mode === "submit_quote") {
      await supabaseRequest(getSupabaseTables().quoteRequests, {
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

      const followupResult = mode === "submit_quote"
        ? await safelyQueueFollowupsForQuote(quoteId, row)
        : { ok: true, queued: 0, skipped: "draft_only", dryRunOnly: true };

      return jsonResponse(200, {
        ok: true,
        mode: mode,
        quoteId: quoteId,
        followup: followupResult
      });
    } else {
      if (!String(body.quoteId || "").trim()) {
        throw new Error("Draft quote reference is missing. Save the estimate first.");
      }
      await updateQuoteRow(quoteId, row);
      const emailResult = await sendQuoteEmails(emailTo, payload, quoteId);
      const followupResult = await safelyQueueFollowupsForQuote(quoteId, row);
      return jsonResponse(200, {
        ok: true,
        mode: mode,
        quoteId: quoteId,
        customerEmailSent: emailResult.customerEmailSent,
        internalNotificationSent: emailResult.internalNotificationSent,
        followup: followupResult
      });
    }
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Quote save failed."
    });
  }
};
