#!/usr/bin/env node
/**
 * HEBREW TRANSLITERATION DECODER
 * Hypothesis: The undecoded 14% contains Hebrew/Aramaic terms written as
 * direct EVA transliterations, bypassing the Latin cipher entirely.
 *
 * Three attack vectors:
 * 1. Expanded Hebrew vocabulary (astronomical, pharmaceutical, Kabbalistic)
 * 2. Shem Tov's 739-entry synonym database
 * 3. Section-specific analysis (where does Hebrew cluster?)
 *
 * The key insight: if the author was a Jewish practitioner, Hebrew terms
 * would appear as transliterations in the sections closest to the author's
 * native knowledge domain — astronomy, Kabbalah, and ritual practice.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");
const ENTRIES_PATH = join(__dirname, "shem-tov", "shimmush-entries.json");

// ─── EVA phonetic conversion ─────────────────────────────────────────────────

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
  return tokenizeEva(eva).map(t => {
    if (t === "sh") return "SH";
    if (t === "ch") return "KH";
    if (t === "ee" || t === "ii") return "I";
    return t.toUpperCase();
  }).join("");
}

function stripVowels(s) { return s.replace(/[AEIOU]/g, ""); }

function levenshtein(a, b) {
  const m = a.length, n = b.length;
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

// ─── EXPANDED HEBREW VOCABULARY ──────────────────────────────────────────────
// Everything that might appear as a transliteration in the Voynich

const HEBREW_EXPANDED = [
  // === KABBALISTIC TERMS (Zohar, Bahir, Sefer Yetzirah) ===
  // Sefirot
  { term: "KETER", consonants: "KTR", meaning: "Crown (1st sefirah)", category: "kabbalah" },
  { term: "CHOKHMAH", consonants: "KHKMH", meaning: "Wisdom (2nd sefirah)", category: "kabbalah" },
  { term: "BINAH", consonants: "BNH", meaning: "Understanding (3rd sefirah)", category: "kabbalah" },
  { term: "CHESED", consonants: "KHSD", meaning: "Mercy/Lovingkindness (4th sefirah)", category: "kabbalah" },
  { term: "GEVURAH", consonants: "GVRH", meaning: "Strength/Judgment (5th sefirah)", category: "kabbalah" },
  { term: "DIN", consonants: "DYN", meaning: "Judgment (alt. 5th sefirah)", category: "kabbalah" },
  { term: "TIFERET", consonants: "TPRT", meaning: "Beauty (6th sefirah)", category: "kabbalah" },
  { term: "NETZACH", consonants: "NTSKH", meaning: "Victory/Eternity (7th sefirah)", category: "kabbalah" },
  { term: "HOD", consonants: "HVD", meaning: "Glory/Splendor (8th sefirah)", category: "kabbalah" },
  { term: "YESOD", consonants: "YSVD", meaning: "Foundation (9th sefirah)", category: "kabbalah" },
  { term: "MALKHUT", consonants: "MLKHVT", meaning: "Kingdom (10th sefirah)", category: "kabbalah" },
  { term: "SHEKHINAH", consonants: "SHKNYH", meaning: "Divine Presence (feminine)", category: "kabbalah" },

  // Kabbalistic concepts
  { term: "SEFIRAH", consonants: "SPRH", meaning: "emanation/counting", category: "kabbalah" },
  { term: "SEFIROT", consonants: "SPRVT", meaning: "emanations (pl.)", category: "kabbalah" },
  { term: "EIN SOF", consonants: "YN SVP", meaning: "Without End (Infinite)", category: "kabbalah" },
  { term: "OR", consonants: "VR", meaning: "Light", category: "kabbalah" },
  { term: "OROT", consonants: "VRVT", meaning: "Lights (pl.)", category: "kabbalah" },
  { term: "SHEFA", consonants: "SHP", meaning: "divine abundance/flow", category: "kabbalah" },
  { term: "TZIMTZUM", consonants: "TSMTSWM", meaning: "contraction/withdrawal", category: "kabbalah" },
  { term: "TIKKUN", consonants: "TQVN", meaning: "repair/rectification", category: "kabbalah" },
  { term: "KELIPAH", consonants: "QLPH", meaning: "shell/husk (evil)", category: "kabbalah" },
  { term: "KELIPOT", consonants: "QLPVT", meaning: "shells/husks (pl.)", category: "kabbalah" },
  { term: "NITZOTZ", consonants: "NYTWTS", meaning: "spark (divine)", category: "kabbalah" },
  { term: "NESHAMAH", consonants: "NSHMH", meaning: "soul (highest level)", category: "kabbalah" },
  { term: "NEFESH", consonants: "NPSH", meaning: "soul (lowest level)", category: "kabbalah" },
  { term: "RUACH", consonants: "RVKH", meaning: "spirit (middle level)", category: "kabbalah" },
  { term: "ILAN", consonants: "YLN", meaning: "tree (sefirotic)", category: "kabbalah" },
  { term: "ILANOT", consonants: "YLNVT", meaning: "trees/diagrams (pl.)", category: "kabbalah" },
  { term: "TZINNOR", consonants: "TSYNVR", meaning: "pipe/channel (divine)", category: "kabbalah" },
  { term: "TZINNOROT", consonants: "TSYNVRVT", meaning: "pipes/channels (pl.)", category: "kabbalah" },
  { term: "MIKVEH", consonants: "MQVH", meaning: "ritual bath", category: "kabbalah" },
  { term: "MIKVAH", consonants: "MQVH", meaning: "ritual bath (alt.)", category: "kabbalah" },
  { term: "TEVILAH", consonants: "TBYLH", meaning: "immersion", category: "kabbalah" },
  { term: "TAHARAH", consonants: "THRH", meaning: "ritual purity", category: "kabbalah" },
  { term: "TUMAH", consonants: "TMH", meaning: "ritual impurity", category: "kabbalah" },
  { term: "KEDUSHAH", consonants: "QDVSH", meaning: "holiness/sanctification", category: "kabbalah" },
  { term: "KAVVANAH", consonants: "KVNH", meaning: "intention/meditation", category: "kabbalah" },
  { term: "DEVEKUT", consonants: "DBQVT", meaning: "cleaving to God", category: "kabbalah" },
  { term: "KARET", consonants: "KRT", meaning: "spiritual excision/death", category: "kabbalah" },
  { term: "OLAM", consonants: "VLM", meaning: "world/eternity", category: "kabbalah" },
  { term: "OLAMOT", consonants: "VLMVT", meaning: "worlds (4 worlds)", category: "kabbalah" },
  { term: "ATZILUT", consonants: "TSYLVT", meaning: "Emanation (highest world)", category: "kabbalah" },
  { term: "BERIAH", consonants: "BRYH", meaning: "Creation (2nd world)", category: "kabbalah" },
  { term: "YETZIRAH", consonants: "YTSYRH", meaning: "Formation (3rd world)", category: "kabbalah" },
  { term: "ASIYAH", consonants: "SYYH", meaning: "Action (4th world)", category: "kabbalah" },
  { term: "ADAM QADMON", consonants: "DM QDMVN", meaning: "Primordial Man", category: "kabbalah" },
  { term: "PARTZUF", consonants: "PRTSVP", meaning: "divine countenance", category: "kabbalah" },
  { term: "RESHIT", consonants: "RSHYT", meaning: "beginning", category: "kabbalah" },
  { term: "CHOKHMAT HA-TZERUF", consonants: "KHKMT HTSRVP", meaning: "letter permutation science", category: "kabbalah" },
  { term: "GILGUL", consonants: "GLGVL", meaning: "transmigration/reincarnation", category: "kabbalah" },
  { term: "ZIVUG", consonants: "ZYVG", meaning: "sacred union/coupling", category: "kabbalah" },
  { term: "YICHUD", consonants: "YKHVD", meaning: "unification", category: "kabbalah" },
  { term: "SITRA ACHRA", consonants: "SYTR KHR", meaning: "the Other Side (evil)", category: "kabbalah" },
  { term: "RACHAMIM", consonants: "RKHMYM", meaning: "compassion/mercy", category: "kabbalah" },

  // Bahir-specific
  { term: "BAHIR", consonants: "BHYR", meaning: "brightness (the Bahir)", category: "kabbalah" },
  { term: "TOHU", consonants: "THV", meaning: "chaos/formlessness", category: "kabbalah" },
  { term: "BOHU", consonants: "BHV", meaning: "void/emptiness", category: "kabbalah" },

  // Zohar-specific
  { term: "ZOHAR", consonants: "ZHR", meaning: "splendor/radiance", category: "kabbalah" },
  { term: "IDRA", consonants: "YDR", meaning: "assembly (Zohar section)", category: "kabbalah" },
  { term: "RAZA", consonants: "RZ", meaning: "mystery/secret", category: "kabbalah" },
  { term: "RAZIN", consonants: "RZYN", meaning: "mysteries (pl.)", category: "kabbalah" },
  { term: "SITREI TORAH", consonants: "STRY TVRH", meaning: "secrets of Torah", category: "kabbalah" },
  { term: "MATRONITA", consonants: "MTRNYT", meaning: "Matron (Shekhinah title)", category: "kabbalah" },

  // Sefer Yetzirah
  { term: "YETZIRAH", consonants: "YTSYRH", meaning: "formation", category: "kabbalah" },
  { term: "OTIYOT", consonants: "VTYVT", meaning: "letters (of creation)", category: "kabbalah" },
  { term: "TELI", consonants: "TLY", meaning: "celestial dragon/axis", category: "kabbalah" },
  { term: "GALGAL", consonants: "GLGL", meaning: "sphere/wheel", category: "kabbalah" },
  { term: "LEV", consonants: "LB", meaning: "heart (32 paths)", category: "kabbalah" },

  // === ZODIAC (already tested, included for completeness) ===
  { term: "TALEH", consonants: "TLH", meaning: "Aries (Ram)", category: "zodiac" },
  { term: "SHOR", consonants: "SHR", meaning: "Taurus (Bull)", category: "zodiac" },
  { term: "TEOMIM", consonants: "TMYM", meaning: "Gemini (Twins)", category: "zodiac" },
  { term: "TEOM", consonants: "TM", meaning: "Twin (singular)", category: "zodiac" },
  { term: "SARTAN", consonants: "SRTN", meaning: "Cancer (Crab)", category: "zodiac" },
  { term: "ARYEH", consonants: "RYH", meaning: "Leo (Lion)", category: "zodiac" },
  { term: "BETULAH", consonants: "BTLH", meaning: "Virgo (Virgin)", category: "zodiac" },
  { term: "MOZNAYIM", consonants: "MZNYM", meaning: "Libra (Scales)", category: "zodiac" },
  { term: "AQRAV", consonants: "QRB", meaning: "Scorpio (Scorpion)", category: "zodiac" },
  { term: "QESHET", consonants: "QSHT", meaning: "Sagittarius (Bow)", category: "zodiac" },
  { term: "GEDI", consonants: "GDY", meaning: "Capricorn (Kid)", category: "zodiac" },
  { term: "DELI", consonants: "DLY", meaning: "Aquarius (Bucket)", category: "zodiac" },
  { term: "DAGIM", consonants: "DGYM", meaning: "Pisces (Fish)", category: "zodiac" },
  { term: "MAZAL", consonants: "MZL", meaning: "zodiac sign/fortune", category: "zodiac" },

  // === PLANETS ===
  { term: "CHAMAH", consonants: "KHMH", meaning: "Sun", category: "planet" },
  { term: "SHEMESH", consonants: "SHMSH", meaning: "Sun (biblical)", category: "planet" },
  { term: "LEVANAH", consonants: "LBNH", meaning: "Moon", category: "planet" },
  { term: "YAREACH", consonants: "YRKH", meaning: "Moon (biblical)", category: "planet" },
  { term: "KOKHAV", consonants: "KVKHB", meaning: "Mercury/star", category: "planet" },
  { term: "NOGAH", consonants: "NGH", meaning: "Venus", category: "planet" },
  { term: "MAADIM", consonants: "MDYM", meaning: "Mars", category: "planet" },
  { term: "TZEDEK", consonants: "TSDQ", meaning: "Jupiter", category: "planet" },
  { term: "SHABTAI", consonants: "SHBTY", meaning: "Saturn", category: "planet" },

  // === MONTHS ===
  { term: "NISAN", consonants: "NYSN", meaning: "month 1 (Mar/Apr)", category: "month" },
  { term: "IYAR", consonants: "YYR", meaning: "month 2 (Apr/May)", category: "month" },
  { term: "SIVAN", consonants: "SYVN", meaning: "month 3 (May/Jun)", category: "month" },
  { term: "TAMMUZ", consonants: "TMVZ", meaning: "month 4 (Jun/Jul)", category: "month" },
  { term: "AV", consonants: "B", meaning: "month 5 (Jul/Aug)", category: "month" },
  { term: "ELUL", consonants: "LVL", meaning: "month 6 (Aug/Sep)", category: "month" },
  { term: "TISHREI", consonants: "TSHRY", meaning: "month 7 (Sep/Oct)", category: "month" },
  { term: "CHESHVAN", consonants: "KHSHVN", meaning: "month 8 (Oct/Nov)", category: "month" },
  { term: "KISLEV", consonants: "KSLV", meaning: "month 9 (Nov/Dec)", category: "month" },
  { term: "TEVET", consonants: "TBT", meaning: "month 10 (Dec/Jan)", category: "month" },
  { term: "SHEVAT", consonants: "SHBT", meaning: "month 11 (Jan/Feb)", category: "month" },
  { term: "ADAR", consonants: "DR", meaning: "month 12 (Feb/Mar)", category: "month" },

  // === RITUAL / RELIGIOUS ===
  { term: "SHALOM", consonants: "SHLVM", meaning: "peace/wholeness", category: "religious" },
  { term: "BERAKHAH", consonants: "BRKHH", meaning: "blessing", category: "religious" },
  { term: "BERAKHOT", consonants: "BRKHVT", meaning: "blessings (pl.)", category: "religious" },
  { term: "TEFILLAH", consonants: "TPLH", meaning: "prayer", category: "religious" },
  { term: "SEGULAH", consonants: "SGLH", meaning: "remedy/charm/virtue", category: "religious" },
  { term: "SEGULOT", consonants: "SGLVT", meaning: "remedies/charms (pl.)", category: "religious" },
  { term: "QETORET", consonants: "QTRT", meaning: "incense offering", category: "religious" },
  { term: "KORBAN", consonants: "QRBN", meaning: "offering/sacrifice", category: "religious" },
  { term: "SHABBAT", consonants: "SHBT", meaning: "Sabbath", category: "religious" },
  { term: "SHOMERET", consonants: "SHMRT", meaning: "female guardian (mikveh)", category: "religious" },
  { term: "NIDDAH", consonants: "NDH", meaning: "menstrual impurity", category: "religious" },
  { term: "HALAKHAH", consonants: "HLKHH", meaning: "Jewish law", category: "religious" },
  { term: "ISSUR", consonants: "YSR", meaning: "prohibition", category: "religious" },
  { term: "HETER", consonants: "HTR", meaning: "permission", category: "religious" },
  { term: "MUTAR", consonants: "MVTR", meaning: "permitted", category: "religious" },
  { term: "ASUR", consonants: "SVR", meaning: "forbidden", category: "religious" },
  { term: "TAMEI", consonants: "TMY", meaning: "impure", category: "religious" },
  { term: "TAHOR", consonants: "THR", meaning: "pure", category: "religious" },
  { term: "QADOSH", consonants: "QDVSH", meaning: "holy", category: "religious" },

  // === STARS / ASTRONOMICAL ===
  { term: "KOKHAV", consonants: "KVKHB", meaning: "star", category: "astro" },
  { term: "KOKHAVIM", consonants: "KVKHBYM", meaning: "stars (pl.)", category: "astro" },
  { term: "GALGAL", consonants: "GLGL", meaning: "sphere/orb", category: "astro" },
  { term: "RAKIA", consonants: "RQY", meaning: "firmament", category: "astro" },
  { term: "SHAMAYIM", consonants: "SHMYM", meaning: "heavens", category: "astro" },
  { term: "MAALAH", consonants: "MLH", meaning: "degree (astro)", category: "astro" },
  { term: "MAALOT", consonants: "MLVT", meaning: "degrees (pl.)", category: "astro" },
  { term: "BAYIT", consonants: "BYT", meaning: "house (astrological)", category: "astro" },
  { term: "OLEH", consonants: "VLH", meaning: "ascendant", category: "astro" },
  { term: "MOLAD", consonants: "MVLD", meaning: "horoscope/nativity", category: "astro" },
  { term: "TEQUFAH", consonants: "TQVPH", meaning: "equinox/season", category: "astro" },
  { term: "TEQUFOT", consonants: "TQVPVT", meaning: "equinoxes (pl.)", category: "astro" },
  { term: "MISHPAT", consonants: "MSHPT", meaning: "judgment/ruling", category: "astro" },
  { term: "SHEELAH", consonants: "SHLH", meaning: "interrogation", category: "astro" },
  { term: "KIMAH", consonants: "KYMH", meaning: "Pleiades", category: "astro" },
  { term: "KESIL", consonants: "KSYL", meaning: "Orion", category: "astro" },
  { term: "NACHASH", consonants: "NKHSH", meaning: "Serpens/Draco", category: "astro" },
  { term: "TELI", consonants: "TLY", meaning: "celestial dragon (Sefer Yetzirah)", category: "astro" },

  // === PHARMACEUTICAL (Hebrew) ===
  { term: "SHEMEN", consonants: "SHMN", meaning: "oil", category: "pharma" },
  { term: "MISHCHAH", consonants: "MSHKHH", meaning: "ointment/anointing oil", category: "pharma" },
  { term: "REFUAH", consonants: "RPH", meaning: "medicine/remedy", category: "pharma" },
  { term: "TERUFAH", consonants: "TRPH", meaning: "remedy/cure", category: "pharma" },
  { term: "SAM", consonants: "SM", meaning: "drug/substance", category: "pharma" },
  { term: "SAMMIM", consonants: "SMYM", meaning: "drugs (pl.)", category: "pharma" },
  { term: "BOSEM", consonants: "BSM", meaning: "spice/perfume", category: "pharma" },
  { term: "BESAMIM", consonants: "BSMYM", meaning: "spices (pl.)", category: "pharma" },
  { term: "MIRQACHAT", consonants: "MRQKHT", meaning: "compound mixture", category: "pharma" },
  { term: "ROQEACH", consonants: "RVQKH", meaning: "apothecary", category: "pharma" },
  { term: "MELACH", consonants: "MLKH", meaning: "salt", category: "pharma" },
  { term: "DEVASH", consonants: "DBSH", meaning: "honey", category: "pharma" },
  { term: "YAYIN", consonants: "YYN", meaning: "wine", category: "pharma" },
  { term: "TSEMER", consonants: "TSMR", meaning: "wool", category: "pharma" },
  { term: "VERED", consonants: "VRD", meaning: "rose", category: "pharma" },
  { term: "MOR", consonants: "MVR", meaning: "myrrh", category: "pharma" },
  { term: "LEVONAH", consonants: "LBVNH", meaning: "frankincense", category: "pharma" },
  { term: "QINNAMON", consonants: "QNMVN", meaning: "cinnamon", category: "pharma" },
  { term: "KARKOM", consonants: "KRKVM", meaning: "saffron", category: "pharma" },

  // === COMMON HEBREW WORDS ===
  { term: "EMET", consonants: "MT", meaning: "truth", category: "common" },
  { term: "CHAIM", consonants: "KHYM", meaning: "life", category: "common" },
  { term: "MAVET", consonants: "MVT", meaning: "death", category: "common" },
  { term: "MAYIM", consonants: "MYM", meaning: "water", category: "common" },
  { term: "ESH", consonants: "SH", meaning: "fire", category: "common" },
  { term: "AVIR", consonants: "VYR", meaning: "air", category: "common" },
  { term: "ADAMAH", consonants: "DMH", meaning: "earth/soil", category: "common" },
  { term: "ELOHIM", consonants: "LHYM", meaning: "God", category: "common" },
  { term: "ADONAI", consonants: "DVNY", meaning: "my Lord", category: "common" },
  { term: "TORAH", consonants: "TVRH", meaning: "teaching/law", category: "common" },
  { term: "ISRAEL", consonants: "YSRL", meaning: "Israel", category: "common" },
  { term: "BARUKH", consonants: "BRVKH", meaning: "blessed", category: "common" },
  { term: "QAISAR", consonants: "QYSR", meaning: "Caesar/emperor", category: "common" },
  { term: "MASHAL", consonants: "MSHL", meaning: "parable/proverb", category: "common" },
  { term: "NISTAR", consonants: "NSTR", meaning: "hidden/secret", category: "common" },
  { term: "GALUI", consonants: "GLVY", meaning: "revealed/open", category: "common" },
  { term: "CHOKHMA", consonants: "KHKMH", meaning: "wisdom", category: "common" },
  { term: "DAAT", consonants: "DT", meaning: "knowledge", category: "common" },
  { term: "RATZON", consonants: "RTSVN", meaning: "will/desire", category: "common" },
  { term: "TESHUVAH", consonants: "TSHVVH", meaning: "repentance/return", category: "common" },
  { term: "GEULAH", consonants: "GVLH", meaning: "redemption", category: "common" },
];

// ─── Load Shem Tov entries ───────────────────────────────────────────────────

let shemTovTerms = [];
try {
  const rawData = JSON.parse(readFileSync(ENTRIES_PATH, "utf-8"));
  const all = [...(rawData.shimmush_list1 || []), ...(rawData.sefer_almansur || []), ...(rawData.bos_hajek_oxford || []), ...(rawData.arabic_romance_vatican || [])];
  // Extract Hebrew terms with consonants
  for (const entry of all) {
    if (entry.hebrew && entry.hebrew.length >= 3) {
      const heb = entry.hebrew.toUpperCase().replace(/[^A-Z ]/g, "");
      const cons = heb.replace(/[AEIOU ]/g, "");
      if (cons.length >= 2) {
        shemTovTerms.push({
          term: heb,
          consonants: cons,
          meaning: entry.english || entry.botanical || entry.hebrew,
          category: "shem_tov",
        });
      }
    }
  }
} catch(e) { /* skip if not available */ }

