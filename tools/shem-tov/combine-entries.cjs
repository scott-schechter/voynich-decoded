#!/usr/bin/env node
// Combine all extracted entries into a single JSON file
const fs = require('fs');

// Load main Shimmush entries
const shimmush = JSON.parse(fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/shimmush-entries.json', 'utf8'));

// Load Almansur entries
const almansur = JSON.parse(fs.readFileSync('/Users/scott/voynich-workbench/tools/shem-tov/almansur-entries.json', 'utf8'));

// Manually add key entries from Bos-Hajek Oxford glossary (small number, discursive format)
const bosHajek = [
  { source: 'bos_hajek_oxford', latin_term: 'SNSWQWS', romance_term: "M'YWRNH", botanical: 'Origanum maiorana L.', english: 'marjoram' },
  { source: 'bos_hajek_oxford', latin_term: "'PYṬYMW", romance_term: "'SṬWRYY'", botanical: 'Cuscuta epithymum L.', english: 'dodder' },
  { source: 'bos_hajek_oxford', latin_term: "'ZYMW", romance_term: 'BSYLYQWN', botanical: 'Ocimum basilicum L.', english: 'basil' },
  { source: 'bos_hajek_oxford', latin_term: 'HQWQWRBYṬY', romance_term: 'QWQWṢY', botanical: 'Lagenaria vulgaris Ser.', english: 'gourd/calabash' },
  { source: 'bos_hajek_oxford', latin_term: "Q'LMYNṬY", romance_term: "MYNṬWṢ'", botanical: 'Calamintha nepeta Savi', english: 'catmint' },
  { source: 'bos_hajek_oxford', latin_term: "'RYNGWLWSH", romance_term: "PLNṬ'YYNY", botanical: 'Plantago major L.', english: 'plantain' },
  { source: 'bos_hajek_oxford', latin_term: 'RWMYṢY', romance_term: 'RWMYṢY', botanical: 'Rumex acutus', english: 'sorrel' },
  { source: 'bos_hajek_oxford', latin_term: "'LṬYY'", romance_term: "MLBY", botanical: 'Althaea officinalis L.', english: 'marshmallow' },
  { source: 'bos_hajek_oxford', latin_term: "'RBH LYṬR'DH", romance_term: "'SQWLWPNDRY'", botanical: 'Asplenium ceterach L.', english: 'spleenwort' },
  { source: 'bos_hajek_oxford', latin_term: 'ŠMŠWQWŠ', romance_term: "M'YWRNH", botanical: 'Origanum maiorana L.', english: 'marjoram' },
  { source: 'bos_hajek_oxford', latin_term: 'PYRYṬRW', romance_term: '', botanical: 'Anacyclus pyrethrum DC.', english: 'pellitory' },
  { source: 'bos_hajek_oxford', latin_term: "'RWṬD'", romance_term: '', botanical: 'Ruta graveolens L.', english: 'rue' },
  { source: 'bos_hajek_oxford', latin_term: "ŠQMWNY'", romance_term: '', botanical: 'Convolvulus scammonia L.', english: 'scammony' },
];

// Key entries from Arabic-Romance Vatican glossary article
const arabicRomance = [
  { source: 'arabic_romance_vatican', arabic: "'PSNTYN", botanical: 'Artemisia absinthium L.', english: 'wormwood/absinth' },
  { source: 'arabic_romance_vatican', arabic: "'SPYD'G", botanical: '', english: 'white lead/ceruse' },
  { source: 'arabic_romance_vatican', arabic: 'HNṮY', botanical: 'Asphodelus ramosus L.', english: 'asphodel' },
  { source: 'arabic_romance_vatican', arabic: "'Q.ḤWĀN", botanical: 'Anthemis', english: 'chamomile' },
  { source: 'arabic_romance_vatican', arabic: 'BRQWQ', botanical: 'Prunus armeniaca', english: 'apricot' },
  { source: 'arabic_romance_vatican', arabic: "'S ('ĀS)", botanical: 'Myrtus communis L.', english: 'myrtle' },
  { source: 'arabic_romance_vatican', arabic: 'RYḤĀN', botanical: 'Ocimum basilicum L.', english: 'basil/sweet basil' },
  { source: 'arabic_romance_vatican', arabic: "'SṬWḤWDWS", botanical: 'Lavendula stoechas L.', english: 'French lavender' },
  { source: 'arabic_romance_vatican', arabic: "'ṮMID", botanical: '', english: 'stibium/antimony' },
  { source: 'arabic_romance_vatican', arabic: "MWRT'N", botanical: 'Myrtus communis L.', english: 'myrtle (Hispano-Arabic)' },
];

// Build the combined output
const combined = {
  metadata: {
    title: 'Medical Synonym Lists from Medieval Provence',
    description: 'Extracted entries from Shem Tov ben Isaac of Tortosa, Sefer ha-Shimmush Book 29, and supplementary sources',
    sources: [
      {
        id: 'shimmush_list1',
        title: 'Sefer ha-Shimmush, Book 29, Synonym List 1 (Hebrew-Arabic-Romance/Latin)',
        reference: 'Bos, Hussein, Mensching, Savelsberg (eds.), Brill 2011',
        entries: shimmush.length,
      },
      {
        id: 'sefer_almansur',
        title: 'Sefer Almansur (Medical Glossaries in the Hebrew Tradition)',
        reference: 'Bos, Mensching, Zwink (eds.), Brill 2017',
        entries: almansur.length,
      },
      {
        id: 'bos_hajek_oxford',
        title: 'Latin/Italo-Romance Glossary, Ms. Oxford Bodleian Opp. 688',
        reference: 'Bos, Hajek, Kogman-Appel, Mensching, Aleph 19.2 (2019)',
        entries: bosHajek.length,
      },
      {
        id: 'arabic_romance_vatican',
        title: 'Arabic-Romance Glossaries in Hebrew MSS (Vatican Library)',
        reference: 'Bos and Mensching, Aleph 15.1 (2015)',
        entries: arabicRomance.length,
      },
    ],
    extraction_date: '2026-03-22',
    total_entries: shimmush.length + almansur.length + bosHajek.length + arabicRomance.length,
  },
  shimmush_list1: shimmush,
  sefer_almansur: almansur,
  bos_hajek_oxford: bosHajek,
  arabic_romance_vatican: arabicRomance,
};

fs.writeFileSync('/Users/scott/voynich-workbench/tools/shem-tov/shimmush-entries.json', JSON.stringify(combined, null, 2));

console.log('Combined output written to shimmush-entries.json');
console.log(`  Shimmush List 1: ${shimmush.length} entries`);
console.log(`  Sefer Almansur: ${almansur.length} entries`);
console.log(`  Bos-Hajek Oxford: ${bosHajek.length} entries`);
console.log(`  Arabic-Romance Vatican: ${arabicRomance.length} entries`);
console.log(`  Total: ${combined.metadata.total_entries} entries`);

// Also report stats
const withBotanical = shimmush.filter(e => e.botanical).length + almansur.filter(e => e.botanical).length + bosHajek.filter(e => e.botanical).length + arabicRomance.filter(e => e.botanical).length;
const withEnglish = shimmush.filter(e => e.english).length + almansur.filter(e => e.english).length + bosHajek.filter(e => e.english).length + arabicRomance.filter(e => e.english).length;
const withRomance = shimmush.filter(e => e.romance_latin).length;
console.log(`\nWith botanical ID: ${withBotanical}`);
console.log(`With English name: ${withEnglish}`);
console.log(`With Romance/Latin term: ${withRomance} (Shimmush only)`);
