#!/usr/bin/env node
/**
 * SEFIROTIC PERMUTATION TEST
 *
 * The strongest possible test of whether the divine vocabulary distribution
 * in the Voynich is genuine Kabbalistic structure or pattern-seeking noise.
 *
 * Method: Take the real decoded text. Keep all word positions fixed.
 * Randomly shuffle which positions get DEA, DEUS, HEUS, LAR.
 * Run the sefirotic coherence tests on 10,000 permutations.
 * Compare the real data to the null distribution.
 *
 * If the real pattern falls in the top 1-5% of random shuffles,
 * the structure is statistically significant — not just noise.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── Decode helpers ──────────────────────────────────────────────────────────

const SG = new Set(["cth", "ckh", "cph", "cfh"]);
const DIGRAPHS = ["cth", "cph", "cfh", "ckh", "sh", "ch", "ii", "ee"];
function tokenize(s) {
  const t = []; let i = 0; s = s.replace(/[.<>%$\s]/g, "");
  while (i < s.length) { let m = false; for (const dg of DIGRAPHS) { if (s.startsWith(dg, i)) { t.push(dg); i += dg.length; m = true; break; } } if (!m) { t.push(s[i]); i++; } }
  return t;
}
function stripSG(w) { return tokenize(w).filter(t => !SG.has(t)).join(""); }
function decode(w) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c) return null;
  if (GLOSS[c]) return GLOSS[c];
  const s = stripSG(c);
  if (s !== c && GLOSS[s]) return GLOSS[s];
  return null;
}

function getSection(folio) {
  const num = parseInt(folio.replace(/[^0-9]/g, ""));
  if (num <= 57) return "herbal";
  if (num <= 67) return "cosmo";
  if (num <= 73) return "zodiac";
  if (num <= 84) return "bio";
  if (num <= 102) return "pharma";
  return "recipe";
}

// ─── Parse all decoded words with positions ──────────────────────────────────

const raw = readFileSync(EVA_PATH, "utf-8");
const allWords = []; // { decoded, section, index }

for (const line of raw.split("\n")) {
  const cm = line.match(/^<(f\d+[rv]\d?)\.\d+,[^>]+>\s+(.+)/);
  if (!cm) continue;
  const section = getSection(cm[1]);
  const text = cm[2].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
  const words = text.split(/\.+/).map(w => w.trim()).filter(w => w.length > 0);
  for (const w of words) {
    const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
    if (!clean) continue;
    const d = decode(clean);
    if (d) allWords.push({ decoded: d, section });
  }
}

// ─── Define the divine vocabulary and sections ───────────────────────────────

const DIVINE_WORDS = {
  DEA: new Set(["DEA", "DEAM"]),
  DEUS: new Set(["DEUS", "DEUM", "DEO", "DEOS", "DEIS"]),
  HEUS: new Set(["HEUS", "HEU"]),
  LAR: new Set(["LAR"]),
};

function classifyDivine(word) {
  for (const [type, variants] of Object.entries(DIVINE_WORDS)) {
    if (variants.has(word)) return type;
  }
  return null;
}

// Find all divine word positions
const divinePositions = []; // indices into allWords where divine terms appear
const divineTypes = []; // what type each divine word is

for (let i = 0; i < allWords.length; i++) {
  const dtype = classifyDivine(allWords[i].decoded);
  if (dtype) {
    divinePositions.push(i);
    divineTypes.push(dtype);
  }
}

const sectionNames = ["herbal", "cosmo", "zodiac", "bio", "pharma", "recipe"];
const sectionWordCounts = {};
for (const sec of sectionNames) sectionWordCounts[sec] = allWords.filter(w => w.section === sec).length;

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  SEFIROTIC PERMUTATION TEST — 10,000 random shuffles              ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

console.log(`Total decoded words: ${allWords.length}`);
console.log(`Divine vocabulary positions: ${divinePositions.length}`);
console.log(`  DEA family: ${divineTypes.filter(t => t === "DEA").length}`);
console.log(`  DEUS family: ${divineTypes.filter(t => t === "DEUS").length}`);
console.log(`  HEUS family: ${divineTypes.filter(t => t === "HEUS").length}`);
console.log(`  LAR family: ${divineTypes.filter(t => t === "LAR").length}`);
console.log(`\nSection word counts:`);
for (const sec of sectionNames) console.log(`  ${sec.padEnd(10)} ${sectionWordCounts[sec]}`);

// ─── Compute test statistics ─────────────────────────────────────────────────

function computeStats(words) {
  // Count divine types per section
  const counts = {};
  for (const sec of sectionNames) {
    counts[sec] = { DEA: 0, DEUS: 0, HEUS: 0, LAR: 0, total: 0 };
  }
  for (const w of words) {
    const sec = w.section;
    counts[sec].total++;
    const dtype = classifyDivine(w.decoded);
    if (dtype) counts[sec][dtype]++;
  }

  // Test 1: DEA enrichment in herbal
  const deaTotal = Object.values(counts).reduce((s, c) => s + c.DEA, 0);
  const deaHerbal = counts.herbal.DEA;
  const deaExpected = deaTotal * (counts.herbal.total / words.length);
  const deaEnrichment = deaExpected > 0 ? deaHerbal / deaExpected : 0;

  // Test 2: DEUS enrichment in bio
  const deusTotal = Object.values(counts).reduce((s, c) => s + c.DEUS, 0);
  const deusBio = counts.bio.DEUS;
  const deusExpected = deusTotal * (counts.bio.total / words.length);
  const deusEnrichment = deusExpected > 0 ? deusBio / deusExpected : 0;

  // Test 3: HEUS enrichment in bio
  const heusTotal = Object.values(counts).reduce((s, c) => s + c.HEUS, 0);
  const heusBio = counts.bio.HEUS;
  const heusExpected = heusTotal * (counts.bio.total / words.length);
  const heusEnrichment = heusExpected > 0 ? heusBio / heusExpected : 0;

  // Test 4: HEUS in DEUS-dominant sections
  // Classify sections by DEUS vs DEA dominance
  let heusInDeusDom = 0, heusInDeaDom = 0;
  for (const sec of sectionNames) {
    const isDeusDom = (counts[sec].DEUS > counts[sec].DEA);
    if (isDeusDom) heusInDeusDom += counts[sec].HEUS;
    else heusInDeaDom += counts[sec].HEUS;
  }
  const heusDeusDomPct = heusTotal > 0 ? heusInDeusDom / heusTotal : 0;

  // Test 5: LAR enrichment in recipe
  const larTotal = Object.values(counts).reduce((s, c) => s + c.LAR, 0);
  const larRecipe = counts.recipe.LAR;
  const larExpected = larTotal * (counts.recipe.total / words.length);
  const larEnrichment = larExpected > 0 ? larRecipe / larExpected : 0;

  // Test 6: F/M ratio — herbal vs bio
  const herbalFM = counts.herbal.DEUS > 0 ? counts.herbal.DEA / counts.herbal.DEUS : 0;
  const bioFM = counts.bio.DEUS > 0 ? counts.bio.DEA / counts.bio.DEUS : 0;
  const fmRatioDrop = herbalFM > 0 && bioFM > 0 ? herbalFM / bioFM : (herbalFM > 0 ? Infinity : 0);

  return {
    deaEnrichment,
    deusEnrichment,
    heusEnrichment,
    heusDeusDomPct,
    larEnrichment,
    fmRatioDrop,
  };
}

// ─── Real data statistics ────────────────────────────────────────────────────

const realStats = computeStats(allWords);

console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("REAL DATA STATISTICS");
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log(`  DEA enrichment in herbal:     ${realStats.deaEnrichment.toFixed(3)}`);
console.log(`  DEUS enrichment in bio:       ${realStats.deusEnrichment.toFixed(3)}`);
console.log(`  HEUS enrichment in bio:       ${realStats.heusEnrichment.toFixed(3)}`);
console.log(`  HEUS in DEUS-dominant:        ${(realStats.heusDeusDomPct * 100).toFixed(1)}%`);
console.log(`  LAR enrichment in recipe:     ${realStats.larEnrichment.toFixed(3)}`);
console.log(`  F/M ratio drop herbal→bio:    ${realStats.fmRatioDrop.toFixed(1)}x`);

// ─── Permutation test ────────────────────────────────────────────────────────

const N_PERMS = 10000;
console.log(`\nRunning ${N_PERMS} permutations...`);

const permStats = {
  deaEnrichment: [],
  deusEnrichment: [],
  heusEnrichment: [],
  heusDeusDomPct: [],
  larEnrichment: [],
  fmRatioDrop: [],
};

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

for (let p = 0; p < N_PERMS; p++) {
  // Create shuffled version: randomly reassign divine types to divine positions
  const shuffledTypes = shuffle(divineTypes);

  // Build shuffled word list
  const shuffledWords = allWords.map(w => ({ ...w }));

  // First, clear all divine words
  for (const pos of divinePositions) {
    shuffledWords[pos] = { ...shuffledWords[pos], decoded: "___CLEARED___" };
  }

  // Then assign shuffled divine types
  for (let i = 0; i < divinePositions.length; i++) {
    const pos = divinePositions[i];
    const type = shuffledTypes[i];
    // Pick a representative word for each type
    const typeWord = type === "DEA" ? "DEA" : type === "DEUS" ? "DEUS" : type === "HEUS" ? "HEUS" : "LAR";
    shuffledWords[pos] = { ...shuffledWords[pos], decoded: typeWord };
  }

  const stats = computeStats(shuffledWords);
  for (const key of Object.keys(permStats)) {
    permStats[key].push(stats[key]);
  }
}

// ─── Compute p-values ────────────────────────────────────────────────────────

function pValue(realVal, permValues, direction) {
  // direction: "greater" (real > perm) or "less" (real < perm)
  let count = 0;
  for (const v of permValues) {
    if (direction === "greater" && v >= realVal) count++;
    if (direction === "less" && v <= realVal) count++;
  }
  return count / permValues.length;
}

console.log("\n═══════════════════════════════════════════════════════════════════");
console.log("PERMUTATION TEST RESULTS (10,000 shuffles)");
console.log("═══════════════════════════════════════════════════════════════════\n");

const tests = [
  { name: "DEA enrichment in herbal (Shekhinah)", key: "deaEnrichment", dir: "greater", threshold: 0.05 },
  { name: "DEUS enrichment in bio (Gevurah)", key: "deusEnrichment", dir: "greater", threshold: 0.05 },
  { name: "HEUS enrichment in bio (Gevurah)", key: "heusEnrichment", dir: "greater", threshold: 0.05 },
  { name: "HEUS in DEUS-dominant sections", key: "heusDeusDomPct", dir: "greater", threshold: 0.05 },
  { name: "LAR enrichment in recipe (Chesed)", key: "larEnrichment", dir: "greater", threshold: 0.05 },
  { name: "F/M ratio drop herbal→bio", key: "fmRatioDrop", dir: "greater", threshold: 0.05 },
];

let passCount = 0;

for (const test of tests) {
  const realVal = realStats[test.key];
  const perm = permStats[test.key];
  const p = pValue(realVal, perm, test.dir);
  const mean = perm.reduce((s, v) => s + v, 0) / perm.length;
  const sorted = [...perm].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const p99 = sorted[Math.floor(sorted.length * 0.99)];
  const pass = p < test.threshold;
  if (pass) passCount++;

  const sig = p < 0.001 ? "***" : p < 0.01 ? "**" : p < 0.05 ? "*" : "ns";

  console.log(`  ${test.name}`);
  console.log(`    Real value:      ${typeof realVal === "number" ? realVal.toFixed(3) : realVal}`);
  console.log(`    Permutation mean: ${mean.toFixed(3)}`);
  console.log(`    95th percentile: ${p95.toFixed(3)}`);
  console.log(`    99th percentile: ${p99.toFixed(3)}`);
  console.log(`    p-value:         ${p.toFixed(4)} ${sig}`);
  console.log(`    Result:          ${pass ? "SIGNIFICANT" : "not significant"}`);
  console.log();
}

console.log("═══════════════════════════════════════════════════════════════════");
console.log(`OVERALL: ${passCount}/6 tests significant at p < 0.05`);
console.log("═══════════════════════════════════════════════════════════════════\n");

console.log("INTERPRETATION:");
console.log("If the sefirotic pattern were noise (random divine word placement),");
console.log("the real data would fall within the permutation distribution.");
console.log("A p-value < 0.05 means the real pattern is more extreme than 95%");
console.log("of random arrangements — it did not arise by chance.\n");

// Also report: what's the probability of getting ALL significant tests by chance?
const pAll = Math.pow(0.05, passCount);
console.log(`Probability of ${passCount}/6 tests passing by chance: ${pAll.toExponential(2)}`);
