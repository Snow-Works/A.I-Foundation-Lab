/// <reference path="../pb_data/types.d.ts" />

/// <reference path="../pb_data/types.d.ts" />

/* ============================================================
   EMAIL NOTIFICATIONS
   ------------------------------------------------------------
   Fires automated emails when an admin updates a record:
   
   1. profiles: status changes to APPROVED → Welcome email
   2. profiles: status changes to REJECTED → Rejection email
   3. attempts: status changes to released → Results ready email
   
   Fails silently (logs error) if email sending fails, so it
   never blocks the admin's workflow.
   ============================================================ */

function sendNotificationEmail(toEmail, subject, htmlBody) {
  if (!toEmail) return;

  try {
    const appUrl = $app.settings().meta.appUrl || "http://localhost:5173";
    const senderName = $app.settings().meta.senderName || "AI Foundation Lab";
    const senderAddress = $app.settings().meta.senderAddress;

    if (!senderAddress) {
      console.warn("[notify] senderAddress not configured. Skipping email.");
      return;
    }

    const message = new MailerMessage({
      from: {
        address: senderAddress,
        name: senderName,
      },
      to: [{ address: toEmail }],
      subject: subject,
      html: htmlBody.replace(/\{APP_URL\}/g, appUrl),
    });

    $app.newMailClient().send(message);
    console.log(`[notify] Sent "${subject}" to ${toEmail}`);
  } catch (err) {
    console.error("[notify] Failed to send email:", err);
  }
}

/* ============================================================
   1 & 2. PROFILE STATUS CHANGES (Approve / Reject)
   ============================================================ */
onRecordAfterUpdateRequest((e) => {
  if (e.collection.name !== "profiles") return;

  const original = e.record.original();
  if (!original) return;

  const prevStatus = original.get("status");
  const currentStatus = e.record.get("status");

  if (prevStatus === currentStatus) return;

  const email = e.record.get("email");
  const firstName = e.record.get("first_name") || "Student";

  if (currentStatus === "APPROVED") {
    sendNotificationEmail(
      email,
      "Welcome to the AI Foundation Lab",
      `
      <p>Hi ${firstName},</p>
      <p>Your registration has been approved! You are now one step closer to joining the guild.</p>
      <p><strong>Next step:</strong> Log in to your profile to upload your photo and unlock the community groups.</p>
      <p><a href="{APP_URL}/#/login">Log in to your profile</a></p>
      <p>We look forward to building with you.</p>
      <p>— The AI Foundation Lab Team</p>
      `
    );
  } else if (currentStatus === "REJECTED") {
    sendNotificationEmail(
      email,
      "Update on your AI Foundation Lab application",
      `
      <p>Hi ${firstName},</p>
      <p>Unfortunately, your application to join the AI Foundation Lab has not been approved at this time.</p>
      <p>If you believe this is a mistake or would like more information, please reach out to the admin team.</p>
      <p>— The AI Foundation Lab Team</p>
      `
    );
  }
});

/* ============================================================
   3. ATTEMPT STATUS CHANGES (Results Released)
   ============================================================ */
onRecordAfterUpdateRequest((e) => {
  if (e.collection.name !== "attempts") return;

  const original = e.record.original();
  if (!original) return;

  const prevStatus = original.get("status");
  const currentStatus = e.record.get("status");

  // Only fire when transitioning TO "released"
  if (currentStatus !== "released" || prevStatus === "released") return;

  const studentId = e.record.get("student");
  if (!studentId) return;

  let student;
  try {
    student = $app.dao().findRecordById("profiles", studentId);
  } catch (_) {
    return; // Student was deleted or invalid
  }

  const email = student.get("email");
  const firstName = student.get("first_name") || "Student";

  sendNotificationEmail(
    email,
    "Your AI Foundation Lab exam results are ready",
    `
    <p>Hi ${firstName},</p>
    <p>Your exam has been marked, and your results are now available on your profile.</p>
    <p>If you passed, you can also download your certificate and admission letter from your dashboard.</p>
    <p><a href="{APP_URL}/#/login">Log in to view your results</a></p>
    <p>— The AI Foundation Lab Team</p>
    `
  );
});