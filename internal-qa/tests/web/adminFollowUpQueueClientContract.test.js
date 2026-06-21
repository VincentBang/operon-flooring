"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const queuePath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminFollowUpQueue.tsx");
const authPath = path.join(repoRoot, "apps", "web-tsx", "src", "app", "admin", "AdminAuthShell.tsx");
const queueSource = fs.readFileSync(queuePath, "utf8");
const authSource = fs.readFileSync(authPath, "utf8");

[
  "\"use client\"",
  "/.netlify/functions/lead-followup-admin?status=open&limit=50",
  "/.netlify/functions/lead-followup-admin",
  "Authorization: `Bearer ${adminToken}`",
  "cache: \"no-store\"",
  "Dry-run follow-ups",
  "Internal operator queue only. No email or SMS is sent from this view.",
  "Dry-run only · no email or SMS sent",
  "admin-status-badge-dry-run",
  "dryRunLabel",
  "Generate dry-run tasks",
  "generate_dry_run",
  "task_type",
  "reason",
  "priority",
  "suggested_message",
  "Internal suggested message",
  "mark_done",
  "snooze",
  "archive",
  "window.confirm"
].forEach(function (term) {
  assert.ok(queueSource.includes(term), "Admin follow-up queue missing `" + term + "`.");
});

assert.ok(authSource.includes("AdminFollowUpQueue"), "Admin auth shell should mount the follow-up queue after auth.");

[
  "localStorage",
  "sessionStorage",
  "createClient",
  "send-quote-email",
  "send-email",
  "send-sms",
  "service_role",
  "storage_bucket",
  "file_path",
  "signed_url",
  "raw_ocr",
  "supplier_cost",
  "gross_margin",
  "internal_rate"
].forEach(function (term) {
  assert.strictEqual(queueSource.includes(term), false, "Admin follow-up queue must not include `" + term + "`.");
});

console.log("adminFollowUpQueueClientContract.test.js passed");
