import type { Metadata } from "next";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type ProjectCaseStudy = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  suburb: string;
  flooringType: string;
  productRange: string;
  propertyType: string;
  challenge?: string;
  preparation?: string;
  installationNotes?: string[];
  finishedResult: string;
  quoteClarityLesson: string;
  quoteReviewRelevant: boolean;
  primaryImage: ProjectImage;
  photos: ProjectImage[];
  tags: string[];
};

const notSpecified = "Range not named in available project source";
const photoFocusedNote =
  "This project example focuses on the flooring finish and preparation details visible in the project photos.";

export const projectCaseStudies: ProjectCaseStudy[] = [
  {
    slug: "engineered-herringbone-timber-stair-sydney",
    title: "Engineered herringbone timber flooring with stair detail",
    shortTitle: "Herringbone timber and stair detail",
    description:
      "A Sydney engineered timber project example showing herringbone flooring through a kitchen and living area, plus a finished stair detail that makes stair scope worth clarifying before quoting.",
    suburb: "Sydney",
    flooringType: "Engineered timber",
    productRange: notSpecified,
    propertyType: "Residential interior with kitchen, living area and stair zone",
    challenge: "The photos show a feature herringbone floor and a stair area. For this style of work, pattern layout, stair detail and transitions should be explicit in the written scope before a customer compares quotes. Herringbone work also needs more careful expectation-setting than a standard straight plank floor because the pattern direction and room alignment are part of the finished result.",
    preparation: `${photoFocusedNote} Any similar project should confirm whether preparation, levelling or stair substrate work is included, excluded or subject to site review before installation is booked.`,
    installationNotes: [
      "The herringbone layout is visible through the kitchen and living area, which makes pattern format a key scope item.",
      "The project photo set includes a finished stair detail, so stair treads, nosing, trims and transitions should not be treated as vague extras.",
      "The available photos support finish and stair observations; product range and full preparation history should be confirmed in writing for any similar quote.",
      "A customer comparing quotes for this look should ask whether herringbone labour, stair work and trims are included in the same scope or listed separately.",
      "Photos help set finish expectations, but the quote still needs measured area, product specification, stair count and exclusion wording before approval.",
      "For patterned timber plus stairs, customers should also ask how waste allowance, threshold trims and finishing pieces are handled so the quote does not rely on vague after-site extras."
    ],
    finishedResult:
      "The finished engineered timber creates a patterned kitchen/living floor with a coordinated stair detail. The result feels more like a feature finish than a standard straight-plank installation, which is why scope clarity matters before the customer compares totals.",
    quoteClarityLesson:
      "A quote for this style of project should separate the engineered timber product, herringbone installation method, stair details, trims, transitions and preparation assumptions before the total is compared. If a written quote only says engineered timber installed, it is not specific enough for this kind of finish.",
    quoteReviewRelevant: true,
    primaryImage: {
      src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-herringbone-timber-flooring-sydney-kitchen-living.jpg",
      alt: "Finished engineered herringbone timber flooring in a Sydney kitchen and living area",
      width: 1118,
      height: 944,
      caption: "Finished engineered herringbone timber flooring in a kitchen and living area."
    },
    photos: [
      {
        src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-herringbone-timber-flooring-sydney-kitchen-living.jpg",
        alt: "Finished engineered herringbone timber flooring in a Sydney kitchen and living area",
        width: 1118,
        height: 944,
        caption: "Herringbone flooring through the kitchen and living space."
      },
      {
        src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-timber-stair-sydney.jpg",
        alt: "Finished engineered timber stair installation in Sydney",
        width: 1500,
        height: 1125,
        caption: "Finished engineered timber stair detail."
      }
    ],
    tags: ["Engineered timber", "Herringbone", "Stairs", "Sydney"]
  },
  {
    slug: "wide-long-engineered-herringbone-flooring-sydney",
    title: "Wide, long engineered herringbone flooring",
    shortTitle: "Wide herringbone flooring",
    description:
      "A Sydney engineered herringbone flooring project example with wide, long boards shown through kitchen and living spaces.",
    suburb: "Sydney",
    flooringType: "Engineered timber",
    productRange: notSpecified,
    propertyType: "Residential kitchen and living areas",
    challenge: "The photos show a larger-format herringbone layout where board direction, room flow and edge alignment become part of the visible finish. This is the kind of project where a short generic flooring quote can miss important installation detail. The wider visual rhythm also means customers should check how the pattern will sit in each room before accepting the scope.",
    preparation: `${photoFocusedNote} A similar quote should explain whether subfloor preparation is already allowed for or whether it will be reviewed separately after site inspection.`,
    installationNotes: [
      "Wide, long engineered herringbone boards are visible in the finished kitchen and living spaces.",
      "The photos show how the pattern works across open rooms, not only as a small product sample.",
      "For a similar quote, customers should ask how the pattern, area basis, trims and room transitions are handled.",
      "Patterned timber work should state whether the quote is based on herringbone installation rather than a standard plank installation.",
      "A customer should also ask how waste allowance, edge cuts, doorways and transitions are handled in the written scope.",
      "The visible kitchen and living-room examples make this page useful for customers who want to understand pattern scale before choosing a product direction.",
      "Before booking a similar job, the written quote should confirm whether the same flooring direction continues through both spaces or changes at thresholds."
    ],
    finishedResult:
      "The finished floor gives the kitchen and living areas a calm, premium patterned timber look. The wider herringbone format makes the layout feel deliberate rather than busy, and the room photos help show how the pattern reads at normal viewing distance.",
    quoteClarityLesson:
      "For wide herringbone work, the quote should make pattern format, installation method, area basis, trims, transitions and preparation assumptions clear before comparing price. A quote with the same product name can still be different if it does not include the same pattern and finishing scope, so customers should ask for the room list and finish details in writing.",
    quoteReviewRelevant: true,
    primaryImage: {
      src: "/images/projects/wide-long-engineered-herringbone-flooring-sydney/finished-wide-long-engineered-herringbone-flooring-kitchen-sydney.jpg",
      alt: "Finished wide and long plank engineered herringbone flooring in a Sydney kitchen",
      width: 1500,
      height: 1125,
      caption: "Finished wide herringbone timber flooring in a kitchen area."
    },
    photos: [
      {
        src: "/images/projects/wide-long-engineered-herringbone-flooring-sydney/finished-wide-long-engineered-herringbone-flooring-kitchen-sydney.jpg",
        alt: "Finished wide and long plank engineered herringbone flooring in a Sydney kitchen",
        width: 1500,
        height: 1125,
        caption: "Kitchen view of the finished wide herringbone floor."
      },
      {
        src: "/images/projects/wide-long-engineered-herringbone-flooring-sydney/finished-wide-long-engineered-herringbone-flooring-living-room-sydney.jpg",
        alt: "Finished wide and long plank engineered herringbone flooring in a Sydney living room",
        width: 1500,
        height: 1125,
        caption: "Living-room view of the finished wide herringbone floor."
      }
    ],
    tags: ["Engineered timber", "Wide herringbone", "Kitchen", "Living room"]
  },
  {
    slug: "engineered-chevron-flooring-sydney",
    title: "Engineered chevron flooring in a sunlit Sydney room",
    shortTitle: "Chevron engineered flooring",
    description:
      "A Sydney engineered chevron flooring project example showing a finished oak-pattern floor in a bright room.",
    suburb: "Sydney",
    flooringType: "Engineered timber",
    productRange: "Oak-pattern chevron finish visible",
    propertyType: "Residential room",
    challenge: "The photos show a chevron pattern where alignment, direction and the room setting are central to the finished look. Patterned engineered timber needs more scope clarity than a simple product-and-area quote. The pattern should be treated as an installation decision, not merely a colour or product preference.",
    preparation: `${photoFocusedNote} Any similar quote should confirm whether preparation is included in the initial scope or will be assessed before installation starts.`,
    installationNotes: [
      "The chevron pattern is visible in the finished room and should be named clearly in any comparable quote.",
      "The photo set includes both room and oak-pattern detail views, which helps customers understand the visual effect beyond a small swatch.",
      "A similar quote should clarify pattern format, board direction, product specification, trims and preparation assumptions.",
      "Chevron flooring should also make transition details clear, especially where the pattern meets adjoining rooms or thresholds.",
      "Customers should check whether the quote describes a chevron-specific installation or only lists engineered timber generally.",
      "The close-up photo is useful for colour and grain expectation, while the room photo is better for judging pattern scale.",
      "If a customer is comparing quotes, the chevron format should be written into each quote so the comparison is not against a simpler straight-plank scope.",
      "Customers should also ask whether layout planning, border details and any extra cuts around walls or openings are included in the described installation scope."
    ],
    finishedResult:
      "The finished chevron floor creates a structured timber pattern in a bright room. The room photo shows how the pattern changes the feel of the whole space, while the detail image supports colour and grain expectations before a customer commits to a similar direction. This makes the page useful for customers deciding whether they want a feature patterned finish or a simpler plank layout.",
    quoteClarityLesson:
      "Chevron work should be quoted with the pattern format, product/range, area, preparation and finishing assumptions written clearly. If those details are missing, the customer may be comparing a patterned finish against a simpler installation scope. The quote should also clarify trims, thresholds and any room-specific layout decisions before approval.",
    quoteReviewRelevant: true,
    primaryImage: {
      src: "/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg",
      alt: "Finished engineered chevron flooring in a sunlit Sydney room",
      width: 1500,
      height: 1125,
      caption: "Finished engineered chevron flooring in a sunlit room."
    },
    photos: [
      {
        src: "/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg",
        alt: "Finished engineered chevron flooring in a sunlit Sydney room",
        width: 1500,
        height: 1125,
        caption: "Chevron flooring in a finished room."
      },
      {
        src: "/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-oak-pattern-sydney.jpg",
        alt: "Finished engineered chevron flooring oak pattern in Sydney",
        width: 1500,
        height: 1125,
        caption: "Closer view of the oak-pattern chevron finish."
      }
    ],
    tags: ["Engineered timber", "Chevron", "Oak pattern", "Sydney"]
  },
  {
    slug: "hybrid-floor-levelling-case-study-sydney",
    title: "Hybrid flooring after floor levelling",
    shortTitle: "Hybrid after floor levelling",
    description:
      "A Sydney hybrid flooring project example showing old floor removal, subfloor preparation, floor levelling and finished hybrid flooring.",
    suburb: "Sydney",
    flooringType: "Hybrid flooring",
    productRange: notSpecified,
    propertyType: "Residential rooms and hallway",
    challenge:
      "The photos show old floor removal and subfloor preparation before the finished hybrid floor. This makes preparation the key quote clarity item, because a simple installation total may not explain the work needed below the visible finish. This example is useful because it shows the before, during and after story rather than only the final colour.",
    preparation:
      "Old tile removal, subfloor preparation and floor levelling are visible in the source photo set.",
    installationNotes: [
      "Before photos show removal and preparation work, including surfaces that needed to be made ready before the final floor.",
      "After photos show hybrid flooring through open-plan, bedroom and hallway areas.",
      "For a similar quote, removal, disposal, levelling, floor preparation and final flooring scope should be written separately enough for the customer to understand.",
      "Customers should ask what happens if extra levelling or preparation is found after the old flooring is removed.",
      "Floorplan area can help estimate the job, but preparation assumptions still need written review before booking."
    ],
    finishedResult:
      "The finished hybrid floor presents a cleaner timber-look surface after preparation and levelling. The contrast between the before and after photos makes the hidden preparation work easier to understand and helps explain why two hybrid flooring quotes can differ.",
    quoteClarityLesson:
      "A quote for this kind of project should not hide preparation behind a simple installation total. Removal, levelling, disposal and final flooring scope should be listed clearly, with review wording for anything that can only be confirmed after the old floor is lifted.",
    quoteReviewRelevant: true,
    primaryImage: {
      src: "/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg",
      alt: "Hybrid flooring installed after floor levelling in a Sydney open plan living area",
      width: 1500,
      height: 1125,
      caption: "Finished hybrid flooring after floor levelling."
    },
    photos: [
      {
        src: "/images/projects/hybrid-floor-levelling-case-study/before-floor-levelling-old-tile-removal-sydney.jpg",
        alt: "Old tile removal before floor levelling in a Sydney flooring project",
        width: 1500,
        height: 1125,
        caption: "Old flooring removal before preparation."
      },
      {
        src: "/images/projects/hybrid-floor-levelling-case-study/before-floor-levelling-sydney-subfloor-preparation.jpg",
        alt: "Sydney flooring project before floor levelling and subfloor preparation",
        width: 1500,
        height: 1125,
        caption: "Subfloor preparation before levelling."
      },
      {
        src: "/images/projects/hybrid-floor-levelling-case-study/after-floor-levelling-sydney-living-area.jpg",
        alt: "After floor levelling in a Sydney living area",
        width: 1500,
        height: 1125,
        caption: "Levelled surface before finished flooring."
      },
      {
        src: "/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg",
        alt: "Hybrid flooring installed after floor levelling in a Sydney open plan living area",
        width: 1500,
        height: 1125,
        caption: "Finished hybrid flooring in the open-plan area."
      },
      {
        src: "/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-bedroom-sydney.jpg",
        alt: "Hybrid flooring installed after floor levelling in a Sydney bedroom",
        width: 1500,
        height: 1125,
        caption: "Finished hybrid flooring in a bedroom."
      }
    ],
    tags: ["Hybrid flooring", "Floor levelling", "Preparation", "Removal"]
  },
  {
    slug: "engineered-straight-plank-direct-stick-stair-sydney",
    title: "Engineered straight plank direct-stick flooring and stair area",
    shortTitle: "Direct-stick engineered stair area",
    description:
      "A Sydney engineered timber project example showing straight plank direct-stick flooring through a stair area.",
    suburb: "Sydney",
    flooringType: "Engineered timber",
    productRange: notSpecified,
    propertyType: "Residential stair area",
    challenge: "The project image shows a stair zone, where product direction, installation method and transition detail should be clear. Stairs are rarely the place for vague quote wording. Even when the page has only one project photo, the image is enough to show why stair and transition details need their own scope notes.",
    preparation: `${photoFocusedNote} A similar project should clarify whether stair preparation, trims and substrate review are included or handled as separate confirmation items.`,
    installationNotes: [
      "Straight plank engineered timber is visible through the stair area.",
      "The source filename identifies the method as direct-stick.",
      "A similar quote should clarify stair detail, trims, transitions, preparation assumptions and the areas included.",
      "Customers should ask whether the quote includes stair treads, risers, nosing, landing areas and adjoining floor transitions.",
      "The installation method should be written clearly because direct-stick engineered timber has different scope expectations from floating or underlay-based flooring.",
      "This project example is especially useful for quote review because stairs can be hidden behind broad wording unless they are counted and described separately.",
      "Before comparing totals, customers should ask whether stair finishing is included in the main quote or marked for site confirmation.",
      "A direct-stick scope should also make preparation assumptions clear because adhesive-based timber work depends on the condition of the surface below the finished board.",
      "If a quote only lists engineered timber and a total area, customers should request a separate note for the stair zone before accepting it.",
      "The single available photo supports a focused lesson: stair zones are small in area but high in detail, so the written scope should explain the finish rather than relying only on square metres.",
      "For similar work, customers should provide stair photos early so the installer can identify open sides, returns, landing edges and any doorway or hallway transitions connected to the stair run."
    ],
    finishedResult:
      "The finished stair area uses straight plank engineered timber with a clean transition through the stair zone. The photo is useful because it focuses attention on detail work rather than only the broad floor area, which is often where quote comparison becomes unclear. Customers looking at similar work can use this example to ask for stair scope in plain language before comparing quotes.",
    quoteClarityLesson:
      "Direct-stick engineered timber and stairs should be quoted with installation method, stair detail, trims, area and preparation assumptions separated clearly. A customer should not have to guess whether stairs are included in a broad engineered timber total, or whether the stair finish will be priced separately after review. The safest comparison is a written scope that names the stair elements, the adjoining floor areas and anything still subject to site confirmation.",
    quoteReviewRelevant: true,
    primaryImage: {
      src: "/images/projects/engineered-straight-plank-direct-stick-sydney/finished-engineered-straight-plank-direct-stick-stair-sydney.jpg",
      alt: "Finished engineered straight plank direct stick flooring and stair in Sydney",
      width: 843,
      height: 1500,
      caption: "Finished engineered straight plank direct-stick flooring and stair area."
    },
    photos: [
      {
        src: "/images/projects/engineered-straight-plank-direct-stick-sydney/finished-engineered-straight-plank-direct-stick-stair-sydney.jpg",
        alt: "Finished engineered straight plank direct stick flooring and stair in Sydney",
        width: 843,
        height: 1500,
        caption: "Finished direct-stick engineered timber through the stair area."
      }
    ],
    tags: ["Engineered timber", "Direct stick", "Stairs", "Sydney"]
  }
];

