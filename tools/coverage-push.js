#!/usr/bin/env node
/**
 * COVERAGE PUSH — Systematic sweep for all recoverable tokens
 *
 * A. Null-prefix variants: o-, d-, l-, p-, ol-, op-, ch-, sh- prefixes
 * B. Paleographic corrections: n↔m, iin↔im, aiin↔aim, y↔i, ee↔e
 * E. Cipher rule analysis: find patterns in remaining undecoded words
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GLOSS } from "./glossary-export.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const EVA_PATH = join(__dirname, "eva-data", "eva_takahashi.txt");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SG = new Set(["cth", "ckh", "cph", "cfh"]);
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

function stripSG(w) { return tokenize(w).filter(t => !SG.has(t)).join(""); }

function decode(w) {
  const c = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
  if (!c) return null;
  if (GLOSS[c]) return GLOSS[c];
  const s = stripSG(c);
  if (s !== c && GLOSS[s]) return GLOSS[s];
  return null;
}

// ─── Parse all tokens ────────────────────────────────────────────────────────

const raw = readFileSync(EVA_PATH, "utf-8");
const allTokens = [];
const wordCounts = {};

for (const line of raw.split("\n")) {
  const cm = line.match(/^<(f\d+[rv]\d?)\.\d+,[^>]+>\s+(.+)/);
  if (!cm) continue;
  const folio = cm[1];
  const text = cm[2].replace(/<%>/g, "").replace(/<\$>/g, "").replace(/<->/g, ".").replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
  const words = text.split(/\.+/).map(w => w.trim()).filter(w => w.length > 0);
  for (const w of words) {
    const clean = w.replace(/[<>%$?*!{}[\]()]/g, "").trim();
    if (clean && clean.length >= 1) {
      allTokens.push({ eva: clean, folio });
      wordCounts[clean] = (wordCounts[clean] || 0) + 1;
    }
  }
}

// Baseline
let baseDecoded = 0;
for (const t of allTokens) if (decode(t.eva)) baseDecoded++;
console.log("╔══════════════════════════════════════════════════════════════════════╗");
console.log("║  COVERAGE PUSH — Systematic sweep for maximum decode rate          ║");
console.log("╚══════════════════════════════════════════════════════════════════════╝\n");
console.log(`BASELINE: ${baseDecoded}/${allTokens.length} = ${(baseDecoded/allTokens.length*100).toFixed(2)}%`);
console.log(`Glossary: ${Object.keys(GLOSS).length} entries\n`);

// Collect undecoded
const undecoded = {};
for (const t of allTokens) {
  if (!decode(t.eva)) {
    if (!undecoded[t.eva]) undecoded[t.eva] = 0;
    undecoded[t.eva]++;
  }
}

console.log(`Undecoded: ${Object.keys(undecoded).length} unique forms, ${Object.values(undecoded).reduce((a,b)=>a+b,0)} tokens\n`);

// ═══════════════════════════════════════════════════════════════════════════════
// PART A: NULL-PREFIX SWEEP
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═".repeat(70));
console.log("PART A: NULL-PREFIX SWEEP");
console.log("═".repeat(70) + "\n");

const NULL_PREFIXES = ["o", "d", "l", "p", "ol", "op", "ch", "sh", "s", "k"];
const newEntries = {};

for (const prefix of NULL_PREFIXES) {
  const hits = [];

  for (const [w, count] of Object.entries(undecoded)) {
    if (w.length <= prefix.length + 1) continue; // too short after stripping
    if (!w.startsWith(prefix)) continue;

    const stripped = w.slice(prefix.length);
    if (stripped.length < 2) continue;

    // Check if stripped form decodes
    const result = decode(stripped) || GLOSS[stripped];
    if (result && !GLOSS[w]) {
      // Don't add if it conflicts with an existing entry
      hits.push({ original: w, stripped, decoded: result, count });
    }
  }

  if (hits.length > 0) {
    // Sort by token count
    hits.sort((a, b) => b.count - a.count);
    let totalTokens = 0;
    let addedCount = 0;

    for (const h of hits) {
      if (!newEntries[h.original]) {
        newEntries[h.original] = h.decoded;
        totalTokens += h.count;
        addedCount++;
      }
    }

    console.log(`  ${prefix}-prefix: ${addedCount} new entries, +${totalTokens} tokens`);
    // Show top 5
    for (const h of hits.slice(0, 5)) {
      console.log(`    ${h.original.padEnd(20)} → ${h.stripped.padEnd(16)} = ${h.decoded.padEnd(14)} (${h.count}×)`);
    }
    if (hits.length > 5) console.log(`    ... and ${hits.length - 5} more`);
    console.log();
  }
}

// Also check super-gallows + prefix combinations
// e.g., cth + o + word, ckh + d + word, etc.
console.log("  Super-gallows + prefix combinations:");
let sgPrefixCount = 0;
for (const [w, count] of Object.entries(undecoded)) {
  if (w.length < 5) continue;
  // Check if starts with SG
  for (const sg of SG) {
    if (w.startsWith(sg)) {
      const afterSG = w.slice(sg.length);
      // Check if afterSG decodes
      if (GLOSS[afterSG] && !newEntries[w]) {
        newEntries[w] = GLOSS[afterSG];
        sgPrefixCount++;
      }
      // Check if afterSG with null prefix stripped decodes
      for (const prefix of NULL_PREFIXES) {
        if (afterSG.startsWith(prefix) && afterSG.length > prefix.length + 1) {
          const stripped = afterSG.slice(prefix.length);
          const result = GLOSS[stripped];
          if (result && !newEntries[w]) {
            newEntries[w] = result;
            sgPrefixCount++;
          }
        }
      }
    }
  }
}
console.log(`    ${sgPrefixCount} additional entries from SG+prefix combinations\n`);

// ═══════════════════════════════════════════════════════════════════════════════
// PART B: PALEOGRAPHIC CORRECTIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═".repeat(70));
console.log("PART B: PALEOGRAPHIC CORRECTIONS");
console.log("═".repeat(70) + "\n");

const paleoHits = [];

for (const [w, count] of Object.entries(undecoded)) {
  if (newEntries[w]) continue; // already recovered
  if (w.length < 2) continue;

  // B1: Final n↔m
  if (w.endsWith("m")) {
    const v = w.slice(0, -1) + "n";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "m→n" }); }
  }
  if (w.endsWith("n") && !w.endsWith("iin") && !w.endsWith("aiin")) {
    const v = w.slice(0, -1) + "m";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "n→m" }); }
  }

  // B2: iin↔im and aiin↔aim
  if (w.endsWith("im") && w.length >= 4) {
    const v = w.slice(0, -2) + "iin";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "im→iin" }); }
    const v2 = w.slice(0, -2) + "iiin";
    if (GLOSS[v2] && !newEntries[w]) { newEntries[w] = GLOSS[v2]; paleoHits.push({ w, v2, decoded: GLOSS[v2], count, type: "im→iiin" }); }
  }
  if (w.endsWith("iin") && w.length >= 5) {
    const v = w.slice(0, -3) + "im";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "iin→im" }); }
  }

  // B3: ee↔e (doubled vowel confusion)
  if (w.includes("ee")) {
    const v = w.replace("ee", "e");
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "ee→e" }); }
  }
  if (w.includes("e") && !w.includes("ee")) {
    const v = w.replace("e", "ee");
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "e→ee" }); }
  }

  // B4: ii↔i
  if (w.includes("ii") && !w.includes("iii")) {
    const v = w.replace("ii", "i");
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "ii→i" }); }
  }

  // B5: y↔i at word boundaries
  if (w.startsWith("y")) {
    const v = "i" + w.slice(1);
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "y→i" }); }
  }
  if (w.startsWith("i") && w.length >= 3) {
    const v = "y" + w.slice(1);
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "i→y" }); }
  }

  // B6: Final -y↔-i
  if (w.endsWith("y") && w.length >= 3) {
    const v = w.slice(0, -1) + "i";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "y→i final" }); }
  }

  // B7: aiin↔ain (doubled i)
  if (w.endsWith("aiin")) {
    const v = w.slice(0, -4) + "ain";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "aiin→ain" }); }
  }
  if (w.endsWith("ain") && !w.endsWith("aiin")) {
    const v = w.slice(0, -3) + "aiin";
    if (GLOSS[v] && !newEntries[w]) { newEntries[w] = GLOSS[v]; paleoHits.push({ w, v, decoded: GLOSS[v], count, type: "ain→aiin" }); }
  }
}

// Group by type
const byType = {};
for (const h of paleoHits) {
  if (!byType[h.type]) byType[h.type] = [];
  byType[h.type].push(h);
}

for (const [type, hits] of Object.entries(byType).sort((a,b) => {
  const ta = a[1].reduce((s,h) => s+h.count, 0);
  const tb = b[1].reduce((s,h) => s+h.count, 0);
  return tb - ta;
})) {
  const totalTokens = hits.reduce((s, h) => s + h.count, 0);
  console.log(`  ${type}: ${hits.length} entries, +${totalTokens} tokens`);
  hits.sort((a, b) => b.count - a.count);
  for (const h of hits.slice(0, 3)) {
    console.log(`    ${h.w.padEnd(20)} → ${(h.v||"").padEnd(16)} = ${h.decoded.padEnd(14)} (${h.count}×)`);
  }
  if (hits.length > 3) console.log(`    ... and ${hits.length - 3} more`);
  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBINED IMPACT
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═".repeat(70));
console.log("COMBINED IMPACT");
console.log("═".repeat(70) + "\n");

// Remove entries already in GLOSS (shouldn't be any, but be safe)
for (const k of Object.keys(newEntries)) {
  if (GLOSS[k]) delete newEntries[k];
}

// Count tokens recovered
const combined = { ...GLOSS, ...newEntries };
let newDecoded = 0;
for (const t of allTokens) {
  const c = t.eva;
  if (combined[c] || (stripSG(c) !== c && combined[stripSG(c)])) newDecoded++;
}

const gain = newDecoded - baseDecoded;
console.log(`New entries:     ${Object.keys(newEntries).length}`);
console.log(`Tokens gained:   +${gain}`);
console.log(`New coverage:    ${newDecoded}/${allTokens.length} = ${(newDecoded/allTokens.length*100).toFixed(2)}%`);
console.log(`Improvement:     ${(baseDecoded/allTokens.length*100).toFixed(2)}% → ${(newDecoded/allTokens.length*100).toFixed(2)}%\n`);

// ═══════════════════════════════════════════════════════════════════════════════
// PART E: CIPHER RULE ANALYSIS — what patterns remain?
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═".repeat(70));
console.log("PART E: CIPHER RULE ANALYSIS — Remaining undecoded patterns");
console.log("═".repeat(70) + "\n");

// Recalculate undecoded with new entries
const stillUndecoded = {};
for (const t of allTokens) {
  const c = t.eva;
  if (!combined[c] && !(stripSG(c) !== c && combined[stripSG(c)])) {
    if (!stillUndecoded[c]) stillUndecoded[c] = 0;
    stillUndecoded[c]++;
  }
}

// Length distribution of remaining undecoded
const lenDist = {};
for (const [w, count] of Object.entries(stillUndecoded)) {
  const len = w.length;
  if (!lenDist[len]) lenDist[len] = { unique: 0, tokens: 0 };
  lenDist[len].unique++;
  lenDist[len].tokens += count;
}

console.log("Remaining undecoded by EVA length:");
console.log("Len  Unique  Tokens");
for (const [len, d] of Object.entries(lenDist).sort((a,b) => parseInt(a[0]) - parseInt(b[0]))) {
  console.log(`  ${String(len).padStart(2)}   ${String(d.unique).padStart(5)}   ${String(d.tokens).padStart(5)}`);
}

// Initial glyph of remaining undecoded (≥3 chars only, excluding fragments)
console.log("\nInitial glyph of remaining undecoded (≥3 chars):");
const initials = {};
for (const [w, count] of Object.entries(stillUndecoded)) {
  if (w.length < 3) continue;
  const tokens = tokenize(w);
  if (tokens.length > 0) {
    const init = tokens[0];
    if (!initials[init]) initials[init] = { unique: 0, tokens: 0 };
    initials[init].unique++;
    initials[init].tokens += count;
  }
}
for (const [g, d] of Object.entries(initials).sort((a,b) => b[1].tokens - a[1].tokens).slice(0, 15)) {
  console.log(`  ${g.padEnd(4)} ${String(d.unique).padStart(5)} unique, ${String(d.tokens).padStart(5)} tokens`);
}

// Top 30 most frequent REMAINING undecoded (≥3 chars)
console.log("\nTop 30 most frequent remaining undecoded (≥3 chars):");
const sorted = Object.entries(stillUndecoded)
  .filter(([w]) => w.length >= 3)
  .sort((a, b) => b[1] - a[1]);

for (const [w, count] of sorted.slice(0, 30)) {
  // Try to decompose through cipher
  const tokens = tokenize(w);

  // Check if any 2-token prefix or suffix decodes
  let partialDecode = "";
  for (let i = 1; i < tokens.length; i++) {
    const prefix = tokens.slice(0, i).join("");
    const suffix = tokens.slice(i).join("");
    const pDec = GLOSS[prefix] || combined[prefix];
    const sDec = GLOSS[suffix] || combined[suffix];
    if (pDec && sDec) {
      partialDecode = `[${prefix}=${pDec}]+[${suffix}=${sDec}]`;
      break;
    } else if (pDec && suffix.length >= 2) {
      partialDecode = `[${prefix}=${pDec}]+[${suffix}=?]`;
    } else if (sDec && prefix.length >= 2) {
      partialDecode = `[${prefix}=?]+[${suffix}=${sDec}]`;
    }
  }

  console.log(`  ${w.padEnd(20)} ${String(count).padStart(3)}×  ${partialDecode}`);
}

// Look for repeating suffix/prefix patterns
console.log("\nCommon endings in remaining undecoded (≥3 chars, ≥3 occurrences):");
const endings = {};
for (const [w] of sorted) {
  if (w.length < 3) continue;
  for (const endLen of [2, 3, 4]) {
    if (w.length > endLen) {
      const end = w.slice(-endLen);
      if (!endings[end]) endings[end] = 0;
      endings[end]++;
    }
  }
}
for (const [end, count] of Object.entries(endings).sort((a,b) => b[1] - a[1]).slice(0, 25)) {
  const glossEnd = GLOSS[end];
  console.log(`  -${end.padEnd(6)} ${String(count).padStart(4)}× ${glossEnd ? "decodes as " + glossEnd : ""}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT: New glossary entries ready to add
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n\n" + "═".repeat(70));
console.log("NEW GLOSSARY ENTRIES TO ADD");
console.log("═".repeat(70) + "\n");

// Sort by token count (most impactful first)
const entryList = Object.entries(newEntries).sort((a, b) => {
  return (undecoded[b[0]] || 0) - (undecoded[a[0]] || 0);
});

// Print as addable JSON
let totalNewTokens = 0;
for (const [k, v] of entryList) {
  totalNewTokens += undecoded[k] || 0;
}

console.log(`Total: ${entryList.length} entries, +${totalNewTokens} tokens\n`);

// Print top 50 by frequency
console.log("Top 50 by frequency:");
for (const [k, v] of entryList.slice(0, 50)) {
  const count = undecoded[k] || 0;
  console.log(`  "${k}":"${v}",  // ${count}×`);
}

if (entryList.length > 50) {
  console.log(`\n  ... and ${entryList.length - 50} more entries (1× each)\n`);
}

// JSON blob for easy pasting
console.log("\nFull JSON blob (for sed insertion):");
const jsonParts = entryList.map(([k, v]) => `"${k}":"${v}"`);
console.log(jsonParts.join(","));
