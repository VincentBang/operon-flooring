import type { MaskPoint, MaskSnapshot, MaskSource } from "./types";

export type MaskHistory = {
  past: MaskSnapshot[];
  present: MaskSnapshot;
  future: MaskSnapshot[];
};

export const MASK_HISTORY_LIMIT = 40;

export function createEmptyMaskSnapshot(): MaskSnapshot {
  return {
    points: [],
    source: "manual",
    manualAdjustments: 0,
    confirmed: false
  };
}

export function cloneMaskSnapshot(snapshot: MaskSnapshot): MaskSnapshot {
  return {
    ...snapshot,
    points: snapshot.points.map((point) => ({ ...point }))
  };
}

export function roundMaskPoint(x: number, y: number): MaskPoint {
  const clamp = (value: number) => Math.max(0, Math.min(100, value));
  return {
    x: Math.round(clamp(x) * 10) / 10,
    y: Math.round(clamp(y) * 10) / 10
  };
}

export function maskSnapshotsEqual(left: MaskSnapshot, right: MaskSnapshot) {
  return left.source === right.source
    && left.manualAdjustments === right.manualAdjustments
    && left.confirmed === right.confirmed
    && left.points.length === right.points.length
    && left.points.every((point, index) => point.x === right.points[index].x && point.y === right.points[index].y);
}

export function trimMaskHistory(items: MaskSnapshot[]) {
  return items.slice(-MASK_HISTORY_LIMIT);
}

export function editMaskPoints(snapshot: MaskSnapshot, points: MaskPoint[]): MaskSnapshot {
  return {
    points,
    source: snapshot.source,
    manualAdjustments: snapshot.source === "manual" ? snapshot.manualAdjustments : snapshot.manualAdjustments + 1,
    confirmed: false
  };
}

export function addMaskPoint(snapshot: MaskSnapshot, point: MaskPoint): MaskSnapshot {
  if (snapshot.points.length >= 8) {
    return snapshot;
  }
  const source = snapshot.points.length ? snapshot.source : "manual";
  return editMaskPoints(
    { ...snapshot, source },
    [...snapshot.points, roundMaskPoint(point.x, point.y)]
  );
}

export function moveMaskPoint(snapshot: MaskSnapshot, index: number, point: MaskPoint): MaskSnapshot {
  if (!snapshot.points[index]) {
    return snapshot;
  }
  return editMaskPoints(snapshot, snapshot.points.map((current, pointIndex) => (
    pointIndex === index ? roundMaskPoint(point.x, point.y) : current
  )));
}

export function removeMaskPoint(snapshot: MaskSnapshot, index: number): MaskSnapshot {
  if (!snapshot.points[index]) {
    return snapshot;
  }
  return editMaskPoints(snapshot, snapshot.points.filter((_, pointIndex) => pointIndex !== index));
}

export function createSuggestedMaskSnapshot(
  points: MaskPoint[],
  source: Exclude<MaskSource, "manual">
): MaskSnapshot {
  return {
    points: points.map((point) => roundMaskPoint(point.x, point.y)),
    source,
    manualAdjustments: 0,
    confirmed: false
  };
}

export function canConfirmMask(snapshot: MaskSnapshot) {
  return snapshot.points.length >= 3
    && (snapshot.source === "manual" || snapshot.manualAdjustments > 0)
    && !snapshot.confirmed;
}

export function confirmMaskSnapshot(snapshot: MaskSnapshot): MaskSnapshot {
  return canConfirmMask(snapshot) ? { ...snapshot, confirmed: true } : snapshot;
}

export function createMaskHistory(): MaskHistory {
  return {
    past: [],
    present: createEmptyMaskSnapshot(),
    future: []
  };
}

export function commitMaskHistory(current: MaskHistory, next: MaskSnapshot): MaskHistory {
  if (maskSnapshotsEqual(current.present, next)) {
    return current;
  }
  return {
    past: trimMaskHistory([...current.past, cloneMaskSnapshot(current.present)]),
    present: cloneMaskSnapshot(next),
    future: []
  };
}

export function undoMaskHistory(current: MaskHistory): MaskHistory {
  if (!current.past.length) {
    return current;
  }
  const previous = current.past[current.past.length - 1];
  return {
    past: current.past.slice(0, -1),
    present: cloneMaskSnapshot(previous),
    future: [cloneMaskSnapshot(current.present), ...current.future]
  };
}

export function redoMaskHistory(current: MaskHistory): MaskHistory {
  if (!current.future.length) {
    return current;
  }
  const next = current.future[0];
  return {
    past: trimMaskHistory([...current.past, cloneMaskSnapshot(current.present)]),
    present: cloneMaskSnapshot(next),
    future: current.future.slice(1)
  };
}
