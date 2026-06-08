#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const SITE = "https://operonflooring.com.au";

function usage() {
  console.error("Usage: node scripts/analyze-gsc-seo-loop.js internal-docs/seo/search-console/YYYY-MM");
  process.exit(1);
}

const inputDir = process.argv[2];
if (!inputDir) usage();

const resolvedDir = path.resolve(inputDir);
if (!fs.existsSync(resolvedDir) || !fs.statSync(resolvedDir).isDirectory()) {
  console.error(`Input folder not found: ${inputDir}`);
  usage();
}

function readIfExists(fileName) {
  const filePath = path.join(resolvedDir, fileName);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}

function parseCsv(text) {
  if (!text || !text.trim()) return [];
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      value = "";
      continue;
    }
    value += char;
  }
  row.push(value);
  if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  if (!rows.length) return [];

  const headers = rows[0].map((header) => normalizeHeader(header));
  return rows.slice(1).map((cells) => {
    const item = {};
    headers.forEach((header, index) => {
      item[header] = (cells[index] || "").trim();
    });
    return item;
  });
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function pick(row, candidates) {
  for (const key of candidates) {
    const normalized = normalizeHeader(key);
    if (row[normalized] !== undefined && row[normalized] !== "") return row[normalized];
  }
  return "";
}

