const assert = require("assert");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..", "..", "..");
const agentsPath = path.join(repoRoot, "internal-docs", "apps-web", "AGENTS.md");
const policyPath = path.join(repoRoot, "docs", "security", "SECURITY_POLICY.md");

function assertIncludesAll(text, terms, label) {
  terms.forEach(function (term) {
    assert.ok(text.includes(term), label + " missing `" + term + "`.");
  });
}

function main() {
  assert.ok(fs.existsSync(agentsPath), "Operon agent rules missing.");
  assert.ok(fs.existsSync(policyPath), "Security policy missing.");

  const agents = fs.readFileSync(agentsPath, "utf8");
  const policy = fs.readFileSync(policyPath, "utf8");

  assertIncludesAll(agents, [
    "Before editing quote, upload, storage, email, OpenAI, analytics, admin or security-sensitive code, read `docs/security/SECURITY_POLICY.md`.",
    "Do not build SaaS features, marketplace logic, backend email changes, pricing logic changes, quote calculation changes, or product data logic changes unless the user explicitly asks.",
    "Do not edit quote flow, floorplan tool, pricing logic, product data, backend/API/email logic, Supabase functions, or chatbot live integration unless the user explicitly requests that work."
  ], "Agent rules");

  assertIncludesAll(policy, [
    "Never put OpenAI, Resend, Supabase service role, admin tokens or webhook secrets in frontend HTML or public JavaScript.",
    "Store uploads in private buckets only.",
    "Do not return stack traces, provider internals, secrets or raw customer payloads to users.",
    "Never send to GA4:",
    "Admin dashboards must not be public data views.",
    "Pricing formulas were not changed during security-only work."
  ], "Security policy");

  console.log("securityPolicyContract.test.js passed");
}

main();

