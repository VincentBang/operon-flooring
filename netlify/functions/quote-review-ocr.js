"use strict";

const crypto = require("crypto");
const sharp = require("sharp");
const Security = require("./_security");
const { loadPricingLibrary } = require("./_supabasePricing");

const MAX_FILE_BYTES = 6 * 1024 * 1024;
const MAX_EXTRACTED_TEXT_CHARS = 18000;
const MAX_FIELD_SOURCE_CHARS = 300;
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

function toSafeFileName(value) {
  const name = String(value || "uploaded-quote").trim();
  return name.replace(/[^\w.\- ]+/g, "").replace(/\s+/g, " ").slice(0, 140) || "uploaded-quote";
}

function stripDataUrlPrefix(value) {
  return String(value || "").replace(/^data:[^;]+;base64,/i, "");
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

function getFilePayload(body) {
  if (body && body.file && typeof body.file === "object") {
    return body.file;
  }
  return body || {};
}

function getOcrConfig() {
  return {
    provider: String(process.env.OPERON_OCR_PROVIDER || "openai").trim().toLowerCase(),
    apiKey: process.env.OPENAI_API_KEY || process.env.OPERON_OPENAI_API_KEY || "",
    model: process.env.OPERON_OCR_MODEL || "gpt-4.1-mini"
  };
}

function isImageMimeType(mimeType) {
  return /^image\//i.test(String(mimeType || ""));
}

async function prepareImageForOcr(buffer, mimeType) {
  if (!isImageMimeType(mimeType)) {
    return {
      buffer: buffer,
      mimeType: mimeType
    };
  }

  const resized = await sharp(buffer, { limitInputPixels: 32000000 })
    .rotate()
    .resize({
      width: 2200,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true
    })
    .jpeg({
      quality: 86,
      mozjpeg: true
    })
    .toBuffer();

  return {
    buffer: resized,
    mimeType: "image/jpeg"
  };
}

function getOpenAiContentItem(fileName, mimeType, base64) {
  const dataUrl = "data:" + mimeType + ";base64," + base64;
  if (mimeType === "application/pdf") {
    return {
      type: "input_file",
      filename: fileName,
      file_data: dataUrl
    };
  }
  return {
    type: "input_image",
    image_url: dataUrl,
    detail: "high"
  };
}

function getOcrPrompt(fileName) {
  return [
    "You extract readable text for flooring quote review.",
    "Transcribe only readable text from the uploaded quote file.",
    "Do not estimate prices or infer missing words.",
    "Preserve line breaks where useful.",
    "If the file is blurry or unreadable, return an empty extracted_text and explain briefly in notes.",
    "Return only valid JSON with this shape:",
    "{\"extracted_text\":\"...\",\"confidence\":0.0,\"notes\":\"...\"}",
    "File name: " + fileName
  ].join("\n");
}

function getResponseOutputText(result) {
  if (result && typeof result.output_text === "string") {
    return result.output_text;
  }
  const output = result && Array.isArray(result.output) ? result.output : [];
  return output.map(function (item) {
    const content = Array.isArray(item.content) ? item.content : [];
    return content.map(function (part) {
      return part.text || part.output_text || "";
    }).join("");
  }).join("\n").trim();
}

function parseOcrJson(text) {
  const raw = String(text || "").trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(raw);
  } catch (error) {
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(raw.slice(firstBrace, lastBrace + 1));
    }
    return {
      extracted_text: raw,
      confidence: raw ? 0.55 : 0,
      notes: "Document extraction returned plain text instead of JSON."
    };
  }
}

function normaliseOcrResult(parsed, engine) {
  const extractedText = String(parsed && (parsed.extracted_text || parsed.extractedText) || "").trim().slice(0, MAX_EXTRACTED_TEXT_CHARS);
  const confidence = Number(parsed && parsed.confidence);
  return {
    status: extractedText ? "text_extracted" : "no_text_found",
    extractedText: extractedText,
    confidence: Number.isFinite(confidence) ? Math.max(0, Math.min(1, confidence)) : (extractedText ? 0.65 : 0),
    notes: String(parsed && parsed.notes || "").trim().slice(0, 1000),
    engine: engine
  };
}

function emptyQuoteFields(status, notes) {
  return {
    status: status || "not_started",
    confidence: 0,
    notes: notes || "",
    extractionConfidence: 0,
    comparisonStatus: "NOT_READY_EXTRACTION_FAILED",
    supplierName: "",
    supplier_name: "",
    documentType: "unknown",
    document_type: "unknown",
    invoiceOrQuoteNumber: "",
    invoice_or_quote_number: "",
    issueDate: "",
    issue_date: "",
    dueDate: "",
    due_date: "",
    contractorName: "",
    quoteNumber: "",
    quoteDate: "",
    customerName: "",
    customer_name: "",
    siteAddress: "",
    jobAddress: "",
    job_address: "",
    suburb: "",
    postcode: "",
    flooringType: "",
    flooring_type: "",
    productBrand: "",
    productRange: "",
    productColour: "",
    productThickness: "",
    thicknessMm: null,
    thickness_mm: null,
    installMethod: "",
    quotedAreaM2: null,
    areaM2: null,
    area_m2: null,
    quoteTotalIncGst: null,
    totalIncGst: null,
    total_inc_gst: null,
    quoteTotalExGst: null,
    subtotalExGst: null,
    subtotal_ex_gst: null,
    gstAmount: null,
    gstTotal: null,
    gst_total: null,
    paymentTerms: "",
    payment_terms: "",
    lineItems: [],
    line_items: [],
    fieldConfidence: {},
    scope: {
      supply: "unknown",
      installation: "unknown",
      removal: "unknown",
      disposal: "unknown",
      floorPreparation: "unknown",
      underlay: "unknown",
      moistureProtection: "unknown",
      skirting: "unknown",
      scotia: "unknown",
      stairs: "unknown",
      doorTrimming: "unknown",
      furnitureMoving: "unknown"
    },
    exclusions: [],
    siteConfirmationItems: [],
    rawEvidence: []
  };
}

function cleanText(value, maxLength) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength || 220);
}

function parseMoney(value) {
  if (value === null || typeof value === "undefined" || value === "") return null;
  const number = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function parseArea(value) {
  if (value === null || typeof value === "undefined" || value === "") return null;
  const number = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(number) && number > 0 ? number : null;
}

function normaliseYesNoUnknown(value) {
  const text = String(value || "").trim().toLowerCase();
  if (["yes", "included", "include", "true"].includes(text)) return "included";
  if (["no", "excluded", "exclude", "false"].includes(text)) return "excluded";
  if (/subject|inspect|confirm|allowance|tbc|to be confirmed/.test(text)) return "subject_to_confirmation";
  return "unknown";
}

function normaliseSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractMoneyNear(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseMoney(match[1] || match[0]);
    }
  }
  return null;
}

function extractTaxTotal(text) {
  const lines = String(text || "").split(/\r?\n/).map(function (line) {
    return cleanText(line, 220);
  }).filter(Boolean);
  for (const line of lines) {
    const match = line.match(/^(?:tax|gst)\s+\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)$/i);
    if (match) return parseMoney(match[1]);
  }
  for (const line of lines) {
    const match = line.match(/^(?:tax|gst)[^\d$]{0,30}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)$/i);
    if (match) return parseMoney(match[1]);
  }
  return extractMoneyNear(text, [
    /(?:total\s*)?(?:tax|gst)[^\n$0-9]{0,40}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ]);
}

function extractAreaNear(text) {
  const patterns = [
    /(?:area|floor\s*area|total\s*area|supply\s*area|installation\s*area)[^\n$0-9]{0,40}([0-9]+(?:\.[0-9]+)?)\s*(?:m2|m²|sqm|sq\.?\s*m)/i,
    /([0-9]+(?:\.[0-9]+)?)\s*(?:m2|m²|sqm|sq\.?\s*m)/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return parseArea(match[1]);
    }
  }
  return null;
}

function firstCapture(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return cleanText(match[1] || match[0], 220);
    }
  }
  return "";
}

