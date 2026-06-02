import type { Metadata } from "next";
import { HomeChatbot } from "@/components/HomeChatbot";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Instant Flooring Quote Sydney | Operon Flooring",
  description: "Start a Sydney flooring quote for hybrid, laminate or engineered timber. Add product, area, removal, trims, stairs and site details before review.",
  robots: "index,follow",
  alternates: {
    canonical: `${siteConfig.origin}/`
  },
  openGraph: {
    title: "Instant Flooring Quote Sydney | Operon Flooring",
    description: "Start a Sydney flooring quote for hybrid, laminate or engineered timber. Add product, area, removal, trims, stairs and site details before review.",
    url: `${siteConfig.origin}/`,
    images: [absoluteUrl("/assets/operon-social-preview.png")]
  },
  twitter: {
    card: "summary_large_image",
    title: "Instant Flooring Quote Sydney | Operon Flooring",
    description: "Start a Sydney flooring quote for hybrid, laminate or engineered timber. Add product, area, removal, trims, stairs and site details before review.",
    images: [absoluteUrl("/assets/operon-social-preview.png")]
  }
};

const trustItems = [
  ["Hybrid, laminate and engineered timber", "Choose the product path that fits the job"],
  ["Floor plan upload available", "Trace rooms instead of measuring every wall"],
  ["Stairs, trims and removal checked", "Capture the main inclusions before review"],
  ["Sydney service area", "Support for homes, units and renovations"]
];

const intentPaths = [
  {
    href: routes.quote,
    label: "Start a quote",
    text: "Add product, area and key scope.",
    link: "Start quote",
    track: "path_start_quote_click",
    intent: "quote",
    primary: true
  },
  {
    href: routes.quoteReview,
    label: "Check existing quote",
    text: "Review inclusions before deciding.",
    link: "Check quote",
    track: "path_quote_review_click",
    intent: "review"
  },
  {
    href: routes.products,
    label: "Browse products",
    text: "Compare hybrid, laminate and timber ranges.",
    link: "Browse products",
    track: "path_products_click",
    intent: "products"
  },
  {
    href: routes.floorplan,
    label: "Use a floor plan",
    text: "Trace rooms and send area to quote.",
    link: "Use floor plan",
    track: "path_floorplan_click",
    intent: "floorplan"
  }
];

const projectProof = [
  {
    className: "home-project-card home-project-card-feature",
    src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-herringbone-timber-flooring-sydney-kitchen-living.jpg",
    alt: "Finished engineered herringbone timber flooring in a Sydney kitchen and living area",
    title: "Engineered herringbone",
    text: "Kitchen and living area finish"
  },
  {
    src: "/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg",
    alt: "Finished hybrid flooring after preparation in a Sydney open plan living area",
    title: "Hybrid flooring",
    text: "After preparation and levelling"
  },
  {
    src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-timber-stair-sydney.jpg",
    alt: "Finished engineered timber stair installation in Sydney",
    title: "Stair detail",
    text: "Engineered timber stair finish"
  },
  {
    src: "/images/projects/engineered-spotted-gum-rounded-stair-sydney/finished-spotted-gum-rounded-stair-step-sydney.jpg",
    alt: "Finished spotted gum rounded stair step detail in Sydney",
    title: "Rounded stair edge",
    text: "Spotted gum detail"
  }
];

const clarityCards = [
  ["Product and area", "Choose a product direction and add measured area, rooms or a floor plan so the estimate has a useful base."],
  ["Main inclusions", "Include the obvious work such as removal, trims, stairs or furniture notes so the estimate reflects the project more clearly."],
  ["Final scope review", "Final project details are reviewed before booking, so the written scope is clear before installation is confirmed."]
];

const productCards = [
  {
    href: `${routes.quote}?from=home&category=hybrid`,
    image: "/images/products/hybrid/eco-grande-9mm-bella.webp",
    alt: "Hybrid flooring range preview in a warm oak tone",
    title: "Hybrid flooring",
    text: "Practical water-resistant flooring for busy homes, units and rental upgrades."
  },
  {
    href: `${routes.quote}?from=home&category=laminate`,
    image: "/images/products/laminate/eco-villeroy-boch-heritage/travertin-oak.webp",
    alt: "Laminate flooring range preview in a pale oak tone",
    title: "Laminate flooring",
    text: "A timber-look option for dry internal spaces where budget and durability matter."
  },
  {
    href: `${routes.quote}?from=home&category=engineered`,
    image: "/images/products/engineered-timber/topdeck-castel-nuovo-herringbone/panania-oak-1.webp",
    alt: "Engineered timber herringbone range preview in Panania Oak",
    title: "Engineered timber",
    text: "Premium timber character for finish-led renovations and feature spaces."
  }
];

