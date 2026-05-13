"use strict";

const crypto = require("crypto");
const { getSupabaseTables } = require("./_supabaseTables");
const Security = require("./_security");

const MAX_FILE_BYTES = 6 * 1024 * 1024;
const DEFAULT_BUCKET = "quote-files";
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const MIME_EXTENSIONS = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"]
};

function jsonResponse(event, statusCode, payload) {
  return Security.jsonResponse(event, statusCode, payload, {
    methods: "POST, OPTIONS",
    allowHeaders: "content-type"
  });
}

function getSupabaseConfig() {
  return {
    url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || "",
    bucket: process.env.OPERON_UPLOAD_BUCKET || DEFAULT_BUCKET
  };
}

function stripDataUrlPrefix(value) {
  return String(value || "").replace(/^data:[^;]+;base64,/i, "");
}

function toSafeDisplayName(value) {
  return String(value || "uploaded-file")
    .trim()
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 140) || "uploaded-file";
}

function normaliseMimeType(value, fileName) {
  const type = String(value || "").trim().toLowerCase();
  if (type) return type;
  const name = String(fileName || "").toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  return "";
}

function getExtension(fileName, mimeType) {
  const name = String(fileName || "").toLowerCase();
  const extensions = MIME_EXTENSIONS[mimeType] || [];
  return extensions.find(function (extension) {
    return name.endsWith(extension);
  }) || extensions[0] || "";
}

function extensionMatchesMimeType(fileName, mimeType) {
  const name = String(fileName || "").toLowerCase();
  const extensions = MIME_EXTENSIONS[mimeType] || [];
  return extensions.some(function (extension) {
    return name.endsWith(extension);
  });
}

function hasAllowedFileSignature(buffer, mimeType) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) return false;
  if (mimeType === "application/pdf") {
    return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
  }
  if (mimeType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8
      && buffer[0] === 0x89
      && buffer[1] === 0x50
      && buffer[2] === 0x4e
      && buffer[3] === 0x47
      && buffer[4] === 0x0d
      && buffer[5] === 0x0a
      && buffer[6] === 0x1a
      && buffer[7] === 0x0a;
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12
      && buffer.subarray(0, 4).toString("ascii") === "RIFF"
      && buffer.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
}

function encodeStoragePath(path) {
  return String(path || "").split("/").map(encodeURIComponent).join("/");
}

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i.test(value);
}

async function supabaseFetch(path, options) {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase server credentials.");
  }

  const response = await fetch(config.url + path, Object.assign({}, options || {}, {
    headers: Object.assign({
      apikey: config.serviceRoleKey,
      Authorization: "Bearer " + config.serviceRoleKey
    }, options && options.headers || {})
  }));

  if (!response.ok) {
    const text = await response.text();
    throw new Error("Supabase upload request failed: " + text);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function uploadObject(bucket, storagePath, mimeType, buffer) {
  return supabaseFetch("/storage/v1/object/" + encodeURIComponent(bucket) + "/" + encodeStoragePath(storagePath), {
    method: "POST",
    headers: {
      "Content-Type": mimeType,
      "x-upsert": "false"
    },
    body: buffer
  });
}

async function createSignedUrl(bucket, storagePath, expiresIn) {
  const result = await supabaseFetch("/storage/v1/object/sign/" + encodeURIComponent(bucket) + "/" + encodeStoragePath(storagePath), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ expiresIn: expiresIn })
  });
  const signedPath = result && (result.signedURL || result.signedUrl || result.url);
  if (!signedPath) return "";
  if (/^https?:\/\//i.test(signedPath)) return signedPath;
  return getSupabaseConfig().url + "/storage/v1" + signedPath;
}

async function insertMetadata(row) {
  return supabaseFetch("/rest/v1/" + getSupabaseTables().uploadedFiles, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(row)
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return Security.optionsResponse(event, {
      methods: "POST, OPTIONS",
      allowHeaders: "content-type"
    });
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(event, 405, { ok: false, error: "Method not allowed." });
  }

  const largeBodyResponse = Security.rejectLargeBody(event, 9 * 1024 * 1024);
  if (largeBodyResponse) return largeBodyResponse;

  const rateLimit = await Security.checkDurableRateLimit(event, {
    scope: "upload-customer-file",
    limit: 12,
    windowMs: 60 * 60 * 1000
  });
  if (!rateLimit.allowed) {
    return Security.rateLimitResponse(event, rateLimit);
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const turnstile = await Security.verifyTurnstile(event, body.turnstileToken || body.turnstile_token || "");
    if (!turnstile.ok) {
      return Security.botChallengeResponse(event, turnstile);
    }
    const file = body.file && typeof body.file === "object" ? body.file : {};
    const originalName = toSafeDisplayName(file.name || file.fileName);
    const mimeType = normaliseMimeType(file.type || file.mimeType, originalName);
    const base64 = stripDataUrlPrefix(file.dataBase64 || file.base64 || "");

    if (!base64) {
      return jsonResponse(event, 400, { ok: false, error: "File data is required." });
    }
    if (!ALLOWED_MIME_TYPES.has(mimeType) || !extensionMatchesMimeType(originalName, mimeType)) {
      return jsonResponse(event, 400, { ok: false, error: "Use a PDF, JPG, PNG or WEBP file." });
    }

    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length) {
      return jsonResponse(event, 400, { ok: false, error: "File could not be read." });
    }
    if (buffer.length > MAX_FILE_BYTES) {
      return jsonResponse(event, 413, { ok: false, error: "File is too large. Use a file under 6 MB." });
    }
    if (!hasAllowedFileSignature(buffer, mimeType)) {
      return jsonResponse(event, 400, { ok: false, error: "File signature could not be verified." });
    }

    const config = getSupabaseConfig();
    const source = String(body.source || "quote").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40) || "quote";
    const quoteId = String(body.quoteId || body.quote_id || "").trim();
    const extension = getExtension(originalName, mimeType);
    const storagePath = [
      source,
      isUuid(quoteId) ? quoteId : "unassigned",
      crypto.randomUUID() + extension
    ].join("/");

    await uploadObject(config.bucket, storagePath, mimeType, buffer);

    let metadata = null;
    try {
      const rows = await insertMetadata({
        quote_id: isUuid(quoteId) ? quoteId : null,
        file_name: originalName,
        file_path: storagePath,
        file_type: mimeType,
        file_size_bytes: buffer.length,
        storage_bucket: config.bucket,
        source: source,
        raw_payload: {
          path: storagePath,
          type: mimeType,
          size: buffer.length
        }
      });
      metadata = Array.isArray(rows) ? rows[0] || null : rows;
    } catch (error) {
      metadata = null;
    }

    const signedUrl = body.createSignedUrl === true
      ? await createSignedUrl(config.bucket, storagePath, Math.min(900, Math.max(60, Number(body.expiresIn || 600) || 600)))
      : "";

    return jsonResponse(event, 200, {
      ok: true,
      storage_bucket: config.bucket,
      file_path: storagePath,
      file_type: mimeType,
      file_size_bytes: buffer.length,
      metadata_saved: Boolean(metadata),
      uploaded_file_id: metadata && metadata.id || null,
      signed_url: signedUrl || undefined
    });
  } catch (error) {
    return jsonResponse(event, 500, {
      ok: false,
      error: error && error.message ? error.message : "File upload failed."
    });
  }
};
