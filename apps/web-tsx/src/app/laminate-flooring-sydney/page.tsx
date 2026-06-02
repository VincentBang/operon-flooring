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
      "@id": "https://operonflooring.com.au/laminate-flooring-sydney.html#service",
      name: "Laminate flooring Sydney",
      serviceType: "Laminate flooring Sydney",
      provider: { "@type": "LocalBusiness", name: "Operon Flooring", url: "https://operonflooring.com.au" },
      areaServed: { "@type": "City", name: "Sydney" }
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://operonflooring.com.au/" },
        { "@type": "ListItem", position: 2, name: "Laminate flooring Sydney", item: "https://operonflooring.com.au/laminate-flooring-sydney.html" }
      ]
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        { "@type": "Question", name: "Can I get a quote before a site visit?", acceptedAnswer: { "@type": "Answer", text: "Yes. The online quote is a starting estimate based on visible product, area and scope details. Final project details are reviewed before booking." } },
        { "@type": "Question", name: "Can I upload a floor plan?", acceptedAnswer: { "@type": "Answer", text: "Yes. The floor plan tool can help estimate the flooring area when manual measurements are unclear or inconvenient." } },
        { "@type": "Question", name: "What is reviewed before the final quote?", acceptedAnswer: { "@type": "Answer", text: "Measured area, chosen range and main inclusions are reviewed before the final quote. Final project details are confirmed before booking." } },
        { "@type": "Question", name: "Can Operon review an existing written quote?", acceptedAnswer: { "@type": "Answer", text: "Yes. The quote review page checks whether product, area, inclusions, exclusions and final project details are clear enough to compare." } }
      ]
    }
  ]
};

const rangeCards = [
  { img: "/images/products/laminate/aspen-oak.jpeg", alt: "ETF 12mm water resistant laminate flooring range preview in Aspen Oak", width: 500, height: 500, chips: ["12mm", "Water-resistant"], title: "ETF 12mm 24hrs Water Resistant Laminate", note: "dry-area renovations that want a more solid board feel." },
  { img: "/images/products/laminate/eco-swish-laminate-aqua/blackbutt-aqua.webp", alt: "Swish Laminate Aqua range preview in Blackbutt Aqua", width: 900, height: 900, chips: ["Aqua range", "Rental-friendly"], title: "Swish Laminate Aqua", note: "rentals, bedrooms and durable everyday spaces." },
  { img: "/images/products/laminate/oak-step/os105-nsw-spotted-gum.jpg", alt: "Swish laminate flooring range preview in NSW Spotted Gum", width: 674, height: 1013, chips: ["Timber-look", "Dry areas"], title: "Swish Laminate", note: "living rooms, bedrooms and tidy refresh projects." },
  { img: "/images/products/laminate/eco-villeroy-boch-heritage/travertin-oak.webp", alt: "Villeroy and Boch Heritage laminate range preview in Travertin Oak", width: 900, height: 900, chips: ["Heritage", "Premium laminate"], title: "Villeroy & Boch Heritage Laminate", note: "design-led dry areas with a warmer timber look." },
  { img: "/images/products/laminate/eco-villeroy-boch-contemporary/current-oak.webp", alt: "Villeroy and Boch Contemporary laminate range preview in Current Oak", width: 900, height: 900, chips: ["Contemporary", "Everyday durability"], title: "Villeroy & Boch Contemporary Laminate", note: "modern living spaces and polished dry-area updates." }
];

export const metadata: Metadata = createPageMetadata({
  title: "Laminate Flooring Sydney | Quote & Installation",
  description: "Start a laminate flooring quote in Sydney for dry internal spaces. Compare practical ranges, area and main inclusions. Final project details are reviewed before booking.",
  path: routes.laminate,
  image: "/assets/operon-social-preview.png"
});

