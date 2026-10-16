// scripts/reset-my-attempt.mjs
//
// Resets exam attempts so you can start fresh.
//
// Usage:
//   node scripts/reset-my-attempt.mjs                        # reset ALL in-progress attempts
//   node scripts/reset-my-attempt.mjs <email>                # reset just this user's attempts
//
// Examples:
//   node scripts/reset-my-attempt.mjs
//   node scripts/reset-my-attempt.mjs snowmation274+login@gmail.com

import { execFileSync } from "node:child_process";
import PocketBase from "pocketbase";
import "dotenv/config";

const PB_URL = (
  process.env.VITE_POCKETBASE_URL || "http://127.0.0.1:8090"
).trim().replace(/\/+$/, "");

const ADMIN_EMAIL = (process.env.PB_ADMIN_EMAIL || "").trim();
const ADMIN_PASSWORD = process.env.PB_ADMIN_PASSWORD || "";

const targetEmail = process.argv[2] || null;

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

function authenticate() {
  console.log(`🔐 Authenticating as ${ADMIN_EMAIL}...`);
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
    console.error("❌ Auth failed:", data);
    process.exit(1);
  }
  pb.authStore.save(data.token, data.admin);
  console.log("✅ Authenticated.\n");
}

async function resetAttempt(attempt, profile) {
  // Delete linked attempt_questions
  const aq = await pb.collection("attempt_questions").getFullList({
    filter: `attempt = "${attempt.id}"`,
  });
  for (const row of aq) {
    await pb.collection("attempt_questions").delete(row.id);
  }

  // Delete the attempt
  await pb.collection("attempts").delete(attempt.id);

  // Reset profile status
  if (profile) {
    await pb.collection("profiles").update(profile.id, {
      status: "IDENTITY_CONFIRMED",
    });
  }

  console.log(
    `  ✅ Reset attempt ${attempt.id} (${attempt.status}) for ${profile?.email || "unknown"}`
  );
  console.log(`     Deleted ${aq.length} attempt_questions`);
}

async function main() {
  authenticate();

  // Find attempts to reset
  let attempts;
  if (targetEmail) {
    const profiles = await pb.collection("profiles").getFullList({
      filter: `email = "${targetEmail}"`,
    });
    if (profiles.length === 0) {
      console.error(`❌ No profile found with email ${targetEmail}`);
      process.exit(1);
    }
    const profile = profiles[0];
    console.log(`👤 Targeting: ${profile.email} (${profile.id})`);
    console.log(`   Current status: ${profile.status}\n`);

    attempts = await pb.collection("attempts").getFullList({
      filter: `student = "${profile.id}"`,
    });

    console.log(`🗑  Found ${attempts.length} attempt(s) for this user.\n`);
    for (const attempt of attempts) {
      await resetAttempt(attempt, profile);
    }
  } else {
    // Reset ALL attempts
    attempts = await pb.collection("attempts").getFullList();

    if (attempts.length === 0) {
      console.log("📭 No attempts found. Nothing to reset.");
      return;
    }

    console.log(`🗑  Found ${attempts.length} attempt(s) across all users.\n`);

    for (const attempt of attempts) {
      let profile = null;
      try {
        profile = await pb
          .collection("profiles")
          .getOne(attempt.student);
      } catch (_) {}

      await resetAttempt(attempt, profile);
    }
  }

  console.log(`\n✅ Done. You can now start a fresh exam.`);
}

main().catch((err) => {
  console.error("\n❌ Fatal:", err?.message || err);
  process.exit(1);
});