#!/usr/bin/env node
// Extract entries from the Sefer Almansur (Medical Glossaries PDF)
const fs = require('fs');

const text = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/medical-glossaries.txt', 'utf8');
const lines = text.split('\n');

const entries = [];
let currentSection = '';

// The Sefer Almansur entries appear in English translation sections as:
// "English name (Botanical name): Description"
// Or "English name (Botanical name var.): Description"
// The section headers are Hebrew letter names (Alef, Bet, etc.)

const sectionPattern = /^(Alef|Bet|Gimel|Dalet|He|Waw|Zayin|Het|Tet|Yod|Kaf|Lamed|Mem|Nun|Samekh|Ayin|Pe|Sade|Qof|Resh|Shin|Tav)$/;

// Entry pattern: English name (Botanical name): description
// Examples: "Asarabacca (Asarum Europaeum): It is hot..."
// "French lavender (Lavendula stoechas): It is hot..."
// "blbws; i.e., an edible onion (tassel hyacinth, Leopoldia comosa, synonym: Muscari comosum):"
const entryPattern = /^([A-Z][a-zA-Z\s\/\-']+?)\s*\(([^)]+)\)(?:\s*(?:and\s+Var\.?|;))?\s*:/;
// Also: "term; i.e., description (Botanical name):"
const altEntryPattern = /^([a-zA-Z'ʾ]+)\s*;\s*i\.e\.,\s*([^(]+)\(([^)]+)\)/;
// Also: lowercase Hebrew transliteration entries
const hebrewEntryPattern = /^([a-zA-Zʾʿṣṭḥḍ]+)\s*\(([^)]+)\)\s*:/;
// Also: "English name (synonym: X; Scientific name):" or similar
const romancePattern = /Romance\s+([a-zA-Z']+)/;

// Footnote pattern that contains Hebrew transliteration and references
const footnotePattern = /^\d+\s+"([^"]+)"\s+\(([^)]+)\)/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // Track sections
  const secMatch = line.match(sectionPattern);
  if (secMatch) {
    currentSection = secMatch[1].toUpperCase();
    continue;
  }

  // Try main entry pattern
  let m = line.match(entryPattern);
  if (m) {
    const english = m[1].trim();
    let botanical = m[2].trim();

    // Skip if this is in introduction (before line ~900)
    if (i < 900) continue;

    // Clean botanical - extract the Latin name
    // May contain things like "fruit of Phyllanthus Emblica" or "a product of Dorema Ammoniacum Don."
    let cleanBotanical = botanical;
    const prodMatch = botanical.match(/(?:a product of|fruit of|gum resin of|rhizome of)\s+(.+)/i);
    if (prodMatch) cleanBotanical = prodMatch[1];

    // Get romance term if present
    let romance = '';
    const romMatch = line.match(/Romance\s+([a-zA-Z']+)/);
    if (romMatch) romance = romMatch[1];

    // Get Hebrew transliteration from footnotes
    let hebrewTranslit = '';
    // Look in nearby footnote lines
    for (let j = i; j < Math.min(i + 30, lines.length); j++) {
      const fLine = lines[j].trim();
      const fMatch = fLine.match(new RegExp(`"${english.replace(/[/\\()]/g, '\\$&')}"\\s+\\(([^)]+)\\)`));
      if (fMatch) {
        hebrewTranslit = fMatch[1];
        break;
      }
    }

    entries.push({
      source: 'sefer_almansur',
      section: currentSection,
      english: english,
      botanical: cleanBotanical,
      hebrew_translit: hebrewTranslit || '',
      romance: romance,
    });
    continue;
  }

  // Try alt pattern: "term; i.e., description (Botanical name):"
  m = line.match(altEntryPattern);
  if (m && i > 900) {
    entries.push({
      source: 'sefer_almansur',
      section: currentSection,
      english: m[2].trim(),
      botanical: m[3].trim(),
      hebrew_translit: m[1].trim(),
      romance: '',
    });
    continue;
  }
}

// Also extract entries from the footnotes which have the pattern:
// N "English name" (hebrew_translit): Cf. ...
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const fnPattern = /(\d+)\s+"([^"]+)"\s+\(([^)]+)\):\s*Cf\./g;
  let fm;
  while ((fm = fnPattern.exec(line)) !== null) {
    const english = fm[2];
    const translit = fm[3];
    // Check if already in entries
    if (!entries.find(e => e.hebrew_translit === translit && e.english === english)) {
      // Only add if not already captured from main text
    }
  }
}

console.log(`Extracted ${entries.length} entries from Sefer Almansur`);

const sectionCounts = {};
for (const e of entries) {
  sectionCounts[e.section] = (sectionCounts[e.section] || 0) + 1;
}
console.log('By section:', JSON.stringify(sectionCounts, null, 2));

console.log('\nSample entries:');
for (const idx of [0, 1, 2, 5, 10, 20, 50, 100, 150, 200]) {
  if (idx < entries.length) {
    console.log(`[${idx}]`, JSON.stringify(entries[idx]));
  }
}

fs.writeFileSync('/Users/scott/voynich-workbench/tools/shem-tov/almansur-entries.json', JSON.stringify(entries, null, 2));
console.log(`\nWritten to almansur-entries.json`);
