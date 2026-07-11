import { useMemo, useRef, useState } from "react";
import type {
  ChangeEvent,
  CSSProperties,
  KeyboardEvent,
  MouseEvent,
  PointerEvent
} from "react";
import { inferBrowserLocalFloorMask, suggestedStarterMask } from "./assist";
import { FloorTexture } from "./FloorTexture";
import { formatFileSize } from "./imageUtils";
import { roundMaskPoint } from "./maskState";
import type { FlooringLook, MaskPoint } from "./types";
import { LOCAL_PHOTO_ACCEPT, useLocalPhotoSession } from "./useLocalPhotoSession";
import { useMaskEditor } from "./useMaskEditor";

type LocalRoomEditorProps = {
  activeLook: FlooringLook;
  textureAngle: number;
  textureScale: number;
};

function maskSourceLabel(source: ReturnType<typeof useMaskEditor>["snapshot"]["source"]) {
  if (source === "browser-prototype") {
    return "Browser-local prototype mask";
  }
  if (source === "suggested") {
    return "Geometric starter mask";
  }
  return "Manual floor mask";
}

export function LocalRoomEditor({ activeLook, textureAngle, textureScale }: LocalRoomEditorProps) {
  const { photo, error, isReading, selectPhoto, clearPhoto } = useLocalPhotoSession();
  const mask = useMaskEditor();
  const [prototypeStatus, setPrototypeStatus] = useState("Canvas prototype idle");
  const [isPrototypeRunning, setIsPrototypeRunning] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [reveal, setReveal] = useState(72);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { snapshot } = mask;
  const maskPolygon = useMemo(() => (
    snapshot.points.length >= 3
      ? `polygon(${snapshot.points.map((point) => `${point.x}% ${point.y}%`).join(", ")})`
      : undefined
  ), [snapshot.points]);
  const selectedPoint = mask.activePointIndex === null ? null : snapshot.points[mask.activePointIndex] || null;
  const canPreview = Boolean(photo && maskPolygon);

  async function handleLocalPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files && input.files[0];
    input.value = "";
    if (!file) {
      return;
    }
    const accepted = await selectPhoto(file);
    if (accepted) {
      mask.clearHistory();
      setZoom(100);
      setReveal(72);
      setPrototypeStatus("Canvas prototype idle");
    }
  }

  function clearEditorPhoto() {
    clearPhoto();
    mask.clearHistory();
    setZoom(100);
    setReveal(72);
    setPrototypeStatus("Canvas prototype idle");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function pointFromClient(clientX: number, clientY: number): MaskPoint | null {
    const stage = stageRef.current;
    if (!stage) {
      return null;
    }
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return null;
    }
    return roundMaskPoint(
      ((clientX - rect.left) / rect.width) * 100,
      ((clientY - rect.top) / rect.height) * 100
    );
  }

  function handleStageClick(event: MouseEvent<HTMLDivElement>) {
    if (!photo) {
      return;
    }
    const point = pointFromClient(event.clientX, event.clientY);
    if (!point) {
      return;
    }
    if (mask.activePointIndex !== null) {
      mask.movePoint(mask.activePointIndex, point);
      mask.setActivePointIndex(null);
      return;
    }
    mask.addPoint(point);
  }

  function handlePointPointerDown(index: number, event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    mask.beginDrag(index);
  }

  function handlePointPointerMove(index: number, event: PointerEvent<HTMLButtonElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }
    const point = pointFromClient(event.clientX, event.clientY);
    if (point) {
      mask.previewDrag(index, point);
    }
  }

  function handlePointPointerUp(event: PointerEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    mask.endDrag();
  }

  function handlePointKeyDown(index: number, event: KeyboardEvent<HTMLButtonElement>) {
    const point = snapshot.points[index];
    if (!point) {
      return;
    }
    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      mask.removePoint(index);
      return;
    }
    const step = event.shiftKey ? 1 : 0.25;
    const delta = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step }
    }[event.key];
    if (!delta) {
      return;
    }
    event.preventDefault();
    mask.movePoint(index, { x: point.x + delta.x, y: point.y + delta.y });
  }

  function updateSelectedPoint(axis: "x" | "y", value: string) {
    if (mask.activePointIndex === null || !selectedPoint) {
      return;
    }
    const number = Number(value);
    if (!Number.isFinite(number)) {
      return;
    }
    mask.movePoint(mask.activePointIndex, {
      ...selectedPoint,
      [axis]: number
    });
  }

  function applySuggestedStarterMask() {
    if (!photo) {
      return;
    }
    mask.replaceSuggestion(suggestedStarterMask, "suggested");
    setPrototypeStatus("Geometric starter applied. Move at least one point before confirming the floor area.");
  }

  async function applyBrowserLocalPrototypeMask() {
    if (!photo || isPrototypeRunning) {
      return;
    }
    setIsPrototypeRunning(true);
    setPrototypeStatus("Running browser-local canvas analysis. No photo pixels leave this device.");
    try {
      const result = await inferBrowserLocalFloorMask(photo.url);
      mask.replaceSuggestion(result.points, "browser-prototype");
      setPrototypeStatus(`Browser-local prototype suggested 4 editable points from a ${result.width} x ${result.height} analysis canvas in ${result.analysisMs}ms.`);
    } catch (caught) {
      setPrototypeStatus(caught instanceof Error ? caught.message : "Browser-local prototype could not analyse this photo.");
    } finally {
      setIsPrototypeRunning(false);
    }
  }

  const reviewHeading = snapshot.confirmed
    ? "Floor area confirmed locally"
    : snapshot.source === "manual"
      ? "Manual mask controls"
      : "Manual correction required";
  const reviewCopy = snapshot.confirmed
    ? "This confirmation applies only to the preview in this browser. The photo and mask are still not sent anywhere."
    : snapshot.source === "manual"
      ? "Tap floor corners to add points. Drag a numbered point, use its arrow keys, or select it and enter exact coordinates."
      : snapshot.manualAdjustments > 0
        ? "A suggested point has been changed. Review every numbered point, then confirm the floor area locally."
        : "Move at least one numbered point before the floor area can be confirmed. Suggestions are never accepted automatically.";
  const summary = snapshot.confirmed
    ? `${maskSourceLabel(snapshot.source)} confirmed`
    : snapshot.points.length >= 3
      ? `${maskSourceLabel(snapshot.source)} ready for review`
      : `${snapshot.points.length} floor points set`;
  const stageStyle = photo
    ? { aspectRatio: `${photo.width} / ${photo.height}`, width: `${zoom}%` } as CSSProperties
    : undefined;

  return (
    <section className="section room-local-mask-section" aria-labelledby="localMaskTitle">
      <div className="shell room-local-mask-layout">
        <article className="room-preview-panel">
          <div className="room-preview-head">
            <div>
              <p className="eyebrow">Browser-local photo</p>
              <h2 id="localMaskTitle">Try a product texture on your own room photo</h2>
              <p>Choose a room photo for this browser only, then trace and confirm the visible floor area. The image and points are not uploaded or stored.</p>
            </div>
            <div className="room-preview-status" aria-live="polite">
              <strong>{photo?.name || "No photo selected"}</strong>
              <span>{summary}</span>
            </div>
          </div>

          <div className="room-local-upload" aria-label="Local photo and mask commands">
            <label className="button button-secondary" htmlFor="localRoomPhoto">Choose room photo</label>
            <input
              ref={fileInputRef}
              id="localRoomPhoto"
              data-testid="local-room-photo-input"
              type="file"
              accept={LOCAL_PHOTO_ACCEPT}
              onChange={handleLocalPhotoChange}
            />
            <button className="button button-secondary" type="button" onClick={applySuggestedStarterMask} disabled={!photo || isReading}>Suggest starter mask</button>
            <button className="button button-secondary" type="button" onClick={applyBrowserLocalPrototypeMask} disabled={!photo || isReading || isPrototypeRunning}>{isPrototypeRunning ? "Analysing locally" : "Run local assist prototype"}</button>
            <button className="button button-secondary" type="button" onClick={mask.undo} disabled={!mask.canUndo}>Undo</button>
            <button className="button button-secondary" type="button" onClick={mask.redo} disabled={!mask.canRedo}>Redo</button>
            <button className="button button-secondary" type="button" onClick={mask.resetMask} disabled={!snapshot.points.length}>Reset mask</button>
            <button className="button button-secondary" type="button" onClick={clearEditorPhoto} disabled={!photo}>Clear photo</button>
          </div>

          {error ? <p className="room-local-error" role="alert">{error}</p> : null}
          {isReading ? <p className="room-local-progress" role="status">Reading and validating the photo locally.</p> : null}

          <div className="room-assist-status" data-source={snapshot.source} data-confirmed={snapshot.confirmed ? "true" : "false"}>
            <strong>{reviewHeading}</strong>
            <span>{reviewCopy}</span>
            <button
              className="button button-primary room-confirm-mask"
              data-testid="confirm-local-mask"
              type="button"
              onClick={mask.confirmMask}
              disabled={!mask.canConfirm}
            >
              {snapshot.confirmed ? "Floor area confirmed" : "Confirm floor area"}
            </button>
          </div>

          <div className="room-prototype-status" data-testid="prototype-status" aria-live="polite">
            <strong>Prototype runtime candidate</strong>
            <span>{prototypeStatus}</span>
            <span>No model package, no model asset, no upload, no storage and no quote handoff are connected.</span>
          </div>

          {photo ? (
            <div className="room-editor-controls" aria-label="Room photo preview controls">
              <label>
                <span>Editor zoom <output>{zoom}%</output></span>
                <input type="range" min="100" max="225" step="25" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
              </label>
              <label>
                <span>Before / preview <output>{reveal}%</output></span>
                <input type="range" min="0" max="100" value={reveal} onChange={(event) => setReveal(Number(event.target.value))} disabled={!canPreview} />
              </label>
            </div>
          ) : null}

          <div className="room-editor-viewport" data-testid="local-editor-viewport">
            <div
              ref={stageRef}
              className={`room-stage room-local-stage${photo ? " has-local-photo" : ""}`}
              data-testid="local-mask-stage"
              onClick={handleStageClick}
              role="group"
              aria-label="Manual floor polygon editor"
              aria-describedby="roomMaskInstructions"
              style={stageStyle}
            >
              {photo ? (
                <>
                  <img src={photo.url} alt="Customer selected room preview kept locally in this browser" draggable="false" />
                  {canPreview ? (
                    <>
                      <div className="room-local-reveal-window" style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }} aria-hidden="true">
                        <div className="room-local-mask-reveal" style={{ clipPath: maskPolygon }}>
                          <FloorTexture look={activeLook} angle={textureAngle} scale={textureScale} />
                        </div>
                      </div>
                      <div className="room-local-reveal-line" style={{ left: `${reveal}%` }} aria-hidden="true"></div>
                      <span className="room-local-preview-label room-local-preview-label-before">Before</span>
                      <span className="room-local-preview-label room-local-preview-label-after">Preview</span>
                    </>
                  ) : null}
                  {snapshot.points.map((point, index) => (
                    <button
                      className={`room-mask-point${mask.activePointIndex === index ? " is-active" : ""}`}
                      data-testid="mask-point"
                      key={index}
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      type="button"
                      aria-label={`Move mask point ${index + 1}. X ${point.x} percent, Y ${point.y} percent.`}
                      aria-pressed={mask.activePointIndex === index}
                      onPointerDown={(event) => handlePointPointerDown(index, event)}
                      onPointerMove={(event) => handlePointPointerMove(index, event)}
                      onPointerUp={handlePointPointerUp}
                      onPointerCancel={(event) => { event.stopPropagation(); mask.cancelDrag(); }}
                      onClick={(event) => event.stopPropagation()}
                      onKeyDown={(event) => handlePointKeyDown(index, event)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </>
              ) : (
                <div className="room-local-empty">
                  <strong>Choose a room photo to start manual masking.</strong>
                  <span>Your photo stays in the browser. No storage, AI detection or lead submission is connected here.</span>
                </div>
              )}
            </div>
          </div>

          {selectedPoint && mask.activePointIndex !== null ? (
            <fieldset className="room-point-inspector">
              <legend>Edit point {mask.activePointIndex + 1}</legend>
              <label>
                <span>Horizontal position (%)</span>
                <input type="number" min="0" max="100" step="0.5" value={selectedPoint.x} onChange={(event) => updateSelectedPoint("x", event.target.value)} />
              </label>
              <label>
                <span>Vertical position (%)</span>
                <input type="number" min="0" max="100" step="0.5" value={selectedPoint.y} onChange={(event) => updateSelectedPoint("y", event.target.value)} />
              </label>
              <button className="button button-secondary" type="button" onClick={() => mask.removePoint(mask.activePointIndex as number)}>Remove point</button>
            </fieldset>
          ) : null}

          <p id="roomMaskInstructions" className="room-local-note">
            Use 3 to 8 points. Drag points directly, use arrow keys for fine movement, or zoom and scroll the editor for difficult corners.
          </p>
          {photo ? (
            <p className="room-photo-metadata">
              Local photo: {photo.width} x {photo.height}px, {formatFileSize(photo.size)}. Nothing is persisted when you clear or leave this page.
            </p>
          ) : null}
        </article>

        <aside className="room-selector-panel">
          <p className="eyebrow">Privacy and QA gate</p>
          <h2>Local manual editor</h2>
          <div className="room-phase2-checks">
            <div><strong>Local image only</strong><span>The preview uses a temporary browser object URL that is revoked when cleared.</span></div>
            <div><strong>Validated input</strong><span>JPEG, PNG, WebP and browser-supported HEIC images are checked for size and usable dimensions.</span></div>
            <div><strong>Geometric starter only</strong><span>The default starter uses a fixed shape, not AI inference or automatic floor detection.</span></div>
            <div><strong>Browser canvas prototype</strong><span>The optional local assist reads downscaled ImageData in this browser and never confirms a mask.</span></div>
            <div><strong>Manual correction required</strong><span>Suggested masks cannot be confirmed until at least one point is adjusted.</span></div>
            <div><strong>Accessible correction</strong><span>Points support dragging, arrow keys and exact percentage coordinates.</span></div>
            <div><strong>Product texture preview</strong><span>Repository-owned product swatches improve direction, but do not guarantee installed colour or scale.</span></div>
            <div><strong>No handoff data</strong><span>Photo and mask points are not sent into quote or contact workflows.</span></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
