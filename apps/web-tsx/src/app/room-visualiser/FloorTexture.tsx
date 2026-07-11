import type { CSSProperties } from "react";
import type { FlooringLook } from "./types";

type FloorTextureProps = {
  look: FlooringLook;
  angle: number;
  scale: number;
};

export function FloorTexture({ look, angle, scale }: FloorTextureProps) {
  const style = {
    "--floor-texture-image": `url("${look.textureUrl}")`,
    "--floor-texture-angle": `${angle}deg`,
    "--floor-texture-size": `${scale}px`
  } as CSSProperties;

  return (
    <span className="room-floor-texture" style={style} data-product-id={look.id} aria-hidden="true">
      <span className="room-floor-texture-surface"></span>
      <span className="room-floor-texture-light"></span>
    </span>
  );
}
