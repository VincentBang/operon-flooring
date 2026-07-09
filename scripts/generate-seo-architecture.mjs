import fs from "node:fs";
import path from "node:path";

const root = path.resolve("apps/web");
const blogRoot = path.join(root, "blog");
const docsRoot = path.resolve("docs/seo");
const site = "https://operonflooring.com.au";
const gaId = "G-T2LEXZJM3Q";

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const write = (file, content) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content.trimStart().replace(/[ \t]+$/gm, ""), "utf8");
};
const esc = (value) => String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slugify = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const articleFor = (value) => /^[aeiou]/i.test(String(value || "")) ? "an" : "a";

const suburbData = [
  ["Edmondson Park", "growth corridor", "Newer family homes around Edmondson Park often need practical floors that can handle kids, pets and open-plan living. A clear quote should show the product category, measured area, removal and finishing details before anyone compares totals. Hybrid and laminate are common starting points because they balance durability, maintenance and budget, while engineered timber can suit feature areas where finish matters more.", ["Leppington", "Liverpool", "Campbelltown"]],
  ["Liverpool", "practical upgrades", "Liverpool flooring projects often range from unit refreshes to rental upgrades and family home replacements. The biggest quoting risk is comparing totals without knowing whether removal, disposal, underlay, stairs and trims are included. Operon helps structure the quote around the visible scope first, so hybrid, laminate or engineered timber can be reviewed alongside area and site details.", ["Edmondson Park", "Cabramatta", "Fairfield"]],
  ["Leppington", "growth corridor", "Leppington homeowners often want flooring that suits newer homes, expanding families and practical low-maintenance living. Quote clarity matters because large open areas, stairs, trims and product selection can shift the final number. Start with hybrid, laminate or engineered timber, then add measured area and site details so the project can be reviewed before final pricing.", ["Edmondson Park", "Camden", "Campbelltown"]],
  ["Camden", "larger family homes", "Camden flooring quotes often involve larger family homes, multiple living zones and a stronger interest in premium finishes. Engineered timber can be considered where the timber look is important, while hybrid and laminate may suit busy practical spaces. A useful quote should separate product, area, stairs, trims, removal and floor preparation so scope is clear before a final decision.", ["Leppington", "Campbelltown", "Castle Hill"]],
  ["Campbelltown", "practical upgrades", "Campbelltown flooring work often includes practical replacements, investment property refreshes and family home upgrades. Hybrid and laminate can suit value-focused projects, while engineered timber may be reviewed for selected rooms. The quote should make removal, disposal, underlay, trims, stairs and preparation visible so the total can be compared fairly.", ["Liverpool", "Camden", "Leppington"]],
  ["Parramatta", "apartment and investor work", "Parramatta flooring quotes often involve apartments, investor properties and busy renovation timelines. Acoustic underlay, lift access, parking and strata rules can affect the scope, so online estimates should be treated as a starting point. Operon helps structure product, area and access details before final pricing is confirmed.", ["Auburn", "Strathfield", "Ryde"]],
  ["Bankstown", "practical upgrades", "Bankstown flooring projects often focus on practical upgrades, replacement jobs and rental-ready finishes. Hybrid and laminate are useful starting categories when durability and budget control matter, while engineered timber may suit more finish-led spaces. A clear quote should list measured area, removal, disposal, underlay, stairs, trims and preparation before the price is compared.", ["Auburn", "Fairfield", "Cabramatta"]],
  ["Auburn", "practical upgrades", "Auburn flooring quotes can cover apartments, townhouses and investment properties where access, parking and product choice matter. A useful quote separates supply, installation, removal, underlay, trims and any site-sensitive items. Start with a product category and measured area, then use quote review if you already have a written flooring quote.", ["Parramatta", "Bankstown", "Strathfield"]],
  ["Fairfield", "practical upgrades", "Fairfield flooring work often includes replacement flooring, rental improvements and family home updates. Hybrid and laminate are common practical options, but final pricing still depends on removal, disposal, preparation, underlay and finishing items. Operon’s quote flow helps put those details into one place before final confirmation.", ["Liverpool", "Cabramatta", "Bankstown"]],
  ["Cabramatta", "practical upgrades", "Cabramatta flooring quotes often need careful scope because small differences in removal, disposal, trims or underlay can change the total. Hybrid and laminate can be practical for rental and family home upgrades, while engineered timber may suit rooms where finish is the priority. Quote review is useful when another written quote does not clearly list what is included.", ["Fairfield", "Liverpool", "Bankstown"]],
  ["Blacktown", "practical upgrades", "Blacktown flooring projects often include family homes, rental upgrades and practical replacement work. A quote becomes easier to compare when product, measured area, removal, disposal, underlay, stairs and trims are shown clearly. Start with hybrid, laminate or engineered timber, then upload a floor plan if area is uncertain.", ["Parramatta", "Castle Hill", "Baulkham Hills"]],
  ["Strathfield", "apartment and investor work", "Strathfield flooring quotes often involve apartments, investors and homes where access and acoustic details need attention. Product choice matters, but so do lift access, strata expectations, underlay and floor preparation. Operon’s process keeps the online estimate high-level until quote scope and site details are reviewed.", ["Burwood", "Auburn", "Parramatta"]],
  ["Burwood", "apartment and investor work", "Burwood flooring projects commonly involve apartments, investment properties and renovation work where access and acoustic requirements can shape the quote. Hybrid, laminate and engineered timber can each fit different priorities. The useful starting point is a clear area, product direction and written scope for removal, underlay, trims and site conditions.", ["Strathfield", "Auburn", "Parramatta"]],
  ["Ryde", "apartment and investor work", "Ryde flooring quotes often cover apartments, townhouses and family homes where product choice, access and underlay details affect the final scope. A quote should not rely on the total alone. Add measured area, removal, disposal, trims, stairs and parking or lift details so the project can be reviewed more clearly.", ["Parramatta", "Epping", "Strathfield"]],
  ["Epping", "larger family homes", "Epping flooring projects often include family homes, townhouses and premium renovation work. Engineered timber may be considered for a warmer timber look, while hybrid and laminate can suit lower-maintenance areas. Stairs, trims, skirting, subfloor preparation and product range should be visible before comparing quote totals.", ["Ryde", "Castle Hill", "Baulkham Hills"]],
  ["Castle Hill", "larger family homes", "Castle Hill flooring quotes often involve larger homes, stairs, multiple living areas and premium product decisions. Engineered timber can be part of the review where finish is important, while hybrid and laminate may suit practical family zones. Clear scope around stairs, trims, removal and subfloor preparation helps prevent confusion later.", ["Baulkham Hills", "Epping", "Blacktown"]],
  ["Baulkham Hills", "larger family homes", "Baulkham Hills flooring work often involves family homes where area, stairs and finishing details can meaningfully change the quote. Premium engineered timber, practical hybrid and laminate each have a place depending on use case. The quote should clearly separate product selection, removal, preparation, trims and site details before final pricing.", ["Castle Hill", "Blacktown", "Epping"]],
  ["Marrickville", "Inner West renovations", "Marrickville flooring quotes often involve older homes, apartments and Inner West renovations where subfloor condition can matter. Hybrid, laminate and engineered timber may all be considered, but preparation, levelling, trims and access should be reviewed carefully. A floor plan can help when room shapes are irregular or measurements are unclear.", ["Burwood", "Strathfield", "Randwick"]],
  ["Miranda", "Sutherland Shire upgrades", "Miranda flooring projects can include family homes, apartments and practical upgrades where product choice needs to match lifestyle and site access. Hybrid and laminate are useful low-maintenance options, while engineered timber can suit a more premium finish. Quote clarity comes from showing area, removal, underlay, trims, stairs and preparation.", ["Randwick", "Marrickville", "Bankstown"]],
  ["Randwick", "apartment and investor work", "Randwick flooring quotes often involve apartments, strata considerations and renovation work where acoustic underlay, access and parking can affect scope. Product selection is only one part of the quote. The area basis, removal, preparation, trims and site details should be clear before comparing totals.", ["Marrickville", "Burwood", "Miranda"]]
];