const projectFitCards = [
  ["Apartments and units", "Confirm product, acoustic needs, building notes and area before booking.", `${routes.quote}?from=project_fit&property=apartment`, "Start apartment quote"],
  ["Family homes", "Balance durability, product style, removal, trims and room-by-room scope.", `${routes.quote}?from=project_fit&property=house`, "Start family home quote"],
  ["Investment properties", "Keep the scope practical and clear for replacement or rental-ready work.", `${routes.quote}?from=project_fit&property=investment`, "Start investment quote"],
  ["Premium renovations", "Use product proof, project photos and a clearer scope before comparing quotes.", routes.products, "Explore premium options"]
];

const seoLinks = [
  ["Hybrid Flooring Sydney", routes.hybrid],
  ["Laminate Flooring Sydney", routes.laminate],
  ["Engineered Timber Flooring Sydney", routes.engineered],
  ["Flooring Products", routes.products],
  ["Start Quote", routes.quote],
  ["Check Existing Quote", routes.quoteReview],
  ["Floor Plan Tool", routes.floorplan],
  ["Recent Projects", routes.recentProjects],
  ["Flooring Bankstown", routes.bankstown],
  ["Flooring Bellevue Hill", routes.bellevueHill],
  ["Flooring Manly", routes.manly],
  ["Flooring Randwick", "/flooring-randwick.html"]
];

const faqItems = [
  ["What should be clear before you decide?", "The product range, measured area, main inclusions, finishing details and any review items should be clear before the job is booked."],
  ["How is the final scope confirmed?", "Operon reviews the product, area, main inclusions and project notes so the final scope can be confirmed before installation."],
  ["When is a floor plan useful?", "A floor plan is useful when room measurements are unclear, the layout is awkward, or you want a faster starting area without measuring each room manually."],
  ["What should I check before accepting a flooring quote?", "Check the product range, area basis, main inclusions, finishing details, warranty and exclusions. If anything is unclear, ask for it in writing."],
  ["Why can two flooring quotes look different?", "Two quotes can describe different levels of product, finish and included work. Compare the written inclusions before deciding."]
];

