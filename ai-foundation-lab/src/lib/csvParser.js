// src/lib/csvParser.js
//
// Minimal CSV parser for roster uploads.
// Handles: comma separation, quoted fields (with "" escape),
// CRLF/LF endings, UTF-8 BOM, empty rows.
// Does NOT support multi-line fields (not needed for roster data).

const REQUIRED_COLUMNS = ["first_name", "surname"];
const OPTIONAL_COLUMNS = ["middle_name", "batch", "notes"];

export function parseRosterCSV(text) {
  if (typeof text !== "string") {
    return { entries: [], errors: ["File is not text."] };
  }

  // Strip UTF-8 BOM
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  // Normalize line endings
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }

    if (ch === "\n") {
      row.push(field);
      if (row.some((c) => c.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
      i++;
      continue;
    }

    field += ch;
    i++;
  }

  // Final field
  if (field !== "" || row.length > 0) {
    row.push(field);
    if (row.some((c) => c.trim() !== "")) {
      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return { entries: [], errors: ["No data found in file."] };
  }
  if (rows.length === 1) {
    return { entries: [], errors: ["Only a header row found — no data."] };
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());

  // Check required columns
  const missing = REQUIRED_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length > 0) {
    return {
      entries: [],
      errors: [`Missing required column(s): ${missing.join(", ")}`],
    };
  }

  // Build column index map
  const idx = {};
  for (const col of [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]) {
    idx[col] = header.indexOf(col);
  }

  const entries = [];
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const entry = {};
    for (const col of [...REQUIRED_COLUMNS, ...OPTIONAL_COLUMNS]) {
      const pos = idx[col];
      entry[col] = pos >= 0 ? String(cells[pos] || "").trim() : "";
    }

    if (!entry.first_name || !entry.surname) {
      errors.push(`Row ${r + 1}: missing first_name or surname`);
      continue;
    }

    entries.push(entry);
  }

  return { entries, errors };
}