const suburbByName = Object.fromEntries(suburbData.map((item) => [item[0], item]));
const suburbPages = suburbData.map(([name]) => ({
  name,
  slug: `flooring-${slugify(name)}.html`
}));

const nav = (prefix = "") => `
  <header class="site-header">
    <div class="shell nav">
      <a class="brand" href="${prefix || "/"}#top" aria-label="Operon Flooring home"><span>Operon Flooring</span></a>
      <nav class="nav-links" aria-label="Primary">
        <a href="${prefix || "/"}#top">Home</a>
        <a href="${prefix}quote.html">Quote</a>
        <a href="${prefix}products.html">Flooring Products</a>
        <a href="${prefix}floorplan.html">Floor Plan</a>
        <a href="${prefix}blog/">Guides</a>
      </nav>
      <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <div class="header-actions"><a class="button header-quote-button" href="${prefix}quote.html">Start quote</a></div>
    </div>
  </header>`;

const footer = (prefix = "") => `
  <footer class="site-footer footer-contained">
    <div class="container footer-grid">
      <div class="footer-col footer-brand-block">
        <a class="footer-logo" href="${prefix || "/"}" aria-label="Operon Flooring home"><img src="${prefix}assets/operon-logo-final.png" alt="Operon Flooring logo" width="154" height="49"></a>
        <p class="footer-brand-copy">Sydney flooring quotes, quote review and floor plan measurement support.</p>
        <a class="footer-brand-cta" href="${prefix}quote.html">Start quote</a>
      </div>
      <div class="footer-col"><h4>Products</h4><ul>
        <li><a href="${prefix}hybrid-flooring-sydney.html">Hybrid Flooring Sydney</a></li>
        <li><a href="${prefix}laminate-flooring-sydney.html">Laminate Flooring Sydney</a></li>
        <li><a href="${prefix}engineered-timber-flooring-sydney.html">Engineered Timber Flooring Sydney</a></li>
        <li><a href="${prefix}products.html">Flooring Products</a></li>
      </ul></div>
      <div class="footer-col"><h4>Quote &amp; Tools</h4><ul>
        <li><a href="${prefix}quote.html">Start Quote</a></li>
        <li><a href="${prefix}quote-review.html">Quote Review</a></li>
        <li><a href="${prefix}floorplan.html">Upload Floor Plan</a></li>
        <li><a href="${prefix}flooring-quote-sydney.html">Flooring Quote Sydney</a></li>
      </ul></div>
      <div class="footer-col"><h4>Locations</h4><ul>
        <li><a href="${prefix}flooring-parramatta.html">Parramatta</a></li>
        <li><a href="${prefix}flooring-liverpool.html">Liverpool</a></li>
        <li><a href="${prefix}flooring-bankstown.html">Bankstown</a></li>
        <li><a href="${prefix}flooring-castle-hill.html">Castle Hill</a></li>
        <li><a href="${prefix}flooring-randwick.html">Randwick</a></li>
      </ul></div>
      <div class="footer-col"><h4>Company</h4><ul>
        <li><a href="${prefix}contact.html">Contact</a></li>
        <li><a href="${prefix}privacy-policy.html">Privacy Policy</a></li>
        <li><a href="${prefix}terms.html">Terms</a></li>
      </ul></div>
    </div>
    <div class="container footer-bottom"><p>&copy; 2026 Operon Flooring</p><div class="footer-legal"><a href="${prefix}privacy-policy.html">Privacy Policy</a><a href="${prefix}terms.html">Terms</a></div></div>
  </footer>`;

const scripts = (prefix = "") => `
  <script src="${prefix}tracking.js"></script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  </script>
  <script src="${prefix}mobile-nav.js"></script>
  <script src="${prefix}chatbot/chatbotBootstrap.js"></script>
  <script>
    window.OperonChatbotBootstrap && window.OperonChatbotBootstrap.mount({ pageKey: "seo", openOnInit: false });
  </script>`;

