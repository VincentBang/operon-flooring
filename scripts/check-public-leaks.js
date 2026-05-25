"use strict";

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const publicRoot = path.join(repoRoot, "apps", "web");

const blockedFilePatterns = [
  /\.env(?:\.local)?$/i,
  /\.md$/i,
  /(^|\/)admin[^/]*\.html$/i,
  /(^|\/)dashboard\.html$/i
];

const blockedContentPatterns = [
  { label: "service_role", pattern: /service_role/i },
  { label: "RESEND_API_KEY", pattern: /RESEND_API_KEY/i },
  { label: "OPENAI_API_KEY", pattern: /OPENAI_API_KEY/i },
  { label: "SUPABASE_SERVICE_ROLE", pattern: /SUPABASE_SERVICE_ROLE/i },
  { label: "sk-", pattern: /\bsk-[A-Za-z0-9_-]{12,}/ },
  { label: "re_", pattern: /\bre_[A-Za-z0-9_-]{12,}/ }
];

const textExtensions = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".toml",
  ".txt",
  ".xml",
  ".md",
  ".env"
]);

function walk(directory, files) {
  if (!fs.existsSync(directory)) {
    return files;
  }
  fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
      return;
    }
    files.push(fullPath);
  });
  return files;
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return textExtensions.has(ext) || path.basename(filePath).toLowerCase().indexOf(".env") === 0;
}

function main() {
  const findings = [];
  const files = walk(publicRoot, []);

  files.forEach(function (filePath) {
    const relative = path.relative(repoRoot, filePath).replace(/\\/g, "/");
    const publicRelative = path.relative(publicRoot, filePath).replace(/\\/g, "/");

    blockedFilePatterns.forEach(function (pattern) {
      if (pattern.test(publicRelative)) {
        findings.push(relative + " matches blocked public file pattern " + pattern);
      }
    });

    if (!isTextFile(filePath)) {
      return;
    }

    const content = fs.readFileSync(filePath, "utf8");
    blockedContentPatterns.forEach(function (item) {
      if (item.pattern.test(content)) {
        findings.push(relative + " contains blocked token: " + item.label);
      }
    });
  });

  if (findings.length) {
    console.error("Public leak check failed:");
    findings.forEach(function (finding) {
      console.error("- " + finding);
    });
    process.exit(1);
  }

  console.log("Public leak check passed.");
}

main();
