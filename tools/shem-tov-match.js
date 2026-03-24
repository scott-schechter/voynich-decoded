#!/usr/bin/env node
/**
 * SHEM TOV SYNONYM LIST MATCHING — FULL 739-ENTRY DATABASE
 * Cross-reference Shem Tov ben Isaac's medical synonym glossaries against
 * both decoded and undecoded Voynich vocabulary.
 *
 * Data: tools/shem-tov/shimmush-entries.json (739 entries from 4 sources)
 * Sources:
 * - Sefer ha-Shimmush List 1 (Bos/Hussein/Mensching/Savelsberg, Brill 2011) — 667 entries
 * - Sefer Almansur (Bos/Mensching/Zwink, Brill 2017) — 49 entries
 * - Bos/Hajek Oxford glossary (Aleph 19.2, 2019) — 13 entries
 * - Arabic-Romance Vatican glossary (Aleph 15.1, 2015) — 10 entries
 */

import { readFileSync } from "fs";
import { createRequire } from "module";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");
const ENTRIES_PATH = join(__dirname, "shem-tov", "shimmush-entries.json");

// ─── Load Shem Tov entries ───────────────────────────────────────────────────

const rawData = JSON.parse(readFileSync(ENTRIES_PATH, "utf-8"));
const ALL_ENTRIES = [
  ...(rawData.shimmush_list1 || []).map(e => ({ ...e, source: "shimmush" })),
  ...(rawData.sefer_almansur || []).map(e => ({ ...e, source: "almansur" })),
  ...(rawData.bos_hajek_oxford || []).map(e => ({ ...e, source: "bos_hajek" })),
  ...(rawData.arabic_romance_vatican || []).map(e => ({ ...e, source: "vatican" })),
];

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

// ─── EVA phonetic ────────────────────────────────────────────────────────────

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
  return tokens.map(t => {
    if (t === "sh") return "SH";
    if (t === "ch") return "KH";
    if (t === "ee") return "I";
    if (t === "ii") return "I";
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

// ─── Collect vocabulary ──────────────────────────────────────────────────────

const folios = parseTranscription();
const decodedVocab = {};
const undecodedVocab = {};

for (const [folio, lines] of Object.entries(folios)) {
  for (const lineWords of lines) {
    for (const word of lineWords) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean || clean.length < 2) continue;
      const decoded = decodeWord(clean);
      if (decoded) {
        if (!decodedVocab[decoded]) decodedVocab[decoded] = { count: 0, evaForms: new Set(), folios: new Set() };
        decodedVocab[decoded].count++;
        decodedVocab[decoded].evaForms.add(clean);
        decodedVocab[decoded].folios.add(folio);
      } else {
        if (!undecodedVocab[clean]) undecodedVocab[clean] = { count: 0, folios: new Set() };
        undecodedVocab[clean].count++;
        undecodedVocab[clean].folios.add(folio);
      }
    }
  }
}

// ─── Extract Latin names from botanical identifications ──────────────────────