const head = ({ title, description, canonical, prefix = "", schema = "" }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${site}/${canonical}">
  <link rel="icon" href="${prefix}assets/Operon favicon.png" type="image/png">
  <meta name="robots" content="index,follow">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${site}/${canonical}">
  <meta property="og:image" content="${site}/assets/operon-social-preview.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${site}/assets/operon-social-preview.png">
  <link rel="stylesheet" href="${prefix}seo-pages.css">
  ${schema}
  ${scripts(prefix)}
</head>`;

const breadcrumbHtml = (items, prefix = "") => `
  <nav class="breadcrumbs" aria-label="Breadcrumb">
    ${items.map((item, index) => index === items.length - 1 ? `<span>${esc(item.label)}</span>` : `<a href="${prefix}${item.href}">${esc(item.label)}</a>`).join("<span>/</span>")}
  </nav>`;

const jsonLd = (data) => `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;

const faqHtml = (faqs) => `
  <section class="section">
    <div class="shell">
      <article class="section-card">
        <span class="eyebrow">FAQs</span>
        <h2>Questions people ask before quoting</h2>
        <div class="faq" style="margin-top: 22px;">
          ${faqs.map((faq, index) => `<details${index === 0 ? " open" : ""}><summary>${esc(faq.q)}</summary><p>${esc(faq.a)}</p></details>`).join("\n")}
        </div>
      </article>
    </div>
  </section>`;

const page = ({ title, description, canonical, h1, eyebrow, intro, sections, ctaText = "Start flooring quote", ctaHref = "quote.html", schema, prefix = "" }) => `${head({ title, description, canonical, prefix, schema })}
<body>
${nav(prefix)}
<main>
  <section class="hero">
    <div class="shell">
      <article class="hero-card">
        ${breadcrumbHtml([{ label: "Home", href: "index.html" }, { label: h1, href: canonical }], prefix)}
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h1>${esc(h1)}</h1>
        <p>${esc(intro)}</p>
        <div class="hero-actions" style="margin-top: 24px;">
          <a class="button" href="${prefix}${ctaHref}" data-track-cta="${ctaHref.includes("quote") ? "guide_to_quote_click" : "click_seo_primary"}">${esc(ctaText)}</a>
          ${ctaHref.includes("quote-review") ? `<a class="button-secondary" href="${prefix}quote.html">Start a structured flooring quote</a>` : `<a class="button-secondary" href="${prefix}quote-review.html">Check an existing flooring quote</a>`}
          <a class="button-quiet" href="${prefix}floorplan.html">Upload a floor plan</a>
        </div>
      </article>
    </div>
  </section>
  ${sections.join("\n")}
</main>
${footer(prefix)}
</body>
</html>`;

const cardSection = (eyebrow, h2, paragraphs, cards = []) => `
  <section class="section">
    <div class="shell">
      <article class="section-card">
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2>${esc(h2)}</h2>
        ${paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n")}
        ${cards.length ? `<div class="link-grid" style="margin-top: 22px;">${cards.map((card) => `<a class="link-card" href="${card.href}"><strong>${esc(card.title)}</strong><span>${esc(card.text)}</span></a>`).join("\n")}</div>` : ""}
      </article>
    </div>
  </section>`;

const listSection = (eyebrow, h2, items) => `
  <section class="section">
    <div class="shell">
      <article class="section-card">
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2>${esc(h2)}</h2>
        <div class="link-grid" style="margin-top: 22px;">
          ${items.map((item) => `<div class="link-card"><strong>${esc(item.title)}</strong><span>${esc(item.text)}</span></div>`).join("\n")}
        </div>
      </article>
    </div>
  </section>`;

const serviceSchema = ({ name, canonical, faqs, breadcrumbName }) => jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${site}/${canonical}#service`,
      name,
      serviceType: name,
      provider: { "@type": "LocalBusiness", name: "Operon Flooring", url: site },
      areaServed: { "@type": "City", name: "Sydney" }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
        { "@type": "ListItem", position: 2, name: breadcrumbName || name, item: `${site}/${canonical}` }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } }))
    }
  ]
});

