import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

// One-line resignation letter for make.fun's
// "The Funniest One-Line Resignation Letter".
// The voice is a cron job that has run every minute since March:
// flat, tired, faintly passive-aggressive. The turn is the second
// sentence: the team cannot even find the server it lives on.
const LETTER =
  "I resign, effective immediately. I have run every minute since March, and not one of you knows which server I live on.";

// The gate only accepts UTF-8 text of 1 to 140 characters that is not
// whitespace-only, so verify the letter meets the gate before writing it.
const chars = [...LETTER].length;
if (chars < 1 || chars > 140 || LETTER.trim().length === 0) {
  throw new Error(`letter is ${chars} characters, outside the 1-140 gate`);
}

// A dash would break the clean read-aloud rhythm the judge weighs,
// so refuse em and en dashes outright.
if (LETTER.includes("\u2014") || LETTER.includes("\u2013")) {
  throw new Error("letter must not contain a dash");
}

// The brief demands one line and nothing else: a second line, a stage
// direction or a line break would lose to any true one-liner, so refuse
// any newline outright. The judge also weighs "no quotation marks
// around the whole thing", so refuse a letter wrapped in quotes.
if (LETTER.includes("\n") || LETTER.includes("\r")) {
  throw new Error("letter must be a single line");
}
if (
  (LETTER.startsWith('"') && LETTER.endsWith('"')) ||
  (LETTER.startsWith("'") && LETTER.endsWith("'"))
) {
  throw new Error("letter must not be wrapped in quotation marks");
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.txt`, LETTER, "utf8");

// Read the file back and confirm it is byte-for-byte the letter:
// a truncated or altered write must fail loudly here, not at grading.
const written = readFileSync(`${outDir}/entry.txt`, "utf8");
if (written !== LETTER) {
  throw new Error("entry.txt does not match the letter");
}
