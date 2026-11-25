// The Houseplant Out of Office — entry generator.
// A single-line out-of-office note from a houseplant that answers
// email by photosynthesis. Cloudy days slow the replies down.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_TEXT =
  "Out of office: I reply by photosynthesis. It's cloudy, so your email will take 3-5 business seasons.";

// The entry must be a short, single-line, non-blank UTF-8 note.
const MAX_CHARS = 120;
const MIN_CHARS = 1;

function fail(message: string): never {
  throw new Error(`entry gate failed: ${message}`);
}

function checkEntry(text: string): void {
  // Count real characters (code points), not UTF-16 units.
  const charCount = [...text].length;
  if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
    fail(`length ${charCount} outside ${MIN_CHARS}-${MAX_CHARS} chars`);
  }
  if (text.trim().length === 0) {
    fail("entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be exactly one line");
  }
  // Unicode line/paragraph separators would also split the note visually.
  if (text.includes("\u2028") || text.includes("\u2029")) {
    fail("entry must not contain unicode line separators");
  }
  // No leading or trailing padding: the note is exactly what it says.
  if (text !== text.trim()) {
    fail("entry must not have leading or trailing whitespace");
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  const encoded = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
  if (decoded !== text) {
    fail("entry is not valid UTF-8");
  }
}

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.trim().length > 0) {
    return fromEnv;
  }
  // Fall back to <repo>/output, derived from this file's own location so
  // the program works no matter which directory it is launched from.
  const here = dirname(fileURLToPath(import.meta.url));
  return join(here, "output");
}

function main(): void {
  checkEntry(ENTRY_TEXT);

  const outDir = resolveOutputDir();
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, ENTRY_TEXT, "utf8");

  // Read the file back and demand byte-for-byte equality with the entry.
  const written = readFileSync(target, "utf8");
  if (written !== ENTRY_TEXT) {
    fail("read-back mismatch: entry.txt does not match ENTRY_TEXT");
  }

  console.log(
    `wrote ${[...ENTRY_TEXT].length} chars to ${target}`,
  );
}

main();
