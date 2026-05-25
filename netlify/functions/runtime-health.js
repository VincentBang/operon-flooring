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

function getEnvStatus() {
  const supabaseUrl = (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").trim();
  const supabaseServiceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const resendApiKey = (process.env.RESEND_API_KEY || "").trim();
  const fromEmail = (process.env.OPERON_FROM_EMAIL || process.env.OPERON_QUOTE_FROM_EMAIL || process.env.QUOTE_FROM_EMAIL || "").trim();
  const internalEmail = (process.env.OPERON_INTERNAL_EMAIL || fromEmail).trim();

  const quoteSaveReady = !!(supabaseUrl && supabaseServiceRoleKey);
  const emailReady = !!(resendApiKey && fromEmail && internalEmail);

  return quoteSaveReady && emailReady;
}

exports.handler = async function () {
  const available = getEnvStatus();
  return jsonResponse(200, {
    ok: available,
    status: available ? "available" : "unavailable"
  });
};
