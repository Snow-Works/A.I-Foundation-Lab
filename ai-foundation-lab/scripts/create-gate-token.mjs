// scripts/create-gate-token.mjs
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import PocketBase from "pocketbase";
import "dotenv/config";

const PB_URL = (
  process.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090"
).trim().replace(/\/+$/, "");

const APP_URL = (
  process.env.VITE_APP_URL || "http://localhost:5173"
).trim().replace(/\/+$/, "");

const ADMIN_EMAIL = (process.env.PB_ADMIN_EMAIL || "").trim();
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD in .env");
  process.exit(1);
}

function readFlag(name, defaultValue) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return defaultValue;
  return process.argv[idx + 1] || defaultValue;
}

const expiresHours = Number(readFlag("expires", "24"));
const maxUses = Number(readFlag("uses", "1"));

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

function authenticate() {
  console.log(`🔐 Authenticating as ${ADMIN_EMAIL}...`);

  const url = `${PB_URL}/api/admins/auth-with-password`;
  const payload = JSON.stringify({
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  let raw;
  try {
    raw = execFileSync(
      "curl",
      [
        "-s", "-S",
        "-w", "\n__HTTP_STATUS__%{http_code}",
        "-X", "POST",
        url,
        "-H", "Content-Type: application/json",
        "--data-binary", payload,
      ],
      { encoding: "utf8" }
    );
  } catch (err) {
    console.error("❌ curl subprocess failed:", err.message);
    process.exit(1);
  }

  const statusMatch = raw.match(/__HTTP_STATUS__(\d+)\s*$/);
  const httpStatus = statusMatch ? Number(statusMatch[1]) : null;
  const body = raw.replace(/__HTTP_STATUS__\d+\s*$/, "").trim();

  if (httpStatus !== 200) {
    console.error(`\n❌ Authentication failed. HTTP ${httpStatus}`);
    console.error(`   ${body}`);
    process.exit(1);
  }

  const data = JSON.parse(body);
  pb.authStore.save(data.token, data.admin);
  console.log("✅ Authenticated.\n");
}

async function main() {
  authenticate();

  const token = generateToken();
  const expiresAt = new Date(Date.now() + expiresHours * 3600 * 1000);

  console.log(`🎫 Creating gate token...`);

  const record = await pb.collection("gate_tokens").create({
    token,
    expires_at: expiresAt.toISOString(),
    max_uses: maxUses,
    revoked: false,
  });

  const gateUrl = `${APP_URL}/#/exam-gate?id=${record.id}`;

  // Copy to clipboard on macOS
  let clipboardStatus = "";
  try {
    execFileSync("pbcopy", [], { input: gateUrl });
    clipboardStatus = "✅ Copied to clipboard";
  } catch {
    clipboardStatus = "⚠️  Could not copy to clipboard (not on macOS?)";
  }

  console.log();
  console.log("──────────────────────────────────────────────────────");
  console.log("  ✅ GATE TOKEN CREATED");
  console.log("──────────────────────────────────────────────────────");
  console.log();
  console.log(`  Record ID:  ${record.id}`);
  console.log(`  Expires:    ${expiresAt.toLocaleString()}`);
  console.log(`  Max uses:   ${maxUses}`);
  console.log();
  console.log(`  ${clipboardStatus}`);
  console.log();
  console.log(`  Just paste in your browser (Cmd+V):`);
  console.log();
  console.log(`  ${gateUrl}`);
  console.log();
  console.log("──────────────────────────────────────────────────────");
  console.log();
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err?.message || err);
  process.exit(1);
});