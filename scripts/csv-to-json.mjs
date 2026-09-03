// Regenerates public/data/courses.json from catalog_dev.csv.
// Hand-rolled RFC4180 parser (no dependency): DESCR values contain embedded
// commas inside quotes (e.g. "GEN STUDIES CAPSTONE - WR, CUE"), so a naive
// split(',') silently misaligns columns on those rows.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSV_PATH = path.join(__dirname, "..", "catalog_dev.csv");
const OUT_PATH = path.join(__dirname, "..", "public", "data", "courses.json");

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // skip
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function main() {
  const text = readFileSync(CSV_PATH, "utf8");
  const rows = parseCSV(text).filter((r) => !(r.length === 1 && r[0] === ""));
  const [header, ...dataRows] = rows;

  const col = (name) => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`CSV is missing expected column: ${name}`);
    return i;
  };
  const CRSE_ID = col("CRSE_ID");
  const SUBJECT = col("SUBJECT");
  const CATALOG_NBR = col("CATALOG_NBR");
  const DESCR = col("DESCR");

  const trimmedRows = dataRows.map((r) => r.map((v) => (v ?? "").trim()));

  const junkRows = trimmedRows.filter((r) => !/\d/.test(r[CATALOG_NBR]));
  const cleanRows = trimmedRows.filter((r) => /\d/.test(r[CATALOG_NBR]));

  const courses = new Map();
  let collisions = 0;
  for (const r of cleanRows) {
    const id = r[CRSE_ID];
    const subject = r[SUBJECT];
    const catalogNbr = r[CATALOG_NBR];
    const descr = r[DESCR];

    const existing = courses.get(id);
    if (existing) {
      if (existing.descr !== descr) {
        collisions++;
        console.log(
          `Collision: CRSE_ID ${id} DESCR "${existing.descr}" -> "${descr}" (keeping last-seen)`
        );
      }
      existing.subject = subject;
      existing.catalogNbr = catalogNbr;
      existing.descr = descr;
      existing.sections += 1;
    } else {
      courses.set(id, { id: Number(id), subject, catalogNbr, descr, sections: 1 });
    }
  }

  const uniqueSubjectCatalog = new Set(
    cleanRows.map((r) => `${r[SUBJECT]}|${r[CATALOG_NBR]}`)
  );
  if (courses.size !== uniqueSubjectCatalog.size) {
    throw new Error(
      `Assertion failed: unique CRSE_ID count (${courses.size}) !== unique SUBJECT+CATALOG_NBR count (${uniqueSubjectCatalog.size})`
    );
  }

  const output = [...courses.values()].sort((a, b) => {
    if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
    return a.catalogNbr.localeCompare(b.catalogNbr, undefined, { numeric: true });
  });

  mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n");

  console.log(`Rows read: ${dataRows.length}`);
  console.log(`Junk rows dropped (no digit in CATALOG_NBR): ${junkRows.length}`);
  console.log(`DESCR collisions resolved (kept last-seen): ${collisions}`);
  console.log(`Sections collapsed: ${cleanRows.length - output.length}`);
  console.log(`Final course count: ${output.length}`);
  console.log(`Wrote ${OUT_PATH}`);
}

main();
