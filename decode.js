#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * VOYNICH MANUSCRIPT DECODER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Standalone decoder for the Voynich Manuscript (Beinecke MS 408).
 *
 * This script applies a glossary-based decipherment to the full EVA
 * transcription of the manuscript. The cipher system works as follows:
 *
 *   1. The Voynich script encodes Latin text using a verbose homophonic
 *      substitution cipher, where each Latin word maps to one or more
 *      EVA (Extensible Voynich Alphabet) token sequences.
 *
 *   2. EVA text is first tokenized into digraph units (ch, sh, ii, ee,
 *      and the gallows characters cth, ckh, cph, cfh).
 *
 *   3. Gallows characters (cth, ckh, cph, cfh) serve as null padding —
 *      decorative elements that do not carry meaning. They are stripped
 *      before lookup when the raw word is not found in the glossary.
 *
 *   4. A glossary of ~3,700 EVA→Latin/Occitan/Hebrew mappings is used for decoding.
 *      Each EVA word is looked up directly, then with gallows stripped.
 *
 * Usage:
 *   node decode.js              — Decode full manuscript with stats
 *   node decode.js f1v          — Decode a specific folio
 *   node decode.js --help       — Show this help
 *
 * Requirements:
 *   - Node.js 18+ (uses ES modules)
 *   - EVA transcription at tools/eva-data/eva_takahashi.txt
 *   - Glossary at tools/glossary-export.js
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./tools/glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ═══════════════════════════════════════════════════════════════════════════
// EVA TOKENIZER
// Breaks raw EVA strings into glyph tokens, handling multi-char digraphs.
// Order matters: match longest sequences first.
// ═══════════════════════════════════════════════════════════════════════════

const EVA_DIGRAPHS = ["cth", "cph", "cfh", "ckh", "sh", "ch", "ii", "ee"];

function tokenizeEva(evaStr) {
  const tokens = [];
  let i = 0;
  const s = evaStr.replace(/[.<>%$\s]/g, "");
  while (i < s.length) {
    let matched = false;
    for (const dg of EVA_DIGRAPHS) {
      if (s.startsWith(dg, i)) {
        tokens.push(dg);
        i += dg.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      tokens.push(s[i]);
      i++;
    }
  }
  return tokens;
}

// ═══════════════════════════════════════════════════════════════════════════
// GALLOWS STRIPPING
// Gallows characters are ornamental nulls. Removing them often reveals
// the underlying word that maps to a glossary entry.
// ═══════════════════════════════════════════════════════════════════════════

const GALLOWS = new Set(["cth", "ckh", "cph", "cfh"]);

function stripGallows(evaWord) {
  const tokens = tokenizeEva(evaWord);
  return tokens.filter(t => !GALLOWS.has(t)).join("");
}

// ═══════════════════════════════════════════════════════════════════════════
// DECODER
// Attempts to decode an EVA word:
//   1. Direct glossary lookup (raw EVA word)
//   2. Gallows-stripped lookup (remove null padding, then look up)
// Returns the Latin translation or null if not found.
// ═══════════════════════════════════════════════════════════════════════════

function decodeWord(evaWord) {
  // Clean markup characters
  const clean = evaWord.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!clean) return null;

  // 1. Direct lookup
  if (GLOSS[clean]) return GLOSS[clean];

  // 2. Strip gallows and retry
  const stripped = stripGallows(clean);
  if (stripped !== clean && GLOSS[stripped]) return GLOSS[stripped];

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSCRIPTION PARSER
// Reads the Takahashi EVA transcription file and extracts folio lines
// with their text content. Handles the IVTFF format conventions.
// ═══════════════════════════════════════════════════════════════════════════

// Voynich manuscript section classification based on folio ranges
// $I codes: T=text, H=herbal, C=cosmological, Z=zodiac, B=biological,
//           P=pharmaceutical, S=stars/recipes
function classifyFolio(folioId) {
  const num = parseInt(folioId.replace(/[^0-9]/g, ""));
  if (num <= 56) return "Herbal";
  if (num <= 57) return "Herbal-B";
  if (num >= 58 && num <= 66) return "Cosmological";
  if (num >= 67 && num <= 73) return "Zodiac";
  if (num >= 75 && num <= 84) return "Biological";
  if (num >= 85 && num <= 86) return "Biological-B";
  if (num >= 87 && num <= 102) return "Pharmaceutical";
  if (num >= 103 && num <= 116) return "Stars/Recipes";
  return "Unknown";
}

function parseTranscription(filePath) {
  const raw = readFileSync(filePath, "utf-8");
  const lines = raw.split("\n");
  const folios = {};       // folioId → array of { lineId, words[] }
  let currentFolio = null;

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith("#") || !line.trim()) continue;

    // Folio header line: <f1r>  <! ...>
    const folioHeader = line.match(/^<(f\d+[rv]\d?)>\s+<!/);
    if (folioHeader) {
      currentFolio = folioHeader[1];
      if (!folios[currentFolio]) folios[currentFolio] = [];
      continue;
    }

    // Content line: <f1r.1,@P0>  text...
    const contentMatch = line.match(/^<(f\d+[rv]\d?)\.(\d+),[^>]+>\s+(.+)/);
    if (contentMatch) {
      const folio = contentMatch[1];
      const lineNum = contentMatch[2];
      let text = contentMatch[3];
      currentFolio = folio;
      if (!folios[folio]) folios[folio] = [];

      // Clean up IVTFF markup
      text = text.replace(/<%>/g, "");          // paragraph markers
      text = text.replace(/<\$>/g, "");          // end of paragraph
      text = text.replace(/<->/g, ".");          // inter-column separator → word break
      text = text.replace(/<[^>]*>/g, "");       // any remaining tags
      text = text.replace(/\{[^}]*\}/g, "");     // editorial comments
      text = text.trim();

      // Split into EVA words (period-separated)
      const words = text.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);

      if (words.length > 0) {
        folios[folio].push({ lineId: `${folio}.${lineNum}`, words });
      }
    }
  }

  return folios;
}

