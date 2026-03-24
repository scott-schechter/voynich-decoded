#!/usr/bin/env node
/**
 * ZODIAC LABEL CRACK — Comprehensive analysis of zodiac section labels
 *
 * Extracts all label lines from f67-f73, tests against glossary,
 * computes phonetic/consonantal skeletons, cross-references Hebrew
 * astronomical vocabulary, and compares label encoding vs prose encoding.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ═══════════════════════════════════════════════════════════════
// EVA TOKENIZER
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// PHONETIC MAPPING (EVA → approximate phonetic values)
// ═══════════════════════════════════════════════════════════════
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

function consonantalSkeleton(phonetic) {
  return phonetic.replace(/[AEIOU]/g, "");
}

// ═══════════════════════════════════════════════════════════════
// LEVENSHTEIN DISTANCE
// ═══════════════════════════════════════════════════════════════
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0)
      );
    }
  }
  return dp[m][n];
}

// ═══════════════════════════════════════════════════════════════
// HEBREW VOCABULARY DATABASE (expanded)
// ═══════════════════════════════════════════════════════════════
const HEBREW_VOCAB = [
  // Zodiac signs
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
  // Months (Hebrew)
  { name: "NISAN",    category: "month",    consonants: "NYSN" },
  { name: "IYAR",     category: "month",    consonants: "YYR" },
  { name: "SIVAN",    category: "month",    consonants: "SYVN" },
  { name: "TAMMUZ",   category: "month",    consonants: "TMVZ" },
  { name: "AV",       category: "month",    consonants: "B" },
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
  // Stars
  { name: "ALDEBARAN",category: "star",     consonants: "LDBRN" },
  { name: "REGULUS",  category: "star",     consonants: "RGLS" },
  { name: "SPICA",    category: "star",     consonants: "SPYK" },
  { name: "ANTARES",  category: "star",     consonants: "NTRS" },
  { name: "SIRIUS",   category: "star",     consonants: "SYRS" },
  { name: "VEGA",     category: "star",     consonants: "VG" },
  { name: "KOKAV_HAZANAV", category: "star", consonants: "KVKHBHZNB" },
  // Elements/directions
  { name: "MIZRACH",  category: "direction", consonants: "MZRKH" },
  { name: "MAARAV",   category: "direction", consonants: "MRB" },
  { name: "TZAFON",   category: "direction", consonants: "TSPN" },
  { name: "DAROM",    category: "direction", consonants: "DRM" },
  // Astrological terms
  { name: "MAZAL",    category: "astronomical", consonants: "MZL" },
  { name: "GALGAL",   category: "astronomical", consonants: "GLGL" },
  { name: "RAKIA",    category: "astronomical", consonants: "RQY" },
  { name: "SHAMAYIM", category: "astronomical", consonants: "SHMYM" },
  { name: "KOKHAVIM", category: "astronomical", consonants: "KVKHBYM" },
  { name: "TEQUFAH",  category: "astronomical", consonants: "TQVPH" },
  { name: "BAYIT",    category: "astronomical", consonants: "BYT" },
  { name: "MAALAH",   category: "astronomical", consonants: "MLH" },
  { name: "OLAM",     category: "astronomical", consonants: "VLM" },
  // Latin zodiac names (for comparison)
  { name: "ARIES",    category: "latin-zodiac", sign: "Aries",       consonants: "RS" },
  { name: "TAURUS",   category: "latin-zodiac", sign: "Taurus",      consonants: "TRS" },
  { name: "GEMINI",   category: "latin-zodiac", sign: "Gemini",      consonants: "GMN" },
  { name: "CANCER",   category: "latin-zodiac", sign: "Cancer",      consonants: "KNSR" },
  { name: "LEO",      category: "latin-zodiac", sign: "Leo",         consonants: "L" },
  { name: "VIRGO",    category: "latin-zodiac", sign: "Virgo",       consonants: "VRG" },
  { name: "LIBRA",    category: "latin-zodiac", sign: "Libra",       consonants: "LBR" },
  { name: "SCORPIO",  category: "latin-zodiac", sign: "Scorpio",     consonants: "SKRP" },
  { name: "SAGITTARIUS", category: "latin-zodiac", sign: "Sagittarius", consonants: "SGTRS" },
  { name: "CAPRICORNUS", category: "latin-zodiac", sign: "Capricorn", consonants: "KPRKRNS" },
  { name: "AQUARIUS", category: "latin-zodiac", sign: "Aquarius",    consonants: "QRS" },
  { name: "PISCES",   category: "latin-zodiac", sign: "Pisces",      consonants: "PSKS" },
  // Latin month names (medieval)
  { name: "MARTIUS",  category: "latin-month", consonants: "MRTS" },
  { name: "APRILIS",  category: "latin-month", consonants: "PRLS" },
  { name: "MAIUS",    category: "latin-month", consonants: "MS" },
  { name: "JUNIUS",   category: "latin-month", consonants: "JNS" },
  { name: "JULIUS",   category: "latin-month", consonants: "JLS" },
  { name: "AUGUSTUS",  category: "latin-month", consonants: "GSTS" },
  { name: "SEPTEMBER",category: "latin-month", consonants: "SPTMBR" },
  { name: "OCTOBER",  category: "latin-month", consonants: "KTBR" },
  { name: "NOVEMBER", category: "latin-month", consonants: "NVMBR" },
  { name: "DECEMBER", category: "latin-month", consonants: "DSMBR" },
  { name: "JANUARIUS",category: "latin-month", consonants: "JNRS" },
  { name: "FEBRUARIUS",category: "latin-month", consonants: "FBRS" },
];

// ═══════════════════════════════════════════════════════════════
// FOLIO → ZODIAC SIGN ASSIGNMENTS
// ═══════════════════════════════════════════════════════════════
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
};

// ═══════════════════════════════════════════════════════════════
// PARSE TRANSCRIPTION — extract label lines and prose lines
// ═══════════════════════════════════════════════════════════════
function parseTranscription() {
  const raw = readFileSync(EVA_PATH, "utf-8");
  const lines = raw.split("\n");

  const zodiacLabels = [];  // { folio, lineId, lineType, words: string[] }
  const zodiacProse = [];
  const herbalLabels = [];
  const herbalProse = [];

  // Label type indicators: Lz (zodiac label), Ls (star label), L0/La (other label), Ri/Ro (ring inner/outer)
  const LABEL_TYPES = /Lz|Ls|L0|La|Ri|Ro/;
  const PROSE_TYPES = /P0|P1|Pt|Cc/;

  const ZODIAC_FOLIOS = /^f(67|68|69|70|71|72|73)/;
  const HERBAL_FOLIOS = /^f([1-9]|[1-5]\d|56)[rv]/;

  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;
    const cm = line.match(/^<(f\d+[rv]\d?)\.(\d+),([^>]+)>\s+(.+)/);
    if (!cm) continue;

    const folio = cm[1];
    const lineNum = cm[2];
    const lineType = cm[3];
    let text = cm[4]
      .replace(/<%>/g, "").replace(/<\$>/g, "")
      .replace(/<->/g, ".").replace(/<[^>]*>/g, "")
      .replace(/\{[^}]*\}/g, "").trim();

    const words = text.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);
    if (words.length === 0) continue;

    const entry = { folio, lineId: `${folio}.${lineNum}`, lineType, words };

    if (ZODIAC_FOLIOS.test(folio)) {
      if (LABEL_TYPES.test(lineType)) {
        zodiacLabels.push(entry);
      } else if (PROSE_TYPES.test(lineType)) {
        zodiacProse.push(entry);
      }
    } else if (HERBAL_FOLIOS.test(folio)) {
      if (LABEL_TYPES.test(lineType) || /\bL\b/.test(lineType)) {
        herbalLabels.push(entry);
      } else if (PROSE_TYPES.test(lineType)) {
        herbalProse.push(entry);
      }
    }
  }

  return { zodiacLabels, zodiacProse, herbalLabels, herbalProse };
}

// ═══════════════════════════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function findHebrewMatches(evaWord, maxDist = 2) {
  const phon = evaToPhonetic(evaWord);
  const cons = consonantalSkeleton(phon);
  const matches = [];

  for (const entry of HEBREW_VOCAB) {
    const d = levenshtein(cons, entry.consonants);
    if (d <= maxDist) {
      matches.push({ ...entry, distance: d, evaPhonetic: phon, evaConsonants: cons });
    }
  }
  return matches.sort((a, b) => a.distance - b.distance);
}

function computeGlyphFrequencies(words) {
  const freq = {};
  let total = 0;
  for (const w of words) {
    const tokens = tokenizeEva(w);
    for (const t of tokens) {
      freq[t] = (freq[t] || 0) + 1;
      total++;
    }
  }
  // Normalize
  const norm = {};
  for (const [k, v] of Object.entries(freq)) {
    norm[k] = v / total;
  }
  return { raw: freq, normalized: norm, total };
}

function computeInitialGlyphDist(words) {
  const freq = {};
  let total = 0;
  for (const w of words) {
    const tokens = tokenizeEva(w);
    if (tokens.length > 0) {
      freq[tokens[0]] = (freq[tokens[0]] || 0) + 1;
      total++;
    }
  }
  return { raw: freq, total };
}

function computeWordLengthDist(words) {
  const dist = {};
  let sum = 0;
  for (const w of words) {
    const tokens = tokenizeEva(w);
    const len = tokens.length;
    dist[len] = (dist[len] || 0) + 1;
    sum += len;
  }
  return { dist, mean: sum / words.length, count: words.length };
}

function computeBigrams(words) {
  const freq = {};
  let total = 0;
  for (const w of words) {
    const tokens = tokenizeEva(w);
    for (let i = 0; i < tokens.length - 1; i++) {
      const bg = tokens[i] + "+" + tokens[i + 1];
      freq[bg] = (freq[bg] || 0) + 1;
      total++;
    }
  }
  return { raw: freq, total };
}

// ═══════════════════════════════════════════════════════════════
// MAIN ANALYSIS
// ═══════════════════════════════════════════════════════════════
function main() {
  const { zodiacLabels, zodiacProse, herbalLabels, herbalProse } = parseTranscription();

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        ZODIAC LABEL CRACK — Comprehensive Analysis         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");

  // ─── 1. EXTRACT & CATALOG ALL ZODIAC LABEL WORDS ─────────────────
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("1. ZODIAC LABEL INVENTORY");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const allLabelWords = [];
  const wordsByFolio = {};
  const labelsByFolio = {};

  for (const entry of zodiacLabels) {
    if (!labelsByFolio[entry.folio]) labelsByFolio[entry.folio] = [];
    labelsByFolio[entry.folio].push(entry);
    if (!wordsByFolio[entry.folio]) wordsByFolio[entry.folio] = [];
    for (const w of entry.words) {
      allLabelWords.push(w);
      wordsByFolio[entry.folio].push(w);
    }
  }

  console.log(`Total zodiac label lines: ${zodiacLabels.length}`);
  console.log(`Total zodiac label words: ${allLabelWords.length}`);
  console.log(`Total zodiac prose lines: ${zodiacProse.length}`);
  console.log(`\nFolios with labels:`);

  for (const [folio, words] of Object.entries(wordsByFolio).sort()) {
    const signs = FOLIO_SIGNS[folio] || [];
    console.log(`  ${folio}: ${words.length} words (${signs.join(", ") || "unknown zodiac"})`);
  }

  // ─── 2. WORD-BY-WORD DECODE + HEBREW MATCHING ────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("2. WORD-BY-WORD ANALYSIS — DECODE STATUS + HEBREW MATCHES");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let decoded = 0, undecoded = 0;
  const undecodedWords = [];
  const wordFreq = {};

  for (const w of allLabelWords) {
    wordFreq[w] = (wordFreq[w] || 0) + 1;
  }

  // Group by folio for display
  for (const [folio, entries] of Object.entries(labelsByFolio).sort()) {
    const signs = FOLIO_SIGNS[folio] || [];
    console.log(`\n─── ${folio} (${signs.join("/") || "unassigned"}) ───`);

    for (const entry of entries) {
      const lineTag = entry.lineType.replace(/@|&|\+/g, "");
      for (const w of entry.words) {
        const dec = decodeWord(w);
        const phon = evaToPhonetic(w);
        const cons = consonantalSkeleton(phon);
        const status = dec ? `✓ ${dec}` : "✗ UNDECODED";

        if (dec) {
          decoded++;
        } else {
          undecoded++;
          undecodedWords.push({ word: w, folio, phonetic: phon, consonants: cons, count: wordFreq[w] });
        }

        let line = `  [${lineTag}] ${w.padEnd(22)} ${status.padEnd(25)} phon=${phon.padEnd(14)} cons=${cons}`;

        if (!dec) {
          const hebrewMatches = findHebrewMatches(w, 2);
          if (hebrewMatches.length > 0) {
            const top = hebrewMatches.slice(0, 3).map(m =>
              `${m.name}(${m.category}${m.sign ? ":" + m.sign : ""},d=${m.distance})`
            ).join(", ");
            line += ` → ${top}`;
          }
        }
        console.log(line);
      }
    }
  }

  const totalWords = decoded + undecoded;
  const decodeRate = ((decoded / totalWords) * 100).toFixed(1);
  console.log(`\n  DECODE RATE: ${decoded}/${totalWords} = ${decodeRate}%`);

  // ─── 3. PATTERN ANALYSIS ──────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("3. LABEL PATTERN ANALYSIS");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // 3a. Repeated label words
  console.log("─── 3a. Most Frequent Label Words ───");
  const sortedFreq = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]);
  const repeated = sortedFreq.filter(([_, c]) => c >= 2);
  console.log(`  Words appearing 2+ times: ${repeated.length}`);
  for (const [w, c] of repeated.slice(0, 40)) {
    const dec = decodeWord(w);
    const folios = [];
    for (const [f, ws] of Object.entries(wordsByFolio)) {
      if (ws.includes(w)) folios.push(f);
    }
    console.log(`    ${w.padEnd(20)} x${c}  ${dec ? `= ${dec}` : "UNDECODED"}  [${folios.join(", ")}]`);
  }

  // 3b. Word length distribution
  console.log("\n─── 3b. Word Length Distribution (EVA tokens) ───");
  const allProseWords = zodiacProse.flatMap(e => e.words);
  const labelLen = computeWordLengthDist(allLabelWords);
  const proseLen = computeWordLengthDist(allProseWords);

  console.log(`  Label words: mean=${labelLen.mean.toFixed(2)} tokens (n=${labelLen.count})`);
  console.log(`  Prose words: mean=${proseLen.mean.toFixed(2)} tokens (n=${proseLen.count})`);
  console.log(`\n  Length | Labels   | Prose`);
  for (let i = 1; i <= 12; i++) {
    const lc = labelLen.dist[i] || 0;
    const pc = proseLen.dist[i] || 0;
    const lp = ((lc / labelLen.count) * 100).toFixed(1);
    const pp = ((pc / proseLen.count) * 100).toFixed(1);
    console.log(`    ${String(i).padStart(2)}   | ${String(lc).padStart(4)} (${lp.padStart(5)}%) | ${String(pc).padStart(4)} (${pp.padStart(5)}%)`);
  }

  // 3c. Initial glyph distribution
  console.log("\n─── 3c. Initial Glyph Distribution ───");
  const labelInit = computeInitialGlyphDist(allLabelWords);
  const proseInit = computeInitialGlyphDist(allProseWords);

  const allInitGlyphs = new Set([...Object.keys(labelInit.raw), ...Object.keys(proseInit.raw)]);
  const sortedGlyphs = [...allInitGlyphs].sort((a, b) =>
    (labelInit.raw[b] || 0) - (labelInit.raw[a] || 0)
  );

  console.log(`  Glyph    | Labels         | Prose`);
  for (const g of sortedGlyphs.slice(0, 20)) {
    const lc = labelInit.raw[g] || 0;
    const pc = proseInit.raw[g] || 0;
    const lp = ((lc / labelInit.total) * 100).toFixed(1);
    const pp = ((pc / proseInit.total) * 100).toFixed(1);
    console.log(`  ${g.padEnd(8)} | ${String(lc).padStart(4)} (${lp.padStart(5)}%) | ${String(pc).padStart(4)} (${pp.padStart(5)}%)`);
  }

  // 3d. Label structure analysis
  console.log("\n─── 3d. Label Structure Patterns ───");
  const labelLineWordCounts = {};
  for (const entry of zodiacLabels) {
    const n = entry.words.length;
    labelLineWordCounts[n] = (labelLineWordCounts[n] || 0) + 1;
  }
  console.log("  Words per label line:");
  for (const [n, c] of Object.entries(labelLineWordCounts).sort((a, b) => a[0] - b[0])) {
    console.log(`    ${n} words: ${c} lines (${((c / zodiacLabels.length) * 100).toFixed(1)}%)`);
  }

  // ─── 4. CROSS-REFERENCE WITH ZODIAC ASSIGNMENTS ──────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("4. ZODIAC SIGN CROSS-REFERENCE");
  console.log("═══════════════════════════════════════════════════════════════\n");

  console.log("For each zodiac page, checking if undecoded labels match the");
  console.log("expected Hebrew zodiac name for that page.\n");

  for (const [folio, signs] of Object.entries(FOLIO_SIGNS).sort()) {
    if (signs.length === 0) continue;
    const words = wordsByFolio[folio];
    if (!words || words.length === 0) continue;

    console.log(`\n─── ${folio}: expected ${signs.join(" / ")} ───`);

    // Get Hebrew names for expected signs
    const expectedNames = HEBREW_VOCAB.filter(v =>
      (v.category === "zodiac" || v.category === "latin-zodiac") && signs.includes(v.sign)
    );

    for (const w of words) {
      const dec = decodeWord(w);
      if (dec) continue; // skip already decoded

      const phon = evaToPhonetic(w);
      const cons = consonantalSkeleton(phon);

      for (const expected of expectedNames) {
        const d = levenshtein(cons, expected.consonants);
        if (d <= 3) {
          console.log(`  "${w}" (cons=${cons}) vs ${expected.name} (${expected.consonants}): distance=${d} ${d <= 1 ? "*** CLOSE MATCH ***" : d <= 2 ? "** POSSIBLE **" : ""}`);
        }
      }
    }
  }

  // ─── 5. LABEL vs PROSE ENCODING COMPARISON ────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("5. ENCODING COMPARISON: Labels vs Prose vs Herbal Labels");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const herbalLabelWords = herbalLabels.flatMap(e => e.words);
  const herbalProseWords = herbalProse.flatMap(e => e.words);

  // Decode rates
  const sets = [
    { name: "Zodiac Labels", words: allLabelWords },
    { name: "Zodiac Prose", words: allProseWords },
    { name: "Herbal Labels", words: herbalLabelWords },
    { name: "Herbal Prose", words: herbalProseWords },
  ];

  console.log("─── 5a. Decode Rates ───");
  for (const set of sets) {
    let dec = 0;
    for (const w of set.words) {
      if (decodeWord(w)) dec++;
    }
    const rate = set.words.length > 0 ? ((dec / set.words.length) * 100).toFixed(1) : "N/A";
    console.log(`  ${set.name.padEnd(20)}: ${dec}/${set.words.length} = ${rate}%`);
  }

  // Word length comparison
  console.log("\n─── 5b. Mean Word Length (EVA tokens) ───");
  for (const set of sets) {
    if (set.words.length === 0) continue;
    const wl = computeWordLengthDist(set.words);
    console.log(`  ${set.name.padEnd(20)}: ${wl.mean.toFixed(2)} tokens (n=${wl.count})`);
  }

  // Initial glyph comparison
  console.log("\n─── 5c. Initial Glyph Comparison ───");
  const zodLabelInit = computeInitialGlyphDist(allLabelWords);
  const zodProseInit = computeInitialGlyphDist(allProseWords);
  const herbLabelInit = computeInitialGlyphDist(herbalLabelWords);

  const topGlyphs = ["o", "ch", "sh", "d", "y", "k", "s", "t", "q", "a", "p", "l", "r", "e"];
  console.log(`  ${"Glyph".padEnd(8)} | Zod.Labels  | Zod.Prose   | Herb.Labels`);
  for (const g of topGlyphs) {
    const zl = zodLabelInit.total > 0 ? ((zodLabelInit.raw[g] || 0) / zodLabelInit.total * 100).toFixed(1) : "0.0";
    const zp = zodProseInit.total > 0 ? ((zodProseInit.raw[g] || 0) / zodProseInit.total * 100).toFixed(1) : "0.0";
    const hl = herbLabelInit.total > 0 ? ((herbLabelInit.raw[g] || 0) / herbLabelInit.total * 100).toFixed(1) : "0.0";
    console.log(`  ${g.padEnd(8)} | ${zl.padStart(5)}%      | ${zp.padStart(5)}%      | ${hl.padStart(5)}%`);
  }

  // Bigram comparison
  console.log("\n─── 5d. Top Bigrams Comparison ───");
  const zodLabelBG = computeBigrams(allLabelWords);
  const zodProseBG = computeBigrams(allProseWords);
  const herbLabelBG = computeBigrams(herbalLabelWords);

  const topZLBigrams = Object.entries(zodLabelBG.raw).sort((a, b) => b[1] - a[1]).slice(0, 20);
  console.log(`\n  Zodiac Label top bigrams:`);
  for (const [bg, c] of topZLBigrams) {
    const zp = zodProseBG.raw[bg] || 0;
    const hl = herbLabelBG.raw[bg] || 0;
    console.log(`    ${bg.padEnd(12)} label=${String(c).padStart(3)}  prose=${String(zp).padStart(3)}  herbal=${String(hl).padStart(3)}`);
  }

  // ─── 6. MOST PROMISING UNDECODED WORDS ────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("6. MOST PROMISING UNDECODED LABEL WORDS");
  console.log("═══════════════════════════════════════════════════════════════\n");

  // Deduplicate
  const uniqueUndecoded = new Map();
  for (const uw of undecodedWords) {
    if (!uniqueUndecoded.has(uw.word)) {
      uniqueUndecoded.set(uw.word, { ...uw, folios: new Set() });
    }
    uniqueUndecoded.get(uw.word).folios.add(uw.folio);
  }

  // Score: higher = more promising
  const scored = [...uniqueUndecoded.values()].map(uw => {
    let score = 0;
    // Frequency bonus
    score += uw.count * 5;
    // Multi-folio bonus
    score += uw.folios.size * 3;
    // Hebrew match bonus
    const matches = findHebrewMatches(uw.word, 2);
    const bestMatch = matches[0] || null;
    if (bestMatch) {
      score += (3 - bestMatch.distance) * 10;
    }
    // Zodiac-page specificity bonus
    const onZodiacPage = [...uw.folios].some(f => FOLIO_SIGNS[f]?.length > 0);
    if (onZodiacPage) score += 5;

    return { ...uw, score, bestMatch, folios: [...uw.folios] };
  });

  scored.sort((a, b) => b.score - a.score);

  console.log("Ranked by: frequency x5 + multi-folio x3 + Hebrew proximity x10 + zodiac page x5\n");
  console.log(`  ${"EVA Word".padEnd(22)} ${"Count".padEnd(6)} ${"Folios".padEnd(30)} ${"Phonetic".padEnd(15)} ${"Consonants".padEnd(12)} ${"Best Hebrew Match".padEnd(30)} Score`);
  console.log("  " + "─".repeat(130));

  for (const entry of scored.slice(0, 50)) {
    const matchStr = entry.bestMatch
      ? `${entry.bestMatch.name}(${entry.bestMatch.category}${entry.bestMatch.sign ? ":" + entry.bestMatch.sign : ""},d=${entry.bestMatch.distance})`
      : "—";
    console.log(`  ${entry.word.padEnd(22)} ${String(entry.count).padStart(3)}   ${entry.folios.join(",").padEnd(30)} ${entry.phonetic.padEnd(15)} ${entry.consonants.padEnd(12)} ${matchStr.padEnd(30)} ${entry.score}`);
  }

  // ─── 7. SPECIAL ANALYSIS: First labels per zodiac section ─────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("7. SECTION-HEAD LABELS (first @Lz label per section)");
  console.log("═══════════════════════════════════════════════════════════════\n");

  console.log("These are the @Lz (section-starting) labels, which likely name");
  console.log("the zodiac sign or month for that ring/section.\n");

  for (const entry of zodiacLabels) {
    if (entry.lineType.includes("@Lz") || entry.lineType.includes("@L0") || entry.lineType.includes("@Ls")) {
      const signs = FOLIO_SIGNS[entry.folio] || [];
      const wordStr = entry.words.join(".");
      const dec = entry.words.map(w => decodeWord(w) || "?").join(" ");
      const phon = entry.words.map(w => evaToPhonetic(w)).join(".");
      const cons = entry.words.map(w => consonantalSkeleton(evaToPhonetic(w))).join(".");

      console.log(`  ${entry.lineId.padEnd(16)} [${signs.join("/").padEnd(20)}] EVA: ${wordStr}`);
      console.log(`${"".padEnd(20)} decode: ${dec}`);
      console.log(`${"".padEnd(20)} phonetic: ${phon}`);
      console.log(`${"".padEnd(20)} consonants: ${cons}`);

      // Check Hebrew matches for each word
      for (const w of entry.words) {
        if (!decodeWord(w)) {
          const matches = findHebrewMatches(w, 2);
          if (matches.length > 0) {
            const top3 = matches.slice(0, 3).map(m =>
              `${m.name}(d=${m.distance})`
            ).join(", ");
            console.log(`${"".padEnd(20)} "${w}" → ${top3}`);
          }
        }
      }
      console.log();
    }
  }

  // ─── 8. FINAL: o- PREFIX ANALYSIS ──────────────────────────────────
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("8. o- PREFIX ANALYSIS");
  console.log("═══════════════════════════════════════════════════════════════\n");

  let oPrefix = 0;
  let nonOPrefix = 0;
  const oPrefixWords = [];
  const nonOPrefixWords = [];

  for (const w of allLabelWords) {
    const tokens = tokenizeEva(w);
    if (tokens.length > 0 && tokens[0] === "o") {
      oPrefix++;
      oPrefixWords.push(w);
    } else {
      nonOPrefix++;
      nonOPrefixWords.push(w);
    }
  }

  console.log(`  Labels starting with 'o': ${oPrefix}/${allLabelWords.length} (${((oPrefix / allLabelWords.length) * 100).toFixed(1)}%)`);

  // Compare with prose
  let oProseCt = 0;
  for (const w of allProseWords) {
    const tokens = tokenizeEva(w);
    if (tokens.length > 0 && tokens[0] === "o") oProseCt++;
  }
  console.log(`  Prose starting with 'o':  ${oProseCt}/${allProseWords.length} (${((oProseCt / allProseWords.length) * 100).toFixed(1)}%)`);

  console.log(`\n  This massive o- prefix rate in labels suggests either:`);
  console.log(`  (a) 'o' is an article/prefix marker in the label encoding`);
  console.log(`  (b) Labels use a different initial glyph than prose`);
  console.log(`  (c) 'o' maps to aleph/he in Hebrew (common word-initial)`);

  // Show what remains after stripping o-
  console.log(`\n  After stripping leading 'o', label stems:`);
  const stems = {};
  for (const w of oPrefixWords) {
    const stem = w.replace(/^o/, "");
    if (stem.length > 0) {
      stems[stem] = (stems[stem] || 0) + 1;
    }
  }
  const sortedStems = Object.entries(stems).sort((a, b) => b[1] - a[1]);
  for (const [stem, count] of sortedStems.slice(0, 30)) {
    const phon = evaToPhonetic(stem);
    const cons = consonantalSkeleton(phon);
    const matches = findHebrewMatches(stem, 2);
    const matchStr = matches.length > 0
      ? matches.slice(0, 2).map(m => `${m.name}(d=${m.distance})`).join(", ")
      : "—";
    console.log(`    o+${stem.padEnd(18)} x${String(count).padStart(2)}  cons=${cons.padEnd(10)} ${matchStr}`);
  }

  // ─── 9. UNIQUE LABEL WORDS NOT IN PROSE ────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("9. LABEL-ONLY WORDS (appear in labels but not zodiac prose)");
  console.log("═══════════════════════════════════════════════════════════════\n");

  const proseWordSet = new Set(allProseWords);
  const labelOnly = [...new Set(allLabelWords)].filter(w => !proseWordSet.has(w));
  const proseAlso = [...new Set(allLabelWords)].filter(w => proseWordSet.has(w));

  console.log(`  Label-only words: ${labelOnly.length}`);
  console.log(`  Words shared with prose: ${proseAlso.length}`);
  console.log(`  Label vocabulary exclusivity: ${((labelOnly.length / (labelOnly.length + proseAlso.length)) * 100).toFixed(1)}%`);

  console.log(`\n  Shared with prose (top 20):`);
  const sharedSorted = proseAlso.sort((a, b) => (wordFreq[b] || 0) - (wordFreq[a] || 0));
  for (const w of sharedSorted.slice(0, 20)) {
    const dec = decodeWord(w);
    console.log(`    ${w.padEnd(20)} label x${wordFreq[w]}  ${dec ? `= ${dec}` : "UNDECODED"}`);
  }

  console.log("\n╔══════════════════════════════════════════════════════════════╗");
  console.log("║                    ANALYSIS COMPLETE                        ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");
}

main();
