import type { Metadata } from "next";
import { HomeChatbot } from "@/components/HomeChatbot";
import { Layout } from "@/components/layout/Layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { createPageMetadata } from "@/lib/metadata";
import { routes } from "@/lib/routes";
import { RoomVisualiserClient } from "./RoomVisualiserClient";

const visualiserJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Operon Flooring Room Visualiser",
    "url": "https://operonflooring.com.au/room-visualiser.html",
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web",
    "description": "Compare sample-room flooring looks for hybrid, laminate and engineered timber before starting a Sydney flooring quote.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the room visualiser a final colour guarantee?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. It is a sample-room preview that helps compare product direction, tone and room feel before the final product and colour are reviewed."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use the selected look in a quote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Choose the closest look, then continue to the quote flow so product direction, area and scope can be reviewed."
        }
      },
      {
        "@type": "Question",
        "name": "Does this upload my room photo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Customer photos stay in the browser for manual masking and are not uploaded or stored by the room visualiser."
        }
      }
    ]
  }
];

const visualiserStyle = `
.room-visualiser-hero .hero-card {
  overflow: hidden;
}

.room-visualiser-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(280px, 0.95fr);
  gap: 28px;
  align-items: center;
}

.room-visualiser-hero h1 {
  max-width: 820px;
}

.room-visualiser-hero p {
  max-width: 760px;
}

.room-hero-proof {
  display: grid;
  gap: 12px;
}

.room-hero-proof img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--operon-line);
}

.room-proof-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.room-proof-grid div,
.room-preview-status,
.room-selection-summary {
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  background: #fff;
  padding: 14px;
}

.room-proof-grid strong,
.room-preview-status strong,
.room-selection-summary strong {
  display: block;
  color: var(--operon-ink);
}

.room-proof-grid span,
.room-preview-status span,
.room-selection-summary p {
  display: block;
  margin-top: 5px;
  color: var(--operon-muted);
  font-size: 0.92rem;
  line-height: 1.45;
}

.room-visualiser-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 22px;
  align-items: start;
}

.room-preview-panel,
.room-selector-panel {
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  background: #fff;
  padding: clamp(18px, 3vw, 28px);
  box-shadow: 0 10px 28px rgba(23, 35, 45, 0.06);
}

.room-preview-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.4fr);
  gap: 16px;
  align-items: end;
  margin-bottom: 18px;
}

.room-preview-head h2,
.room-selector-panel h2 {
  margin-top: 12px;
}

.room-stage {
  --reveal: 62%;
  position: relative;
  overflow: hidden;
  min-height: 360px;
  border-radius: 8px;
  background: #eef2f1;
  border: 1px solid var(--operon-line);
}

.room-stage img {
  display: block;
  width: 100%;
  height: auto;
  min-height: 360px;
  object-fit: cover;
}

.room-floor-reveal {
  position: absolute;
  inset: 0;
  clip-path: polygon(0 0, var(--reveal) 0, var(--reveal) 100%, 0 100%);
}

.room-floor-overlay {
  position: absolute;
  left: 7%;
  right: 7%;
  bottom: 0;
  height: 54%;
  overflow: hidden;
  clip-path: polygon(22% 0, 78% 0, 100% 100%, 0 100%);
  opacity: 0.78;
  mix-blend-mode: multiply;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 10%, #000 100%);
  mask-image: linear-gradient(180deg, transparent 0, #000 10%, #000 100%);
}

.room-floor-texture,
.room-floor-texture-surface,
.room-floor-texture-light {
  position: absolute;
  inset: 0;
}

.room-floor-texture {
  display: block;
  overflow: hidden;
}

.room-floor-texture-surface {
  inset: -72%;
  background-image: var(--floor-texture-image);
  background-repeat: repeat;
  background-size: var(--floor-texture-size) auto;
  background-position: center bottom;
  filter: saturate(0.9) contrast(0.92);
  transform: perspective(840px) rotateX(14deg) rotateZ(calc(90deg + var(--floor-texture-angle))) scale(1.42);
  transform-origin: 50% 70%;
}

.room-floor-texture-light {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.24), transparent 42%, rgba(0,0,0,0.1)),
    linear-gradient(90deg, rgba(255,255,255,0.13), rgba(0,0,0,0.1) 52%, rgba(255,255,255,0.12));
}

.room-before-label,
.room-after-label,
.room-reveal-line {
  position: absolute;
  z-index: 2;
}

.room-before-label,
.room-after-label {
  top: 14px;
  min-height: 34px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255,255,255,0.88);
  color: var(--operon-ink);
  font-weight: 800;
  font-size: 0.85rem;
}

.room-before-label {
  right: 14px;
}

.room-after-label {
  left: 14px;
}

.room-reveal-line {
  top: 0;
  bottom: 0;
  left: var(--reveal);
  width: 2px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 0 0 1px rgba(20,47,56,0.14);
}

.room-compare-control {
  display: grid;
  gap: 10px;
  color: var(--operon-ink);
  font-weight: 800;
}

.room-compare-control > span {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.room-compare-control output {
  color: var(--operon-muted);
  font-weight: 700;
}

.room-compare-control input {
  width: 100%;
  accent-color: var(--operon-ink);
}

.room-render-controls,
.room-editor-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
  align-items: end;
}

.room-editor-controls {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 0 16px;
}

.room-editor-controls label {
  display: grid;
  gap: 10px;
  color: var(--operon-ink);
  font-weight: 800;
}

.room-editor-controls label > span {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.room-editor-controls output {
  color: var(--operon-muted);
}

.room-editor-controls input {
  width: 100%;
  accent-color: var(--operon-ink);
}

.room-texture-reset {
  min-height: 42px;
}

.room-render-disclaimer,
.room-photo-metadata {
  margin: 14px 0 0;
  color: var(--operon-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.room-selector-panel {
  position: sticky;
  top: 94px;
  display: grid;
  gap: 18px;
}

.room-look-list {
  display: grid;
  gap: 10px;
}

.room-category-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  overflow: hidden;
}

.room-category-tabs button {
  min-width: 0;
  min-height: 42px;
  padding: 8px 6px;
  border: 0;
  border-right: 1px solid var(--operon-line);
  background: #fff;
  color: var(--operon-ink);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;
}

.room-category-tabs button:last-child {
  border-right: 0;
}

.room-category-tabs button[aria-pressed="true"] {
  background: var(--operon-ink);
  color: #fff;
}

.room-look-option {
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  gap: 12px;
  width: 100%;
  min-height: 78px;
  padding: 12px;
  text-align: left;
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  background: #fff;
  color: var(--operon-ink);
  cursor: pointer;
}

.room-look-option.is-active {
  border-color: var(--operon-ink);
  box-shadow: inset 0 0 0 1px var(--operon-ink);
}

.room-look-option strong,
.room-look-option span span {
  display: block;
}

.room-look-option span span {
  margin-top: 4px;
  color: var(--operon-muted);
  line-height: 1.4;
}

.room-look-swatch {
  width: 54px;
  height: 54px;
  border-radius: 8px;
  border: 1px solid rgba(20, 47, 56, 0.14);
  background-position: center;
  background-size: cover;
}

.room-visualiser-actions {
  display: grid;
  gap: 10px;
}

.room-visualiser-links .link-grid {
  margin-top: 22px;
}

.room-local-mask-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(300px, 0.75fr);
  gap: 22px;
  align-items: start;
}

.room-local-upload {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.room-local-upload input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.room-local-upload .button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.room-local-error,
.room-local-progress {
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 8px;
  line-height: 1.5;
}

.room-local-error {
  border: 1px solid #a73a3a;
  background: #fff4f2;
  color: #762828;
}

.room-local-progress {
  border: 1px solid var(--operon-line);
  background: #f4f7f7;
  color: var(--operon-ink);
}

.room-assist-status {
  display: grid;
  gap: 5px;
  margin-bottom: 16px;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid var(--operon-line);
  background: #fff;
}

.room-assist-status[data-source="suggested"],
.room-assist-status[data-source="browser-prototype"] {
  border-color: rgba(184, 119, 86, 0.44);
  background: rgba(184, 119, 86, 0.08);
}

.room-assist-status[data-confirmed="true"] {
  border-color: rgba(34, 105, 72, 0.45);
  background: rgba(34, 105, 72, 0.08);
}

.room-assist-status strong {
  color: var(--operon-ink);
}

.room-assist-status span {
  color: var(--operon-muted);
  line-height: 1.5;
}

.room-confirm-mask {
  justify-self: start;
  margin-top: 8px;
}

.room-confirm-mask:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.room-prototype-status {
  display: grid;
  gap: 5px;
  margin: 0 0 16px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px dashed rgba(20, 47, 56, 0.28);
  background: #f7f4ef;
}

.room-prototype-status strong {
  color: var(--operon-ink);
}

.room-prototype-status span {
  color: var(--operon-muted);
  line-height: 1.45;
}

.room-editor-viewport {
  max-height: 72vh;
  overflow: auto;
  overscroll-behavior: contain;
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  background: #111820;
}

.room-local-stage {
  display: grid;
  place-items: center;
  width: 100%;
  min-width: 100%;
  min-height: 360px;
  cursor: crosshair;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(90deg, rgba(20, 47, 56, 0.05) 1px, transparent 1px),
    linear-gradient(rgba(20, 47, 56, 0.05) 1px, transparent 1px),
    #f7f4ef;
  background-size: 24px 24px, 24px 24px, 100% 100%;
}

.room-local-stage > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: none;
  object-fit: fill;
  background: #f7f4ef;
  user-select: none;
  pointer-events: none;
}

.room-local-stage.has-local-photo {
  min-height: 0;
  background: #111820;
}

.room-local-empty {
  display: grid;
  gap: 8px;
  max-width: 520px;
  padding: 32px;
  text-align: center;
}

.room-local-empty strong {
  color: var(--operon-ink);
  font-size: 1.1rem;
}

.room-local-empty span,
.room-local-note {
  color: var(--operon-muted);
  line-height: 1.6;
}

.room-local-reveal-window,
.room-local-mask-reveal {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.room-local-mask-reveal {
  opacity: 0.78;
  mix-blend-mode: multiply;
}

.room-local-reveal-line {
  position: absolute;
  z-index: 2;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255,255,255,0.92);
  box-shadow: 0 0 0 1px rgba(20,47,56,0.22);
  pointer-events: none;
}

.room-local-preview-label {
  position: absolute;
  z-index: 2;
  top: 12px;
  min-height: 32px;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(255,255,255,0.9);
  color: var(--operon-ink);
  font-size: 0.82rem;
  font-weight: 800;
  pointer-events: none;
}

.room-local-preview-label-before {
  right: 12px;
}

.room-local-preview-label-after {
  left: 12px;
}

.room-mask-point {
  position: absolute;
  z-index: 3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -16px 0 0 -16px;
  border-radius: 50%;
  background: #ffffff;
  color: var(--operon-ink);
  border: 2px solid var(--operon-ink);
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  padding: 0;
  touch-action: none;
  user-select: none;
}

.room-mask-point.is-active {
  background: var(--operon-accent);
  color: #fff;
  box-shadow: 0 0 0 4px rgba(184, 119, 86, 0.22);
}

.room-point-inspector {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
  margin: 16px 0 0;
  padding: 14px;
  border: 1px solid var(--operon-line);
  border-radius: 8px;
}

.room-point-inspector legend {
  padding: 0 6px;
  color: var(--operon-ink);
  font-weight: 800;
}

.room-point-inspector label {
  display: grid;
  gap: 6px;
  color: var(--operon-ink);
  font-size: 0.9rem;
  font-weight: 700;
}

.room-point-inspector input {
  width: 100%;
  min-height: 42px;
  padding: 8px 10px;
  border: 1px solid var(--operon-line);
  border-radius: 6px;
  color: var(--operon-ink);
  font: inherit;
}

.room-phase2-checks {
  display: grid;
  gap: 10px;
}

.room-phase2-checks div {
  border: 1px solid var(--operon-line);
  border-radius: 8px;
  padding: 14px;
  background: #fff;
}

.room-phase2-checks strong,
.room-phase2-checks span {
  display: block;
}

.room-phase2-checks span {
  margin-top: 5px;
  color: var(--operon-muted);
  line-height: 1.45;
}

@media (max-width: 900px) {
  .room-visualiser-hero-grid,
  .room-visualiser-layout,
  .room-preview-head,
  .room-local-mask-layout {
    grid-template-columns: 1fr;
  }

  .room-selector-panel {
    position: static;
  }

  .room-proof-grid {
    grid-template-columns: 1fr;
  }

  .room-render-controls {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .room-stage,
  .room-stage img {
    min-height: 300px;
  }

  .room-local-stage.has-local-photo,
  .room-local-stage.has-local-photo > img {
    min-height: 0;
  }

  .room-floor-overlay {
    left: 2%;
    right: 2%;
    height: 54%;
  }

  .room-editor-controls,
  .room-point-inspector {
    grid-template-columns: 1fr;
  }

  .room-category-tabs button {
    font-size: 0.75rem;
  }

  .room-mask-point {
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
  }
}
`;