function asNumber(value) {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/[%,$\s]/g, "").replace(/,/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function asCtr(value) {
  if (value === null || value === undefined || value === "") return 0;
  const raw = String(value).trim();
  const parsed = asNumber(raw);
  if (raw.includes("%")) return parsed / 100;
  return parsed > 1 ? parsed / 100 : parsed;
}

function normalizePerformanceRow(row, type) {
  const label = type === "query"
    ? pick(row, ["query", "top_queries", "queries"])
    : pick(row, ["page", "top_pages", "pages", "url"]);
  return {
    label,
    clicks: asNumber(pick(row, ["clicks"])),
    impressions: asNumber(pick(row, ["impressions"])),
    ctr: asCtr(pick(row, ["ctr"])),
    position: asNumber(pick(row, ["position", "average_position", "avg_position"]))
  };
}

function loadPerformance(fileName, type) {
  return parseCsv(readIfExists(fileName))
    .map((row) => normalizePerformanceRow(row, type))
    .filter((row) => row.label);
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function pct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function mdTable(headers, rows) {
  if (!rows.length) return "_No rows available from supplied Search Console exports._";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function pagePath(url) {
  const value = String(url || "");
  if (!value) return "";
  try {
    return new URL(value).pathname || "/";
  } catch {
    return value.replace(SITE, "") || value;
  }
}

function classifyPage(label) {
  const pathName = pagePath(label);
  if (pathName === "/" || pathName === "/quote.html" || pathName === "/products.html" || pathName === "/quote-review.html" || pathName === "/floorplan.html") return "money/tool page";
  if (pathName.startsWith("/flooring-")) return "local suburb page";
  if (pathName.startsWith("/blog/")) return "guide/blog page";
  if (pathName.startsWith("/projects/") || pathName === "/recent-flooring-projects.html") return "project proof page";
  if (pathName.includes("hybrid") || pathName.includes("laminate") || pathName.includes("engineered")) return "product/category page";
  return "other page";
}

function taskForPage(row) {
  const kind = classifyPage(row.label);
  const pathName = pagePath(row.label);
  if (row.impressions > 0 && row.ctr < 0.02 && row.position <= 20) {
    return `Improve title/meta and first-screen intent for ${pathName} (${kind}); query demand exists but CTR is weak.`;
  }
  if (row.position >= 8 && row.position <= 20) {
    return `Add internal links and one useful intent-matched section to ${pathName} (${kind}); page is near page 1.`;
  }
  if (kind === "local suburb page") {
    return `Strengthen local proof, property context and quote CTA on ${pathName}; avoid thin suburb copy.`;
  }
  if (kind === "guide/blog page") {
    return `Add quote-review/start-quote path and practical flooring examples to ${pathName}.`;
  }
  return `Review ${pathName} for intent match, CTA clarity and internal links.`;
}

const queries = loadPerformance("queries.csv", "query");
const pages = loadPerformance("pages.csv", "page");
const indexingRows = parseCsv(readIfExists("indexing.csv"));
const sitemapRows = parseCsv(readIfExists("sitemaps.csv"));
const cwvRows = parseCsv(readIfExists("core-web-vitals.csv"));
const richRows = parseCsv(readIfExists("rich-results.csv"));

const pageImpressionMedian = median(pages.map((row) => row.impressions));
const queryImpressionMedian = median(queries.map((row) => row.impressions));

const topPages = [...pages].sort((a, b) => b.clicks - a.clicks).slice(0, 10);
const lowCtrPages = pages
  .filter((row) => row.impressions >= Math.max(10, pageImpressionMedian) && row.ctr < 0.02)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 15);
const nearPageOneQueries = queries
  .filter((row) => row.impressions >= Math.max(5, queryImpressionMedian) && row.position >= 8 && row.position <= 20)
  .sort((a, b) => a.position - b.position || b.impressions - a.impressions)
  .slice(0, 20);
const nearPageOnePages = pages
  .filter((row) => row.impressions >= Math.max(10, pageImpressionMedian) && row.position >= 8 && row.position <= 20)
  .sort((a, b) => a.position - b.position || b.impressions - a.impressions)
  .slice(0, 15);

function issueRows(rows, labelKeys, statusKeys) {
  return rows
    .map((row) => ({
      label: pick(row, labelKeys),
      status: pick(row, statusKeys),
      raw: row
    }))
    .filter((row) => row.label || row.status)
    .slice(0, 20);
}

const indexingIssues = issueRows(indexingRows, ["page", "url", "reason", "validation"], ["status", "reason", "validation", "verdict"]);
const sitemapIssues = issueRows(sitemapRows, ["sitemap", "url"], ["status", "last_read", "discovered_urls"]);
const cwvIssues = issueRows(cwvRows, ["url", "page", "issue", "group"], ["status", "verdict", "issue", "device"]);
const richIssues = issueRows(richRows, ["item", "url", "issue", "enhancement"], ["status", "issue", "severity"]);

const pageTasks = [...lowCtrPages, ...nearPageOnePages]
  .map(taskForPage)
  .filter((task, index, all) => all.indexOf(task) === index)
  .slice(0, 5);

const contentOpportunities = nearPageOneQueries
  .map((row) => {
    const query = row.label.toLowerCase();
    if (query.includes("quote") || query.includes("cost") || query.includes("price")) return `Improve quote clarity content around “${row.label}” without exposing internal rates.`;
    if (query.includes("hybrid") || query.includes("laminate") || query.includes("engineered")) return `Support product-intent query “${row.label}” with product/category guidance and links to products/quote.`;
    if (query.includes("apartment") || query.includes("underlay") || query.includes("acoustic")) return `Add apartment/acoustic explanation for “${row.label}” with quote-review and floorplan CTAs.`;
    if (query.includes("flooring ")) return `Review whether “${row.label}” maps to an existing useful suburb/product page before creating content.`;
    return `Investigate distinct intent for “${row.label}” before creating or changing content.`;
  })
  .filter((task, index, all) => all.indexOf(task) === index)
  .slice(0, 8);

const internalLinkOps = nearPageOnePages
  .map((row) => {
    const pathName = pagePath(row.label);
    const kind = classifyPage(row.label);
    if (kind === "local suburb page") return `Add contextual links from nearby suburb/category pages into ${pathName}, plus clear links out to quote/products/floorplan/quote-review.`;
    if (kind === "guide/blog page") return `Link related guides, product category pages and quote-review CTA into ${pathName}.`;
    if (kind === "project proof page") return `Link relevant product/category and suburb pages into ${pathName}.`;
    return `Add internal links from related high-impression pages into ${pathName}.`;
  })
  .filter((task, index, all) => all.indexOf(task) === index)
  .slice(0, 8);

const nextTasks = [
  ...pageTasks,
  ...contentOpportunities,
  ...internalLinkOps,
  ...indexingIssues.slice(0, 3).map((issue) => `Investigate indexing issue: ${issue.label || "unknown URL"} ${issue.status ? `(${issue.status})` : ""}.`)
].filter(Boolean).filter((task, index, all) => all.indexOf(task) === index).slice(0, 5);

const monthLabel = path.basename(resolvedDir);
const report = `# Operon Flooring Monthly SEO Report - ${monthLabel}

Generated from Search Console exports in:

\`${path.relative(process.cwd(), resolvedDir)}\`

No rankings or indexing status are guessed. Missing export files are reported as unavailable.

## Data Availability

| Input | Status | Rows |
| --- | --- | ---: |
| queries.csv | ${queries.length ? "available" : "missing/unusable"} | ${queries.length} |
| pages.csv | ${pages.length ? "available" : "missing/unusable"} | ${pages.length} |
| indexing.csv | ${indexingRows.length ? "available" : "missing/unusable"} | ${indexingRows.length} |
| sitemaps.csv | ${sitemapRows.length ? "available" : "missing/unusable"} | ${sitemapRows.length} |
| core-web-vitals.csv | ${cwvRows.length ? "available" : "missing/unusable"} | ${cwvRows.length} |
| rich-results.csv | ${richRows.length ? "available" : "missing/unusable"} | ${richRows.length} |

## Top Current Pages By Clicks

${mdTable(["Page", "Clicks", "Impressions", "CTR", "Position", "Type"], topPages.map((row) => [
  pagePath(row.label),
  row.clicks,
  row.impressions,
  pct(row.ctr),
  row.position.toFixed(1),
  classifyPage(row.label)
]))}

## Top Gaining Pages

_Previous month comparison is not available in this first CSV analyzer. Add previous-month exports later before reporting gain/loss._

## Pages With Impressions But Low CTR

${mdTable(["Page", "Clicks", "Impressions", "CTR", "Position", "Recommended action"], lowCtrPages.map((row) => [
  pagePath(row.label),
  row.clicks,
  row.impressions,
  pct(row.ctr),
  row.position.toFixed(1),
  taskForPage(row)
]))}

## Keywords Near Page 1

${mdTable(["Query", "Clicks", "Impressions", "CTR", "Position"], nearPageOneQueries.map((row) => [
  row.label,
  row.clicks,
  row.impressions,
  pct(row.ctr),
  row.position.toFixed(1)
]))}

## Pages To Improve

${mdTable(["Page", "Clicks", "Impressions", "CTR", "Position", "Type"], nearPageOnePages.map((row) => [
  pagePath(row.label),
  row.clicks,
  row.impressions,
  pct(row.ctr),
  row.position.toFixed(1),
  classifyPage(row.label)
]))}

## New Content Opportunities

${contentOpportunities.length ? contentOpportunities.map((item) => `- ${item}`).join("\n") : "_No content opportunities can be derived from the supplied query export._"}

## Internal Linking Opportunities

${internalLinkOps.length ? internalLinkOps.map((item) => `- ${item}`).join("\n") : "_No internal linking opportunities can be derived from the supplied page export._"}

## Technical / Indexing Issues

### Indexing

${mdTable(["Item", "Status"], indexingIssues.map((issue) => [issue.label || "unknown", issue.status || "not supplied"]))}

### Sitemaps

${mdTable(["Item", "Status"], sitemapIssues.map((issue) => [issue.label || "unknown", issue.status || "not supplied"]))}

### Core Web Vitals

${mdTable(["Item", "Status"], cwvIssues.map((issue) => [issue.label || "unknown", issue.status || "not supplied"]))}

### Rich Results

${mdTable(["Item", "Status"], richIssues.map((issue) => [issue.label || "unknown", issue.status || "not supplied"]))}

## Next 5 SEO Tasks

${nextTasks.length ? nextTasks.map((task, index) => `${index + 1}. ${task}`).join("\n") : "_No task list generated. Add Search Console query/page exports first._"}

## Guardrails Before Implementation

- Do not create thin suburb pages.
- Do not expose internal rates, supplier costs, margins or private quote logic.
- Do not alter quote/pricing/product/floorplan/quote-review runtime logic for SEO-only tasks.
- Use local checks first.
- Use draft preview only when needed.
- Do not production deploy without human approval.
`;

const outputPath = path.join(resolvedDir, "monthly-seo-report.md");
fs.writeFileSync(outputPath, report, "utf8");

console.log(`Monthly SEO report written: ${path.relative(process.cwd(), outputPath)}`);
