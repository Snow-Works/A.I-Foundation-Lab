// src/services/supportService.js
import pb from "../lib/pocketbase";
import pbAdmin from "../lib/pocketbaseAdmin";

const COLLECTION = "support_messages";

/* ------------------------------------------------------------
   STUDENT FUNCTIONS
   ------------------------------------------------------------ */

export async function getStudentMessages(studentId) {
  return pb.collection(COLLECTION).getFullList({
    filter: `student = "${studentId}"`,
    sort: "created",
  });
}

export async function sendStudentMessage(studentId, body) {
  return pb.collection(COLLECTION).create({
    student: studentId,
    sender_id: studentId,
    sender_type: "student",
    body: body,
    is_read_by_admin: false,
    is_read_by_student: true,
  });
}

export async function markMessagesReadByStudent(studentId) {
  try {
    const unread = await pb.collection(COLLECTION).getFullList({
      filter: `student = "${studentId}" && sender_type = "admin" && is_read_by_student = false`,
    });

    for (const msg of unread) {
      await pb.collection(COLLECTION).update(msg.id, { is_read_by_student: true });
    }
  } catch (err) {
    console.warn("[support] failed to mark messages as read:", err);
    // Silently fail so it doesn't break the UI
  }
}

/* ------------------------------------------------------------
   ADMIN FUNCTIONS
   ------------------------------------------------------------ */

export async function getAdminInbox() {
  const messages = await pbAdmin.collection(COLLECTION).getFullList({
    sort: "-created",
    expand: "student",
  });

  const threadsMap = {};
  for (const msg of messages) {
    const studentId = msg.student;
    if (!threadsMap[studentId]) {
      threadsMap[studentId] = {
        studentId,
        studentName: msg.expand?.student
          ? `${msg.expand.student.first_name} ${msg.expand.student.surname}`
          : "Unknown",
        studentEmail: msg.expand?.student?.email || "No email",
        unreadCount: 0,
        lastMessageAt: msg.created,
      };
    }
    if (msg.sender_type === "student" && !msg.is_read_by_admin) {
      threadsMap[studentId].unreadCount++;
    }
  }

  return Object.values(threadsMap).sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
  );
}

export async function getAdminThread(studentId) {
  return pbAdmin.collection(COLLECTION).getFullList({
    filter: `student = "${studentId}"`,
    sort: "created",
  });
}

export async function sendAdminMessage(studentId, adminId, body) {
  return pbAdmin.collection(COLLECTION).create({
    student: studentId,
    sender_id: adminId,
    sender_type: "admin",
    body: body,
    is_read_by_admin: true,
    is_read_by_student: false,
  });
}

export async function markThreadReadByAdmin(studentId) {
  try {
    const unread = await pbAdmin.collection(COLLECTION).getFullList({
      filter: `student = "${studentId}" && sender_type = "student" && is_read_by_admin = false`,
    });

    for (const msg of unread) {
      await pbAdmin.collection(COLLECTION).update(msg.id, { is_read_by_admin: true });
    }
  } catch (err) {
    console.warn("[support] admin failed to mark thread read:", err);
  }
}