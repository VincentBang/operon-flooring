import { useCallback, useRef, useState } from "react";
import {
  addMaskPoint,
  canConfirmMask,
  cloneMaskSnapshot,
  commitMaskHistory,
  confirmMaskSnapshot,
  createEmptyMaskSnapshot,
  createMaskHistory,
  createSuggestedMaskSnapshot,
  editMaskPoints,
  moveMaskPoint,
  redoMaskHistory,
  removeMaskPoint,
  roundMaskPoint,
  trimMaskHistory,
  undoMaskHistory
} from "./maskState";
import type { MaskHistory } from "./maskState";
import type { MaskPoint, MaskSnapshot, MaskSource } from "./types";

type DragState = {
  index: number;
  start: MaskSnapshot;
  moved: boolean;
};

export function useMaskEditor() {
  const [history, setHistory] = useState<MaskHistory>(createMaskHistory);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const commit = useCallback((update: (snapshot: MaskSnapshot) => MaskSnapshot) => {
    setHistory((current) => {
      const next = update(current.present);
      return commitMaskHistory(current, next);
    });
  }, []);

  const addPoint = useCallback((point: MaskPoint) => {
    commit((snapshot) => addMaskPoint(snapshot, point));
  }, [commit]);

  const movePoint = useCallback((index: number, point: MaskPoint) => {
    commit((snapshot) => moveMaskPoint(snapshot, index, point));
  }, [commit]);

  const removePoint = useCallback((index: number) => {
    commit((snapshot) => removeMaskPoint(snapshot, index));
    setActivePointIndex(null);
  }, [commit]);

  const replaceSuggestion = useCallback((points: MaskPoint[], source: Exclude<MaskSource, "manual">) => {
    commit(() => createSuggestedMaskSnapshot(points, source));
    setActivePointIndex(0);
  }, [commit]);

  const resetMask = useCallback(() => {
    commit(() => createEmptyMaskSnapshot());
    setActivePointIndex(null);
  }, [commit]);

  const clearHistory = useCallback(() => {
    dragRef.current = null;
    setHistory(createMaskHistory());
    setActivePointIndex(null);
  }, []);

  const undo = useCallback(() => {
    setHistory(undoMaskHistory);
    setActivePointIndex(null);
  }, []);

  const redo = useCallback(() => {
    setHistory(redoMaskHistory);
    setActivePointIndex(null);
  }, []);

  const beginDrag = useCallback((index: number) => {
    setActivePointIndex(index);
    setHistory((current) => {
      dragRef.current = {
        index,
        start: cloneMaskSnapshot(current.present),
        moved: false
      };
      return current;
    });
  }, []);

  const previewDrag = useCallback((index: number, point: MaskPoint) => {
    const drag = dragRef.current;
    if (!drag || drag.index !== index) {
      return;
    }
    drag.moved = true;
    setHistory((current) => ({
      ...current,
      present: editMaskPoints(drag.start, current.present.points.map((item, pointIndex) => (
        pointIndex === index ? roundMaskPoint(point.x, point.y) : item
      )))
    }));
  }, []);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || !drag.moved) {
      return;
    }
    setHistory((current) => ({
      past: trimMaskHistory([...current.past, cloneMaskSnapshot(drag.start)]),
      present: current.present,
      future: []
    }));
  }, []);

  const cancelDrag = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) {
      return;
    }
    setHistory((current) => ({ ...current, present: cloneMaskSnapshot(drag.start) }));
  }, []);

  const confirmMask = useCallback(() => {
    commit(confirmMaskSnapshot);
    setActivePointIndex(null);
  }, [commit]);

  const snapshot = history.present;
  const canConfirm = canConfirmMask(snapshot);

  return {
    snapshot,
    activePointIndex,
    setActivePointIndex,
    addPoint,
    movePoint,
    removePoint,
    replaceSuggestion,
    resetMask,
    clearHistory,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    beginDrag,
    previewDrag,
    endDrag,
    cancelDrag,
    confirmMask,
    canConfirm
  };
}