function parseDateValue(value) {
  const match = String(value || "").match(/([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/);
  return match ? match[1] : "";
}

function formatNumberValue(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.round(number * 100) / 100;
}

function inferDocumentType(text) {
  const lower = text.toLowerCase();
  if (/tax\s+invoice|\binvoice\b|invoice\s+number/i.test(text)) return "invoice";
  if (/\bquote\b|quotation/.test(lower)) return "quote";
  if (/\bestimate\b/.test(lower)) return "estimate";
  return "unknown";
}

function extractSupplierName(text, lines) {
  const explicit = firstCapture(text, [
    /^\s*([A-Z][A-Za-z0-9 &.'-]{2,80}(?:Floor|Flooring|Timber)[A-Za-z0-9 &.'-]*)\s*$/m,
    /\b([A-Z][A-Za-z0-9 &.'-]{2,80}(?:Floor|Flooring|Timber)[A-Za-z0-9 &.'-]*)\b/
  ]);
  if (explicit) return explicit;
  return (lines || []).find(function (line) {
    return /floor|flooring|timber/i.test(line) && !/address|email|phone|abn|hybrid|supply|install/i.test(line);
  }) || "";
}

function extractCustomerName(lines) {
  const blocked = /invoice|quote|estimate|date|address|phone|email|abn|description|subtotal|total|amount|balance|bank|pay|item|unit|qty|gst|tax/i;
  const candidate = (lines || []).find(function (line) {
    return /^[A-Z][A-Za-z\s.'&-]{3,80}$/.test(line)
      && !blocked.test(line)
      && !/floor|flooring|timber/i.test(line);
  });
  return candidate || "";
}

function inferProductTypeFromDescription(description, fallbackText) {
  return inferFlooringType([description, fallbackText].filter(Boolean).join(" "));
}

function extractStructuredLineItems(text) {
  const normalised = cleanText(text, MAX_EXTRACTED_TEXT_CHARS);
  const lineItems = [];
  const tablePatterns = [
    /((?:supply\s*(?:and|&)\s*install|supply\s*\/\s*install|install)[^$]*?(?:hybrid|laminate|engineered|timber|oak)[^$]*?)\s+(?:m2|m²|sqm|sq\.?\s*m)?\s*([0-9]+(?:\.[0-9]+)?)\s+([0-9,]+(?:\.[0-9]{1,2})?)\s+(?:GST|TAX)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /((?:hybrid|laminate|engineered|timber|oak)[^$]*?(?:supply|install)[^$]*?)\s+(?:m2|m²|sqm|sq\.?\s*m)?\s*([0-9]+(?:\.[0-9]+)?)\s+([0-9,]+(?:\.[0-9]{1,2})?)\s+(?:GST|TAX)?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ];

  for (const pattern of tablePatterns) {
    const match = normalised.match(pattern);
    if (!match) continue;
    const rawDescription = cleanText(match[1], 220);
    const quantity = parseArea(match[2]);
    const unitPrice = parseMoney(match[3]);
    const lineTotalExGst = parseMoney(match[4]);
    const productType = inferProductTypeFromDescription(rawDescription, text);
    const thicknessMatch = rawDescription.match(/\b([0-9]+(?:\.[0-9]+)?)\s*mm\b/i);
    const gst = lineTotalExGst ? formatNumberValue(lineTotalExGst * 0.1) : null;
    lineItems.push({
      rawDescription: rawDescription,
      raw_description: rawDescription,
      label: rawDescription,
      productType: productType || "unknown",
      product_type: productType || "unknown",
      brand: "",
      range: "",
      thicknessMm: thicknessMatch ? Number(thicknessMatch[1]) : null,
      thickness_mm: thicknessMatch ? Number(thicknessMatch[1]) : null,
      quantity: quantity,
      unit: productType && quantity ? "m2" : "unknown",
      unitPriceExGst: unitPrice,
      unit_price_ex_gst: unitPrice,
      lineTotalExGst: lineTotalExGst,
      line_total_ex_gst: lineTotalExGst,
      gst: gst,
      lineTotalIncGst: lineTotalExGst ? formatNumberValue(lineTotalExGst * 1.1) : null,
      line_total_inc_gst: lineTotalExGst ? formatNumberValue(lineTotalExGst * 1.1) : null,
      amount: lineTotalExGst,
      included: true,
      confidence: rawDescription && quantity && unitPrice && lineTotalExGst ? 0.92 : 0.7
    });
    break;
  }

  return lineItems;
}

function getBestLineItem(fields) {
  return Array.isArray(fields.lineItems) && fields.lineItems.length ? fields.lineItems[0] : null;
}

function getSourceLineItems(source, output) {
  if (Array.isArray(source.lineItems)) return source.lineItems;
  if (Array.isArray(source.line_items)) return source.line_items;
  if (Array.isArray(output.lineItems)) return output.lineItems;
  if (Array.isArray(output.line_items)) return output.line_items;
  return [];
}

function buildFieldConfidence(fields) {
  return {
    supplier: fields.supplierName ? "high" : "missing",
    document_type: fields.documentType !== "unknown" ? "high" : "missing",
    invoice_or_quote_number: fields.invoiceOrQuoteNumber ? "high" : "missing",
    issue_date: fields.issueDate ? "high" : "missing",
    due_date: fields.dueDate ? "high" : "missing",
    customer_name: fields.customerName ? "high" : "missing",
    job_address: fields.jobAddress ? "high" : "missing",
    product_type: fields.flooringType ? "high" : "missing",
    thickness: fields.thicknessMm ? "high" : "missing",
    quantity: fields.quotedAreaM2 ? "high" : "missing",
    unit_price: getBestLineItem(fields) && getBestLineItem(fields).unitPriceExGst ? "high" : "missing",
    subtotal: fields.quoteTotalExGst ? "high" : "missing",
    gst: fields.gstAmount ? "high" : "missing",
    total: fields.quoteTotalIncGst ? "high" : "missing",
    brand_range: fields.productBrand || fields.productRange ? "high" : "missing",
    underlay: fields.scope.underlay === "unknown" ? "missing" : "high",
    removal: fields.scope.removal === "unknown" ? "missing" : "high",
    floor_preparation: fields.scope.floorPreparation === "unknown" ? "missing" : "high",
    trims: fields.scope.scotia === "unknown" && fields.scope.skirting === "unknown" ? "missing" : "high",
    stairs: fields.scope.stairs === "unknown" ? "missing" : "high",
    warranty: /warranty/i.test(fields.rawEvidence.join(" ")) ? "high" : "missing",
    exclusions: fields.exclusions.length ? "high" : "missing"
  };
}

function classifyReviewStatus(fields) {
  if (!fields || fields.status === "no_text") return "NOT_READY_EXTRACTION_FAILED";
  const lineItem = getBestLineItem(fields);
  const hasProduct = Boolean(fields.flooringType && fields.flooringType !== "unknown");
  const hasArea = Boolean(fields.quotedAreaM2);
  const hasPrice = Boolean(fields.quoteTotalIncGst || (lineItem && lineItem.unitPriceExGst));
  const scopeKnown = ["underlay", "removal", "disposal", "floorPreparation", "skirting", "scotia", "stairs"].filter(function (key) {
    return fields.scope && fields.scope[key] && fields.scope[key] !== "unknown";
  }).length;
  if (hasProduct && hasArea && hasPrice && scopeKnown >= 4) return "READY_TO_COMPARE";
  if (hasProduct && hasArea && hasPrice) return "COMPARABLE_WITH_CAUTION";
  if (hasPrice) return "NOT_READY_SCOPE_MISSING";
  return "NOT_READY_EXTRACTION_FAILED";
}

function inferFlooringType(text) {
  const lower = text.toLowerCase();
  if (/hybrid|spc|stone plastic|solid polymer/.test(lower)) return "hybrid";
  if (/laminate/.test(lower)) return "laminate";
  if (/engineered|timber|oak|herringbone|chevron/.test(lower)) return "engineered";
  return "";
}

function inferInstallMethod(text) {
  const lower = text.toLowerCase();
  if (/glue[d]?\s*down|direct\s*stick|direct\s*glue/.test(lower)) return "glued_down";
  if (/floating|float/.test(lower)) return "floating";
  return "";
}

function inferScopeItem(text, includePatterns, excludePatterns, confirmationPatterns) {
  const lower = text.toLowerCase();
  if (confirmationPatterns.some(function (pattern) { return pattern.test(lower); })) {
    return "subject_to_confirmation";
  }
  if (excludePatterns.some(function (pattern) { return pattern.test(lower); })) {
    return "excluded";
  }
  if (includePatterns.some(function (pattern) { return pattern.test(lower); })) {
    return "included";
  }
  return "unknown";
}

function uniqueList(items) {
  return Array.from(new Set(items.map(function (item) {
    return cleanText(item, 260);
  }).filter(Boolean))).slice(0, 10);
}

function extractEvidenceLines(text, patterns) {
  return text.split(/\r?\n/)
    .map(function (line) { return cleanText(line, MAX_FIELD_SOURCE_CHARS); })
    .filter(function (line) {
      const lower = line.toLowerCase();
      return patterns.some(function (pattern) { return pattern.test(lower); });
    })
    .slice(0, 8);
}

function extractFieldsWithRules(extractedText) {
  const text = String(extractedText || "").slice(0, MAX_EXTRACTED_TEXT_CHARS);
  if (!text.trim()) {
    return emptyQuoteFields("no_text", "No document text available for field extraction.");
  }

  const firstLines = text.split(/\r?\n/).map(function (line) { return cleanText(line, 180); }).filter(Boolean);
  const headerTableMatch = cleanText(text, MAX_EXTRACTED_TEXT_CHARS).match(/invoice\s+number\s+issue\s+date\s+due\s+date\s+([A-Z0-9\-\/]{3,})\s+([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})\s+([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/i);
  const documentType = inferDocumentType(text);
  const supplierName = extractSupplierName(text, firstLines);
  const contractorName = supplierName || firstLines.find(function (line) {
    return !/quote|invoice|estimate|tax|abn|date|address|phone|email/i.test(line);
  }) || "";
  const quoteNumberMatch = text.match(/(?:quote|estimate|invoice)\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9\-\/]{3,})/i);
  const issueDate = headerTableMatch ? headerTableMatch[2] : firstCapture(text, [
    /issue\s+date\s*[:#]?\s*([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/i,
    /(?:date|issued)\s*:?\s*([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/i
  ]);
  const dueDate = headerTableMatch ? headerTableMatch[3] : firstCapture(text, [
    /due\s+date\s*[:#]?\s*([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/i
  ]);
  const documentNumber = headerTableMatch ? headerTableMatch[1] : (quoteNumberMatch ? quoteNumberMatch[1] : "");
  const customerName = extractCustomerName(firstLines);
  const jobAddress = firstCapture(text, [
    /Address\s*:\s*([^\n\r]+)/i,
    /(?:site|job)\s*address\s*:\s*([^\n\r]+)/i
  ]);
  const postcodeMatch = text.match(/\b(NSW\s*)?([12][0-9]{3})\b/i);
  const thicknessMatch = text.match(/\b([0-9]+(?:\.[0-9]+)?)\s*mm\b/i);
  const lineItems = extractStructuredLineItems(text);
  const primaryLine = lineItems[0] || null;
  const totalIncGst = extractMoneyNear(text, [
    /(?:total\s*amount\s*\(?\s*inc\.?\s*tax\s*\)?|total\s*(?:inc\.?|including)?\s*(?:gst|tax)|grand\s*total|amount\s*due|balance\s*due)[^\n$0-9]{0,80}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:inc\.?|including)\s*gst/i
  ]);
  const totalExGst = extractMoneyNear(text, [
    /(?:subtotal\s*\(?\s*exc\.?\s*tax\s*\)?|subtotal|total\s*ex\.?\s*(?:gst|tax)|excluding\s*(?:gst|tax))[^\n$0-9]{0,80}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ]);
  const gstAmount = extractTaxTotal(text);

  const exclusions = extractEvidenceLines(text, [/exclude|not included|not allow|variation|subject to|to be confirmed|tbc/]);
  const siteConfirmationItems = extractEvidenceLines(text, [/inspect|site|subject to|confirm|subfloor|moisture|level|prep|access/]);
  const rawEvidence = extractEvidenceLines(text, [/hybrid|laminate|engineered|timber|install|supply|remove|dispose|underlay|scotia|skirting|stair|moisture|prep|total|gst|area/]);
  const flooringType = (primaryLine && primaryLine.productType !== "unknown" ? primaryLine.productType : inferFlooringType(text)) || "";
  const quotedAreaM2 = primaryLine && primaryLine.quantity ? primaryLine.quantity : extractAreaNear(text);
  const productThickness = thicknessMatch ? thicknessMatch[1] + "mm" : "";
  const thicknessMm = thicknessMatch ? Number(thicknessMatch[1]) : null;
  const output = {
    status: "rules_extracted",
    confidence: primaryLine ? 0.82 : 0.52,
    extractionConfidence: primaryLine ? 0.9 : 0.52,
    notes: primaryLine
      ? "Structured invoice fields extracted from document text."
      : "Rule-based extraction completed. Review against document text before relying on it.",
    supplierName: supplierName,
    supplier_name: supplierName,
    documentType: documentType,
    document_type: documentType,
    invoiceOrQuoteNumber: documentNumber,
    invoice_or_quote_number: documentNumber,
    issueDate: parseDateValue(issueDate),
    issue_date: parseDateValue(issueDate),
    dueDate: parseDateValue(dueDate),
    due_date: parseDateValue(dueDate),
    contractorName: contractorName,
    quoteNumber: documentNumber,
    quoteDate: parseDateValue(issueDate),
    customerName: customerName,
    customer_name: customerName,
    siteAddress: jobAddress,
    jobAddress: jobAddress,
    job_address: jobAddress,
    suburb: jobAddress.match(/,\s*([A-Za-z ]+)(?:,|\s*$)/) ? cleanText(jobAddress.match(/,\s*([A-Za-z ]+)(?:,|\s*$)/)[1], 80) : "",
    postcode: postcodeMatch ? postcodeMatch[2] : "",
    flooringType: flooringType,
    flooring_type: flooringType,
    productBrand: "",
    productRange: "",
    productColour: "",
    productThickness: productThickness,
    thicknessMm: thicknessMm,
    thickness_mm: thicknessMm,
    installMethod: inferInstallMethod(text),
    quotedAreaM2: quotedAreaM2,
    areaM2: quotedAreaM2,
    area_m2: quotedAreaM2,
    quoteTotalIncGst: totalIncGst,
    totalIncGst: totalIncGst,
    total_inc_gst: totalIncGst,
    quoteTotalExGst: totalExGst || (primaryLine && primaryLine.lineTotalExGst) || null,
    subtotalExGst: totalExGst || (primaryLine && primaryLine.lineTotalExGst) || null,
    subtotal_ex_gst: totalExGst || (primaryLine && primaryLine.lineTotalExGst) || null,
    gstAmount: gstAmount || (primaryLine && primaryLine.gst) || null,
    gstTotal: gstAmount || (primaryLine && primaryLine.gst) || null,
    gst_total: gstAmount || (primaryLine && primaryLine.gst) || null,
    paymentTerms: dueDate ? "Due " + parseDateValue(dueDate) : "",
    payment_terms: dueDate ? "Due " + parseDateValue(dueDate) : "",
    lineItems: lineItems,
    line_items: lineItems,
    scope: {
      supply: primaryLine && /supply/i.test(primaryLine.rawDescription) ? "included" : inferScopeItem(text, [/supply|material|flooring/], [/supply.*exclude|material.*exclude/], []),
      installation: primaryLine && /install/i.test(primaryLine.rawDescription) ? "included" : inferScopeItem(text, [/install|laying|labou?r/], [/install.*exclude|labou?r.*exclude/], []),
      removal: inferScopeItem(text, [/remov|uplift|take up|rip up/], [/remov.*exclude|uplift.*exclude|take up.*exclude/], [/remov.*subject|remov.*confirm/]),
      disposal: inferScopeItem(text, [/disposal|dispose|take away|tip fee|rubbish/], [/disposal.*exclude|take away.*exclude/], [/disposal.*confirm/]),
      floorPreparation: inferScopeItem(text, [/floor prep|preparation|levell?ing|grind|patch|subfloor/], [/prep.*exclude|levell?ing.*exclude/], [/prep.*subject|subfloor.*inspect|levell?ing.*confirm/]),
      underlay: inferScopeItem(text, [/underlay|acoustic/], [/underlay.*exclude|acoustic.*exclude/], [/acoustic.*confirm/]),
      moistureProtection: inferScopeItem(text, [/moisture|vapou?r barrier|waterproof membrane/], [/moisture.*exclude|barrier.*exclude/], [/moisture.*test|moisture.*confirm/]),
      skirting: inferScopeItem(text, [/skirting/], [/skirting.*exclude/], [/skirting.*confirm/]),
      scotia: inferScopeItem(text, [/scotia|quad|trim/], [/scotia.*exclude|trim.*exclude/], [/scotia.*confirm|trim.*confirm/]),
      stairs: inferScopeItem(text, [/stair|nosing/], [/stair.*exclude|nosing.*exclude/], [/stair.*confirm/]),
      doorTrimming: inferScopeItem(text, [/door trim|trim door|door cutting/], [/door.*exclude/], [/door.*confirm/]),
      furnitureMoving: inferScopeItem(text, [/furniture|move furniture/], [/furniture.*exclude/], [/furniture.*confirm/])
    },
    exclusions: uniqueList(exclusions),
    siteConfirmationItems: uniqueList(siteConfirmationItems),
    rawEvidence: uniqueList(rawEvidence)
  };

  output.comparisonStatus = classifyReviewStatus(output);
  output.fieldConfidence = buildFieldConfidence(output);
  return output;
}

function getFieldExtractionPrompt(extractedText) {
  return [
    "You extract structured fields from document text for flooring quote review.",
    "Use only the supplied document text. Do not infer missing values.",
    "For scope values use exactly: included, excluded, subject_to_confirmation, unknown.",
    "Return only valid JSON with camelCase keys:",
    "{",
    "\"supplierName\":\"\", \"documentType\":\"quote|invoice|estimate|unknown\", \"invoiceOrQuoteNumber\":\"\", \"issueDate\":\"\", \"dueDate\":\"\",",
    "\"contractorName\":\"\", \"quoteNumber\":\"\", \"quoteDate\":\"\", \"customerName\":\"\", \"jobAddress\":\"\", \"siteAddress\":\"\", \"suburb\":\"\", \"postcode\":\"\",",
    "\"flooringType\":\"hybrid|laminate|engineered|unknown\", \"productBrand\":\"\", \"productRange\":\"\", \"productColour\":\"\", \"productThickness\":\"\", \"installMethod\":\"floating|glued_down|unknown\",",
    "\"quotedAreaM2\":null, \"quoteTotalIncGst\":null, \"quoteTotalExGst\":null, \"gstAmount\":null,",
    "\"lineItems\":[{\"rawDescription\":\"\",\"productType\":\"hybrid|laminate|engineered_timber|unknown\",\"brand\":\"\",\"range\":\"\",\"thicknessMm\":null,\"quantity\":null,\"unit\":\"m2|lm|each|unknown\",\"unitPriceExGst\":null,\"lineTotalExGst\":null,\"gst\":null,\"lineTotalIncGst\":null,\"confidence\":0.0}],",
    "\"scope\":{\"supply\":\"unknown\",\"installation\":\"unknown\",\"removal\":\"unknown\",\"disposal\":\"unknown\",\"floorPreparation\":\"unknown\",\"underlay\":\"unknown\",\"moistureProtection\":\"unknown\",\"skirting\":\"unknown\",\"scotia\":\"unknown\",\"stairs\":\"unknown\",\"doorTrimming\":\"unknown\",\"furnitureMoving\":\"unknown\"},",
    "\"exclusions\":[], \"siteConfirmationItems\":[], \"rawEvidence\":[], \"confidence\":0.0, \"notes\":\"\"",
    "}",
    "Document text:",
    extractedText.slice(0, MAX_EXTRACTED_TEXT_CHARS)
  ].join("\n");
}

function normaliseExtractedFields(value, fallback) {
  const source = value && typeof value === "object" ? value : {};
  const output = Object.assign(emptyQuoteFields("fields_extracted", ""), fallback || {}, source);
  const sourceLineItems = getSourceLineItems(source, output);
  output.status = "fields_extracted";
  output.confidence = Math.max(0, Math.min(1, Number(source.confidence || output.confidence || 0.65) || 0.65));
  output.extractionConfidence = Math.max(0, Math.min(1, Number(source.extractionConfidence || source.extraction_confidence || output.extractionConfidence || output.confidence || 0.65) || 0.65));
  output.notes = cleanText(source.notes || output.notes, 1000);
  output.supplierName = cleanText(source.supplierName || source.supplier_name || output.supplierName || output.contractorName, 140);
  output.supplier_name = output.supplierName;
  output.documentType = cleanText(source.documentType || source.document_type || output.documentType, 40) || "unknown";
  output.document_type = output.documentType;
  output.invoiceOrQuoteNumber = cleanText(source.invoiceOrQuoteNumber || source.invoice_or_quote_number || output.invoiceOrQuoteNumber || output.quoteNumber, 80);
  output.invoice_or_quote_number = output.invoiceOrQuoteNumber;
  output.issueDate = parseDateValue(source.issueDate || source.issue_date || output.issueDate || output.quoteDate);
  output.issue_date = output.issueDate;
  output.dueDate = parseDateValue(source.dueDate || source.due_date || output.dueDate);
  output.due_date = output.dueDate;
  output.customerName = cleanText(source.customerName || source.customer_name || output.customerName, 140);
  output.customer_name = output.customerName;
  output.jobAddress = cleanText(source.jobAddress || source.job_address || output.jobAddress || output.siteAddress, 220);
  output.job_address = output.jobAddress;
  output.siteAddress = output.jobAddress;
  output.quotedAreaM2 = parseArea(source.quotedAreaM2 || source.quoted_area_m2 || output.quotedAreaM2);
  output.areaM2 = output.quotedAreaM2;
  output.area_m2 = output.quotedAreaM2;
  output.quoteTotalIncGst = parseMoney(source.quoteTotalIncGst || source.quote_total_inc_gst || output.quoteTotalIncGst);
  output.totalIncGst = output.quoteTotalIncGst;
  output.total_inc_gst = output.quoteTotalIncGst;
  output.quoteTotalExGst = parseMoney(source.quoteTotalExGst || source.quote_total_ex_gst || output.quoteTotalExGst);
  output.subtotalExGst = output.quoteTotalExGst;
  output.subtotal_ex_gst = output.quoteTotalExGst;
  output.gstAmount = parseMoney(source.gstAmount || source.gst_amount || output.gstAmount);
  output.gstTotal = output.gstAmount;
  output.gst_total = output.gstAmount;
  output.flooringType = cleanText(source.flooringType || source.flooring_type || output.flooringType, 60);
  output.flooring_type = output.flooringType;
  output.thicknessMm = Number(source.thicknessMm || source.thickness_mm || output.thicknessMm || parseArea(output.productThickness));
  output.thicknessMm = Number.isFinite(output.thicknessMm) && output.thicknessMm > 0 ? output.thicknessMm : null;
  output.thickness_mm = output.thicknessMm;
  output.paymentTerms = cleanText(source.paymentTerms || source.payment_terms || output.paymentTerms, 180);
  output.payment_terms = output.paymentTerms;
  output.lineItems = sourceLineItems.slice(0, 20).map(function (item) {
    const rawDescription = cleanText(item && (item.rawDescription || item.raw_description || item.label), 220);
    const quantity = parseArea(item && item.quantity);
    const unitPrice = parseMoney(item && (item.unitPriceExGst || item.unit_price_ex_gst));
    const lineTotalExGst = parseMoney(item && (item.lineTotalExGst || item.line_total_ex_gst || item.amount));
    const lineGst = parseMoney(item && item.gst) || (lineTotalExGst ? formatNumberValue(lineTotalExGst * 0.1) : null);
    const lineTotalIncGst = parseMoney(item && (item.lineTotalIncGst || item.line_total_inc_gst)) || (lineTotalExGst ? formatNumberValue(lineTotalExGst * 1.1) : null);
    return {
      rawDescription: rawDescription,
      raw_description: rawDescription,
      label: rawDescription,
      productType: cleanText(item && (item.productType || item.product_type), 60) || inferProductTypeFromDescription(rawDescription, ""),
      product_type: cleanText(item && (item.productType || item.product_type), 60) || inferProductTypeFromDescription(rawDescription, ""),
      brand: cleanText(item && item.brand, 120),
      range: cleanText(item && item.range, 120),
      thicknessMm: Number(item && (item.thicknessMm || item.thickness_mm)) || null,
      thickness_mm: Number(item && (item.thicknessMm || item.thickness_mm)) || null,
      quantity: quantity,
      unit: cleanText(item && item.unit, 40) || (quantity ? "m2" : "unknown"),
      unitPriceExGst: unitPrice,
      unit_price_ex_gst: unitPrice,
      lineTotalExGst: lineTotalExGst,
      line_total_ex_gst: lineTotalExGst,
      gst: lineGst,
      lineTotalIncGst: lineTotalIncGst,
      line_total_inc_gst: lineTotalIncGst,
      amount: lineTotalExGst,
      included: item && item.included === false ? false : true,
      confidence: Number.isFinite(Number(item && item.confidence)) ? Number(item.confidence) : (rawDescription && quantity && unitPrice ? 0.85 : 0.55)
    };
  });
  output.line_items = output.lineItems;
  const primaryLine = output.lineItems[0] || null;
  if (!output.flooringType && primaryLine && primaryLine.productType && primaryLine.productType !== "unknown") {
    output.flooringType = primaryLine.productType;
    output.flooring_type = output.flooringType;
  }
  if (!output.thicknessMm && primaryLine && primaryLine.thicknessMm) {
    output.thicknessMm = primaryLine.thicknessMm;
    output.thickness_mm = output.thicknessMm;
  }
  if (!output.productThickness && output.thicknessMm) {
    output.productThickness = output.thicknessMm + "mm";
  }
  if (!output.quotedAreaM2 && output.lineItems[0] && output.lineItems[0].quantity) {
    output.quotedAreaM2 = output.lineItems[0].quantity;
    output.areaM2 = output.quotedAreaM2;
    output.area_m2 = output.quotedAreaM2;
  }
  if (!output.quoteTotalExGst && output.lineItems[0] && output.lineItems[0].lineTotalExGst) {
    output.quoteTotalExGst = output.lineItems[0].lineTotalExGst;
    output.subtotalExGst = output.quoteTotalExGst;
    output.subtotal_ex_gst = output.quoteTotalExGst;
  }
  if (!output.gstAmount && output.lineItems[0] && output.lineItems[0].gst) {
    output.gstAmount = output.lineItems[0].gst;
    output.gstTotal = output.gstAmount;
    output.gst_total = output.gstAmount;
  }
  const scope = Object.assign({}, emptyQuoteFields().scope, output.scope || {}, source.scope || {});
  Object.keys(scope).forEach(function (key) {
    scope[key] = normaliseYesNoUnknown(scope[key]);
  });
  output.scope = scope;
  output.exclusions = uniqueList(source.exclusions || output.exclusions || []);
  output.siteConfirmationItems = uniqueList(source.siteConfirmationItems || output.siteConfirmationItems || []);
  output.rawEvidence = uniqueList(source.rawEvidence || output.rawEvidence || []);
  output.comparisonStatus = classifyReviewStatus(output);
  output.fieldConfidence = Object.assign(buildFieldConfidence(output), source.fieldConfidence || source.field_confidence || {});
  return output;
}

async function extractStructuredFieldsWithOpenAi(ocrResult) {
  const extractedText = ocrResult && ocrResult.extractedText || "";
  const fallback = extractFieldsWithRules(extractedText);
  const config = getOcrConfig();

  if (!extractedText.trim()) {
    return fallback;
  }

  if (!config.apiKey) {
    return Object.assign({}, fallback, {
      status: "rules_extracted",
      notes: fallback.notes + " Document field extraction is not configured."
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: getFieldExtractionPrompt(extractedText) }
          ]
        }
      ]
    })
  });

  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    return Object.assign({}, fallback, {
      status: "rules_extracted",
      notes: "Document field extraction failed; rule-based fields are shown. " + (result && result.error && result.error.message ? result.error.message : "")
    });
  }

  try {
    const parsed = parseOcrJson(getResponseOutputText(result));
    return normaliseExtractedFields(parsed, fallback);
  } catch (error) {
    return Object.assign({}, fallback, {
      status: "rules_extracted",
      notes: "Document field extraction returned invalid JSON; rule-based fields are shown."
    });
  }
}

