// src/lib/offlineQueue.js
//
// Persists failed draft saves to localStorage so they survive
// network drops and page refreshes. Flushes on demand.

const STORAGE_KEY = "afl:offline-queue:v1";

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable — best-effort
  }
}

export function enqueue(item) {
  const items = read();
  // De-dupe: if the same (attempt, question) exists, replace it
  const filtered = items.filter(
    (x) =>
      !(x.attempt === item.attempt && x.question === item.question)
  );
  filtered.push({ ...item, queuedAt: Date.now() });
  write(filtered);
}

export function dequeue(attemptId, questionId) {
  const items = read();
  const filtered = items.filter(
    (x) => !(x.attempt === attemptId && x.question === questionId)
  );
  write(filtered);
}

export function listAll() {
  return read();
}

export function clearAll() {
  write([]);
}

export function count() {
  return read().length;
}