export const metadata: Metadata = createPageMetadata({
  title: "Flooring Room Visualiser Sydney | Preview Hybrid, Laminate & Timber",
  description: "Preview hybrid, laminate and engineered timber flooring looks in a sample room before starting an Operon Flooring Sydney quote.",
  path: routes.roomVisualiser,
  image: "/assets/operon-social-preview.png",
  robots: "index,follow",
  openGraphDescription: "Compare flooring looks in a sample room, then continue to quote, floor plan upload or quote review."
});

export default function RoomVisualiserPage() {
  return (
    <Layout>
      {visualiserJsonLd.map((schema, index) => (
        <JsonLd data={schema} key={index} />
      ))}
      <style dangerouslySetInnerHTML={{ __html: visualiserStyle }} />

      <section className="hero room-visualiser-hero">
        <div className="shell">
          <article className="hero-card">
            <div className="room-visualiser-hero-grid">
              <div>
                <nav className="breadcrumbs" aria-label="Breadcrumb">
                  <a href={routes.home}>Home</a>
                  <span>/</span>
                  <span>Room visualiser</span>
                </nav>
                <span className="eyebrow">Flooring visualiser Sydney</span>
                <h1>Preview flooring looks before starting your quote</h1>
                <p>
                  Compare hybrid, laminate and engineered timber directions in a sample room, then carry the closest look into Operon's quote, floor plan or quote review workflow.
                </p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#visualiserToolTitle" data-track-cta="room_visualiser_hero_try_click">Try the visualiser</a>
                  <a className="button button-secondary" href={routes.quote} data-track-cta="room_visualiser_hero_quote_click">Get instant flooring quote</a>
                  <a className="button button-secondary" href={routes.products} data-track-cta="room_visualiser_hero_products_click">Browse products</a>
                </div>
              </div>
              <div className="room-hero-proof" aria-label="Room visualiser strengths">
                <img
                  src="/images/home/modern-engineered-timber-flooring-sydney.avif"
                  alt="Modern timber-look flooring in a Sydney room"
                  width="568"
                  height="378"
                  loading="eager"
                />
                <div className="room-proof-grid">
                  <div><strong>1. Compare tone</strong><span>Natural, grey, warm and Australian timber directions.</span></div>
                  <div><strong>2. Check fit</strong><span>Room brightness, plank feel and product category.</span></div>
                  <div><strong>3. Continue</strong><span>Move into quote, floor plan or review with clearer intent.</span></div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <RoomVisualiserClient />

      <section className="section room-visualiser-links" aria-labelledby="roomVisualiserNextTitle">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">Next step</span>
            <h2 id="roomVisualiserNextTitle">Use the preview to narrow the quote path</h2>
            <p>
              A sample-room preview helps with colour direction and confidence. The quote still needs product range, area, removal, trims, stairs and project details before final confirmation.
            </p>
            <div className="link-grid">
              <a className="link-card" href={routes.quote}><strong>Get instant flooring quote</strong><span>Carry product direction into the structured quote flow.</span></a>
              <a className="link-card" href={routes.floorplan}><strong>Upload floorplan</strong><span>Create a clearer starting area before quoting.</span></a>
              <a className="link-card" href={routes.quoteReview}><strong>Request quote review</strong><span>Check an existing written quote before comparing totals.</span></a>
              <a className="link-card" href={routes.hybrid}><strong>Hybrid flooring visual guide</strong><span>Compare practical timber-look options for Sydney homes.</span></a>
              <a className="link-card" href={routes.laminate}><strong>Laminate flooring visual guide</strong><span>Review dry-room timber-look options before choosing.</span></a>
              <a className="link-card" href={routes.engineered}><strong>Engineered timber visual guide</strong><span>Consider premium tone, board format and finish expectations.</span></a>
            </div>
          </article>
        </div>
      </section>

      <section className="section" aria-labelledby="roomVisualiserFaqTitle">
        <div className="shell">
          <article className="section-card">
            <span className="eyebrow">FAQs</span>
            <h2 id="roomVisualiserFaqTitle">Room visualiser questions</h2>
            <div className="faq">
              <details open>
                <summary>Is this a final colour match?</summary>
                <p>No. It is a sample-room preview for comparing direction, tone and room feel. Final colour, product and installation details are reviewed before confirmation.</p>
              </details>
              <details>
                <summary>Can I upload my own room photo?</summary>
                <p>Yes. The photo is used locally in your browser for manual polygon masking. It is not uploaded, stored, sent to a quote, or processed by AI.</p>
              </details>
              <details>
                <summary>Which flooring types can I compare?</summary>
                <p>You can compare starting directions for hybrid flooring, laminate flooring and engineered timber.</p>
              </details>
              <details>
                <summary>What should I do after choosing a look?</summary>
                <p>Start a quote, upload a floor plan for area, request a quote review or contact Operon with the look you want to match.</p>
              </details>
            </div>
          </article>
        </div>
      </section>

      <HomeChatbot pageKey="room-visualiser" />
    </Layout>
  );
}
