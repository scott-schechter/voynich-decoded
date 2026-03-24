#!/usr/bin/env node
/**
 * ZODIAC DEEP DIVE — Word-by-word analysis of zodiac wheel pages f67-f73
 * Checks every word (decoded and undecoded) and searches for Hebrew
 * astronomical vocabulary in undecoded words.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA tokenizer ──────────────────────────────────────────────────────
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
  if (s !== c && GLOSS[s]) return `[G]${GLOSS[s]}`;
  return null;
}

// ─── Parse transcription ────────────────────────────────────────────────
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
      const lineType = cm[0].match(/,([^>]+)>/)?.[1] || "";
      if (words.length > 0) folios[f].push({ lineId: `${f}.${cm[2]}`, lineType, words });
    }
  }
  return folios;
}

// ─── EVA to phonetic transliteration ─────────────────────────────────────
const EVA_PHONETIC = {
  "sh": "SH", "ch": "KH", "ee": "I", "ii": "I",
  "a": "A", "e": "E", "o": "O", "i": "I",
  "k": "K", "t": "T", "l": "L", "r": "R",
  "s": "S", "d": "D", "y": "Y", "m": "M",
  "n": "N", "q": "Q", "p": "P", "f": "F",
  "g": "G", "h": "H",
  "cth": "", "cph": "", "cfh": "", "ckh": "",
};

function evaToPhonetic(evaWord) {
  const tokens = tokenizeEva(evaWord);
  return tokens.map(t => EVA_PHONETIC[t] || t.toUpperCase()).join("");
}

function stripVowels(s) {
  return s.replace(/[AEIOU]/g, "");
}

// ─── Levenshtein ─────────────────────────────────────────────────────────
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

// ─── Hebrew vocabulary database ─────────────────────────────────────────
const HEBREW_VOCAB = [
  // Zodiac
  { name: "TALEH",    category: "zodiac",   sign: "Aries",       consonants: "TLH" },
  { name: "SHOR",     category: "zodiac",   sign: "Taurus",      consonants: "SHR" },
  { name: "TEOMIM",   category: "zodiac",   sign: "Gemini",      consonants: "TMYM" },
  { name: "TEOM",     category: "zodiac",   sign: "Gemini",      consonants: "TM" },
  { name: "SARTAN",   category: "zodiac",   sign: "Cancer",      consonants: "SRTN" },
  { name: "ARYEH",    category: "zodiac",   sign: "Leo",         consonants: "RYH" },
  { name: "BETULAH",  category: "zodiac",   sign: "Virgo",       consonants: "BTLH" },
  { name: "MOZNAYIM", category: "zodiac",   sign: "Libra",       consonants: "MZNYM" },
  { name: "AQRAV",    category: "zodiac",   sign: "Scorpio",     consonants: "QRB" },
  { name: "QESHET",   category: "zodiac",   sign: "Sagittarius", consonants: "QSHT" },
  { name: "GEDI",     category: "zodiac",   sign: "Capricorn",   consonants: "GDY" },
  { name: "DELI",     category: "zodiac",   sign: "Aquarius",    consonants: "DLY" },
  { name: "DAGIM",    category: "zodiac",   sign: "Pisces",      consonants: "DGYM" },
  // Months
  { name: "NISAN",    category: "month",    consonants: "NYSN" },
  { name: "IYAR",     category: "month",    consonants: "YYR" },
  { name: "SIVAN",    category: "month",    consonants: "SYVN" },
  { name: "TAMMUZ",   category: "month",    consonants: "TMVZ" },
  { name: "ELUL",     category: "month",    consonants: "LVL" },
  { name: "TISHREI",  category: "month",    consonants: "TSHRY" },
  { name: "CHESHVAN", category: "month",    consonants: "KHSHVN" },
  { name: "KISLEV",   category: "month",    consonants: "KSLV" },
  { name: "TEVET",    category: "month",    consonants: "TBT" },
  { name: "SHEVAT",   category: "month",    consonants: "SHBT" },
  { name: "ADAR",     category: "month",    consonants: "DR" },
  // Planets
  { name: "CHAMAH",   category: "planet",   consonants: "KHMH" },
  { name: "SHEMESH",  category: "planet",   consonants: "SHMSH" },
  { name: "LEVANAH",  category: "planet",   consonants: "LBNH" },
  { name: "KOKHAV",   category: "planet",   consonants: "KVKHB" },
  { name: "NOGAH",    category: "planet",   consonants: "NGH" },
  { name: "MAADIM",   category: "planet",   consonants: "MDYM" },
  { name: "TZEDEK",   category: "planet",   consonants: "TSDQ" },
  { name: "SHABTAI",  category: "planet",   consonants: "SHBTY" },
  // Kabbalistic
  { name: "KETER",    category: "kabbalistic", consonants: "KTR" },
  { name: "CHESED",   category: "kabbalistic", consonants: "KHSD" },
  { name: "GEVURAH",  category: "kabbalistic", consonants: "GVRH" },
  { name: "TIFERET",  category: "kabbalistic", consonants: "TPRT" },
  { name: "YESOD",    category: "kabbalistic", consonants: "YSVD" },
  { name: "MALKHUT",  category: "kabbalistic", consonants: "MLKHVT" },
  { name: "SHEFA",    category: "kabbalistic", consonants: "SHP" },
  { name: "ILAN",     category: "kabbalistic", consonants: "YLN" },
  { name: "TELI",     category: "kabbalistic", consonants: "TLY" },
  { name: "SEFIRAH",  category: "kabbalistic", consonants: "SPRH" },
  { name: "GALGAL",   category: "kabbalistic", consonants: "GLGL" },
  { name: "OLAM",     category: "kabbalistic", consonants: "VLM" },
  { name: "SHALOM",   category: "kabbalistic", consonants: "SHLVM" },
  { name: "TAHOR",    category: "kabbalistic", consonants: "THR" },
  { name: "TAMEI",    category: "kabbalistic", consonants: "TMY" },
  // Astronomical
  { name: "RAKIA",    category: "astronomical", consonants: "RQY" },
  { name: "MAALAH",   category: "astronomical", consonants: "MLH" },
  { name: "BAYIT",    category: "astronomical", consonants: "BYT" },
  { name: "TEQUFAH",  category: "astronomical", consonants: "TQVPH" },
  { name: "MAZAL",    category: "astronomical", consonants: "MZL" },
  { name: "KOKHAV",   category: "astronomical", consonants: "KVKHB" },
];

// ─── Folio-to-zodiac mapping ─────────────────────────────────────────────
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

// ─── Main analysis ──────────────────────────────────────────────────────
const folios = parseTranscription();

const ZODIAC_FOLIOS = Object.keys(folios).filter(f => {
  const num = parseInt(f.replace(/[^0-9]/g, ""));
  return num >= 67 && num <= 73;
}).sort();

console.log("╔══════════════════════════════════════════════════════════════════════════════╗");
console.log("║  ZODIAC DEEP DIVE — Word-by-word analysis of f67-f73                       ║");
console.log("╚══════════════════════════════════════════════════════════════════════════════╝\n");

console.log(`Zodiac folios found: ${ZODIAC_FOLIOS.join(", ")}\n`);

// Track global stats
let globalTotal = 0, globalDecoded = 0;
const allUndecodedWords = {}; // word -> count
const allMatches = []; // Hebrew matches
const folioStats = [];

for (const folio of ZODIAC_FOLIOS) {
  const lines = folios[folio];
  if (!lines) continue;

  const signs = FOLIO_SIGNS[folio] || [];
  const wordList = []; // {eva, decoded, latin, lineId, position}

  for (const line of lines) {
    let pos = 0;
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 1) continue;
      const latin = decodeWord(clean);
      wordList.push({
        eva: clean,
        decoded: !!latin,
        latin: latin || null,
        lineId: line.lineId,
        lineType: line.lineType,
        position: pos === 0 ? "initial" : "mid",
      });
      pos++;
    }
  }

  const totalWords = wordList.length;
  const decodedWords = wordList.filter(w => w.decoded).length;
  const undecodedWords = wordList.filter(w => !w.decoded);
  const decodeRate = totalWords > 0 ? (decodedWords / totalWords * 100).toFixed(1) : "0.0";

  globalTotal += totalWords;
  globalDecoded += decodedWords;

  folioStats.push({ folio, totalWords, decodedWords, undecoded: undecodedWords.length, rate: decodeRate, signs });

  // Track undecoded frequency
  for (const w of undecodedWords) {
    allUndecodedWords[w.eva] = (allUndecodedWords[w.eva] || 0) + 1;
  }

  // Print folio header
  console.log("═".repeat(80));
  console.log(`FOLIO: ${folio}  |  Total: ${totalWords}  Decoded: ${decodedWords}  Undecoded: ${undecodedWords.length}  Rate: ${decodeRate}%`);
  console.log(`Expected signs: ${signs.length > 0 ? signs.join(", ") : "(cosmological / unassigned)"}`);
  console.log("─".repeat(80));

  // Print every word
  console.log("\n  Word-by-word listing:");
  console.log("  " + "-".repeat(76));
  console.log(`  ${"#".padEnd(4)} ${"EVA".padEnd(24)} ${"Status".padEnd(10)} ${"Latin/Phonetic".padEnd(24)} ${"Position"}`);
  console.log("  " + "-".repeat(76));

  let wordNum = 0;
  for (const w of wordList) {
    wordNum++;
    if (w.decoded) {
      console.log(`  ${String(wordNum).padEnd(4)} ${w.eva.padEnd(24)} DECODED    ${(w.latin || "").padEnd(24)} ${w.position}`);
    } else {
      const phonetic = evaToPhonetic(w.eva);
      const cons = stripVowels(phonetic);
      console.log(`  ${String(wordNum).padEnd(4)} ${w.eva.padEnd(24)} UNDECODED  ${phonetic.padEnd(24)} ${w.position}`);
    }
  }

  // Hebrew vocabulary matching for undecoded words
  console.log("\n  Hebrew vocabulary matches:");
  console.log("  " + "-".repeat(76));

  let folioMatchCount = 0;
  for (const w of undecodedWords) {
    const phonetic = evaToPhonetic(w.eva);
    const cons = stripVowels(phonetic);

    for (const hv of HEBREW_VOCAB) {
      const dist = levenshtein(cons, hv.consonants);
      const maxLen = Math.max(cons.length, hv.consonants.length);
      // Allow dist <= 1 for short words, dist <= 2 for longer ones
      const threshold = maxLen <= 3 ? 1 : 2;
      if (dist <= threshold && cons.length >= 2) {
        let folioStatus = "";
        if (hv.sign) {
          const isCorrect = signs.includes(hv.sign);
          folioStatus = signs.length > 0 ? (isCorrect ? "CORRECT FOLIO" : "wrong folio") : "unassigned";
        }
        console.log(`  EVA: ${w.eva.padEnd(20)} Phon: ${phonetic.padEnd(16)} Cons: ${cons.padEnd(10)} => ${hv.name.padEnd(12)} (${hv.category}${hv.sign ? "/" + hv.sign : ""}) [dist=${dist}] ${folioStatus}`);
        folioMatchCount++;
        allMatches.push({
          folio,
          eva: w.eva,
          phonetic,
          consonants: cons,
          hebrew: hv.name,
          hebrewCons: hv.consonants,
          category: hv.category,
          sign: hv.sign || null,
          distance: dist,
          correctFolio: hv.sign ? signs.includes(hv.sign) : null,
          lineId: w.lineId,
          position: w.position,
        });
      }
    }
  }
  if (folioMatchCount === 0) {
    console.log("  (no matches found)");
  }

  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY STATISTICS
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("SUMMARY — Folio-by-folio decode rates");
console.log("═".repeat(80));
console.log(`${"Folio".padEnd(12)} ${"Total".padEnd(8)} ${"Decoded".padEnd(10)} ${"Undecoded".padEnd(12)} ${"Rate".padEnd(8)} Signs`);
console.log("-".repeat(80));
for (const s of folioStats) {
  console.log(`${s.folio.padEnd(12)} ${String(s.totalWords).padEnd(8)} ${String(s.decodedWords).padEnd(10)} ${String(s.undecoded).padEnd(12)} ${(s.rate + "%").padEnd(8)} ${s.signs.join(", ") || "(cosmo)"}`);
}
console.log("-".repeat(80));
console.log(`${"TOTAL".padEnd(12)} ${String(globalTotal).padEnd(8)} ${String(globalDecoded).padEnd(10)} ${String(globalTotal - globalDecoded).padEnd(12)} ${(globalTotal > 0 ? (globalDecoded / globalTotal * 100).toFixed(1) : "0.0") + "%"}`);

// ═══════════════════════════════════════════════════════════════════════════
// REPEATED UNDECODED WORDS
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("REPEATED UNDECODED WORDS (appearing 2+ times across zodiac folios)");
console.log("═".repeat(80));

const repeated = Object.entries(allUndecodedWords)
  .filter(([, c]) => c >= 2)
  .sort((a, b) => b[1] - a[1]);

console.log(`${"EVA Word".padEnd(24)} ${"Count".padEnd(8)} ${"Phonetic".padEnd(20)} Consonants`);
console.log("-".repeat(70));
for (const [word, count] of repeated) {
  const phonetic = evaToPhonetic(word);
  const cons = stripVowels(phonetic);
  console.log(`${word.padEnd(24)} ${String(count).padEnd(8)} ${phonetic.padEnd(20)} ${cons}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// PREFIX/SUFFIX ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("PREFIX/SUFFIX PATTERNS in undecoded words");
console.log("═".repeat(80));

const undecodedList = Object.keys(allUndecodedWords);
const prefixCounts = {};
const suffixCounts = {};

for (const w of undecodedList) {
  if (w.length >= 3) {
    const p2 = w.slice(0, 2);
    const p3 = w.slice(0, 3);
    prefixCounts[p2] = (prefixCounts[p2] || 0) + allUndecodedWords[w];
    prefixCounts[p3] = (prefixCounts[p3] || 0) + allUndecodedWords[w];
    const s2 = w.slice(-2);
    const s3 = w.slice(-3);
    suffixCounts[s2] = (suffixCounts[s2] || 0) + allUndecodedWords[w];
    suffixCounts[s3] = (suffixCounts[s3] || 0) + allUndecodedWords[w];
  }
}

console.log("\nTop prefixes (3+ occurrences):");
const topPrefixes = Object.entries(prefixCounts).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 25);
for (const [p, c] of topPrefixes) {
  console.log(`  "${p}" — ${c} times`);
}

console.log("\nTop suffixes (3+ occurrences):");
const topSuffixes = Object.entries(suffixCounts).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 25);
for (const [s, c] of topSuffixes) {
  console.log(`  "${s}" — ${c} times`);
}

// ═══════════════════════════════════════════════════════════════════════════
// POSITION ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("POSITION ANALYSIS — Where do undecoded words appear?");
console.log("═".repeat(80));

let initialUndecoded = 0, midUndecoded = 0;
let initialTotal = 0, midTotal = 0;

for (const folio of ZODIAC_FOLIOS) {
  const lines = folios[folio];
  if (!lines) continue;
  for (const line of lines) {
    let pos = 0;
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 1) continue;
      const latin = decodeWord(clean);
      if (pos === 0) {
        initialTotal++;
        if (!latin) initialUndecoded++;
      } else {
        midTotal++;
        if (!latin) midUndecoded++;
      }
      pos++;
    }
  }
}

console.log(`Line-initial words:  ${initialTotal} total, ${initialUndecoded} undecoded (${(initialUndecoded/initialTotal*100).toFixed(1)}%)`);
console.log(`Mid-line words:      ${midTotal} total, ${midUndecoded} undecoded (${(midUndecoded/midTotal*100).toFixed(1)}%)`);

// ═══════════════════════════════════════════════════════════════════════════
// HEBREW MATCH SUMMARY
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("ALL HEBREW VOCABULARY MATCHES");
console.log("═".repeat(80));

if (allMatches.length === 0) {
  console.log("No Hebrew vocabulary matches found.");
} else {
  // Group by category
  const byCategory = {};
  for (const m of allMatches) {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  }

  for (const [cat, matches] of Object.entries(byCategory)) {
    console.log(`\n  ${cat.toUpperCase()} matches:`);
    console.log("  " + "-".repeat(76));
    for (const m of matches) {
      let extra = "";
      if (m.sign && m.correctFolio !== null) {
        const signs = FOLIO_SIGNS[m.folio] || [];
        extra = m.correctFolio ? " << CORRECT FOLIO" : (signs.length > 0 ? " (wrong folio)" : " (unassigned)");
      }
      console.log(`  ${m.folio.padEnd(10)} ${m.eva.padEnd(20)} ${m.phonetic.padEnd(16)} ${m.consonants.padEnd(10)} => ${m.hebrew.padEnd(12)} [d=${m.distance}]${extra}`);
    }
  }

  // Zodiac correctness summary
  const zodiacMatches = allMatches.filter(m => m.category === "zodiac");
  if (zodiacMatches.length > 0) {
    console.log("\n" + "-".repeat(80));
    console.log("ZODIAC SIGN CORRECTNESS:");
    const assigned = zodiacMatches.filter(m => m.correctFolio !== null);
    const correct = assigned.filter(m => m.correctFolio);
    const wrong = assigned.filter(m => !m.correctFolio);
    const unassigned = zodiacMatches.filter(m => m.correctFolio === null);
    console.log(`  Correct folio: ${correct.length}`);
    console.log(`  Wrong folio:   ${wrong.length}`);
    console.log(`  Unassigned:    ${unassigned.length}`);
    if (assigned.length > 0) {
      console.log(`  Accuracy:      ${correct.length}/${assigned.length} = ${(correct.length / assigned.length * 100).toFixed(1)}%`);
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EXACT & NEAR-EXACT MATCHES (distance 0 only)
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("EXACT CONSONANTAL MATCHES (distance = 0)");
console.log("═".repeat(80));

const exact = allMatches.filter(m => m.distance === 0);
if (exact.length === 0) {
  console.log("No exact matches found.");
} else {
  for (const m of exact) {
    let extra = "";
    if (m.sign) {
      const signs = FOLIO_SIGNS[m.folio] || [];
      extra = m.correctFolio ? " << CORRECT FOLIO" : (signs.length > 0 ? " (wrong folio)" : " (unassigned)");
    }
    console.log(`  ${m.folio.padEnd(10)} ${m.eva.padEnd(20)} cons=${m.consonants.padEnd(10)} => ${m.hebrew.padEnd(12)} (${m.category})${extra}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// LINE TYPE ANALYSIS (labels vs text vs circular)
// ═══════════════════════════════════════════════════════════════════════════
console.log("\n" + "═".repeat(80));
console.log("LINE TYPE BREAKDOWN");
console.log("═".repeat(80));

const lineTypes = {};
for (const folio of ZODIAC_FOLIOS) {
  const lines = folios[folio];
  if (!lines) continue;
  for (const line of lines) {
    const type = line.lineType || "unknown";
    // Extract type prefix
    const prefix = type.match(/^[+@&*=]?([A-Z][a-z]*)/)?.[1] || type;
    if (!lineTypes[prefix]) lineTypes[prefix] = { total: 0, decoded: 0 };
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 1) continue;
      lineTypes[prefix].total++;
      if (decodeWord(clean)) lineTypes[prefix].decoded++;
    }
  }
}

console.log(`${"Type".padEnd(12)} ${"Total".padEnd(8)} ${"Decoded".padEnd(10)} ${"Rate"}`);
console.log("-".repeat(40));
for (const [type, stats] of Object.entries(lineTypes).sort((a, b) => b[1].total - a[1].total)) {
  const rate = stats.total > 0 ? (stats.decoded / stats.total * 100).toFixed(1) + "%" : "N/A";
  console.log(`${type.padEnd(12)} ${String(stats.total).padEnd(8)} ${String(stats.decoded).padEnd(10)} ${rate}`);
}

console.log("\n" + "═".repeat(80));
console.log("ANALYSIS COMPLETE");
console.log("═".repeat(80));
