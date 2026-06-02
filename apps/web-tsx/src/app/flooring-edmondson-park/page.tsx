import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://operonflooring.com.au/flooring-edmondson-park.html#service",
      name: "Flooring Edmondson Park",
      serviceType: "Flooring Edmondson Park",
      provider: {
        "@type": "LocalBusiness",
        name: "Operon Flooring",
        url: "https://operonflooring.com.au"
      },
      areaServed: {
        "@type": "City",
        name: "Sydney"
      }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://operonflooring.com.au/" },
        { "@type": "ListItem", position: 2, name: "Flooring Edmondson Park", item: "https://operonflooring.com.au/flooring-edmondson-park.html" }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Do you install hybrid flooring in Edmondson Park?", acceptedAnswer: { "@type": "Answer", text: "Hybrid flooring can be quoted for Edmondson Park homes and apartments where the product and site conditions are suitable." } },
        { "@type": "Question", name: "Can I get a quote before a site visit?", acceptedAnswer: { "@type": "Answer", text: "Yes. The online quote gives a starting estimate using product, area and visible scope. Final scope review is confirmed after review." } },
        { "@type": "Question", name: "Can I upload a floor plan?", acceptedAnswer: { "@type": "Answer", text: "Yes. Uploading a floor plan can help estimate area when room measurements are unclear." } },
        { "@type": "Question", name: "What should be clear before you decide?", acceptedAnswer: { "@type": "Answer", text: "Measured area, product range, removal, disposal, underlay, preparation, stairs, trims and site conditions are reviewed before final scope review." } },
        { "@type": "Question", name: "Can you review an existing quote?", acceptedAnswer: { "@type": "Answer", text: "Yes. The quote review checks whether product, area, removal, stairs, trims and site conditions are clearly listed." } }
      ]
    }
  ]
};

const serviceCards = [
  ["Hybrid flooring", "Practical low-maintenance flooring for suitable homes, units and renovations."],
  ["Laminate flooring", "Budget-conscious timber-look flooring for dry internal spaces."],
  ["Engineered timber", "Premium timber-look option where range, colour and installation method need review."],
  ["Supply and install", "Product and installation scope can be reviewed together."],
  ["Installation-only", "Installation-only may be reviewed where product details and site scope are clear."],
  ["Quote review and measurement", "Upload a quote or floor plan to clarify scope before final scope review."]
];

const quoteFactorCards = [
  ["Measured area", "Room area, waste allowance and layout shape affect the starting estimate."],
  ["Product category", "Hybrid, laminate and engineered timber have different quote paths."],
  ["Removal and disposal", "Existing flooring lift-up and take-away should be written clearly."],
  ["Underlay and acoustic", "Apartment, product or building requirements may need review."],
  ["Floor preparation", "Levelling, patching, grinding or moisture checks can change final scope."],
  ["Stairs and trims", "Stair nosing, scotia, skirting, trims and door adjustments should be listed."],
  ["Building requirements", "Final project details are reviewed before booking."]
];

export const metadata: Metadata = createPageMetadata({
  title: "Flooring Edmondson Park | Hybrid, Laminate & Timber Quotes",
  description: "Start a flooring quote in Edmondson Park for hybrid, laminate or engineered timber. Add area, removal, stairs, trims and floor plan details before final scope review.",
  path: routes.edmondsonPark,
  image: "/assets/operon-social-preview.png"
});

