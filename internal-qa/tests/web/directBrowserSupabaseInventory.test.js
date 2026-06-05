const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");

const inventoryTargets = [
  {
    file: "apps/web-tsx/public/quoteRuntime.js",
    expectedTableWrites: []
  },
  {
    file: "apps/web-tsx/public/tracking.js",
    expectedTableWrites: []
  }
];

function main() {
  const findings = [];
  const discoveredWrites = [];
  const inventoryDocPath = path.join(repoRoot, "internal-docs/apps-web/DIRECT_BROWSER_SUPABASE_WRITE_INVENTORY.md");
  const routePlanPath = path.join(repoRoot, "internal-docs/apps-web/TASK_A2_DIRECT_BROWSER_SUPABASE_FUNCTION_ROUTE_PLAN.md");

  inventoryTargets.forEach(function (target) {
    const filePath = path.join(repoRoot, target.file);
    assert.ok(fs.existsSync(filePath), "Inventory target missing: " + target.file);
    const content = fs.readFileSync(filePath, "utf8");
    [
      "OPERON_SUPABASE_CONFIG",
      "OPERON_SUPABASE_PROJECT_REF",
      "anonKey",
      "quoteFilesBucket",
      "supabase.createClient",
      "window.supabase"
    ].forEach(function (term) {
      assert.ok(
        !content.includes(term),
        "Unexpected public Supabase browser config/client marker found in " + target.file + ": " + term
      );
    });
    const targetWrites = new Set();
    const fromPattern = /\.from\("([^"]+)"\)/g;
    const trackingPattern = /sendToSupabase\("([^"]+)"/g;
    let match;
    while ((match = fromPattern.exec(content)) !== null) {
      targetWrites.add(match[1]);
    }
    while ((match = trackingPattern.exec(content)) !== null) {
      targetWrites.add(match[1]);
    }

    target.expectedTableWrites.forEach(function (tableName) {
      assert.ok(
        targetWrites.has(tableName),
        "Expected legacy direct browser Supabase write missing from inventory baseline: " + target.file + " -> " + tableName
      );
    });

    Array.from(targetWrites).forEach(function (tableName) {
      discoveredWrites.push(target.file + " -> " + tableName);
      assert.ok(
        target.expectedTableWrites.includes(tableName),
        "Unexpected direct browser Supabase write found. Update the Task A2 plan before accepting: " + target.file + " -> " + tableName
      );
      findings.push(target.file + " contains legacy direct browser Supabase write: " + tableName);
    });
  });

  assert.strictEqual(
    discoveredWrites.length,
    0,
    "Direct browser Supabase write inventory count changed. Review Task A2 before accepting."
  );

  assert.ok(
    fs.existsSync(inventoryDocPath),
    "Direct browser Supabase inventory doc is required while legacy anon writes remain."
  );
  assert.ok(
    fs.existsSync(routePlanPath),
    "Task A2 direct browser Supabase function-route plan is required while legacy anon writes remain."
  );

  const routePlan = fs.readFileSync(routePlanPath, "utf8");
  [
    "saveQuoteDraftToNetlify(payload)",
    "submitLeadToNetlifyForm(leadPayload, submitPayload)",
    "Quote Runtime Fallback Status: removed locally",
    "No `.from(\"quote_requests\")`, `.from(\"quote_rooms\")`, or `.from(\"quote_items\")` direct browser writes remain in `quoteRuntime.js`.",
    "Tracking Write Status: removed locally",
    "No `sendToSupabase(\"quote_funnel_sessions\", ...)` or `sendToSupabase(\"quote_events\", ...)` direct browser writes remain in `tracking.js`.",
    "Public Supabase Anon Config Status: removed locally",
    "`quoteRuntime.js` no longer publishes `window.OPERON_SUPABASE_CONFIG`.",
    "directBrowserSupabaseInventory.test.js` now blocks direct browser write targets"
  ].forEach(function (term) {
    assert.ok(routePlan.includes(term), "Task A2 plan should include `" + term + "`.");
  });

  if (findings.length) {
    console.log("Known direct browser Supabase write inventory:");
    findings.forEach(function (finding) {
      console.log("- " + finding);
    });
  }

  console.log("directBrowserSupabaseInventory.test.js passed");
}

main();
