// Operon Flooring queued follow-up processor.
// Default behaviour is dry-run only. Real SMS/email sending is blocked unless
// ENABLE_FOLLOWUP_SEND=true is configured in Supabase function secrets.
//
// Required Supabase function secrets:
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - ENABLE_FOLLOWUP_SEND=false
//
// Provider placeholders for future real sending:
// - SMS_PROVIDER_API_KEY
// - EMAIL_PROVIDER_API_KEY
// - FROM_EMAIL
// - FROM_PHONE

export {};

declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (request: Request) => Response | Promise<Response>): void;
};

type FollowupMessage = {
  id: string;
  lead_id: string | null;
  quote_request_id: string | null;
  channel: "sms" | "email" | "manual_call";
  template_key: string;
  scheduled_for: string;
  status: string;
  payload: Record<string, unknown>;
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

async function markMessage(messageId: string, status: "sent" | "failed" | "skipped", details: Record<string, unknown>) {
  await supabaseFetch(`followup_messages?id=eq.${messageId}`, {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status,
      sent_at: status === "sent" ? new Date().toISOString() : null,
      provider_response: details.provider_response || details,
      error_message: typeof details.error_message === "string" ? details.error_message : null
    })
  });
}

async function touchLead(message: FollowupMessage, status: "pending" | "sent" | "failed") {
  const patch = {
    followup_status: status,
    last_followup_at: status === "sent" ? new Date().toISOString() : null
  };

  if (message.lead_id) {
    await supabaseFetch(`quote_leads?id=eq.${message.lead_id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patch)
    });
  }

  if (message.quote_request_id) {
    await supabaseFetch(`quote_requests?id=eq.${message.quote_request_id}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(patch)
    });
  }
}

async function sendSmsDryRun(message: FollowupMessage) {
  const apiKey = getEnv("SMS_PROVIDER_API_KEY");
  const fromPhone = getEnv("FROM_PHONE");
  if (!apiKey || !fromPhone) {
    throw new Error("SMS provider is not configured.");
  }

  // Future provider call goes here. Keep body in provider payload only.
  return {
    provider: "sms_placeholder",
    to: message.payload.to_phone || "",
    template_key: message.template_key
  };
}

async function sendEmailDryRun(message: FollowupMessage) {
  const apiKey = getEnv("EMAIL_PROVIDER_API_KEY");
  const fromEmail = getEnv("FROM_EMAIL");
  if (!apiKey || !fromEmail) {
    throw new Error("Email provider is not configured.");
  }

  // Future provider call goes here. Keep body in provider payload only.
  return {
    provider: "email_placeholder",
    to: message.payload.to_email || "",
    template_key: message.template_key
  };
}

async function processMessage(message: FollowupMessage, sendEnabled: boolean, dryRunStatus: string) {
  if (!sendEnabled) {
    if (dryRunStatus !== "skipped") {
      return {
        id: message.id,
        status: "queued",
        dry_run: true,
        reason: "ENABLE_FOLLOWUP_SEND is not true"
      };
    }

    await markMessage(message.id, "skipped", {
      provider_response: {
        dry_run: true,
        reason: "ENABLE_FOLLOWUP_SEND is not true",
        channel: message.channel,
        template_key: message.template_key
      }
    });
    return { id: message.id, status: "skipped", dry_run: true };
  }

  try {
    let providerResponse: Record<string, unknown>;
    if (message.channel === "sms") {
      providerResponse = await sendSmsDryRun(message);
    } else if (message.channel === "email") {
      providerResponse = await sendEmailDryRun(message);
    } else {
      providerResponse = {
        provider: "manual_call_placeholder",
        template_key: message.template_key
      };
    }

    await markMessage(message.id, "sent", { provider_response: providerResponse });
    await touchLead(message, "sent");
    return { id: message.id, status: "sent", dry_run: false };
  } catch (error) {
    await markMessage(message.id, "failed", {
      error_message: error instanceof Error ? error.message : "Follow-up send failed."
    });
    await touchLead(message, "failed");
    return {
      id: message.id,
      status: "failed",
      error: error instanceof Error ? error.message : "Follow-up send failed."
    };
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const sendEnabled = getEnv("ENABLE_FOLLOWUP_SEND") === "true";
    const dryRunStatus = getEnv("DRY_RUN_FOLLOWUP_STATUS") || "queued";
    const dueMessages = await supabaseFetch(
      "followup_messages?status=eq.queued&scheduled_for=lte.now()&select=id,lead_id,quote_request_id,channel,template_key,scheduled_for,status,payload&order=scheduled_for.asc&limit=25"
    ) as FollowupMessage[];

    const results = [];
    for (const message of dueMessages || []) {
      results.push(await processMessage(message, sendEnabled, dryRunStatus));
    }

    return jsonResponse(200, {
      ok: true,
      send_enabled: sendEnabled,
      dry_run_status: dryRunStatus,
      processed: results.length,
      results
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error instanceof Error ? error.message : "Follow-up processing failed."
    });
  }
});
