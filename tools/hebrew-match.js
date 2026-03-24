#!/usr/bin/env node
/**
 * HEBREW VOCABULARY MATCHING
 * Test undecoded astronomical/zodiac words against Hebrew terms
 * Hypothesis: Hebrew terms are plaintext transliterations (like Occitan month names)
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA phonetic values (for raw transliteration, not cipher decode) ────────
// If Hebrew terms are written as phonetic transliterations into EVA glyphs,
// these are the approximate sound values:
const EVA_PHONETIC = {
  sh: "SH", ch: "KH", // digraphs first
  a: "A", e: "E", o: "O", i: "I",
  k: "K", t: "T", l: "L", r: "R", s: "S",
  d: "D", y: "Y", m: "M", n: "N", q: "Q",
  p: "P", f: "F", g: "G", h: "H",
  ee: "I", ii: "I", // doubled vowels
};

const EVA_DIGRAPHS = ["cth", "cph", "cfh", "ckh", "sh", "ch", "ii", "ee"];
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

function evaToPhonetic(eva) {
  const tokens = tokenizeEva(eva);
  return tokens.map(t => EVA_PHONETIC[t] || t.toUpperCase()).join("");
}

// ─── Hebrew vocabulary database ──────────────────────────────────────────────

const HEBREW_TERMS = [
  // Zodiac signs
  { hebrew: "TALEH", consonants: "TLH", meaning: "Aries (Ram)", category: "zodiac" },
  { hebrew: "SHOR", consonants: "SHR", meaning: "Taurus (Bull)", category: "zodiac" },
  { hebrew: "TEOMIM", consonants: "TMYM", meaning: "Gemini (Twins)", category: "zodiac" },
  { hebrew: "TEOM", consonants: "TM", meaning: "Twin (singular)", category: "zodiac" },
  { hebrew: "SARTAN", consonants: "SRTN", meaning: "Cancer (Crab)", category: "zodiac" },
  { hebrew: "ARYEH", consonants: "RYH", meaning: "Leo (Lion)", category: "zodiac" },
  { hebrew: "BETULAH", consonants: "BTLH", meaning: "Virgo (Virgin)", category: "zodiac" },
  { hebrew: "MOZNAYIM", consonants: "MZNYM", meaning: "Libra (Scales)", category: "zodiac" },
  { hebrew: "AQRAV", consonants: "QRB", meaning: "Scorpio (Scorpion)", category: "zodiac" },
  { hebrew: "QESHET", consonants: "QSHT", meaning: "Sagittarius (Bow)", category: "zodiac" },
  { hebrew: "GEDI", consonants: "GDY", meaning: "Capricorn (Kid)", category: "zodiac" },
  { hebrew: "DELI", consonants: "DLY", meaning: "Aquarius (Bucket)", category: "zodiac" },
  { hebrew: "DAGIM", consonants: "DGYM", meaning: "Pisces (Fish)", category: "zodiac" },
  { hebrew: "MAZAL", consonants: "MZL", meaning: "zodiac sign / fortune", category: "zodiac" },
  { hebrew: "MAZZALOT", consonants: "MZLVT", meaning: "zodiac signs (pl.)", category: "zodiac" },

  // Planets
  { hebrew: "CHAMAH", consonants: "KHMH", meaning: "Sun", category: "planet" },
  { hebrew: "SHEMESH", consonants: "SHMSH", meaning: "Sun (biblical)", category: "planet" },
  { hebrew: "LEVANAH", consonants: "LBNH", meaning: "Moon", category: "planet" },
  { hebrew: "YAREACH", consonants: "YRKH", meaning: "Moon (biblical)", category: "planet" },
  { hebrew: "KOKHAV", consonants: "KVKHB", meaning: "Mercury / star", category: "planet" },
  { hebrew: "NOGAH", consonants: "NGH", meaning: "Venus (brilliance)", category: "planet" },
  { hebrew: "MAADIM", consonants: "MDYM", meaning: "Mars (reddener)", category: "planet" },
  { hebrew: "TZEDEK", consonants: "TSDQ", meaning: "Jupiter (justice)", category: "planet" },
  { hebrew: "SHABTAI", consonants: "SHBTY", meaning: "Saturn (Sabbath)", category: "planet" },

  // Months
  { hebrew: "NISAN", consonants: "NYSN", meaning: "month 1 (Mar/Apr)", category: "month" },
  { hebrew: "IYAR", consonants: "YYR", meaning: "month 2 (Apr/May)", category: "month" },
  { hebrew: "SIVAN", consonants: "SYVN", meaning: "month 3 (May/Jun)", category: "month" },
  { hebrew: "TAMMUZ", consonants: "TMVZ", meaning: "month 4 (Jun/Jul)", category: "month" },
  { hebrew: "ELUL", consonants: "LVL", meaning: "month 6 (Aug/Sep)", category: "month" },
  { hebrew: "TISHREI", consonants: "TSHRY", meaning: "month 7 (Sep/Oct)", category: "month" },
  { hebrew: "CHESHVAN", consonants: "KHSHVN", meaning: "month 8 (Oct/Nov)", category: "month" },
  { hebrew: "KISLEV", consonants: "KSLV", meaning: "month 9 (Nov/Dec)", category: "month" },
  { hebrew: "TEVET", consonants: "TBT", meaning: "month 10 (Dec/Jan)", category: "month" },
  { hebrew: "SHEVAT", consonants: "SHBT", meaning: "month 11 (Jan/Feb)", category: "month" },
  { hebrew: "ADAR", consonants: "DR", meaning: "month 12 (Feb/Mar)", category: "month" },

  // Stars
  { hebrew: "KIMAH", consonants: "KYMH", meaning: "Pleiades", category: "star" },
  { hebrew: "KESIL", consonants: "KSYL", meaning: "Orion", category: "star" },
  { hebrew: "AYISH", consonants: "YSH", meaning: "Ursa Major", category: "star" },
  { hebrew: "NACHASH", consonants: "NKHSH", meaning: "Serpens/Draco", category: "star" },

  // Astronomical terms
  { hebrew: "GALGAL", consonants: "GLGL", meaning: "sphere/orb", category: "astro" },
  { hebrew: "MAALAH", consonants: "MLH", meaning: "degree", category: "astro" },
  { hebrew: "BAYIT", consonants: "BYT", meaning: "house (astrological)", category: "astro" },
  { hebrew: "OLEH", consonants: "VLH", meaning: "ascendant", category: "astro" },
  { hebrew: "MOLAD", consonants: "MVLD", meaning: "horoscope/nativity", category: "astro" },
  { hebrew: "TOLEDAH", consonants: "TVLDH", meaning: "nativity/generation", category: "astro" },
  { hebrew: "CHIBBUR", consonants: "KHBVR", meaning: "conjunction", category: "astro" },
  { hebrew: "TEQUFAH", consonants: "TQVPH", meaning: "equinox/season", category: "astro" },
  { hebrew: "KAVOD", consonants: "KBVD", meaning: "exaltation/glory", category: "astro" },
  { hebrew: "GORAL", consonants: "GVRL", meaning: "lot/fortune", category: "astro" },
  { hebrew: "MISHPAT", consonants: "MSHPT", meaning: "judgment/ruling", category: "astro" },
  { hebrew: "MIVCHAR", consonants: "MBKHR", meaning: "election (timing)", category: "astro" },
  { hebrew: "SHEELAH", consonants: "SHLH", meaning: "interrogation/question", category: "astro" },

  // Pharmaceutical terms
  { hebrew: "SHEMEN", consonants: "SHMN", meaning: "oil", category: "pharma" },
  { hebrew: "MISHCHAH", consonants: "MSHKHH", meaning: "ointment/anointing oil", category: "pharma" },
  { hebrew: "REFUAH", consonants: "RPH", meaning: "medicine/remedy", category: "pharma" },
  { hebrew: "TERUFAH", consonants: "TRPH", meaning: "remedy/cure", category: "pharma" },
  { hebrew: "BOSEM", consonants: "BSM", meaning: "spice/perfume", category: "pharma" },
  { hebrew: "BESAMIM", consonants: "BSMYM", meaning: "spices (pl.)", category: "pharma" },
  { hebrew: "SAM", consonants: "SM", meaning: "drug/substance", category: "pharma" },
  { hebrew: "MIRQACHAT", consonants: "MRQKHT", meaning: "compound mixture", category: "pharma" },
  { hebrew: "SEGULAH", consonants: "SGLH", meaning: "recipe/remedy", category: "pharma" },
  { hebrew: "DEVASH", consonants: "DBSH", meaning: "honey", category: "pharma" },
  { hebrew: "YAYIN", consonants: "YYN", meaning: "wine", category: "pharma" },
  { hebrew: "VERED", consonants: "VRD", meaning: "rose", category: "pharma" },
  { hebrew: "MOR", consonants: "MVR", meaning: "myrrh", category: "pharma" },
  { hebrew: "LEVONAH", consonants: "LBVNH", meaning: "frankincense", category: "pharma" },
  { hebrew: "AHAL", consonants: "HL", meaning: "aloe", category: "pharma" },
  { hebrew: "QINNAMON", consonants: "QNMVN", meaning: "cinnamon", category: "pharma" },
  { hebrew: "KARKOM", consonants: "KRKVM", meaning: "saffron", category: "pharma" },
  { hebrew: "ROFE", consonants: "RVP", meaning: "physician/healer", category: "pharma" },
  { hebrew: "ROQEACH", consonants: "RVQKH", meaning: "apothecary", category: "pharma" },

  // Kabbalistic terms
  { hebrew: "SHEKHINAH", consonants: "SHKNYH", meaning: "Divine Presence (feminine)", category: "kabbalah" },
  { hebrew: "KETER", consonants: "KTR", meaning: "Crown (1st sefirah)", category: "kabbalah" },
  { hebrew: "CHOKHMAH", consonants: "KHKMH", meaning: "Wisdom (2nd sefirah)", category: "kabbalah" },
  { hebrew: "BINAH", consonants: "BYNH", meaning: "Understanding (3rd sefirah)", category: "kabbalah" },
  { hebrew: "CHESED", consonants: "KHSD", meaning: "Mercy (4th sefirah)", category: "kabbalah" },
  { hebrew: "GEVURAH", consonants: "GVRH", meaning: "Strength (5th sefirah)", category: "kabbalah" },
  { hebrew: "TIFERET", consonants: "TPRT", meaning: "Beauty (6th sefirah)", category: "kabbalah" },
  { hebrew: "NETZACH", consonants: "NTSKH", meaning: "Victory (7th sefirah)", category: "kabbalah" },
  { hebrew: "HOD", consonants: "HVD", meaning: "Glory (8th sefirah)", category: "kabbalah" },
  { hebrew: "YESOD", consonants: "YSVD", meaning: "Foundation (9th sefirah)", category: "kabbalah" },
  { hebrew: "MALKHUT", consonants: "MLKHVT", meaning: "Kingdom (10th sefirah)", category: "kabbalah" },
  { hebrew: "OR", consonants: "VR", meaning: "Light", category: "kabbalah" },
  { hebrew: "OROT", consonants: "VRVT", meaning: "Lights (pl.)", category: "kabbalah" },

  // Common Hebrew words that might appear
  { hebrew: "SHALOM", consonants: "SHLVM", meaning: "peace/wholeness", category: "common" },
  { hebrew: "OLAM", consonants: "VLM", meaning: "world/eternity", category: "common" },
  { hebrew: "EMET", consonants: "MT", meaning: "truth", category: "common" },
  { hebrew: "CHAIM", consonants: "KHYM", meaning: "life", category: "common" },
  { hebrew: "TORAH", consonants: "TVRH", meaning: "teaching/law", category: "common" },
  { hebrew: "ISRAEL", consonants: "YSRL", meaning: "Israel", category: "common" },
  { hebrew: "QADOSH", consonants: "QDVSH", meaning: "holy", category: "common" },
  { hebrew: "BARUKH", consonants: "BRVKH", meaning: "blessed", category: "common" },
  { hebrew: "ADONAI", consonants: "DVNY", meaning: "my Lord", category: "common" },
  { hebrew: "ELOHIM", consonants: "LHYM", meaning: "God", category: "common" },
  { hebrew: "RUACH", consonants: "RVKH", meaning: "spirit/wind", category: "common" },
  { hebrew: "NEFESH", consonants: "NPSH", meaning: "soul", category: "common" },
  { hebrew: "TESHUVAH", consonants: "TSHVVH", meaning: "repentance/return", category: "common" },
  { hebrew: "QAISAR", consonants: "QYSR", meaning: "Caesar/emperor", category: "common" },
];

// ─── Parse transcription ─────────────────────────────────────────────────────

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

const SUPER_GALLOWS = new Set(["cth", "ckh", "cph", "cfh"]);
function stripGallows(w) { return tokenizeEva(w).filter(t => !SUPER_GALLOWS.has(t)).join(""); }
function decodeWord(w) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c) return null;
  if (GLOSS[c]) return GLOSS[c];
  const s = stripGallows(c);
  if (s !== c && GLOSS[s]) return GLOSS[s];
  return null;
}

const folios = parseTranscription();

// ─── Collect undecoded words from astro/zodiac ───────────────────────────────

const undecoded = {};
for (const [folio, lines] of Object.entries(folios)) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  if (!((num >= 58 && num <= 73))) continue;

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

// Also collect ALL undecoded words from entire manuscript for broader search
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

// ─── Matching functions ──────────────────────────────────────────────────────

function normalize(s) {
  return s.toUpperCase().replace(/[^A-Z]/g, "");
}

// Convert EVA to phonetic approximation
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

// Strip vowels from phonetic form (to match Hebrew consonantal)
function stripVowels(s) {
  return s.replace(/[AEIOU]/g, "");
}

// Check if two consonant strings are similar (Levenshtein distance ≤ threshold)
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

// ─── Run matching ────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  HEBREW VOCABULARY MATCHING — Undecoded EVA vs Hebrew terms        ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

// Method 1: Direct phonetic match (EVA sounds ≈ Hebrew transliteration)
console.log("═".repeat(70));
console.log("METHOD 1: DIRECT PHONETIC MATCH");
console.log("(EVA glyphs read as phonetic values, compared to Hebrew)");
console.log("═".repeat(70) + "\n");

const matches = [];

for (const [eva, info] of Object.entries(undecoded)) {
  const phonetic = evaPhonetic(eva);
  const consonantsOnly = stripVowels(phonetic);

  for (const term of HEBREW_TERMS) {
    // Exact phonetic match
    if (phonetic === term.hebrew.toUpperCase()) {
      matches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "EXACT_PHONETIC", distance: 0, folios: [...info.folios], count: info.count });
    }
    // Exact consonant match
    else if (consonantsOnly === term.consonants) {
      matches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "EXACT_CONSONANTS", distance: 0, folios: [...info.folios], count: info.count });
    }
    // Close match (Levenshtein ≤ 1 on consonants, min length 3)
    else if (consonantsOnly.length >= 3 && term.consonants.length >= 3) {
      const dist = levenshtein(consonantsOnly, term.consonants);
      if (dist === 1) {
        matches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "CLOSE_CONSONANTS", distance: 1, folios: [...info.folios], count: info.count });
      }
    }
    // Close phonetic (Levenshtein ≤ 1 on full phonetic, min length 4)
    else if (phonetic.length >= 4 && term.hebrew.length >= 4) {
      const dist = levenshtein(phonetic, term.hebrew.toUpperCase());
      if (dist <= 1) {
        matches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "CLOSE_PHONETIC", distance: dist, folios: [...info.folios], count: info.count });
      }
    }
  }
}

// Sort by quality
const qualityOrder = { EXACT_PHONETIC: 0, EXACT_CONSONANTS: 1, CLOSE_CONSONANTS: 2, CLOSE_PHONETIC: 3 };
matches.sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality]);

if (matches.length === 0) {
  console.log("No matches found in astro/zodiac sections.\n");
} else {
  console.log(`Found ${matches.length} potential matches:\n`);
  for (const m of matches) {
    console.log(`  EVA: ${m.eva.padEnd(20)} Phonetic: ${m.phonetic.padEnd(15)} → Hebrew: ${m.hebrew.padEnd(12)} = ${m.meaning}`);
    console.log(`  ${" ".repeat(6)}Match: ${m.quality} (dist=${m.distance})  Category: ${m.category}  Folios: ${m.folios.join(",")}\n`);
  }
}

// Method 2: Search ENTIRE manuscript for Hebrew terms
console.log("\n" + "═".repeat(70));
console.log("METHOD 2: FULL MANUSCRIPT SEARCH");
console.log("(Same matching across ALL undecoded words, not just astro/zodiac)");
console.log("═".repeat(70) + "\n");

const allMatches = [];

for (const [eva, info] of Object.entries(allUndecoded)) {
  const phonetic = evaPhonetic(eva);
  const consonantsOnly = stripVowels(phonetic);

  for (const term of HEBREW_TERMS) {
    if (phonetic === term.hebrew.toUpperCase()) {
      allMatches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "EXACT_PHONETIC", distance: 0, folios: [...info.folios], count: info.count });
    }
    else if (consonantsOnly === term.consonants && consonantsOnly.length >= 2) {
      allMatches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "EXACT_CONSONANTS", distance: 0, folios: [...info.folios], count: info.count });
    }
    else if (consonantsOnly.length >= 3 && term.consonants.length >= 3 && levenshtein(consonantsOnly, term.consonants) === 1) {
      allMatches.push({ eva, phonetic, hebrew: term.hebrew, meaning: term.meaning, category: term.category, quality: "CLOSE_CONSONANTS", distance: 1, folios: [...info.folios], count: info.count });
    }
  }
}

allMatches.sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality] || b.count - a.count);

// Deduplicate (skip if already in astro matches)
const astroEvas = new Set(matches.map(m => m.eva + m.hebrew));
const newMatches = allMatches.filter(m => !astroEvas.has(m.eva + m.hebrew));

if (newMatches.length === 0) {
  console.log("No additional matches found outside astro/zodiac.\n");
} else {
  console.log(`Found ${newMatches.length} additional matches outside astro/zodiac:\n`);
  for (const m of newMatches) {
    console.log(`  EVA: ${m.eva.padEnd(20)} Phonetic: ${m.phonetic.padEnd(15)} → Hebrew: ${m.hebrew.padEnd(12)} = ${m.meaning}`);
    console.log(`  ${" ".repeat(6)}Match: ${m.quality} (dist=${m.distance})  Count: ${m.count}×  Folios: ${m.folios.join(",")}\n`);
  }
}

// Method 3: Specific interesting candidates (manual inspection)
console.log("\n" + "═".repeat(70));
console.log("METHOD 3: NOTABLE UNDECODED WORDS — MANUAL INSPECTION");
console.log("═".repeat(70) + "\n");

const notable = [
  { eva: "shalom", note: "Hebrew SHALOM (peace) — exact match?" },
  { eva: "oteom", note: "Stripped=teom, Hebrew TEOM (twin) = Gemini?" },
  { eva: "ealam", note: "Hebrew OLAM (world/eternity)?" },
  { eva: "chairam", note: "Hebrew/Phoenician HIRAM?" },
  { eva: "kaisar", note: "Hebrew QAISAR (Caesar/emperor)?" },
  { eva: "sholalam", note: "SHALOM + LAM? Hebrew compound?" },
  { eva: "shekealy", note: "Contains SHEKEL (weight unit)?" },
  { eva: "cholam", note: "Hebrew CHOLAM (vowel name) or CHALOM (dream)?" },
  { eva: "archol", note: "Hebrew? Unknown" },
  { eva: "aram", note: "ARAM (Aramaic/Syria)?" },
  { eva: "talar", note: "Hebrew TALAR?" },
  { eva: "salal", note: "Hebrew SALAL (to praise/exalt)?" },
  { eva: "dalaldam", note: "DAL-AL-DAM? Hebrew DAM (blood)?" },
  { eva: "sharal", note: "Hebrew SHARAL / ISRAEL variant?" },
  { eva: "rotaiin", note: "Hebrew root R-T-'? Or ROTA (wheel)?" },
];

for (const n of notable) {
  const found = allUndecoded[n.eva] || undecoded[n.eva];
  if (found) {
    const phonetic = evaPhonetic(n.eva);
    const consonants = stripVowels(phonetic);
    console.log(`  ${n.eva.padEnd(16)} phonetic=${phonetic.padEnd(14)} consonants=${consonants.padEnd(10)} ${n.note}`);
    console.log(`  ${" ".repeat(16)} count=${found.count}×  folios: ${[...found.folios].join(",")}\n`);
  } else {
    // Check if it's a paragraph-initial or decoded word
    console.log(`  ${n.eva.padEnd(16)} — not found in undecoded words (may decode or not exist)\n`);
  }
}

// Method 4: Pattern analysis — do undecoded words cluster differently?
console.log("\n" + "═".repeat(70));
console.log("METHOD 4: STRUCTURAL PATTERNS IN UNDECODED ASTRO/ZODIAC WORDS");
console.log("═".repeat(70) + "\n");

// Check initial glyph distribution
const initials = {};
const allInitials = {};
for (const eva of Object.keys(undecoded)) {
  const tokens = tokenizeEva(eva);
  if (tokens.length > 0) {
    initials[tokens[0]] = (initials[tokens[0]] || 0) + 1;
  }
}

// Compare with decoded word initials from same sections
for (const [folio, lines] of Object.entries(folios)) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  if (!((num >= 58 && num <= 73))) continue;
  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      if (!decodeWord(clean)) continue;
      const tokens = tokenizeEva(clean);
      if (tokens.length > 0) {
        allInitials[tokens[0]] = (allInitials[tokens[0]] || 0) + 1;
      }
    }
  }
}

console.log("Initial glyph distribution (undecoded vs decoded in astro/zodiac):\n");
console.log("Glyph    Undecoded    Decoded    Ratio");
console.log("─".repeat(50));
const allGlyphs = new Set([...Object.keys(initials), ...Object.keys(allInitials)]);
for (const g of [...allGlyphs].sort((a, b) => (initials[b] || 0) - (initials[a] || 0))) {
  const u = initials[g] || 0;
  const d = allInitials[g] || 0;
  if (u + d < 3) continue;
  const ratio = d > 0 ? (u / d).toFixed(2) : "∞";
  const bar = "█".repeat(Math.round(u / 2));
  console.log(`${g.padEnd(8)} ${String(u).padStart(5)}        ${String(d).padStart(5)}      ${ratio.padStart(5)}  ${bar}`);
}

console.log("\n\nDone.");
