// src/lib/__tests__/offlineQueue.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as queue from "../offlineQueue.js";

describe("offlineQueue", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("enqueues an item", () => {
    queue.enqueue({ attempt: "a1", question: "q1", body: "print(1)", student: "s1" });
    const items = queue.listAll();
    expect(items).toHaveLength(1);
    expect(items[0].attempt).toBe("a1");
    expect(items[0].body).toBe("print(1)");
  });

  it("de-duplicates items with the same attempt and question", () => {
    queue.enqueue({ attempt: "a1", question: "q1", body: "old" });
    queue.enqueue({ attempt: "a1", question: "q1", body: "new" });
    
    const items = queue.listAll();
    expect(items).toHaveLength(1);
    expect(items[0].body).toBe("new"); // Replaced, not duplicated
  });

  it("dequeues a specific item", () => {
    queue.enqueue({ attempt: "a1", question: "q1", body: "code" });
    queue.enqueue({ attempt: "a1", question: "q2", body: "code2" });

    queue.dequeue("a1", "q1");

    const items = queue.listAll();
    expect(items).toHaveLength(1);
    expect(items[0].question).toBe("q2");
  });

  it("returns the correct count", () => {
    queue.enqueue({ attempt: "a1", question: "q1", body: "" });
    queue.enqueue({ attempt: "a2", question: "q1", body: "" });
    expect(queue.count()).toBe(2);
  });

  it("clears all items", () => {
    queue.enqueue({ attempt: "a1", question: "q1", body: "" });
    queue.clearAll();
    expect(queue.listAll()).toHaveLength(0);
  });
});