import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { Layout } from "@/components/layout/Layout";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";

const heroImage = "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-herringbone-timber-flooring-sydney-kitchen-living.jpg";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://operonflooring.com.au/" },
        { "@type": "ListItem", position: 2, name: "Recent Sydney flooring projects", item: "https://operonflooring.com.au/recent-flooring-projects.html" }
      ]
    },
    {
      "@type": "CollectionPage",
      name: "Recent Sydney flooring projects",
      url: "https://operonflooring.com.au/recent-flooring-projects.html",
      description: "Finished flooring projects across Sydney homes, including engineered timber patterns, stair details, hybrid flooring and preparation work.",
      image: [
        `https://operonflooring.com.au${heroImage}`,
        "https://operonflooring.com.au/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg",
        "https://operonflooring.com.au/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg"
      ]
    },
    {
      "@type": "ImageGallery",
      name: "Sydney flooring project gallery",
      url: "https://operonflooring.com.au/recent-flooring-projects.html",
      associatedMedia: [
        { "@type": "ImageObject", contentUrl: `https://operonflooring.com.au${heroImage}`, caption: "Finished engineered herringbone timber flooring in a Sydney kitchen and living area" },
        { "@type": "ImageObject", contentUrl: "https://operonflooring.com.au/images/projects/wide-long-engineered-herringbone-flooring-sydney/finished-wide-long-engineered-herringbone-flooring-kitchen-sydney.jpg", caption: "Finished wide and long plank engineered herringbone flooring in a Sydney kitchen and dining area" },
        { "@type": "ImageObject", contentUrl: "https://operonflooring.com.au/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg", caption: "Finished engineered chevron flooring in a sunlit Sydney room" },
        { "@type": "ImageObject", contentUrl: "https://operonflooring.com.au/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg", caption: "Hybrid flooring installed after floor levelling in a Sydney open plan living area" }
      ]
    }
  ]
};

const proofPoints = [
  ["Pattern detail", "Herringbone and chevron layouts need careful alignment so the finished room feels balanced."],
  ["Stair work", "Stairs and feature steps are matched to the timber finish for a more complete result."],
  ["Preparation behind the finish", "Levelling and preparation support the finished floor without becoming the whole story."]
];

const timberProjects = [
  {
    src: "/images/projects/wide-long-engineered-herringbone-flooring-sydney/finished-wide-long-engineered-herringbone-flooring-kitchen-sydney.jpg",
    alt: "Finished wide and long plank engineered herringbone flooring in a Sydney kitchen and dining area",
    title: "Wide herringbone kitchen",
    copy: "Wider, longer boards with a calmer premium rhythm.",
    chips: ["Engineered timber", "Herringbone"],
    width: 1500,
    height: 1125
  },
  {
    src: "/images/projects/engineered-herringbone-timber-stair-sydney/finished-engineered-timber-stair-sydney.jpg",
    alt: "Finished engineered timber stair installation in Sydney",
    title: "Matched timber stair",
    copy: "Stair treads and risers finished to suit the project.",
    chips: ["Engineered timber", "Stairs"],
    width: 1500,
    height: 1125
  }
];

const featureProjects = [
  { src: "/images/projects/engineered-chevron-flooring-sydney/finished-engineered-chevron-flooring-sunlit-room-sydney.jpg", alt: "Finished engineered chevron flooring in a sunlit Sydney room", title: "Sunlit chevron room", copy: "Chevron boards laid cleanly through the room.", chips: ["Engineered timber", "Chevron"], width: 1500, height: 1125 },
  { src: "/images/projects/engineered-spotted-gum-rounded-stair-sydney/finished-spotted-gum-rounded-stair-step-sydney.jpg", alt: "Finished spotted gum rounded stair step detail in Sydney", title: "Spotted gum rounded step", copy: "Rounded stair detail with matched timber grain.", chips: ["Spotted gum", "Stairs"], width: 1500, height: 1125 },
  { src: "/images/projects/engineered-straight-plank-direct-stick-sydney/finished-engineered-straight-plank-direct-stick-stair-sydney.jpg", alt: "Finished engineered straight plank direct stick flooring and stair in Sydney", title: "Direct-stick stair area", copy: "Straight plank engineered flooring through the stair zone.", chips: ["Engineered timber", "Direct stick"], width: 843, height: 1500 }
];

const preparationProjects = [
  { src: "/images/projects/hybrid-floor-levelling-case-study/before-floor-levelling-sydney-subfloor-preparation.jpg", alt: "Sydney flooring project before floor levelling and subfloor preparation", title: "Before preparation", copy: "Existing floor removed before the new finish.", chips: ["Subfloor preparation"], width: 1500, height: 1125 },
  { src: "/images/projects/finished-floor-levelling-sydney/finished-floor-levelling-sydney-reflective-surface.jpg", alt: "Reflective finished floor levelling surface in a Sydney room", title: "Levelled base", copy: "A smooth, controlled surface before flooring.", chips: ["Subfloor preparation"], width: 1500, height: 1125 },
  { src: "/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg", alt: "Hybrid flooring installed after floor levelling in a Sydney open plan living area", title: "Finished hybrid floor", copy: "Clean timber-look finish after preparation.", chips: ["Hybrid flooring", "Preparation"], width: 1500, height: 1125 }
];

