import {
  createPoint,
  polygonBounds,
  validatePolygon
} from "./geometry.js";
import {
  createRoom,
  createScanReport,
  exportScanReportJSON,
  mockQuoteSystemReadScanReport
} from "./models.js";

const canvas = document.querySelector("#room-canvas");
const context = canvas.getContext("2d");
const roomList = document.querySelector("#room-list");
const roomNameInput = document.querySelector("#room-name");
const roomNotesInput = document.querySelector("#room-notes");
const reportOutput = document.querySelector("#report-output");
const summaryOutput = document.querySelector("#summary-output");
const integrationOutput = document.querySelector("#integration-output");
const buttons = {
  newRoom: document.querySelector("#new-room"),
  clearRoom: document.querySelector("#clear-room"),
  exportJson: document.querySelector("#export-json"),
  mockRead: document.querySelector("#mock-read")
};

const state = {
  rooms: [
    createRoom({ name: "Room 1" })
  ],
  activeRoomId: null,
  selectedPointIndex: null
};

state.activeRoomId = state.rooms[0].id;

function activeRoom() {
  return state.rooms.find((room) => room.id === state.activeRoomId);
}

function setActiveRoom(id) {
  state.activeRoomId = id;
  state.selectedPointIndex = null;
  syncInputs();
  render();
}

function addRoom() {
  const room = createRoom({ name: `Room ${state.rooms.length + 1}` });
  state.rooms.push(room);
  setActiveRoom(room.id);
}

function clearActiveRoom() {
  const room = activeRoom();
  if (!room) return;
  room.points = [];
  state.selectedPointIndex = null;
  render();
}

function syncInputs() {
  const room = activeRoom();
  if (!room) return;
  roomNameInput.value = room.name;
  roomNotesInput.value = room.notes ?? "";
}

function updateActiveRoomDetails() {
  const room = activeRoom();
  if (!room) return;
  room.name = roomNameInput.value.trim() || "Room";
  room.notes = roomNotesInput.value.trim();
  render();
}

function canvasToWorld(location) {
  const bounds = canvas.getBoundingClientRect();
  const x = ((location.clientX - bounds.left) / bounds.width) * canvas.width;
  const y = ((location.clientY - bounds.top) / bounds.height) * canvas.height;
  return createPoint(roundToGrid(x / 40), roundToGrid((canvas.height - y) / 40));
}

function worldToCanvas(point) {
  return {
    x: point.x * 40,
    y: canvas.height - point.y * 40
  };
}

function findPointIndex(location) {
  const room = activeRoom();
  if (!room) return -1;
  const world = canvasToWorld(location);
  return room.points.findIndex((point) => {
    const canvasPoint = worldToCanvas(point);
    const pointerPoint = worldToCanvas(world);
    return Math.hypot(canvasPoint.x - pointerPoint.x, canvasPoint.y - pointerPoint.y) <= 12;
  });
}

function handleCanvasPointerDown(event) {
  const room = activeRoom();
  if (!room) return;

  const pointIndex = findPointIndex(event);
  if (pointIndex >= 0) {
    state.selectedPointIndex = pointIndex;
    canvas.setPointerCapture(event.pointerId);
    render();
    return;
  }

  room.points.push(canvasToWorld(event));
  state.selectedPointIndex = room.points.length - 1;
  render();
}

function handleCanvasPointerMove(event) {
  const room = activeRoom();
  if (!room || state.selectedPointIndex === null || event.buttons !== 1) return;
  room.points[state.selectedPointIndex] = canvasToWorld(event);
  render();
}

function handleCanvasPointerUp(event) {
  if (canvas.hasPointerCapture(event.pointerId)) {
    canvas.releasePointerCapture(event.pointerId);
  }
}

function removePoint(index) {
  const room = activeRoom();
  if (!room) return;
  room.points.splice(index, 1);
  state.selectedPointIndex = null;
  render();
}

function currentReport() {
  return createScanReport({
    customerReference: "manual-phase-1",
    rooms: state.rooms
  });
}

