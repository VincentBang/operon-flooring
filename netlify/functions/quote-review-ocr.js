"use strict";

const crypto = require("crypto");
const sharp = require("sharp");
const { loadPricingLibrary } = require("./_supabasePricing");

const MAX_FILE_BYTES = 6 * 1024 * 1024;
const MAX_EXTRACTED_TEXT_CHARS = 18000;
const MAX_FIELD_SOURCE_CHARS = 300;
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif"
]);

function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    },
    body: JSON.stringify(payload)
  };
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
  if (name.endsWith(".heic")) return "image/heic";
  if (name.endsWith(".heif")) return "image/heif";
  return "";
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
    "You are an OCR engine for flooring quote review.",
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
      notes: "OCR provider returned plain text instead of JSON."
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
    contractorName: "",
    quoteNumber: "",
    quoteDate: "",
    customerName: "",
    siteAddress: "",
    suburb: "",
    postcode: "",
    flooringType: "",
    productBrand: "",
    productRange: "",
    productColour: "",
    productThickness: "",
    installMethod: "",
    quotedAreaM2: null,
    quoteTotalIncGst: null,
    quoteTotalExGst: null,
    gstAmount: null,
    lineItems: [],
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
    return emptyQuoteFields("no_text", "No OCR text available for field extraction.");
  }

  const firstLines = text.split(/\r?\n/).map(function (line) { return cleanText(line, 180); }).filter(Boolean);
  const contractorName = firstLines.find(function (line) {
    return !/quote|invoice|estimate|tax|abn|date|address|phone|email/i.test(line);
  }) || "";
  const quoteNumberMatch = text.match(/(?:quote|estimate|invoice)\s*(?:no\.?|number|#)?\s*[:#]?\s*([A-Z0-9\-\/]{3,})/i);
  const dateMatch = text.match(/(?:date|issued)\s*:?\s*([0-3]?\d[\/\-.][01]?\d[\/\-.](?:20)?\d{2})/i);
  const postcodeMatch = text.match(/\b(NSW\s*)?([12][0-9]{3})\b/i);
  const thicknessMatch = text.match(/\b([0-9]+(?:\.[0-9]+)?)\s*mm\b/i);
  const totalIncGst = extractMoneyNear(text, [
    /(?:total\s*(?:inc\.?|including)?\s*gst|grand\s*total|amount\s*due)[^\n$0-9]{0,50}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i,
    /\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)\s*(?:inc\.?|including)\s*gst/i
  ]);
  const totalExGst = extractMoneyNear(text, [
    /(?:subtotal|total\s*ex\.?\s*gst|excluding\s*gst)[^\n$0-9]{0,50}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ]);
  const gstAmount = extractMoneyNear(text, [
    /(?:gst)[^\n$0-9]{0,30}\$?\s*([0-9,]+(?:\.[0-9]{1,2})?)/i
  ]);

  const exclusions = extractEvidenceLines(text, [/exclude|not included|not allow|variation|subject to|to be confirmed|tbc/]);
  const siteConfirmationItems = extractEvidenceLines(text, [/inspect|site|subject to|confirm|subfloor|moisture|level|prep|access/]);
  const rawEvidence = extractEvidenceLines(text, [/hybrid|laminate|engineered|timber|install|supply|remove|dispose|underlay|scotia|skirting|stair|moisture|prep|total|gst|area/]);

  return {
    status: "rules_extracted",
    confidence: 0.52,
    notes: "Rule-based extraction completed. Review against OCR text before relying on it.",
    contractorName: contractorName,
    quoteNumber: quoteNumberMatch ? quoteNumberMatch[1] : "",
    quoteDate: dateMatch ? dateMatch[1] : "",
    customerName: "",
    siteAddress: "",
    suburb: "",
    postcode: postcodeMatch ? postcodeMatch[2] : "",
    flooringType: inferFlooringType(text),
    productBrand: "",
    productRange: "",
    productColour: "",
    productThickness: thicknessMatch ? thicknessMatch[1] + "mm" : "",
    installMethod: inferInstallMethod(text),
    quotedAreaM2: extractAreaNear(text),
    quoteTotalIncGst: totalIncGst,
    quoteTotalExGst: totalExGst,
    gstAmount: gstAmount,
    lineItems: [],
    scope: {
      supply: inferScopeItem(text, [/supply|material|flooring/], [/supply.*exclude|material.*exclude/], []),
      installation: inferScopeItem(text, [/install|laying|labou?r/], [/install.*exclude|labou?r.*exclude/], []),
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
}

function getFieldExtractionPrompt(extractedText) {
  return [
    "You extract structured fields from OCR text for flooring quote review.",
    "Use only the supplied OCR text. Do not infer missing values.",
    "For scope values use exactly: included, excluded, subject_to_confirmation, unknown.",
    "Return only valid JSON with camelCase keys:",
    "{",
    "\"contractorName\":\"\", \"quoteNumber\":\"\", \"quoteDate\":\"\", \"customerName\":\"\", \"siteAddress\":\"\", \"suburb\":\"\", \"postcode\":\"\",",
    "\"flooringType\":\"hybrid|laminate|engineered|unknown\", \"productBrand\":\"\", \"productRange\":\"\", \"productColour\":\"\", \"productThickness\":\"\", \"installMethod\":\"floating|glued_down|unknown\",",
    "\"quotedAreaM2\":null, \"quoteTotalIncGst\":null, \"quoteTotalExGst\":null, \"gstAmount\":null,",
    "\"lineItems\":[{\"label\":\"\",\"quantity\":null,\"unit\":\"\",\"amount\":null,\"included\":true}],",
    "\"scope\":{\"supply\":\"unknown\",\"installation\":\"unknown\",\"removal\":\"unknown\",\"disposal\":\"unknown\",\"floorPreparation\":\"unknown\",\"underlay\":\"unknown\",\"moistureProtection\":\"unknown\",\"skirting\":\"unknown\",\"scotia\":\"unknown\",\"stairs\":\"unknown\",\"doorTrimming\":\"unknown\",\"furnitureMoving\":\"unknown\"},",
    "\"exclusions\":[], \"siteConfirmationItems\":[], \"rawEvidence\":[], \"confidence\":0.0, \"notes\":\"\"",
    "}",
    "OCR text:",
    extractedText.slice(0, MAX_EXTRACTED_TEXT_CHARS)
  ].join("\n");
}

function normaliseExtractedFields(value, fallback) {
  const source = value && typeof value === "object" ? value : {};
  const output = Object.assign(emptyQuoteFields("fields_extracted", ""), fallback || {}, source);
  output.status = "fields_extracted";
  output.confidence = Math.max(0, Math.min(1, Number(source.confidence || output.confidence || 0.65) || 0.65));
  output.notes = cleanText(source.notes || output.notes, 1000);
  output.quotedAreaM2 = parseArea(source.quotedAreaM2 || source.quoted_area_m2 || output.quotedAreaM2);
  output.quoteTotalIncGst = parseMoney(source.quoteTotalIncGst || source.quote_total_inc_gst || output.quoteTotalIncGst);
  output.quoteTotalExGst = parseMoney(source.quoteTotalExGst || source.quote_total_ex_gst || output.quoteTotalExGst);
  output.gstAmount = parseMoney(source.gstAmount || source.gst_amount || output.gstAmount);
  output.lineItems = Array.isArray(source.lineItems) ? source.lineItems.slice(0, 20).map(function (item) {
    return {
      label: cleanText(item && item.label, 180),
      quantity: parseArea(item && item.quantity),
      unit: cleanText(item && item.unit, 40),
      amount: parseMoney(item && item.amount),
      included: item && item.included === false ? false : true
    };
  }) : [];
  const scope = Object.assign({}, emptyQuoteFields().scope, output.scope || {}, source.scope || {});
  Object.keys(scope).forEach(function (key) {
    scope[key] = normaliseYesNoUnknown(scope[key]);
  });
  output.scope = scope;
  output.exclusions = uniqueList(source.exclusions || output.exclusions || []);
  output.siteConfirmationItems = uniqueList(source.siteConfirmationItems || output.siteConfirmationItems || []);
  output.rawEvidence = uniqueList(source.rawEvidence || output.rawEvidence || []);
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
      notes: fallback.notes + " OpenAI field extraction is not configured."
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
      notes: "AI field extraction failed; rule-based fields are shown. " + (result && result.error && result.error.message ? result.error.message : "")
    });
  }

  try {
    const parsed = parseOcrJson(getResponseOutputText(result));
    return normaliseExtractedFields(parsed, fallback);
  } catch (error) {
    return Object.assign({}, fallback, {
      status: "rules_extracted",
      notes: "AI field extraction returned invalid JSON; rule-based fields are shown."
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
    return match.matchScore >= 18;
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
      status: "below_database_guide",
      label: "Below database guide",
      differencePercent: differencePercent
    };
  }
  if (differencePercent > 15) {
    return {
      status: "above_database_guide",
      label: "Above database guide",
      differencePercent: differencePercent
    };
  }
  return {
    status: "within_database_guide",
    label: "Within database guide",
    differencePercent: differencePercent
  };
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

async function compareAgainstOperonDatabase(fields, ocrResult) {
  if (!fields || fields.status === "no_text") {
    return {
      status: "not_ready",
      notes: "No extracted quote text is available for database comparison.",
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
    const bestProduct = productMatches[0] || null;
    const materialRate = bestProduct && bestProduct.pricePerM2
      ? bestProduct.pricePerM2
      : categoryGuide.defaultPricePerM2;
    const installRate = getGuideInstallRate(library, category, fields.installMethod);
    const area = parseArea(fields.quotedAreaM2);
    const quoteTotal = parseMoney(fields.quoteTotalIncGst);
    const guideRateExGst = (materialRate || 0) + (installRate || 0);
    const guideTotalIncGst = area && guideRateExGst ? Math.round(guideRateExGst * area * 1.1) : null;
    const quotedRateIncGst = area && quoteTotal ? Math.round(quoteTotal / area) : null;
    const guideRateIncGst = guideRateExGst ? Math.round(guideRateExGst * 1.1) : null;
    const pricePosition = getPricePosition(quoteTotal, guideTotalIncGst);
    const scopeComparison = compareScopeAgainstRules(fields);
    const unknownCount = scopeComparison.filter(function (item) {
      return item.status === "unknown" || item.status === "subject_to_confirmation";
    }).length;

    return {
      status: "compared",
      notes: "Database guide is a comparison aid only. Final price is confirmed after site details are reviewed.",
      category: categoryGuide,
      productMatches: productMatches,
      priceGuide: {
        quoteTotalIncGst: quoteTotal,
        quotedAreaM2: area,
        quotedRateIncGstPerM2: quotedRateIncGst,
        operonGuideRateIncGstPerM2: guideRateIncGst,
        operonGuideTotalIncGst: guideTotalIncGst,
        materialRateExGstPerM2: materialRate || null,
        installRateExGstPerM2: installRate || null,
        position: pricePosition
      },
      scopeComparison: scopeComparison,
      comparisonLevel: !area || !quoteTotal
        ? "scope_only"
        : unknownCount >= 5
          ? "partly_comparable"
          : "price_and_scope_comparison"
    };
  } catch (error) {
    return {
      status: "database_unavailable",
      notes: error && error.message ? error.message : "Operon database comparison is unavailable.",
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
      notes: "OCR is disabled by OPERON_OCR_PROVIDER.",
      engine: "disabled"
    };
  }

  if (!config.apiKey) {
    return {
      status: "engine_not_configured",
      extractedText: "",
      confidence: 0,
      notes: "Add OPENAI_API_KEY in Netlify to enable OCR extraction.",
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
      : "OpenAI OCR request failed.";
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
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed." });
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const file = getFilePayload(body);
    const fileName = toSafeFileName(file.name || file.fileName);
    const mimeType = normaliseMimeType(file.type || file.mimeType, fileName);
    const base64 = stripDataUrlPrefix(file.dataBase64 || file.base64 || "");

    if (!base64) {
      return jsonResponse(400, { ok: false, error: "Quote file data is required." });
    }

    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return jsonResponse(400, {
        ok: false,
        error: "Unsupported quote file type. Use PDF, JPG, PNG, WEBP or HEIC."
      });
    }

    const buffer = Buffer.from(base64, "base64");
    if (!buffer.length) {
      return jsonResponse(400, { ok: false, error: "Quote file could not be read." });
    }

    if (buffer.length > MAX_FILE_BYTES) {
      return jsonResponse(413, {
        ok: false,
        error: "Quote file is too large. Use a file under 6 MB for online review."
      });
    }

    const contentHash = crypto.createHash("sha256").update(buffer).digest("hex");

    const ocrResult = await extractTextWithOpenAi(fileName, mimeType, buffer);
    const extractedFields = await extractStructuredFieldsWithOpenAi(ocrResult);
    const databaseComparison = await compareAgainstOperonDatabase(extractedFields, ocrResult);

    return jsonResponse(200, {
      ok: true,
      file: {
        name: fileName,
        mimeType: mimeType,
        sizeBytes: buffer.length,
        contentHash: contentHash,
        reference: contentHash.slice(0, 12) + "-" + fileName
      },
      ocr: ocrResult,
      extractedFields: extractedFields,
      databaseComparison: databaseComparison,
      nextStep: databaseComparison.status === "compared"
        ? "report_ui"
        : "ocr_review"
    });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: error && error.message ? error.message : "Quote file handoff failed."
    });
  }
};
