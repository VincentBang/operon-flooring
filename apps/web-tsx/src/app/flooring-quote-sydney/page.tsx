import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

const pagePath = routes.flooringQuoteSydney;

const checklistItems = [
  ["Product and range", "The quote should name the flooring category, range or product direction clearly enough to compare like for like."],
  ["Area basis", "Check whether the area is measured from rooms, plans or an allowance, and whether wastage or order area is explained."],
  ["Supply and installation", "Confirm whether the quote covers supply and install, installation only, underlay and the installation method."],
  ["Removal and disposal", "Existing carpet, floating floor, vinyl, tile or timber removal should be listed separately from disposal where relevant."],
  ["Preparation and finishing", "Floor preparation, trims, transitions, scotia or skirting, stairs and door trimming should not be left vague."],
  ["Terms and exclusions", "Warranty, payment terms, exclusions and variation triggers should be written before accepting a quote."]
];

const questions = [
  "What product range or category is being quoted?",
  "What measured area is the quote based on?",
  "Is underlay, floor preparation, removal and disposal included?",
  "Are stairs, trims, skirting or scotia included?",
  "What is excluded or subject to final site review?"
];

const faqs = [
  {
    question: "What should a Sydney flooring quote include?",
    answer:
      "A useful Sydney flooring quote should identify product, area, supply, installation, underlay, removal, disposal, floor preparation, trims, stairs, exclusions and final confirmation items."
  },
  {
    question: "Should I compare flooring quotes by total price only?",
    answer:
      "No. Compare the written scope first. Two totals can look different because one quote includes more preparation, removal, trims, stairs or underlay than another."
  },
  {
    question: "Can I start an online quote before a site visit?",
    answer:
      "Yes. Use the quote tool to create a starting estimate from the product, area and scope you know now. Final project details are reviewed before booking."
  },
  {
    question: "What if I already have a written flooring quote?",
    answer:
      "Use the quote review tool to check whether the written scope is complete enough to compare before you accept it."
  }
];

const quoteGuideJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${absoluteUrl(pagePath)}#service`,
    name: "Flooring quote Sydney guide",
    serviceType: "Flooring quote scope and inclusion guidance",
    provider: {
      "@type": "LocalBusiness",
      name: "Operon Flooring",
      url: absoluteUrl(routes.home)
    },
    areaServed: {
      "@type": "City",
      name: "Sydney"
    },
    url: absoluteUrl(pagePath)
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
      { "@type": "ListItem", position: 2, name: "Flooring Quote Sydney Guide", item: absoluteUrl(pagePath) }
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
  title: "Flooring Quote Sydney Guide | Scope & Inclusions",
  description:
    "Use this Sydney flooring quote guide to check product, area, installation, underlay, removal, disposal, stairs, trims, exclusions and questions before comparing.",
  path: pagePath,
  image: "/assets/operon-social-preview.png",
  robots: "index,follow"
});

export default function Page() {
  return (
    <Layout>
      {quoteGuideJsonLd.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}

      <section className="hero">
        <div className="shell">
          <article className="hero-card">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={routes.home}>Home</a>
              <span>/</span>
              <span>Flooring quote Sydney guide</span>
            </nav>
            <span className="eyebrow">Quote scope guide</span>
            <h1>What should a Sydney flooring quote include?</h1>
            <p>
              A flooring quote should make the product, measured area and included work clear before you compare totals. Use this guide to check the scope, then start an instant flooring quote or review a written quote when you need a second set of eyes.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href={routes.quote} data-track-cta="quote_guide_start_quote_click">Start an instant flooring quote</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="quote_guide_review_click">Review an existing flooring quote</a>
              <a className="button button-secondary" href={routes.floorplan} data-track-cta="quote_guide_floorplan_click">Measure from a floor plan</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Scope checklist</span>
            <h2>Check these inclusions before comparing flooring quotes</h2>
            <div className="link-grid">
              {checklistItems.map(([title, copy]) => (
                <div className="link-card" key={title}>
                  <strong>{title}</strong>
                  <span>{copy}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Quote comparison</span>
            <h2>Why two flooring quotes can look different</h2>
            <p>
              One quote may include floor preparation, old-floor removal, disposal, trims, stairs or underlay while another leaves those items as assumptions. Before choosing the lower total, check whether both quotes describe the same product and the same work.
            </p>
            <a className="button button-secondary" href="/blog/why-flooring-quotes-vary.html">Read why flooring quotes vary</a>
          </article>
          <article className="section-card">
            <span className="eyebrow">Area clarity</span>
            <h2>Use a floor plan when area is unclear</h2>
            <p>
              If room sizes are not clear, a floor plan can help create a better starting area. The final quote still needs review before booking, especially where stairs, trims or preparation are involved.
            </p>
            <a className="button button-primary" href={routes.floorplan}>Upload a floor plan</a>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Questions to ask</span>
            <h2>Five questions before accepting a flooring quote</h2>
            <ol className="inline-link-list">
              {questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
            <div className="link-grid">
              <a className="link-card" href={routes.quote}>
                <strong>Start instant flooring quote</strong>
                <span>Use product, area and known scope details to create a starting estimate.</span>
              </a>
              <a className="link-card" href={routes.quoteReview}>
                <strong>Review an existing quote</strong>
                <span>Check what is clear, missing or risky in a written quote.</span>
              </a>
              <a className="link-card" href={routes.products}>
                <strong>Browse flooring products</strong>
                <span>Shortlist hybrid, laminate or engineered timber before quoting.</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQ</span>
            <h2>Flooring quote questions</h2>
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
