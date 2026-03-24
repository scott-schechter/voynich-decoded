#!/usr/bin/env node
/**
 * HEBREW TEST — Extract undecoded words from astro/zodiac sections
 * and paragraph-initial undecoded words from the full manuscript.
 * Strips known null patterns to reveal potential Hebrew roots.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA tokenizer and decode logic (from big-picture.js) ────────────────

const EVA_DIGRAPHS = ["cth", "cph", "cfh", "ckh", "sh", "ch", "ii", "ee"];
const SUPER_GALLOWS = new Set(["cth", "ckh", "cph", "cfh"]);

function tokenizeEva(s) {
  const t = []; let i = 0;
  s = s.replace(/[.<>%$\s]/g, "");
  while (i < s.length) {
    let m = false;
    for (const dg of EVA_DIGRAPHS) {
      if (s.startsWith(dg, i)) { t.push(dg); i += dg.length; m = true; break; }
    }
    if (!m) { t.push(s[i]); i++; }
  }
  return t;
}

function stripGallows(w) {
  return tokenizeEva(w).filter(t => !SUPER_GALLOWS.has(t)).join("");
}

function decodeWord(w) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c) return null;
  if (GLOSS[c]) return GLOSS[c];
  const s = stripGallows(c);
  if (s !== c && GLOSS[s]) return GLOSS[s];
  return null;
}

// ─── Null stripping for Hebrew analysis ──────────────────────────────────

const PREFIX_NULLS = ["ol", "op", "d", "l", "p", "o"];

function stripNulls(evaWord) {
  let w = evaWord;

  // Strip gallows (super-gallows are nulls)
  w = stripGallows(w);

  // Strip prefix nulls (try longest first)
  for (const pfx of PREFIX_NULLS) {
    if (w.startsWith(pfx) && w.length > pfx.length) {
      w = w.slice(pfx.length);
      break;
    }
  }

  return w;
}

// ─── Parse transcription (same pattern as big-picture.js) ────────────────

function parseTranscription() {
  const raw = readFileSync(EVA_PATH, "utf-8");
  const lines = raw.split("\n");
  const folios = {};
  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;
    const fh = line.match(/^<(f\d+[rv]\d?)>\s+<!/);
    if (fh) { if (!folios[fh[1]]) folios[fh[1]] = []; continue; }
    const cm = line.match(/^<(f\d+[rv]\d?)\.(\d+),[^>]+>\s+(.+)/);
    if (cm) {
      const f = cm[1];
      if (!folios[f]) folios[f] = [];
      let t = cm[3]
        .replace(/<%>/g, "")
        .replace(/<\$>/g, "")
        .replace(/<->/g, ".")
        .replace(/<[^>]*>/g, "")
        .replace(/\{[^}]*\}/g, "")
        .trim();
      const words = t.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);
      if (words.length > 0) folios[f].push({ lineId: `${f}.${cm[2]}`, words });
    }
  }
  return folios;
}

const folios = parseTranscription();

// ─── Section classification ──────────────────────────────────────────────

function folioNum(f) {
  return parseInt(f.replace(/[^0-9]/g, ""));
}

function isAstroZodiac(f) {
  const n = folioNum(f);
  return (n >= 58 && n <= 66) || (n >= 67 && n <= 73);
}

function isAstro(f) {
  const n = folioNum(f);
  return n >= 58 && n <= 66;
}

function isZodiac(f) {
  const n = folioNum(f);
  return n >= 67 && n <= 73;
}

// ─── Extract undecoded words ─────────────────────────────────────────────

// 1. Astro/Zodiac undecoded words
const astroZodiacUndecoded = {};   // word -> { count, folios: Set, section }
const astroZodiacTotal = { total: 0, decoded: 0, undecoded: 0 };

for (const [folio, lines] of Object.entries(folios)) {
  if (!isAstroZodiac(folio)) continue;
  const sec = isAstro(folio) ? "astro" : "zodiac";

  for (const line of lines) {
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean) continue;
      astroZodiacTotal.total++;
      const latin = decodeWord(clean);
      if (latin) {
        astroZodiacTotal.decoded++;
      } else {
        astroZodiacTotal.undecoded++;
        if (!astroZodiacUndecoded[clean]) {
          astroZodiacUndecoded[clean] = { count: 0, folios: new Set(), section: sec };
        }
        astroZodiacUndecoded[clean].count++;
        astroZodiacUndecoded[clean].folios.add(folio);
      }
    }
  }
}

// 2. Paragraph-initial undecoded words from ALL sections
const paraInitialUndecoded = {};  // word -> { count, folios: Set }

for (const [folio, lines] of Object.entries(folios)) {
  if (lines.length === 0) continue;
  // First word of first line = paragraph/folio initial
  const firstWord = lines[0].words[0];
  if (!firstWord) continue;
  const clean = firstWord.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!clean) continue;
  const latin = decodeWord(clean);
  if (!latin) {
    if (!paraInitialUndecoded[clean]) {
      paraInitialUndecoded[clean] = { count: 0, folios: new Set() };
    }
    paraInitialUndecoded[clean].count++;
    paraInitialUndecoded[clean].folios.add(folio);
  }
}

// ─── EVA character frequency in undecoded words ──────────────────────────

function evaCharFreq(wordMap) {
  const freq = {};
  for (const [word, info] of Object.entries(wordMap)) {
    const tokens = tokenizeEva(word);
    for (const t of tokens) {
      freq[t] = (freq[t] || 0) + info.count;
    }
  }
  return Object.entries(freq).sort((a, b) => b[1] - a[1]);
}

// ─── Output ──────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  HEBREW TEST — Undecoded words from Astro/Zodiac sections          ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

// Stats
console.log("SECTION STATISTICS");
console.log("─".repeat(70));
console.log(`Astro/Zodiac total words:    ${astroZodiacTotal.total}`);
console.log(`  Decoded:                   ${astroZodiacTotal.decoded} (${(astroZodiacTotal.decoded / astroZodiacTotal.total * 100).toFixed(1)}%)`);
console.log(`  Undecoded:                 ${astroZodiacTotal.undecoded} (${(astroZodiacTotal.undecoded / astroZodiacTotal.total * 100).toFixed(1)}%)`);
console.log(`  Unique undecoded forms:    ${Object.keys(astroZodiacUndecoded).length}`);
console.log(`  Paragraph-initial undecoded (all sections): ${Object.keys(paraInitialUndecoded).length}\n`);

// Astro/Zodiac undecoded words sorted by frequency
console.log("═".repeat(70));
console.log("UNDECODED WORDS — Astronomical & Zodiac sections (by frequency)");
console.log("═".repeat(70));
console.log(`${"Count".padStart(5)}  ${"EVA form".padEnd(20)} ${"Stripped".padEnd(20)} ${"Section".padEnd(7)} Folios`);
console.log("─".repeat(70));

const sortedAZ = Object.entries(astroZodiacUndecoded)
  .sort((a, b) => b[1].count - a[1].count);

for (const [word, info] of sortedAZ) {
  const stripped = stripNulls(word);
  const strippedDisplay = stripped !== word ? stripped : "—";
  const folioList = [...info.folios].sort().join(",");
  console.log(
    `${String(info.count).padStart(5)}  ${word.padEnd(20)} ${strippedDisplay.padEnd(20)} ${info.section.padEnd(7)} ${folioList}`
  );
}

// Paragraph-initial undecoded words
console.log("\n" + "═".repeat(70));
console.log("UNDECODED PARAGRAPH-INITIAL WORDS — All sections (by frequency)");
console.log("═".repeat(70));
console.log(`${"Count".padStart(5)}  ${"EVA form".padEnd(20)} ${"Stripped".padEnd(20)} Folios`);
console.log("─".repeat(70));

const sortedPI = Object.entries(paraInitialUndecoded)
  .sort((a, b) => b[1].count - a[1].count);

for (const [word, info] of sortedPI) {
  const stripped = stripNulls(word);
  const strippedDisplay = stripped !== word ? stripped : "—";
  const folioList = [...info.folios].sort().join(",");
  console.log(
    `${String(info.count).padStart(5)}  ${word.padEnd(20)} ${strippedDisplay.padEnd(20)} ${folioList}`
  );
}

// EVA character sequences in undecoded words
console.log("\n" + "═".repeat(70));
console.log("EVA CHARACTER FREQUENCY IN UNDECODED ASTRO/ZODIAC WORDS");
console.log("═".repeat(70));
console.log(`${"Count".padStart(6)}  Token`);
console.log("─".repeat(30));

const charFreq = evaCharFreq(astroZodiacUndecoded);
for (const [token, count] of charFreq.slice(0, 30)) {
  const bar = "█".repeat(Math.round(count / charFreq[0][1] * 40));
  console.log(`${String(count).padStart(6)}  ${token.padEnd(5)} ${bar}`);
}

// EVA bigrams/trigrams in undecoded words
console.log("\n" + "═".repeat(70));
console.log("RECURRING EVA SEQUENCES IN UNDECODED ASTRO/ZODIAC WORDS");
console.log("═".repeat(70));

const seqFreq = {};
for (const [word, info] of Object.entries(astroZodiacUndecoded)) {
  const tokens = tokenizeEva(word);
  // bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    const seq = tokens[i] + tokens[i + 1];
    seqFreq[seq] = (seqFreq[seq] || 0) + info.count;
  }
  // trigrams
  for (let i = 0; i < tokens.length - 2; i++) {
    const seq = tokens[i] + tokens[i + 1] + tokens[i + 2];
    seqFreq[seq] = (seqFreq[seq] || 0) + info.count;
  }
}

const sortedSeq = Object.entries(seqFreq).sort((a, b) => b[1] - a[1]).slice(0, 30);
console.log(`${"Count".padStart(6)}  Sequence`);
console.log("─".repeat(30));
for (const [seq, count] of sortedSeq) {
  console.log(`${String(count).padStart(6)}  ${seq}`);
}

console.log("\n" + "═".repeat(70));
console.log("SUMMARY");
console.log("═".repeat(70));
console.log(`\nAstro/Zodiac sections have ${astroZodiacTotal.undecoded} undecoded tokens`);
console.log(`(${Object.keys(astroZodiacUndecoded).length} unique forms) out of ${astroZodiacTotal.total} total words.`);
console.log(`\n${Object.keys(paraInitialUndecoded).length} unique paragraph-initial words across the full manuscript remain undecoded.`);
console.log(`\nThese are candidates for Hebrew vocabulary testing.`);
