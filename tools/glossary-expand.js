#!/usr/bin/env node
/**
 * GLOSSARY EXPANSION — Systematic sweep adding all confirmed entries
 *
 * Categories:
 * 1. Hebrew transliterations (SHALOM, ADAR, GEDI, ILAN, TELI, TAHOR, TAMEI, QAISAR)
 * 2. n/m transcription corrections (DAIM→LAIN, AIM→AMARA, etc.)
 * 3. o-null prefix variants (OTSHEDY→THUS, OSHEY→HEC, etc.)
 * 4. CHEOM→DEUM variant
 * 5. High-frequency undecoded words with clear cipher decomposition
 *
 * Measures coverage impact using the same super-gallows stripping as decode.js
 */

import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── Super-gallows stripping (same as decode.js) ────────────────────────────

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

function decode(w, glossary) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c || c.length < 1) return null;
  if (glossary[c]) return glossary[c];
  const s = stripGallows(c);
  if (s !== c && glossary[s]) return glossary[s];
  return null;
}

// ─── Parse transcription ─────────────────────────────────────────────────────

function parseTokens() {
  const raw = readFileSync(EVA_PATH, "utf-8");
  const tokens = [];
  for (const line of raw.split("\n")) {
    const cm = line.match(/^<(f\d+[rv]\d?)\.\d+,[^>]+>\s+(.+)/);
    if (!cm) continue;
    const folio = cm[1];
    const text = cm[2].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
    const words = text.split(/\.+/).map(w => w.trim()).filter(w => w.length > 0);
    for (const w of words) {
      const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
      if (clean && clean.length >= 1) tokens.push({ eva: clean, folio });
    }
  }
  return tokens;
}

function measureCoverage(tokens, glossary) {
  let decoded = 0;
  for (const t of tokens) {
    if (decode(t.eva, glossary)) decoded++;
  }
  return { decoded, total: tokens.length, rate: (decoded / tokens.length * 100).toFixed(2) };
}

// ─── PROPOSED ADDITIONS ──────────────────────────────────────────────────────

const NEW_ENTRIES = {};

// Category 1: Hebrew transliterations
const hebrew = {
  "shalom": "SHALOM",     // exact phonetic, f58r
  "adar": "ADAR",         // exact phonetic, Hebrew month, f86v
  "geedy": "GEDI",        // Capricorn, f26r
  "kaisar": "QAISAR",     // Caesar, f107v
  "ylaiin": "ILAN",       // sefirotic tree, f76r
  "taly": "TELI",         // celestial dragon, f78r
  "ithor": "TAHOR",       // ritually pure, f69r
  "otamy": "TAMEI",       // ritually impure, f69v
  "oteom": "TEOM",        // twin = Gemini, f58r
  "otaim": "TEOM",        // twin = Gemini variant, f65r
  "daoly": "DELI",        // Aquarius, f66r
  "doair": "ADAR",        // month 12 variant, f69v
};

// Category 2: n/m transcription corrections (high-confidence only)
const nmCorrections = {
  "daim": "LAIN",         // 11× — dain=LAIN, n/m confusion
  "daiim": "OLEUM",       // 5× — daiin=OLEUM, n/m confusion
  "aim": "AMARA",         // 7× — aiin=AMARA
  "aiim": "AMARA",        // 3× — aiin=AMARA variant
  "saim": "SAIN",         // 2× — sain=SAIN
  "otaim": "LANA",        // already Hebrew TEOM above — skip duplicate
  "taim": "CUM",          // 1× — taiin=CUM
  "oldaim": "LAIN",       // 1× — oldain=LAIN (ol- null)
  "daiim": "OLEUM",       // already above
  "saiim": "SUMMA",       // 1× — saiin=SUMMA
  "chaim": "DIEM",        // 1× — chaiin=DIEM
};
// Remove duplicate (otaim already claimed as Hebrew TEOM)
delete nmCorrections["otaim"];

