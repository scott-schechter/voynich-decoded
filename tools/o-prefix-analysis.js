#!/usr/bin/env node
/**
 * O-PREFIX ANALYSIS
 * Investigate the "o-" prefix pattern in undecoded Voynich manuscript words.
 * Hypothesis: EVA "o" may be a systematic morphological marker —
 * possibly the Hebrew definite article "ha-" or another structural pattern.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── Super-gallows and EVA tokenizer ─────────────────────────────────────────

const SUPER_GALLOWS = new Set(["cth", "ckh", "cph", "cfh"]);
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

// ─── EVA phonetic mapping (from hebrew-match.js) ─────────────────────────────

const EVA_PHONETIC = {
  sh: "SH", ch: "KH",
  a: "A", e: "E", o: "O", i: "I",
  k: "K", t: "T", l: "L", r: "R", s: "S",
  d: "D", y: "Y", m: "M", n: "N", q: "Q",
  p: "P", f: "F", g: "G", h: "H",
  ee: "I", ii: "I",
};

function evaPhonetic(eva) {
  const tokens = tokenizeEva(eva);
  return tokens.map(t => EVA_PHONETIC[t] || t.toUpperCase()).join("");
}

function stripVowels(s) {
  return s.replace(/[AEIOU]/g, "");
}

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

// ─── Hebrew terms database ──────────────────────────────────────────────────

const HEBREW_TERMS = [
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
  { hebrew: "CHAMAH", consonants: "KHMH", meaning: "Sun", category: "planet" },
  { hebrew: "SHEMESH", consonants: "SHMSH", meaning: "Sun (biblical)", category: "planet" },
  { hebrew: "LEVANAH", consonants: "LBNH", meaning: "Moon", category: "planet" },
  { hebrew: "YAREACH", consonants: "YRKH", meaning: "Moon (biblical)", category: "planet" },
  { hebrew: "KOKHAV", consonants: "KVKHB", meaning: "Mercury / star", category: "planet" },
  { hebrew: "NOGAH", consonants: "NGH", meaning: "Venus (brilliance)", category: "planet" },
  { hebrew: "MAADIM", consonants: "MDYM", meaning: "Mars (reddener)", category: "planet" },
  { hebrew: "TZEDEK", consonants: "TSDQ", meaning: "Jupiter (justice)", category: "planet" },
  { hebrew: "SHABTAI", consonants: "SHBTY", meaning: "Saturn (Sabbath)", category: "planet" },
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
  { hebrew: "KIMAH", consonants: "KYMH", meaning: "Pleiades", category: "star" },
  { hebrew: "KESIL", consonants: "KSYL", meaning: "Orion", category: "star" },
  { hebrew: "AYISH", consonants: "YSH", meaning: "Ursa Major", category: "star" },
  { hebrew: "NACHASH", consonants: "NKHSH", meaning: "Serpens/Draco", category: "star" },
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

// ─── Determine section for a folio ──────────────────────────────────────────

function getSection(folio) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  const rv = folio.includes("v") ? "v" : "r";
  if (num >= 1 && num <= 57) return "herbal";
  if (num >= 58 && num <= 67) return "astro";
  if (num >= 68 && num <= 73) return "zodiac";
  if (num >= 75 && num <= 84) return "bio";
  if (num >= 85 && num <= 86) return "cosmo";
  if (num >= 87 && num <= 102) return "pharma";
  if (num >= 103 && num <= 116) return "stars";
  return "other";
}

// ─── Main analysis ──────────────────────────────────────────────────────────

const folios = parseTranscription();

// Collect ALL words with their decode status, folio, and section
const allWords = []; // { word, decoded, folio, section }

for (const [folio, lines] of Object.entries(folios)) {
  const section = getSection(folio);
  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      const decoded = decodeWord(clean);
      allWords.push({ word: clean, decoded, folio, section });
    }
  }
}

// Build unique word sets
const decodedWords = new Map(); // word -> { count, meaning, folios, sections }
const undecodedWords = new Map(); // word -> { count, folios, sections }

for (const { word, decoded, folio, section } of allWords) {
  if (decoded) {
    if (!decodedWords.has(word)) decodedWords.set(word, { count: 0, meaning: decoded, folios: new Set(), sections: new Set() });
    const e = decodedWords.get(word);
    e.count++; e.folios.add(folio); e.sections.add(section);
  } else {
    if (!undecodedWords.has(word)) undecodedWords.set(word, { count: 0, folios: new Set(), sections: new Set() });
    const e = undecodedWords.get(word);
    e.count++; e.folios.add(folio); e.sections.add(section);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 1: Initial glyph distribution comparison
// ═══════════════════════════════════════════════════════════════════════════════

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  O-PREFIX ANALYSIS — Systematic morphological marker investigation ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

function getInitialGlyph(w) {
  const stripped = stripGallows(w);
  const tokens = tokenizeEva(stripped);
  return tokens.length > 0 ? tokens[0] : null;
}

// Count initial glyphs for decoded and undecoded words (by unique type)
const decodedInitials = {};
const undecodedInitials = {};

for (const [word] of decodedWords) {
  const init = getInitialGlyph(word);
  if (init) decodedInitials[init] = (decodedInitials[init] || 0) + 1;
}
for (const [word] of undecodedWords) {
  const init = getInitialGlyph(word);
  if (init) undecodedInitials[init] = (undecodedInitials[init] || 0) + 1;
}

const totalDecodedTypes = Object.values(decodedInitials).reduce((a, b) => a + b, 0);
const totalUndecodedTypes = Object.values(undecodedInitials).reduce((a, b) => a + b, 0);

console.log("═".repeat(70));
console.log("PART 1: INITIAL GLYPH DISTRIBUTION (unique word types)");
console.log("═".repeat(70) + "\n");

const allInitials = new Set([...Object.keys(decodedInitials), ...Object.keys(undecodedInitials)]);
const sortedInitials = [...allInitials].sort((a, b) => {
  return ((undecodedInitials[b] || 0) + (decodedInitials[b] || 0)) - ((undecodedInitials[a] || 0) + (decodedInitials[a] || 0));
});

console.log("Initial  Decoded types  (%)       Undecoded types  (%)       Ratio");
console.log("─".repeat(70));
for (const init of sortedInitials) {
  const dc = decodedInitials[init] || 0;
  const uc = undecodedInitials[init] || 0;
  const dp = ((dc / totalDecodedTypes) * 100).toFixed(1);
  const up = ((uc / totalUndecodedTypes) * 100).toFixed(1);
  const ratio = dc > 0 ? (uc / dc).toFixed(2) : "inf";
  console.log(`${init.padEnd(9)}${String(dc).padStart(5)}   (${dp.padStart(5)}%)       ${String(uc).padStart(5)}   (${up.padStart(5)}%)       ${ratio}`);
}
console.log(`${"TOTAL".padEnd(9)}${String(totalDecodedTypes).padStart(5)}                 ${String(totalUndecodedTypes).padStart(5)}`);

// Token-level counts (frequency-weighted)
const decodedInitialsTokens = {};
const undecodedInitialsTokens = {};
for (const [word, info] of decodedWords) {
  const init = getInitialGlyph(word);
  if (init) decodedInitialsTokens[init] = (decodedInitialsTokens[init] || 0) + info.count;
}
for (const [word, info] of undecodedWords) {
  const init = getInitialGlyph(word);
  if (init) undecodedInitialsTokens[init] = (undecodedInitialsTokens[init] || 0) + info.count;
}
const totalDecodedTokens = Object.values(decodedInitialsTokens).reduce((a, b) => a + b, 0);
const totalUndecodedTokens = Object.values(undecodedInitialsTokens).reduce((a, b) => a + b, 0);

console.log("\n\nInitial glyph distribution (token frequency-weighted):");
console.log("─".repeat(70));
console.log("Initial  Decoded tokens (%)       Undecoded tokens (%)       Ratio");
console.log("─".repeat(70));
for (const init of sortedInitials.slice(0, 15)) {
  const dc = decodedInitialsTokens[init] || 0;
  const uc = undecodedInitialsTokens[init] || 0;
  const dp = ((dc / totalDecodedTokens) * 100).toFixed(1);
  const up = ((uc / totalUndecodedTokens) * 100).toFixed(1);
  const ratio = dc > 0 ? (uc / dc).toFixed(2) : "inf";
  console.log(`${init.padEnd(9)}${String(dc).padStart(6)}  (${dp.padStart(5)}%)       ${String(uc).padStart(6)}  (${up.padStart(5)}%)       ${ratio}`);
}
console.log(`${"TOTAL".padEnd(9)}${String(totalDecodedTokens).padStart(6)}                ${String(totalUndecodedTokens).padStart(6)}`);

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 2: O-stripped forms that decode through glossary
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("PART 2: O-STRIPPED FORMS THAT DECODE THROUGH GLOSSARY");
console.log("═".repeat(70) + "\n");

const oUndecodedWords = [...undecodedWords.entries()].filter(([w]) => {
  const init = getInitialGlyph(w);
  return init === "o";
});

let oStrippedDecodes = 0;
const oStrippedDecodesDetails = [];

for (const [word, info] of oUndecodedWords) {
  // Strip leading "o" from the gallows-stripped form
  const stripped = stripGallows(word);
  if (stripped.startsWith("o") && stripped.length > 1) {
    const remainder = stripped.slice(1);
    if (GLOSS[remainder]) {
      oStrippedDecodes++;
      oStrippedDecodesDetails.push({
        original: word,
        stripped: remainder,
        meaning: GLOSS[remainder],
        count: info.count,
        sections: [...info.sections],
      });
    }
  }
}

oStrippedDecodesDetails.sort((a, b) => b.count - a.count);

console.log(`O-prefixed undecoded words: ${oUndecodedWords.length} types`);
console.log(`O-stripped forms that decode: ${oStrippedDecodes} (${((oStrippedDecodes / oUndecodedWords.length) * 100).toFixed(1)}%)\n`);

if (oStrippedDecodesDetails.length > 0) {
  console.log("Word         -> Stripped  -> Meaning              Count  Sections");
  console.log("─".repeat(70));
  for (const d of oStrippedDecodesDetails.slice(0, 40)) {
    console.log(`${d.original.padEnd(13)} -> ${d.stripped.padEnd(10)} -> ${d.meaning.padEnd(21)} ${String(d.count).padStart(4)}   ${d.sections.join(",")}`);
  }
  if (oStrippedDecodesDetails.length > 40) {
    console.log(`  ... and ${oStrippedDecodesDetails.length - 40} more`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 2b: O-stripped forms that match OTHER undecoded words
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("PART 2b: O-STRIPPED FORMS THAT MATCH OTHER UNDECODED WORDS");
console.log("═".repeat(70) + "\n");

let oStrippedMatchesUndecoded = 0;
const oStrippedMatchDetails = [];

for (const [word, info] of oUndecodedWords) {
  const stripped = stripGallows(word);
  if (stripped.startsWith("o") && stripped.length > 1) {
    const remainder = stripped.slice(1);
    if (remainder.length >= 2 && undecodedWords.has(remainder)) {
      oStrippedMatchesUndecoded++;
      oStrippedMatchDetails.push({
        original: word,
        stripped: remainder,
        origCount: info.count,
        strippedCount: undecodedWords.get(remainder).count,
      });
    }
  }
}

oStrippedMatchDetails.sort((a, b) => (b.origCount + b.strippedCount) - (a.origCount + a.strippedCount));

console.log(`O-stripped forms matching other undecoded words: ${oStrippedMatchesUndecoded} (${((oStrippedMatchesUndecoded / oUndecodedWords.length) * 100).toFixed(1)}%)\n`);

if (oStrippedMatchDetails.length > 0) {
  console.log("o+X (count)    ->  X (count)");
  console.log("─".repeat(50));
  for (const d of oStrippedMatchDetails.slice(0, 30)) {
    console.log(`${d.original.padEnd(15)} (${String(d.origCount).padStart(3)})  ->  ${d.stripped.padEnd(15)} (${String(d.strippedCount).padStart(3)})`);
  }
  if (oStrippedMatchDetails.length > 30) {
    console.log(`  ... and ${oStrippedMatchDetails.length - 30} more`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 3: Hebrew article hypothesis
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("PART 3: HEBREW ARTICLE HYPOTHESIS (o = ha-)");
console.log("═".repeat(70) + "\n");

// For each o-prefixed undecoded word, compare:
// (a) full form phonetic vs Hebrew terms
// (b) o-stripped form phonetic vs Hebrew terms
// Use consonantal matching with Levenshtein distance

function bestHebrewMatch(evaWord, maxDist = 2) {
  const phonetic = evaPhonetic(evaWord);
  const consonants = stripVowels(phonetic);
  let best = null;
  let bestDist = Infinity;
  for (const term of HEBREW_TERMS) {
    const dist = levenshtein(consonants, term.consonants);
    if (dist < bestDist) {
      bestDist = dist;
      best = term;
    }
  }
  if (bestDist <= maxDist) return { term: best, dist: bestDist, phonetic, consonants };
  return null;
}

let fullFormMatches = 0;
let strippedFormMatches = 0;
let strippedBetterThanFull = 0;
const hebrewMatchDetails = [];

for (const [word, info] of oUndecodedWords) {
  const stripped = stripGallows(word);
  if (!stripped.startsWith("o") || stripped.length <= 1) continue;
  const remainder = stripped.slice(1);

  const fullMatch = bestHebrewMatch(stripped, 2);
  const strippedMatch = bestHebrewMatch(remainder, 2);

  if (fullMatch) fullFormMatches++;
  if (strippedMatch) strippedFormMatches++;
  if (strippedMatch && (!fullMatch || strippedMatch.dist < fullMatch.dist)) {
    strippedBetterThanFull++;
  }

  if (fullMatch || strippedMatch) {
    hebrewMatchDetails.push({
      word,
      stripped: remainder,
      fullMatch,
      strippedMatch,
      count: info.count,
      sections: [...info.sections],
    });
  }
}

// Compare to non-o-prefixed undecoded words
const nonOUndecoded = [...undecodedWords.entries()].filter(([w]) => {
  const init = getInitialGlyph(w);
  return init !== "o";
});

let nonOHebrewMatches = 0;
for (const [word] of nonOUndecoded) {
  const stripped = stripGallows(word);
  if (bestHebrewMatch(stripped, 2)) nonOHebrewMatches++;
}

console.log(`O-prefixed undecoded words:    ${oUndecodedWords.length}`);
console.log(`  Full form matches Hebrew:    ${fullFormMatches} (${((fullFormMatches / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`  O-stripped matches Hebrew:   ${strippedFormMatches} (${((strippedFormMatches / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`  Stripped better than full:   ${strippedBetterThanFull}`);
console.log(`\nNon-o-prefixed undecoded words: ${nonOUndecoded.length}`);
console.log(`  Match Hebrew terms:          ${nonOHebrewMatches} (${((nonOHebrewMatches / nonOUndecoded.length) * 100).toFixed(1)}%)`);

if (hebrewMatchDetails.length > 0) {
  console.log("\nBest Hebrew matches for o-prefixed words:");
  console.log("─".repeat(70));
  hebrewMatchDetails.sort((a, b) => {
    const aD = Math.min(a.fullMatch?.dist ?? 99, a.strippedMatch?.dist ?? 99);
    const bD = Math.min(b.fullMatch?.dist ?? 99, b.strippedMatch?.dist ?? 99);
    return aD - bD || b.count - a.count;
  });
  for (const d of hebrewMatchDetails.slice(0, 25)) {
    const fm = d.fullMatch ? `${d.fullMatch.term.hebrew}(${d.fullMatch.term.meaning}) d=${d.fullMatch.dist}` : "-";
    const sm = d.strippedMatch ? `${d.strippedMatch.term.hebrew}(${d.strippedMatch.term.meaning}) d=${d.strippedMatch.dist}` : "-";
    console.log(`${d.word.padEnd(15)} full: ${fm.substring(0, 35).padEnd(36)} stripped(${d.stripped}): ${sm.substring(0, 35)}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 4: Section distribution
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("PART 4: SECTION DISTRIBUTION OF O-PREFIXED WORDS");
console.log("═".repeat(70) + "\n");

// Count o-initial words by section for decoded and undecoded (token-level)
const sectionStats = {};
for (const { word, decoded, section } of allWords) {
  if (!sectionStats[section]) sectionStats[section] = { decodedTotal: 0, decodedO: 0, undecodedTotal: 0, undecodedO: 0 };
  const s = sectionStats[section];
  const init = getInitialGlyph(word);
  if (decoded) {
    s.decodedTotal++;
    if (init === "o") s.decodedO++;
  } else {
    s.undecodedTotal++;
    if (init === "o") s.undecodedO++;
  }
}

console.log("Section     Decoded: o/total (%)     Undecoded: o/total (%)     o-ratio undec/dec");
console.log("─".repeat(85));
for (const [section, s] of Object.entries(sectionStats).sort((a, b) => b[1].undecodedTotal - a[1].undecodedTotal)) {
  const dp = s.decodedTotal > 0 ? ((s.decodedO / s.decodedTotal) * 100).toFixed(1) : "0.0";
  const up = s.undecodedTotal > 0 ? ((s.undecodedO / s.undecodedTotal) * 100).toFixed(1) : "0.0";
  const ratio = (s.decodedTotal > 0 && s.decodedO > 0) ?
    ((s.undecodedO / s.undecodedTotal) / (s.decodedO / s.decodedTotal)).toFixed(2) : "N/A";
  console.log(`${section.padEnd(12)} ${String(s.decodedO).padStart(4)}/${String(s.decodedTotal).padStart(5)} (${dp.padStart(5)}%)     ${String(s.undecodedO).padStart(4)}/${String(s.undecodedTotal).padStart(5)} (${up.padStart(5)}%)     ${ratio}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 5: Could "o-" be a null prefix (like gallows)?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("PART 5: NULL PREFIX HYPOTHESIS — could 'o' be stripped like gallows?");
console.log("═".repeat(70) + "\n");

// For DECODED words starting with "o", check if they are o+known_root
const decodedOWords = [...decodedWords.entries()].filter(([w]) => getInitialGlyph(w) === "o");
let decodedOIsPrefix = 0;
const decodedOPrefixExamples = [];

for (const [word, info] of decodedOWords) {
  const stripped = stripGallows(word);
  if (stripped.startsWith("o") && stripped.length > 1) {
    const remainder = stripped.slice(1);
    if (GLOSS[remainder]) {
      decodedOIsPrefix++;
      decodedOPrefixExamples.push({
        full: word,
        fullMeaning: info.meaning,
        stripped: remainder,
        strippedMeaning: GLOSS[remainder],
      });
    }
  }
}

console.log(`Decoded words starting with 'o': ${decodedOWords.length} types`);
console.log(`Of those, o-stripped form ALSO in glossary: ${decodedOIsPrefix} (${((decodedOIsPrefix / decodedOWords.length) * 100).toFixed(1)}%)\n`);

if (decodedOPrefixExamples.length > 0) {
  console.log("These are decoded o+X pairs where X is also decoded:");
  console.log("─".repeat(70));
  decodedOPrefixExamples.sort((a, b) => a.full.localeCompare(b.full));
  for (const d of decodedOPrefixExamples.slice(0, 30)) {
    console.log(`  ${d.full.padEnd(13)} = ${d.fullMeaning.padEnd(18)}  |  ${d.stripped.padEnd(10)} = ${d.strippedMeaning}`);
  }
  if (decodedOPrefixExamples.length > 30) {
    console.log(`  ... and ${decodedOPrefixExamples.length - 30} more`);
  }
}

// Semantic analysis: for decoded o+X pairs, is there a pattern in the meanings?
console.log("\n\nSemantic pattern analysis of decoded o+X vs X pairs:");
console.log("─".repeat(70));
console.log("If 'o' = definite article, o+X should mean 'the X'.");
console.log("If 'o' = null, o+X and X should have unrelated meanings.\n");

for (const d of decodedOPrefixExamples.slice(0, 20)) {
  console.log(`  o+${d.stripped} (${d.fullMeaning}) vs ${d.stripped} (${d.strippedMeaning})`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANALYSIS 6: Summary statistics
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("SUMMARY STATISTICS");
console.log("═".repeat(70) + "\n");

const oDecodedPct = ((decodedInitials["o"] || 0) / totalDecodedTypes * 100).toFixed(1);
const oUndecodedPct = ((undecodedInitials["o"] || 0) / totalUndecodedTypes * 100).toFixed(1);

console.log(`Total decoded word types:           ${totalDecodedTypes}`);
console.log(`Total undecoded word types:          ${totalUndecodedTypes}`);
console.log(`\n% of decoded types starting 'o':     ${oDecodedPct}% (${decodedInitials["o"] || 0} words)`);
console.log(`% of undecoded types starting 'o':   ${oUndecodedPct}% (${undecodedInitials["o"] || 0} words)`);
console.log(`\nO-stripped undecoded -> decoded:      ${oStrippedDecodes} of ${oUndecodedWords.length} (${((oStrippedDecodes / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`O-stripped undecoded -> other undec:  ${oStrippedMatchesUndecoded} of ${oUndecodedWords.length} (${((oStrippedMatchesUndecoded / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`\nHebrew match rate (o-prefixed full):       ${fullFormMatches} of ${oUndecodedWords.length} (${((fullFormMatches / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`Hebrew match rate (o-stripped):            ${strippedFormMatches} of ${oUndecodedWords.length} (${((strippedFormMatches / oUndecodedWords.length) * 100).toFixed(1)}%)`);
console.log(`Hebrew match rate (non-o undecoded):       ${nonOHebrewMatches} of ${nonOUndecoded.length} (${((nonOHebrewMatches / nonOUndecoded.length) * 100).toFixed(1)}%)`);

// Top o-stripped forms by frequency
console.log("\n\nTop 20 most frequent o-prefixed undecoded words:");
console.log("─".repeat(60));
oUndecodedWords.sort((a, b) => b[1].count - a[1].count);
for (const [word, info] of oUndecodedWords.slice(0, 20)) {
  const stripped = stripGallows(word);
  const rem = stripped.startsWith("o") ? stripped.slice(1) : stripped;
  const glossHit = GLOSS[rem] ? `-> ${GLOSS[rem]}` : "";
  const undecodedHit = undecodedWords.has(rem) ? `[also undecoded x${undecodedWords.get(rem).count}]` : "";
  console.log(`  ${word.padEnd(15)} x${String(info.count).padStart(3)}  stripped: ${rem.padEnd(12)} ${glossHit} ${undecodedHit}   sections: ${[...info.sections].join(",")}`);
}

console.log("\n\n" + "═".repeat(70));
console.log("CONCLUSION");
console.log("═".repeat(70) + "\n");

const oRatio = parseFloat(oUndecodedPct) / parseFloat(oDecodedPct);
if (oRatio > 1.5) {
  console.log(`'o' is ${oRatio.toFixed(1)}x MORE common as initial glyph in undecoded vs decoded words.`);
  console.log("This suggests 'o' may function differently in undecoded contexts.");
} else if (oRatio < 0.7) {
  console.log(`'o' is ${(1/oRatio).toFixed(1)}x LESS common in undecoded vs decoded words.`);
  console.log("This argues AGAINST 'o' being a special undecoded-context marker.");
} else {
  console.log(`'o' appears at roughly similar rates in decoded (${oDecodedPct}%) and undecoded (${oUndecodedPct}%) words.`);
  console.log("The distribution alone does not strongly support a special marker hypothesis.");
}

if (oStrippedDecodes > oUndecodedWords.length * 0.15) {
  console.log(`\nStrong signal: ${((oStrippedDecodes / oUndecodedWords.length) * 100).toFixed(1)}% of o-prefixed undecoded words decode when 'o' is stripped.`);
  console.log("This supports 'o' as a productive prefix (article, null, or morphological marker).");
} else {
  console.log(`\nWeak signal: only ${((oStrippedDecodes / oUndecodedWords.length) * 100).toFixed(1)}% of o-prefixed undecoded words decode when 'o' is stripped.`);
}

if (strippedFormMatches > fullFormMatches) {
  console.log(`\nHebrew hypothesis supported: stripped forms match Hebrew better (${strippedFormMatches} vs ${fullFormMatches}).`);
} else {
  console.log(`\nHebrew hypothesis NOT supported: full forms match Hebrew equally or better (${fullFormMatches} vs ${strippedFormMatches}).`);
}