export default function LaminateFlooringSydneyPage() {
  return (
    <Layout>
      <JsonLd data={jsonLd} />
      <section className="hero"><div className="shell"><article className="hero-card"><nav className="breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Laminate flooring Sydney</span></nav><span className="eyebrow">Laminate flooring</span><h1>Laminate flooring Sydney</h1><p>Laminate flooring can be a strong value path for dry internal spaces, rental upgrades and budget-conscious renovations.</p><div className="hero-actions"><a className="button button-primary" href={`${routes.quote}?from=seo&category=laminate`} data-track-cta="guide_to_quote_click">Start a laminate flooring quote</a><a className="button button-secondary" href={routes.quoteReview}>Check an existing flooring quote</a><a className="button button-secondary" href={routes.floorplan}>Upload a floor plan</a></div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Use cases</span><h2>Laminate flooring for dry internal spaces</h2><p>Laminate is usually considered where a timber-look finish and cost control matter more than wet-area suitability. Product quality, underlay and subfloor preparation still influence the finished result.</p><div className="link-grid"><a className="link-card" href={`${routes.products}?category=laminate`}><strong>Browse laminate products</strong><span>Compare ranges before starting the quote.</span></a><a className="link-card" href="/blog/laminate-vs-hybrid.html"><strong>Hybrid vs laminate</strong><span>Compare product tradeoffs before choosing a quote path.</span></a></div></article></div></section>

      <section className="section" aria-labelledby="laminateRangesTitle"><div className="shell"><article className="section-card range-preview"><div className="range-preview-header"><div><span className="eyebrow">Popular laminate ranges</span><h2 id="laminateRangesTitle">Popular laminate flooring ranges</h2><p>A few practical laminate directions to help you shortlist a range before starting your quote.</p></div><div className="range-preview-actions"><a className="button button-secondary" href={`${routes.products}?category=laminate`}>View all laminate products</a><a className="button button-primary" href={`${routes.quote}?from=seo_ranges&category=laminate`}>Start quote with laminate</a></div></div><div className="range-preview-grid">{rangeCards.map((card) => <article className="range-preview-card" key={card.title}><div className="range-preview-thumb"><img src={card.img} alt={card.alt} width={card.width} height={card.height} loading={card.title.includes("ETF") || card.title.includes("Swish Laminate Aqua") ? undefined : "lazy"} decoding="async" /></div><div className="range-preview-copy"><div className="range-preview-meta">{card.chips.map((chip) => <span className="range-preview-chip" key={chip}>{chip}</span>)}</div><h3>{card.title}</h3><p className="range-preview-note"><strong>Best for:</strong> {card.note}</p><a className="range-preview-link" href={`${routes.quote}?from=seo_range_card&category=laminate`}>Use in quote</a></div></article>)}</div></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">Quote factors</span><h2>What should be clear before you decide?</h2><div className="link-grid"><div className="link-card"><strong>Area and room layout</strong><span>Make sure the measured area matches the rooms you want included.</span></div><div className="link-card"><strong>Underlay and preparation</strong><span>Subfloor preparation and underlay should be clear before installation is booked.</span></div><div className="link-card"><strong>Main inclusions</strong><span>Removal, trims, skirting and door trimming should be confirmed early.</span></div></div></article></div></section>

      <section className="section" aria-labelledby="categoryDecisionTitle"><div className="shell"><article className="section-card"><span className="eyebrow">Decision guide</span><h2 id="categoryDecisionTitle">Choose laminate around the job, not just the colour</h2><div className="grid-4"><article className="trust-card"><h3>Best for</h3><p>Dry internal rooms, budget-conscious renovations, rental upgrades and straightforward timber-look projects.</p></article><article className="trust-card"><h3>Not best for</h3><p>Wet-prone rooms, projects needing premium timber feel, or jobs where water exposure is a serious concern.</p></article><article className="trust-card"><h3>Apartment suitability</h3><p>Can work in apartments when product suitability, underlay and acoustic requirements are checked early.</p></article><article className="trust-card"><h3>Installation notes</h3><p>Laminate is typically floated over underlay. Subfloor condition, moisture, trims and door clearance should be reviewed.</p></article></div><div className="link-grid"><a className="link-card" href={`${routes.quote}?from=category&category=laminate`} data-track-cta="category_quote_click"><strong>Start quote with laminate</strong><span>Carry this category into the structured quote flow.</span></a><a className="link-card" href={routes.quoteReview} data-track-cta="category_review_click"><strong>Already have a quote?</strong><span>Check whether product, area and inclusions are clear before comparing totals.</span></a><a className="link-card" href={routes.floorplan} data-track-cta="category_floorplan_click"><strong>Need area?</strong><span>Use a floor plan to create a starting measured area.</span></a></div><p className="hero-trust"><strong>Common quote risk:</strong> Assuming underlay, disposal, trims or floor preparation are included can make laminate quotes look cheaper than they really are.</p></article></div></section>

      <section className="section"><div className="shell"><article className="section-card"><span className="eyebrow">FAQs</span><h2>Questions people ask before quoting</h2><div className="faq"><details open><summary>Can I get a quote before a site visit?</summary><p>Yes. The online quote is a starting estimate based on visible product, area and scope details. Final project details are reviewed before booking.</p></details><details><summary>Can I upload a floor plan?</summary><p>Yes. The floor plan tool can help estimate the flooring area when manual measurements are unclear or inconvenient.</p></details><details><summary>What is reviewed before the final quote?</summary><p>Measured area, chosen range and main inclusions are reviewed before the final quote. Final project details are confirmed before booking.</p></details><details><summary>Can Operon review an existing written quote?</summary><p>Yes. The quote review page checks whether product, area, inclusions, exclusions and final project details are clear enough to compare.</p></details></div></article></div></section>
    </Layout>
  );
}