function getProductSearchText(product) {
  return normaliseSearchText([
    product && product.id,
    product && product.category,
    product && product.brand,
    product && product.range,
    product && product.colour,
    product && product.thickness,
    product && product.productType,
    product && product.description,
    product && Array.isArray(product.features) ? product.features.join(" ") : ""
  ].filter(Boolean).join(" "));
}

function getQuoteSearchText(fields, ocrResult) {
  return normaliseSearchText([
    fields && fields.flooringType,
    fields && fields.productBrand,
    fields && fields.productRange,
    fields && fields.productColour,
    fields && fields.productThickness,
    fields && fields.rawEvidence ? fields.rawEvidence.join(" ") : "",
    ocrResult && ocrResult.extractedText
  ].filter(Boolean).join(" "));
}

function getTokenScore(needle, haystack, weight) {
  const text = normaliseSearchText(needle);
  if (!text) return 0;
  if (haystack.indexOf(text) >= 0) return weight;
  const tokens = text.split(" ").filter(function (token) {
    return token.length >= 3;
  });
  if (!tokens.length) return 0;
  const matches = tokens.filter(function (token) {
    return haystack.indexOf(token) >= 0;
  }).length;
  return Math.round(weight * (matches / tokens.length));
}

function scoreProductMatch(product, fields, quoteText) {
  let score = 0;
  const productText = getProductSearchText(product);
  const combined = quoteText + " " + productText;
  if (fields.flooringType && product.category === fields.flooringType) score += 20;
  score += getTokenScore(fields.productBrand, combined, 12);
  score += getTokenScore(fields.productRange, combined, 24);
  score += getTokenScore(fields.productColour, combined, 18);
  score += getTokenScore(fields.productThickness, combined, 10);
  score += getTokenScore(product.range, quoteText, 18);
  score += getTokenScore(product.colour, quoteText, 14);
  score += getTokenScore(product.thickness, quoteText, 8);
  return Math.max(0, Math.min(100, score));
}