type ProjectCardProps = {
  project: {
    src: string;
    alt: string;
    title: string;
    copy: string;
    chips: string[];
    width: number;
    height: number;
  };
};

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <figure className="project-card-photo">
      <img src={project.src} alt={project.alt} loading="lazy" width={project.width} height={project.height} />
      <figcaption>
        <strong>{project.title}</strong>
        <span>{project.copy}</span>
        <span className="project-card-chips">{project.chips.map((chip) => <span key={chip}>{chip}</span>)}</span>
      </figcaption>
    </figure>
  );
}

export const metadata: Metadata = createPageMetadata({
  title: "Recent Sydney Flooring Projects | Operon Flooring",
  description: "View recent Operon Flooring project photos across engineered timber, herringbone, chevron, hybrid flooring, stair details and subfloor preparation in Sydney.",
  path: routes.recentProjects,
  image: heroImage,
  openGraphDescription: "Finished flooring project photos across engineered timber, herringbone, chevron, hybrid flooring, stair details and subfloor preparation."
});

export default function RecentFlooringProjectsPage() {
  return (
    <Layout>
      <JsonLd data={jsonLd} />
      <section className="hero">
        <div className="project-page-shell project-hero-grid">
          <article className="hero-card">
            <span className="eyebrow">Project Proof</span>
            <h1>Recent Sydney flooring projects</h1>
            <p>Finished flooring projects across Sydney homes, from engineered timber patterns and stair details to hybrid flooring and preparation work behind the finish.</p>
            <div className="project-chip-row" aria-label="Project categories">
              {["Engineered timber", "Herringbone", "Chevron", "Hybrid flooring", "Stairs", "Subfloor levelling"].map((chip) => <span key={chip}>{chip}</span>)}
            </div>
            <div className="hero-actions">
              <a className="button button-primary" href={routes.quote} data-track-cta="projects_start_quote_click">Start flooring quote</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="projects_quote_review_click">Check existing quote</a>
            </div>
          </article>
          <figure className="project-hero-image">
            <img src={heroImage} alt="Finished engineered herringbone timber flooring in a Sydney kitchen and living area" width="1118" height="944" />
          </figure>
        </div>
      </section>

      <section className="section project-section" aria-labelledby="projectProofPointsTitle">
        <div className="project-page-shell">
          <div className="project-section-head"><div><span className="eyebrow">What these projects show</span><h2 id="projectProofPointsTitle">Finish quality, not just product choice</h2></div><p>These examples show the visible result and the practical details that make a floor feel considered once it is installed.</p></div>
          <div className="project-proof-points" aria-label="Project proof highlights">{proofPoints.map(([title, copy]) => <article className="project-proof-point" key={title}><strong>{title}</strong><span>{copy}</span></article>)}</div>
        </div>
      </section>

      <section className="section project-section"><div className="project-page-shell"><div className="project-section-head"><div><span className="eyebrow">Finished Timber</span><h2>Premium timber patterns and stair details</h2></div><p>Finished work leads the story here: clean timber patterning, matched stair details and warm natural grain.</p></div><div className="project-grid project-grid-feature">{timberProjects.map((project) => <ProjectCard key={project.title} project={project} />)}</div><div className="project-mid-cta"><div><h2>Want this type of finish?</h2><p>Start with the product style, area and details you know now. We can review the remaining scope before booking.</p></div><div className="project-cta-actions"><a className="button button-primary" href={routes.quote} data-track-cta="projects_mid_quote_click">Start flooring quote</a><a className="button button-secondary" href={routes.quoteReview} data-track-cta="projects_mid_review_click">Check existing quote</a></div></div></div></section>

      <section className="section project-section"><div className="project-page-shell"><div className="project-section-head"><div><span className="eyebrow">Feature Details</span><h2>Chevron, spotted gum and direct-stick work</h2></div><p>Selected details that show pattern alignment, stair transitions and timber character up close.</p></div><div className="project-grid">{featureProjects.map((project) => <ProjectCard key={project.title} project={project} />)}</div></div></section>

      <section className="section project-section"><div className="project-page-shell"><div className="project-section-head"><div><span className="eyebrow">Behind The Finish</span><h2>Preparation before finished flooring</h2></div><p>Levelling and preparation photos are kept here as supporting evidence: they show the work behind the finished result without dominating the homepage.</p></div><div className="project-grid">{preparationProjects.map((project) => <ProjectCard key={project.title} project={project} />)}</div></div></section>

      <section className="section"><div className="project-page-shell project-cta-card"><div><h2>Want a quote for a similar project?</h2><p>Start with what you know now. Product, area and final scope can be reviewed before booking.</p></div><div className="project-cta-actions"><a className="button button-primary" href={routes.quote} data-track-cta="projects_bottom_quote_click">Start flooring quote</a><a className="button button-secondary" href={routes.quoteReview} data-track-cta="projects_bottom_review_click">Check existing quote</a></div></div></section>
    </Layout>
  );
}
