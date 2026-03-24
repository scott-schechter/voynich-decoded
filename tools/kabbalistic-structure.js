#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * KABBALISTIC STRUCTURAL ANALYSIS
 * Tests whether decoded Latin vocabulary maps to Kabbalistic sefirotic concepts
 * translated into Latin rather than left as Hebrew transliterations.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ── EVA tokenizer & decoder (reused from other tools) ──────────────────
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

function classifySection(folio) {
  const n = parseInt(folio.replace(/[^0-9]/g, ""));
  if (n <= 57) return "Herbal";
  if (n >= 58 && n <= 66) return "Cosmo";
  if (n >= 67 && n <= 73) return "Zodiac";
  if (n >= 75 && n <= 84) return "Bio";
  if (n >= 85 && n <= 86) return "Bio-B";
  if (n >= 87 && n <= 102) return "Pharma";
  if (n >= 103 && n <= 116) return "Recipe";
  return "Other";
}

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
        .replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".")
        .replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
      const words = t.split(/\.+/).map(w => w.trim()).filter(w => w && w.length > 0);
      if (words.length > 0) folios[f].push({ lineId: `${f}.${cm[2]}`, lineNum: parseInt(cm[2]), words });
    }
  }
  return folios;
}

// ── Parse and build decoded corpus ─────────────────────────────────────

const folios = parseTranscription();

// Build per-line decoded data with section info
const corpus = []; // { folio, section, lineId, decodedWords[], evaWords[] }
for (const [folio, lines] of Object.entries(folios)) {
  const section = classifySection(folio);
  for (const line of lines) {
    const decodedWords = [];
    const evaWords = [];
    for (const word of line.words) {
      const clean = word.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (!clean) continue;
      const latin = decodeWord(clean);
      decodedWords.push(latin || `[${clean}]`);
      evaWords.push(clean);
    }
    corpus.push({ folio, section, lineId: line.lineId, decodedWords, evaWords });
  }
}

// ── Helper: count word occurrences per section ─────────────────────────

function countBySection(targetWords) {
  const targetSet = new Set(targetWords.map(w => w.toUpperCase()));
  const counts = {};
  let total = 0;
  for (const line of corpus) {
    if (!counts[line.section]) counts[line.section] = { hits: 0, totalWords: 0 };
    for (const w of line.decodedWords) {
      if (w.startsWith("[")) continue; // undecoded
      counts[line.section].totalWords++;
      if (targetSet.has(w.toUpperCase())) { counts[line.section].hits++; total++; }
    }
  }
  return { counts, total };
}

// Count total decoded words per section
function totalDecodedBySection() {
  const totals = {};
  for (const line of corpus) {
    if (!totals[line.section]) totals[line.section] = 0;
    for (const w of line.decodedWords) {
      if (!w.startsWith("[")) totals[line.section]++;
    }
  }
  return totals;
}

// ── Helper: co-occurrence within N-word window ─────────────────────────

function coOccurrence(word1Set, word2Set, windowSize = 5) {
  const w1 = new Set(word1Set.map(w => w.toUpperCase()));
  const w2 = new Set(word2Set.map(w => w.toUpperCase()));
  let coCount = 0, w1Total = 0, w2Total = 0, totalWords = 0;

  for (const line of corpus) {
    const decoded = line.decodedWords.map(w => w.toUpperCase());
    for (let i = 0; i < decoded.length; i++) {
      if (decoded[i].startsWith("[")) continue;
      totalWords++;
      if (w1.has(decoded[i])) {
        w1Total++;
        // Check window for word2
        for (let j = Math.max(0, i - windowSize); j <= Math.min(decoded.length - 1, i + windowSize); j++) {
          if (j !== i && w2.has(decoded[j])) { coCount++; break; }
        }
      }
      if (w2.has(decoded[i])) w2Total++;
    }
  }

  // Expected co-occurrence under independence
  const p2 = w2Total / totalWords;
  const expected = w1Total * (1 - Math.pow(1 - p2, 2 * windowSize));

  return { coCount, w1Total, w2Total, totalWords, expected, enrichment: expected > 0 ? coCount / expected : 0 };
}

// ── Helper: chi-square test ────────────────────────────────────────────

function chiSquare(observed, expected) {
  if (expected === 0) return 0;
  return Math.pow(observed - expected, 2) / expected;
}