function findProductMatches(library, fields, ocrResult) {
  const category = fields.flooringType && fields.flooringType !== "unknown" ? fields.flooringType : "";
  const quoteText = getQuoteSearchText(fields, ocrResult);
  const products = (library.productList || []).filter(function (product) {
    return !category || product.category === category;
  });
  return products.map(function (product) {
    return {
      id: product.id,
      label: [product.range, product.colour].filter(Boolean).join(" - ") || product.brand || product.id,
      brand: product.brand || "",
      range: product.range || "",
      colour: product.colour || "",
      thickness: product.thickness || "",
      category: product.category || "",
      pricePerM2: parseMoney(product.pricePerM2),
      matchScore: scoreProductMatch(product, fields, quoteText)
    };
  }).filter(function (match) {
    // Category alone is not enough for a product-level match.
    return match.matchScore >= 34;
  }).sort(function (left, right) {
    return right.matchScore - left.matchScore || left.label.localeCompare(right.label);
  }).slice(0, 3);
}

function getCategoryGuide(library, category) {
  const meta = library.categoryMap && library.categoryMap[category] ? library.categoryMap[category] : null;
  return {
    id: category || "",
    label: meta && meta.label || category || "Unknown flooring",
    defaultPricePerM2: parseMoney(meta && meta.pricePerM2)
  };
}

