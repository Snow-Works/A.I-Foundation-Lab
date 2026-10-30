// src/hooks/useAutosave.js
import { useEffect, useRef, useState } from "react";
import pb from "../lib/pocketbase";
import {
  enqueue,
  dequeue,
  listAll,
  count as queueCount,
} from "../lib/offlineQueue.js";

const SAVE_INTERVAL_MS = 15000; // force flush every 15s
const IDLE_SAVE_MS = 3000; // save after 3s idle
const MAX_RETRIES = 3;

/**
 * useAutosave
 *
 * Watches `answers` (a map of questionId → body string) and periodically
 * saves each changed answer to the `answers` collection in PocketBase.
 *
 * Handles:
 *   - Idle-triggered saves (3s after last keystroke on a question)
 *   - Force-flush every 15s regardless of activity
 *   - Offline queue for failed saves (retried on next successful network op)
 *   - Updating answerIds map so subsequent saves are UPDATEs not CREATEs
 *
 * Returns { saveStatus, lastSavedAt, flushNow }.
 */
export function useAutosave({
  attemptId,
  studentId,
  answers,
  answerIds,
  setAnswerIds,
}) {
  const [saveStatus, setSaveStatus] = useState("idle");
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const lastSavedRef = useRef({}); // questionId → last-saved body
  const idleTimersRef = useRef({}); // questionId → timeout id
  const answerIdsRef = useRef(answerIds);
  const inFlightRef = useRef(false);

  // Keep the ref in sync with the prop
  useEffect(() => {
    answerIdsRef.current = answerIds;
  }, [answerIds]);

  /* ---------- Core save function ---------- */
  const saveOne = async (questionId, body) => {
    if (!attemptId || !studentId) return;

    const existingId = answerIdsRef.current[questionId];

    try {
      if (existingId) {
        await pb.collection("answers").update(existingId, {
          body,
          saved_at: new Date().toISOString(),
        });
      } else {
        const record = await pb.collection("answers").create({
          attempt: attemptId,
          question: questionId,
          student: studentId,
          body,
          is_draft: true,
          saved_at: new Date().toISOString(),
        });
        answerIdsRef.current = {
          ...answerIdsRef.current,
          [questionId]: record.id,
        };
        setAnswerIds((prev) => ({ ...prev, [questionId]: record.id }));
      }
      dequeue(attemptId, questionId);
      return true;
    } catch (err) {
      console.error("[autosave] save failed:", err);
      enqueue({
        attempt: attemptId,
        question: questionId,
        student: studentId,
        body,
      });
      return false;
    }
  };

  /* ---------- Flush queue ---------- */
  const flushQueue = async () => {
    const queued = listAll();
    for (const item of queued) {
      await saveOne(item.question, item.body);
    }
  };

  /* ---------- Save all dirty answers ---------- */
  const saveDirty = async (force = false) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    const dirty = [];
    for (const [qid, body] of Object.entries(answers)) {
      const last = lastSavedRef.current[qid];
      if (force || body !== last) {
        dirty.push([qid, body]);
      }
    }

    if (dirty.length > 0) {
      setSaveStatus("saving");
      let allOk = true;
      for (const [qid, body] of dirty) {
        const ok = await saveOne(qid, body);
        if (ok) {
          lastSavedRef.current[qid] = body;
        } else {
          allOk = false;
        }
      }
      setSaveStatus(allOk ? "saved" : "offline");
      setLastSavedAt(new Date());
      // clear "saved" label after 2s
      setTimeout(() => setSaveStatus((s) => (s === "saved" ? "idle" : s)), 2000);
    }

    inFlightRef.current = false;
  };

  /* ---------- Per-keystroke idle timer ---------- */
  useEffect(() => {
    if (!attemptId) return;

    for (const [qid, body] of Object.entries(answers)) {
      if (body === lastSavedRef.current[qid]) continue;
      if (idleTimersRef.current[qid]) clearTimeout(idleTimersRef.current[qid]);
      idleTimersRef.current[qid] = setTimeout(() => {
        saveDirty();
      }, IDLE_SAVE_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, attemptId]);

  /* ---------- Force-flush interval ---------- */
  useEffect(() => {
    if (!attemptId) return;
    const id = setInterval(() => {
      saveDirty();
      flushQueue();
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  /* ---------- Retry queue on reconnect ---------- */
  useEffect(() => {
    const onOnline = () => {
      flushQueue();
    };
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Save on unload ---------- */
  useEffect(() => {
    const onUnload = () => {
      // Best-effort: fire off any pending save synchronously via
      // localStorage queue, since async won't complete.
      for (const [qid, body] of Object.entries(answers)) {
        if (body !== lastSavedRef.current[qid]) {
          enqueue({
            attempt: attemptId,
            question: qid,
            student: studentId,
            body,
          });
        }
      }
    };
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
    
  }, [answers, attemptId, studentId]);

  return {
    saveStatus,
    lastSavedAt,
    flushNow: saveDirty,
    queueSize: queueCount(),
  };
}