// ═══════════════════════════════════════════════════════════════════════════
// LATIN → ENGLISH MINI-DICTIONARY
// Covers the most frequent Latin words found in the decoded text.
// These are common medieval Latin botanical/medical terms.
// ═══════════════════════════════════════════════════════════════════════════

const LATIN_TO_ENGLISH = {
  "BASILICUM": "basil",
  "BORAGO": "borage",
  "MANDRAGORA": "mandrake",
  "JACEA": "knapweed",
  "VERBENA": "vervain",
  "ARUM": "arum/cuckoo-pint",
  "PAEONIA": "peony",
  "SENECIO": "groundsel",
  "OLEUM": "oil",
  "DAT": "gives",
  "DEUS": "God",
  "HEUS": "behold!",
  "FUIT": "was/has been",
  "DIES": "day",
  "ALIUS": "other/another",
  "HABET": "has/holds",
  "DICERE": "to say/tell",
  "DEDIT": "gave/has given",
  "GERAT": "bears/carries",
  "NOCET": "harms/hurts",
  "ES": "you are",
  "OR": "or",
  "AC": "and",
  "BEN": "well",
  "SED": "but",
  "SIC": "thus/so",
  "CUM": "with",
  "BONUS": "good",
  "LUCIS": "of light",
  "ODORATUS": "fragrant",
  "ALBA": "white",
  "HIC": "this/here",
  "ACUTUS": "sharp/pointed",
  "GRADU": "step/degree",
  "TERTIO": "third",
  "SCABIE": "scabies/itch",
  "CORTICE": "bark/rind",
  "DIEM": "day (acc.)",
  "DEUM": "God (acc.)",
  "DOLOR": "pain/sorrow",
  "ARIETE": "ram (Aries)",
  "DICIT": "says/tells",
  "AMARA": "bitter",
  "AD": "to/toward",
  "DES": "you give",
  "HEC": "these things",
  "AL": "other",
  "LAEDIT": "injures",
  "GRATIA": "grace/favor",
  "DEO": "God (dat./abl.)",
  "LUX": "light",
  "OPTAT": "wishes/desires",
  "NOCIS": "you harm",
  "NOCES": "you harm",
  "DIS": "to the gods",
  "HIS": "these (abl.)",
  "DEA": "goddess",
  "HABE": "have! (imper.)",
  "GENS": "people/nation",
  "FACIS": "you make/do",
  "FACIT": "makes/does",
  "NON": "not",
  "SUMMA": "sum/highest",
  "LAUDAT": "praises",
  "LIMA": "file/polish",
  "HERBA": "herb/plant",
  "HORAM": "hour (acc.)",
  "REM": "thing (acc.)",
  "NOTAM": "mark/sign",
  "SAT": "enough",
  "TEUS": "your",
  "DARE": "to give",
  "HUIUS": "of this",
  "LAUR": "laurel",
  "DECOR": "beauty/grace",
  "DECUS": "honor/glory",
  "DATUS": "given",
  "FLOS": "flower",
  "HORTUS": "garden",
  "DOSIS": "dose/portion",
  "GARUM": "fish sauce",
  "FILUM": "thread",
  "SERUM": "serum/whey",
  "FUMUM": "smoke",
  "NOVUM": "new",
  "NOMEN": "name",
  "TARTARUM": "tartar",
  "FIDES": "faith/trust",
  "FAR": "spelt/grain",
  "RORIS": "dew (gen.)",
  "ROTA": "wheel",
  "ARS": "art/skill",
  "VINUM": "wine",
  "GENUS": "kind/type",
  "FORMA": "form/shape",
  "FLORA": "flora/flowers",
  "RECIPE": "take! (imper.)",
  "SEMEN": "seed",
  "HORA": "hour",
  "SAL": "salt",
  "MEUS": "my/mine",
  "MEIS": "my (abl. pl.)",
  "FOCUM": "hearth/fire",
  "LAETUS": "happy/fertile",
  "LANA": "wool",
  "LAUDIS": "of praise",
  "LAETIS": "happy (abl. pl.)",
  "LOCUS": "place",
  "NOCERAT": "had harmed",
  "FOCES": "you make (subj.)",
  "FACITIS": "you (pl.) make",
  "ET": "and",
  "NOCETIS": "you (pl.) harm",
  "FAMA": "fame/rumor",
  "SAIN": "healthy",
  "BAIN": "bath",
  "AN": "whether/or",
  "AM": "love",
  "CALE": "be warm",
  "AURUM": "gold",
  "NO": "not/swim",
  "NOR": "nor",
  "NOS": "we/us",
  "FORS": "chance",
  "ERAT": "was",
  "EIUS": "his/her/its",
  "ALTUS": "high/deep",
  "ALOE": "aloe",
  "SANC": "holy",
  "SALSUS": "salty",
  "THUS": "incense",
  "BOLUS": "clay/bolus",
  "ANNUS": "year",
  "LAVAR": "to wash",
  "FEL": "gall/bile",
  "NODUS": "knot",
  "RENUM": "of kidneys",
  "SANUM": "healthy",
  "SEVUM": "tallow/fat",
  "CERA": "wax",
  "LEO": "lion (Leo)",
  "LAUS": "praise",
  "LAR": "hearth/home",
  "FRAN": "free",
  "RAMUS": "branch",
  "RARO": "rarely",
  "NOCUM": "harmful",
  "DICAT": "may say",
  "NOCATUS": "harmed",
  "FOCARAT": "had kindled",
  "FACERE": "to make/do",
  "NOCERE": "to harm",
  "HIBIS": "you drink",
  "LO": "there",
  "RES": "thing/matter",
  "DANS": "giving",
  "QUAT": "four",
  "QUAM": "how much/than",
  "QUALE": "what kind",
  "QUARE": "why/wherefore",
  "QUALIS": "of what kind",
  "QUANTUM": "how much",
  "QUAS": "which (acc. pl.)",
  "QUOS": "whom (acc. pl.)",
  "QUIS": "who?",
  "QUIES": "rest/quiet",
  "HABES": "you have",
  "TAL": "such",
  "SOL": "sun",
  "SEX": "six",
  "TERRA": "earth",
  "TRES": "three",
  "DUO": "two",
  "VER": "spring",
  "VETUS": "old",
  "BINUS": "twofold",
  "AURAT": "golden",
  "SATUR": "full/sated",
  "ALBUM": "white",
  "SANAT": "heals",
  "SITUR": "placed",
  "NOCHS": "?",
  "FOCERAT": "had made",
};

