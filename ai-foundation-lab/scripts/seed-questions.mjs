// scripts/seed-questions.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import PocketBase from "pocketbase";
import "dotenv/config";

/* ------------------------------------------------------------
   Sanitise PB_URL: strip trailing slashes and whitespace.
   A stray trailing slash causes double-slash URLs that
   PocketBase rejects with 405.
   ------------------------------------------------------------ */
const PB_URL = (
  process.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090"
).trim().replace(/\/+$/, "");

const ADMIN_EMAIL = (process.env.PB_ADMIN_EMAIL || "").trim();
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "";

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("❌ Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD in .env");
  process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error("❌ Usage: node scripts/seed-questions.mjs <path-to-json>");
  process.exit(1);
}

const absPath = path.resolve(process.cwd(), filePath);
if (!fs.existsSync(absPath)) {
  console.error(`❌ File not found: ${absPath}`);
  process.exit(1);
}

const questions = JSON.parse(fs.readFileSync(absPath, "utf8"));
if (!Array.isArray(questions) || questions.length === 0) {
  console.error("❌ JSON file must contain a non-empty array.");
  process.exit(1);
}

console.log(`📦 Loaded ${questions.length} questions from ${filePath}`);
console.log(`🌐 Using PocketBase at: ${PB_URL}`);

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

function authenticate() {
  console.log(`🔐 Authenticating as ${ADMIN_EMAIL}...`);

  const url = `${PB_URL}/api/admins/auth-with-password`;
  const payload = JSON.stringify({
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  console.log(`   → POST ${url}`);

  let raw;
  try {
    raw = execFileSync(
      "curl",
      [
        "-s",
        "-S",
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

  // Split the response body from the HTTP status marker
  const statusMatch = raw.match(/__HTTP_STATUS__(\d+)\s*$/);
  const httpStatus = statusMatch ? Number(statusMatch[1]) : null;
  const body = raw.replace(/__HTTP_STATUS__\d+\s*$/, "").trim();

  console.log(`   → HTTP ${httpStatus}`);

  if (httpStatus !== 200) {
    console.error("\n❌ Authentication failed.");
    console.error(`   HTTP status: ${httpStatus}`);
    console.error(`   Body: ${body}`);
    console.error(
      "\n   → The URL shown above must match what worked from the terminal."
    );
    console.error(
      "   → If it has a double slash or trailing space, fix PB_URL in .env."
    );
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch {
    console.error("❌ Could not parse auth response:");
    console.error("   Raw body:", body);
    process.exit(1);
  }

  if (!data.token) {
    console.error("❌ No token in response. Got:", data);
    process.exit(1);
  }

  pb.authStore.save(data.token, data.admin);
  console.log("✅ Authenticated.\n");
}

async function main() {
  authenticate();

  const existing = await pb.collection("questions").getFullList({
    fields: "id,title",
  });
  const existingTitles = new Set(existing.map((r) => r.title));
  console.log(`📚 Found ${existing.length} existing questions.\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const q of questions) {
    if (existingTitles.has(q.title)) {
      console.log(`⏭  Skipping "${q.title}" — already exists.`);
      skipped++;
      continue;
    }

    try {
      await pb.collection("questions").create({
        title: q.title,
        prompt: q.prompt,
        difficulty: q.difficulty || "medium",
        topic: q.topic || "",
        rubric: q.rubric || "",
        sample_solution: q.sample_solution || "",
        active: true,
      });
      console.log(`✅ Inserted "${q.title}"`);
      inserted++;
    } catch (err) {
      console.error(`❌ Failed to insert "${q.title}":`);
      console.error("   ", err?.response?.message || err?.message);
      failed++;
    }
  }

  console.log("\n────────── Summary ──────────");
  console.log(`  Inserted:  ${inserted}`);
  console.log(`  Skipped:   ${skipped}`);
  console.log(`  Failed:    ${failed}`);
  console.log("─────────────────────────────\n");

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n❌ Fatal error:", err?.message || err);
  process.exit(1);
});