export default function FlooringEdmondsonParkPage() {
  return (
    <Layout>
      <JsonLd data={jsonLd} />
      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Flooring quote and installation in Edmondson Park</span></nav>
            <span className="eyebrow">Edmondson Park flooring</span>
            <h1>Flooring quote and installation in Edmondson Park</h1>
            <p>Newer family homes around Edmondson Park often need practical floors that can handle kids, pets and open-plan living. A clear quote should show the product category, measured area, removal and finishing details before anyone compares totals. Hybrid and laminate are common starting points because they balance durability, maintenance and budget, while engineered timber can suit feature areas where finish matters more.</p>
            <div className="hero-actions">
              <a className="button button-primary" href={routes.quote} data-track-cta="suburb_page_quote_click">Start an Edmondson Park flooring quote</a>
              <a className="button button-secondary" href={routes.quoteReview}>Check an existing flooring quote</a>
              <a className="button button-secondary" href={routes.floorplan}>Upload a floor plan</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Edmondson Park flooring</span><h2>Flooring quote support in Edmondson Park</h2><p>For Edmondson Park, the quote should reflect newer homes, family spaces and practical hybrid or laminate choices. That means the written scope needs to show more than the flooring category; it should also explain the area basis, removal, underlay, trims, stairs and any final project details.</p><p>The aim is not to promise a final fixed online price, but to collect enough scope for a useful starting estimate.</p><div className="link-grid"><a className="link-card" href={routes.quote}><strong>Start an Edmondson Park flooring quote</strong><span>Add product, area, removal, stairs and site details.</span></a><a className="link-card" href={routes.quoteReview}><strong>Check an existing flooring quote</strong><span>Review whether written scope is complete enough to compare.</span></a><a className="link-card" href={routes.floorplan}><strong>Upload a floor plan</strong><span>Trace rooms to create a clearer starting area.</span></a></div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Services</span><h2>Flooring services for Edmondson Park</h2><div className="link-grid">{serviceCards.map(([title, copy]) => <div className="link-card" key={title}><strong>{title}</strong><span>{copy}</span></div>)}</div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Quote factors in Edmondson Park</span><h2>What affects a flooring quote in Edmondson Park</h2><div className="link-grid">{quoteFactorCards.map(([title, copy]) => <div className="link-card" key={title}><strong>{title}</strong><span>{copy}</span></div>)}</div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Internal links</span><h2>Useful next pages</h2><p>Use these pages to compare products, check written scope or start the quote with better information.</p><div className="link-grid"><a className="link-card" href={routes.products}><strong>Browse flooring products</strong><span>Choose a category, range or product direction.</span></a><a className="link-card" href={routes.hybrid}><strong>Hybrid flooring Sydney</strong><span>Review hybrid quote considerations.</span></a><a className="link-card" href={routes.laminate}><strong>Laminate flooring Sydney</strong><span>Review laminate quote considerations.</span></a><a className="link-card" href={routes.engineered}><strong>Engineered timber Sydney</strong><span>Review engineered timber quote considerations.</span></a><a className="link-card" href={routes.leppington}><strong>Flooring Leppington</strong><span>Nearby flooring quote support for Leppington.</span></a><a className="link-card" href={routes.liverpool}><strong>Flooring Liverpool</strong><span>Nearby flooring quote support for Liverpool.</span></a><a className="link-card" href={routes.campbelltown}><strong>Flooring Campbelltown</strong><span>Nearby flooring quote support for Campbelltown.</span></a></div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">FAQs</span><h2>Questions people ask before quoting</h2><div className="faq"><details open><summary>Do you install hybrid flooring in Edmondson Park?</summary><p>Hybrid flooring can be quoted for Edmondson Park homes and apartments where the product and site conditions are suitable.</p></details><details><summary>Can I get a quote before a site visit?</summary><p>Yes. The online quote gives a starting estimate using product, area and visible scope. Final scope review is confirmed after review.</p></details><details><summary>Can I upload a floor plan?</summary><p>Yes. Uploading a floor plan can help estimate area when room measurements are unclear.</p></details><details><summary>What should be clear before you decide?</summary><p>Measured area, product range, removal, disposal, underlay, preparation, stairs, trims and site conditions are reviewed before final scope review.</p></details><details><summary>Can you review an existing quote?</summary><p>Yes. The quote review checks whether product, area, removal, stairs, trims and site conditions are clearly listed.</p></details></div></article></div></section>
    </Layout>
  );
}
