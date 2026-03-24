#!/usr/bin/env node
// Extract structured entries from Shem Tov's Sefer ha-Shimmush synonym list
const fs = require('fs');

const text = fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/shimmush-text.txt', 'utf8');
const lines = text.split('\n');

const entries = [];
let currentSection = '';

// Words that should NOT be botanical genus names
const NON_GENUS = new Set([
  'Biblical', 'Hebrew', 'Arabic', 'Aramaic', 'Mishnaic', 'Rabbinic', 'Medieval', 'Latin',
  'Romance', 'Catalan', 'French', 'Italian', 'Spanish', 'Middle', 'Modern', 'According',
  'However', 'Instead', 'Similar', 'Since', 'Nevertheless', 'Also', 'Note', 'The', 'This',
  'These', 'Those', 'While', 'Where', 'When', 'Which', 'About', 'Between', 'Before', 'After',
  'Under', 'Above', 'Below', 'During', 'Within', 'Without', 'Besides', 'Because', 'Whether',
  'Although', 'Against', 'Among', 'Amongst', 'Other', 'Another', 'Every', 'Either', 'Neither',
  'Both', 'Such', 'Each', 'Some', 'Many', 'Most', 'Several', 'Various', 'Jewish', 'Greek',
  'Persian', 'German', 'English', 'Christian', 'Muslim', 'Occitan', 'Berber', 'Indian',
  'Egyptian', 'Syriac', 'Babylonian', 'Northern', 'Southern', 'Western', 'Eastern',
  'Broadly', 'Firstly', 'Secondly', 'Moreover', 'Furthermore', 'Concerning', 'Compare',
  'Library', 'University', 'Congress', 'Amsterdam', 'Berlin', 'Leiden', 'Boston', 'London',
  'Paris', 'Jerusalem', 'Cairo', 'Baghdad', 'Oxford', 'Cambridge', 'Brill', 'Gerrit',
  'Martina', 'Guido', 'Frank', 'Probably', 'Possibly', 'Already', 'Frequently', 'Translated',
  'Maimonides', 'Rashi', 'Translation', 'Book', 'Chapter', 'Entry', 'Section', 'Volume',
  'Edition', 'Commentary', 'Appendix', 'Table', 'Figure', 'Glossary', 'Index', 'Review',
  'Studies', 'Medical', 'Semitic', 'Philology', 'Gaon', 'Talmud', 'Mishna', 'Mishnah',
  'Torah', 'Bible', 'Comparative', 'Historical', 'Revue', 'Bulletin', 'Journal',
  'Dictionary', 'Dictionaries', 'Geonim', 'Shaping', 'Culture', 'Haven', 'Allony',
  'New', 'Old', 'For', 'See', 'Damascus', 'Document', 'Supplementary', 'Botanical',
  'Identification', 'Syrian', 'Die', 'Der', 'Das', 'Eine', 'Zur', 'Und', 'Les', 'Des',
  'Aux', 'Published', 'Printed', 'Compiled', 'Composed', 'Written', 'Quoted', 'Mentioned',
  'Discussed', 'Identified', 'Documented', 'Attested', 'Reported', 'Described', 'Recorded',
  'Cited', 'Referenced', 'Based', 'Traditionally', 'Generally', 'Specifically',
  'Particularly', 'Exclusively', 'Interestingly', 'Differently', 'Alternatively',
  'Unfortunately', 'Previously', 'Take', 'Priests', 'Temple', 'Levites', 'Israelites',
  'Golden', 'Elisha', 'Sometimes', 'Irregular', 'And', 'But', 'Not', 'Its', 'Has', 'Had',
  'Was', 'Are', 'Can', 'May', 'Will', 'Shall', 'Would', 'Could', 'Should', 'Must',
  'Being', 'Having', 'Doing', 'Going', 'Coming', 'Taking', 'Making', 'Looking', 'Getting',
  'Giving', 'Keeping', 'Putting', 'Running', 'Turning', 'Bringing', 'Thinking', 'Leaving',
  'Telling', 'Saying', 'Reading', 'Writing', 'Working', 'Playing', 'Starting', 'Following',
  'Including', 'Containing', 'Providing', 'Regarding', 'Representing', 'Referring',
  'Showing', 'Leading', 'Living', 'Pointing', 'Belonging',
  'Thought', 'Kabbalah', 'Genizah', 'Talmudic', 'Arab', 'Bos', 'Maman',
  'Munk', 'Samuel', 'Tibbon', 'Crescas', 'Moses', 'Wartburg', 'Rufus',
  'Dalet', 'Cypriot', 'Who', 'Waw', 'Alef', 'Bet', 'Gimel', 'Het', 'Tet',
  'Yod', 'Kaf', 'Lamed', 'Mem', 'Nun', 'Samekh', 'Ayin', 'Qof', 'Resh',
  'Shin', 'Tav', 'Zayin', 'Sade', 'Shem', 'Isaac', 'Tortosa', 'Dalman',
  'European', 'Palestinian', 'Sahidic', 'Tov',
]);

