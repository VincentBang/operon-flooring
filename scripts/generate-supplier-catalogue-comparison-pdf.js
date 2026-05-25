const fs = require("fs");
const path = require("path");
const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

const outputPath = path.resolve(
  __dirname,
  "../reports/supplier-catalogue-comparison.pdf"
);

const suppliers = [
  {
    name: "Bass Timber",
    site: "https://basstimber.com.au/",
    ranges: [
      ["Aqua Wood Plus 12mm", 24, 24],
      ["Botanica", 8, 8],
      ["Elk Falls", 1, 1],
      ["Hydroplank WPC", 11, 11],
      ["Iconic WPC", 1, 1],
      ["Luxury Hybrid", 16, 16],
      ["Luxury Hybrid 7mm", 6, 6],
      ["Luxury Hybrid 8mm", 12, 12],
      ["Luxury Hybrid 9mm", 8, 8],
      ["Luxury Hybrid PLUS 10mm", 12, 12],
      ["Oak Step", 10, 10],
      ["Oak Step PLUS", 10, 10],
      ["Ornato", 16, 16],
      ["Project Oak", 12, 12],
    ],
  },
  {
    name: "Eco Flooring Systems",
    site: "https://ecoflooring.com.au/",
    ranges: [
      ["Avala", 10, 10],
      ["Elite 6.0 Hybrid", 12, 12],
      ["Grande 7.5 Hybrid", 6, 6],
      ["Grande 9.0 Hybrid", 10, 10],
      ["Herringbone 7.0 Hybrid", 6, 6],
      ["Lumiere Ultra HD", 12, 12],
      ["Ornato Luxury", 16, 16],
      ["Stone Floor", 20, 20],
      ["Storm", 12, 12],
      ["Swish Native Hardwood", 6, 6],
      ["Urban 6.5 Hybrid", 12, 12],
      ["XXL 8.0 Hybrid", 12, 12],
    ],
  },
  {
    name: "HRT Timber Flooring",
    site: "https://hrttimberflooring.com.au/",
    ranges: [
      ["ETF 12mm Laminate", 15, 15],
      ["ETF 7.0mm Hybrid", 15, 15],
      ["ETF 8.0mm Hybrid", 12, 12],
      ["ETF 9.0mm Hybrid", 14, 14],
      ["ETF Hybrid SPC 9mm", 7, 7],
      ["Infinite", 16, 16],
      ["Kronoswiss Aquastop", 37, 37],
      ["Swish Aquastop", 12, 12],
      ["Swish Laminate", 12, 12],
      ["Swish Laminate Aqua", 16, 16],
      ["Swish Oak", 24, 24],
      ["Swish Oak Contemporary", 6, 6],
      ["Swish Oak Natura", 16, 16],
      ["Swish Oak Natura Handcrafted", 3, 3],
      ["Swish Oak Natura Herringbone", 6, 6],
      ["Swish Oak Wideboard", 8, 8],
      ["Villeroy & Boch Aquastop", 21, 21],
      ["Villeroy & Boch Contemporary", 4, 4],
      ["Villeroy & Boch Cosmopolitan", 5, 5],
      ["Villeroy & Boch Country", 3, 3],
      ["Villeroy & Boch Heritage", 3, 3],
      ["Wide Plank Water Resistant Laminate", 8, 8],
    ],
  },
  {
    name: "Topdeck Flooring",
    site: "https://topdeckflooring.com.au/",
    ranges: [
      ["Artisan", 24, 24],
      ["Artisan Tile", 12, 12],
      ["Aspire", 14, 14],
      ["Belle Vie", 12, 12],
      ["Castel Nuovo", 12, 12],
      ["Cavallo Bianco", 12, 12],
      ["Easi Plank", 4, 4],
      ["Lavanda Oak", 12, 12],
      ["Pantora Amor", 12, 12],
      ["Pantora Lifestyle", 10, 10],
      ["Pre-Finished Solid Timber", 9, 9],
      ["Prefinish Solid Timber", 9, 9],
      ["Prime Contemporary Plus", 11, 11],
      ["Prime Deluxe", 8, 8],
      ["Prime Legend", 10, 10],
      ["Prime Luxury", 10, 10],
      ["Wooden-Land Australian Species 136mm", 7, 7],
      ["Wooden-Land Australian Species 190mm", 6, 6],
      ["Wooden-Land Foreign Species", 2, 2],
      ["Wooden-Land Herringbone", 2, 2],
    ],
    note: "Prefinish Solid Timber appears to duplicate Pre-Finished Solid Timber in the local catalogue.",
  },
  {
    name: "Preference Floors",
    site: "https://preferencefloors.com.au/",
    ranges: [
      ["Classic Laminate", 9, 9],
      ["Fiddleback", 9, 9],
      ["Hardwood Collection", 185, 185],
      ["Oakleaf", 12, 12],
      ["Oakleaf Laminate", 2, 2],
      ["Prestige Oak", 46, 46],
      ["Pronto", 13, 13],
      ["Pronto Engineered Oak", 1, 1],
      ["Select Australian Timber", 6, 6],
    ],
    note: "Hardwood Collection has an unusually high local colour count and should be QA checked.",
  },
];

