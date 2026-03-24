#!/usr/bin/env node
// Extract entries from supplementary PDF glossaries
const fs = require('fs');

const allSupplementaryEntries = [];

// ============================================================
// 1. Bos-Hajek glossary (Latin/Italo-Romance in Hebrew chars)
// ============================================================
const bosHajek = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/bos-hajek-glossary.txt', 'utf8');
const bhLines = bosHajek.split('\n');

// Entries have format:
// Hebrew text line: ‫...‬
// Transliteration line: TERM; i.e., TERM2
// Commentary with botanical identifications

// Extract Latin terms with identifications from the commentary
const bhEntries = [];
for (let i = 0; i < bhLines.length; i++) {
  const line = bhLines[i].trim();

  // Look for transliteration lines like "'ZYMW; i.e.; seed of BSYLYQWN"
  // or "HQWQWRBYṬY; i.e., QWQWṢY"
  // or "'PYṬYMW; i.e., the flower 'SṬWRYY'"
  const transMatch = line.match(/^([A-Z'ʾʿṢṬḤḌŠ][A-Z'ʾʿṢṬḤḌŠWYNMRLKBGDHPṣṭḥḍ]+)(?:\s*;\s*i\.e\.,?\s*(.+))?$/);
  if (!transMatch) continue;

  const term1 = transMatch[1];
  const term2 = transMatch[2] || '';

  // Collect commentary
  const commentLines = [];
  for (let j = i + 1; j < Math.min(i + 25, bhLines.length); j++) {
    const nextLine = bhLines[j].trim();
    if (nextLine.match(/^[A-Z'ʾ][A-Z'ʾʿṢṬḤḌŠWYNMRLKBGDHP]+/) && nextLine.includes(';')) break;
    if (nextLine.match(/^\d+\.\s*‫/)) break;
    commentLines.push(nextLine);
  }
  const comment = commentLines.join(' ');

  // Extract botanical names from comment
  const botanicals = [];
  const botPattern = /\b([A-Z][a-z]{2,})\s+([a-z]{2,})(?:\s+(L\.|Lam\.|Willd\.|Mill\.|DC\.|Gaertn\.|Moench\.?|Reichb\.|Bak\.|Desf\.|Pers\.|Sm\.|Savi|Ser\.|Schrad\.|Lmk|Druce))?/g;
  let bm;
  while ((bm = botPattern.exec(comment)) !== null) {
    const skip = ['Latin', 'Greek', 'Hebrew', 'Arabic', 'Italian', 'Tuscan', 'Calabrian', 'Sicilian', 'Romance', 'Medieval', 'Modern', 'Older', 'Similar', 'This', 'That', 'Also', 'However', 'Penzig', 'According', 'Compare', 'Garcia', 'Florence', 'Oxford', 'London', 'Bodleian', 'Cambridge', 'University', 'Department', 'Seminar', 'Neapolitan', 'Abruzzese', 'Lombard', 'Ligurian', 'Paduan', 'Marchigiano', 'Northern', 'Southern', 'Central', 'Western', 'Eastern', 'Artale', 'Zamuner', 'Marinoni', 'Bernardo', 'Rossi', 'Binyamin'];
    if (skip.includes(bm[1])) continue;
    const skipSp = ['characters', 'version', 'versions', 'database', 'edition', 'manuscripts', 'glossary', 'terms', 'tradition', 'literature'];
    if (skipSp.includes(bm[2])) continue;
    const auth = bm[3] || '';
    botanicals.push(auth ? `${bm[1]} ${bm[2]} ${auth}`.trim() : `${bm[1]} ${bm[2]}`);
  }

  // Extract English meaning
  let english = '';
  const engMatch = comment.match(/designates?\s+(?:the\s+)?(?:parasitic\s+)?(?:plant\s+)?(.+?)(?:\s*\(|\s*,\s*(?:in|growing|which))/);
  if (!engMatch) {
    const engMatch2 = comment.match(/[\u2018\u2019'"]([a-z][a-z\s]+?)[\u2018\u2019'"]/);
    if (engMatch2) english = engMatch2[1];
  } else {
    english = engMatch[1];
  }

  bhEntries.push({
    source: 'bos_hajek_oxford',
    latin_term: term1,
    romance_term: term2.replace(/^(?:the flower |seed of |i\.e\.,?\s*)/, ''),
    botanical: botanicals.length > 0 ? botanicals[0] : '',
    botanical_all: botanicals.length > 1 ? botanicals : undefined,
    english: english || '',
  });
}

console.log(`Bos-Hajek: ${bhEntries.length} entries`);
allSupplementaryEntries.push(...bhEntries);

// ============================================================
// 2. Arabic-Romance glossary (Vatican MSS)
// ============================================================
const arabRom = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/arabic-romance-glossary.txt', 'utf8');
const arLines = arabRom.split('\n');

// This PDF has a more discursive format. Extract entries from sections describing
// specific lists (MS 356, 361, 365, 417)
// Look for entry patterns like: (N) TERM: TERM2
// or numbered entries within sections

const arEntries = [];
for (let i = 0; i < arLines.length; i++) {
  const line = arLines[i].trim();

  // Pattern: (N) TERM1 / TERM2: description
  // or: In entry (N), TERM represents...
  // The entries are discussed within running text, hard to extract systematically
  // Focus on extracting botanical identifications mentioned alongside Arabic/Romance terms

  // Look for patterns like: 'plantain' (Plantago major L.)
  // or: 'myrtle' (Myrtus communis L.)
  const idPattern = /[\u2018']([a-z][a-z\s]+?)[\u2019']\s*\(([A-Z][a-z]+\s+[a-z]+(?:\s+L\.)?)\)/g;
  let im;
  while ((im = idPattern.exec(line)) !== null) {
    const english = im[1];
    const botanical = im[2];
    // Only add if it looks like a real entry
    if (english.length < 40 && botanical.match(/^[A-Z][a-z]+\s+[a-z]{3,}/)) {
      arEntries.push({
        source: 'arabic_romance_vatican',
        english: english,
        botanical: botanical,
      });
    }
  }
}

// Deduplicate
const arDeduped = [];
const arSeen = new Set();
for (const e of arEntries) {
  const key = `${e.english}|${e.botanical}`;
  if (!arSeen.has(key)) {
    arSeen.add(key);
    arDeduped.push(e);
  }
}

console.log(`Arabic-Romance Vatican: ${arDeduped.length} entries`);
allSupplementaryEntries.push(...arDeduped);

// ============================================================
// 3. Shem Tov Glossary article (first 18 Alef entries - already in main)
// These overlap with shimmush-text.txt entries, so just note them
// ============================================================
const stGloss = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/shem-tov-glossary.txt', 'utf8');
const stEntries = [];
const stLines = stGloss.split('\n');

for (let i = 0; i < stLines.length; i++) {
  const line = stLines[i].trim();
  // Format: term, Arab. arabic, vern. vernacular
  const m = line.match(/^([a-z']+(?:\s+[a-z']+)*),\s*Arab\.\s*([a-z']+(?:\s+[a-z'-]+)*),?\s*(?:vern\.\s*(.+))?$/i);
  if (m) {
    const hebrew = m[1].trim();
    const arabic = m[2].trim();
    const vernacular = m[3] ? m[3].trim() : '';

    // Get botanical from nearby lines
    const comment = stLines.slice(i + 1, i + 15).join(' ');
    const bots = [];
    const bp = /\b([A-Z][a-z]{2,})\s+([a-z]{2,})(?:\s+(L\.|Willd\.|Mill\.))?/g;
    let bm2;
    while ((bm2 = bp.exec(comment)) !== null) {
      const skip2 = ['Hebrew', 'Arabic', 'Latin', 'This', 'For', 'The', 'Aramaic', 'Greek', 'Biblical', 'Rabbinic'];
      if (!skip2.includes(bm2[1])) {
        bots.push(bm2[3] ? `${bm2[1]} ${bm2[2]} ${bm2[3]}` : `${bm2[1]} ${bm2[2]}`);
      }
    }

    stEntries.push({
      source: 'shem_tov_jqr_article',
      hebrew: hebrew,
      arabic: arabic,
      vernacular: vernacular,
      botanical: bots.length > 0 ? bots[0] : '',
    });
  }
}

console.log(`Shem Tov JQR article: ${stEntries.length} entries (overlap with main list)`);
allSupplementaryEntries.push(...stEntries);

// ============================================================
// 4. Medieval Provence synonyms PDF
// ============================================================
let mpExists = false;
try {
  const mp = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/medieval-prov-synonyms.txt', 'utf8');
  if (mp.length > 100) {
    mpExists = true;
    // Check if it has usable content
    const mpLines = mp.split('\n');
    let arabCount = 0;
    for (const l of mpLines) {
      if (l.includes(', Arab.')) arabCount++;
    }
    console.log(`Medieval Provence synonyms: ${mpLines.length} lines, ${arabCount} entries with 'Arab.'`);
    // This is likely another version of the same Shimmush text, so skip to avoid duplication
    if (arabCount > 100) {
      console.log('  (Appears to be duplicate of main Shimmush text, skipping)');
    }
  }
} catch (e) {
  console.log('Medieval Provence synonyms: not available');
}

// ============================================================
// Write combined output
// ============================================================
console.log(`\nTotal supplementary entries: ${allSupplementaryEntries.length}`);

// Show samples
console.log('\nSample entries:');
for (const idx of [0, 1, 5, 10, 20, 30, 40, 50, 60, 70]) {
  if (idx < allSupplementaryEntries.length) {
    const e = allSupplementaryEntries[idx];
    console.log(`[${idx}]`, JSON.stringify(e));
  }
}

fs.writeFileSync('/Users/scott/voynich-workbench/tools/shem-tov/supplementary-entries.json', JSON.stringify(allSupplementaryEntries, null, 2));
console.log('\nWritten to supplementary-entries.json');