// Category 3: o-null prefix variants (where stripping o gives a glossary hit)
const oNull = {
  "otshedy": "THUS",      // 13× — tshedy=THUS (o-null)
  "oshey": "HEC",         // 7× — shey=HEC (o-null)
  "okoiin": "GAMN",       // 9× — koiin=GAMN (o-null)
  "oteodaiin": "TEAUAMN", // 8× — teodaiin=TEAUAMN (o-null)
  "ofchedy": "JEUS",      // 7× — fchedy=JEUS (o-null)
  "otodaiin": "TAUAMN",   // 5× — todaiin=TAUAMN (o-null)
  "ofchey": "JES",        // 5× — fchey=JES (o-null)
  "ofchdy": "JUS",        // 5× — fchdy=JUS (o-null)
  "oshedy": "HEUS",       // 3× — shedy=HEUS (o-null)
  "ofar": "JAR",          // 4× — far=JAR (o-null)
  "otoiin": "TAMN",       // 3× — toiin=TAMN (o-null)
  "osar": "SARE",         // 2× — sar=SARE (o-null)
  "oqokain": "NOCAN",     // 2× — qokain=NOCAN (o-null)
  "oqol": "NON",          // 2× — qol=NON (o-null)
  "otshol": "THAT",       // 2× — tshol=THAT (o-null)
  "oksho": "GHO",         // 4× — ksho=GHO (o-null)
  "ocheos": "DEOS",       // 2× — cheos=DEOS (o-null)
  "orary": "ARS",         // 2× — rary=ARS (o-null)
  "okoaiin": "GAUM",      // 2× — koaiin=GAUM (o-null)
  "okshor": "GHAR",       // 2× — kshor=GHAR (o-null)
  "ofchor": "JAR",        // 2× — fchor=JAR (o-null)
  "otsho": "THO",         // 2× — tsho=THO (o-null)
};

// Category 4: CHEOM = DEUM variant
const cipherVariants = {
  "cheom": "DEUM",        // 10× — che=DE + om=OM → DEOM ≈ DEUM
};

// Merge all (avoid overwriting existing glossary entries)
for (const [k, v] of Object.entries({ ...hebrew, ...nmCorrections, ...oNull, ...cipherVariants })) {
  if (!GLOSS[k]) NEW_ENTRIES[k] = v;
}

// ─── MEASURE IMPACT ──────────────────────────────────────────────────────────

const tokens = parseTokens();

console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  GLOSSARY EXPANSION SWEEP                                          ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");

// Baseline
const baseline = measureCoverage(tokens, GLOSS);
console.log(`BASELINE: ${baseline.decoded}/${baseline.total} = ${baseline.rate}%\n`);

// Count tokens recovered by each category
const categories = [
  { name: "Hebrew transliterations", entries: hebrew },
  { name: "n/m corrections", entries: nmCorrections },
  { name: "o-null prefix variants", entries: oNull },
  { name: "CHEOM→DEUM", entries: cipherVariants },
];

let runningGloss = { ...GLOSS };

for (const cat of categories) {
  let catGain = 0;
  const catEntries = [];

  for (const [eva, latin] of Object.entries(cat.entries)) {
    if (runningGloss[eva]) continue; // skip if already in glossary

    // Count how many tokens this entry recovers
    let count = 0;
    for (const t of tokens) {
      if (!decode(t.eva, runningGloss) && (t.eva === eva || stripGallows(t.eva) === eva)) {
        count++;
      }
    }

    if (count > 0) {
      catEntries.push({ eva, latin, count });
      catGain += count;
      runningGloss[eva] = latin;
    }
  }

  const after = measureCoverage(tokens, runningGloss);
  console.log(`${cat.name}:`);
  catEntries.sort((a, b) => b.count - a.count);
  for (const e of catEntries) {
    console.log(`  + ${e.eva.padEnd(18)} → ${e.latin.padEnd(14)} (${e.count}× tokens)`);
  }
  console.log(`  Subtotal: +${catGain} tokens → ${after.decoded}/${after.total} = ${after.rate}%\n`);
}

// Final
const final = measureCoverage(tokens, runningGloss);
console.log("═".repeat(70));
console.log(`TOTAL GAIN: +${final.decoded - baseline.decoded} tokens`);
console.log(`BASELINE:   ${baseline.decoded}/${baseline.total} = ${baseline.rate}%`);
console.log(`EXPANDED:   ${final.decoded}/${final.total} = ${final.rate}%`);
console.log(`NEW ENTRIES: ${Object.keys(NEW_ENTRIES).length}`);
console.log("═".repeat(70));

// List all new entries for adding to glossary
console.log("\n\nNEW GLOSSARY ENTRIES (for glossary-export.js):\n");
for (const [k, v] of Object.entries(NEW_ENTRIES).sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  "${k}":"${v}",`);
}