const NON_SPECIES = new Set([
  'means', 'also', 'term', 'word', 'name', 'form', 'type', 'kind', 'used', 'same',
  'from', 'with', 'into', 'that', 'this', 'which', 'where', 'when', 'what', 'been',
  'were', 'have', 'here', 'there', 'more', 'than', 'then', 'them', 'they', 'thus',
  'each', 'both', 'such', 'well', 'only', 'just', 'like', 'made', 'most', 'some',
  'very', 'does', 'done', 'gave', 'give', 'come', 'came', 'take', 'took', 'make',
  'says', 'said', 'above', 'below', 'book', 'list', 'edition', 'entry', 'text', 'note',
  'page', 'chapter', 'section', 'volume', 'part', 'table', 'figure', 'line', 'translated',
  'identifies', 'designated', 'documented', 'attested', 'recorded', 'mentioned',
  'discussed', 'reported', 'described', 'cited', 'features', 'appears', 'occurs', 'found',
  'known', 'called', 'named', 'refers', 'related', 'derived', 'borrowed', 'loaned',
  'originated', 'denotes', 'signifies', 'represents', 'indicates', 'designates',
  'points', 'belongs', 'contains', 'includes', 'consists', 'constitutes', 'comprises',
  'provides', 'offers', 'gives', 'shows', 'presents', 'displays', 'reveals',
  'see', 'and', 'remarks', 'onions', 'writers', 'fragments', 'commentaries',
  'representing', 'demonstrated', 'von', 'suggests', 'sharp',
]);

// Entry line pattern
const entryPattern = /^(.+?),\s*Arab\.\s*(.+)/;