const reportDate = "18 May 2026";
const page = { width: 842, height: 595, margin: 36 };
const colours = {
  ink: rgb(0.12, 0.12, 0.12),
  muted: rgb(0.42, 0.42, 0.42),
  line: rgb(0.82, 0.84, 0.84),
  band: rgb(0.95, 0.96, 0.95),
  header: rgb(0.12, 0.22, 0.2),
  ok: rgb(0.09, 0.42, 0.27),
  warn: rgb(0.68, 0.32, 0.05),
};

function totals(supplier) {
  return supplier.ranges.reduce(
    (acc, row) => {
      acc.ourColours += row[1];
      acc.supplierColours += row[2];
      return acc;
    },
    { ranges: supplier.ranges.length, ourColours: 0, supplierColours: 0 }
  );
}

function wrapText(text, font, size, maxWidth) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(pageRef, text, x, y, options) {
  pageRef.drawText(String(text), {
    x,
    y,
    size: options.size,
    font: options.font,
    color: options.color || colours.ink,
  });
}

function drawRule(pageRef, y) {
  pageRef.drawLine({
    start: { x: page.margin, y },
    end: { x: page.width - page.margin, y },
    thickness: 0.7,
    color: colours.line,
  });
}

async function buildPdf() {
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let pageRef = pdf.addPage([page.width, page.height]);
  let y = page.height - page.margin;

  drawText(pageRef, "Supplier Catalogue Comparison", page.margin, y, {
    font: bold,
    size: 22,
    color: colours.header,
  });
  y -= 24;
  drawText(
    pageRef,
    `Operon local catalogue vs supplier site range/colour counts | ${reportDate}`,
    page.margin,
    y,
    { font: regular, size: 10, color: colours.muted }
  );
  y -= 20;
  drawRule(pageRef, y);
  y -= 26;

  const grand = suppliers.reduce(
    (acc, supplier) => {
      const t = totals(supplier);
      acc.ranges += t.ranges;
      acc.ourColours += t.ourColours;
      acc.supplierColours += t.supplierColours;
      return acc;
    },
    { ranges: 0, ourColours: 0, supplierColours: 0 }
  );

  const summary = [
    ["Suppliers", suppliers.length],
    ["Local ranges", grand.ranges],
    ["Local colours", grand.ourColours],
    ["Supplier colours", grand.supplierColours],
  ];
  const cardW = 170;
  summary.forEach(([label, value], index) => {
    const x = page.margin + index * (cardW + 12);
    pageRef.drawRectangle({
      x,
      y: y - 48,
      width: cardW,
      height: 48,
      color: colours.band,
      borderColor: colours.line,
      borderWidth: 0.8,
    });
    drawText(pageRef, label, x + 12, y - 18, {
      font: regular,
      size: 8,
      color: colours.muted,
    });
    drawText(pageRef, value, x + 12, y - 39, {
      font: bold,
      size: 18,
      color: colours.header,
    });
  });
  y -= 78;

  drawText(pageRef, "Notes", page.margin, y, {
    font: bold,
    size: 12,
    color: colours.header,
  });
  y -= 16;
  [
    "The local catalogue still includes legacy duplicate range identities. This report keeps those visible instead of silently merging them.",
    "The supplier-site column uses the verified supplier counts supplied for the five requested domains.",
    "Rows marked Match have the same colour count locally and on the supplier site.",
  ].forEach((note) => {
    const lines = wrapText(note, regular, 9, page.width - page.margin * 2 - 12);
    lines.forEach((line, lineIndex) => {
      drawText(pageRef, `${lineIndex === 0 ? "-" : " "} ${line}`, page.margin, y, {
        font: regular,
        size: 9,
        color: colours.ink,
      });
      y -= 12;
    });
  });

  function newPage() {
    pageRef = pdf.addPage([page.width, page.height]);
    y = page.height - page.margin;
    drawText(pageRef, "Supplier Catalogue Comparison", page.margin, y, {
      font: bold,
      size: 12,
      color: colours.header,
    });
    drawText(pageRef, reportDate, page.width - page.margin - 66, y, {
      font: regular,
      size: 8,
      color: colours.muted,
    });
    y -= 20;
    drawRule(pageRef, y);
    y -= 18;
  }

  function ensureSpace(height) {
    if (y - height < page.margin) newPage();
  }

  const col = {
    range: page.margin,
    our: page.margin + 360,
    supplier: page.margin + 455,
    diff: page.margin + 565,
    status: page.margin + 645,
  };

  for (const supplier of suppliers) {
    ensureSpace(86);
    const t = totals(supplier);
    y -= 24;
    drawText(pageRef, supplier.name, page.margin, y, {
      font: bold,
      size: 15,
      color: colours.header,
    });
    drawText(
      pageRef,
      `${supplier.site} | ${t.ranges} ranges | local ${t.ourColours} colours | supplier ${t.supplierColours} colours`,
      page.margin + 170,
      y + 1,
      { font: regular, size: 8.5, color: colours.muted }
    );
    y -= 16;
    if (supplier.note) {
      const lines = wrapText(supplier.note, regular, 8.5, page.width - page.margin * 2);
      lines.forEach((line) => {
        drawText(pageRef, line, page.margin, y, {
          font: regular,
          size: 8.5,
          color: colours.warn,
        });
        y -= 11;
      });
      y -= 3;
    }

    pageRef.drawRectangle({
      x: page.margin,
      y: y - 16,
      width: page.width - page.margin * 2,
      height: 18,
      color: colours.header,
    });
    drawText(pageRef, "Range", col.range + 8, y - 11, {
      font: bold,
      size: 8,
      color: rgb(1, 1, 1),
    });
    drawText(pageRef, "Our colours", col.our, y - 11, {
      font: bold,
      size: 8,
      color: rgb(1, 1, 1),
    });
    drawText(pageRef, "Supplier colours", col.supplier, y - 11, {
      font: bold,
      size: 8,
      color: rgb(1, 1, 1),
    });
    drawText(pageRef, "Diff", col.diff, y - 11, {
      font: bold,
      size: 8,
      color: rgb(1, 1, 1),
    });
    drawText(pageRef, "Status", col.status, y - 11, {
      font: bold,
      size: 8,
      color: rgb(1, 1, 1),
    });
    y -= 20;

    supplier.ranges.forEach(([range, ourColours, supplierColours], index) => {
      const rangeLines = wrapText(range, regular, 8.5, 330);
      const rowHeight = Math.max(18, rangeLines.length * 10 + 8);
      ensureSpace(rowHeight + 8);
      if (index % 2 === 0) {
        pageRef.drawRectangle({
          x: page.margin,
          y: y - rowHeight + 3,
          width: page.width - page.margin * 2,
          height: rowHeight,
          color: rgb(0.985, 0.985, 0.975),
        });
      }
      rangeLines.forEach((line, lineIndex) => {
        drawText(pageRef, line, col.range + 8, y - 9 - lineIndex * 10, {
          font: regular,
          size: 8.5,
          color: colours.ink,
        });
      });
      const diff = ourColours - supplierColours;
      const status = diff === 0 ? "Match" : "Review";
      drawText(pageRef, ourColours, col.our + 24, y - 9, {
        font: regular,
        size: 8.5,
        color: colours.ink,
      });
      drawText(pageRef, supplierColours, col.supplier + 32, y - 9, {
        font: regular,
        size: 8.5,
        color: colours.ink,
      });
      drawText(pageRef, diff > 0 ? `+${diff}` : diff, col.diff + 6, y - 9, {
        font: regular,
        size: 8.5,
        color: diff === 0 ? colours.muted : colours.warn,
      });
      drawText(pageRef, status, col.status, y - 9, {
        font: bold,
        size: 8.5,
        color: diff === 0 ? colours.ok : colours.warn,
      });
      y -= rowHeight;
    });
  }

  const pageCount = pdf.getPageCount();
  pdf.getPages().forEach((p, index) => {
    drawText(p, `Page ${index + 1} of ${pageCount}`, page.width - page.margin - 54, 18, {
      font: regular,
      size: 8,
      color: colours.muted,
    });
  });

  fs.writeFileSync(outputPath, await pdf.save());
  console.log(outputPath);
}

buildPdf().catch((error) => {
  console.error(error);
  process.exit(1);
});
