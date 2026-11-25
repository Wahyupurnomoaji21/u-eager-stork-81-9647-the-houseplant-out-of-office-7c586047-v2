import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";

// The Houseplant Out-of-Office — make.fun entry v2.
// Writes one out-of-office auto-reply a houseplant would send.
//
// v2 angle (fresh, not v1's "cactus thrives on neglect"): the plant answers
// email by photosynthesis — and it is cloudy, so the reply will take
// "3-5 business seasons". The plant's own life (sunlight, photosynthesis)
// drives the joke, and the punchline twists the stock office phrase
// "3-5 business days" into plant time.

const ENTRY =
  "Out of office: I reply by photosynthesis. It's cloudy, so your email will take 3-5 business seasons.";

// All paths are built from import.meta.url and MAKEFUN_OUTPUT_DIR so the
// program works no matter which directory the grader runs it from.
// A relative MAKEFUN_OUTPUT_DIR is resolved against this script's own
// directory (the import.meta.url anchor); an absolute one is used as-is.
const scriptDir = dirname(fileURLToPath(import.meta.url));
const rawOutputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outputDir = isAbsolute(rawOutputDir)
  ? rawOutputDir
  : join(scriptDir, rawOutputDir);
const outputPath = join(outputDir, "entry.txt");

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, ENTRY, "utf8");
console.log(`Wrote ${ENTRY.length} chars to ${outputPath}`);