const ALL_HEBREW = [...HEBREW_EXPANDED, ...shemTovTerms];

// ─── Parse transcription ─────────────────────────────────────────────────────

function parseTranscription() {
  const raw = readFileSync(EVA_PATH, "utf-8");
  const lines = raw.split("\n");
  const folios = {};
  for (const line of lines) {
    if (line.startsWith("#") || !line.trim()) continue;
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

// ─── Classify folios by section ──────────────────────────────────────────────

function getSection(folio) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  const rv = folio.includes("v") ? "v" : "r";
  if (num <= 57) return "herbal";
  if (num <= 67) return "astro";
  if (num <= 73) return "zodiac";
  if (num <= 84) return "biological";
  if (num <= 86) return "cosmo";
  if (num <= 102) return "pharma";
  return "recipe";
}

// ─── Collect undecoded words by section ──────────────────────────────────────

const folios = parseTranscription();
const undecodedBySection = {};
const allUndecoded = {};

for (const [folio, lines] of Object.entries(folios)) {
  const section = getSection(folio);
  if (!undecodedBySection[section]) undecodedBySection[section] = {};

  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      if (decodeWord(clean)) continue;
      if (!undecodedBySection[section][clean]) undecodedBySection[section][clean] = { count: 0, folios: new Set() };
      undecodedBySection[section][clean].count++;
      undecodedBySection[section][clean].folios.add(folio);
      if (!allUndecoded[clean]) allUndecoded[clean] = { count: 0, folios: new Set(), section };
      allUndecoded[clean].count++;
      allUndecoded[clean].folios.add(folio);
    }
  }
}