// ═══════════════════════════════════════════════════════════════════════════
// OUTPUT FORMATTING
// Pretty-printing for terminal output
// ═══════════════════════════════════════════════════════════════════════════

const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const CYAN = "\x1b[36m";
const RED = "\x1b[31m";
const MAGENTA = "\x1b[35m";
const BLUE = "\x1b[34m";
const RESET = "\x1b[0m";
const UNDERLINE = "\x1b[4m";

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE CLASSIFICATION
// Classify each decoded word as Latin, Hebrew, or Occitan
// ═══════════════════════════════════════════════════════════════════════════

const HEBREW_WORDS = new Set([
  "SHALOM", "ADAR", "GEDI", "QAISAR", "ILAN", "TELI", "TAHOR", "TAMEI",
  "TEOM", "DELI",
]);

const OCCITAN_WORDS = new Set([
  "OR", "LAIN", "BAIN", "SAIN", "TAIN", "FRAN", "LOR", "AL", "LAS",
  "NOCAN", "FOCAN", "NOCAR", "FOCAR", "ODAR", "SARE", "HABE",
  "AN", "BEN", "DES", "HEC", "HIS", "AC", "las", "ALS",
  "LAVAR", "BAIR", "FAIR", "LAIR", "GARUM", "AIRAT",
]);

