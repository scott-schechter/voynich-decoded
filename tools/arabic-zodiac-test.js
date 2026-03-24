#!/usr/bin/env node
/**
 * ARABIC ZODIAC TEST — Test Arabic astronomical vocabulary against undecoded
 * Voynich words from the astronomical/zodiac sections (f58–f73).
 * Goal: Rule out Arabic as an alternative to Hebrew for the undecoded layer.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA tokenizer and decode logic ─────────────────────────────────────────

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

// ─── EVA to phonetic conversion ─────────────────────────────────────────────

function evaPhonetic(eva) {
  const tokens = tokenizeEva(eva);
  let result = "";
  for (const t of tokens) {
    if (t === "sh") result += "SH";
    else if (t === "ch") result += "KH";
    else if (t === "ee") result += "I";
    else if (t === "ii") result += "I";
    else result += t.toUpperCase();
  }
  return result;
}

function stripVowels(s) {
  return s.replace(/[AEIOU]/g, "");
}

// ─── Arabic vocabulary database ─────────────────────────────────────────────

const ARABIC_TERMS = [
  // Zodiac signs
  { arabic: "al-Hamal", consonants: "LHML", meaning: "Aries (the Ram)", category: "zodiac" },
  { arabic: "al-Thawr", consonants: "LTHWR", meaning: "Taurus (the Bull)", category: "zodiac" },
  { arabic: "al-Jawza", consonants: "LJWZ", meaning: "Gemini (the Twins)", category: "zodiac" },
  { arabic: "al-Saratan", consonants: "LSRTN", meaning: "Cancer (the Crab)", category: "zodiac" },
  { arabic: "al-Asad", consonants: "LSD", meaning: "Leo (the Lion)", category: "zodiac" },
  { arabic: "al-Sunbulah", consonants: "LSNBLH", meaning: "Virgo (Ear of Grain)", category: "zodiac" },
  { arabic: "al-Mizan", consonants: "LMZN", meaning: "Libra (the Balance)", category: "zodiac" },
  { arabic: "al-Aqrab", consonants: "LQRB", meaning: "Scorpio (the Scorpion)", category: "zodiac" },
  { arabic: "al-Qaws", consonants: "LQWS", meaning: "Sagittarius (the Bow)", category: "zodiac" },
  { arabic: "al-Jady", consonants: "LJDY", meaning: "Capricorn (the Kid)", category: "zodiac" },
  { arabic: "al-Dalw", consonants: "LDLW", meaning: "Aquarius (the Bucket)", category: "zodiac" },
  { arabic: "al-Hut", consonants: "LHT", meaning: "Pisces (the Fish)", category: "zodiac" },

  // Planets
  { arabic: "al-Shams", consonants: "LSHMS", meaning: "Sun", category: "planet" },
  { arabic: "al-Qamar", consonants: "LQMR", meaning: "Moon", category: "planet" },
  { arabic: "Utarid", consonants: "TRID", meaning: "Mercury", category: "planet" },
  { arabic: "al-Zuhra", consonants: "LZHR", meaning: "Venus", category: "planet" },
  { arabic: "al-Mirrikh", consonants: "LMRKH", meaning: "Mars", category: "planet" },
  { arabic: "al-Mushtari", consonants: "LMSHTRY", meaning: "Jupiter", category: "planet" },
  { arabic: "Zuhal", consonants: "ZHL", meaning: "Saturn", category: "planet" },

  // Islamic calendar months
  { arabic: "Muharram", consonants: "MHRM", meaning: "month 1", category: "month" },
  { arabic: "Safar", consonants: "SFR", meaning: "month 2", category: "month" },
  { arabic: "Rabi al-Awwal", consonants: "RBLWL", meaning: "month 3", category: "month" },
  { arabic: "Rabi al-Thani", consonants: "RBLTHNY", meaning: "month 4", category: "month" },
  { arabic: "Jumada al-Ula", consonants: "JMDLL", meaning: "month 5", category: "month" },
  { arabic: "Jumada al-Thani", consonants: "JMDLTHNY", meaning: "month 6", category: "month" },
  { arabic: "Rajab", consonants: "RJB", meaning: "month 7", category: "month" },
  { arabic: "Shaban", consonants: "SHBN", meaning: "month 8", category: "month" },
  { arabic: "Ramadan", consonants: "RMDN", meaning: "month 9", category: "month" },
  { arabic: "Shawwal", consonants: "SHWL", meaning: "month 10", category: "month" },
  { arabic: "Dhu al-Qadah", consonants: "DHLQDH", meaning: "month 11", category: "month" },
  { arabic: "Dhu al-Hijjah", consonants: "DHLHJH", meaning: "month 12", category: "month" },

  // Astronomical terms
  { arabic: "Burj", consonants: "BRJ", meaning: "zodiac sign", category: "astro" },
  { arabic: "Kawkab", consonants: "KWKB", meaning: "star/planet", category: "astro" },
  { arabic: "Falak", consonants: "FLK", meaning: "sphere/orbit", category: "astro" },
  { arabic: "Darajah", consonants: "DRJH", meaning: "degree", category: "astro" },
  { arabic: "Tali", consonants: "TLY", meaning: "ascendant", category: "astro" },
  { arabic: "Qiran", consonants: "QRN", meaning: "conjunction", category: "astro" },
  { arabic: "Najm", consonants: "NJM", meaning: "star", category: "astro" },
  { arabic: "Sama", consonants: "SM", meaning: "sky/heaven", category: "astro" },
  { arabic: "Mintaqah", consonants: "MNTQH", meaning: "zodiac belt", category: "astro" },
  { arabic: "Ufuq", consonants: "FQ", meaning: "horizon", category: "astro" },
  { arabic: "Wasit al-Sama", consonants: "WSTLSM", meaning: "midheaven", category: "astro" },
  { arabic: "Qutb", consonants: "QTB", meaning: "pole (celestial)", category: "astro" },
  { arabic: "Haraka", consonants: "HRK", meaning: "motion (planetary)", category: "astro" },
  { arabic: "Ittissal", consonants: "TTSL", meaning: "application (astro)", category: "astro" },

  // Pharmaceutical terms
  { arabic: "Dawa", consonants: "DW", meaning: "medicine", category: "pharma" },
  { arabic: "Duhan", consonants: "DHN", meaning: "smoke/fumigation", category: "pharma" },
  { arabic: "Zayt", consonants: "ZYT", meaning: "oil", category: "pharma" },
  { arabic: "Habb", consonants: "HB", meaning: "seed/pill", category: "pharma" },
  { arabic: "Tiryaq", consonants: "TRYQ", meaning: "theriac/antidote", category: "pharma" },
  { arabic: "Sharba", consonants: "SHRB", meaning: "potion/syrup", category: "pharma" },
  { arabic: "Daqiq", consonants: "DQQ", meaning: "powder (fine)", category: "pharma" },
  { arabic: "Marham", consonants: "MRHM", meaning: "ointment", category: "pharma" },
  { arabic: "Khall", consonants: "KHL", meaning: "vinegar", category: "pharma" },
  { arabic: "Asal", consonants: "SL", meaning: "honey", category: "pharma" },
  { arabic: "Sukkar", consonants: "SKR", meaning: "sugar", category: "pharma" },
  { arabic: "Tabikh", consonants: "TBKH", meaning: "decoction", category: "pharma" },
  { arabic: "Qirtas", consonants: "QRTS", meaning: "paper/dosage form", category: "pharma" },
  { arabic: "Hakim", consonants: "HKM", meaning: "physician", category: "pharma" },
  { arabic: "Attar", consonants: "TR", meaning: "apothecary/perfumer", category: "pharma" },

  // Common Arabic words that might appear in astronomical/medical MSS
  { arabic: "Kitab", consonants: "KTB", meaning: "book", category: "common" },
  { arabic: "Bab", consonants: "BB", meaning: "chapter/gate", category: "common" },
  { arabic: "Fasl", consonants: "FSL", meaning: "section/season", category: "common" },
  { arabic: "Ilm", consonants: "LM", meaning: "knowledge/science", category: "common" },
  { arabic: "Amal", consonants: "ML", meaning: "work/practice", category: "common" },
  { arabic: "Quwwa", consonants: "QW", meaning: "power/virtue", category: "common" },
  { arabic: "Tabiah", consonants: "TBH", meaning: "nature", category: "common" },
  { arabic: "Hararah", consonants: "HRRH", meaning: "heat", category: "common" },
  { arabic: "Burudah", consonants: "BRDH", meaning: "coldness", category: "common" },
  { arabic: "Rutubah", consonants: "RTBH", meaning: "moisture", category: "common" },
  { arabic: "Yubusah", consonants: "YBSH", meaning: "dryness", category: "common" },
  { arabic: "Allah", consonants: "LLH", meaning: "God", category: "common" },
  { arabic: "Rabb", consonants: "RB", meaning: "Lord", category: "common" },
  { arabic: "Salam", consonants: "SLM", meaning: "peace", category: "common" },
  { arabic: "Baraka", consonants: "BRK", meaning: "blessing", category: "common" },
  { arabic: "Nur", consonants: "NR", meaning: "light", category: "common" },
  { arabic: "Sirr", consonants: "SR", meaning: "secret", category: "common" },
  { arabic: "Hikma", consonants: "HKM", meaning: "wisdom", category: "common" },
];

// ─── Parse transcription ────────────────────────────────────────────────────

function parseTranscription() {
  const raw = readFileSync(EVA_PATH, "utf-8");
  const lines = raw.split("\n");
  const folios = {};
  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;
    const fh = line.match(/^<(f\d+[rv]\d?)>\s+<!/);
    if (fh) { if (!folios[fh[1]]) folios[fh[1]] = []; continue; }
    const cm = line.match(/^<(f\d+[rv]\d?)\.\d+,[^>]+>\s+(.+)/);
    if (cm) {
      const f = cm[1];
      if (!folios[f]) folios[f] = [];
      let t = cm[2].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
      const words = t.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);
      folios[f].push(words);
    }
  }
  return folios;
}

const folios = parseTranscription();

// ─── Collect undecoded words from astro/zodiac (f58–f73) ────────────────────

const undecoded = {};
for (const [folio, lines] of Object.entries(folios)) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  if (!(num >= 58 && num <= 73)) continue;

  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      if (decodeWord(clean)) continue;
      if (!undecoded[clean]) undecoded[clean] = { count: 0, folios: new Set() };
      undecoded[clean].count++;
      undecoded[clean].folios.add(folio);
    }
  }
}

// Also collect ALL undecoded words from entire manuscript
const allUndecoded = {};
for (const [folio, lines] of Object.entries(folios)) {
  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      if (decodeWord(clean)) continue;
      if (!allUndecoded[clean]) allUndecoded[clean] = { count: 0, folios: new Set() };
      allUndecoded[clean].count++;
      allUndecoded[clean].folios.add(folio);
    }
  }
}

// ─── Levenshtein distance ───────────────────────────────────────────────────

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i-1][j] + 1,
        dp[i][j-1] + 1,
        dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

// ─── Matching ───────────────────────────────────────────────────────────────

function matchAgainstArabic(wordMap) {
  const matches = [];

  for (const [eva, info] of Object.entries(wordMap)) {
    const phonetic = evaPhonetic(eva);
    const consonantsOnly = stripVowels(phonetic);

    for (const term of ARABIC_TERMS) {
      // Exact consonant match
      if (consonantsOnly === term.consonants && consonantsOnly.length >= 2) {
        matches.push({
          eva, phonetic, consonants: consonantsOnly,
          arabic: term.arabic, arabicConsonants: term.consonants,
          meaning: term.meaning, category: term.category,
          quality: "EXACT_CONSONANTS", distance: 0,
          folios: [...info.folios], count: info.count,
        });
      }
      // Levenshtein <= 1 on consonants (min length 3)
      else if (consonantsOnly.length >= 3 && term.consonants.length >= 3) {
        const dist = levenshtein(consonantsOnly, term.consonants);
        if (dist === 1) {
          matches.push({
            eva, phonetic, consonants: consonantsOnly,
            arabic: term.arabic, arabicConsonants: term.consonants,
            meaning: term.meaning, category: term.category,
            quality: "CLOSE_CONSONANTS", distance: 1,
            folios: [...info.folios], count: info.count,
          });
        }
      }
      // Also try close phonetic match (Levenshtein <= 1 on full form)
      else if (phonetic.length >= 4) {
        const arabicUpper = term.arabic.toUpperCase().replace(/[^A-Z]/g, "");
        if (arabicUpper.length >= 4) {
          const dist = levenshtein(phonetic, arabicUpper);
          if (dist <= 1) {
            matches.push({
              eva, phonetic, consonants: consonantsOnly,
              arabic: term.arabic, arabicConsonants: term.consonants,
              meaning: term.meaning, category: term.category,
              quality: "CLOSE_PHONETIC", distance: dist,
              folios: [...info.folios], count: info.count,
            });
          }
        }
      }
    }
  }

  const qualityOrder = { EXACT_CONSONANTS: 0, CLOSE_CONSONANTS: 1, CLOSE_PHONETIC: 2 };
  matches.sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality] || b.count - a.count);
  return matches;
}

// ─── Output ─────────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  ARABIC ZODIAC TEST — Arabic vocabulary vs undecoded EVA words     ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log(`Undecoded words in f58-f73: ${Object.keys(undecoded).length} unique forms`);
console.log(`Undecoded words (full MS):  ${Object.keys(allUndecoded).length} unique forms`);
console.log(`Arabic terms to test:       ${ARABIC_TERMS.length}\n`);

// ─── Method 1: Astro/Zodiac sections only ───────────────────────────────────

console.log("═".repeat(70));
console.log("METHOD 1: ASTRO/ZODIAC SECTIONS ONLY (f58-f73)");
console.log("(EVA glyphs read as phonetic values, consonants vs Arabic)");
console.log("═".repeat(70) + "\n");

const astroMatches = matchAgainstArabic(undecoded);

if (astroMatches.length === 0) {
  console.log("No matches found in astro/zodiac sections.\n");
} else {
  console.log(`Found ${astroMatches.length} potential matches:\n`);
  for (const m of astroMatches) {
    console.log(`  EVA: ${m.eva.padEnd(20)} Phonetic: ${m.phonetic.padEnd(15)} Consonants: ${m.consonants.padEnd(10)}`);
    console.log(`  ${" ".repeat(6)}Arabic:  ${m.arabic.padEnd(18)} (${m.arabicConsonants}) = ${m.meaning}`);
    console.log(`  ${" ".repeat(6)}Match: ${m.quality} (dist=${m.distance})  Category: ${m.category}  Count: ${m.count}x  Folios: ${m.folios.join(",")}\n`);
  }
}

// ─── Method 2: Full manuscript search ───────────────────────────────────────

console.log("═".repeat(70));
console.log("METHOD 2: FULL MANUSCRIPT SEARCH");
console.log("(Same matching across ALL undecoded words)");
console.log("═".repeat(70) + "\n");

const allMatches = matchAgainstArabic(allUndecoded);

// Deduplicate (skip if already found in astro matches)
const astroKeys = new Set(astroMatches.map(m => m.eva + m.arabic));
const newMatches = allMatches.filter(m => !astroKeys.has(m.eva + m.arabic));

const totalAllMatches = allMatches.length;

if (newMatches.length === 0) {
  console.log(`No additional matches found outside astro/zodiac (${totalAllMatches} total across full MS).\n`);
} else {
  console.log(`Found ${newMatches.length} additional matches outside astro/zodiac (${totalAllMatches} total):\n`);
  for (const m of newMatches) {
    console.log(`  EVA: ${m.eva.padEnd(20)} Phonetic: ${m.phonetic.padEnd(15)} Consonants: ${m.consonants.padEnd(10)}`);
    console.log(`  ${" ".repeat(6)}Arabic:  ${m.arabic.padEnd(18)} (${m.arabicConsonants}) = ${m.meaning}`);
    console.log(`  ${" ".repeat(6)}Match: ${m.quality} (dist=${m.distance})  Category: ${m.category}  Count: ${m.count}x  Folios: ${m.folios.join(",")}\n`);
  }
}

// ─── Method 3: Category breakdown ───────────────────────────────────────────

console.log("═".repeat(70));
console.log("METHOD 3: MATCH BREAKDOWN BY CATEGORY");
console.log("═".repeat(70) + "\n");

const catCounts = {};
for (const m of allMatches) {
  if (!catCounts[m.category]) catCounts[m.category] = { exact: 0, close: 0 };
  if (m.quality === "EXACT_CONSONANTS") catCounts[m.category].exact++;
  else catCounts[m.category].close++;
}

console.log(`${"Category".padEnd(15)} ${"Exact".padStart(6)} ${"Close".padStart(6)} ${"Total".padStart(6)}`);
console.log("─".repeat(40));
for (const [cat, counts] of Object.entries(catCounts).sort((a, b) => (b[1].exact + b[1].close) - (a[1].exact + a[1].close))) {
  console.log(`${cat.padEnd(15)} ${String(counts.exact).padStart(6)} ${String(counts.close).padStart(6)} ${String(counts.exact + counts.close).padStart(6)}`);
}

// ─── Method 4: Quality comparison vs Hebrew ─────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("METHOD 4: ARABIC vs HEBREW COMPARISON");
console.log("═".repeat(70) + "\n");

const arabicAstroCount = astroMatches.length;
const arabicTotalCount = allMatches.length;
const arabicExact = allMatches.filter(m => m.quality === "EXACT_CONSONANTS").length;
const arabicClose = allMatches.filter(m => m.quality === "CLOSE_CONSONANTS" || m.quality === "CLOSE_PHONETIC").length;

// Hebrew comparison numbers (from hebrew-match.js results: 81 total)
const hebrewTotal = 81;

console.log("Metric                     Arabic    Hebrew");
console.log("─".repeat(50));
console.log(`Astro/Zodiac matches     ${String(arabicAstroCount).padStart(6)}    (see Hebrew script)`);
console.log(`Full MS matches          ${String(arabicTotalCount).padStart(6)}    ${String(hebrewTotal).padStart(6)}`);
console.log(`  Exact consonant        ${String(arabicExact).padStart(6)}    —`);
console.log(`  Close (dist<=1)        ${String(arabicClose).padStart(6)}    —`);
console.log(`Terms tested             ${String(ARABIC_TERMS.length).padStart(6)}    ~80`);

// ─── Zodiac-specific check ──────────────────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("METHOD 5: ZODIAC SIGN MATCHING DETAIL");
console.log("(Do any of the 12 Arabic zodiac names match undecoded words?)");
console.log("═".repeat(70) + "\n");

const zodiacTerms = ARABIC_TERMS.filter(t => t.category === "zodiac");
let zodiacHits = 0;

for (const term of zodiacTerms) {
  let found = false;
  for (const [eva, info] of Object.entries(undecoded)) {
    const phonetic = evaPhonetic(eva);
    const cons = stripVowels(phonetic);
    const dist = levenshtein(cons, term.consonants);
    if (dist <= 1 && cons.length >= 2 && term.consonants.length >= 2) {
      console.log(`  ${term.arabic.padEnd(18)} (${term.consonants.padEnd(8)}) = ${term.meaning.padEnd(25)} <-- MATCH: ${eva} (${cons}), dist=${dist}`);
      found = true;
      zodiacHits++;
    }
  }
  if (!found) {
    console.log(`  ${term.arabic.padEnd(18)} (${term.consonants.padEnd(8)}) = ${term.meaning.padEnd(25)} — no match`);
  }
}

console.log(`\nZodiac signs matched: ${zodiacHits}/12`);

// ─── Summary ────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("SUMMARY — ARABIC vs HEBREW HYPOTHESIS");
console.log("═".repeat(70) + "\n");

console.log(`Arabic test results:`);
console.log(`  Astro/Zodiac matches (f58-f73): ${arabicAstroCount}`);
console.log(`  Full manuscript matches:        ${arabicTotalCount}`);
console.log(`  Exact consonant matches:        ${arabicExact}`);
console.log(`  Close matches (dist<=1):        ${arabicClose}`);
console.log(`  Zodiac sign hits:               ${zodiacHits}/12`);
console.log(`\nHebrew test results (for comparison):`);
console.log(`  Full manuscript matches:        ${hebrewTotal}`);
console.log(`\nVerdict:`);

if (arabicTotalCount < hebrewTotal * 0.5) {
  console.log(`  Arabic (${arabicTotalCount} matches) is SIGNIFICANTLY WEAKER than Hebrew (${hebrewTotal} matches).`);
  console.log(`  Arabic can be ruled out as the source language for the undecoded layer.`);
} else if (arabicTotalCount < hebrewTotal) {
  console.log(`  Arabic (${arabicTotalCount} matches) is WEAKER than Hebrew (${hebrewTotal} matches).`);
  console.log(`  Arabic is less likely but cannot be fully excluded.`);
} else {
  console.log(`  Arabic (${arabicTotalCount} matches) is COMPARABLE to Hebrew (${hebrewTotal} matches).`);
  console.log(`  Further investigation needed to distinguish the two hypotheses.`);
}

console.log("\nDone.");
