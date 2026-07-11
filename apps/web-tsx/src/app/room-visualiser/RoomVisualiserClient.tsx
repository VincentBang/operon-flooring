"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { routes } from "@/lib/routes";
import { categoryLabels, flooringLooks, getLooksForCategory } from "./catalogue";
import { FloorTexture } from "./FloorTexture";
import { LocalRoomEditor } from "./LocalRoomEditor";
import type { FlooringCategory, FlooringLook } from "./types";

const categoryOrder: FlooringCategory[] = ["hybrid", "laminate", "engineered"];

export function RoomVisualiserClient() {
  const [activeId, setActiveId] = useState(flooringLooks[0].id);
  const [reveal, setReveal] = useState(62);
  const [textureAngle, setTextureAngle] = useState(0);
  const [textureScale, setTextureScale] = useState(flooringLooks[0].defaultTextureScale);
  const activeLook = useMemo(
    () => flooringLooks.find((look) => look.id === activeId) || flooringLooks[0],
    [activeId]
  );
  const visibleLooks = useMemo(() => getLooksForCategory(activeLook.category), [activeLook.category]);
  const quoteHref = `${routes.quote}?from=room_visualiser&category=${activeLook.category}&look=${encodeURIComponent(activeLook.id)}#quoteForm`;

  function selectLook(look: FlooringLook) {
    setActiveId(look.id);
    setTextureScale(look.defaultTextureScale);
  }

  function selectCategory(category: FlooringCategory) {
    const firstLook = getLooksForCategory(category)[0];
    if (firstLook) {
      selectLook(firstLook);
    }
  }

  function resetTextureView() {
    setTextureAngle(0);
    setTextureScale(activeLook.defaultTextureScale);
  }

  return (
    <>
      <section className="section room-visualiser-tool" aria-labelledby="visualiserToolTitle">
        <div className="shell room-visualiser-layout">
          <div className="room-preview-panel">
            <div className="room-preview-head">
              <div>
                <p className="eyebrow">Sample room preview</p>
                <h2 id="visualiserToolTitle">Compare real product textures before you quote</h2>
                <p>Use the sample room to compare product colour, grain and plank direction, then continue with the closest product direction.</p>
              </div>
              <div className="room-preview-status" aria-live="polite" data-testid="selected-product-summary">
                <strong>{activeLook.name}</strong>
                <span>{activeLook.range} | {activeLook.thickness}</span>
              </div>
            </div>

            <div
              className="room-stage"
              style={{ "--reveal": `${reveal}%` } as CSSProperties}
              aria-label={`Before and after room preview showing ${activeLook.name}`}
            >
              <img
                src="/images/projects/hybrid-floor-levelling-case-study/hybrid-flooring-after-levelling-open-plan-sydney.jpg"
                alt="Open plan Sydney room used as a sample flooring visualiser scene"
                width="1200"
                height="800"
                loading="eager"
              />
              <div className="room-floor-reveal" aria-hidden="true">
                <div className="room-floor-overlay">
                  <FloorTexture look={activeLook} angle={textureAngle} scale={textureScale} />
                </div>
              </div>
              <div className="room-before-label">Before</div>
              <div className="room-after-label">Preview</div>
              <div className="room-reveal-line" aria-hidden="true"></div>
            </div>

            <div className="room-render-controls" aria-label="Product texture preview controls">
              <label className="room-compare-control" htmlFor="roomCompareSlider">
                <span>Before / after preview <output>{reveal}%</output></span>
                <input
                  id="roomCompareSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={reveal}
                  onChange={(event) => setReveal(Number(event.target.value))}
                />
              </label>
              <label className="room-compare-control" htmlFor="roomTextureAngle">
                <span>Plank direction <output>{textureAngle} degrees</output></span>
                <input
                  id="roomTextureAngle"
                  type="range"
                  min="0"
                  max="180"
                  step="15"
                  value={textureAngle}
                  onChange={(event) => setTextureAngle(Number(event.target.value))}
                />
              </label>
              <label className="room-compare-control" htmlFor="roomTextureScale">
                <span>Preview grain scale <output>{textureScale}</output></span>
                <input
                  id="roomTextureScale"
                  type="range"
                  min="150"
                  max="340"
                  step="10"
                  value={textureScale}
                  onChange={(event) => setTextureScale(Number(event.target.value))}
                />
              </label>
              <button className="button button-secondary room-texture-reset" type="button" onClick={resetTextureView}>Reset texture view</button>
            </div>
            <p className="room-render-disclaimer">Product swatches are repository catalogue references. Room lighting, screen colour and preview scale can differ from the installed floor.</p>
          </div>

          <aside className="room-selector-panel" aria-label="Flooring product selector">
            <div>
              <p className="eyebrow">Product texture</p>
              <h2>Choose a curated product</h2>
              <p>Nine browser-safe catalogue swatches provide a more realistic starting point. Final availability, colour and scope are reviewed before installation is confirmed.</p>
            </div>

            <div className="room-category-tabs" aria-label="Flooring category">
              {categoryOrder.map((category) => (
                <button
                  type="button"
                  key={category}
                  aria-pressed={category === activeLook.category}
                  onClick={() => selectCategory(category)}
                >
                  {categoryLabels[category].replace(" flooring", "").replace(" timber", "")}
                </button>
              ))}
            </div>

            <div className="room-look-list">
              {visibleLooks.map((look) => (
                <button
                  className={`room-look-option${look.id === activeLook.id ? " is-active" : ""}`}
                  type="button"
                  key={look.id}
                  onClick={() => selectLook(look)}
                  aria-pressed={look.id === activeLook.id}
                >
                  <span
                    className="room-look-swatch"
                    style={{ backgroundColor: look.swatch, backgroundImage: `url("${look.textureUrl}")` }}
                    aria-hidden="true"
                  ></span>
                  <span>
                    <strong>{look.name}</strong>
                    <span>{look.range} | {look.tone}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="room-selection-summary">
              <strong>Selected product direction</strong>
              <p>{activeLook.name} is a {activeLook.plank} starting point for {activeLook.bestFor}.</p>
            </div>

            <div className="room-visualiser-actions">
              <a className="button button-primary" href={quoteHref} data-track-cta="room_visualiser_quote_click">Get instant flooring quote</a>
              <a className="button button-secondary" href={routes.floorplan} data-track-cta="room_visualiser_floorplan_click">Upload floorplan</a>
              <a className="button button-secondary" href={routes.quoteReview} data-track-cta="room_visualiser_review_click">Request quote review</a>
              <a className="button button-secondary" href={`${routes.contact}?from=room_visualiser&look=${encodeURIComponent(activeLook.id)}`} data-track-cta="room_visualiser_match_click">Ask us to match this product</a>
            </div>
          </aside>
        </div>
      </section>

      <LocalRoomEditor
        activeLook={activeLook}
        textureAngle={textureAngle}
        textureScale={textureScale}
      />
    </>
  );
}