function chiSquareSection(targetWords, sectionTotals) {
  const { counts, total } = countBySection(targetWords);
  let totalAllWords = 0;
  for (const v of Object.values(sectionTotals)) totalAllWords += v;
  const globalRate = total / totalAllWords;

  let chiSq = 0;
  const details = {};
  for (const [sec, secTotal] of Object.entries(sectionTotals)) {
    const observed = counts[sec]?.hits || 0;
    const expected = secTotal * globalRate;
    chiSq += chiSquare(observed, expected);
    details[sec] = { observed, expected: expected.toFixed(1), enrichment: expected > 0 ? (observed / expected).toFixed(2) : "n/a" };
  }
  return { chiSq: chiSq.toFixed(2), df: Object.keys(sectionTotals).length - 1, details, globalRate: (globalRate * 100).toFixed(3) };
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN ANALYSIS
// ═══════════════════════════════════════════════════════════════════════

const sectionTotals = totalDecodedBySection();
let grandTotal = 0;
for (const v of Object.values(sectionTotals)) grandTotal += v;

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  KABBALISTIC STRUCTURAL ANALYSIS OF DECODED VOYNICH TEXT            ║");
console.log("║  Testing Latin translations of sefirotic concepts                   ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log("Corpus: " + grandTotal + " decoded words across " + Object.keys(sectionTotals).length + " sections\n");
console.log("Section word counts:");
for (const [sec, count] of Object.entries(sectionTotals).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${sec.padEnd(12)} ${String(count).padStart(6)} words  (${(count / grandTotal * 100).toFixed(1)}%)`);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 1: DEA = Shekhinah — clusters with plant/nature vocabulary?
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 1: DEA (Shekhinah) — Plant/Nature clustering");
console.log("Bahir: Shekhinah = 'spirit in trees, ever-renewing cycle of seasons'");
console.log("═".repeat(72) + "\n");

// 1a: DEA distribution by section
const deaResult = chiSquareSection(["DEA"], sectionTotals);
console.log("DEA distribution across sections (global rate: " + deaResult.globalRate + "%):");
console.log("Section      Observed  Expected  Enrichment");
console.log("─".repeat(50));
for (const [sec, d] of Object.entries(deaResult.details).sort((a, b) => parseFloat(b.enrichment) - parseFloat(a.enrichment))) {
  console.log(`${sec.padEnd(13)} ${String(d.observed).padStart(6)}    ${d.expected.padStart(7)}    ${d.enrichment.padStart(6)}x`);
}
console.log(`\nChi-square = ${deaResult.chiSq}, df = ${deaResult.df}`);

// 1b: DEA co-occurrence with plant/nature words
const PLANT_WORDS = ["BASILICUM", "BORAGO", "MANDRAGORA", "JACEA", "VERBENA", "ARUM", "PAEONIA",
  "SENECIO", "MENTHA", "VIOLA", "TILIA", "ALOE", "LINUM", "CICUTA", "FRAGARIA",
  "RUTA", "MORUS", "CARDO", "TIMO", "ROSA", "SALVIA", "ABSINTHIUM", "ANETHUM",
  "LAVANDULA", "MARRUBIUM", "URTICA", "PLANTAGO", "SAMBUCUS", "HYPERICUM",
  "FLORA", "LAUR", "HERBA", "FLOS", "SEMEN", "CORTICE", "RAMUS", "HORTUS"];

const deaPlantCo = coOccurrence(["DEA"], PLANT_WORDS, 5);
console.log(`\nDEA + plant/nature co-occurrence (window=5):`);
console.log(`  DEA total: ${deaPlantCo.w1Total}`);
console.log(`  Plant words total: ${deaPlantCo.w2Total}`);
console.log(`  Co-occurrences: ${deaPlantCo.coCount}`);
console.log(`  Expected (independence): ${deaPlantCo.expected.toFixed(1)}`);
console.log(`  Enrichment: ${deaPlantCo.enrichment.toFixed(2)}x`);

// 1c: DEA concentration in herbal section
const deaHerbal = deaResult.details["Herbal"];
if (deaHerbal) {
  const herbalPct = (parseInt(deaHerbal.observed) / parseInt(deaResult.details["Herbal"]?.observed || 0 + deaResult.details["Bio"]?.observed || 0) * 100);
  console.log(`\nDEA in Herbal section: ${deaHerbal.observed} / total DEA = ${(parseInt(deaHerbal.observed) / countBySection(["DEA"]).total * 100).toFixed(1)}%`);
  console.log(`  Herbal enrichment: ${deaHerbal.enrichment}x vs expected`);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 2: DEUS + HEUS = Gevurah (Judgment/Severity)
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 2: DEUS + HEUS = Gevurah (Judgment/Severity)");
console.log("Tests: Co-occurrence in Bio section; HEUS-NOCETIS as karet warning");
console.log("═".repeat(72) + "\n");

// 2a: DEUS distribution
const deusWords = ["DEUS", "DEUM", "DEOS", "DEIS"];
const deusResult = chiSquareSection(deusWords, sectionTotals);
console.log("DEUS (all forms) distribution:");
console.log("Section      Observed  Expected  Enrichment");
console.log("─".repeat(50));
for (const [sec, d] of Object.entries(deusResult.details).sort((a, b) => parseFloat(b.enrichment) - parseFloat(a.enrichment))) {
  console.log(`${sec.padEnd(13)} ${String(d.observed).padStart(6)}    ${d.expected.padStart(7)}    ${d.enrichment.padStart(6)}x`);
}
console.log(`Chi-square = ${deusResult.chiSq}, df = ${deusResult.df}, global rate = ${deusResult.globalRate}%`);

// 2b: HEUS distribution
const heusResult = chiSquareSection(["HEUS"], sectionTotals);
console.log("\nHEUS distribution:");
console.log("Section      Observed  Expected  Enrichment");
console.log("─".repeat(50));
for (const [sec, d] of Object.entries(heusResult.details).sort((a, b) => parseFloat(b.enrichment) - parseFloat(a.enrichment))) {
  console.log(`${sec.padEnd(13)} ${String(d.observed).padStart(6)}    ${d.expected.padStart(7)}    ${d.enrichment.padStart(6)}x`);
}
console.log(`Chi-square = ${heusResult.chiSq}, df = ${heusResult.df}, global rate = ${heusResult.globalRate}%`);

// 2c: DEUS-HEUS co-occurrence
const deusHeusCo = coOccurrence(deusWords, ["HEUS"], 5);
console.log(`\nDEUS + HEUS co-occurrence (window=5):`);
console.log(`  DEUS total: ${deusHeusCo.w1Total}, HEUS total: ${deusHeusCo.w2Total}`);
console.log(`  Co-occurrences: ${deusHeusCo.coCount}`);
console.log(`  Expected: ${deusHeusCo.expected.toFixed(1)}`);
console.log(`  Enrichment: ${deusHeusCo.enrichment.toFixed(2)}x`);

// 2d: HEUS-NOCETIS pattern
const heusNocCo = coOccurrence(["HEUS"], ["NOCETIS", "NOCET", "NOCIS", "NOCES", "NOCITIS", "NOCAT", "NOCUM", "NOCS", "NOCAN", "NOCERAT", "NOCUIT", "NOCAM", "NOCATUS", "NOCOR"], 5);
console.log(`\nHEUS + NOC- family co-occurrence (window=5):`);
console.log(`  HEUS total: ${heusNocCo.w1Total}`);
console.log(`  NOC- family total: ${heusNocCo.w2Total}`);
console.log(`  Co-occurrences: ${heusNocCo.coCount}`);
console.log(`  Expected: ${heusNocCo.expected.toFixed(1)}`);
console.log(`  Enrichment: ${heusNocCo.enrichment.toFixed(2)}x`);

// ═══════════════════════════════════════════════════════════════════════
// TEST 3: LAR = domestic sanctification / Chesed through ritual
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 3: LAR (household god) = Chesed through domestic ritual");
console.log("Test: Does LAR cluster in Recipe section?");
console.log("═".repeat(72) + "\n");

const larResult = chiSquareSection(["LAR"], sectionTotals);
console.log("LAR distribution:");
console.log("Section      Observed  Expected  Enrichment");
console.log("─".repeat(50));
for (const [sec, d] of Object.entries(larResult.details).sort((a, b) => parseFloat(b.enrichment) - parseFloat(a.enrichment))) {
  console.log(`${sec.padEnd(13)} ${String(d.observed).padStart(6)}    ${d.expected.padStart(7)}    ${d.enrichment.padStart(6)}x`);
}
console.log(`Chi-square = ${larResult.chiSq}, df = ${larResult.df}, global rate = ${larResult.globalRate}%`);

// LAR + recipe/domestic words co-occurrence
const RECIPE_WORDS = ["OLEUM", "RECIPE", "DOSIS", "SAL", "VINUM", "AQUA", "CORTICE",
  "FUMUM", "SERUM", "BOLUS", "GARUM", "TARTARUM", "CERA", "SEVUM", "LACTIS"];
const larRecipeCo = coOccurrence(["LAR"], RECIPE_WORDS, 5);
console.log(`\nLAR + recipe/preparation co-occurrence (window=5):`);
console.log(`  LAR total: ${larRecipeCo.w1Total}, Recipe vocab total: ${larRecipeCo.w2Total}`);
console.log(`  Co-occurrences: ${larRecipeCo.coCount}`);
console.log(`  Expected: ${larRecipeCo.expected.toFixed(1)}`);
console.log(`  Enrichment: ${larRecipeCo.enrichment.toFixed(2)}x`);

// ═══════════════════════════════════════════════════════════════════════
// TEST 4: Divine gender shift across sections — F/M ratios
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 4: Divine gender shift across sections");
console.log("Herbal=Shekhinah, Bio=Gevurah, Recipe=Chesed");
console.log("═".repeat(72) + "\n");

const FEMININE_DIVINE = new Set(["DEA"]);
const MASCULINE_DIVINE = new Set(["DEUS", "DEUM", "DEOS", "DEIS", "DEO"]);
const JUDGMENT = new Set(["HEUS", "HEU"]);
const HOUSEHOLD = new Set(["LAR"]);

const divineBySec = {};
for (const line of corpus) {
  const sec = line.section;
  if (!divineBySec[sec]) divineBySec[sec] = { dea: 0, deus: 0, deo: 0, lar: 0, heus: 0, totalDivine: 0, totalWords: 0 };
  for (const w of line.decodedWords) {
    if (w.startsWith("[")) continue;
    const u = w.toUpperCase();
    divineBySec[sec].totalWords++;
    if (FEMININE_DIVINE.has(u)) { divineBySec[sec].dea++; divineBySec[sec].totalDivine++; }
    if (MASCULINE_DIVINE.has(u)) { divineBySec[sec].deus++; divineBySec[sec].totalDivine++; }
    if (u === "DEO") divineBySec[sec].deo++;
    if (JUDGMENT.has(u)) { divineBySec[sec].heus++; divineBySec[sec].totalDivine++; }
    if (HOUSEHOLD.has(u)) { divineBySec[sec].lar++; divineBySec[sec].totalDivine++; }
  }
}

console.log("Section      DEA(F)  DEUS(M)  DEO    LAR    HEUS   Total   F/M ratio   Dominant");
console.log("─".repeat(90));
for (const [sec, d] of Object.entries(divineBySec).sort()) {
  const male = d.deus + d.deo + d.lar;
  const female = d.dea;
  const ratio = male > 0 ? (female / male).toFixed(3) : (female > 0 ? "INF" : "0.000");
  let dominant = "";
  if (female > male * 1.5) dominant = "FEMININE (Shekhinah)";
  else if (d.heus > female && d.heus > d.deus) dominant = "JUDGMENT (Gevurah)";
  else if (d.lar > female && d.lar > 0) dominant = "DOMESTIC (Chesed)";
  else if (male > female * 1.5) dominant = "MASCULINE (Tiferet?)";
  else dominant = "mixed";
  console.log(`${sec.padEnd(13)} ${String(d.dea).padStart(5)}   ${String(d.deus).padStart(5)}   ${String(d.deo).padStart(5)}  ${String(d.lar).padStart(5)}  ${String(d.heus).padStart(5)}  ${String(d.totalDivine).padStart(5)}   ${ratio.padStart(7)}   ${dominant}`);
}

// Per-section divine density (divine words per 100 words)
console.log("\nDivine vocabulary density (per 100 decoded words):");
console.log("Section      DEA/100  DEUS/100  HEUS/100  LAR/100  Total/100");
console.log("─".repeat(70));
for (const [sec, d] of Object.entries(divineBySec).sort()) {
  const per100 = (n) => (n / d.totalWords * 100).toFixed(2);
  console.log(`${sec.padEnd(13)} ${per100(d.dea).padStart(6)}   ${per100(d.deus).padStart(7)}   ${per100(d.heus).padStart(7)}   ${per100(d.lar).padStart(6)}   ${per100(d.totalDivine).padStart(7)}`);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 5: OLEUM as sefirotic emanation
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 5: OLEUM as sefirotic emanation (shemen/Chokhmah)");
console.log("Zohar: oil descends through sefirot; Atbash shemen=Chokhmah");
console.log("═".repeat(72) + "\n");

// 5a: OLEUM distribution
const oleumResult = chiSquareSection(["OLEUM"], sectionTotals);
console.log("OLEUM distribution:");
console.log("Section      Observed  Expected  Enrichment");
console.log("─".repeat(50));
for (const [sec, d] of Object.entries(oleumResult.details).sort((a, b) => parseFloat(b.enrichment) - parseFloat(a.enrichment))) {
  console.log(`${sec.padEnd(13)} ${String(d.observed).padStart(6)}    ${d.expected.padStart(7)}    ${d.enrichment.padStart(6)}x`);
}
console.log(`Chi-square = ${oleumResult.chiSq}, global rate = ${oleumResult.globalRate}%`);

// 5b: OLEUM + divine vocabulary co-occurrence
const ALL_DIVINE = ["DEA", "DEUS", "DEUM", "DEOS", "DEIS", "DEO", "LAR", "HEUS", "HEU", "SANC", "DIS"];
const oleumDivineCo = coOccurrence(["OLEUM"], ALL_DIVINE, 5);
console.log(`\nOLEUM + divine vocabulary co-occurrence (window=5):`);
console.log(`  OLEUM total: ${oleumDivineCo.w1Total}`);
console.log(`  Divine vocab total: ${oleumDivineCo.w2Total}`);
console.log(`  Co-occurrences: ${oleumDivineCo.coCount}`);
console.log(`  Expected: ${oleumDivineCo.expected.toFixed(1)}`);
console.log(`  Enrichment: ${oleumDivineCo.enrichment.toFixed(2)}x`);

// 5c: OLEUM + specific divine terms
for (const divWord of ["DEA", "DEUS", "HEUS", "LAR"]) {
  const co = coOccurrence(["OLEUM"], [divWord], 5);
  console.log(`  OLEUM + ${divWord.padEnd(5)}: ${co.coCount} co-occ (expected ${co.expected.toFixed(1)}, enrichment ${co.enrichment.toFixed(2)}x)`);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 6: HEUS safety protocol as karet-adjacent language
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 6: HEUS safety protocol as karet-adjacent language");
console.log("Karet = spiritual excision for impurity near sanctuary");
console.log("Test: HEUS + NOC concentrated where DEUS (not DEA) presides");
console.log("═".repeat(72) + "\n");

// Classify sections by divine dominance
console.log("Section divine dominance classification:");
const deusDominant = [];
const deaDominant = [];
for (const [sec, d] of Object.entries(divineBySec)) {
  const male = d.deus + d.deo;
  if (d.dea > male) {
    deaDominant.push(sec);
    console.log(`  ${sec}: DEA-dominant (DEA=${d.dea}, DEUS+DEO=${male})`);
  } else {
    deusDominant.push(sec);
    console.log(`  ${sec}: DEUS-dominant (DEUS+DEO=${male}, DEA=${d.dea})`);
  }
}

// Count HEUS in DEUS-dominant vs DEA-dominant sections
let heusInDeus = 0, heusInDea = 0, heusTotal = 0;
let nocInDeus = 0, nocInDea = 0;
const NOC_SET = new Set(["NOCET", "NOCIS", "NOCES", "NOCETIS", "NOCITIS", "NOCAT", "NOCUM", "NOCS", "NOCAN", "NOCOR", "NOCERAT", "NOCUIT", "NOCAM", "NOCATUS"]);

for (const line of corpus) {
  for (const w of line.decodedWords) {
    if (w.startsWith("[")) continue;
    const u = w.toUpperCase();
    if (u === "HEUS") {
      heusTotal++;
      if (deusDominant.includes(line.section)) heusInDeus++;
      else if (deaDominant.includes(line.section)) heusInDea++;
    }
    if (NOC_SET.has(u)) {
      if (deusDominant.includes(line.section)) nocInDeus++;
      else if (deaDominant.includes(line.section)) nocInDea++;
    }
  }
}

console.log(`\nHEUS distribution by divine dominance:`);
console.log(`  In DEUS-dominant sections: ${heusInDeus} (${(heusInDeus / heusTotal * 100).toFixed(1)}%)`);
console.log(`  In DEA-dominant sections:  ${heusInDea} (${(heusInDea / heusTotal * 100).toFixed(1)}%)`);
console.log(`  Total HEUS: ${heusTotal}`);

// Expected distribution based on word counts
let wordsInDeus = 0, wordsInDea = 0;
for (const sec of deusDominant) wordsInDeus += sectionTotals[sec] || 0;
for (const sec of deaDominant) wordsInDea += sectionTotals[sec] || 0;
const expectedHeusInDeus = heusTotal * (wordsInDeus / (wordsInDeus + wordsInDea));
const expectedHeusInDea = heusTotal * (wordsInDea / (wordsInDeus + wordsInDea));
console.log(`\n  Expected in DEUS sections (by word count): ${expectedHeusInDeus.toFixed(1)}`);
console.log(`  Expected in DEA sections: ${expectedHeusInDea.toFixed(1)}`);
console.log(`  HEUS enrichment in DEUS sections: ${(heusInDeus / expectedHeusInDeus).toFixed(2)}x`);
console.log(`  HEUS enrichment in DEA sections: ${(heusInDea / expectedHeusInDea).toFixed(2)}x`);

console.log(`\nNOC- family distribution by divine dominance:`);
console.log(`  In DEUS-dominant: ${nocInDeus}, In DEA-dominant: ${nocInDea}`);

// HEUS + NOCETIS specific co-occurrence
const heusNocetis = coOccurrence(["HEUS"], ["NOCETIS"], 3);
console.log(`\nHEUS + NOCETIS tight co-occurrence (window=3):`);
console.log(`  Co-occurrences: ${heusNocetis.coCount}`);
console.log(`  Expected: ${heusNocetis.expected.toFixed(1)}`);
console.log(`  Enrichment: ${heusNocetis.enrichment.toFixed(2)}x`);

// ═══════════════════════════════════════════════════════════════════════
// TEST 7: ILAN and TELI at section boundaries
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("TEST 7: ILAN (tree) and TELI (celestial dragon) at boundaries");
console.log("These are Hebrew terms that might remain untranslated");
console.log("═".repeat(72) + "\n");

// Search for EVA sequences that could encode ILAN (YLN) and TELI (TLY)
// Based on the cipher: y=QU, l=L(?), check hebrew-decode findings
// From publication/17-hebrew-hypothesis.md: ylaiin = YLAIN -> ILAN, taly -> TELI

const hebrewTerms = {
  "ylaiin": { hebrew: "ILAN", meaning: "tree (sefirotic)" },
  "taly": { hebrew: "TELI", meaning: "celestial dragon" },
};

// Search raw EVA for these tokens
const rawEva = readFileSync(EVA_PATH, "utf-8");
const evaLines = rawEva.split("\n");

for (const [evaToken, info] of Object.entries(hebrewTerms)) {
  console.log(`\n${info.hebrew} (${info.meaning}) — EVA: "${evaToken}":`);
  const hits = [];
  for (const line of evaLines) {
    if (line.startsWith("#") || !line.trim()) continue;
    const cm = line.match(/^<(f\d+[rv]\d?)\.(\d+),[^>]+>\s+(.+)/);
    if (!cm) continue;
    const folio = cm[1];
    const text = cm[3];
    // Check if the EVA token appears as a word
    const words = text.replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".")
      .replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim()
      .split(/\.+/).map(w => w.trim()).filter(w => w);
    for (const w of words) {
      const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (clean === evaToken || clean.includes(evaToken)) {
        const sec = classifySection(folio);
        hits.push({ folio, section: sec, word: clean });
      }
    }
  }

  if (hits.length === 0) {
    console.log("  No exact matches found.");
  } else {
    console.log(`  Found ${hits.length} occurrences:`);
    const bySec = {};
    for (const h of hits) {
      if (!bySec[h.section]) bySec[h.section] = [];
      bySec[h.section].push(h.folio);
    }
    for (const [sec, folioList] of Object.entries(bySec)) {
      const unique = [...new Set(folioList)];
      console.log(`    ${sec}: ${folioList.length}x across folios [${unique.join(", ")}]`);
    }

    // Check if they appear near section boundaries
    const sectionBoundaries = {
      "Herbal->Cosmo": [56, 57, 58],
      "Cosmo->Zodiac": [66, 67],
      "Zodiac->Bio": [73, 74, 75],
      "Bio->Pharma": [84, 85, 86, 87],
      "Pharma->Recipe": [102, 103],
    };

    let boundaryHits = 0;
    for (const h of hits) {
      const n = parseInt(h.folio.replace(/[^0-9]/g, ""));
      for (const [boundary, folioNums] of Object.entries(sectionBoundaries)) {
        if (folioNums.includes(n)) {
          boundaryHits++;
          console.log(`    ** BOUNDARY HIT: ${h.folio} (${h.section}) at ${boundary}`);
        }
      }
    }
    console.log(`  Boundary hits: ${boundaryHits}/${hits.length} (${(boundaryHits / hits.length * 100).toFixed(1)}%)`);
  }
}

// Also search for partial/substring matches of ILAN and TELI patterns
console.log("\n--- Extended search: partial EVA matches for sefirotic terms ---");
// Look for ylaiin variants and taly variants
const searchPatterns = [
  { eva: "ylain", label: "ILAN variant (ylain)" },
  { eva: "ylaiin", label: "ILAN exact (ylaiin)" },
  { eva: "tal", label: "TELI root (tal-)" },
  { eva: "taly", label: "TELI exact (taly)" },
];

for (const pat of searchPatterns) {
  let count = 0;
  const folioHits = {};
  for (const line of evaLines) {
    const cm = line.match(/^<(f\d+[rv]\d?)\.(\d+),[^>]+>\s+(.+)/);
    if (!cm) continue;
    const text = cm[3].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".")
      .replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
    const words = text.split(/\.+/).map(w => w.trim()).filter(w => w);
    for (const w of words) {
      const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (clean === pat.eva) {
        count++;
        const sec = classifySection(cm[1]);
        if (!folioHits[sec]) folioHits[sec] = [];
        folioHits[sec].push(cm[1]);
      }
    }
  }
  if (count > 0) {
    console.log(`  ${pat.label}: ${count} hits`);
    for (const [sec, fl] of Object.entries(folioHits)) {
      console.log(`    ${sec}: ${fl.length}x [${[...new Set(fl)].join(", ")}]`);
    }
  } else {
    console.log(`  ${pat.label}: 0 hits`);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// SYNTHESIS: Sefirotic mapping summary
// ═══════════════════════════════════════════════════════════════════════

console.log("\n" + "═".repeat(72));
console.log("SYNTHESIS: Sefirotic Structure in Decoded Text");
console.log("═".repeat(72) + "\n");

// Gather key numbers for summary
const deaCounts = countBySection(["DEA"]);
const deusCounts = countBySection(deusWords);
const heusCounts = countBySection(["HEUS"]);
const larCounts = countBySection(["LAR"]);
const oleumCounts = countBySection(["OLEUM"]);

console.log("Global word frequencies:");
console.log(`  DEA:    ${deaCounts.total}`);
console.log(`  DEUS+:  ${deusCounts.total}`);
console.log(`  HEUS:   ${heusCounts.total}`);
console.log(`  LAR:    ${larCounts.total}`);
console.log(`  OLEUM:  ${oleumCounts.total}`);

console.log("\nProposed Kabbalistic mapping:");
console.log("─".repeat(72));
console.log("Sefirah          Latin term    Count   Primary section    Enrichment");
console.log("─".repeat(72));

const mappings = [
  { sefirah: "Shekhinah", latin: "DEA", result: deaResult },
  { sefirah: "Gevurah/Din", latin: "DEUS+", result: deusResult },
  { sefirah: "Gevurah/Din", latin: "HEUS", result: heusResult },
  { sefirah: "Chesed", latin: "LAR", result: larResult },
  { sefirah: "Chokhmah", latin: "OLEUM", result: oleumResult },
];

for (const m of mappings) {
  // Find most enriched section
  let maxSec = "", maxE = 0;
  for (const [sec, d] of Object.entries(m.result.details)) {
    if (parseFloat(d.enrichment) > maxE) { maxE = parseFloat(d.enrichment); maxSec = sec; }
  }
  const totalCount = Object.values(m.result.details).reduce((sum, d) => sum + d.observed, 0);
  console.log(`${m.sefirah.padEnd(17)} ${m.latin.padEnd(12)} ${String(totalCount).padStart(5)}   ${maxSec.padEnd(17)}  ${maxE.toFixed(2)}x`);
}

// Final coherence test: does the pattern match Kabbalistic expectations?
console.log("\n" + "─".repeat(72));
console.log("COHERENCE CHECK: Expected vs Observed patterns");
console.log("─".repeat(72));

const checks = [
  {
    test: "DEA (Shekhinah) dominant in Herbal (natural world)",
    expected: "Herbal enrichment > 1.2x",
    result: deaResult.details["Herbal"] ? `${deaResult.details["Herbal"].enrichment}x` : "n/a",
    pass: deaResult.details["Herbal"] && parseFloat(deaResult.details["Herbal"].enrichment) > 1.2
  },
  {
    test: "DEUS (Gevurah) enriched in Bio (danger/judgment)",
    expected: "Bio enrichment > 1.0x",
    result: deusResult.details["Bio"] ? `${deusResult.details["Bio"].enrichment}x` : "n/a",
    pass: deusResult.details["Bio"] && parseFloat(deusResult.details["Bio"].enrichment) > 1.0
  },
  {
    test: "HEUS (Gevurah warning) enriched in Bio/Pharma",
    expected: "Bio or Pharma enrichment > 1.0x",
    result: `Bio=${heusResult.details["Bio"]?.enrichment || "n/a"}x, Pharma=${heusResult.details["Pharma"]?.enrichment || "n/a"}x`,
    pass: (heusResult.details["Bio"] && parseFloat(heusResult.details["Bio"].enrichment) > 1.0) ||
          (heusResult.details["Pharma"] && parseFloat(heusResult.details["Pharma"].enrichment) > 1.0)
  },
  {
    test: "HEUS concentrates where DEUS dominates (not DEA)",
    expected: ">60% of HEUS in DEUS-dominant sections",
    result: `${(heusInDeus / heusTotal * 100).toFixed(1)}%`,
    pass: heusInDeus / heusTotal > 0.6
  },
  {
    test: "LAR (Chesed) enriched in Recipe (domestic ritual)",
    expected: "Recipe enrichment > 1.0x",
    result: larResult.details["Recipe"] ? `${larResult.details["Recipe"].enrichment}x` : "n/a",
    pass: larResult.details["Recipe"] && parseFloat(larResult.details["Recipe"].enrichment) > 1.0
  },
  {
    test: "OLEUM co-occurs with divine vocabulary above chance",
    expected: "Enrichment > 1.2x",
    result: `${oleumDivineCo.enrichment.toFixed(2)}x`,
    pass: oleumDivineCo.enrichment > 1.2
  },
  {
    test: "DEUS+HEUS co-occur above chance (Gevurah cluster)",
    expected: "Enrichment > 1.2x",
    result: `${deusHeusCo.enrichment.toFixed(2)}x`,
    pass: deusHeusCo.enrichment > 1.2
  },
  {
    test: "Gender shift: Herbal F/M > Bio F/M",
    expected: "Herbal F/M ratio > Bio F/M ratio",
    result: (() => {
      const hd = divineBySec["Herbal"];
      const bd = divineBySec["Bio"];
      if (!hd || !bd) return "n/a";
      const hRatio = hd.dea / (hd.deus + hd.deo + hd.lar || 1);
      const bRatio = bd.dea / (bd.deus + bd.deo + bd.lar || 1);
      return `Herbal=${hRatio.toFixed(3)}, Bio=${bRatio.toFixed(3)}`;
    })(),
    pass: (() => {
      const hd = divineBySec["Herbal"];
      const bd = divineBySec["Bio"];
      if (!hd || !bd) return false;
      return (hd.dea / (hd.deus + hd.deo + hd.lar || 1)) > (bd.dea / (bd.deus + bd.deo + bd.lar || 1));
    })()
  }
];

let passed = 0;
for (const c of checks) {
  const status = c.pass ? "PASS" : "FAIL";
  if (c.pass) passed++;
  console.log(`\n  [${status}] ${c.test}`);
  console.log(`         Expected: ${c.expected}`);
  console.log(`         Observed: ${c.result}`);
}

console.log(`\n${"═".repeat(72)}`);
console.log(`OVERALL: ${passed}/${checks.length} coherence checks passed`);
console.log(`${"═".repeat(72)}`);

if (passed >= 6) {
  console.log("\nSTRONG SUPPORT for Kabbalistic structural mapping.");
  console.log("The divine vocabulary distributes as sefirotic theory predicts:");
  console.log("  Shekhinah (DEA) in nature, Gevurah (DEUS+HEUS) in danger zones,");
  console.log("  Chesed (LAR) in domestic ritual, Chokhmah (OLEUM) as emanation.");
} else if (passed >= 4) {
  console.log("\nMODERATE SUPPORT — some patterns align with sefirotic mapping,");
  console.log("but not all predictions confirmed.");
} else {
  console.log("\nWEAK SUPPORT — the vocabulary distribution does not strongly");
  console.log("match Kabbalistic expectations.");
}
