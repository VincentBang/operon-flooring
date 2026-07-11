const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const typescript = require(path.join(repoRoot, "apps", "web-tsx", "node_modules", "typescript"));

function loadPureTypeScriptModule(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  const source = fs.readFileSync(filePath, "utf8");
  const result = typescript.transpileModule(source, {
    compilerOptions: {
      module: typescript.ModuleKind.CommonJS,
      target: typescript.ScriptTarget.ES2022
    },
    fileName: filePath,
    reportDiagnostics: true
  });
  const errors = (result.diagnostics || []).filter(function (diagnostic) {
    return diagnostic.category === typescript.DiagnosticCategory.Error;
  });
  assert.deepEqual(errors, [], relativePath + " must transpile without syntax errors.");

  const module = { exports: {} };
  const localRequire = function (specifier) {
    throw new Error("Pure test module unexpectedly required runtime dependency: " + specifier);
  };
  const evaluate = new Function("exports", "require", "module", "__filename", "__dirname", result.outputText);
  evaluate(module.exports, localRequire, module, filePath, path.dirname(filePath));
  return module.exports;
}

const mask = loadPureTypeScriptModule("apps/web-tsx/src/app/room-visualiser/maskState.ts");
const photo = loadPureTypeScriptModule("apps/web-tsx/src/app/room-visualiser/photoValidation.ts");

assert.deepEqual(mask.roundMaskPoint(-2, 101), { x: 0, y: 100 });
assert.deepEqual(mask.roundMaskPoint(22.26, 58.04), { x: 22.3, y: 58 });

let manual = mask.createEmptyMaskSnapshot();
manual = mask.addMaskPoint(manual, { x: 10, y: 50 });
manual = mask.addMaskPoint(manual, { x: 90, y: 50 });
manual = mask.addMaskPoint(manual, { x: 90, y: 95 });
assert.equal(manual.source, "manual");
assert.equal(mask.canConfirmMask(manual), true, "three manually placed points should be confirmable.");
assert.equal(mask.confirmMaskSnapshot(manual).confirmed, true);

let capped = mask.createEmptyMaskSnapshot();
for (let index = 0; index < 10; index += 1) {
  capped = mask.addMaskPoint(capped, { x: index * 10, y: 80 });
}
assert.equal(capped.points.length, 8, "manual masks must stop at eight points.");

const suggestion = mask.createSuggestedMaskSnapshot([
  { x: 13, y: 46 },
  { x: 87, y: 43 },
  { x: 96, y: 96 },
  { x: 4, y: 96 }
], "browser-prototype");
assert.equal(mask.canConfirmMask(suggestion), false, "untouched suggestions must not be confirmable.");
assert.strictEqual(mask.confirmMaskSnapshot(suggestion), suggestion, "blocked confirmation must not create a new state.");

const corrected = mask.moveMaskPoint(suggestion, 0, { x: 14, y: 46 });
assert.equal(corrected.manualAdjustments, 1);
assert.equal(corrected.confirmed, false);
assert.equal(mask.canConfirmMask(corrected), true, "one manual correction should unlock local confirmation.");
const confirmed = mask.confirmMaskSnapshot(corrected);
assert.equal(confirmed.confirmed, true);
assert.equal(mask.canConfirmMask(confirmed), false);
assert.equal(mask.moveMaskPoint(confirmed, 0, { x: 15, y: 46 }).confirmed, false, "editing must revoke confirmation.");

let history = mask.createMaskHistory();
history = mask.commitMaskHistory(history, suggestion);
history = mask.commitMaskHistory(history, corrected);
history = mask.commitMaskHistory(history, confirmed);
assert.equal(history.past.length, 3);
let undone = mask.undoMaskHistory(history);
assert.deepEqual(undone.present, corrected);
assert.equal(undone.future.length, 1);
const redone = mask.redoMaskHistory(undone);
assert.deepEqual(redone.present, confirmed);
assert.equal(redone.future.length, 0);

undone = mask.undoMaskHistory(history);
const branched = mask.commitMaskHistory(undone, mask.moveMaskPoint(undone.present, 1, { x: 86, y: 43 }));
assert.equal(branched.future.length, 0, "a new edit after undo must clear redo history.");

let boundedHistory = mask.createMaskHistory();
let boundedSnapshot = manual;
for (let index = 0; index < 45; index += 1) {
  boundedSnapshot = mask.moveMaskPoint(boundedSnapshot, 0, { x: 10 + (index * 0.5), y: 50 });
  boundedHistory = mask.commitMaskHistory(boundedHistory, boundedSnapshot);
}
assert.equal(boundedHistory.past.length, mask.MASK_HISTORY_LIMIT, "history must remain bounded.");

assert.equal(photo.getLocalPhotoFileError({ name: "room.jpg", type: "image/jpeg", size: 1024 }), "");
assert.equal(photo.getLocalPhotoFileError({ name: "room.WEBP", type: "", size: 1024 }), "");
assert.match(
  photo.getLocalPhotoFileError({ name: "floor-plan.pdf", type: "application/pdf", size: 1024 }),
  /JPEG, PNG, WebP/
);
assert.equal(
  photo.getLocalPhotoFileError({ name: "room.jpg", type: "image/jpeg", size: photo.LOCAL_PHOTO_MAX_BYTES }),
  ""
);
assert.match(
  photo.getLocalPhotoFileError({ name: "room.jpg", type: "image/jpeg", size: photo.LOCAL_PHOTO_MAX_BYTES + 1 }),
  /larger than 15 MB/
);
assert.equal(photo.getLocalPhotoDimensionError(320, 320), "");
assert.match(photo.getLocalPhotoDimensionError(319, 1000), /at least 320 pixels/);
assert.equal(photo.getLocalPhotoDimensionError(8000, 4000), "");
assert.match(photo.getLocalPhotoDimensionError(8001, 4000), /under 32 megapixels/);

console.log("roomVisualiserEditor.test.js passed");