// ─── MATCHING ENGINE ─────────────────────────────────────────────────────────

function matchHebrew(undecodedMap, minConsonants = 3) {
  const matches = [];
  const seen = new Set();

  for (const [eva, info] of Object.entries(undecodedMap)) {
    if (eva.length < 3) continue;
    const phonetic = evaToPhonetic(eva);
    const evaConsonants = stripVowels(phonetic);

    for (const heb of ALL_HEBREW) {
      const key = eva + "|" + heb.term;
      if (seen.has(key)) continue;

      // Exact phonetic
      if (phonetic === heb.term) {
        seen.add(key);
        matches.push({ eva, phonetic, evaConsonants, hebrew: heb.term, hebrewConsonants: heb.consonants, meaning: heb.meaning, category: heb.category, quality: "EXACT_PHONETIC", distance: 0, count: info.count, folios: [...info.folios] });
      }
      // Exact consonantal (min length)
      else if (evaConsonants.length >= minConsonants && evaConsonants === heb.consonants) {
        seen.add(key);
        matches.push({ eva, phonetic, evaConsonants, hebrew: heb.term, hebrewConsonants: heb.consonants, meaning: heb.meaning, category: heb.category, quality: "EXACT_CONSONANTS", distance: 0, count: info.count, folios: [...info.folios] });
      }
      // Close consonantal (distance 1, min 4 consonants)
      else if (evaConsonants.length >= 4 && heb.consonants.length >= 4 && levenshtein(evaConsonants, heb.consonants) === 1) {
        seen.add(key);
        matches.push({ eva, phonetic, evaConsonants, hebrew: heb.term, hebrewConsonants: heb.consonants, meaning: heb.meaning, category: heb.category, quality: "CLOSE_CONSONANTS", distance: 1, count: info.count, folios: [...info.folios] });
      }
    }
  }

  return matches.sort((a, b) => {
    const qo = { EXACT_PHONETIC: 0, EXACT_CONSONANTS: 1, CLOSE_CONSONANTS: 2 };
    return qo[a.quality] - qo[b.quality] || b.count - a.count;
  });
}