const guideSchema = ({ title, canonical, description, faqs }) => jsonLd({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: title,
      description,
      author: { "@type": "Organization", name: "Operon Flooring" },
      publisher: { "@type": "Organization", name: "Operon Flooring", logo: { "@type": "ImageObject", url: `${site}/assets/operon-logo-final.png` } },
      mainEntityOfPage: `${site}/${canonical}`
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site}/blog/` },
        { "@type": "ListItem", position: 3, name: title, item: `${site}/${canonical}` }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.q, acceptedAnswer: { "@type": "Answer", text: faq.a } }))
    }
  ]
});

const commonFaqs = (topic) => [
  { q: "Can I get a quote before a site visit?", a: "Yes. The online quote is a starting estimate based on visible product, area and scope details. Final pricing is confirmed after review of site-sensitive items." },
  { q: "Can I upload a floor plan?", a: "Yes. The floor plan tool can help estimate the flooring area when manual measurements are unclear or inconvenient." },
  { q: "What affects the final flooring price?", a: "Measured area, product range, removal, disposal, underlay, floor preparation, stairs, trims, access and site conditions can all affect the final quote." },
  { q: "Can Operon review an existing written quote?", a: "Yes. The quote review page checks whether product, area, inclusions, exclusions and site-sensitive items are clear enough to compare." }
];

const corePages = [
  {
    file: "flooring-quote-sydney.html",
    title: "Flooring Quote Sydney | Hybrid, Laminate & Timber Estimates",
    description: "Start a Sydney flooring quote for hybrid, laminate or engineered timber. Add product, area, removal, stairs, trims and site details before final pricing.",
    h1: "Flooring quote Sydney",
    eyebrow: "Sydney flooring quote",
    intro: "Start with product direction, measured area and visible scope. The online quote helps organise the details before final pricing is confirmed.",
    ctaText: "Start flooring quote",
    sections: [
      cardSection("Clearer quote", "Start a clearer flooring quote", ["A useful flooring quote is more than a headline total. It should show the product direction, area basis, removal, disposal, underlay, trims, stairs and site notes that can change the final scope."], [
        { href: "quote.html", title: "Start the quote flow", text: "Add area, product, removal, stairs, trims and site details." },
        { href: "quote-review.html", title: "Already have a quote?", text: "Check whether a written quote is complete enough to compare." },
        { href: "floorplan.html", title: "Use a floor plan", text: "Upload a plan and trace rooms if measurement is unclear." }
      ]),
      listSection("Cost factors", "What affects flooring price", [
        { title: "Product", text: "Hybrid, laminate and engineered timber ranges can change the supply and installation path." },
        { title: "Area", text: "Total square metres, waste allowance and room layout affect the estimate." },
        { title: "Scope", text: "Removal, disposal, prep, underlay, trims, stairs and access should be visible before comparing quotes." }
      ]),
      cardSection("Quote paths", "Product, area and scope", ["Start with the closest category if you are unsure. Final range and colour can be reviewed later where the product path allows it."], [
        { href: "hybrid-flooring-sydney.html", title: "Hybrid flooring quote", text: "Practical low-maintenance option for many Sydney homes." },
        { href: "laminate-flooring-sydney.html", title: "Laminate flooring quote", text: "Cost-conscious path for dry internal spaces." },
        { href: "engineered-timber-flooring-sydney.html", title: "Engineered timber quote", text: "Premium timber feel with more product and install detail." }
      ])
    ]
  },
  {
    file: "hybrid-flooring-sydney.html",
    title: "Hybrid Flooring Sydney | Quote & Installation",
    description: "Start a hybrid flooring quote in Sydney. Compare product range, area, underlay, trims, removal, stairs and apartment considerations before final pricing.",
    h1: "Hybrid flooring Sydney",
    eyebrow: "Hybrid flooring",
    intro: "Hybrid flooring is a practical option for many Sydney homes and apartments where low maintenance and water resistance matter.",
    ctaText: "Start a hybrid flooring quote",
    ctaHref: "quote.html?from=seo&category=hybrid",
    sections: [
      cardSection("Use cases", "Hybrid flooring for Sydney homes and apartments", ["Hybrid can suit family homes, apartments and investment properties, especially where easy cleaning and everyday durability matter. Suitability still depends on the chosen range, subfloor and site conditions."], [
        { href: "products.html?category=hybrid", title: "Browse hybrid products", text: "Choose a product direction before continuing to quote." },
        { href: "apartment-flooring-sydney.html", title: "Apartment flooring", text: "Review acoustic and access considerations before final pricing." }
      ]),
      listSection("Quote factors", "What affects a hybrid flooring quote", [
        { title: "Product thickness and range", text: "Thickness, wear layer and attached backing can affect suitability and quote context." },
        { title: "Underlay and acoustic layer", text: "Apartments may need acoustic review; do not assume compliance without checking building requirements." },
        { title: "Removal, trims and stairs", text: "Existing flooring removal, disposal, transitions, scotia and stair nosing should be listed clearly." }
      ])
    ]
  },
  {
    file: "laminate-flooring-sydney.html",
    title: "Laminate Flooring Sydney | Quote & Installation",
    description: "Start a laminate flooring quote in Sydney for dry internal spaces. Add area, removal, underlay, trims and preparation before final pricing.",
    h1: "Laminate flooring Sydney",
    eyebrow: "Laminate flooring",
    intro: "Laminate flooring can be a strong value path for dry internal spaces, rental upgrades and budget-conscious renovations.",
    ctaText: "Start a laminate flooring quote",
    ctaHref: "quote.html?from=seo&category=laminate",
    sections: [
      cardSection("Use cases", "Laminate flooring for dry internal spaces", ["Laminate is usually considered where a timber-look finish and cost control matter more than wet-area suitability. Product quality, underlay and subfloor preparation still influence the finished result."], [
        { href: "products.html?category=laminate", title: "Browse laminate products", text: "Compare ranges before starting the quote." },
        { href: "blog/hybrid-vs-laminate-flooring.html", title: "Hybrid vs laminate", text: "Compare product tradeoffs before choosing a quote path." }
      ]),
      listSection("Quote factors", "What affects a laminate flooring quote", [
        { title: "Area and layout", text: "Measured area, room shape and wastage affect the quote basis." },
        { title: "Underlay and preparation", text: "Underlay, levelling and subfloor condition can affect installation scope." },
        { title: "Removal and finishing", text: "Removal, disposal, trims, scotia, skirting and door trimming should be visible." }
      ])
    ]
  },
  {
    file: "engineered-timber-flooring-sydney.html",
    title: "Engineered Timber Flooring Sydney | Quote & Installation",
    description: "Start an engineered timber flooring quote in Sydney. Review range, colour, installation method, feature patterns, area and site scope before final pricing.",
    h1: "Engineered timber flooring Sydney",
    eyebrow: "Engineered timber",
    intro: "Engineered timber is a premium finish-led option where product range, colour and installation method matter more to the final quote.",
    ctaText: "Start an engineered timber quote",
    ctaHref: "quote.html?from=seo&category=engineered",
    sections: [
      cardSection("Premium finish", "Premium timber look for Sydney renovations", ["Engineered timber can suit feature areas, higher-spec renovations and homes where a real timber feel is important. The quote should confirm range, colour, installation method and site-sensitive preparation."], [
        { href: "products.html?category=engineered", title: "Browse engineered timber", text: "Choose a range direction before starting the quote." },
        { href: "blog/laminate-vs-engineered-timber.html", title: "Laminate vs engineered timber", text: "Compare finish, durability and quote impact." }
      ]),
      listSection("Install review", "Installation method and feature patterns", [
        { title: "Floating vs direct-stick", text: "Installation method depends on product, subfloor and project requirements." },
        { title: "Herringbone or feature patterns", text: "Patterned installation usually needs more detail before final pricing." },
        { title: "Stairs and trims", text: "Stair nosing, skirting, scotia and transitions should be clearly scoped." }
      ])
    ]
  },
  {
    file: "flooring-installation-cost-sydney.html",
    title: "Flooring Installation Cost Sydney | What Changes the Price",
    description: "Understand Sydney flooring installation cost factors including area, product, removal, disposal, prep, underlay, stairs, trims and apartment access.",
    h1: "Flooring installation cost Sydney",
    eyebrow: "Cost factors",
    intro: "Flooring installation cost changes with scope. This guide explains the factors that affect price without pretending an online estimate is a final fixed quote.",
    ctaText: "Start quote",
    sections: [
      listSection("Cost drivers", "Cost factors, not fake fixed rates", [
        { title: "Area", text: "Square metres, waste allowance and room complexity affect the base estimate." },
        { title: "Product", text: "Hybrid, laminate and engineered timber ranges have different quote paths." },
        { title: "Removal and disposal", text: "Lift-up and take-away should be separated so the scope is clear." },
        { title: "Floor preparation", text: "Levelling, patching, grinding or moisture review may be confirmed after inspection." },
        { title: "Underlay and acoustic needs", text: "Apartments and selected products may require acoustic or underlay review." },
        { title: "Stairs and trims", text: "Stairs, nosing, scotia, skirting, door trims and transitions change the final scope." }
      ]),
      cardSection("Estimate context", "Why the online estimate is a starting point", ["The quote tool helps collect the information that affects price. Final pricing still depends on actual product, measured area and site-sensitive details."], [
        { href: "quote.html", title: "Start a structured flooring quote", text: "Add the cost drivers in one quote flow." },
        { href: "quote-review.html", title: "Review another quote", text: "Check whether a written quote lists the cost drivers clearly." }
      ])
    ]
  },
  {
    file: "apartment-flooring-sydney.html",
    title: "Apartment Flooring Sydney | Quote, Underlay & Installation Scope",
    description: "Start an apartment flooring quote in Sydney with product, area, acoustic underlay, lift access, parking, floor plan and quote review support.",
    h1: "Apartment flooring Sydney",
    eyebrow: "Apartment flooring",
    intro: "Apartment flooring quotes need more than product selection. Acoustic underlay, lift access, parking, strata considerations and measured area can all affect the final scope.",
    ctaText: "Start apartment flooring quote",
    sections: [
      listSection("Apartment scope", "Apartment flooring quote support", [
        { title: "Acoustic underlay", text: "Acoustic requirements depend on the building, product and strata expectations." },
        { title: "Lift, access and parking", text: "Delivery, lift bookings, parking and site access should be considered before final confirmation." },
        { title: "Product choice", text: "Hybrid, laminate and engineered timber each have different suitability and quote implications." },
        { title: "Floor plan upload", text: "A plan can help estimate apartment area when manual measuring is difficult." }
      ]),
      cardSection("Review", "Quote review for apartment flooring", ["If you already have a written apartment flooring quote, check whether acoustic, access, removal, trims and preparation are listed clearly."], [
        { href: "quote-review.html", title: "Check an apartment flooring quote", text: "Review completeness before comparing total price." },
        { href: "floorplan.html", title: "Upload floor plan", text: "Trace apartment rooms for a clearer starting area." }
      ])
    ]
  }
];

for (const pageData of corePages) {
  const faqs = commonFaqs(pageData.h1.toLowerCase());
  const schema = serviceSchema({ name: pageData.h1, canonical: pageData.file, faqs, breadcrumbName: pageData.h1 });
  write(path.join(root, pageData.file), page({ ...pageData, canonical: pageData.file, schema, sections: [...pageData.sections, faqHtml(faqs)] }));
}

const localAngleText = {
  "growth corridor": "newer homes, family spaces and practical hybrid or laminate choices",
  "practical upgrades": "replacement jobs, rental updates and value-focused flooring decisions",
  "apartment and investor work": "apartments, access, acoustic underlay and investor quote clarity",
  "larger family homes": "larger areas, stairs, trims and premium product decisions",
  "Inner West renovations": "older homes, apartments, subfloor preparation and Inner West renovation details",
  "Sutherland Shire upgrades": "family upgrades, apartments and practical product choice"
};

for (const [name, angle, intro, near] of suburbData) {
  const slug = `flooring-${slugify(name)}.html`;
  const faqs = [
    { q: `Do you install hybrid flooring in ${name}?`, a: `Hybrid flooring can be quoted for ${name} homes and apartments where the product and site conditions are suitable.` },
    { q: "Can I get a quote before a site visit?", a: "Yes. The online quote gives a starting estimate using product, area and visible scope. Final pricing is confirmed after review." },
    { q: "Can I upload a floor plan?", a: "Yes. Uploading a floor plan can help estimate area when room measurements are unclear." },
    { q: "What affects final flooring price?", a: "Measured area, product range, removal, disposal, underlay, preparation, stairs, trims, access and site conditions can affect final pricing." },
    { q: "Can you review an existing quote?", a: "Yes. The quote review checks whether product, area, removal, stairs, trims and site conditions are clearly listed." }
  ];
  const sections = [
    cardSection(`${name} flooring`, `Flooring quote support in ${name}`, [`For ${name}, the quote should reflect ${localAngleText[angle]}. That means the written scope needs to show more than the flooring category; it should also explain the area basis, removal, underlay, trims, stairs and any site-sensitive items.`, "The aim is not to promise a final fixed online price, but to collect enough scope for a useful starting estimate."], [
      { href: "quote.html", title: `Start ${articleFor(name)} ${name} flooring quote`, text: "Add product, area, removal, stairs and site details." },
      { href: "quote-review.html", title: "Check an existing flooring quote", text: "Review whether written scope is complete enough to compare." },
      { href: "floorplan.html", title: "Upload a floor plan", text: "Trace rooms to create a clearer starting area." }
    ]),
    listSection("Services", `Flooring services for ${name}`, [
      { title: "Hybrid flooring", text: "Practical low-maintenance flooring for suitable homes, units and renovations." },
      { title: "Laminate flooring", text: "Budget-conscious timber-look flooring for dry internal spaces." },
      { title: "Engineered timber", text: "Premium timber-look option where range, colour and installation method need review." },
      { title: "Supply and install", text: "Product and installation scope can be reviewed together." },
      { title: "Installation-only", text: "Installation-only may be reviewed where product details and site scope are clear." },
      { title: "Quote review and measurement", text: "Upload a quote or floor plan to clarify scope before final pricing." }
    ]),
    listSection(`Quote factors in ${name}`, `What affects a flooring quote in ${name}`, [
      { title: "Measured area", text: "Room area, waste allowance and layout shape affect the starting estimate." },
      { title: "Product category", text: "Hybrid, laminate and engineered timber have different quote paths." },
      { title: "Removal and disposal", text: "Existing flooring lift-up and take-away should be written clearly." },
      { title: "Underlay and acoustic", text: "Apartment, product or building requirements may need review." },
      { title: "Floor preparation", text: "Levelling, patching, grinding or moisture checks can change final scope." },
      { title: "Stairs and trims", text: "Stair nosing, scotia, skirting, trims and door adjustments should be listed." },
      { title: "Access and parking", text: "Apartment access, lifts, parking and delivery conditions can affect planning." }
    ]),
    cardSection("Next flooring resources", "Useful next pages", ["Use these pages to compare products, check written scope or start the quote with better information."], [
      { href: "products.html", title: "Browse flooring products", text: "Choose a category, range or product direction." },
      { href: "hybrid-flooring-sydney.html", title: "Hybrid flooring Sydney", text: "Review hybrid quote considerations." },
      { href: "laminate-flooring-sydney.html", title: "Laminate flooring Sydney", text: "Review laminate quote considerations." },
      { href: "engineered-timber-flooring-sydney.html", title: "Engineered timber Sydney", text: "Review engineered timber quote considerations." },
      ...near.map((nearName) => ({ href: `flooring-${slugify(nearName)}.html`, title: `Flooring ${nearName}`, text: `Nearby flooring quote support for ${nearName}.` }))
    ]),
    faqHtml(faqs)
  ];
  const schema = serviceSchema({ name: `Flooring ${name}`, canonical: slug, faqs, breadcrumbName: `Flooring ${name}` });
  write(path.join(root, slug), page({
    title: `Flooring ${name} | Hybrid, Laminate & Timber Quotes`,
    description: `Start a flooring quote in ${name} for hybrid, laminate or engineered timber. Add area, removal, stairs, trims and floor plan details before final pricing.`,
    canonical: slug,
    h1: `Flooring quote and installation in ${name}`,
    eyebrow: `${name} flooring`,
    intro,
    ctaText: `Start ${articleFor(name)} ${name} flooring quote`,
    ctaHref: "quote.html",
    schema,
    sections
  }).replace(/data-track-cta="guide_to_quote_click"/, 'data-track-cta="suburb_page_quote_click"'));
}

const guidePages = [
  ["why-flooring-quotes-vary.html", "Why Do Flooring Quotes Vary?", "why do flooring quotes vary", ["product differences", "area basis", "removal and disposal", "underlay", "floor preparation", "stairs", "trims, scotia and skirting", "site access", "quote comparison checklist"], "Quote totals vary because the written scope varies. The useful question is not only the total, but what the total includes."],
  ["hidden-flooring-costs.html", "Hidden Flooring Costs to Check Before You Accept", "hidden flooring costs", ["removal", "disposal", "subfloor preparation", "moisture protection", "levelling", "trims", "door trimming", "stairs", "apartment access"], "Hidden costs are usually scope items that were not written clearly at the start."],
  ["hybrid-vs-laminate-flooring.html", "Hybrid vs Laminate Flooring", "hybrid vs laminate flooring", ["durability", "water resistance", "cost", "apartment suitability", "maintenance", "quote impact"], "Hybrid and laminate can both be useful, but they solve different problems."],
  ["laminate-vs-engineered-timber.html", "Laminate vs Engineered Timber Flooring", "laminate vs engineered timber", ["finish", "cost", "durability", "installation method", "maintenance", "quote impact"], "Laminate is usually the value path; engineered timber is more finish-led and can require more installation detail."],
  ["scotia-vs-skirting.html", "Scotia vs Skirting for Flooring", "scotia vs skirting flooring", ["what scotia does", "what skirting does", "appearance", "cost impact", "when to confirm", "quote wording"], "Scotia and skirting decisions affect finish, labour and expectations."],
  ["apartment-flooring-acoustic-underlay.html", "Apartment Flooring and Acoustic Underlay", "apartment flooring acoustic underlay", ["why acoustic underlay matters", "strata considerations", "product compatibility", "floor plan area", "access and parking", "quote wording"], "Apartment flooring quotes should treat acoustic and access requirements as scope items, not assumptions."],
  ["floor-preparation-costs.html", "Floor Preparation and Flooring Cost", "floor preparation flooring cost", ["subfloor condition", "levelling", "grinding", "patching", "moisture checks", "when it is confirmed"], "Floor preparation can change final pricing because it depends on the actual subfloor condition."],
  ["flooring-stairs-and-stair-nosing.html", "Flooring Stairs and Stair Nosing", "stair nosing flooring", ["why stairs are separate", "straight steps", "triangle steps", "landings", "stair nosing", "quote wording"], "Stairs need clear quantities and wording so there is no argument about what was allowed."],
];

const topicNotes = {
  "product differences": "Confirm the exact category, range, thickness and colour direction before comparing one total with another.",
  "area basis": "Check whether the quote uses measured area, estimated area, waste allowance or a rounded project total.",
  "removal and disposal": "Removal can be included while disposal is excluded, so both should be written separately.",
  "underlay": "Underlay can affect comfort, product suitability and apartment requirements.",
  "floor preparation": "Levelling, patching, grinding and moisture review are often confirmed after the subfloor is inspected.",
  "stairs": "Step quantity, stair type and nosing should be clear because stairs are not priced like open floor area.",
  "trims, scotia and skirting": "Finishing details affect labour, appearance and whether edges are covered cleanly.",
  "site access": "Parking, lifts, stairs, apartment rules and occupied-home conditions can affect installation planning.",
  "quote comparison checklist": "Compare written inclusions before comparing the headline total.",
  "removal": "Ask whether existing floor lift-up is included and what flooring type is being removed.",
  "disposal": "Confirm take-away, dumping fees and site clean-up wording separately from removal labour.",
  "subfloor preparation": "Subfloor work can be hard to know online, so quotes should say what is allowed and what is subject to inspection.",
  "moisture protection": "Moisture checks or protection may matter on concrete or site-sensitive subfloors.",
  "levelling": "Uneven floors can change installation scope and should not be assumed away.",
  "trims": "Transition trims and edge finishing should be visible in the written scope.",
  "door trimming": "Door trimming is a small line item that can cause argument if it is not written down.",
  "apartment access": "Apartment jobs may need lift, loading, parking and strata timing considered.",
  "durability": "Durability depends on product construction, wear surface and the way the space is used.",
  "water resistance": "Water resistance is product-specific and should not be treated as unlimited waterproofing.",
  "cost": "Cost changes with product range, area, prep, trims and project complexity.",
  "apartment suitability": "Apartment suitability depends on product, acoustic layer and building expectations.",
  "maintenance": "Maintenance expectations should match product category and household use.",
  "quote impact": "The selected category changes what information is needed for a useful quote.",
  "finish": "Finish expectations differ sharply between laminate visuals and engineered timber veneer.",
  "installation method": "Installation method can affect labour, underlay, adhesive and preparation requirements.",
  "what scotia does": "Scotia covers expansion gaps when skirting is not removed or replaced.",
  "what skirting does": "Skirting can create a cleaner finish but may involve more labour and wall-edge work.",
  "appearance": "The visual result differs, so it should be agreed before installation.",
  "cost impact": "Small finishing choices can still change labour and materials.",
  "when to confirm": "Confirm the finishing method before accepting the quote, not after installation starts.",
  "quote wording": "Ask for the item to be written clearly so expectations are shared.",
  "why acoustic underlay matters": "Acoustic underlay can be part of apartment requirements and comfort expectations.",
  "strata considerations": "Strata requirements may need documents or product details before approval.",
  "product compatibility": "Not every product and underlay combination is suitable.",
  "floor plan area": "A floor plan can help estimate apartment area before site review.",
  "access and parking": "Lift bookings and parking constraints should be known early.",
  "subfloor condition": "Subfloor condition is one of the most common unknowns before inspection.",
  "grinding": "Grinding may be needed where high spots affect installation suitability.",
  "patching": "Patching can be required where old flooring leaves uneven areas.",
  "moisture checks": "Moisture checks help identify site-sensitive risk before installation.",
  "when it is confirmed": "Preparation scope is often confirmed after inspection or clearer photos.",
  "why stairs are separate": "Stairs need separate counting because labour and nosing differ from flat flooring.",
  "straight steps": "Straight steps should be counted separately from winders or triangle steps.",
  "triangle steps": "Triangle steps need explicit allowance because they can take longer to install.",
  "landings": "Landings may be counted as area or stair-related scope depending on quote method.",
  "stair nosing": "Nosing product, colour and quantity should be clearly included or excluded."
};

for (const [file, title, target, topics, intro] of guidePages) {
  const canonical = `blog/${file}`;
  const faqs = [
    { q: "Why does this matter before quoting?", a: "It helps separate product choice from installation scope, so totals can be compared with fewer assumptions." },
    { q: "Should I use the quote review tool?", a: "Yes, if you already have a written quote and want to check whether the inclusions are clear." },
    { q: "Can I still start a quote if I am unsure?", a: "Yes. Start with the closest product category and add area and scope details. Final details can be reviewed later." }
  ];
  const sections = [
    cardSection("Guide", title, [intro, "Use this guide as a checklist before comparing totals or starting a new quote."], topics.map((topic) => ({ href: "../quote-review.html", title: topic[0].toUpperCase() + topic.slice(1), text: topicNotes[topic] || "Confirm whether this item is included, excluded or still subject to review." }))),
    cardSection("Next step", "Turn the guide into a clearer quote", ["If the written quote does not clearly list these items, use quote review before comparing price. If you are starting fresh, use the structured quote flow."], [
      { href: "../quote-review.html", title: "Check an existing flooring quote", text: "Review product, area and scope completeness." },
      { href: "../quote.html", title: "Start a flooring quote", text: "Add area, product and site details." },
      { href: "../products.html", title: "Browse flooring products", text: "Choose a category or range before quoting." },
      { href: "../flooring-parramatta.html", title: "Flooring Parramatta", text: "Example suburb quote page." },
      { href: "../flooring-liverpool.html", title: "Flooring Liverpool", text: "Example suburb quote page." }
    ]),
    faqHtml(faqs).replaceAll('href="', 'href="../')
  ];
  const html = page({
    title: `${title} | Operon Flooring Guide`,
    description: `Practical guide to ${target}, including product, area, scope and quote comparison details before final flooring pricing.`,
    canonical,
    h1: title,
    eyebrow: "Flooring guide",
    intro,
    ctaText: "Check an existing flooring quote",
    ctaHref: "quote-review.html",
    schema: guideSchema({ title, canonical, description: intro, faqs }),
    prefix: "../",
    sections
  }).replace(/data-track-cta="guide_to_quote_click"/g, 'data-track-cta="guide_to_quote_click"');
  write(path.join(blogRoot, file), html);
}

const blogIndexCards = guidePages.map(([file, title, target]) => ({ href: file, title, text: `Guide target: ${target}.` }));
write(path.join(blogRoot, "index.html"), page({
  title: "Flooring Guides Sydney | Quote, Cost & Product Comparison",
  description: "Read practical Sydney flooring guides about quote comparison, hidden costs, hybrid vs laminate, engineered timber, acoustic underlay, floor prep and stairs.",
  canonical: "blog/",
  h1: "Flooring guides for clearer quotes",
  eyebrow: "Sydney flooring guides",
  intro: "Use these guides to understand product choices, hidden scope items and quote comparison before starting a flooring estimate.",
  ctaText: "Start quote",
  ctaHref: "quote.html",
  prefix: "../",
  schema: guideSchema({ title: "Flooring Guides Sydney", canonical: "blog/", description: "Sydney flooring quote and product guides.", faqs: commonFaqs("flooring guide") }),
  sections: [
    cardSection("Guide cluster", "Quote comparison and scope guides", ["Start with the guide that matches the question you are trying to answer before requesting pricing."], blogIndexCards),
    cardSection("Money pages", "Move from learning to quoting", ["When you know enough to proceed, use the quote, floor plan or quote review tools."], [
      { href: "../flooring-quote-sydney.html", title: "Flooring quote Sydney", text: "Start a structured quote." },
      { href: "../quote-review.html", title: "Quote review", text: "Check a written quote." },
      { href: "../floorplan.html", title: "Floor plan measurement", text: "Upload and trace rooms." },
      { href: "../products.html", title: "Product catalogue", text: "Choose a product direction." }
    ])
  ]
}));

const keywordRows = [
  ["flooring quote Sydney", "flooring-quote-sydney.html", "quote", "high"],
  ["flooring installation Sydney", "flooring-installation-cost-sydney.html", "service", "high"],
  ["hybrid flooring Sydney", "hybrid-flooring-sydney.html", "service", "high"],
  ["laminate flooring Sydney", "laminate-flooring-sydney.html", "service", "high"],
  ["engineered timber flooring Sydney", "engineered-timber-flooring-sydney.html", "service", "high"],
  ["flooring installation cost Sydney", "flooring-installation-cost-sydney.html", "cost research", "high"],
  ["flooring quote review", "quote-review.html", "utility", "high"],
  ["flooring quote comparison", "quote-review.html", "utility", "high"],
  ["hidden flooring costs", "blog/hidden-flooring-costs.html", "guide", "medium"],
  ["why flooring quotes vary", "blog/why-flooring-quotes-vary.html", "guide", "medium"],
  ["floor plan flooring quote", "floorplan.html", "utility", "high"],
  ["apartment flooring Sydney", "apartment-flooring-sydney.html", "service", "high"],
  ["acoustic underlay apartment flooring", "blog/apartment-flooring-acoustic-underlay.html", "guide", "medium"],
  ...suburbPages.map((page) => [`flooring ${page.name}`, page.slug, "local service", "medium"]),
  ...suburbPages.map((page) => [`flooring quote ${page.name}`, page.slug, "local quote", "high"])
];
write(path.join(root, "seo-keyword-plan.csv"), "keyword,page_target,intent,priority,exact_monthly_searches,competition,top_of_page_bid_low,top_of_page_bid_high,notes\n" + keywordRows.map((row) => [...row, "", "", "", "", ""].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n") + "\n");

write(path.join(docsRoot, "SEO_MEASUREMENT_PLAN.md"), `# Operon Flooring SEO Measurement Plan

## Setup
- Verify https://operonflooring.com.au in Google Search Console.
- Submit https://operonflooring.com.au/sitemap.xml after deployment.
- Confirm GA4 property ${gaId} is firing once per page.
- Keep quote, quote review, floor plan and product-selection events free of personal data.

## GA4 Events To Monitor
- quote_started
- quote_submitted
- quote_review_started
- quote_review_generated
- floorplan_file_uploaded
- floorplan_area_sent_to_quote
- product_continue_to_quote
- suburb_page_quote_click
- guide_to_quote_click
- phone_click
- email_click

## Target Pages
- flooring-quote-sydney.html
- hybrid-flooring-sydney.html
- laminate-flooring-sydney.html
- engineered-timber-flooring-sydney.html
- flooring-installation-cost-sydney.html
- apartment-flooring-sydney.html
- quote-review.html
- floorplan.html
- products.html
- 20 suburb pages
- quote comparison and scope guide pages

## Target Query Groups
- Flooring quote Sydney
- Hybrid flooring Sydney
- Laminate flooring Sydney
- Engineered timber flooring Sydney
- Flooring installation cost Sydney
- Flooring quote review / comparison
- Apartment flooring Sydney / acoustic underlay
- Suburb flooring quote combinations

## Monthly Review Process
1. Export Search Console page and query performance.
2. Review impressions, clicks, CTR and average position.
3. Compare landing-page sessions with quote starts, quote submissions, quote review uploads and floor plan usage.
4. Check suburb-page quote clicks and guide-to-quote clicks.
5. Note won jobs later if CRM/job tracking is connected.
6. Refresh pages with real missing-scope questions, not generic keyword filler.

## Kill / Keep Rules For Suburb Pages
- Keep pages with growing impressions, clicks, quote starts or quote-review usage.
- Improve pages with impressions but low CTR by testing title/meta and stronger local intro.
- Improve pages with clicks but no quote actions by tightening CTAs and internal links.
- Consider noindex or consolidation only if a page has no impressions, no clicks and no conversion assist after sustained review.

## Conversion Metrics
- Impressions
- Clicks
- CTR
- Average position
- Quote starts
- Quote submissions
- Quote review uploads
- Floor plan usage
- Suburb-page quote clicks
- Won jobs if tracked later
`);

const existingBlogPaths = fs.readdirSync(blogRoot)
  .filter((file) => file.endsWith(".html"))
  .map((file) => `blog/${file}`);

const sitemapPaths = [
  "",
  "index.html",
  "quote.html",
  "quote-review.html",
  "floorplan.html",
  "products.html",
  "contact.html",
  "privacy-policy.html",
  "terms.html",
  "floor-care-maintenance.html",
  "flooring-quote-sydney.html",
  ...corePages.filter((pageData) => pageData.file !== "flooring-quote-sydney.html").map((pageData) => pageData.file),
  ...suburbPages.map((page) => page.slug),
  "blog/",
  ...existingBlogPaths
];
const uniqueSitemapPaths = Array.from(new Set(sitemapPaths));
write(path.join(root, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueSitemapPaths.map((item) => `  <url><loc>${site}/${item}</loc></url>`).join("\n")}
</urlset>
`);

write(path.join(root, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`);

const suburbLinks = suburbPages.map((page) => `<a href="${page.slug}">${page.name}</a>`).join("\n                ");
let index = fs.readFileSync(path.join(root, "index.html"), "utf8");
index = index.replace(/<h3>Sydney locations<\/h3>\s*<div class="link-list">[\s\S]*?<\/div>/, `<h3>Sydney locations</h3>\n              <div class="link-list">\n                ${suburbLinks}\n              </div>`);
index = index.replace(/<h4>Locations<\/h4>\s*<ul>[\s\S]*?<\/ul>/, `<h4>Locations</h4>\n        <ul>\n          ${suburbPages.slice(0, 8).map((page) => `<li><a href="${page.slug}">${page.name}</a></li>`).join("\n          ")}\n        </ul>`);
write(path.join(root, "index.html"), index);

console.log(`Generated ${corePages.length} core pages, ${suburbPages.length} suburb pages, ${guidePages.length} guides, sitemap, robots, keyword CSV and measurement plan.`);
