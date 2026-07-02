#!/usr/bin/env node
"use strict";

const GATE_COMMANDS = [
  {
    key: "packet_contract",
    command: "node internal-qa/tests/web/floorplanPhase3ReviewPacketContract.test.js",
    purpose: "Verify the Phase 3 review packet writer and safe artifact shape."
  },
  {
    key: "packet_docs_contract",
    command: "node internal-qa/tests/web/floorplanPhase3ReviewPacketDocsContract.test.js",
    purpose: "Verify the local review packet runbook and approval boundaries."
  },
  {
    key: "full_floorplan_suite",
    command: "npm run test:floorplan-full",
    purpose: "Run the full advanced floorplan contract and benchmark suite."
  },
  {
    key: "review_packet",
    command: "npm run --silent benchmark:floorplan:phase3-packet -- --json --output-dir=internal-qa/reports/floorplan-phase3-review-packet",
    purpose: "Generate the local reviewer packet for Phase 3 decision making."
  },
  {
    key: "public_leak_check",
    command: "npm run check:public-leaks",
    purpose: "Confirm public output does not expose internal files or leak probes."
  },
  {
    key: "diff_check",
    command: "git diff --check",
    purpose: "Confirm staged or working tree changes have no whitespace errors."
  }
];

function buildReport() {
  return {
    report_type: "floorplan_phase3_local_gate_plan",
    local_only: true,
    customer_visible: false,
    deploy_required: false,
    supabase_change_required: false,
    command_count: GATE_COMMANDS.length,
    gate_commands: GATE_COMMANDS,
    production_boundary: "This plan does not approve production deploy, customer-visible detection, real-sample intake, or automatic measurement approval.",
    next_step_after_pass: "Review the Phase 3 packet and collect an approved redacted real reviewed sample batch only after human approval."
  };
}

function renderMarkdown(report) {
  const lines = [];
  lines.push("# Floorplan Phase 3 Local Gate Plan");
  lines.push("");
  lines.push("- Local only: yes");
  lines.push("- Customer visible: no");
  lines.push("- Deploy required: no");
  lines.push("- Supabase change required: no");
  lines.push("");
  lines.push("## Commands");
  lines.push("");
  report.gate_commands.forEach(function (row, index) {
    lines.push(String(index + 1) + ". `" + row.command + "`");
    lines.push("   - " + row.purpose);
  });
  lines.push("");
  lines.push("## Boundary");
  lines.push("");
  lines.push(report.production_boundary);
  lines.push("");
  lines.push("## Next Step");
  lines.push("");
  lines.push(report.next_step_after_pass);
  lines.push("");
  return lines.join("\n");
}

if (require.main === module) {
  const report = buildReport();
  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(report, null, 2) + "\n");
  } else {
    process.stdout.write(renderMarkdown(report));
  }
}

module.exports = {
  buildReport: buildReport,
  renderMarkdown: renderMarkdown
};