function getGuideInstallRate(library, category, installMethod) {
  const rates = Array.isArray(library.installRates) ? library.installRates : [];
  const method = installMethod === "glued_down" ? "direct_glue" : "floating";
  const exact = rates.find(function (rate) {
    return rate.category_id === category
      && rate.job_type === "supply_install"
      && (rate.install_method === method || rate.install_type === method || (!rate.install_method && rate.install_type === "standard"));
  });
  if (exact) return parseMoney(exact.rate_per_m2);
  const fallback = rates.find(function (rate) {
    return rate.category_id === category && rate.job_type === "supply_install";
  });
  return fallback ? parseMoney(fallback.rate_per_m2) : null;
}

function getPricePosition(quoteTotal, guideTotal) {
  if (!quoteTotal || !guideTotal) {
    return {
      status: "not_enough_price_data",
      label: "Not enough price data",
      differencePercent: null
    };
  }
  const differencePercent = Math.round(((quoteTotal - guideTotal) / guideTotal) * 100);
  if (differencePercent < -15) {
    return {
      status: "below_comparison_guide",
      label: "Below comparison guide",
      differencePercent: differencePercent
    };
  }
  if (differencePercent > 15) {
    return {
      status: "above_comparison_guide",
      label: "Above comparison guide",
      differencePercent: differencePercent
    };
  }
  return {
    status: "within_comparison_guide",
    label: "Within comparison guide",
    differencePercent: differencePercent
  };
}

function getQuotedUnitPriceExGst(fields) {
  const lineItem = getBestLineItem(fields);
  if (lineItem && lineItem.unitPriceExGst) return parseMoney(lineItem.unitPriceExGst);
  if (fields && fields.quotedAreaM2 && fields.quoteTotalExGst) {
    return formatNumberValue(fields.quoteTotalExGst / fields.quotedAreaM2);
  }
  return null;
}

function compareScopeAgainstRules(fields) {
  const scope = fields.scope || {};
  const items = [
    ["supply", "Flooring supply"],
    ["installation", "Installation"],
    ["removal", "Removal"],
    ["disposal", "Take-away disposal"],
    ["floorPreparation", "Floor preparation"],
    ["underlay", "Underlay/acoustic layer"],
    ["moistureProtection", "Moisture protection"],
    ["skirting", "Skirting"],
    ["scotia", "Scotia"],
    ["stairs", "Stairs"]
  ];
  return items.map(function (item) {
    const value = normaliseYesNoUnknown(scope[item[0]]);
    let note = "";
    if (value === "unknown") {
      note = item[1] + " is not clearly found in the uploaded quote.";
    } else if (value === "subject_to_confirmation") {
      note = item[1] + " appears subject to site confirmation.";
    } else if (value === "excluded") {
      note = item[1] + " appears excluded or not included.";
    } else {
      note = item[1] + " appears included.";
    }
    return {
      key: item[0],
      label: item[1],
      status: value,
      note: note
    };
  });
}

