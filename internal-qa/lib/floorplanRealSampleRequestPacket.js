"use strict";

const Collection = require("./floorplanRealSampleCollectionPlan");

function buildFloorplanRealSampleRequestPacket(items) {
  const collection = Collection.buildFloorplanRealSampleCollectionPlan(items);
  const request_rows = collection.required_rows.map(function (row) {
    return {
      slot_key: row.key,
      slot_label: row.label,
      status: row.current_status,
      requested: row.minimum_needed > 0,
      sample_goal: row.sample_goal,
      fixture_hint: row.fixture_hint,
      reviewer_evidence: row.reviewer_evidence,
      safe_output_needed: [
        "redacted fixture metadata",
        "reviewed section geometry",
        "reviewed total area",
        "scale basis",
        "non-identifying reviewer notes"
      ],
      must_remove: [
        "customer name",
        "direct contact details",
        "street or unit details",
        "original upload references",
        "temporary access links",
        "raw plan contents",
        "raw quote contents",
        "private commercial logic"
      ]
    };
  });
  const requested = request_rows.filter(function (row) {
    return row.requested;
  });
  return {
    packet_type: "floorplan_real_sample_request_packet",
    local_only: true,
    customer_visible: false,
    requested_slot_count: requested.length,
    request_rows: request_rows,
    output_template: "internal-qa/templates/floorplanApprovedRealSampleBatchTemplate.js",
    validation_commands: [
      "npm run benchmark:floorplan:validate-real-sample -- --fixture-file=<redacted-fixture-batch>",
      "npm run benchmark:floorplan:real-sample-intake -- --fixture-file=<redacted-fixture-batch> --json",
      "npm run test:floorplan-full",
      "npm run check:public-leaks",
      "git diff --check"
    ],
    approval_boundary: "Prepared samples must pass local validation before they are added to the active benchmark corpus. This packet does not approve training, production deployment, or customer-visible detection."
  };
}

function renderFloorplanRealSampleRequestPacketMarkdown(packet) {
  const lines = [];
  lines.push("# Floorplan Real Sample Request Packet");
  lines.push("");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("- Requested sample slots: " + packet.requested_slot_count);
  lines.push("- Output template: `" + packet.output_template + "`");
  lines.push("");
  lines.push("## Requested Slots");
  lines.push("");
  lines.push("| Needed | Slot | Goal | Fixture hint |");
  lines.push("| --- | --- | --- | --- |");
  packet.request_rows.forEach(function (row) {
    lines.push("| " + (row.requested ? "yes" : "no") + " | `" + row.slot_key + "` | " + row.sample_goal + " | " + row.fixture_hint + " |");
  });
  lines.push("");
  lines.push("## Evidence To Include");
  lines.push("");
  packet.request_rows.filter(function (row) { return row.requested; }).forEach(function (row) {
    lines.push("- `" + row.slot_key + "`: " + row.reviewer_evidence);
  });
  lines.push("");
  lines.push("## Safe Output Needed");
  lines.push("");
  packet.request_rows[0].safe_output_needed.forEach(function (item) {
    lines.push("- " + item);
  });
  lines.push("");
  lines.push("## Must Remove");
  lines.push("");
  packet.request_rows[0].must_remove.forEach(function (item) {
    lines.push("- " + item);
  });
  lines.push("");
  lines.push("## Validation Commands");
  lines.push("");
  packet.validation_commands.forEach(function (command) {
    lines.push("```bash");
    lines.push(command);
    lines.push("```");
  });
  lines.push("");
  lines.push("## Approval Boundary");
  lines.push("");
  lines.push(packet.approval_boundary);
  lines.push("");
  return lines.join("\n");
}

module.exports = {
  buildFloorplanRealSampleRequestPacket: buildFloorplanRealSampleRequestPacket,
  renderFloorplanRealSampleRequestPacketMarkdown: renderFloorplanRealSampleRequestPacketMarkdown
};