function classifyLanguage(word) {
  if (!word || word.startsWith("[")) return "undecoded";
  if (HEBREW_WORDS.has(word)) return "hebrew";
  if (OCCITAN_WORDS.has(word)) return "occitan";
  return "latin";
}

function colorByLanguage(word) {
  const lang = classifyLanguage(word);
  if (lang === "hebrew") return `${MAGENTA}${word}${RESET}`;
  if (lang === "occitan") return `${BLUE}${word}${RESET}`;
  if (lang === "undecoded") return `${DIM}${word}${RESET}`;
  return `${YELLOW}${word}${RESET}`; // latin
}

function bar(fraction, width = 30) {
  const filled = Math.round(fraction * width);
  const empty = width - filled;
  const color = fraction >= 0.6 ? GREEN : fraction >= 0.35 ? YELLOW : RED;
  return color + "\u2588".repeat(filled) + DIM + "\u2591".repeat(empty) + RESET;
}

function pct(n, d) {
  return d === 0 ? "0.0%" : (100 * n / d).toFixed(1) + "%";
}

function latinToEnglish(latinStr) {
  const words = latinStr.split(/\s+/);
  const english = words.map(w => {
    const upper = w.toUpperCase();
    return LATIN_TO_ENGLISH[upper] || w.toLowerCase();
  });
  return english.join(" ");
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DECODE PIPELINE
// ═══════════════════════════════════════════════════════════════════════════

function decodeFolios(folios, targetFolio = null) {
  const sectionStats = {};
  const allDecodedLines = [];
  let totalWords = 0;
  let totalDecoded = 0;

  const folioKeys = targetFolio
    ? Object.keys(folios).filter(k => k === targetFolio)
    : Object.keys(folios);

  if (targetFolio && folioKeys.length === 0) {
    console.error(`\n${RED}Error: Folio "${targetFolio}" not found in transcription.${RESET}`);
    console.error(`Available folios include: ${Object.keys(folios).slice(0, 20).join(", ")}, ...`);
    process.exit(1);
  }

  for (const folioId of folioKeys) {
    const section = classifyFolio(folioId);
    if (!sectionStats[section]) {
      sectionStats[section] = { total: 0, decoded: 0, folios: 0 };
    }
    sectionStats[section].folios++;

    const lines = folios[folioId];
    for (const line of lines) {
      const decodedWords = [];
      let lineDecoded = 0;
      let lineTotal = 0;

      for (const word of line.words) {
        // Skip very short noise (single chars that are markup artifacts)
        const clean = word.replace(/[?*!]/g, "").trim();
        if (!clean || clean.length === 0) continue;

        lineTotal++;
        totalWords++;

        const latin = decodeWord(clean);
        if (latin) {
          decodedWords.push(latin);
          lineDecoded++;
          totalDecoded++;
          sectionStats[section].decoded++;
        } else {
          decodedWords.push(`[${clean}]`);
        }
        sectionStats[section].total++;
      }

      // Track lines with 4+ decoded words (meaningful passages)
      if (lineDecoded >= 4) {
        allDecodedLines.push({
          lineId: line.lineId,
          section,
          words: decodedWords,
          decodedCount: lineDecoded,
          totalCount: lineTotal,
          coverage: lineTotal > 0 ? lineDecoded / lineTotal : 0,
        });
      }
    }
  }

  return { sectionStats, allDecodedLines, totalWords, totalDecoded };
}

// ═══════════════════════════════════════════════════════════════════════════
// SINGLE-FOLIO OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

function printFolioDetail(folios, folioId) {
  const section = classifyFolio(folioId);
  const lines = folios[folioId];

  console.log("");
  console.log(`${BOLD}${"=".repeat(72)}${RESET}`);
  console.log(`${BOLD}  FOLIO ${folioId.toUpperCase()}  |  Section: ${section}${RESET}`);
  console.log(`${BOLD}${"=".repeat(72)}${RESET}`);
  console.log("");

  let totalWords = 0;
  let totalDecoded = 0;

  for (const line of lines) {
    const evaWords = [];
    const latinWords = [];

    for (const word of line.words) {
      const clean = word.replace(/[?*!]/g, "").trim();
      if (!clean) continue;

      totalWords++;
      const latin = decodeWord(clean);
      evaWords.push(clean);
      if (latin) {
        latinWords.push(latin);
        totalDecoded++;
      } else {
        latinWords.push(`[${clean}]`);
      }
    }

    if (evaWords.length === 0) continue;

    const lineLabel = line.lineId.padEnd(14);
    console.log(`${DIM}${lineLabel}EVA:   ${evaWords.join(" . ")}${RESET}`);

    // Color-coded decoded line: Latin=yellow, Hebrew=magenta, Occitan=blue, undecoded=dim
    const coloredWords = latinWords.map(w => colorByLanguage(w));
    console.log(`${" ".repeat(14)}Decoded: ${coloredWords.join(" ")}`);

    // English translation line
    const englishWords = latinWords.map(w => {
      if (w.startsWith("[")) return w;
      return LATIN_TO_ENGLISH[w] || w.toLowerCase();
    });
    console.log(`${" ".repeat(14)}${GREEN}Eng:   ${englishWords.join(" ")}${RESET}`);
    console.log("");
  }

  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log(`  Coverage: ${totalDecoded}/${totalWords} words decoded (${pct(totalDecoded, totalWords)})`);
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log("");
}

// ═══════════════════════════════════════════════════════════════════════════
// FULL MANUSCRIPT OUTPUT
// ═══════════════════════════════════════════════════════════════════════════

function printFullReport(result, folios) {
  const { sectionStats, allDecodedLines, totalWords, totalDecoded } = result;
  const glossarySize = Object.keys(GLOSS).length;

  // Header
  console.log("");
  console.log(`${BOLD}${"═".repeat(72)}${RESET}`);
  console.log(`${BOLD}  VOYNICH MANUSCRIPT — FULL DECIPHERMENT${RESET}`);
  console.log(`${BOLD}${"═".repeat(72)}${RESET}`);
  console.log("");
  console.log(`  Glossary entries:    ${BOLD}${glossarySize}${RESET}`);
  console.log(`  Decoded words:       ${BOLD}${GREEN}${totalDecoded.toLocaleString()}${RESET}`);
  console.log(`  Overall coverage:    ${BOLD}${pct(totalDecoded, totalWords)}${RESET}`);
  console.log(`  Legend: ${YELLOW}Latin${RESET}  ${MAGENTA}Hebrew${RESET}  ${BLUE}Occitan${RESET}  ${DIM}[undecoded]${RESET}`);
  console.log("");

  // Per-section stats
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log(`${BOLD}  COVERAGE BY SECTION${RESET}`);
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log("");

  const sectionOrder = [
    "Herbal", "Herbal-B", "Cosmological", "Zodiac",
    "Biological", "Biological-B", "Pharmaceutical", "Stars/Recipes",
  ];

  for (const section of sectionOrder) {
    const s = sectionStats[section];
    if (!s) continue;
    const frac = s.total > 0 ? s.decoded / s.total : 0;
    const sectionLabel = section.padEnd(18);
    const statsStr = `${String(s.decoded).padStart(5)}/${String(s.total).padStart(5)}`;
    const pctStr = pct(s.decoded, s.total).padStart(7);
    const folioStr = `(${s.folios} folios)`;
    console.log(`  ${sectionLabel} ${bar(frac)} ${statsStr} ${pctStr}  ${DIM}${folioStr}${RESET}`);
  }
  console.log("");

  // ── Full manuscript decode ──
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log(`${BOLD}  FULL DECODED TEXT${RESET}`);
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log("");

  let currentSection = null;
  const langCounts = { latin: 0, hebrew: 0, occitan: 0, undecoded: 0 };
  for (const folioId of Object.keys(folios)) {
    const section = classifyFolio(folioId);
    if (section !== currentSection) {
      currentSection = section;
      console.log(`\n${BOLD}  ── ${section.toUpperCase()} ──${RESET}\n`);
    }

    const lines = folios[folioId];
    let folioDecoded = 0, folioTotal = 0;

    for (const line of lines) {
      const decodedWords = [];
      let lineTotal = 0, lineDecoded = 0;

      for (const word of line.words) {
        const clean = word.replace(/[?*!]/g, "").trim();
        if (!clean || clean.length === 0) continue;
        lineTotal++;
        const latin = decodeWord(clean);
        if (latin) {
          decodedWords.push(latin);
          lineDecoded++;
        } else {
          decodedWords.push(`[${clean}]`);
        }
      }

      folioDecoded += lineDecoded;
      folioTotal += lineTotal;

      if (decodedWords.length === 0) continue;

      for (const w of decodedWords) langCounts[classifyLanguage(w)]++;

      const lineLabel = `${DIM}${line.lineId.padEnd(14)}${RESET}`;
      const coloredWords = decodedWords.map(w => colorByLanguage(w));
      console.log(`${lineLabel}${coloredWords.join(" ")}`);
    }

    // Folio summary line
    if (folioTotal > 0) {
      console.log(`${DIM}${"".padStart(14)}── ${folioId} ${pct(folioDecoded, folioTotal)} (${folioDecoded}/${folioTotal}) ──${RESET}\n`);
    }
  }

  // ── Top passages ──
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log(`${BOLD}  TOP 20 FULLY DECODED PASSAGES${RESET}`);
  console.log(`${BOLD}${"─".repeat(72)}${RESET}`);
  console.log(`${DIM}  English translations are literal token-by-token renderings.${RESET}`);
  console.log(`${DIM}  A full reading requires a medievalist specializing in 13th-century${RESET}`);
  console.log(`${DIM}  Languedocian pharmaceutical Latin and Occitan.${RESET}`);
  console.log("");

  const ranked = [...allDecodedLines]
    .sort((a, b) => {
      if (b.coverage !== a.coverage) return b.coverage - a.coverage;
      return b.decodedCount - a.decodedCount;
    })
    .slice(0, 20);

  for (let i = 0; i < ranked.length; i++) {
    const p = ranked[i];
    const rank = String(i + 1).padStart(2);
    const covStr = pct(p.decodedCount, p.totalCount).padStart(6);
    const label = p.lineId.padEnd(14);

    const coloredWords = p.words.map(w => colorByLanguage(w));
    const engStr = latinToEnglish(p.words.join(" "));

    console.log(`  ${BOLD}${rank}.${RESET} ${CYAN}${label}${RESET} ${DIM}[${p.section}]${RESET}  ${covStr} (${p.decodedCount}/${p.totalCount})`);
    console.log(`      ${coloredWords.join(" ")}`);
    console.log(`      ${GREEN}${engStr}${RESET}`);
    console.log("");
  }

  // Summary footer
  console.log(`${BOLD}${"═".repeat(72)}${RESET}`);
  console.log(`${BOLD}  SUMMARY${RESET}`);
  console.log(`${"─".repeat(72)}`);
  console.log(`  Glossary:            ${glossarySize} EVA→Latin mappings`);
  console.log(`  Manuscript words:    ${totalWords.toLocaleString()}`);
  console.log(`  Decoded:             ${totalDecoded.toLocaleString()} (${pct(totalDecoded, totalWords)})`);
  console.log(`  Decoded by language: ${YELLOW}Latin ${langCounts.latin.toLocaleString()}${RESET}  ${BLUE}Occitan ${langCounts.occitan.toLocaleString()}${RESET}  ${MAGENTA}Hebrew ${langCounts.hebrew.toLocaleString()}${RESET}`);
  console.log(`  Undecoded:           ${langCounts.undecoded.toLocaleString()} (${pct(langCounts.undecoded, totalWords)})`);
  console.log(`  Sections covered:    ${Object.keys(sectionStats).length}`);
  console.log(`  Legend: ${YELLOW}Latin${RESET}  ${MAGENTA}Hebrew${RESET}  ${BLUE}Occitan${RESET}  ${DIM}[undecoded]${RESET}`);
  console.log(`${BOLD}${"═".repeat(72)}${RESET}`);
  console.log("");
}

// ═══════════════════════════════════════════════════════════════════════════
// ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════

function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
  Usage:  node decode.js [folio]

  Examples:
    node decode.js          Decode full manuscript with statistics
    node decode.js f1v      Decode folio f1v with line-by-line output
    node decode.js f75r     Decode folio f75r (biological section)
    node decode.js --help   Show this help
`);
    process.exit(0);
  }

  // Determine target folio (if any)
  const targetFolio = args.find(a => !a.startsWith("-")) || null;

  // Load the EVA transcription
  const evaPath = join(__dirname, "tools", "eva-data", "eva_takahashi.txt");
  let folios;
  try {
    folios = parseTranscription(evaPath);
  } catch (e) {
    console.error(`${RED}Error reading transcription: ${e.message}${RESET}`);
    process.exit(1);
  }

  const folioCount = Object.keys(folios).length;

  if (targetFolio) {
    // Single folio mode
    if (!folios[targetFolio]) {
      console.error(`\n${RED}Error: Folio "${targetFolio}" not found.${RESET}`);
      const available = Object.keys(folios);
      console.error(`${DIM}Available (${available.length}): ${available.slice(0, 30).join(", ")}, ...${RESET}`);
      process.exit(1);
    }
    printFolioDetail(folios, targetFolio);
  } else {
    // Full manuscript mode
    console.log(`\n${DIM}  Parsing ${folioCount} folios from EVA transcription...${RESET}`);
    const result = decodeFolios(folios);
    printFullReport(result, folios);
  }
}

main();