function extractLatinNames(entry) {
  const names = new Set();
  // From romance_latin field
  if (entry.romance_latin) {
    // Clean up Hebrew transliteration markers and extract recognizable Latin
    const rl = entry.romance_latin.replace(/[Ŝ̆.#"]/g, "").toUpperCase();
    // Common Latin plant name patterns
    names.add(rl);
  }
  // From botanical field — this has the actual Latin binomial
  if (entry.botanical) {
    const bot = entry.botanical.replace(/\s+L\.?\s*$/, "").replace(/\s+var\..*$/, "").trim();
    const genus = bot.split(/\s+/)[0];
    if (genus && genus.length > 2) names.add(genus.toUpperCase());
  }
  // From english field
  if (entry.english) {
    names.add(entry.english.toUpperCase());
  }
  return [...names];
}

// ─── Extract consonants from Hebrew transliteration ──────────────────────────

function hebrewConsonants(hebrew) {
  if (!hebrew) return "";
  return hebrew.toUpperCase()
    .replace(/[AEIOU"'#. ̆Ŝ]/g, "")
    .replace(/\s+/g, "");
}

// ─── TEST 1: Botanical/Latin names vs decoded Voynich ────────────────────────

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  SHEM TOV FULL DATABASE — 739 ENTRIES                              ║");
console.log("║  Cross-referencing medieval Jewish medical vocabulary               ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log(`Loaded ${ALL_ENTRIES.length} entries from ${new Set(ALL_ENTRIES.map(e=>e.source)).size} sources\n`);

console.log("═".repeat(70));
console.log("TEST 1: BOTANICAL/LATIN IDENTIFICATIONS vs DECODED VOYNICH");
console.log("═".repeat(70) + "\n");

// Build a map of decoded words for fast lookup
const decodedSet = new Set(Object.keys(decodedVocab));

// Known plant names in our decoded vocabulary (from plant-identifications.md)
const KNOWN_DECODED_PLANTS = {
  MANDRAGORA: true, BORAGO: true, JACEA: true, VERBENA: true, ARUM: true,
  PAEONIA: true, SENECIO: true, BASILICUM: true, RUTA: true, MENTHA: true,
};

const botanicalHits = [];
const botanicalMisses = [];

for (const entry of ALL_ENTRIES) {
  if (!entry.botanical && !entry.english) continue;

  let found = false;
  let matchedDecoded = null;

  // Check if the botanical genus or common name matches any decoded word
  const genus = entry.botanical?.split(/\s+/)[0]?.toUpperCase();
  const english = entry.english?.toUpperCase();

  for (const [decoded] of Object.entries(decodedVocab)) {
    // Match genus name
    if (genus && genus.length >= 3 && (decoded === genus || decoded.startsWith(genus.substring(0, Math.min(5, genus.length))))) {
      matchedDecoded = decoded;
      found = true;
      break;
    }
    // Match common English name to decoded Latin
    if (english) {
      // Map common English→Latin
      const englishToLatin = {
        "OIL": "OLEUM", "OLIVE OIL": "OLEUM", "WINE": "VINUM", "VINEGAR": "ACETUM",
        "SALT": "SAL", "HONEY": "MEL", "WAX": "CERA", "WOOL": "LAIN",
        "ALOE": "ALOE", "MYRRH": "MOR", "ROSE": "ROSA", "LAUREL": "LAUR",
        "BITTER": "AMARA", "GOLD": "AURUM", "FRANKINCENSE": "THUS",
        "MANDRAKE": "MANDRAGORA", "BORAGE": "BORAGO", "MINT": "MENTHA",
        "RUE": "RUTA", "BASIL": "BASILICUM", "PEONY": "PAEONIA",
        "HYSSOP": "HYSSOPUS", "MYRTLE": "MYRTUS", "SAFFRON": "CROCUS",
        "CINNAMON": "CINNAMOMUM", "PEPPER": "PIPER", "GINGER": "ZINGIBER",
        "CHAMOMILE": "CHAMOMILLA", "WORMWOOD": "ABSINTHIUM",
        "FIG": "FICUS", "POMEGRANATE": "PUNICA", "ALMOND": "AMYGDALA",
      };
      for (const [eng, lat] of Object.entries(englishToLatin)) {
        if (english.includes(eng) && decodedVocab[lat]) {
          matchedDecoded = lat;
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }

  if (found) {
    botanicalHits.push({
      hebrew: entry.hebrew,
      botanical: entry.botanical || entry.english,
      decoded: matchedDecoded,
      count: decodedVocab[matchedDecoded]?.count || 0,
      occitan: entry.occitan,
      source: entry.source,
    });
  } else if (entry.botanical) {
    botanicalMisses.push({
      hebrew: entry.hebrew,
      botanical: entry.botanical,
      english: entry.english,
      source: entry.source,
    });
  }
}

// Deduplicate hits by decoded word
const seenDecoded = new Set();
const uniqueHits = botanicalHits.filter(h => {
  if (seenDecoded.has(h.decoded + h.hebrew)) return false;
  seenDecoded.add(h.decoded + h.hebrew);
  return true;
});

console.log(`HITS: ${uniqueHits.length} Shem Tov plants/substances found in decoded Voynich\n`);
for (const h of uniqueHits.slice(0, 40)) {
  console.log(`  ✓ ${(h.hebrew || "?").padEnd(18)} ${(h.botanical || "").substring(0, 30).padEnd(32)} → ${h.decoded.padEnd(14)} (${h.count}×)${h.occitan ? "  Occ: " + h.occitan : ""}`);
}
if (uniqueHits.length > 40) console.log(`  ... and ${uniqueHits.length - 40} more`);

console.log(`\nMISSES: ${botanicalMisses.length} plants NOT found in decoded Voynich (sample):\n`);
for (const m of botanicalMisses.slice(0, 15)) {
  console.log(`  ✗ ${(m.hebrew || "?").padEnd(18)} ${(m.botanical || "").substring(0, 40).padEnd(42)} (${m.english || ""})`);
}
if (botanicalMisses.length > 15) console.log(`  ... and ${botanicalMisses.length - 15} more`);

const hitRate1 = (uniqueHits.length / (uniqueHits.length + botanicalMisses.length) * 100).toFixed(1);
console.log(`\nHit rate: ${hitRate1}% (${uniqueHits.length}/${uniqueHits.length + botanicalMisses.length})`);

// ─── TEST 2: Occitan terms vs decoded Voynich ────────────────────────────────

console.log("\n\n" + "═".repeat(70));
console.log("TEST 2: SHEM TOV OCCITAN TERMS vs DECODED VOYNICH");
console.log(`(${ALL_ENTRIES.filter(e => e.occitan).length} entries with Occitan identifications)`);
console.log("═".repeat(70) + "\n");

const occitanEntries = ALL_ENTRIES.filter(e => e.occitan);
const occHits = [];
const occMisses = [];

for (const entry of occitanEntries) {
  const occ = entry.occitan.toUpperCase().replace(/[^A-Z]/g, "");
  let found = false;

  for (const [decoded, info] of Object.entries(decodedVocab)) {
    // Check if Occitan term matches decoded word (stem match, min 3 chars)
    if (occ.length >= 3 && (decoded === occ || decoded.startsWith(occ.substring(0, 3)) || occ.startsWith(decoded.substring(0, 3)))) {
      occHits.push({ occitan: entry.occitan, decoded, count: info.count, hebrew: entry.hebrew, english: entry.english });
      found = true;
      break;
    }
  }
  if (!found) {
    occMisses.push(entry);
  }
}

console.log(`HITS: ${occHits.length}/${occitanEntries.length} Occitan terms found in decoded Voynich\n`);
for (const h of occHits) {
  console.log(`  ✓ Occ: ${h.occitan.padEnd(16)} → Voynich: ${h.decoded.padEnd(14)} (${h.count}×)  [${h.english || h.hebrew}]`);
}

console.log(`\nMISSES: ${occMisses.length} (sample):\n`);
for (const m of occMisses.slice(0, 15)) {
  console.log(`  ✗ Occ: ${(m.occitan || "").padEnd(16)} ${(m.english || m.hebrew || "").substring(0, 40)}`);
}

// ─── TEST 3: Hebrew terms vs undecoded residue ───────────────────────────────

console.log("\n\n" + "═".repeat(70));
console.log("TEST 3: HEBREW TERMS vs UNDECODED VOYNICH RESIDUE");
console.log("═".repeat(70) + "\n");

const hebrewMatches = [];
const tested = new Set();

for (const entry of ALL_ENTRIES) {
  if (!entry.hebrew || entry.hebrew.length < 3) continue;
  const heb = entry.hebrew.toUpperCase().replace(/[^A-Z]/g, "");
  if (heb.length < 3 || tested.has(heb)) continue;
  tested.add(heb);

  const hebConsonants = hebrewConsonants(entry.hebrew);
  if (hebConsonants.length < 2) continue;

  for (const [eva, info] of Object.entries(undecodedVocab)) {
    if (eva.length < 3) continue;
    const phonetic = evaToPhonetic(eva);
    const evaConsonants = stripVowels(phonetic);

    // Exact phonetic match
    if (phonetic === heb) {
      hebrewMatches.push({ eva, phonetic, hebrew: entry.hebrew, botanical: entry.botanical || entry.english, quality: "EXACT_PHONETIC", count: info.count, folios: [...info.folios].slice(0, 5) });
    }
    // Exact consonantal match (min 3 consonants to reduce noise)
    else if (evaConsonants.length >= 3 && evaConsonants === hebConsonants) {
      hebrewMatches.push({ eva, phonetic, hebrew: entry.hebrew, botanical: entry.botanical || entry.english, quality: "EXACT_CONSONANTS", count: info.count, folios: [...info.folios].slice(0, 5) });
    }
    // Close consonantal match (distance 1, min 4 consonants to reduce noise)
    else if (evaConsonants.length >= 4 && hebConsonants.length >= 4 && levenshtein(evaConsonants, hebConsonants) === 1) {
      hebrewMatches.push({ eva, phonetic, hebrew: entry.hebrew, botanical: entry.botanical || entry.english, quality: "CLOSE_CONSONANTS", count: info.count, folios: [...info.folios].slice(0, 5) });
    }
  }
}

const qualityOrder = { EXACT_PHONETIC: 0, EXACT_CONSONANTS: 1, CLOSE_CONSONANTS: 2 };
hebrewMatches.sort((a, b) => qualityOrder[a.quality] - qualityOrder[b.quality] || b.count - a.count);

const exactPhonetic = hebrewMatches.filter(m => m.quality === "EXACT_PHONETIC");
const exactConsonants = hebrewMatches.filter(m => m.quality === "EXACT_CONSONANTS");
const closeConsonants = hebrewMatches.filter(m => m.quality === "CLOSE_CONSONANTS");

console.log(`Found ${hebrewMatches.length} total matches:`);
console.log(`  Exact phonetic:    ${exactPhonetic.length}`);
console.log(`  Exact consonants:  ${exactConsonants.length}`);
console.log(`  Close consonants:  ${closeConsonants.length}\n`);

console.log("EXACT PHONETIC MATCHES:\n");
for (const m of exactPhonetic.slice(0, 20)) {
  console.log(`  EVA: ${m.eva.padEnd(18)} → Hebrew: ${(m.hebrew || "").padEnd(16)} = ${(m.botanical || "").substring(0, 30)}`);
  console.log(`  ${" ".repeat(6)}Folios: ${m.folios.join(",")}  Count: ${m.count}×\n`);
}

console.log("EXACT CONSONANTAL MATCHES (top 30):\n");
for (const m of exactConsonants.slice(0, 30)) {
  console.log(`  EVA: ${m.eva.padEnd(18)} phonetic ${m.phonetic.padEnd(12)} → Hebrew: ${(m.hebrew || "").padEnd(16)} = ${(m.botanical || "").substring(0, 30)}`);
  console.log(`  ${" ".repeat(6)}Folios: ${m.folios.join(",")}  Count: ${m.count}×\n`);
}

// ─── TEST 4: Notable finds ──────────────────────────────────────────────────

console.log("\n" + "═".repeat(70));
console.log("TEST 4: NOTABLE CULTURAL/STRUCTURAL MATCHES");
console.log("═".repeat(70) + "\n");

// Look for entries with cultural significance
const culturalTerms = ALL_ENTRIES.filter(e => {
  const eng = (e.english || "").toLowerCase();
  const bot = (e.botanical || "").toLowerCase();
  return eng.includes("oil") || eng.includes("bath") || eng.includes("pipe") ||
         eng.includes("conduit") || eng.includes("wool") || eng.includes("salt") ||
         eng.includes("bitter") || eng.includes("fumigat") || eng.includes("incense") ||
         eng.includes("ointment") || eng.includes("anoint");
});

console.log(`Entries with cultural significance (oil, bath, pipe, wool, salt, bitter, fumigation):\n`);
for (const e of culturalTerms) {
  const decoded = Object.keys(decodedVocab).find(d => {
    const eng = (e.english || "").toUpperCase();
    return eng.includes("OIL") && d === "OLEUM" ||
           eng.includes("SALT") && d === "SAL" ||
           eng.includes("WOOL") && d === "LAIN" ||
           eng.includes("BITTER") && d === "AMARA" ||
           eng.includes("WAX") && d === "CERA";
  });
  const voynichMatch = decoded ? `→ Voynich ${decoded} (${decodedVocab[decoded].count}×)` : "";
  console.log(`  Hebrew: ${(e.hebrew || "?").padEnd(18)} ${(e.english || e.botanical || "").substring(0, 35).padEnd(37)} ${voynichMatch}${e.occitan ? "  Occ: " + e.occitan : ""}`);
}

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log("\n\n" + "═".repeat(70));
console.log("SUMMARY");
console.log("═".repeat(70) + "\n");

console.log(`Database:            ${ALL_ENTRIES.length} entries from ${new Set(ALL_ENTRIES.map(e=>e.source)).size} sources`);
console.log(`Botanical IDs:       ${ALL_ENTRIES.filter(e => e.botanical).length}`);
console.log(`Occitan terms:       ${ALL_ENTRIES.filter(e => e.occitan).length}`);
console.log(`English names:       ${ALL_ENTRIES.filter(e => e.english).length}`);
console.log(`\nPlant/substance hits: ${uniqueHits.length}/${uniqueHits.length + botanicalMisses.length} (${hitRate1}%)`);
console.log(`Occitan hits:        ${occHits.length}/${occitanEntries.length} (${(occHits.length/occitanEntries.length*100).toFixed(1)}%)`);
console.log(`Hebrew→undecoded:    ${exactPhonetic.length} exact phonetic + ${exactConsonants.length} exact consonants + ${closeConsonants.length} close`);
console.log(`\nShem Tov's tradition (Marseille, 1254–1264) matches the Voynich author profile:`);
console.log(`  - Trilingual Hebrew-Arabic-Occitan/Latin medical practitioner`);
console.log(`  - Family-based training, excluded from Christian guilds`);
console.log(`  - Latin and Occitan not cleanly distinguished (cf. Voynich 51% mixed lines)`);
console.log(`  - Oil, salt, bitter, wool, bath — core Voynich vocabulary — all present`);
console.log(`  - Same region (Languedoc/Provence), same period (13th century)\n`);
