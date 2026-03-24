#!/usr/bin/env node
/**
 * MULTILINGUAL ZODIAC LABEL ANALYSIS
 * Test every zodiac/astronomical label against comprehensive vocabulary in:
 * - Hebrew (multiple transliteration variants)
 * - Arabic (zodiac, months, planets, stars)
 * - Latin (zodiac, months, planets)
 * - Occitan (months, calendar terms)
 * - Decan names, star names, directional terms
 *
 * Goal: determine which language(s) the zodiac labels are written in
 * and improve the match rate beyond the current 41%.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── EVA phonetic ────────────────────────────────────────────────────────────

const DIGRAPHS = ["cth", "cph", "cfh", "ckh", "sh", "ch", "ii", "ee"];
function tokenize(s) {
  const t = []; let i = 0;
  s = s.replace(/[.<>%$\s]/g, "");
  while (i < s.length) {
    let m = false;
    for (const dg of DIGRAPHS) {
      if (s.startsWith(dg, i)) { t.push(dg); i += dg.length; m = true; break; }
    }
    if (!m) { t.push(s[i]); i++; }
  }
  return t;
}

function evaToPhonetic(eva) {
  return tokenize(eva).map(t => {
    if (t === "sh") return "SH";
    if (t === "ch") return "KH";
    if (t === "ee" || t === "ii") return "I";
    return t.toUpperCase();
  }).join("");
}

function stripVowels(s) { return s.replace(/[AEIOU]/g, ""); }

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(dp[i-1][j] + 1, dp[i][j-1] + 1, dp[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    }
  }
  return dp[m][n];
}

const SG = new Set(["cth", "ckh", "cph", "cfh"]);
function stripSG(w) { return tokenize(w).filter(t => !SG.has(t)).join(""); }
function decode(w) {
  if (GLOSS[w]) return GLOSS[w];
  const s = stripSG(w);
  if (s !== w && GLOSS[s]) return GLOSS[s];
  return null;
}

// ─── COMPREHENSIVE MULTILINGUAL ASTRONOMICAL VOCABULARY ──────────────────────

const VOCAB = [];

function add(term, phonetic, consonants, language, category, meaning, sign) {
  VOCAB.push({ term, phonetic: phonetic.toUpperCase(), consonants: consonants.toUpperCase(), language, category, meaning, sign: sign || null });
}

// === HEBREW — Zodiac signs (with transliteration variants) ===
// Each sign gets multiple plausible EVA-phonetic renderings
add("TALEH", "TALEH", "TLH", "hebrew", "zodiac", "Aries (Ram)", "aries");
add("TALEH", "TALE", "TL", "hebrew", "zodiac", "Aries (short)", "aries");
add("TALEH", "TALA", "TL", "hebrew", "zodiac", "Aries (a-variant)", "aries");
add("SHOR", "SHOR", "SHR", "hebrew", "zodiac", "Taurus (Bull)", "taurus");
add("SHOR", "SHUR", "SHR", "hebrew", "zodiac", "Taurus (u-variant)", "taurus");
add("SHOR", "SHORA", "SHR", "hebrew", "zodiac", "Taurus (with final-a)", "taurus");
add("TEOMIM", "TEOMIM", "TMYM", "hebrew", "zodiac", "Gemini (Twins)", "gemini");
add("TEOM", "TEOM", "TM", "hebrew", "zodiac", "Gemini (singular)", "gemini");
add("TEOM", "TOEM", "TM", "hebrew", "zodiac", "Gemini (o-variant)", "gemini");
add("TEOMIM", "TOMIM", "TMYM", "hebrew", "zodiac", "Gemini (o-variant pl)", "gemini");
add("SARTAN", "SARTAN", "SRTN", "hebrew", "zodiac", "Cancer (Crab)", "cancer");
add("SARTAN", "SARATON", "SRTN", "hebrew", "zodiac", "Cancer (long)", "cancer");
add("ARYEH", "ARYEH", "RYH", "hebrew", "zodiac", "Leo (Lion)", "leo");
add("ARYEH", "ARYE", "RY", "hebrew", "zodiac", "Leo (short)", "leo");
add("BETULAH", "BETULAH", "BTLH", "hebrew", "zodiac", "Virgo (Virgin)", "virgo");
add("BETULAH", "BETULA", "BTL", "hebrew", "zodiac", "Virgo (short)", "virgo");
add("MOZNAYIM", "MOZNAYIM", "MZNYM", "hebrew", "zodiac", "Libra (Scales)", "libra");
add("MOZNE", "MOZNE", "MZN", "hebrew", "zodiac", "Libra (construct)", "libra");
add("AQRAV", "AQRAV", "QRB", "hebrew", "zodiac", "Scorpio (Scorpion)", "scorpio");
add("AQRAV", "AKRAV", "KRB", "hebrew", "zodiac", "Scorpio (k-variant)", "scorpio");
add("QESHET", "QESHET", "QSHT", "hebrew", "zodiac", "Sagittarius (Bow)", "sagittarius");
add("QESHET", "KESHET", "KSHT", "hebrew", "zodiac", "Sagittarius (k-variant)", "sagittarius");
add("GEDI", "GEDI", "GDY", "hebrew", "zodiac", "Capricorn (Kid)", "capricorn");
add("GEDI", "GADY", "GDY", "hebrew", "zodiac", "Capricorn (a-variant)", "capricorn");
add("DELI", "DELI", "DLY", "hebrew", "zodiac", "Aquarius (Bucket)", "aquarius");
add("DELI", "DALI", "DLY", "hebrew", "zodiac", "Aquarius (a-variant)", "aquarius");
add("DAGIM", "DAGIM", "DGYM", "hebrew", "zodiac", "Pisces (Fish)", "pisces");
add("DAGIM", "DAGAM", "DGM", "hebrew", "zodiac", "Pisces (a-variant)", "pisces");
add("DAG", "DAG", "DG", "hebrew", "zodiac", "Pisces (singular)", "pisces");

// === HEBREW — Months ===
add("NISAN", "NISAN", "NYSN", "hebrew", "month", "month 1 (Mar/Apr)");
add("NISAN", "NIZAN", "NYZN", "hebrew", "month", "month 1 (z-variant)");
add("IYAR", "IYAR", "YYR", "hebrew", "month", "month 2 (Apr/May)");
add("IYAR", "IYAAR", "YR", "hebrew", "month", "month 2 (long)");
add("SIVAN", "SIVAN", "SYVN", "hebrew", "month", "month 3 (May/Jun)");
add("TAMMUZ", "TAMUZ", "TMVZ", "hebrew", "month", "month 4 (Jun/Jul)");
add("TAMMUZ", "TAMOZ", "TMZ", "hebrew", "month", "month 4 (short)");
add("AV", "AV", "V", "hebrew", "month", "month 5 (Jul/Aug)");
add("ELUL", "ELUL", "LVL", "hebrew", "month", "month 6 (Aug/Sep)");
add("TISHREI", "TISHRI", "TSHRY", "hebrew", "month", "month 7 (Sep/Oct)");
add("TISHREI", "TISHRE", "TSHR", "hebrew", "month", "month 7 (short)");
add("CHESHVAN", "KHESHVAN", "KHSHVN", "hebrew", "month", "month 8 (Oct/Nov)");
add("MARCHESHVAN", "MARKHESHVAN", "MRKHSHVN", "hebrew", "month", "month 8 (full)");
add("KISLEV", "KISLEV", "KSLV", "hebrew", "month", "month 9 (Nov/Dec)");
add("TEVET", "TEVET", "TVT", "hebrew", "month", "month 10 (Dec/Jan)");
add("TEVET", "TEBETH", "TBT", "hebrew", "month", "month 10 (th-variant)");
add("SHEVAT", "SHEVAT", "SHVT", "hebrew", "month", "month 11 (Jan/Feb)");
add("SHEVAT", "SHEBAT", "SHBT", "hebrew", "month", "month 11 (b-variant)");
add("ADAR", "ADAR", "DR", "hebrew", "month", "month 12 (Feb/Mar)");

// === HEBREW — Planets ===
add("CHAMAH", "KHAMAH", "KHMH", "hebrew", "planet", "Sun");
add("SHEMESH", "SHEMESH", "SHMSH", "hebrew", "planet", "Sun (biblical)");
add("LEVANAH", "LEVANAH", "LBNH", "hebrew", "planet", "Moon");
add("YAREACH", "YARAKH", "YRKH", "hebrew", "planet", "Moon (biblical)");
add("KOKHAV", "KOKHAV", "KVKHB", "hebrew", "planet", "Mercury/star");
add("NOGAH", "NOGAH", "NGH", "hebrew", "planet", "Venus");
add("MAADIM", "MAADIM", "MDYM", "hebrew", "planet", "Mars");
add("TZEDEK", "TSEDEK", "TSDQ", "hebrew", "planet", "Jupiter");
add("SHABTAI", "SHABTAI", "SHBTY", "hebrew", "planet", "Saturn");

// === HEBREW — Stars & astronomical ===
add("KIMAH", "KIMAH", "KYMH", "hebrew", "star", "Pleiades");
add("KESIL", "KESIL", "KSYL", "hebrew", "star", "Orion");
add("AYISH", "AYISH", "YSH", "hebrew", "star", "Ursa Major");
add("NACHASH", "NAKHASH", "NKHSH", "hebrew", "star", "Serpens/Draco");
add("MAZAL", "MAZAL", "MZL", "hebrew", "astro", "zodiac sign/fortune");
add("MAZZALOT", "MAZALOT", "MZLVT", "hebrew", "astro", "zodiac signs (pl.)");
add("GALGAL", "GALGAL", "GLGL", "hebrew", "astro", "sphere/wheel");
add("RAKIA", "RAKIA", "RQY", "hebrew", "astro", "firmament");
add("TELI", "TELI", "TLY", "hebrew", "astro", "celestial dragon/axis");
add("MAALAH", "MAALAH", "MLH", "hebrew", "astro", "degree");
add("BAYIT", "BAYIT", "BYT", "hebrew", "astro", "house (astrological)");
add("TEQUFAH", "TEQUFAH", "TQVPH", "hebrew", "astro", "equinox/season");
add("OLEH", "OLEH", "VLH", "hebrew", "astro", "ascendant");
add("MOLAD", "MOLAD", "MVLD", "hebrew", "astro", "new moon/nativity");
add("KOKHAV", "KOKHAV", "KVKHB", "hebrew", "astro", "star");
add("SHAMAYIM", "SHAMAYIM", "SHMYM", "hebrew", "astro", "heavens");
add("DAROM", "DAROM", "DRM", "hebrew", "direction", "south");
add("TZAFON", "TSAFON", "TSPVN", "hebrew", "direction", "north");
add("MIZRACH", "MIZRAKH", "MZRKH", "hebrew", "direction", "east");
add("MAARAV", "MAARAV", "MRV", "hebrew", "direction", "west");

// === ARABIC — Zodiac signs ===
add("AL-HAMAL", "ALHAMAL", "LHML", "arabic", "zodiac", "Aries (Ram)", "aries");
add("HAMAL", "HAMAL", "HML", "arabic", "zodiac", "Aries (no article)", "aries");
add("AL-THAWR", "ALTHAWR", "LTHVR", "arabic", "zodiac", "Taurus (Bull)", "taurus");
add("THAWR", "THAWR", "THVR", "arabic", "zodiac", "Taurus (no article)", "taurus");
add("AL-JAWZA", "ALJAWZA", "LJVZ", "arabic", "zodiac", "Gemini (Twins)", "gemini");
add("JAWZA", "JAWZA", "JVZ", "arabic", "zodiac", "Gemini (no article)", "gemini");
add("AL-SARATAN", "ALSARATAN", "LSRTN", "arabic", "zodiac", "Cancer (Crab)", "cancer");
add("SARATAN", "SARATAN", "SRTN", "arabic", "zodiac", "Cancer (no article)", "cancer");
add("AL-ASAD", "ALASAD", "LSD", "arabic", "zodiac", "Leo (Lion)", "leo");
add("ASAD", "ASAD", "SD", "arabic", "zodiac", "Leo (no article)", "leo");
add("AL-SUNBULAH", "ALSUNBULAH", "LSNBLH", "arabic", "zodiac", "Virgo (Wheat-ear)", "virgo");
add("AL-MIZAN", "ALMIZAN", "LMYZN", "arabic", "zodiac", "Libra (Balance)", "libra");
add("MIZAN", "MIZAN", "MYZN", "arabic", "zodiac", "Libra (no article)", "libra");
add("AL-AQRAB", "ALAQRAB", "LQRB", "arabic", "zodiac", "Scorpio (Scorpion)", "scorpio");
add("AQRAB", "AQRAB", "QRB", "arabic", "zodiac", "Scorpio (no article)", "scorpio");
add("AL-QAWS", "ALQAWS", "LQVS", "arabic", "zodiac", "Sagittarius (Bow)", "sagittarius");
add("QAWS", "QAWS", "QVS", "arabic", "zodiac", "Sagittarius (no article)", "sagittarius");
add("AL-JADY", "ALJADY", "LJDY", "arabic", "zodiac", "Capricorn (Kid)", "capricorn");
add("JADY", "JADY", "JDY", "arabic", "zodiac", "Capricorn (no article)", "capricorn");
add("AL-DALW", "ALDALW", "LDLV", "arabic", "zodiac", "Aquarius (Bucket)", "aquarius");
add("DALW", "DALW", "DLV", "arabic", "zodiac", "Aquarius (no article)", "aquarius");
add("AL-HUT", "ALHUT", "LHVT", "arabic", "zodiac", "Pisces (Fish)", "pisces");
add("HUT", "HUT", "HVT", "arabic", "zodiac", "Pisces (no article)", "pisces");

// === ARABIC — Months (Islamic calendar) ===
add("MUHARRAM", "MUHARRAM", "MHRM", "arabic", "month", "month 1");
add("SAFAR", "SAFAR", "SPR", "arabic", "month", "month 2");
add("RABI", "RABI", "RBY", "arabic", "month", "month 3/4");
add("JUMADA", "JUMADA", "JMD", "arabic", "month", "month 5/6");
add("RAJAB", "RAJAB", "RJB", "arabic", "month", "month 7");
add("SHABAN", "SHABAN", "SHBN", "arabic", "month", "month 8");
add("RAMADAN", "RAMADAN", "RMDN", "arabic", "month", "month 9");
add("SHAWWAL", "SHAWAL", "SHVL", "arabic", "month", "month 10");

// === ARABIC — Planets ===
add("SHAMS", "SHAMS", "SHMS", "arabic", "planet", "Sun");
add("QAMAR", "QAMAR", "QMR", "arabic", "planet", "Moon");
add("UTARID", "UTARID", "TRYD", "arabic", "planet", "Mercury");
add("ZUHRAH", "ZUHRAH", "ZHRH", "arabic", "planet", "Venus");
add("MIRRIKH", "MIRIKH", "MRKH", "arabic", "planet", "Mars");
add("MUSHTARI", "MUSHTARI", "MSHTRY", "arabic", "planet", "Jupiter");
add("ZUHAL", "ZUHAL", "ZHL", "arabic", "planet", "Saturn");

// === LATIN — Zodiac ===
add("ARIES", "ARIES", "RS", "latin", "zodiac", "Aries", "aries");
add("TAURUS", "TAURUS", "TRS", "latin", "zodiac", "Taurus", "taurus");
add("GEMINI", "GEMINI", "GMN", "latin", "zodiac", "Gemini", "gemini");
add("CANCER", "KANSER", "KNSR", "latin", "zodiac", "Cancer", "cancer");
add("LEO", "LEO", "L", "latin", "zodiac", "Leo", "leo");
add("VIRGO", "VIRGO", "VRG", "latin", "zodiac", "Virgo", "virgo");
add("LIBRA", "LIBRA", "LBR", "latin", "zodiac", "Libra", "libra");
add("SCORPIO", "SKORPIO", "SKRP", "latin", "zodiac", "Scorpio", "scorpio");
add("SAGITTARIUS", "SAGITARIUS", "SGTRS", "latin", "zodiac", "Sagittarius", "sagittarius");
add("CAPRICORNUS", "KAPRIKORN", "KPRKRN", "latin", "zodiac", "Capricorn", "capricorn");
add("AQUARIUS", "AKUARIUS", "KQRS", "latin", "zodiac", "Aquarius", "aquarius");
add("PISCES", "PISKES", "PSKS", "latin", "zodiac", "Pisces", "pisces");

// === LATIN — Months ===
add("JANUARIUS", "JANUARIUS", "JNRS", "latin", "month", "January");
add("FEBRUARIUS", "FEBRUARIUS", "FBRS", "latin", "month", "February");
add("MARTIUS", "MARTIUS", "MRTS", "latin", "month", "March");
add("APRILIS", "APRILIS", "PRLS", "latin", "month", "April");
add("MAIUS", "MAIUS", "MS", "latin", "month", "May");
add("JUNIUS", "JUNIUS", "JNS", "latin", "month", "June");
add("JULIUS", "JULIUS", "JLS", "latin", "month", "July");
add("AUGUSTUS", "AUGUSTUS", "GSTS", "latin", "month", "August");
add("SEPTEMBER", "SEPTEMBER", "SPTMBR", "latin", "month", "September");
add("OCTOBER", "OKTOBER", "KTBR", "latin", "month", "October");
add("NOVEMBER", "NOVEMBER", "NVMBR", "latin", "month", "November");
add("DECEMBER", "DESEMBER", "DSMBR", "latin", "month", "December");

// === LATIN — Planets ===
add("SOL", "SOL", "SL", "latin", "planet", "Sun");
add("LUNA", "LUNA", "LN", "latin", "planet", "Moon");
add("MERCURIUS", "MERKURIUS", "MRKRS", "latin", "planet", "Mercury");
add("VENUS", "VENUS", "VNS", "latin", "planet", "Venus");
add("MARS", "MARS", "MRS", "latin", "planet", "Mars");
add("JUPITER", "JUPITER", "JPTR", "latin", "planet", "Jupiter");
add("SATURNUS", "SATURNUS", "STRNS", "latin", "planet", "Saturn");

// === OCCITAN — Months (known to appear in the manuscript) ===
add("MARS", "MARS", "MRS", "occitan", "month", "March");
add("ABERIL", "ABERIL", "BRL", "occitan", "month", "April");
add("ABRIL", "ABRIL", "BRL", "occitan", "month", "April (variant)");
add("MAI", "MAI", "MY", "occitan", "month", "May");
add("JUNH", "JUNH", "JNH", "occitan", "month", "June");
add("JULH", "JULH", "JLH", "occitan", "month", "July");
add("AGOST", "AGOST", "GST", "occitan", "month", "August");
add("SETEMBRE", "SETEMBRE", "STMBR", "occitan", "month", "September");
add("OCTOBRE", "OCTOBRE", "KTBR", "occitan", "month", "October");
add("NOVEMBRE", "NOVEMBRE", "NVMBR", "occitan", "month", "November");
add("DEZEMBRE", "DEZEMBRE", "DZMBR", "occitan", "month", "December");
add("GENIER", "GENIER", "GNR", "occitan", "month", "January");
add("FEBRIER", "FEBRIER", "FBRR", "occitan", "month", "February");

// === ASTRONOMICAL — General terms in multiple languages ===
add("STELLA", "STELLA", "STL", "latin", "astro", "star");
add("CAELUM", "KAELUM", "KLM", "latin", "astro", "sky/heaven");
add("ORBIS", "ORBIS", "RBS", "latin", "astro", "orbit/sphere");
add("GRADUS", "GRADUS", "GRDS", "latin", "astro", "degree");
add("DOMUS", "DOMUS", "DMS", "latin", "astro", "house (astrological)");
add("ASCENDENS", "ASKENDENS", "SKNDS", "latin", "astro", "ascendant");
add("NAJM", "NAJM", "NJM", "arabic", "astro", "star");
add("FALAK", "FALAK", "PLK", "arabic", "astro", "celestial sphere");
add("BURJ", "BURJ", "BRJ", "arabic", "astro", "zodiac sign/tower");
add("DARAJAH", "DARAJAH", "DRJH", "arabic", "astro", "degree");

console.log(`Vocabulary loaded: ${VOCAB.length} terms across ${new Set(VOCAB.map(v => v.language)).size} languages\n`);

// ─── Parse zodiac labels ─────────────────────────────────────────────────────

const raw = readFileSync(EVA_PATH, "utf-8");
const labelWords = []; // { eva, phonetic, consonants, folio, lineType }
const proseWords = [];

// Zodiac page assignments (best estimates from illustrations)
const FOLIO_SIGNS = {
  "f70v1": ["aries"], "f70v2": ["aries"],
  "f71r": ["taurus"], "f71v": ["taurus", "gemini"],
  "f72r1": ["cancer"], "f72r2": ["cancer", "leo"], "f72r3": ["leo"],
  "f72v1": ["leo", "virgo"], "f72v2": ["virgo"], "f72v3": ["virgo", "libra"],
  "f73r": ["libra", "scorpio"],
  "f73v": ["sagittarius", "capricorn", "aquarius", "pisces"],
};

for (const line of raw.split("\n")) {
  const cm = line.match(/^<(f\d+[rv]\d?)\.(\d+),([^>]+)>\s+(.+)/);
  if (!cm) continue;
  const folio = cm[1];
  const lineNum = cm[2];
  const lineType = cm[3].trim();
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  if (num < 67 || num > 73) continue;

  const isLabel = /[LR]/.test(lineType) && !/^[CP]/.test(lineType);
  const text = cm[4].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
  const words = text.split(/\.+/).map(w => w.trim()).filter(w => w.length > 0);

  for (const w of words) {
    const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
    if (!clean || clean.length < 2) continue;
    const phonetic = evaToPhonetic(clean);
    const consonants = stripVowels(phonetic);
    const entry = { eva: clean, phonetic, consonants, folio, lineType, decoded: decode(clean) };

    if (isLabel) labelWords.push(entry);
    else proseWords.push(entry);
  }
}

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  MULTILINGUAL ZODIAC LABEL ANALYSIS                                ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log(`Label words: ${labelWords.length} (${labelWords.filter(w => !w.decoded).length} undecoded)`);
console.log(`Prose words: ${proseWords.length} (${proseWords.filter(w => !w.decoded).length} undecoded)\n`);

// ─── Match each undecoded label against full vocabulary ──────────────────────

const MAX_DIST = 2;
const matches = [];

for (const lw of labelWords) {
  if (lw.decoded) continue; // skip already decoded
  if (lw.consonants.length < 2) continue;

  for (const v of VOCAB) {
    // Consonantal distance
    const dist = levenshtein(lw.consonants, v.consonants);
    if (dist > MAX_DIST) continue;
    if (dist === 0 && lw.consonants.length < 2) continue;
    if (dist === 1 && lw.consonants.length < 3) continue;
    if (dist === 2 && lw.consonants.length < 4) continue;

    // Check if this is on the correct zodiac page
    const folioSigns = FOLIO_SIGNS[lw.folio] || [];
    const correctPage = v.sign ? folioSigns.includes(v.sign) : false;

    matches.push({
      eva: lw.eva,
      phonetic: lw.phonetic,
      consonants: lw.consonants,
      folio: lw.folio,
      vocabTerm: v.term,
      vocabPhonetic: v.phonetic,
      vocabConsonants: v.consonants,
      language: v.language,
      category: v.category,
      meaning: v.meaning,
      sign: v.sign,
      distance: dist,
      correctPage,
    });
  }
}

// ─── ANALYSIS 1: Best matches by distance ────────────────────────────────────

console.log("═".repeat(70));
console.log("EXACT MATCHES (distance = 0)");
console.log("═".repeat(70) + "\n");

const exact = matches.filter(m => m.distance === 0);
exact.sort((a, b) => a.folio.localeCompare(b.folio));

for (const m of exact) {
  const cp = m.correctPage ? " ★CORRECT PAGE" : m.sign ? " (wrong page)" : "";
  console.log(`  ${m.folio.padEnd(8)} EVA: ${m.eva.padEnd(16)} cons=${m.consonants.padEnd(8)} → ${m.language.padEnd(8)} ${m.vocabTerm.padEnd(16)} = ${m.meaning}${cp}`);
}

console.log(`\nTotal exact: ${exact.length}`);

// ─── ANALYSIS 2: Close matches (distance = 1) ───────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("CLOSE MATCHES (distance = 1)");
console.log("═".repeat(70) + "\n");

const close = matches.filter(m => m.distance === 1);
close.sort((a, b) => a.folio.localeCompare(b.folio) || a.eva.localeCompare(b.eva));

// Group by EVA word, show best match per word
const byEva = {};
for (const m of close) {
  const key = m.folio + "|" + m.eva;
  if (!byEva[key]) byEva[key] = [];
  byEva[key].push(m);
}

for (const [key, ms] of Object.entries(byEva)) {
  // Prefer correct-page matches, then by language priority (hebrew > arabic > latin > occitan)
  const langOrder = { hebrew: 0, arabic: 1, latin: 2, occitan: 3 };
  ms.sort((a, b) => (b.correctPage ? 1 : 0) - (a.correctPage ? 1 : 0) || langOrder[a.language] - langOrder[b.language]);
  const best = ms[0];
  const altLangs = [...new Set(ms.map(m => m.language))].join("/");
  const cp = best.correctPage ? " ★CORRECT" : best.sign ? "" : "";
  console.log(`  ${best.folio.padEnd(8)} EVA: ${best.eva.padEnd(16)} cons=${best.consonants.padEnd(8)} → ${best.language.padEnd(8)} ${best.vocabTerm.padEnd(16)} = ${best.meaning}${cp}  [also: ${altLangs}]`);
}

// ─── ANALYSIS 3: Language distribution ───────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("LANGUAGE DISTRIBUTION OF MATCHES");
console.log("═".repeat(70) + "\n");

for (const maxDist of [0, 1, 2]) {
  const filtered = matches.filter(m => m.distance <= maxDist);
  const byLang = {};
  for (const m of filtered) {
    if (!byLang[m.language]) byLang[m.language] = new Set();
    byLang[m.language].add(m.folio + "|" + m.eva);
  }

  console.log(`Distance ≤ ${maxDist}:`);
  for (const [lang, words] of Object.entries(byLang).sort((a, b) => b[1].size - a[1].size)) {
    console.log(`  ${lang.padEnd(10)} ${words.size} unique word matches`);
  }
  console.log();
}

// ─── ANALYSIS 4: Category distribution ───────────────────────────────────────

console.log("═".repeat(70));
console.log("CATEGORY DISTRIBUTION (distance ≤ 1)");
console.log("═".repeat(70) + "\n");

const d1 = matches.filter(m => m.distance <= 1);
const byCat = {};
for (const m of d1) {
  const key = m.language + "/" + m.category;
  if (!byCat[key]) byCat[key] = new Set();
  byCat[key].add(m.folio + "|" + m.eva);
}

for (const [cat, words] of Object.entries(byCat).sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  ${cat.padEnd(22)} ${words.size} matches`);
}

// ─── ANALYSIS 5: Correct-page zodiac matches ────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("ZODIAC SIGN MATCHES ON CORRECT PAGES");
console.log("═".repeat(70) + "\n");

const zodiacMatches = matches.filter(m => m.category === "zodiac" && m.distance <= 1);
const correctMatches = zodiacMatches.filter(m => m.correctPage);
const incorrectMatches = zodiacMatches.filter(m => m.sign && !m.correctPage);

console.log(`Zodiac sign matches (dist ≤ 1): ${zodiacMatches.length}`);
console.log(`  On correct page: ${correctMatches.length}`);
console.log(`  On wrong page:   ${incorrectMatches.length}`);
if (correctMatches.length + incorrectMatches.length > 0) {
  const accuracy = (correctMatches.length / (correctMatches.length + incorrectMatches.length) * 100).toFixed(1);
  console.log(`  Accuracy: ${accuracy}%`);
}

console.log("\nCorrect-page matches:");
for (const m of correctMatches.sort((a, b) => a.folio.localeCompare(b.folio))) {
  console.log(`  ★ ${m.folio.padEnd(8)} EVA: ${m.eva.padEnd(16)} → ${m.language.padEnd(8)} ${m.vocabTerm.padEnd(16)} = ${m.meaning} (dist=${m.distance})`);
}

// ─── ANALYSIS 6: Per-folio breakdown ─────────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("PER-FOLIO SUMMARY");
console.log("═".repeat(70) + "\n");

const folios = [...new Set(labelWords.map(w => w.folio))].sort();
for (const f of folios) {
  const fWords = labelWords.filter(w => w.folio === f);
  const fUndecoded = fWords.filter(w => !w.decoded);
  const fMatches = matches.filter(m => m.folio === f && m.distance <= 1);
  const fExact = fMatches.filter(m => m.distance === 0);
  const expectedSigns = FOLIO_SIGNS[f]?.join("/") || "unassigned";

  // Best language for this folio
  const langCounts = {};
  for (const m of fMatches) langCounts[m.language] = (langCounts[m.language] || 0) + 1;
  const bestLang = Object.entries(langCounts).sort((a, b) => b[1] - a[1])[0];

  console.log(`  ${f.padEnd(8)} ${String(fWords.length).padStart(3)} labels, ${String(fUndecoded.length).padStart(3)} undecoded, ${String(fExact.length).padStart(2)} exact, ${String(fMatches.length).padStart(3)} close  expected: ${expectedSigns.padEnd(20)} best lang: ${bestLang ? bestLang[0] + " (" + bestLang[1] + ")" : "—"}`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("SUMMARY");
console.log("═".repeat(70) + "\n");

const totalUndecoded = labelWords.filter(w => !w.decoded).length;
const totalExact = exact.length;
const totalD1 = new Set(d1.map(m => m.folio + "|" + m.eva)).size;

console.log(`Vocabulary: ${VOCAB.length} terms in ${[...new Set(VOCAB.map(v => v.language))].join(", ")}`);
console.log(`Undecoded label words tested: ${totalUndecoded}`);
console.log(`Exact matches (dist=0): ${totalExact}`);
console.log(`Close matches (dist≤1): ${totalD1} unique words`);

// Language winner
const allD1 = matches.filter(m => m.distance <= 1);
const langTotals = {};
for (const m of allD1) langTotals[m.language] = (langTotals[m.language] || 0) + 1;
const sorted = Object.entries(langTotals).sort((a, b) => b[1] - a[1]);
console.log(`\nDominant language in labels: ${sorted[0]?.[0] || "none"} (${sorted[0]?.[1] || 0} matches)`);
for (const [lang, count] of sorted) {
  console.log(`  ${lang.padEnd(10)} ${count} matches`);
}