export default function HomePage() {
  return (
    <Layout>
      <div className="mobile-sticky-cta">
        <a className="primary" data-track-cta="click_start_quote_mobile_sticky" href={routes.quote}>Start quote</a>
        <a data-track-cta="click_mobile_quote_review" href={routes.quoteReview}>Check quote</a>
      </div>

      <section className="home-hero section">
        <div className="home-hero-grid">
          <div>
            <p className="eyebrow">Sydney flooring quotes</p>
            <h1>Get a clear flooring quote in minutes</h1>
            <p className="home-lead">Premium Sydney flooring quotes for hybrid, laminate and engineered timber. Start with the details you know now.</p>
            <div className="home-actions">
              <a className="button button-primary" data-track-cta="hero_start_quote_click" href={routes.quote}>Start quote</a>
              <a className="home-quiet-link" data-track-cta="hero_quote_review_click" href={routes.quoteReview}>Check existing quote</a>
            </div>
            <p className="home-trust-line">Starting estimate first. Product, area and final scope are reviewed before booking.</p>
          </div>
          <figure className="home-hero-image">
            <img src="/images/home/modern-engineered-timber-flooring-sydney.avif" alt="Modern engineered timber flooring in a Sydney home" width="568" height="378" loading="eager" />
          </figure>
        </div>
        <div className="home-trust-strip" aria-label="Service highlights">
          {trustItems.map(([label, text]) => (
            <div className="home-trust-item" key={label}>{label}<span>{text}</span></div>
          ))}
        </div>
      </section>

      <section className="section home-intent-router" aria-labelledby="intentRouterTitle">
        <div className="home-section-head">
          <p className="eyebrow">Choose your path</p>
          <h2 id="intentRouterTitle">Start from where you are now.</h2>
          <p>Quote, check a written quote, browse products or use a floor plan.</p>
        </div>
        <div className="home-intent-paths" aria-label="Flooring quote entry paths">
          {intentPaths.map((path) => (
            <a className={`home-intent-path${path.primary ? " home-intent-path-primary" : ""}`} data-funnel-intent={path.intent} data-track-cta={path.track} href={path.href} key={path.href}>
              <span><strong>{path.label}</strong><span>{path.text}</span></span>
              <span className="home-card-link">{path.link}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="proofTitle">
        <div className="home-project-proof">
          <div className="home-project-proof-head">
            <div>
              <p className="eyebrow">Recent project proof</p>
              <h2 id="proofTitle">Recent Sydney flooring projects</h2>
              <p>Finished flooring work across Sydney homes, with the preparation, product choice and stair details handled before the job is booked.</p>
            </div>
            <div className="home-project-proof-chips" aria-label="Project types shown">
              <span>Herringbone</span>
              <span>Hybrid</span>
              <span>Stairs</span>
              <span>Sydney projects</span>
            </div>
          </div>
          <div className="home-project-gallery" aria-label="Recent Sydney flooring project photos">
            <figure className={projectProof[0].className}>
              <img src={projectProof[0].src} alt={projectProof[0].alt} width="1118" height="944" loading="lazy" />
              <figcaption><strong>{projectProof[0].title}</strong><span>{projectProof[0].text}</span></figcaption>
            </figure>
            <div className="home-project-gallery-side">
              {projectProof.slice(1).map((project) => (
                <figure className="home-project-card" key={project.title}>
                  <img src={project.src} alt={project.alt} width="900" height="675" loading="lazy" />
                  <figcaption><strong>{project.title}</strong><span>{project.text}</span></figcaption>
                </figure>
              ))}
            </div>
          </div>
          <p className="home-project-proof-note">Behind these finished results, preparation items like floor levelling, removal and stair detailing are reviewed before booking. <a href={routes.recentProjects}>View more project photos</a>.</p>
          <div className="home-project-proof-actions">
            <div>
              <h3>Want a quote for a similar project?</h3>
              <p>Start with the product direction and area you know now.</p>
            </div>
            <div className="home-project-proof-buttons">
              <a className="button button-primary" data-track-cta="project_proof_start_quote_click" href={routes.quote}>Start flooring quote</a>
              <a className="button button-secondary" data-track-cta="project_proof_quote_review_click" href={routes.quoteReview}>Check existing quote</a>
            </div>
          </div>
        </div>
      </section>

      <section className="section home-quote-clarity" aria-labelledby="quoteClarityTitle">
        <div className="home-section-head">
          <p className="eyebrow">Quote clarity</p>
          <h2 id="quoteClarityTitle">How Operon keeps your quote clear</h2>
          <p>Start with the details you know now. Operon keeps the quote focused on product, area and the main inclusions before anything is booked.</p>
        </div>
        <div className="home-clarity-grid">
          {clarityCards.map(([title, text]) => (
            <article className="home-clarity-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="home-quote-checks">
          <span>Product choice</span>
          <span>Measured area</span>
          <span>Main inclusions</span>
          <span>Finish details</span>
          <span>Final review</span>
        </div>
        <div className="home-inline-cta">
          <a className="button button-primary" data-track-cta="click_quote_process_start" href={routes.quote}>Start flooring quote</a>
          <span>Start now, then final scope can be reviewed before booking.</span>
        </div>
      </section>

      <section className="section home-review-path" aria-labelledby="reviewQuoteTitle">
        <div className="home-review-copy">
          <p className="eyebrow">Quote validation</p>
          <h2 id="reviewQuoteTitle">Want to check a written quote before deciding?</h2>
          <p>Upload or enter a written quote to review product, area, inclusions and questions to ask before you decide.</p>
          <div className="home-review-checklist" aria-label="Quote review checklist">
            <div><strong>Product</strong><span>Check what is written into the quote.</span></div>
            <div><strong>Area</strong><span>Compare measured area and quote basis.</span></div>
            <div><strong>Scope</strong><span>Review inclusions and unclear items.</span></div>
            <div><strong>Questions</strong><span>Get a cleaner list to ask back.</span></div>
          </div>
        </div>
        <div className="home-review-actions">
          <a className="button button-secondary" data-track-cta="quote_validation_section" href={routes.quoteReview}>Review my quote</a>
          <span>A quiet second path if you already have a written quote.</span>
        </div>
      </section>

      <section className="section" aria-labelledby="servicesTitle">
        <div className="home-section-head">
          <p className="eyebrow">Product paths</p>
          <h2 id="servicesTitle">Browse products after you know the quote path.</h2>
          <p>Choose a broad flooring direction, then start the quote with that category already in mind.</p>
        </div>
        <div className="home-product-grid">
          {productCards.map((product) => (
            <article className="home-product-card" key={product.title}>
              <img src={product.image} alt={product.alt} width="640" height="420" loading="lazy" />
              <div>
                <h3>{product.title}</h3>
                <p>{product.text}</p>
                <a className="home-card-link" href={product.href}>Use in quote</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-floorplan-cta" aria-labelledby="floorplanTitle">
        <div>
          <p className="eyebrow">Floor plan area</p>
          <h2 id="floorplanTitle">Have a floor plan?</h2>
          <p>Upload a floor plan, trace rooms and send the measured area into your quote.</p>
        </div>
        <a className="button button-primary" data-track-cta="floorplan_cta_click" href={routes.floorplan}>Use floor plan tool</a>
      </section>

      <section className="section home-project-fit" aria-labelledby="projectFitTitle">
        <div className="home-section-head">
          <p className="eyebrow">Project fit</p>
          <h2 id="projectFitTitle">Choose flooring around the job, not just the colour.</h2>
        </div>
        <div className="home-project-fit-grid" aria-label="Flooring project fit options">
          {projectFitCards.map(([title, text, href, link]) => (
            <article className="home-project-fit-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
              <a className="home-card-link" href={href}>{link}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="section home-seo-links" aria-labelledby="seoTitle">
        <div>
          <p className="eyebrow">Sydney flooring quote support</p>
          <h2 id="seoTitle">Premium flooring quote support across Sydney</h2>
          <p>Operon helps Sydney customers choose a product path, prepare a clear scope and move toward installation with more confidence.</p>
        </div>
        <div className="home-seo-grid" aria-label="Useful flooring pages">
          {seoLinks.map(([label, href]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </div>
      </section>

      <section className="section home-faq" aria-labelledby="faqTitle">
        <div className="home-section-head">
          <p className="eyebrow">FAQs</p>
          <h2 id="faqTitle">Questions people ask before quoting</h2>
        </div>
        <div className="faq">
          {faqItems.map(([question, answer], index) => (
            <details key={question} open={index === 0}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section home-final-cta" aria-labelledby="finalCtaTitle">
        <p className="eyebrow">Ready when you are</p>
        <h2 id="finalCtaTitle">Start with the details you know now.</h2>
        <p>Choose product direction, add area and include the main project notes. Final scope is reviewed before booking.</p>
        <div className="home-actions">
          <a className="button button-primary" data-track-cta="final_cta_start_quote" href={routes.quote}>Start quote</a>
          <a className="button button-secondary" data-track-cta="final_cta_review_quote" href={routes.quoteReview}>Check existing quote</a>
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: siteConfig.name,
            email: siteConfig.email,
            telephone: siteConfig.phone,
            image: absoluteUrl("/assets/operon-social-preview.png"),
            areaServed: { "@type": "City", name: "Sydney" },
            url: siteConfig.origin,
            description: "Sydney flooring quote and installation service for hybrid, laminate and engineered timber flooring."
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Instant flooring quote and installation service",
            serviceType: "Flooring quote Sydney",
            provider: { "@type": "LocalBusiness", name: siteConfig.name, url: siteConfig.origin },
            areaServed: { "@type": "City", name: "Sydney" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Flooring quote services",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hybrid flooring Sydney" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Laminate flooring Sydney" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Engineered timber flooring Sydney" } }
              ]
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map(([question, answer]) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: { "@type": "Answer", text: answer }
            }))
          }
        ]}
      />
      <HomeChatbot />
    </Layout>
  );
}