export function getProjectCaseStudy(slug: string) {
  return projectCaseStudies.find((project) => project.slug === slug);
}

export function getProjectCaseStudyMetadata(slug: string): Metadata {
  const project = getProjectCaseStudy(slug);
  if (!project) {
    return {};
  }
  return createPageMetadata({
    title: `${project.shortTitle} | Operon Flooring Case Study`,
    description: project.description,
    path: `/projects/${project.slug}.html`,
    image: project.primaryImage.src
  });
}

function createJsonLd(project: ProjectCaseStudy) {
  const url = absoluteUrl(`/projects/${project.slug}.html`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl(routes.home) },
          { "@type": "ListItem", position: 2, name: "Recent projects", item: absoluteUrl(routes.recentProjects) },
          { "@type": "ListItem", position: 3, name: project.shortTitle, item: url }
        ]
      },
      {
        "@type": "Article",
        headline: project.title,
        description: project.description,
        image: project.photos.map((photo) => absoluteUrl(photo.src)),
        mainEntityOfPage: url,
        author: {
          "@type": "Organization",
          name: "Operon Flooring"
        },
        publisher: {
          "@type": "Organization",
          name: "Operon Flooring"
        },
        about: project.tags
      },
      {
        "@type": "ImageGallery",
        name: `${project.shortTitle} photos`,
        url,
        associatedMedia: project.photos.map((photo) => ({
          "@type": "ImageObject",
          contentUrl: absoluteUrl(photo.src),
          caption: photo.caption
        }))
      }
    ]
  };
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function ProjectCaseStudyPageView({ project }: { project: ProjectCaseStudy }) {
  return (
    <Layout>
      <JsonLd data={createJsonLd(project)} />
      <section className="hero">
        <div className="project-page-shell project-hero-grid">
          <article className="hero-card">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <a href={routes.home}>Home</a>
              <span>/</span>
              <a href={routes.recentProjects}>Recent projects</a>
              <span>/</span>
              <span>{project.shortTitle}</span>
            </nav>
            <span className="eyebrow">Project proof</span>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
            <div className="project-chip-row" aria-label="Project tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href={`${routes.quote}?from=project_proof#quoteForm`} data-track-cta="project_case_quote_click">Start flooring quote</a>
              {project.quoteReviewRelevant ? <a className="button button-secondary" href={routes.quoteReview} data-track-cta="project_case_review_click">Check an existing quote</a> : null}
            </div>
          </article>
          <figure className="project-hero-image">
            <img src={project.primaryImage.src} alt={project.primaryImage.alt} width={project.primaryImage.width} height={project.primaryImage.height} />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="project-page-shell grid-2">
          <article className="section-card">
            <span className="eyebrow">Project facts</span>
            <h2>Known details</h2>
            <div className="summary-grid estimate-detail-grid">
              <FactRow label="Suburb" value={project.suburb} />
              <FactRow label="Flooring type" value={project.flooringType} />
              <FactRow label="Product/range" value={project.productRange} />
              <FactRow label="Property type" value={project.propertyType} />
            </div>
          </article>
          <article className="section-card">
            <span className="eyebrow">Quote clarity lesson</span>
            <h2>What this project teaches before quoting</h2>
            <p>{project.quoteClarityLesson}</p>
            <div className="hero-actions">
              <a className="button button-secondary" href={routes.quoteReview}>Review quote scope</a>
              <a className="button button-secondary" href={routes.products}>Browse products</a>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="project-page-shell">
          <div className="project-section-head">
            <div>
              <span className="eyebrow">Scope notes</span>
              <h2>Challenge, preparation and installation notes</h2>
            </div>
            <p>These notes focus on details supported by the available project photos and source files.</p>
          </div>
          <div className="project-proof-points">
            <article className="project-proof-point">
              <strong>Challenge</strong>
              <span>{project.challenge || photoFocusedNote}</span>
            </article>
            <article className="project-proof-point">
              <strong>Preparation</strong>
              <span>{project.preparation || photoFocusedNote}</span>
            </article>
            <article className="project-proof-point">
              <strong>Finished result</strong>
              <span>{project.finishedResult}</span>
            </article>
          </div>
          <article className="section-card" style={{ marginTop: 22 }}>
            <span className="eyebrow">Installation notes</span>
            <ul className="check-list">
              {project.installationNotes?.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="project-page-shell">
          <div className="project-section-head">
            <div>
              <span className="eyebrow">Photos</span>
              <h2>Project photo evidence</h2>
            </div>
            <p>Photos are used as project proof, not as a promise that every job has the same conditions.</p>
          </div>
          <div className={project.photos.length === 1 ? "project-grid project-grid-feature" : "project-grid"}>
            {project.photos.map((photo) => (
              <figure className="project-card-photo" key={photo.src}>
                <img src={photo.src} alt={photo.alt} loading="lazy" width={photo.width} height={photo.height} />
                <figcaption>
                  <strong>{photo.caption}</strong>
                  <span>{project.flooringType}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="project-page-shell project-cta-card">
          <div>
            <h2>Want a quote for a similar project?</h2>
            <p>Start with the flooring type, area and scope details you know now. If you already have a written quote, check whether it lists the same kind of scope items clearly.</p>
          </div>
          <div className="project-cta-actions">
            <a className="button button-primary" href={`${routes.quote}?from=project_proof#quoteForm`} data-track-cta="project_case_bottom_quote_click">Start flooring quote</a>
            <a className="button button-secondary" href={routes.quoteReview} data-track-cta="project_case_bottom_review_click">Check existing quote</a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