function getScopeLabel(key) {
  const labels = {
    supply: "Flooring supply",
    installation: "Installation labour",
    removal: "Existing floor removal",
    disposal: "Take-away disposal",
    floorPreparation: "Floor preparation",
    underlay: "Underlay/acoustic layer",
    moistureProtection: "Moisture protection",
    skirting: "Skirting",
    scotia: "Scotia/edge trims",
    stairs: "Stairs",
    doorTrimming: "Door trimming",
    furnitureMoving: "Furniture moving"
  };
  return labels[key] || key;
}

function getScopeConsequence(key) {
  const consequences = {
    underlay: "Apartment and product requirements commonly change when underlay or acoustic layers are not specified.",
    removal: "Removal can materially change the total when the existing floor type is not listed.",
    disposal: "Take-away disposal is commonly separate from lifting the old floor.",
    floorPreparation: "Floor preparation is typically where most price variation occurs after inspection.",
    scotia: "Trims, scotia and transitions affect the finished edge and are often clarified late.",
    skirting: "Skirting work affects the finished edge and can be included, excluded or priced separately.",
    stairs: "Stair nosings, edge finishing and labour usually need separate scope detail.",
    moistureProtection: "Concrete and ground-floor areas commonly need moisture checks before installation.",
    doorTrimming: "Door trimming is a small item that can become a variation when not listed.",
    furnitureMoving: "Furniture moving changes labour time and site access planning."
  };
  return consequences[key] || "This item should be confirmed in writing before comparing totals.";
}

function buildScopeClassification(fields, databaseComparison) {
  const scopeComparison = databaseComparison && Array.isArray(databaseComparison.scopeComparison)
    ? databaseComparison.scopeComparison
    : compareScopeAgainstRules(fields);
  const groups = {
    known: [],
    unclear: [],
    missing: [],
    inferred: [],
    risky: []
  };

  scopeComparison.forEach(function (item) {
    const entry = {
      key: item.key,
      label: item.label || getScopeLabel(item.key),
      status: item.status,
      explanation: item.note || "",
      consequence: getScopeConsequence(item.key)
    };
    if (item.status === "included" || item.status === "excluded") {
      groups.known.push(entry);
    } else if (item.status === "subject_to_confirmation") {
      groups.unclear.push(entry);
      groups.risky.push(entry);
    } else {
      groups.missing.push(entry);
      if (["underlay", "removal", "disposal", "floorPreparation", "scotia", "skirting", "stairs", "moistureProtection"].includes(item.key)) {
        groups.risky.push(entry);
      }
    }
  });

  if (fields.flooringType) {
    groups.known.unshift({
      key: "product_type",
      label: "Product category",
      status: "included",
      explanation: fields.flooringType + " flooring is visible in the uploaded quote.",
      consequence: "Category-level review can start from this."
    });
  }
  if (fields.quotedAreaM2) {
    groups.known.unshift({
      key: "area",
      label: "Measured area",
      status: "included",
      explanation: fields.quotedAreaM2 + " m2 is visible in the uploaded quote.",
      consequence: "The quote has an area basis rather than only a room description."
    });
  }

  const majorRiskCount = groups.risky.length;
  const scopeQuality = majorRiskCount >= 5 ? "thin_scope" : (majorRiskCount >= 2 ? "partial_scope" : "mostly_clear_scope");
  return {
    stage: "scope_classification",
    scopeQuality: scopeQuality,
    known: groups.known.slice(0, 12),
    unclear: groups.unclear.slice(0, 12),
    missing: groups.missing.slice(0, 12),
    inferred: groups.inferred,
    risky: groups.risky.slice(0, 12)
  };
}

function getOperonComparisonStatus(fields, databaseComparison) {
  const category = fields && fields.flooringType && fields.flooringType !== "unknown" ? fields.flooringType : "";
  const area = parseArea(fields && fields.quotedAreaM2);
  const hasPrice = Boolean(getQuotedUnitPriceExGst(fields) || parseMoney(fields && fields.quoteTotalExGst) || parseMoney(fields && fields.quoteTotalIncGst));
  const comparisonLevel = databaseComparison && databaseComparison.comparisonLevel || "";
  if (!category) return "OPERON_PRODUCT_MATCH_REQUIRED";
  if (!area || !hasPrice) return "OPERON_SCOPE_TOO_UNCLEAR";
  if (comparisonLevel === "product_match" || comparisonLevel === "product_match_with_scope_caution") return "OPERON_COMPARABLE_READY";
  if (comparisonLevel === "category_level_only") return "OPERON_CATEGORY_ESTIMATE_ONLY";
  return "OPERON_SITE_CONFIRMATION_REQUIRED";
}

function buildOperonComparison(fields, databaseComparison, scopeClassification) {
  const priceGuide = databaseComparison && databaseComparison.priceGuide || {};
  const status = getOperonComparisonStatus(fields, databaseComparison);
  const comparisonLevel = databaseComparison && databaseComparison.comparisonLevel || "not_comparable";
  const confidence = databaseComparison && databaseComparison.comparisonConfidence || (status === "OPERON_CATEGORY_ESTIMATE_ONLY" ? "low" : "not_ready");
  const matchLevel = comparisonLevel === "product_match" || comparisonLevel === "product_match_with_scope_caution"
    ? "product"
    : (comparisonLevel === "category_level_only" ? "category" : "manual_required");

  return {
    stage: "operon_comparison_mapping",
    status: status,
    productMatchLevel: matchLevel,
    comparisonLevel: comparisonLevel,
    comparisonConfidence: confidence,
    operonEstimateAvailable: false,
    operonEstimateExGst: null,
    operonEstimateIncGst: null,
    priceDifferenceAmount: null,
    priceDifferencePercent: null,
    comparisonBand: "not_comparable",
    assumptions: [
      "Scope is reviewed before price is compared.",
      "Exact Operon estimate requires the existing pricing engine and enough site/product detail.",
      "Final price still requires product and site confirmation."
    ],
    competitorPrice: {
      quoteTotalIncGst: priceGuide.quoteTotalIncGst || null,
      quoteTotalExGst: priceGuide.quoteTotalExGst || null,
      areaM2: priceGuide.quotedAreaM2 || null,
      unitPriceExGstPerM2: priceGuide.quotedUnitPriceExGstPerM2 || null
    },
    scopeRiskCount: scopeClassification && scopeClassification.risky ? scopeClassification.risky.length : 0
  };
}

function getComparisonDecisionLine(operonComparison) {
  if (!operonComparison || !operonComparison.status) {
    return "Scope needs to be clarified before price is compared.";
  }
  if (operonComparison.status === "OPERON_COMPARABLE_READY") {
    return "This is close enough for a structured comparison, but final site details still need confirmation.";
  }
  if (operonComparison.status === "OPERON_CATEGORY_ESTIMATE_ONLY") {
    return "Category-level comparison is possible. Exact product and scope still need confirmation.";
  }
  if (operonComparison.status === "OPERON_PRODUCT_MATCH_REQUIRED") {
    return "Choose the closest Operon product or category before comparing price.";
  }
  return "Confirm the missing scope before comparing price.";
}

function getDimensionLevel(score) {
  if (score >= 75) return "low";
  if (score >= 45) return "moderate";
  return "high";
}

