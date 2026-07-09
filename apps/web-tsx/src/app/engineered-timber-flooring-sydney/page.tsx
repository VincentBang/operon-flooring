import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { ProductAuthoritySection } from "@/lib/productSeoGuides";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

const pagePath = routes.engineered;

const rangeCards = [
  {
    img: "/images/products/engineered-timber/eco-swish-oak-wideboard/urban-antique-oak.webp",
    alt: "Swish Oak Wideboard engineered timber range preview in Urban Antique Oak",
    chips: ["Wide board", "Premium timber"],
    title: "Swish Oak Wideboard",
    note: "open-plan living areas and premium renovations.",
    width: 900,
    height: 900
  },
  {
    img: "/images/products/engineered-timber/eco-swish-oak-contemporary/elegant-natural-oak.webp",
    alt: "Swish Oak Contemporary engineered timber range preview in Elegant Natural Oak",
    chips: ["Contemporary oak", "Feature spaces"],
    title: "Swish Oak Contemporary",
    note: "refined living areas and modern apartment upgrades.",
    width: 900,
    height: 900
  },
  {
    img: "/images/products/engineered-timber/topdeck-castel-nuovo-herringbone/panania-oak-1.webp",
    alt: "Castel Nuovo herringbone engineered timber range preview in Panania Oak",
    chips: ["Herringbone", "Feature pattern"],
    title: "Castel Nuovo Herringbone",
    note: "statement living areas and premium entry sequences.",
    width: 1400,
    height: 933
  },
  {
    img: "/images/products/engineered-timber/topdeck-cavallo-bianco-chevron/amaretti-oak.webp",
    alt: "Cavallo Bianco chevron engineered timber range preview in Amaretti Oak",
    chips: ["Chevron", "Architectural finish"],
    title: "Cavallo Bianco Chevron",
    note: "design-led rooms where pattern makes the floor a feature.",
    width: 1400,
    height: 933
  }
];

const faqs = [
  {
    question: "Is engineered timber flooring suitable for Sydney homes?",
    answer:
      "Engineered timber can suit premium Sydney renovations, feature living areas and homes where natural timber character matters. Suitability depends on product range, installation method, subfloor condition, moisture expectations and care requirements."
  },
  {
    question: "What is the difference between engineered timber and hybrid flooring?",
    answer:
      "Engineered timber has a real timber surface and is chosen for finish quality and character. Hybrid is usually chosen for practical timber-look resilience and easier maintenance. The right choice depends on the project and written quote scope."
  },
  {
    question: "Do herringbone and chevron engineered timber cost more to install?",
    answer:
      "Feature patterns usually require clearer layout and installation review than straight plank flooring. The quote should state pattern, preparation, trims and stair details before you compare totals."
  },
  {
    question: "What should an engineered timber quote include?",
    answer:
      "It should show product range, colour direction, measured area, installation method, preparation, adhesive or underlay assumptions, stairs, trims, skirting or scotia, exclusions and final confirmation items."
  }
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(pagePath)}#service`,
    name: "Engineered timber flooring Sydney",
    serviceType: "Engineered timber flooring quote and installation guidance",
    provider: {
      "@type": "LocalBusiness",
      name: "Operon Flooring",
      url: absoluteUrl(routes.home)
    },
    areaServed: { "@type": "City", name: "Sydney" },
    url: absoluteUrl(pagePath)
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
      { "@type": "ListItem", position: 2, name: "Engineered timber flooring Sydney", item: absoluteUrl(pagePath) }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  }
];

export const metadata: Metadata = createPageMetadata({
  title: "Engineered Timber Flooring Sydney | Products & Quote Guide",
  description:
    "Compare engineered timber flooring in Sydney for premium homes, stairs and feature rooms. Review products, method, prep, trims and quote scope.",
  path: pagePath,
  image: "/assets/operon-social-preview.png",
  robots: "index,follow"
});