// ─── RUN ANALYSIS ────────────────────────────────────────────────────────────

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  HEBREW TRANSLITERATION DECODER                                    ║");
console.log("║  Cracking the undecoded 14% with expanded Hebrew vocabulary        ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log(`Hebrew vocabulary: ${HEBREW_EXPANDED.length} curated + ${shemTovTerms.length} from Shem Tov = ${ALL_HEBREW.length} total`);
console.log(`Undecoded words:   ${Object.keys(allUndecoded).length} unique forms\n`);

// Section-by-section analysis
const sections = ["zodiac", "astro", "cosmo", "biological", "herbal", "pharma", "recipe"];

console.log("═".repeat(70));
console.log("UNDECODED WORD COUNTS BY SECTION");
console.log("═".repeat(70) + "\n");

for (const sec of sections) {
  const words = undecodedBySection[sec] || {};
  const uniqueCount = Object.keys(words).length;
  const totalCount = Object.values(words).reduce((s, w) => s + w.count, 0);
  console.log(`  ${sec.padEnd(12)} ${String(uniqueCount).padStart(5)} unique, ${String(totalCount).padStart(6)} total tokens`);
}

// Run matching per section — focus on high-undecoded sections
console.log("\n\n" + "═".repeat(70));
console.log("SECTION-BY-SECTION HEBREW MATCHES");
console.log("═".repeat(70));

for (const sec of sections) {
  const words = undecodedBySection[sec];
  if (!words || Object.keys(words).length === 0) continue;

  const matches = matchHebrew(words);
  const exact = matches.filter(m => m.quality !== "CLOSE_CONSONANTS");
  const close = matches.filter(m => m.quality === "CLOSE_CONSONANTS");

  console.log(`\n─── ${sec.toUpperCase()} ─── (${exact.length} exact, ${close.length} close)\n`);

  // Show exact matches
  for (const m of exact.slice(0, 20)) {
    console.log(`  ${m.quality === "EXACT_PHONETIC" ? "★" : "●"} EVA: ${m.eva.padEnd(16)} ${m.phonetic.padEnd(14)} → ${m.hebrew.padEnd(14)} = ${m.meaning}`);
    console.log(`    ${" ".repeat(4)}[${m.category}]  ${m.folios.slice(0, 4).join(",")}  (${m.count}×)\n`);
  }

  // Show Kabbalistic matches separately
  const kabbMatches = matches.filter(m => m.category === "kabbalah");
  if (kabbMatches.length > 0) {
    console.log(`  KABBALISTIC TERMS IN ${sec.toUpperCase()} (${kabbMatches.length} matches):`);
    for (const m of kabbMatches.slice(0, 15)) {
      console.log(`    ${m.quality.padEnd(18)} EVA: ${m.eva.padEnd(16)} → ${m.hebrew.padEnd(14)} = ${m.meaning}`);
    }
    console.log();
  }
}

// ─── KABBALISTIC DEEP DIVE — BIOLOGICAL SECTION ─────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("KABBALISTIC DEEP DIVE — BIOLOGICAL SECTION (f75–f84)");
console.log("Do sefirotic/ritual terms cluster in the bathing/pipe section?");
console.log("═".repeat(70) + "\n");

const bioWords = undecodedBySection["biological"] || {};
const bioMatches = matchHebrew(bioWords, 3);
const bioKabb = bioMatches.filter(m => m.category === "kabbalah" || m.category === "religious");

console.log(`Kabbalistic/religious matches in biological section: ${bioKabb.length}\n`);
for (const m of bioKabb) {
  const q = m.quality === "EXACT_PHONETIC" ? "★EXACT" : m.quality === "EXACT_CONSONANTS" ? "●EXACT_C" : "○CLOSE";
  console.log(`  ${q.padEnd(10)} EVA: ${m.eva.padEnd(16)} → ${m.hebrew.padEnd(16)} = ${m.meaning}`);
  console.log(`  ${" ".repeat(10)} consonants: ${m.evaConsonants} vs ${m.hebrewConsonants}  folios: ${m.folios.join(",")}\n`);
}

// Compare kabbalistic match density across sections
console.log("\nKabbalistic/religious term density by section:\n");
for (const sec of sections) {
  const words = undecodedBySection[sec];
  if (!words) continue;
  const matches = matchHebrew(words, 3);
  const kabb = matches.filter(m => m.category === "kabbalah" || m.category === "religious");
  const totalUndecoded = Object.keys(words).length;
  const density = totalUndecoded > 0 ? (kabb.length / totalUndecoded * 100).toFixed(1) : "0";
  const bar = "█".repeat(Math.round(kabb.length / 3));
  console.log(`  ${sec.padEnd(12)} ${String(kabb.length).padStart(4)} matches / ${String(totalUndecoded).padStart(5)} undecoded = ${density.padStart(5)}%  ${bar}`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

const totalMatches = matchHebrew(allUndecoded, 3);
const totalExact = totalMatches.filter(m => m.quality !== "CLOSE_CONSONANTS");
const totalKabb = totalMatches.filter(m => m.category === "kabbalah");
const totalRelig = totalMatches.filter(m => m.category === "religious");
const totalAstro = totalMatches.filter(m => m.category === "zodiac" || m.category === "planet" || m.category === "month" || m.category === "astro");

console.log("\n\n" + "═".repeat(70));
console.log("SUMMARY");
console.log("═".repeat(70) + "\n");

console.log(`Total Hebrew vocabulary tested: ${ALL_HEBREW.length} terms`);
console.log(`Total matches found:           ${totalMatches.length}`);
console.log(`  Exact (phonetic+consonants): ${totalExact.length}`);
console.log(`  Close (distance 1):          ${totalMatches.length - totalExact.length}`);
console.log(`\nBy category:`);
console.log(`  Kabbalistic:    ${totalKabb.length}`);
console.log(`  Religious:      ${totalRelig.length}`);
console.log(`  Astronomical:   ${totalAstro.length}`);
console.log(`  Shem Tov:       ${totalMatches.filter(m => m.category === "shem_tov").length}`);
console.log(`  Pharmaceutical: ${totalMatches.filter(m => m.category === "pharma").length}`);
console.log(`  Common Hebrew:  ${totalMatches.filter(m => m.category === "common").length}\n`);
