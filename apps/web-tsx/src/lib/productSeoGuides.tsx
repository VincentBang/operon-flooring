import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const site = "https://operonflooring.com.au";
const image = "/assets/operon-social-preview.png";

type ProductGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  targetKeyword: string;
  intro: string;
  whoFor: string[];
  pros: string[];
  cons: string[];
  quoteImplications: string[];
  projectProof: string;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; title: string; body: string }>;
};

export const productSeoGuides: Record<string, ProductGuide> = {
  "laminate-vs-hybrid": {
    slug: "laminate-vs-hybrid",
    title: "Hybrid vs Laminate Flooring | Sydney Product Comparison",
    description:
      "Compare hybrid and laminate flooring for Sydney homes, apartments and rental upgrades, including pros, cons, quote implications and scope questions.",
    h1: "Hybrid vs laminate flooring",
    eyebrow: "Product comparison",
    targetKeyword: "hybrid vs laminate flooring",
    intro:
      "Hybrid and laminate are both practical timber-look flooring options, but they suit different risk profiles. The better choice depends on room moisture, durability expectations, underlay, budget discipline and how clearly the quote describes scope.",
    whoFor: [
      "Hybrid suits busy homes, units and rentals where spill resistance and easy cleaning matter.",
      "Laminate suits dry internal rooms where value, timber look and a more budget-conscious path are important.",
      "Both can work in apartments when acoustic and strata requirements are checked before quoting."
    ],
    pros: [
      "Hybrid is usually easier to shortlist for spill-prone everyday areas.",
      "Laminate can offer a strong timber-look value path in bedrooms and dry living spaces.",
      "Both product paths can be carried into the quote flow with area, removal and finishing notes."
    ],
    cons: [
      "Hybrid is not a substitute for solving subfloor moisture or poor installation detail.",
      "Laminate is more sensitive to wet cleaning, water bowls and moisture at joins.",
      "Both quotes can become misleading if underlay, trims, disposal or prep are not written clearly."
    ],
    quoteImplications: [
      "Compare the same measured area before judging totals.",
      "Check underlay, acoustic requirements and floor preparation assumptions.",
      "Ask whether removal, disposal, trims, scotia, skirting and door trimming are included."
    ],
    projectProof:
      "Recent Sydney project proof is useful because it shows how product choice, room use and finishing details affect the finished result, not just the product name.",
    faqs: [
      {
        question: "Is hybrid always better than laminate?",
        answer:
          "No. Hybrid is often more practical where spill resistance matters, while laminate can still be a sensible dry-room value option. The right answer depends on room use and quote scope."
      },
      {
        question: "Can I compare both options before choosing?",
        answer:
          "Yes. Start with the same area and compare hybrid and laminate paths so the difference reflects product choice rather than a different scope."
      }
    ],
    related: [
      { href: routes.hybrid, title: "Hybrid flooring Sydney", body: "Review the hybrid category page." },
      { href: routes.laminate, title: "Laminate flooring Sydney", body: "Review the laminate category page." },
      { href: routes.quoteReview, title: "Review a quote", body: "Check whether product and scope are written clearly." }
    ]
  },
  "hybrid-vs-engineered-timber": {
    slug: "hybrid-vs-engineered-timber",
    title: "Hybrid vs Engineered Timber Flooring | Sydney Comparison",
    description:
      "Compare hybrid and engineered timber flooring for Sydney homes, including who each suits, pros, cons, quote implications and finishing details.",
    h1: "Hybrid vs engineered timber flooring",
    eyebrow: "Product comparison",
    targetKeyword: "hybrid vs engineered timber",
    intro:
      "Hybrid is usually chosen for practical day-to-day resilience. Engineered timber is usually chosen for premium timber character. The quote should make that product intention clear before the total is compared.",
    whoFor: [
      "Hybrid suits practical upgrades, rentals, units and busy family spaces.",
      "Engineered timber suits owners prioritising natural timber character and a more premium finish.",
      "Both need the right subfloor, trims and installation assumptions written into the quote."
    ],
    pros: [
      "Hybrid can be easier to manage for everyday spill and cleaning routines.",
      "Engineered timber offers more authentic timber appearance and finish depth.",
      "Both can work well when product, area, prep and finish details are properly scoped."
    ],
    cons: [
      "Hybrid may not deliver the same premium timber feel as engineered timber.",
      "Engineered timber normally requires more care around moisture, scratches and environmental conditions.",
      "A vague quote can hide big differences in product category and installation method."
    ],
    quoteImplications: [
      "Confirm product category and range before comparing.",
      "Check whether installation method, underlay or adhesive method is clear.",
      "Review floor preparation, stairs, trims and skirting because finish expectations differ."
    ],
    projectProof:
      "Use recent timber and hybrid project examples to judge finish expectations, stairs, trims and room suitability before deciding.",
    faqs: [
      {
        question: "Is engineered timber worth it over hybrid?",
        answer:
          "It can be worth it when natural timber character is the priority and the home suits the care requirements. Hybrid may be the better practical option for rentals or busier moisture-risk spaces."
      },
      {
        question: "Can a quote compare hybrid and engineered timber fairly?",
        answer:
          "Yes, but only if area, preparation, installation method and finishing scope are kept consistent."
      }
    ],
    related: [
      { href: routes.hybrid, title: "Hybrid flooring Sydney", body: "Read the practical category guide." },
      { href: routes.engineered, title: "Engineered timber Sydney", body: "Read the premium timber category guide." },
      { href: routes.products, title: "Browse products", body: "Compare categories and ranges." }
    ]
  },
  "best-flooring-for-apartments-sydney": {
    slug: "best-flooring-for-apartments-sydney",
    title: "Best Flooring For Apartments Sydney | Acoustic & Quote Guide",
    description:
      "Compare apartment flooring options in Sydney, including hybrid, laminate, engineered timber, acoustic underlay, strata notes and quote implications.",
    h1: "Best flooring for apartments Sydney",
    eyebrow: "Apartment flooring",
    targetKeyword: "best flooring for apartments",
    intro:
      "Apartment flooring is not only a product choice. Acoustic underlay, strata requirements, lift access, parking, waste removal and installation timing can all affect the quote.",
    whoFor: [
      "Apartment owners replacing old carpet, laminate or floating floors.",
      "Investors upgrading rental units before leasing.",
      "Customers who need acoustic or strata details checked before accepting a quote."
    ],
    pros: [
      "Hybrid can be practical for apartment living areas when the system is suitable.",
      "Laminate can be a value option for dry internal rooms.",
      "Engineered timber can suit premium apartments where care and strata requirements are managed."
    ],
    cons: [
      "Strata or acoustic rules may limit product/underlay choices.",
      "Lift access, parking and disposal can change logistics.",
      "A quote that ignores acoustic details may not be ready for approval."
    ],
    quoteImplications: [
      "Ask whether acoustic underlay or strata documents are required.",
      "Confirm access, lift booking and waste removal assumptions.",
      "Check whether the quote includes trims, door clearance and occupied-home conditions."
    ],
    projectProof:
      "Apartment project proof should show how product choice, acoustic expectations and access constraints were handled, not just the finished floor colour.",
    faqs: [
      {
        question: "What flooring is best for apartments?",
        answer:
          "There is no single best product. Hybrid, laminate and engineered timber can all work in the right apartment, but acoustic and strata requirements must be checked."
      },
      {
        question: "Do apartments need acoustic underlay?",
        answer:
          "Many apartment projects need acoustic requirements reviewed. Confirm strata requirements before relying on a quote."
      }
    ],
    related: [
      { href: "/blog/apartment-flooring-acoustic-underlay.html", title: "Acoustic underlay guide", body: "Understand acoustic quote items." },
      { href: routes.floorplan, title: "Measure from floor plan", body: "Use apartment floor plans to estimate area." },
      { href: routes.quote, title: "Start apartment quote", body: "Add product, area and access notes." }
    ]
  },
  "best-flooring-for-rental-property": {
    slug: "best-flooring-for-rental-property",
    title: "Best Flooring For Rental Property | Durable Sydney Options",
    description:
      "Compare rental property flooring options including hybrid, laminate and engineered timber, with quote implications for durability, cleaning and replacement planning.",
    h1: "Best flooring for rental property",
    eyebrow: "Rental flooring",
    targetKeyword: "best flooring for rental property",
    intro:
      "Rental property flooring should balance durability, cleaning, replacement planning and presentation. The quote should also make removal, disposal and prep clear before work is booked.",
    whoFor: [
      "Sydney landlords refreshing a rental before a new tenant.",
      "Property managers comparing practical product options.",
      "Investors who want a clear replacement scope before approving work."
    ],
    pros: [
      "Hybrid is often shortlisted for busy rental living spaces.",
      "Laminate can work well in dry rooms where cost control matters.",
      "A clear quote helps compare product and scope without exposing internal pricing."
    ],
    cons: [
      "The cheapest product may not be the easiest to maintain between tenants.",
      "Moisture-prone areas can make laminate a weaker choice.",
      "Vague removal, disposal or preparation wording can create approval delays."
    ],
    quoteImplications: [
      "Ask whether removal and disposal are included.",
      "Check floor preparation and trims because rental jobs often need fast turnaround.",
      "Confirm which rooms are included and whether furniture or tenant access affects timing."
    ],
    projectProof:
      "Rental project proof is strongest when it shows a tidy finish, practical product choice and clear before/after scope rather than only colour selection.",
    faqs: [
      {
        question: "Is hybrid good for rental properties?",
        answer:
          "Hybrid is commonly shortlisted because it is practical for busy homes, but suitability still depends on rooms, subfloor, product choice and installation details."
      },
      {
        question: "Is laminate good for rentals?",
        answer:
          "Laminate can suit dry rental rooms when value matters and moisture risk is low. The quote should still make underlay and prep clear."
      }
    ],
    related: [
      { href: routes.products, title: "Browse rental-friendly products", body: "Compare practical categories and ranges." },
      { href: "/blog/best-flooring-for-pets-sydney.html", title: "Pet-friendly flooring", body: "Useful for rental wear planning." },
      { href: routes.quote, title: "Start rental quote", body: "Add rooms, area and removal scope." }
    ]
  },
  "waterproof-flooring-sydney": {
    slug: "waterproof-flooring-sydney",
    title: "Waterproof Flooring Sydney | Hybrid, Laminate & Quote Scope",
    description:
      "Understand waterproof flooring claims in Sydney, including hybrid flooring, water-resistant laminate, product limits, quote implications and questions to ask.",
    h1: "Waterproof flooring Sydney",
    eyebrow: "Buyer guide",
    targetKeyword: "waterproof flooring Sydney",
    intro:
      "Waterproof flooring claims need careful reading. Product water resistance is not the same as ignoring leaks, wet subfloors, poor joins or incorrect installation detail.",
    whoFor: [
      "Customers comparing hybrid flooring and water-resistant laminate.",
      "Homes with pets, kids, kitchens, entries or busy living areas.",
      "Anyone who wants the quote to state product limits and installation assumptions clearly."
    ],
    pros: [
      "Hybrid is often the practical shortlist for water-resistance discussions.",
      "Some laminate ranges are marketed as water-resistant for everyday spills.",
      "Clear product wording helps avoid comparing unlike-for-like claims."
    ],
    cons: [
      "No floating floor should be treated as a fix for active leaks or damp subfloors.",
      "Water-resistant laminate still needs product limits understood.",
      "A vague quote may not distinguish product warranty claims from installation suitability."
    ],
    quoteImplications: [
      "Ask what product claim is being relied on and what conditions apply.",
      "Confirm subfloor moisture and wet-area suitability where relevant.",
      "Check trims, expansion gaps and installation detail because water performance is not only the board."
    ],
    projectProof:
      "Project proof should show where the product is used and how entries, kitchens, trims or transitions were finished.",
    faqs: [
      {
        question: "Is hybrid flooring waterproof?",
        answer:
          "Hybrid is commonly discussed as a water-resistant or waterproof-style option, but site conditions, joins, trims and installation detail still matter."
      },
      {
        question: "Is waterproof flooring suitable for bathrooms?",
        answer:
          "Do not assume. Wet-area suitability depends on product, manufacturer guidance, waterproofing requirements and installation conditions."
      }
    ],
    related: [
      { href: routes.hybrid, title: "Hybrid flooring Sydney", body: "Review the practical category path." },
      { href: routes.products, title: "Browse product ranges", body: "Compare hybrid and laminate ranges." },
      { href: routes.quoteReview, title: "Review a waterproof flooring quote", body: "Check product claims and missing assumptions." }
    ]
  },
  "apartment-flooring-acoustic-underlay": {
    slug: "apartment-flooring-acoustic-underlay",
    title: "Acoustic Underlay For Apartments | Flooring Quote Guide",
    description:
      "Understand acoustic underlay for apartment flooring quotes, including strata requirements, product compatibility, quote scope and questions to ask.",
    h1: "Acoustic underlay for apartments",
    eyebrow: "Apartment guide",
    targetKeyword: "acoustic underlay for apartments",
    intro:
      "Acoustic underlay can be a decision point for apartment flooring. It should be treated as a written quote item, not an assumption.",
    whoFor: [
      "Apartment owners replacing carpet or floating floors.",
      "Customers needing strata approval or acoustic documentation.",
      "Anyone comparing quotes where one includes underlay and another does not."
    ],
    pros: [
      "Acoustic underlay can help meet apartment expectations when correctly specified.",
      "Written underlay details make quote comparison clearer.",
      "It can influence comfort, sound transfer and product suitability."
    ],
    cons: [
      "Not every underlay suits every flooring product.",
      "Strata requirements may need documentation before approval.",
      "A quote that says underlay without detail may still be unclear."
    ],
    quoteImplications: [
      "Ask whether acoustic underlay is included and what product/specification is proposed.",
      "Confirm strata requirements before approving the flooring quote.",
      "Check whether doors, trims and floor height changes are affected."
    ],
    projectProof:
      "Apartment proof should show product choice, acoustic consideration and access planning, not just the final colour.",
    faqs: [
      {
        question: "Do all apartments need acoustic underlay?",
        answer:
          "Not always, but many strata projects require acoustic performance to be considered. Check the building requirements before accepting a quote."
      },
      {
        question: "Can acoustic underlay be added to any flooring?",
        answer:
          "No. Underlay must be compatible with the selected flooring system and installation method."
      }
    ],
    related: [
      { href: "/apartment-flooring-sydney.html", title: "Apartment flooring Sydney", body: "Compare apartment quote and product considerations." },
      { href: routes.quoteReview, title: "Review apartment quote", body: "Check underlay and strata details." },
      { href: routes.floorplan, title: "Use floor plan area", body: "Estimate apartment area before quoting." }
    ]
  },
  "flooring-stairs-and-stair-nosing": {
    slug: "flooring-stairs-and-stair-nosing",
    title: "Stair Flooring And Trims | Sydney Quote Scope Guide",
    description:
      "Understand stair flooring, stair nosing, trims, scotia, skirting and transition details before comparing Sydney flooring quotes.",
    h1: "Stair flooring and trims",
    eyebrow: "Finish guide",
    targetKeyword: "stair flooring and trims",
    intro:
      "Stairs and trims are where many flooring quotes become hard to compare. They affect labour, finish, safety expectations and the final look of the job.",
    whoFor: [
      "Homes with stairs, split levels or step-down living areas.",
      "Customers deciding between scotia, skirting, trims and transitions.",
      "Anyone comparing quotes where stair details are missing or vague."
    ],
    pros: [
      "Clear stair and trim details improve finish expectations.",
      "Written nosing and transition scope makes quotes easier to compare.",
      "Good finishing details reduce disputes after installation."
    ],
    cons: [
      "Stairs are not the same as open floor area.",
      "Trims, scotia and skirting can be left vague in cheaper-looking quotes.",
      "Door trimming or transitions may be missed if not written."
    ],
    quoteImplications: [
      "Ask for stair counts, stair type and nosing details.",
      "Confirm trims, transitions, scotia and skirting method.",
      "Check whether door trimming and edge finishing are included."
    ],
    projectProof:
      "Recent project proof is useful when it shows stair nosing, transitions and wall-edge finishing, not only broad floor photos.",
    faqs: [
      {
        question: "Are stairs priced like normal floor area?",
        answer:
          "No. Stairs usually require separate detail because they involve treads, risers, nosing, cutting and finishing."
      },
      {
        question: "Should trims be listed in the quote?",
        answer:
          "Yes. Trims, scotia, skirting and transitions affect appearance and should be written clearly."
      }
    ],
    related: [
      { href: routes.recentProjects, title: "Recent project proof", body: "Look for stair and trim examples." },
      { href: routes.quoteReview, title: "Review stair quote", body: "Check missing stair or trim details." },
      { href: routes.quote, title: "Start quote", body: "Add stairs and finishing notes." }
    ]
  }
};

