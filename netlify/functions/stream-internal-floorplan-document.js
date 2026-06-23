"use strict";

const Security = require("./_security");
const AdminAuth = require("./shared/adminAuth");
const Geometry = require("./shared/floorplanGeometry");
const Store = require("./shared/floorplanMeasurementStore");

function binaryHeaders(event, contentType) {
  return Object.assign({}, Security.headers(event, {
    methods: "GET, OPTIONS",
    allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS,
    cacheControl: "no-store"
  }), {
    "Content-Type": contentType || "application/octet-stream",
    "Content-Disposition": "inline"
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") return Security.optionsResponse(event, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  if (event.httpMethod !== "GET") {
    return Security.jsonResponse(event, 405, { ok: false, error: "Method not allowed." }, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
  const admin = AdminAuth.requireAdmin(event);
  if (!admin.ok) {
    return Security.jsonResponse(event, admin.status, { ok: false, error: admin.error }, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
  const params = new URLSearchParams(event.rawQuery || "");
  const fileId = params.get("uploaded_file_id") || "";
  if (!Geometry.isUuid(fileId)) {
    return Security.jsonResponse(event, 400, { ok: false, error: "Valid uploaded_file_id is required." }, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
  try {
    const file = await Store.getUploadedFile(fileId);
    if (!file || !file.storage_bucket || !file.file_path) {
      return Security.jsonResponse(event, 404, { ok: false, error: "Uploaded file not found." }, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
    }
    const config = {
      url: (process.env.SUPABASE_URL || process.env.OPERON_SUPABASE_URL || "").replace(/\/$/, ""),
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.OPERON_SUPABASE_SERVICE_ROLE_KEY || ""
    };
    if (!config.url || !config.serviceRoleKey) throw new Error("Missing Supabase server credentials.");
    const encodedPath = String(file.file_path).split("/").map(encodeURIComponent).join("/");
    const response = await fetch(config.url + "/storage/v1/object/" + encodeURIComponent(file.storage_bucket) + "/" + encodedPath, {
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: "Bearer " + config.serviceRoleKey
      }
    });
    if (!response.ok) throw new Error("Private floorplan object could not be loaded.");
    const buffer = Buffer.from(await response.arrayBuffer());
    return {
      statusCode: 200,
      headers: binaryHeaders(event, file.file_type || "application/octet-stream"),
      body: buffer.toString("base64"),
      isBase64Encoded: true
    };
  } catch (error) {
    console.warn("Internal floorplan document stream failed", { reason: Security.safeLogReason(error) });
    return Security.jsonResponse(event, 500, { ok: false, error: "Floorplan document could not be loaded." }, { methods: "GET, OPTIONS", allowHeaders: AdminAuth.ADMIN_ALLOW_HEADERS });
  }
};
