#!/usr/bin/env node
/**
 * ZODIAC WHEEL TEST — Do Hebrew zodiac names appear on the CORRECT folios?
 * Tests whether undecoded words on zodiac folios match Hebrew sign names.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA tokenizer (from big-picture.js) ──────────────────────────────────
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
function stripGallows(w) { return tokenizeEva(w).filter(t => !SUPER_GALLOWS.has(t)).join(""); }
function decodeWord(w) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c) return null;
  if (GLOSS[c]) return GLOSS[c];
  const s = stripGallows(c);
  if (s !== c && GLOSS[s]) return GLOSS[s];
  return null;
}

// ─── Parse transcription ──────────────────────────────────────────────────
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
      let t = cm[3].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
      const words = t.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);
      if (words.length > 0) folios[f].push({ lineId: `${f}.${cm[2]}`, words });
    }
  }
  return folios;
}

// ─── EVA to phonetic transliteration ──────────────────────────────────────
const EVA_PHONETIC = {
  "sh": "SH", "ch": "KH", "ee": "I", "ii": "I",
  "a": "A", "e": "E", "o": "O", "i": "I",
  "k": "K", "t": "T", "l": "L", "r": "R",
  "s": "S", "d": "D", "y": "Y", "m": "M",
  "n": "N", "q": "Q", "p": "P", "f": "F",
  "g": "G", "h": "H",
  // Super-gallows → skip (nulls)
  "cth": "", "cph": "", "cfh": "", "ckh": "",
};

function evaToPhonetic(evaWord) {
  const tokens = tokenizeEva(evaWord);
  return tokens.map(t => EVA_PHONETIC[t] || t.toUpperCase()).join("");
}

function stripVowels(s) {
  return s.replace(/[AEIOU]/g, "");
}

// ─── Levenshtein distance ─────────────────────────────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return dp[m][n];
}

// ─── Hebrew zodiac names ─────────────────────────────────────────────────
const HEBREW_ZODIAC = [
  { name: "TALEH",    sign: "Aries",       consonants: "TLH" },
  { name: "SHOR",     sign: "Taurus",      consonants: "SHR" },
  { name: "TEOMIM",   sign: "Gemini",      consonants: "TMYM" },
  { name: "TEOM",     sign: "Gemini",      consonants: "TM" },
  { name: "SARTAN",   sign: "Cancer",      consonants: "SRTN" },
  { name: "ARYEH",    sign: "Leo",         consonants: "RYH" },
  { name: "BETULAH",  sign: "Virgo",       consonants: "BTLH" },
  { name: "MOZNAYIM", sign: "Libra",       consonants: "MZNYM" },
  { name: "AQRAV",    sign: "Scorpio",     consonants: "QRB" },
  { name: "QESHET",   sign: "Sagittarius", consonants: "QSHT" },
  { name: "GEDI",     sign: "Capricorn",   consonants: "GDY" },
  { name: "DELI",     sign: "Aquarius",    consonants: "DLY" },
  { name: "DAGIM",    sign: "Pisces",      consonants: "DGYM" },
];

// ─── Folio-to-zodiac mapping ──────────────────────────────────────────────
const FOLIO_SIGNS = {
  "f70v1": ["Aries"],
  "f70v2": ["Aries"],
  "f71r":  ["Taurus"],
  "f71v":  ["Taurus", "Gemini"],
  "f72r1": ["Cancer"],
  "f72r2": ["Cancer", "Leo"],
  "f72r3": ["Leo"],
  "f72v1": ["Leo", "Virgo"],
  "f72v2": ["Virgo"],
  "f72v3": ["Virgo", "Libra"],
  "f73r":  ["Libra", "Scorpio"],
  "f73v":  ["Sagittarius", "Capricorn", "Aquarius", "Pisces"],
  // Earlier folios (astronomical/cosmological, signs uncertain)
  "f67r1": [],
  "f67r2": [],
  "f67v1": [],
  "f67v2": [],
  "f68r1": [],
  "f68r2": [],
  "f68r3": [],
  "f68v1": [],
  "f68v2": [],
  "f68v3": [],
  "f69r":  [],
  "f69v1": [],
  "f69v2": [],
  "f70r1": [],
  "f70r2": [],
};

// ─── Which folios exist in the zodiac range? ──────────────────────────────
const folios = parseTranscription();

const ZODIAC_FOLIOS = Object.keys(folios).filter(f => {
  const num = parseInt(f.replace(/[^0-9]/g, ""));
  return num >= 67 && num <= 73;
}).sort();

console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║  ZODIAC WHEEL TEST — Hebrew Zodiac Names on Correct Folios?    ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

console.log(`Zodiac folios found: ${ZODIAC_FOLIOS.join(", ")}\n`);

// ─── Main analysis ────────────────────────────────────────────────────────
const allMatches = [];

for (const folio of ZODIAC_FOLIOS) {
  const lines = folios[folio];
  if (!lines) continue;

  // Collect all undecoded words on this folio
  const undecoded = [];
  let totalWords = 0;
  for (const line of lines) {
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      totalWords++;
      const latin = decodeWord(clean);
      if (!latin) {
        undecoded.push(clean);
      }
    }
  }

  console.log("═".repeat(70));
  console.log(`FOLIO: ${folio}  (${totalWords} words, ${undecoded.length} undecoded)`);
  const signs = FOLIO_SIGNS[folio] || [];
  console.log(`Expected signs: ${signs.length > 0 ? signs.join(", ") : "(not assigned / cosmological)"}`);
  console.log("─".repeat(70));

  const folioMatches = [];

  for (const evaWord of undecoded) {
    const phonetic = evaToPhonetic(evaWord);
    const consonants = stripVowels(phonetic);

    for (const hz of HEBREW_ZODIAC) {
      const dist = levenshtein(consonants, hz.consonants);
      if (dist <= 1) {
        const isCorrectFolio = signs.includes(hz.sign);
        folioMatches.push({
          evaWord,
          phonetic,
          consonants,
          hebrewName: hz.name,
          hebrewConsonants: hz.consonants,
          sign: hz.sign,
          distance: dist,
          correctFolio: isCorrectFolio,
        });
      }
    }
  }

  if (folioMatches.length === 0) {
    console.log("  No Hebrew zodiac name matches found.\n");
  } else {
    for (const m of folioMatches) {
      const status = m.correctFolio ? "CORRECT FOLIO" : signs.length > 0 ? "WRONG FOLIO" : "UNASSIGNED FOLIO";
      console.log(`  EVA: ${m.evaWord.padEnd(20)} Phonetic: ${m.phonetic.padEnd(20)} Cons: ${m.consonants.padEnd(10)} => ${m.hebrewName} (${m.sign}) [dist=${m.distance}]  ${status}`);
    }
    console.log();
    allMatches.push(...folioMatches.map(m => ({ ...m, folio })));
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────
console.log("\n" + "═".repeat(70));
console.log("SUMMARY — All Hebrew Zodiac Name Matches");
console.log("═".repeat(70) + "\n");

if (allMatches.length === 0) {
  console.log("No matches found at all.");
} else {
  let correct = 0, wrong = 0, unassigned = 0;

  console.log("Folio       EVA Word             Hebrew Name    Sign            Correct?");
  console.log("─".repeat(70));
  for (const m of allMatches) {
    const signs = FOLIO_SIGNS[m.folio] || [];
    let status;
    if (signs.length === 0) { status = "UNASSIGNED"; unassigned++; }
    else if (m.correctFolio) { status = "YES"; correct++; }
    else { status = "NO"; wrong++; }
    console.log(`${m.folio.padEnd(12)}${m.evaWord.padEnd(21)}${m.hebrewName.padEnd(15)}${m.sign.padEnd(16)}${status}`);
  }

  console.log("\n" + "─".repeat(70));
  console.log(`Total matches: ${allMatches.length}`);
  console.log(`On correct folio: ${correct}`);
  console.log(`On wrong folio: ${wrong}`);
  console.log(`On unassigned folio: ${unassigned}`);
  if (correct + wrong > 0) {
    console.log(`Accuracy (correct / assigned): ${correct}/${correct + wrong} = ${(correct / (correct + wrong) * 100).toFixed(1)}%`);
  }
  console.log();

  // Expected by random chance
  const totalSigns = 12;
  const avgFolioSigns = Object.values(FOLIO_SIGNS).filter(s => s.length > 0).reduce((a, b) => a + b.length, 0) /
    Object.values(FOLIO_SIGNS).filter(s => s.length > 0).length;
  const chanceRate = avgFolioSigns / totalSigns;
  console.log(`Average signs per assigned folio: ${avgFolioSigns.toFixed(1)}`);
  console.log(`Random chance of correct folio: ${(chanceRate * 100).toFixed(1)}%`);
  if (correct + wrong > 0) {
    const observed = correct / (correct + wrong);
    console.log(`Observed rate: ${(observed * 100).toFixed(1)}% ${observed > chanceRate ? "> chance — SIGNIFICANT" : "<= chance — NOT significant"}`);
  }
}

console.log("\n" + "═".repeat(70));
console.log("DETAILED UNDECODED WORD LIST PER FOLIO");
console.log("═".repeat(70) + "\n");

// Print undecoded words with phonetics for key folios
const KEY_FOLIOS = ["f70v1", "f70v2", "f71r", "f71v", "f72r1", "f72r2", "f72r3", "f72v1", "f72v2", "f72v3", "f73r", "f73v"];

for (const folio of KEY_FOLIOS) {
  const lines = folios[folio];
  if (!lines) { console.log(`${folio}: (not found in transcription)\n`); continue; }

  const signs = FOLIO_SIGNS[folio] || [];
  console.log(`${folio} [${signs.join("/")}]:`);

  const seen = new Set();
  for (const line of lines) {
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2 || seen.has(clean)) continue;
      seen.add(clean);
      const latin = decodeWord(clean);
      if (!latin) {
        const phonetic = evaToPhonetic(clean);
        const cons = stripVowels(phonetic);
        console.log(`  ${clean.padEnd(22)} => ${phonetic.padEnd(22)} cons: ${cons}`);
      }
    }
  }
  console.log();
}