function exportJson() {
  const json = exportScanReportJSON(currentReport());
  reportOutput.value = json;
}

function runMockRead() {
  try {
    const json = reportOutput.value.trim() || exportScanReportJSON(currentReport());
    const result = mockQuoteSystemReadScanReport(json);
    integrationOutput.textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    integrationOutput.textContent = `Mock read failed: ${error.message}`;
  }
}

function render() {
  drawCanvas();
  renderRoomList();
  renderSummary();
}

function drawCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  const room = activeRoom();
  if (!room) return;

  const points = room.points.map(worldToCanvas);
  if (points.length > 0) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (const point of points.slice(1)) {
      context.lineTo(point.x, point.y);
    }
    if (points.length >= 3) {
      context.closePath();
      context.fillStyle = "rgba(44, 122, 123, 0.16)";
      context.fill();
    }
    context.strokeStyle = "#245f63";
    context.lineWidth = 3;
    context.lineJoin = "round";
    context.stroke();
  }

  points.forEach((point, index) => {
    context.beginPath();
    context.arc(point.x, point.y, index === state.selectedPointIndex ? 8 : 6, 0, Math.PI * 2);
    context.fillStyle = index === 0 ? "#c2410c" : "#ffffff";
    context.fill();
    context.strokeStyle = "#245f63";
    context.lineWidth = 2;
    context.stroke();
  });
}

function drawGrid() {
  context.fillStyle = "#f7f5ef";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "#ddd7ca";
  context.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }
}

function renderRoomList() {
  roomList.innerHTML = "";
  for (const room of state.rooms) {
    const validation = validatePolygon(room.points);
    const item = document.createElement("button");
    item.className = room.id === state.activeRoomId ? "room-item active" : "room-item";
    item.type = "button";
    item.innerHTML = `<strong>${escapeHtml(room.name)}</strong><span>${validation.area.toFixed(2)} m2</span>`;
    item.addEventListener("click", () => setActiveRoom(room.id));
    roomList.append(item);
  }
}

function renderSummary() {
  const report = currentReport();
  const room = activeRoom();
  const validation = validatePolygon(room?.points ?? []);
  const pointRows = (room?.points ?? []).map((point, index) => `
    <li>
      <button type="button" data-remove-point="${index}">Remove</button>
      P${index + 1}: ${point.x.toFixed(2)}, ${point.y.toFixed(2)}
    </li>
  `).join("");

  summaryOutput.innerHTML = `
    <div class="summary-grid">
      <div><span>Total area</span><strong>${report.totals.areaSquareMeters.toFixed(2)} m2</strong></div>
      <div><span>Total perimeter</span><strong>${report.totals.perimeterMeters.toFixed(2)} m</strong></div>
      <div><span>Valid rooms</span><strong>${report.totals.validRoomCount}/${report.totals.roomCount}</strong></div>
      <div><span>Active room</span><strong>${validation.area.toFixed(2)} m2</strong></div>
    </div>
    <div class="validation ${validation.isValid ? "valid" : "invalid"}">
      ${validation.isValid ? "Room polygon is valid." : validation.issues.join(" ")}
    </div>
    <ul class="points-list">${pointRows || "<li>No points yet.</li>"}</ul>
  `;

  summaryOutput.querySelectorAll("[data-remove-point]").forEach((button) => {
    button.addEventListener("click", () => removePoint(Number(button.dataset.removePoint)));
  });
}

function roundToGrid(value) {
  return Math.round(value * 4) / 4;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
}

canvas.addEventListener("pointerdown", handleCanvasPointerDown);
canvas.addEventListener("pointermove", handleCanvasPointerMove);
canvas.addEventListener("pointerup", handleCanvasPointerUp);
roomNameInput.addEventListener("input", updateActiveRoomDetails);
roomNotesInput.addEventListener("input", updateActiveRoomDetails);
buttons.newRoom.addEventListener("click", addRoom);
buttons.clearRoom.addEventListener("click", clearActiveRoom);
buttons.exportJson.addEventListener("click", exportJson);
buttons.mockRead.addEventListener("click", runMockRead);

syncInputs();
render();