function isEntryLine(line) {
  const m = line.match(entryPattern);
  if (!m) return false;
  const hebrew = m[1].trim();
  // Skip prose
  // Skip prose lines - require exact word match (case-sensitive for most)
  if (hebrew.match(/^(Hebrew |Arabic |Aramaic |The |This |In |For |On |Its |See |Cf\.|cf\.|According |However |Since |While |Note |Also |MS |op\.|ibid\.|loc\.|i\.e\.|where |and |but |or the |as the |it is|is the|we |no\.|by the|to the)/)) return false;
  if (hebrew.length > 60) return false;
  // Entry Hebrew terms are typically uppercase ASCII transliteration
  if (hebrew.match(/^[A-ZĞS̆#".()\/ ]+$/)) return true;
  // Also allow terms with "or" joining two Hebrew terms
  if (hebrew.match(/^[A-ZĞS̆#".()\/ ]+ or [A-ZĞS̆#".()\/ ]+$/)) return true;
  // Allow terms starting with uppercase
  if (hebrew.match(/^[A-Z"#.]/)) return true;
  return false;
}

function extractBotanicals(commentText) {
  const botanicals = [];
  // Standard: Genus species [Authority]
  const pattern = /\b([A-Z][a-z]{2,})\s+([a-z]{2,})(?:\s+(L\.|Lam\.|Willd\.|Mill\.|DC\.|Gaertn\.|Moench\.?|Reichb\.|Bak\.|Desf\.|Pers\.|Boiss\.|Sm\.|Savi|Huds\.|Scop\.|Schrad\.|Spreng\.|Thunb\.|Roxb\.|Benth\.|Hook\.|Torr\.|R\.\s*Br\.|Forssk\.|Blume|Sieb\.|Zucc\.|Jacq\.|Link|Cav\.|Roem\.))?/g;
  let match;
  while ((match = pattern.exec(commentText)) !== null) {
    const genus = match[1];
    const species = match[2];
    const authority = match[3] || '';
    if (NON_GENUS.has(genus)) continue;
    if (NON_SPECIES.has(species)) continue;
    if (species.length < 3) continue;
    const full = authority ? `${genus} ${species} ${authority}`.trim() : `${genus} ${species}`;
    botanicals.push(full);
  }
  // Also catch old-style Genus Species (uppercase species, used in older nomenclature)
  const oldPattern = /\b([A-Z][a-z]{2,})\s+([A-Z][a-z]{2,})(?=\s|,|\.|$)/g;
  while ((match = oldPattern.exec(commentText)) !== null) {
    const genus = match[1];
    const species = match[2];
    if (NON_GENUS.has(genus)) continue;
    if (NON_GENUS.has(species)) continue;
    // Must look like a botanical name: check context (nearby L., var., etc.)
    const ctx = commentText.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20);
    if (ctx.match(/\b(L\.|Lam\.|var\.|genus|species|family|plant|tree|herb)\b/i) ||
        commentText.substring(match.index - 5, match.index).match(/,\s*$/)) {
      botanicals.push(`${genus} ${species}`);
    }
  }
  return [...new Set(botanicals)];
}

function extractEnglish(commentText) {
  // The text uses Unicode curly quotes: \u201c \u201d \u2018 \u2019
  const dq = '[\u201c\u201d"]'; // double quotes
  const sq = '[\u2018\u2019\']'; // single quotes

  const patterns = [
    new RegExp(`means\\s+${dq}([^\\u201c\\u201d"]{3,50})${dq}`),
    new RegExp(`means\\s+${sq}([^\\u2018\\u2019']{3,50})${sq}`),
    new RegExp(`means\\s+${dq}([^\\u201c\\u201d"]{3,50})${dq}`),
    new RegExp(`is\\s+(?:the\\s+)?${dq}([^\\u201c\\u201d"]{3,40})${dq}(?:\\s*[,.])`),
    new RegExp(`is\\s+(?:the\\s+)?${sq}([^\\u2018\\u2019']{3,40})${sq}(?:\\s*[,.])`),
    new RegExp(`for\\s+${sq}([^\\u2018\\u2019']{3,40})${sq}`),
    new RegExp(`designates?\\s+${dq}([^\\u201c\\u201d"]{3,40})${dq}`),
    new RegExp(`designates?\\s+${sq}([^\\u2018\\u2019']{3,40})${sq}`),
    new RegExp(`refers?\\s+to\\s+(?:the\\s+)?${dq}([^\\u201c\\u201d"]{3,40})${dq}`),
    new RegExp(`refers?\\s+to\\s+(?:the\\s+)?${sq}([^\\u2018\\u2019']{3,40})${sq}`),
  ];

  for (const p of patterns) {
    const m = commentText.match(p);
    if (m) {
      const name = m[1].trim();
      if (!name.match(/^[A-Z#". ]+$/) && !name.match(/[\u0590-\u05FF]/) && !name.match(/^\d/)) {
        return name;
      }
    }
  }
  return '';
}

function extractOccitan(commentText) {
  const m = commentText.match(/O\.\s*Occ\.\s+([a-zA-Zéèàùòïüöäâêîôûç\/\-]+)/);
  if (m && !['or', 'and', 'form', 'is', 'the', 'a', 'an', 'to', 'in', 'on', 'at', 'by', 'of'].includes(m[1]) && m[1].length > 1) {
    return m[1];
  }
  return '';
}

// Main extraction loop
for (let i = 0; i < lines.length; i++) {
  const rawLine = lines[i];
  const line = rawLine.replace(/\f/g, '').trim();

  // Detect section headers
  const secMatch = line.match(/^(ALEF|BET|GIMEL|DALET|HE|WAW|ZAYIN|HET|\.?TET|YOD|KAF|LAMED|MEM|NUN|SAMEKH|AYIN|PE|\.?SADE|QOF|RESH|SHIN|TAV)\d*$/);
  if (secMatch) {
    currentSection = secMatch[1].replace(/^\./, '');
    continue;
  }

  // Also detect lowercase page-header section names
  if (i > 4800) {
    const secMatch2 = line.match(/^(alef|bet|gimel|dalet|he|waw|zayin|het|\.?tet|yod|kaf|lamed|mem|nun|samekh|ayin|pe|\.?sade|qof|resh|shin|tav)$/);
    if (secMatch2) {
      currentSection = secMatch2[1].toUpperCase().replace(/^\./, '');
      continue;
    }
  }

  // Skip before edition starts
  if (i < 4800) continue;

  // Match entry lines
  if (!isEntryLine(line)) continue;

  const m = line.match(entryPattern);
  let hebrew = m[1].trim();
  let rest = m[2].trim();

  // Parse Arabic and o.l.
  let arabic = '';
  let romance = '';

  // Check for o.l. on this line
  const olMatch = rest.match(/^(.+?),\s*o\.l\.\s*(.+)/);
  if (olMatch) {
    arabic = olMatch[1].trim();
    romance = olMatch[2].trim();
  } else {
    arabic = rest;
    // Look ahead for o.l. on next 3 lines
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const nextLine = lines[j].replace(/\f/g, '').trim();
      const olNext = nextLine.match(/^\.?\s*o\.l\.\s*(.+)/);
      if (olNext) {
        romance = olNext[1].trim();
        break;
      }
      if (nextLine.match(/o\.l\.\s+/)) {
        const olEmbed = nextLine.match(/o\.l\.\s+(.+)/);
        if (olEmbed) {
          romance = olEmbed[1].trim();
          break;
        }
      }
      if (nextLine.match(/^(Hebrew|Arabic|Aramaic|Biblical|Mishnaic|Rabbinic|The |For |In |This )/)) break;
    }
  }

  // Clean up Arabic
  arabic = arabic.replace(/[,;]\s*(and this|and therefore|these are|the Sages|i\.e\.|it is|which is|that|in the|o\.l\.).*$/i, '');
  arabic = arabic.replace(/\s*\d+$/, '');
  arabic = arabic.replace(/[;,]\s*$/, '').trim();

  // Clean up romance
  romance = romance.replace(/[,;]\s*(these|this is|from |i\.e\.|and this|it is|which|that|in the|the Sages|from its).*$/i, '');
  romance = romance.replace(/\s*\d+$/, '');
  romance = romance.replace(/[;,]\s*$/, '').trim();

  // Collect commentary lines - first ~15 lines for botanical/English, then stop
  // to avoid picking up unrelated plants from footnotes
  const commentLines = [];
  for (let j = i + 1; j < Math.min(i + 25, lines.length); j++) {
    const nextLine = lines[j].replace(/\f/g, '').trim();
    // Stop at next entry
    if (j > i + 1 && isEntryLine(nextLine)) break;
    // Stop at Hebrew text (entry header in Hebrew chars)
    if (nextLine.match(/^\.\s+\d*[äàáâãåæçèéëìîðñòôöøùú]/)) break;
    commentLines.push(nextLine);
  }

  const commentText = commentLines.join(' ');
  const botanicals = extractBotanicals(commentText);
  const english = extractEnglish(commentText);
  const occitan = extractOccitan(commentText);

  const entry = {
    section: currentSection,
    hebrew: hebrew,
    arabic: arabic,
    romance_latin: romance || '',
    botanical: botanicals.length > 0 ? botanicals[0] : '',
    english: english || '',
  };

  if (botanicals.length > 1) entry.botanical_all = botanicals;
  if (occitan) entry.occitan = occitan;

  entries.push(entry);
}

// Stats
console.log(`Extracted ${entries.length} entries`);

const sectionCounts = {};
for (const e of entries) {
  sectionCounts[e.section] = (sectionCounts[e.section] || 0) + 1;
}
console.log('By section:', JSON.stringify(sectionCounts, null, 2));

const withOl = entries.filter(e => e.romance_latin);
console.log(`Entries with romance/latin term: ${withOl.length}`);

const withBot = entries.filter(e => e.botanical);
console.log(`Entries with botanical ID: ${withBot.length}`);

const withEng = entries.filter(e => e.english);
console.log(`Entries with English name: ${withEng.length}`);

const withOcc = entries.filter(e => e.occitan);
console.log(`Entries with Occitan: ${withOcc.length}`);

// Show some examples
console.log('\nSample entries:');
for (const idx of [0, 1, 2, 3, 10, 50, 100, 200, 300, 400, 500, 600]) {
  if (idx < entries.length) {
    console.log(`[${idx}]`, JSON.stringify(entries[idx]));
  }
}

// Write output
fs.writeFileSync('/Users/scott/voynich-workbench/tools/shem-tov/shimmush-entries.json', JSON.stringify(entries, null, 2));
console.log(`\nWritten ${entries.length} entries to shimmush-entries.json`);