export default function EngineeredTimberFlooringSydneyPage() {
  return (
    <Layout>
      {jsonLd.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}

      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={routes.home}>Home</a>
              <span>/</span>
              <span>Engineered timber flooring Sydney</span>
            </nav>
            <span className="eyebrow">Engineered timber</span>
            <h1>Engineered timber flooring Sydney</h1>
            <p>
              Engineered timber is a finish-led flooring choice for Sydney homes where natural timber character, installation method, stairs, trims and preparation details matter. A strong quote should make those details visible before you compare totals.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=category&category=engineered#quoteForm`} data-track-cta="engineered_category_quote_click">Start engineered timber quote</a>
              <a className="button button-secondary" href={`${routes.products}?category=engineered`} data-track-cta="engineered_category_products_click">Browse engineered timber</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="engineered_category_review_click">Review a timber quote</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Premium fit</span>
            <h2>When engineered timber is the right conversation</h2>
            <div className="link-grid">
              <div className="link-card"><strong>Feature living spaces</strong><span>For rooms where timber tone, board format and finish quality are part of the design decision.</span></div>
              <div className="link-card"><strong>Stairs and transitions</strong><span>Stairs, nosing, landings and trims should be written clearly before a quote is accepted.</span></div>
              <div className="link-card"><strong>Premium apartments</strong><span>Apartment projects need acoustic, access and building requirements checked with the product system.</span></div>
              <div className="link-card"><strong>Patterned floors</strong><span>Herringbone and chevron projects need layout, wastage and installation method reviewed.</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="engineeredRangesTitle">
        <div className="shell">
          <article className="section-card range-preview">
            <div className="range-preview-header">
              <div>
                <span className="eyebrow">Range examples</span>
                <h2 id="engineeredRangesTitle">Engineered timber range directions</h2>
                <p>Shortlist a direction, then confirm the exact product, colour and installation method in the quote flow.</p>
              </div>
              <div className="range-preview-actions">
                <a className="button button-secondary" href={`${routes.products}?category=engineered`}>View engineered timber products</a>
                <a className="button button-primary" href={`${routes.quote}?from=seo_ranges&category=engineered#quoteForm`}>Start timber quote</a>
              </div>
            </div>
            <div className="range-preview-grid">
              {rangeCards.map((card) => (
                <article className="range-preview-card" key={card.title}>
                  <div className="range-preview-thumb">
                    <img src={card.img} alt={card.alt} width={card.width} height={card.height} loading="lazy" decoding="async" />
                  </div>
                  <div className="range-preview-copy">
                    <div className="range-preview-meta">
                      {card.chips.map((chip) => <span className="range-preview-chip" key={chip}>{chip}</span>)}
                    </div>
                    <h3>{card.title}</h3>
                    <p className="range-preview-note"><strong>Best for:</strong> {card.note}</p>
                    <a className="range-preview-link" href={`${routes.quote}?from=seo_range_card&category=engineered#quoteForm`}>Use in quote</a>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Installation method</span>
            <h2>Floating, direct-stick, stair and pattern scope should be named</h2>
            <p>
              Engineered timber quotes can vary because installation method, preparation, adhesive or underlay assumptions, patterns, stair nosing, trims and skirting are handled differently. Ask for the written scope before comparing totals.
            </p>
            <a className="button button-secondary" href={routes.flooringQuoteSydney}>Read the flooring quote guide</a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Project proof</span>
            <h2>Use recent projects to set finish expectations</h2>
            <p>
              Finished timber photos help customers understand tone, layout, stair detail and room feel. Use project proof for finish expectations, then use the quote flow to capture the actual area and scope.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.recentProjects}><strong>Recent flooring projects</strong><span>View real finished examples where available.</span></a>
              <a className="link-card" href="/blog/flooring-stairs-and-stair-nosing.html"><strong>Stairs and stair nosing</strong><span>Understand why stairs need written detail.</span></a>
            </div>
          </article>
        </div>
      </section>

      <ProductAuthoritySection category="engineered" />

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQ</span>
            <h2>Engineered timber flooring questions</h2>
            <div className="faq">
              {faqs.map((faq, index) => (
                <details key={faq.question} open={index === 0}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>
    </Layout>
  );
}