function buildRiskDimensions(fields, scopeClassification, operonComparison) {
  const riskyCount = scopeClassification && scopeClassification.risky ? scopeClassification.risky.length : 0;
  const knownCount = scopeClassification && scopeClassification.known ? scopeClassification.known.length : 0;
  const missingCount = scopeClassification && scopeClassification.missing ? scopeClassification.missing.length : 0;
  const hasProduct = Boolean(fields.flooringType && fields.flooringType !== "unknown");
  const hasArea = Boolean(fields.quotedAreaM2);
  const hasPrice = Boolean(getQuotedUnitPriceExGst(fields) || fields.quoteTotalExGst || fields.quoteTotalIncGst);
  const hasProductSpec = Boolean(fields.productBrand || fields.productRange || fields.productColour || fields.productThickness || fields.thicknessMm);
  const score = {
    pricingClarity: (hasArea && hasPrice ? 80 : (hasPrice ? 45 : 20)),
    scopeCompleteness: Math.max(20, Math.min(90, 85 - (missingCount * 7))),
    variationRisk: Math.max(15, Math.min(90, 85 - (riskyCount * 9))),
    installationRisk: riskyCount >= 5 ? 30 : (riskyCount >= 2 ? 55 : 80),
    productCertainty: hasProductSpec ? 75 : (hasProduct ? 45 : 20),
    comparisonConfidence: operonComparison && operonComparison.comparisonConfidence === "medium" ? 60 : (operonComparison && operonComparison.comparisonConfidence === "high" ? 80 : 35)
  };

  return [
    {
      key: "pricing_clarity",
      label: "Pricing clarity risk",
      level: getDimensionLevel(score.pricingClarity),
      score: score.pricingClarity,
      whyThisMatters: hasArea && hasPrice
        ? "The quote has a visible area and price basis, so the price can be discussed with more confidence."
        : "Price is hard to interpret without a clear area and total."
    },
    {
      key: "scope_completeness",
      label: "Scope completeness risk",
      level: getDimensionLevel(score.scopeCompleteness),
      score: score.scopeCompleteness,
      whyThisMatters: knownCount
        ? "Known inclusions help separate real scope from assumptions."
        : "Missing scope makes the headline total less reliable."
    },
    {
      key: "variation_risk",
      label: "Variation risk",
      level: getDimensionLevel(score.variationRisk),
      score: score.variationRisk,
      whyThisMatters: riskyCount
        ? "Unclear items commonly become variation discussions after site inspection."
        : "Few obvious variation triggers are visible from the extracted scope."
    },
    {
      key: "installation_risk",
      label: "Installation risk",
      level: getDimensionLevel(score.installationRisk),
      score: score.installationRisk,
      whyThisMatters: "Subfloor condition, trims, stairs and moisture handling affect installation quality and final scope."
    },
    {
      key: "product_certainty",
      label: "Product certainty",
      level: getDimensionLevel(score.productCertainty),
      score: score.productCertainty,
      whyThisMatters: hasProductSpec
        ? "A clearer product specification makes comparison more reliable."
        : "Product category alone is not enough for an exact like-for-like comparison."
    },
    {
      key: "comparison_confidence",
      label: "Comparison confidence",
      level: getDimensionLevel(score.comparisonConfidence),
      score: score.comparisonConfidence,
      whyThisMatters: "Comparison confidence depends on product match, area, price and written scope clarity."
    }
  ];
}

function buildLikelyVariationRisks(scopeClassification) {
  const risky = scopeClassification && scopeClassification.risky ? scopeClassification.risky : [];
  const preferredOrder = ["floorPreparation", "underlay", "removal", "disposal", "scotia", "skirting", "stairs", "moistureProtection"];
  const byKey = new Map(risky.map(function (item) { return [item.key, item]; }));
  return preferredOrder.filter(function (key) {
    return byKey.has(key);
  }).map(function (key) {
    const item = byKey.get(key);
    return {
      key: item.key,
      label: item.label,
      whyThisMatters: item.consequence
    };
  }).slice(0, 6);
}

function buildVisualScopeComparison(scopeClassification) {
  const known = scopeClassification && scopeClassification.known ? scopeClassification.known : [];
  const risky = scopeClassification && scopeClassification.risky ? scopeClassification.risky : [];
  const operonAssumptions = ["Flooring supply", "Installation labour", "Scope confirmed before booking"];
  return {
    competitorQuote: {
      included: known.map(function (item) { return item.label; }).slice(0, 6),
      unclear: risky.map(function (item) { return item.label; }).slice(0, 8)
    },
    operonEstimate: {
      included: operonAssumptions,
      toConfirm: ["Product/range", "Site conditions", "Subfloor preparation", "Finishing details"]
    }
  };
}

function buildDecisionReport(fields, scopeClassification, operonComparison) {
  const status = fields.comparisonStatus || classifyReviewStatus(fields);
  const extractionConfidence = fields.extractionConfidence >= 0.8 ? "High" : (fields.extractionConfidence >= 0.55 ? "Medium" : "Low");
  const comparisonConfidence = operonComparison.comparisonConfidence === "medium" ? "Medium" : (operonComparison.comparisonConfidence === "high" ? "High" : "Low");
  const risky = scopeClassification.risky || [];
  const known = scopeClassification.known || [];
  const lineItem = getBestLineItem(fields);
  const riskDimensions = buildRiskDimensions(fields, scopeClassification, operonComparison);
  const likelyVariationRisks = buildLikelyVariationRisks(scopeClassification);
  const keyIssue = risky.length
    ? "The quote includes readable pricing, but important scope items are not clearly listed."
    : "The main quote details are readable. Final site confirmation is still required.";

  return {
    stage: "decision_report",
    executiveSummary: {
      status: status === "COMPARABLE_WITH_CAUTION" ? "Comparable with caution" : status.replace(/_/g, " ").toLowerCase(),
      extractionConfidence: extractionConfidence,
      comparisonConfidence: comparisonConfidence,
      keyIssue: keyIssue,
      recommendation: "Confirm inclusions before comparing on price alone."
    },
    extractedQuoteDetails: {
      supplier: fields.supplierName || "",
      documentType: fields.documentType || "unknown",
      documentNumber: fields.invoiceOrQuoteNumber || "",
      product: lineItem && lineItem.rawDescription || fields.productRange || fields.flooringType || "",
      category: fields.flooringType || "",
      thicknessMm: fields.thicknessMm || null,
      areaM2: fields.quotedAreaM2 || null,
      unitPriceExGst: lineItem && lineItem.unitPriceExGst || getQuotedUnitPriceExGst(fields),
      subtotalExGst: fields.quoteTotalExGst || null,
      gst: fields.gstAmount || null,
      totalIncGst: fields.quoteTotalIncGst || null,
      address: fields.jobAddress || fields.siteAddress || "",
      visibleScope: known.map(function (item) { return item.label; }).slice(0, 8)
    },
    scopeConfidence: {
      clear: known.map(function (item) { return item.label; }).slice(0, 8),
      unclear: (scopeClassification.unclear || []).map(function (item) { return item.label; }).slice(0, 8),
      missing: (scopeClassification.missing || []).map(function (item) { return item.label; }).slice(0, 8)
    },
    riskDimensions: riskDimensions,
    likelyVariationRisks: likelyVariationRisks,
    visualScopeComparison: buildVisualScopeComparison(scopeClassification),
    whyQuotesDiffer: [
      "Floor preparation and moisture checks are typically confirmed after site review.",
      "Underlay, trims, removal, disposal and stairs commonly change the real scope.",
      "A lower total is only meaningful when inclusions and exclusions match."
    ],
    operonComparableEstimate: {
      status: operonComparison.status,
      comparisonLevel: operonComparison.comparisonLevel,
      confidence: operonComparison.comparisonConfidence,
      estimateAvailable: operonComparison.operonEstimateAvailable,
      estimateRange: null,
      assumptions: operonComparison.assumptions
    },
    priceDifferenceInterpretation: "Price comparison should wait until scope is complete. " + getComparisonDecisionLine(operonComparison),
    questionsToClarify: [
      "What brand, range and colour is the flooring product?",
      "Is acoustic underlay included?",
      "Is removal and take-away disposal included?",
      "Is floor preparation or levelling included?",
      "Are trims, scotia, skirting or door trims included?",
      "Are stairs or transition trims included?",
      "What warranty and exclusions apply?"
    ],
    humanEscalation: comparisonConfidence === "Low"
      ? "This quote has low comparison confidence. Manual clarification or site confirmation will produce a more reliable comparison."
      : "",
    nextStepCta: operonComparison.status === "OPERON_PRODUCT_MATCH_REQUIRED"
      ? "Choose closest Operon product to compare"
      : (operonComparison.status === "OPERON_SCOPE_TOO_UNCLEAR" ? "Confirm missing scope before comparing price" : "Build a structured Operon estimate")
  };
}

