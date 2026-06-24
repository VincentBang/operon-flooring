import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

const pagePath = "/flooring-miranda.html";

const faqs = [
  {
    question: "What flooring options should I compare in Miranda?",
    answer:
      "Hybrid, laminate and engineered timber can all suit different Miranda homes or apartments. Compare product fit together with area, removal, preparation, trims, stairs and access."
  },
  {
    question: "Is laminate flooring suitable for Miranda homes?",
    answer:
      "Laminate can suit dry internal rooms, rental updates and budget-conscious timber-look projects when underlay, moisture expectations and finishing details are clear."
  },
  {
    question: "Can I use a floor plan for a Miranda flooring quote?",
    answer:
      "Yes. A floor plan can help create a clearer starting area before final measurement and project scope are reviewed."
  },
  {
    question: "Can Operon review another Miranda flooring quote?",
    answer:
      "Yes. Quote review checks whether product, area, inclusions, exclusions, removal, stairs and trims are clear enough to compare."
  }
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(pagePath)}#service`,
    name: "Flooring Miranda",
    serviceType: "Flooring quote and installation guidance",
    provider: {
      "@type": "LocalBusiness",
      name: "Operon Flooring",
      url: absoluteUrl(routes.home)
    },
    areaServed: [
      { "@type": "City", name: "Miranda" },
      { "@type": "City", name: "Sydney" }
    ],
    url: absoluteUrl(pagePath)
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
      { "@type": "ListItem", position: 2, name: "Flooring Miranda", item: absoluteUrl(pagePath) }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  }
];

export const metadata: Metadata = createPageMetadata({
  title: "Flooring Miranda | Hybrid, Laminate & Timber Installation",
  description:
    "Plan flooring in Miranda for hybrid, laminate or timber-look projects with product, area, removal, preparation, stairs, trims, quote review and floorplan details clear.",
  path: pagePath,
  image: "/assets/operon-social-preview.png",
  robots: "index,follow"
});

export default function Page() {
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
              <span>Flooring Miranda</span>
            </nav>
            <span className="eyebrow">Miranda flooring quotes</span>
            <h1>Flooring Miranda - Hybrid, Laminate & Timber Installation</h1>
            <p>
              Miranda flooring projects can include family homes, apartments, townhouses and rental updates. Use this page to compare hybrid flooring, laminate flooring and timber-look options, then start a quote with product, area, removal, trims, stairs and access details clear.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=seo_miranda#quoteForm`} data-track-cta="miranda_start_quote_click">Start Miranda flooring quote</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="miranda_quote_review_click">Review an existing quote</a>
              <a className="button button-secondary" href={routes.floorplan} data-track-cta="miranda_floorplan_click">Upload a floor plan</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Product paths</span>
            <h2>Hybrid flooring in Miranda</h2>
            <p>
              Hybrid flooring can be a practical starting point for busy living areas, families and easier-care upgrades. A Miranda hybrid quote should still describe underlay, trims, removal, disposal, stairs and any floor preparation assumptions.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.hybrid}>
                <strong>Compare hybrid flooring options</strong>
                <span>Review product fit before using hybrid in a quote.</span>
              </a>
              <a className="link-card" href={`${routes.quote}?from=miranda&category=hybrid#quoteForm`}>
                <strong>Start quote with hybrid flooring</strong>
                <span>Carry the category into the structured quote flow.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Laminate</span>
            <h2>Laminate flooring in Miranda</h2>
            <p>
              Laminate flooring can suit dry bedrooms, studies, rental updates and cost-conscious timber-look projects. The quote should make underlay, room use, moisture expectations, door clearance and finishing details clear.
            </p>
            <a className="button button-secondary" href={routes.laminate}>View laminate flooring Sydney</a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Timber look</span>
            <h2>Timber and engineered timber flooring in Miranda</h2>
            <p>
              Engineered timber may suit finish-led living areas or renovations where the product range and installation method matter. Check range, colour direction, floor preparation, trims and stair details before comparing totals.
            </p>
            <a className="button button-secondary" href={routes.engineered}>View engineered timber flooring Sydney</a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Property fit</span>
            <h2>Flooring options for apartments, units and houses</h2>
            <div className="link-grid">
              <div className="link-card"><strong>Apartments and units</strong><span>Check acoustic underlay, lift or stair access, parking and building requirements before final confirmation.</span></div>
              <div className="link-card"><strong>Family homes</strong><span>Capture connected living areas, bedrooms, removal, furniture notes and trims before comparing totals.</span></div>
              <div className="link-card"><strong>Townhouses</strong><span>Stair counts, landings, nosing and transitions should be written clearly.</span></div>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Scope details</span>
            <h2>Floor preparation, removal, trims and stairs</h2>
            <p>
              The quote should identify the existing floor type, whether removal and disposal are included, whether the subfloor needs preparation, and how trims, transitions, skirting, scotia or stairs are handled. These details help prevent a lower-looking quote from leaving work unclear.
            </p>
            <div className="link-grid">
              <a className="link-card" href="/blog/common-flooring-quote-exclusions.html"><strong>Common quote exclusions</strong><span>Check the items that are often unclear in written quotes.</span></a>
              <a className="link-card" href="/blog/scotia-vs-skirting.html"><strong>Scotia vs skirting</strong><span>Understand finishing options before the quote is finalised.</span></a>
              <a className="link-card" href="/blog/flooring-stairs-and-stair-nosing.html"><strong>Stairs and stair nosing</strong><span>Review stair wording before comparing totals.</span></a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Quote clarity</span>
            <h2>What should be included in a Miranda flooring quote?</h2>
            <p>
              A useful Miranda flooring quote should show the product category or range, measured area, underlay, installation method, removal, disposal, preparation, trims, stairs, access notes and exclusions. If the area is unclear, use the floor plan tool before starting or updating the quote.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.quote}><strong>Start instant flooring quote</strong><span>Add product, area and scope in one flow.</span></a>
              <a className="link-card" href={routes.floorplan}><strong>Measure from a floor plan</strong><span>Trace rooms to create a clearer starting area.</span></a>
              <a className="link-card" href={routes.quoteReview}><strong>Review an existing flooring quote</strong><span>Check whether written scope is complete enough to compare.</span></a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
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
