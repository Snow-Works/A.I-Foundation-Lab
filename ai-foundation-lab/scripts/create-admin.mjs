// scripts/create-admin.mjs
//
// Creates an admin account in the `admins` collection.
//
// Usage:
//   node scripts/create-admin.mjs <email> <password> <name> [role]
//
// Examples:
//   node scripts/create-admin.mjs williams@aifoundationlab.dev StrongPass123 "Williams Adaji-Agbane" superadmin
//   node scripts/create-admin.mjs marker@aifoundationlab.dev MarkerPass123 "Marker One" marker

import { execFileSync } from "node:child_process";
import PocketBase from "pocketbase";
import "dotenv/config";

const PB_URL = (
  process.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090"
).trim().replace(/\/+$/, "");

const ADMIN_EMAIL = (process.env.PB_ADMIN_EMAIL || "").trim();
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "";

const [email, password, name, role = "admin"] = process.argv.slice(2);

if (!email || !password || !name) {
  console.error(
    "❌ Usage: node scripts/create-admin.mjs <email> <password> <name> [role]"
  );
  console.error(
    "   Roles: superadmin | admin | marker (default: admin)"
  );
  process.exit(1);
}

if (!["superadmin", "admin", "marker"].includes(role)) {
  console.error(`❌ Invalid role: ${role}. Must be superadmin, admin, or marker.`);
  process.exit(1);
}

if (password.length < 8) {
  console.error("❌ Password must be at least 8 characters.");
  process.exit(1);
}

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

function authenticateSuperuser() {
  console.log(`🔐 Authenticating as superuser (${ADMIN_EMAIL})...`);
  const url = `${PB_URL}/api/admins/auth-with-password`;
  const payload = JSON.stringify({
    identity: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const raw = execFileSync(
    "curl",
    [
      "-s",
      "-X", "POST",
      url,
      "-H", "Content-Type: application/json",
      "--data-binary", payload,
    ],
    { encoding: "utf8" }
  );
  const data = JSON.parse(raw);
  if (!data.token) {
    console.error("❌ Superuser auth failed:", data);
    process.exit(1);
  }
  pb.authStore.save(data.token, data.admin);
  console.log("✅ Authenticated.\n");
}

async function createAdmin() {
  // Check if an admin with this email already exists
  const existing = await pb.collection("admins").getFullList({
    filter: `email = "${email}"`,
  });

  if (existing.length > 0) {
    console.error(`❌ An admin with email ${email} already exists.`);
    console.error(`   Record ID: ${existing[0].id}`);
    process.exit(1);
  }

  const record = await pb.collection("admins").create({
    email,
    password,
    passwordConfirm: password,
    name,
    role,
    emailVisibility: true,
  });

  return record;
}

async function main() {
  authenticateSuperuser();

  console.log(`👤 Creating admin...`);
  console.log(`   Email: ${email}`);
  console.log(`   Name:  ${name}`);
  console.log(`   Role:  ${role}`);
  console.log();

  const record = await createAdmin();

  console.log("──────────────────────────────────────────────────────");
  console.log("  ✅ ADMIN CREATED");
  console.log("──────────────────────────────────────────────────────");
  console.log();
  console.log(`  ID:    ${record.id}`);
  console.log(`  Email: ${record.email}`);
  console.log(`  Name:  ${record.name}`);
  console.log(`  Role:  ${record.role}`);
  console.log();
  console.log("  📋 Save these credentials in your password manager:");
  console.log();
  console.log(`     Email:    ${email}`);
  console.log(`     Password: ${password}`);
  console.log();
  console.log("──────────────────────────────────────────────────────");
  console.log();
}

main().catch((err) => {
  console.error("\n❌ Fatal:", err?.response?.message || err?.message || err);
  process.exit(1);
});