async function compareAgainstOperonDatabase(fields, ocrResult) {
  if (!fields || fields.status === "no_text") {
    return {
      status: "not_ready",
      notes: "Readable uploaded quote text is not available for Operon comparison.",
      productMatches: [],
      priceGuide: null,
      scopeComparison: []
    };
  }

  try {
    const library = await loadPricingLibrary();
    const category = fields.flooringType && fields.flooringType !== "unknown" ? fields.flooringType : "";
    const categoryGuide = getCategoryGuide(library, category);
    const productMatches = findProductMatches(library, fields, ocrResult);
    const area = parseArea(fields.quotedAreaM2);
    const quoteTotal = parseMoney(fields.quoteTotalIncGst);
    const quoteTotalExGst = parseMoney(fields.quoteTotalExGst);
    const quotedUnitPriceExGst = getQuotedUnitPriceExGst(fields);
    const quotedRateIncGst = area && quoteTotal ? formatNumberValue(quoteTotal / area) : null;
    const scopeComparison = compareScopeAgainstRules(fields);
    const unknownCount = scopeComparison.filter(function (item) {
      return item.status === "unknown" || item.status === "subject_to_confirmation";
    }).length;
    const hasComparablePrice = Boolean(category && area && (quotedUnitPriceExGst || quoteTotalExGst || quoteTotal));
    const comparisonLevel = !hasComparablePrice
      ? "scope_only"
      : productMatches.length
        ? (unknownCount >= 5 ? "product_match_with_scope_caution" : "product_match")
        : "category_level_only";
    const status = hasComparablePrice ? "category_level_comparison" : "scope_check_only";
    const notes = hasComparablePrice
      ? (productMatches.length
        ? "A likely product match was found, but final comparison still depends on written inclusions and site confirmation."
        : "Category-level comparison only. Exact brand, range and finish are not clear enough for an exact product comparison.")
      : "Scope can be checked, but product type, area and price are not complete enough for a pricing comparison.";

    return {
      status: status,
      notes: notes,
      category: categoryGuide,
      productMatches: productMatches,
      priceGuide: {
        quoteTotalIncGst: quoteTotal,
        quoteTotalExGst: quoteTotalExGst,
        quotedAreaM2: area,
        quotedUnitPriceExGstPerM2: quotedUnitPriceExGst,
        quotedRateIncGstPerM2: quotedRateIncGst,
        position: {
          status: comparisonLevel,
          label: comparisonLevel === "category_level_only"
            ? "Category-level only"
            : (comparisonLevel === "scope_only" ? "Scope only" : "Product match needs scope check"),
          differencePercent: null
        }
      },
      scopeComparison: scopeComparison,
      comparisonLevel: comparisonLevel,
      comparisonConfidence: hasComparablePrice && unknownCount < 5 ? "medium" : (hasComparablePrice ? "low" : "not_ready")
    };
  } catch (error) {
    const category = fields.flooringType && fields.flooringType !== "unknown" ? fields.flooringType : "";
    const area = parseArea(fields.quotedAreaM2);
    const quoteTotal = parseMoney(fields.quoteTotalIncGst);
    const quoteTotalExGst = parseMoney(fields.quoteTotalExGst);
    const quotedUnitPriceExGst = getQuotedUnitPriceExGst(fields);
    const hasComparablePrice = Boolean(category && area && (quotedUnitPriceExGst || quoteTotalExGst || quoteTotal));
    if (hasComparablePrice) {
      return {
        status: "category_level_comparison",
        notes: "Category-level comparison only. Exact brand, range and finish are not clear enough for an exact product comparison.",
        category: {
          id: category,
          label: category,
          defaultPricePerM2: null
        },
        productMatches: [],
        priceGuide: {
          quoteTotalIncGst: quoteTotal,
          quoteTotalExGst: quoteTotalExGst,
          quotedAreaM2: area,
          quotedUnitPriceExGstPerM2: quotedUnitPriceExGst,
          quotedRateIncGstPerM2: area && quoteTotal ? formatNumberValue(quoteTotal / area) : null,
          position: {
            status: "category_level_only",
            label: "Category-level only",
            differencePercent: null
          }
        },
        scopeComparison: compareScopeAgainstRules(fields),
        comparisonLevel: "category_level_only",
        comparisonConfidence: "low",
        databaseStatus: "pricing_library_unavailable",
        databaseNote: error && error.message ? error.message : "Operon comparison is unavailable."
      };
    }
    return {
      status: "database_unavailable",
      notes: error && error.message ? error.message : "Operon comparison is unavailable.",
      productMatches: [],
      priceGuide: null,
      scopeComparison: compareScopeAgainstRules(fields)
    };
  }
}

async function extractTextWithOpenAi(fileName, mimeType, buffer) {
  const config = getOcrConfig();
  if (config.provider === "disabled") {
    return {
      status: "engine_disabled",
      extractedText: "",
      confidence: 0,
      notes: "Document review is currently disabled.",
      engine: "disabled"
    };
  }

  if (!config.apiKey) {
    return {
      status: "engine_not_configured",
      extractedText: "",
      confidence: 0,
      notes: "Document review is not configured yet.",
      engine: "openai"
    };
  }

  const prepared = await prepareImageForOcr(buffer, mimeType);
  const base64 = prepared.buffer.toString("base64");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + config.apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: config.model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: getOcrPrompt(fileName) },
            getOpenAiContentItem(fileName, prepared.mimeType, base64)
          ]
        }
      ]
    })
  });

  const result = await response.json().catch(function () {
    return null;
  });

  if (!response.ok) {
    const message = result && result.error && result.error.message
      ? result.error.message
      : "Document extraction request failed.";
    return {
      status: "ocr_failed",
      extractedText: "",
      confidence: 0,
      notes: message,
      engine: "openai:" + config.model
    };
  }

  const parsed = parseOcrJson(getResponseOutputText(result));
  return normaliseOcrResult(parsed, "openai:" + config.model);
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

  try {
    const largeBodyResponse = Security.rejectLargeBody(event, 9 * 1024 * 1024);
    if (largeBodyResponse) return largeBodyResponse;

    const rateLimit = await Security.checkDurableRateLimit(event, {
      scope: "quote-review-ocr",
      limit: 10,
      windowMs: 60 * 60 * 1000
    });
    if (!rateLimit.allowed) {
      return Security.rateLimitResponse(event, rateLimit);
    }

    const body = JSON.parse(event.body || "{}");
    const turnstile = await Security.verifyTurnstile(event, body.turnstileToken || body.turnstile_token || "");
    if (!turnstile.ok) {
      return Security.botChallengeResponse(event, turnstile);
    }
    const file = getFilePayload(body);
    const fileName = toSafeFileName(file.name || file.fileName);
    const mimeType = normaliseMimeType(file.type || file.mimeType, fileName);
    const base64 = stripDataUrlPrefix(file.dataBase64 || file.base64 || "");

    if (!base64) {
      return jsonResponse(event, 400, { ok: false, error: "Quote file data is required." });
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return jsonResponse(event, 400, {
        ok: false,
        error: "Unsupported quote file type. Use PDF, JPG, PNG or WEBP."
      });
    }

    if (!extensionMatchesMimeType(fileName, mimeType)) {
      return jsonResponse(event, 400, {
        ok: false,
        error: "Quote file extension does not match the uploaded file type."
      });
    }

    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length) {
      return jsonResponse(event, 400, { ok: false, error: "Quote file could not be read." });
    }

    if (buffer.length > MAX_FILE_BYTES) {
      return jsonResponse(event, 413, {
        ok: false,
        error: "Quote file is too large. Use a file under 6 MB for online review."
      });
    }

    if (!hasAllowedFileSignature(buffer, mimeType)) {
      return jsonResponse(event, 400, {
        ok: false,
        error: "Quote file signature could not be verified. Use a valid PDF, JPG, PNG or WEBP file."
      });
    }

    const contentHash = crypto.createHash("sha256").update(buffer).digest("hex");

    const ocrResult = await extractTextWithOpenAi(fileName, mimeType, buffer);
    const extractedFields = await extractStructuredFieldsWithOpenAi(ocrResult);
    const databaseComparison = await compareAgainstOperonDatabase(extractedFields, ocrResult);
    const scopeClassification = buildScopeClassification(extractedFields, databaseComparison);
    const operonComparison = buildOperonComparison(extractedFields, databaseComparison, scopeClassification);
    const decisionReport = buildDecisionReport(extractedFields, scopeClassification, operonComparison);

    return jsonResponse(event, 200, {
      ok: true,
      pipeline: {
        model: getOcrConfig().model,
        stages: [
          "ocr_extraction",
          "structured_field_extraction",
          "scope_classification",
          "operon_comparison_mapping",
          "decision_report"
        ],
        pricingLogic: "existing_operon_pricing_only",
        scopeFirst: true
      },
      file: {
        name: fileName,
        mimeType: mimeType,
        sizeBytes: buffer.length,
        reference: contentHash.slice(0, 12) + "-" + fileName
      },
      ocr: ocrResult,
      extractedFields: extractedFields,
      scopeClassification: scopeClassification,
      databaseComparison: databaseComparison,
      operonComparison: operonComparison,
      decisionReport: decisionReport,
      nextStep: databaseComparison.status === "compared"
        ? "report_ui"
        : "ocr_review"
    });
  } catch (error) {
    return jsonResponse(event, 500, {
      ok: false,
      error: error && error.message ? error.message : "Quote file handoff failed."
    });
  }
};

exports._test = {
  extractFieldsWithRules: extractFieldsWithRules,
  normaliseExtractedFields: normaliseExtractedFields,
  compareAgainstOperonDatabase: compareAgainstOperonDatabase,
  compareScopeAgainstRules: compareScopeAgainstRules,
  classifyReviewStatus: classifyReviewStatus,
  buildScopeClassification: buildScopeClassification,
  buildOperonComparison: buildOperonComparison,
  buildDecisionReport: buildDecisionReport
};
