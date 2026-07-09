import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { ProductAuthoritySection } from "@/lib/productSeoGuides";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

const pagePath = routes.hybrid;

const rangeCards = [
  {
    img: "/images/products/hybrid/hrt-etf-7mm-antique-oak.jpg",
    alt: "ETF 7mm waterproof hybrid flooring range preview in Antique Oak",
    chips: ["7mm", "SPC hybrid"],
    title: "ETF 7.0mm Waterproof Hybrid Flooring",
    note: "family living spaces, practical upgrades and everyday timber-look rooms.",
    width: 500,
    height: 500
  },
  {
    img: "/images/products/hybrid/hrt-etf-8mm-alaskan-oak.jpg",
    alt: "ETF 8mm waterproof hybrid flooring range preview in Alaskan Oak",
    chips: ["8mm", "Apartment review"],
    title: "ETF 8.0mm Waterproof Hybrid Flooring",
    note: "apartments and units where acoustic or building details may need review.",
    width: 500,
    height: 500
  },
  {
    img: "/images/products/hybrid/eco-grande-9mm-bella.webp",
    alt: "Grande 9mm hybrid flooring range preview in Bella oak tone",
    chips: ["9mm", "Wide plank look"],
    title: "Grande 9.0 Hybrid Flooring",
    note: "open-plan homes wanting a calmer wide-plank timber look.",
    width: 300,
    height: 300
  },
  {
    img: "/images/products/hybrid/topdeck-lumiere-ultra-hd/lumiere-bellevue-avenue.webp",
    alt: "Lumiere Ultra HD hybrid plank range preview in Bellevue Avenue",
    chips: ["Ultra HD", "Premium look"],
    title: "Lumiere Ultra HD Hybrid Plank",
    note: "premium-looking family spaces where easy maintenance still matters.",
    width: 933,
    height: 1400
  }
];

const faqs = [
  {
    question: "Is hybrid flooring good for Sydney homes?",
    answer:
      "Hybrid flooring can suit many Sydney homes, apartments and rental upgrades where practical maintenance, everyday durability and timber-look appearance matter. Suitability still depends on the range, room use, subfloor, underlay and installation details."
  },
  {
    question: "Is hybrid flooring waterproof?",
    answer:
      "Many hybrid products are marketed for strong water resistance, but final suitability depends on manufacturer conditions, subfloor condition, room use, joins, trims and installation detail. It should not be treated as a fix for active leaks or damp subfloors."
  },
  {
    question: "Can hybrid flooring be used in apartments?",
    answer:
      "Hybrid can be suitable for apartments when acoustic underlay, strata requirements, access, lift booking and building rules are checked before final confirmation."
  },
  {
    question: "What should a hybrid flooring quote include?",
    answer:
      "A useful quote should show product range, measured area, underlay, installation method, removal, disposal, floor preparation, trims, stairs, exclusions and final review items."
  }
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(pagePath)}#service`,
    name: "Hybrid flooring Sydney",
    serviceType: "Hybrid flooring quote and installation guidance",
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
      { "@type": "ListItem", position: 2, name: "Hybrid flooring Sydney", item: absoluteUrl(pagePath) }
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
  title: "Hybrid Flooring Sydney | Products, Apartments & Quote Guide",
  description:
    "Compare hybrid flooring in Sydney for homes, apartments and rentals. Review products, waterproof claims, underlay, removal, trims and quote scope.",
  path: pagePath,
  image: "/assets/operon-social-preview.png",
  robots: "index,follow"
});

export default function HybridFlooringSydneyPage() {
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
              <span>Hybrid flooring Sydney</span>
            </nav>
            <span className="eyebrow">Hybrid flooring</span>
            <h1>Hybrid flooring Sydney</h1>
            <p>
              Hybrid flooring is a practical timber-look option for many Sydney homes, apartments and rental upgrades. The right choice still depends on range, room use, area, subfloor condition, underlay, trims and what the written quote includes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=category&category=hybrid#quoteForm`} data-track-cta="hybrid_category_quote_click">Start quote with hybrid</a>
              <a className="button button-secondary" href={`${routes.products}?category=hybrid`} data-track-cta="hybrid_category_products_click">Browse hybrid products</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="hybrid_category_review_click">Review a hybrid quote</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Best fit</span>
            <h2>Where hybrid flooring works best</h2>
            <div className="link-grid">
              <div className="link-card"><strong>Family homes</strong><span>Good for busy living areas where easy cleaning and everyday durability matter.</span></div>
              <div className="link-card"><strong>Apartments and units</strong><span>Can suit apartments when acoustic underlay, strata and access details are checked.</span></div>
              <div className="link-card"><strong>Rental upgrades</strong><span>Often shortlisted where presentation, durability and replacement planning all matter.</span></div>
              <div className="link-card"><strong>Practical renovations</strong><span>Useful when a timber-look finish is wanted without moving into premium timber scope.</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="hybridRangesTitle">
        <div className="shell">
          <article className="section-card range-preview">
            <div className="range-preview-header">
              <div>
                <span className="eyebrow">Range examples</span>
                <h2 id="hybridRangesTitle">Popular hybrid flooring directions</h2>
                <p>Use these as starting directions only. Final product and colour are confirmed through the quote and product selection flow.</p>
              </div>
              <div className="range-preview-actions">
                <a className="button button-secondary" href={`${routes.products}?category=hybrid`}>View hybrid products</a>
                <a className="button button-primary" href={`${routes.quote}?from=seo_ranges&category=hybrid#quoteForm`}>Start hybrid quote</a>
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
                    <a className="range-preview-link" href={`${routes.quote}?from=seo_range_card&category=hybrid#quoteForm`}>Use in quote</a>
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
            <span className="eyebrow">Quote scope</span>
            <h2>Hybrid flooring quotes need more than the product name</h2>
            <p>
              A clear hybrid quote should identify the range or category, measured area, underlay, installation method, old-floor removal, disposal, trims, door clearance, stairs and floor preparation assumptions. This keeps the estimate useful without pretending the online result is the final site-confirmed price.
            </p>
            <a className="button button-secondary" href={routes.flooringQuoteSydney}>Read the flooring quote guide</a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Water and apartment caution</span>
            <h2>Water-resistant does not mean every room is simple</h2>
            <p>
              Hybrid can be a strong practical choice, but water claims still depend on product conditions, subfloor condition and installation detail. Apartment projects may also need acoustic and strata checks before the quote is confirmed.
            </p>
            <div className="link-grid">
              <a className="link-card" href="/blog/apartment-flooring-acoustic-underlay.html"><strong>Apartment acoustic underlay</strong><span>Check acoustic and strata issues before booking.</span></a>
              <a className="link-card" href="/blog/laminate-vs-hybrid.html"><strong>Hybrid vs laminate</strong><span>Compare the common timber-look options.</span></a>
            </div>
          </article>
        </div>
      </section>

      <ProductAuthoritySection category="hybrid" />

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQ</span>
            <h2>Hybrid flooring questions</h2>
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
