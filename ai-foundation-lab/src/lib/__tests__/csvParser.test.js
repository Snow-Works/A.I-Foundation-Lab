// src/lib/__tests__/csvParser.test.js
import { describe, it, expect } from "vitest";
import { parseRosterCSV } from "../csvParser.js";

describe("csvParser", () => {
  it("parses a valid CSV with required columns", () => {
    const csv = `first_name,surname
Alice,Smith
Bob,Jones`;
    const result = parseRosterCSV(csv);

    expect(result.errors).toHaveLength(0);
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0]).toEqual({
      first_name: "Alice",
      surname: "Smith",
      middle_name: "",
      batch: "",
      notes: "",
    });
  });

  it("handles optional columns and quoted fields", () => {
    const csv = `first_name,surname,batch,notes
"Alice",Smith,"Batch A","Needs extra time"`;
    const result = parseRosterCSV(csv);

    expect(result.errors).toHaveLength(0);
    expect(result.entries[0].batch).toBe("Batch A");
    expect(result.entries[0].notes).toBe("Needs extra time");
  });

  it("strips the UTF-8 BOM if present", () => {
    const csv = `\uFEFFfirst_name,surname\nAlice,Smith`;
    const result = parseRosterCSV(csv);
    expect(result.errors).toHaveLength(0);
    expect(result.entries).toHaveLength(1);
  });

  it("returns an error if required columns are missing", () => {
    const csv = `name,age\nAlice,20`;
    const result = parseRosterCSV(csv);
    expect(result.errors).toContain(
      "Missing required column(s): first_name, surname"
    );
  });

  it("skips rows missing first_name or surname and reports them", () => {
    const csv = `first_name,surname\nAlice,Smith\n,Bob\nCharlie,`;
    const result = parseRosterCSV(csv);

    expect(result.entries).toHaveLength(1); // Only Alice
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain("Row 3: missing first_name or surname");
    expect(result.errors[1]).toContain("Row 4: missing first_name or surname");
  });

  it("handles empty files gracefully", () => {
    const result = parseRosterCSV("");
    expect(result.entries).toHaveLength(0);
    expect(result.errors[0]).toBe("No data found in file.");
  });
});