export const productAuthoritySupplements = {
  hybrid: {
    title: "Hybrid flooring is best when practical day-to-day performance matters",
    whoFor: "Busy Sydney homes, apartments, rentals and family areas where spill resistance and cleaning ease matter.",
    pros: "Practical water-resistance positioning, easy cleaning, strong everyday shortlist for high-use rooms.",
    cons: "Still needs suitable subfloor, trims, expansion detail and realistic product limits.",
    quote: "Confirm product range, measured area, removal/disposal, underlay, prep and finishing scope.",
    proof: "Use recent project examples to judge colour, trim detail and room suitability before choosing."
  },
  laminate: {
    title: "Laminate flooring is best when dry-room value matters",
    whoFor: "Dry internal rooms, rental upgrades, bedrooms and budget-conscious timber-look renovations.",
    pros: "Strong value path, broad timber-look selection and useful for straightforward dry rooms.",
    cons: "Less forgiving around moisture, wet cleaning and water bowls than more practical categories.",
    quote: "Check underlay, area basis, prep, trims, disposal and product water-resistance wording.",
    proof: "Project proof helps set expectations for colour, board style and dry-area use."
  },
  engineered: {
    title: "Engineered timber is best when premium timber character matters",
    whoFor: "Owners prioritising a more natural timber look in renovations, feature spaces and higher-finish homes.",
    pros: "Premium appearance, natural timber character and stronger design presence than most timber-look products.",
    cons: "Needs more care around moisture, scratches, finish expectations and installation conditions.",
    quote: "Confirm product/range, installation method, prep, stairs, trims/skirting and finish assumptions.",
    proof: "Recent project proof is useful for judging finish, herringbone/chevron detail and stair transitions."
  }
} as const;

const productGuideAuthorityLinks = [
  {
    href: routes.products,
    title: "Browse the product catalogue",
    body: "Shortlist hybrid, laminate or engineered timber ranges before estimating."
  },
  {
    href: `${routes.quote}?from=product_guide`,
    title: "Start quote with product direction",
    body: "Carry the product category into a structured quote with area and scope details."
  },
  {
    href: routes.quoteReview,
    title: "Review an existing product quote",
    body: "Check whether the written quote names the product, range, inclusions and exclusions clearly."
  },
  {
    href: routes.floorplan,
    title: "Measure rooms from a floor plan",
    body: "Use floorplan area when the product quote does not show a reliable measurement."
  },
  {
    href: routes.flooringQuoteSydney,
    title: "Flooring quote Sydney guide",
    body: "Understand how product choice, area and scope should connect before comparing totals."
  },
  {
    href: "/blog/how-to-compare-flooring-quotes.html",
    title: "How to compare flooring quotes",
    body: "Normalise product, area, removal, preparation and finishing scope before deciding."
  }
];

export function getProductGuideMetadata(slug: string): Metadata {
  const guide = productSeoGuides[slug];

  return createPageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/blog/${guide.slug}.html`,
    image,
    robots: "index,follow"
  });
}

function productGuideJsonLd(guide: ProductGuide) {
  const url = `${site}/blog/${guide.slug}.html`;

  return [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.h1,
      description: guide.description,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Operon Flooring", url: site },
      publisher: {
        "@type": "Organization",
        name: "Operon Flooring",
        logo: { "@type": "ImageObject", url: `${site}/assets/operon-flooring-sydney-brand-logo.webp` }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${site}/` },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${site}/blog/` },
        { "@type": "ListItem", position: 3, name: guide.h1, item: url }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer }
      }))
    }
  ];
}

function CardList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="section-card">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <ul className="check-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function ProductGuidePage({ slug }: { slug: string }) {
  const guide = productSeoGuides[slug];

  return (
    <Layout>
      <JsonLd data={productGuideJsonLd(guide)} />
      <article className="legacy-seo-content">
        <section className="hero">
          <div className="shell">
            <div className="hero-card">
              <nav className="breadcrumbs" aria-label="Breadcrumb">
                <Link href="/">Home</Link>
                <span>/</span>
                <a href={routes.blog}>Guides</a>
                <span>/</span>
                <span>{guide.h1}</span>
              </nav>
              <span className="eyebrow">{guide.eyebrow}</span>
              <h1>{guide.h1}</h1>
              <p>{guide.intro}</p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button" href={routes.products} data-track-cta="product_cluster_products">
                  Browse flooring products
                </Link>
                <Link className="button-secondary" href={`${routes.quote}?from=product_guide&guide=${guide.slug}`} data-track-cta="product_cluster_quote">
                  Start a flooring quote
                </Link>
                <Link className="button-quiet" href={routes.quoteReview} data-track-cta="product_cluster_review">
                  Review an existing quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-3">
            <CardList title="Who it is for" items={guide.whoFor} />
            <CardList title="Pros" items={guide.pros} />
            <CardList title="Cons / watch-outs" items={guide.cons} />
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <CardList title="Quote implications" items={guide.quoteImplications} />
            <div className="section-card">
              <span className="eyebrow">Project proof</span>
              <h2 style={{ marginTop: 18 }}>Use finished jobs to check expectations</h2>
              <p>{guide.projectProof}</p>
              <div className="hero-actions" style={{ marginTop: 24 }}>
                <Link className="button-secondary" href={routes.recentProjects}>
                  View recent projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-card">
              <span className="eyebrow">Product choice to quote path</span>
              <h2 style={{ marginTop: 18 }}>Connect the product decision to quote clarity</h2>
              <p>
                A product guide is most useful when it leads into the next quote step. Use these links to compare ranges, start an estimate, review a
                written quote or measure area before the product decision becomes a booking decision.
              </p>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {productGuideAuthorityLinks.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="shell grid-2">
            <div className="section-card">
              <span className="eyebrow">Related guides</span>
              <h2 style={{ marginTop: 18 }}>Keep comparing product and scope</h2>
              <div className="link-grid" style={{ marginTop: 22 }}>
                {guide.related.map((link) => (
                  <Link className="link-card" href={link.href} key={link.href}>
                    <strong>{link.title}</strong>
                    <span>{link.body}</span>
                  </Link>
                ))}
              </div>
            </div>
            <div className="section-card">
              <span className="eyebrow">FAQs</span>
              <h2 style={{ marginTop: 18 }}>Common questions</h2>
              <div className="faq-accordion">
                {guide.faqs.map((faq) => (
                  <details className="faq-toggle" key={faq.question}>
                    <summary>{faq.question}</summary>
                    <div className="faq-toggle-body">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </article>
    </Layout>
  );
}

export function ProductAuthoritySection({ category }: { category: keyof typeof productAuthoritySupplements }) {
  const item = productAuthoritySupplements[category];

  return (
    <section className="section" aria-label="Product authority">
      <div className="shell">
        <article className="section-card">
          <span className="eyebrow">Product fit and quote scope</span>
          <h2 style={{ marginTop: 18 }}>{item.title}</h2>
          <div className="link-grid" style={{ marginTop: 22 }}>
            <div className="link-card">
              <strong>Who it is for</strong>
              <span>{item.whoFor}</span>
            </div>
            <div className="link-card">
              <strong>Pros</strong>
              <span>{item.pros}</span>
            </div>
            <div className="link-card">
              <strong>Cons / watch-outs</strong>
              <span>{item.cons}</span>
            </div>
            <div className="link-card">
              <strong>Quote implications</strong>
              <span>{item.quote}</span>
            </div>
            <Link className="link-card" href={routes.recentProjects}>
              <strong>Project proof</strong>
              <span>{item.proof}</span>
            </Link>
            <Link className="link-card" href={routes.quoteReview}>
              <strong>Already have a quote?</strong>
              <span>Check whether product, area and inclusions are clear before comparing totals.</span>
            </Link>
          </div>
          <div className="hero-actions" style={{ marginTop: 24 }}>
            <Link className="button" href={routes.products}>
              Browse flooring products
            </Link>
            <Link className="button-secondary" href={routes.quote}>
              Start a flooring quote
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
