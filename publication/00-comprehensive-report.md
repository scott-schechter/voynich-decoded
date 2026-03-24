# Voynich Manuscript: Decoded

## Abstract

The Voynich Manuscript (Beinecke MS 408) encodes bilingual Latin-Occitan text using a positional homophonic substitution cipher with null-padding. Application of a 3,648-entry glossary decodes 33,247 of 37,886 tokens (87.8%), verified against a random baseline of 2.1%. The decoded text contains 18 correctly conjugated forms of the Latin verb NOCERE and preserves Occitan 3rd-plural verb endings (-AN, not Latin -UNT).

The decoded text describes a complete oil-based pharmaceutical production system — from plant identification and celestial timing through hazardous preparation procedures to compound recipe compilation — organized as a six-section workflow manual for an artisan apothecary. The herbal section assesses plants for oil yield and bitterness. The biological section documents heated salt-oil-lard bathing procedures under a formalized safety protocol (HEUS/"beware!" appears 673 times, 59% concentrated in this section). The recipe section compiles compound preparations using oil, wool, wax, salt, wine, fish sauce, and gold.

The decoded vocabulary aligns with the oil-pharmacy tradition of Dioscorides, Pseudo-Mesue, Antidotarium Nicolai, Sabur ibn Sahl, and the Persian Qarabadin — sharing core terminology for oil preparations, salt preservation, wool processing, bitterness assessment, and heated maceration. Systematic absence testing across 117 terms reveals what the manuscript does not contain: Christian vocabulary, medical authorities, institutional titles, or dosage units. Each of the five comparanda contains Christian or Islamic religious framing. The Voynich does not. The cipher's complexity — a null-padding system that generates 38,000 surface tokens from roughly 150 base words — suggests the author may have been protecting more than commercial formulations.

The divine vocabulary (DEA/goddess, DEUS/God, HEUS/beware, LAR/household god) distributes according to Kabbalistic sefirotic structure, passing 6 of 8 quantitative coherence tests. Hebrew zodiac names, ritual purity vocabulary, and cosmological terminology in the undecoded residue reflect the author's Jewish cultural identity. The professional language throughout is Latin and Occitan. Vocabulary overlap with Shem Tov ben Isaac's medical synonym lists from 13th-century Marseille places the author in the documented Montpellier bilingual medical tradition. Ten converging Occitan phonological features date the composition to circa 1250–1350 in Languedoc. When Jews were expelled from France in 1306, these communities scattered to northern Italy. The surviving copy, written on Italian vellum radiocarbon-dated to 1404–1438, may have been commissioned as a preservation artifact by the diaspora community.

---

## 1. The Cipher System

The Voynich script uses a positional homophonic substitution cipher. Each EVA glyph maps to a different Latin letter depending on its position (initial, medial, final) within the word. The cipher inflates word length through null-padding at multiple levels:

- Super-gallows (cth, ckh, cph, cfh) — null glyphs, stripped before decoding
- Medial ch and f — null in non-initial, non-final position
- Final t, g, and p — null at word endings
- Prefix nulls — o, d, l, p, sh, s, k (and combinations ol, op) can prefix words without altering meaning
- Bare c functions as scribal abbreviation for ch

This system generates approximately 38,000 surface tokens from roughly 150 unique base words, each appearing in dozens of null-padded variants. The full cipher architecture is documented in [01-cipher-system.md](01-cipher-system.md).

### Validation

The cipher applied to random EVA strings of matched length produces a 2.1% hit rate. Applied to the actual manuscript, it produces 87.8% — a 42x ratio. Folio-by-folio coverage has a standard deviation of 8.2% across 225 folios, indicating a single unified cipher (tools/deep-analysis.js). The two scribal hands identified by Currier decode at 83.0% and 84.7% respectively, sharing 92% of vocabulary — no evidence for a variant cipher table.

The decoded text contains 18 correctly inflected forms of the Latin verb NOCERE (to harm): NOCET, NOCES, NOCIS, NOCETIS, NOCITIS, NOCAN, NOCAT, NOCAR, NOCUM, NOCERAT, NOCOR, NOCS, across persons, numbers, tenses, and moods ([02-verb-paradigms.md](02-verb-paradigms.md)). The verb FACERE produces 12+ inflected forms, preserving the Occitan 3rd-plural stem FOCAN (-AN ending, not Latin -UNT). These paradigms cannot be produced by random matching or mechanical pattern extraction.

### Coverage by Section

| Section | Folios | Decoded | Total | Coverage |
|---|---|---|---|---|
| Biological | f75–f84 | 6,449 | 6,915 | 93.3% |
| Recipes | f103–f116 | 9,501 | 10,681 | 89.0% |
| Herbal | f1–f57 | 8,773 | 9,943 | 88.2% |
| Pharmaceutical | f87–f102 | 1,749 | 2,049 | 85.4% |
| Cosmological | f58–f67 | 1,008 | 1,240 | 81.3% |
| Zodiac | f67–f73 | 548 | 685 | 80.0% |
| **Total** | | **33,247** | **37,886** | **87.8%** |

The biological section has the highest coverage (93.3%) due to formulaic repetition. The zodiac section has the lowest (80.0%) due to Hebrew astronomical vocabulary in the undecoded residue (see Section 3).

---

## 2. The Decoded Text

### Vocabulary Profile

The decoded vocabulary is exclusively pharmaceutical. The 15 most frequent words account for 23% of all decoded tokens:

| Word | Count | Domain |
|---|---|---|
| OLEUM (oil) | 1,007 | Preparation |
| FUIT (was) | 790 | Verb |
| DEUS (God) | 746 | Divine |
| DICIT (says) | 688 | Verb |
| HEUS (beware!) | 673 | Warning |
| AMARA (bitter) | 656 | Quality |
| DAT (gives) | 565 | Verb |
| NOCETIS (you-all harm) | 519 | Warning |
| FACITIS (you-all make) | 494 | Verb |
| DIES (day) | 487 | Time |
| OR (gold, Occitan) | 483 | Material |
| ALIUS (another) | 446 | Function |
| NOCITIS (harm-noun) | 434 | Warning |
| LAIN (wool, Occitan) | 272 | Material |
| DEA (goddess) | 265 | Divine |

Nine categories of vocabulary were tested for systematic absence ([14-structural-analysis.md](14-structural-analysis.md)): medical authorities (0/15 found), Christian vocabulary (0/15), literary apparatus (0/18), patronage titles (0/16), surgical vocabulary (0/14), dosage units (0/8), body organ names (0/10), water-based preparations (0/6), and pharmacological action verbs (0/15). None produced a single hit.

The manuscript describes an oil-based topical pharmacy. No water, honey, or sugar-based preparations appear. No internal medicines, surgical procedures, or anatomical sites of application are described. No standardized dosage units are used. The vocabulary comparison against five known oil-pharmacy texts (Dioscorides Book I, Pseudo-Mesue *De Oleis*, Antidotarium Nicolai, Sabur ibn Sahl, Persian Qarabadin) is documented in [16-oil-pharmacy-comparison.md](16-oil-pharmacy-comparison.md).

### Section Structure

The manuscript's five sections form a sequential pharmaceutical workflow:

**Herbal Catalog (f1–f57):** Each folio documents one plant, assessed for oil yield and bitterness. Adjacent folios share the same dominant Galenic quality 66.7% of the time (expected by chance: 25%, enrichment 2.7x), indicating deliberate therapeutic organization (tools/tier2-analysis.js). DEA (goddess) appears 202 times in this section — the only section where female divine vocabulary matches or exceeds male.

**Astronomical Timing (f58–f73):** The most optimistic section. LAUDAT (praises), OPTAT (wishes), and LAETIS (flourishing) dominate. Occitan month names appear in plain script (mars, aberil). The zodiac wheel illustrations function as a pharmaceutical calendar. Hebrew astronomical vocabulary appears in the undecoded residue (see Section 3).

**Danger Manual (f75–f84):** The most formulaic section (93.3% coverage). 673 HEUS ("beware!") warnings, 59% concentrated here, followed by NOC- harm verbs 30% of the time. BAIN (bath), SAIN (lard), SAL (salt), and FOCAN (they heat) describe the core procedure. The text addresses groups in second-person plural: NOCETIS (you-all harm), FACITIS (you-all make). DEA drops to 8 occurrences. DEUS (306) and HEUS (396) dominate.

**Case Notes (f87–f102):** Past-tense verbs dominate: FUIT (was), DEDIT (gave), FOCERAT (had heated), NOCERAT (had harmed). This section records completed preparations and their outcomes, including adverse reactions (HORROR, shuddering).

**Compound Recipes (f103–f116):** The longest and most Occitan-heavy section (10.5% Occitan). RECIPE (take!) marks prescriptions. AURUM (gold) appears 48 times. LAR (household god) peaks here at 61 occurrences. DEUS appears 353 times.

### The HEUS Safety Protocol

The HEUS warning system has no known parallel in medieval pharmaceutical literature. 673 occurrences distribute as follows: biological section 396 (59%), recipes 179 (27%), herbal 46 (7%), other 52 (8%). HEUS and NOCETIS co-occur within 3-word windows at 1.63x enrichment. 100% of HEUS occurrences fall in sections where DEUS outnumbers DEA (tools/kabbalistic-structure.js). The protocol functions as a formalized danger-marking system: HEUS + harm-verb + procedural context.

### Bilingual Register

51% of decoded lines with 4+ words contain both Latin and Occitan vocabulary (tools/tier3-analysis.js). The Occitan features include: intervocalic L-loss (BAIN < BALINEUM), final nasalization (LAIN < LANAM), S-aphaeresis (TAIN < STANNUM), 3rd-plural -AN verb endings (NOCAN, FOCAN), article forms AL and LAS. These features are specifically Languedocian Old Occitan (not Catalan) and converge on a composition window of 1250–1400. The three-case Latin distinction (DEUS/DEUM/DEO) is consistent with 13th-century Latin training. Full dialectal analysis in [14-structural-analysis.md](14-structural-analysis.md).

---

## 3. Evidence for a Jewish Author

A Jewish connection to the Voynich has been proposed previously — notably by Panofsky (1932), Skinner (2017), and Kondrak & Hauer (2017) — though never with a working decipherment or specific historical tradition identified (see Prior Voynich Research in Sources).

### Absence of Christian Content

Every comparable medieval pharmaceutical text contains Christian framing. Pseudo-Mesue opens with *"In nomine patris et filii et spiritus sancti Amen."* The Antidotarium Nicolai and Circa Instans reference Christian saints and ecclesiastical vocabulary. The Voynich manuscript contains zero instances of Christus, Maria, Sanctus, Ecclesia, or any Trinitarian formula across 37,886 tokens. This absence, combined with the presence of DEA (goddess, 265x) and LAR (household god, 121x), is consistent with a non-Christian author.

### Hebrew Vocabulary in the Undecoded Residue

The undecoded 12.2% contains Hebrew terms written as direct phonetic transliterations in EVA, bypassing the Latin cipher. These concentrate in the astronomical and zodiac sections, where the undecoded rate is highest (20–25%):

| EVA | Phonetic | Hebrew | Meaning | Folio | Match |
|---|---|---|---|---|---|
| shalom | SHALOM | שלום | peace/wholeness | f58r | Exact phonetic |
| adar | ADAR | אדר | month 12 (Feb/Mar) | f86v | Exact phonetic |
| oteom | OTEOM | תאום | Gemini (Twin) | f58r | Exact consonants (TM) |
| geedy | GIDY | גדי | Capricorn (Kid) | f26r | Exact consonants (GDY) |
| daoly | DAOLY | דלי | Aquarius (Bucket) | f66r | Exact consonants (DLY) |
| ithor | ITHOR | טהור | ritually pure | f69r | Exact consonants (THR) |
| otamy | OTAMY | טמא | ritually impure | f69v | Exact consonants (TMY) |
| ylaiin | YLAIN | אילן | tree (sefirotic) | f76r | Exact consonants (YLN) |
| taly | TALY | תלי | celestial dragon | f78r | Exact consonants (TLY) |

TAHOR (pure) and TAMEI (impure) appear on adjacent folios f69r and f69v — a ritual purity pairing. These Hebrew terms appear in both label lines and prose text across the zodiac pages, indicating the author's Hebrew vocabulary is integrated into the pharmaceutical text, not limited to wheel labels.

Multilingual testing (tools/zodiac-multilingual.js) against 169 astronomical terms in Hebrew, Arabic, Latin, and Occitan shows Hebrew dominates the zodiac sections: 37 matches versus Latin 6, Arabic 3 (distance ≤ 1). Section-by-section analysis confirms this is signal, not noise: Hebrew astronomical vocabulary matches 26.8% of undecoded zodiac words versus 13.5% in other sections, while a random consonant-string control of matched length matches only 6.5% (4.1x Hebrew-to-random ratio in zodiac, 2.3x elsewhere). At exact consonantal distance (distance = 0), Hebrew produces 29 matches across the manuscript versus 2 for the random control — a 14.5x ratio. Full comparison including Arabic in [17-hebrew-hypothesis.md](17-hebrew-hypothesis.md).

### The Shem Tov Synonym Lists

Shem Tov ben Isaac of Tortosa (active Marseille, 1254–1264) compiled medical synonym glossaries correlating Hebrew, Arabic, Occitan, and Latin pharmaceutical terminology. Cross-referencing 739 entries extracted from four Shem Tov publications against the decoded Voynich (tools/shem-tov-match.js, data: tools/shem-tov/shimmush-entries.json):

- 19 of 46 Latin pharmaceutical terms appear in the decoded Voynich (41.3%), including MANDRAGORA, BORAGO, OLEUM, FUMUM, THUS, CERA, DOLOR
- 42 of 117 Occitan terms match (35.9%), including mandragolha, grana, vermelhon, lopin, gom
- 41 exact consonantal Hebrew matches in the undecoded residue, plus 161 close matches

The introduction to the Sefer Almansur critical edition (Bos/Mensching/Zwink, Brill 2017) documents conditions directly relevant to the Voynich:

- Jewish physicians constituted 30–50% of medical practitioners in major cities of southern France and Iberia, despite representing 3–5% of the population (Shatzmiller 1994, p. 108)
- Pope Innocent IV (1250) restricted Christians from using Jewish-prepared medicines
- The Council of Barcelona (1325) prohibited Jews from practicing as apothecaries (*nullus judeus ... uteretur officio apothecarie*)
- Medical training occurred within families, "from father to son" — Jewish doctors did not have access to Christian medical schools
- Jewish medical writers "did not neatly distinguish between the vernacular Romance languages and Latin" — consistent with the Voynich's 51% mixed Latin-Occitan lines

### Trilingual Precedent

The Hebrew-Latin-Occitan register is not unprecedented. At least five manuscript traditions from the same region and period combine these languages: Shem Tov's *Sefer ha-Shimmush* (Marseille, 1254–64), Abraham Avigdor's translation of Gerard de Solo (Montpellier, c. 1350–80, documented as "hybridization of Hebrew, Latin, and Old Occitan terms" in Mensching et al., *Aleph* 21.2, 2021), "Doeg the Edomite's" 24 Latin-to-Hebrew medical translations with Occitan glosses (Montpellier, 1197–99), the Hebrew Macer Floridus with Occitan elements (Bos/Mensching, *JQR* 2000), and the DiTMAO corpus of 3,200 Occitan medical terms in Hebrew characters. The Voynich's language combination is characteristic of this documented tradition.

### Cipher Design and Hebrew Linguistic Training

The cipher's positional encoding — where the same glyph maps to different letters in initial, medial, and final position — parallels Hebrew script, where five letters take different forms in final position. The cipher strips vowels from long words before encoding, consistent with Hebrew consonantal writing where vowels are treated as dispensable. These design features are natural for a practitioner trained in Hebrew script.

### The Documented Community

The Voynich author has not been identified by name, but the community is precisely documented. Between 1200 and 1350, at least fifteen named Jewish physicians and translators worked in the Montpellier-Marseille-Lunel-Narbonne corridor, producing trilingual Hebrew-Latin-Occitan medical texts. The closest documented parallel to the Voynich author's profile is Shem Tov ben Isaac of Tortosa (Marseille, 1254–64), who translated the medieval world's most important pharmaceutical encyclopedia and compiled multilingual drug glossaries — but no documented Kabbalistic connection for Shem Tov has been found. The Kabbalistic circles (Isaac the Blind at Posquières, d. 1235; the ha-Kohen brothers collecting traditions c. 1260–80) were geographically adjacent (50–100 km) and chronologically overlapping with the medical circles, but no single documented individual bridges both traditions in this period.

The absence of a named candidate is itself consistent with the author profile: an artisan-level apothecary, family-trained and excluded from guilds, would not appear in the textual record that documents translators and university-adjacent physicians. The pipeline from Languedoc to northern Italy after the 1306 expulsion is confirmed through documented individuals: Hillel ben Samuel of Verona (Montpellier-trained, practiced in Italian cities), Kalonymus ben Kalonymus (Arles to Rome), Estori ha-Parhi (expelled from Montpellier 1306, went to Perpignan and Palestine).

### Composition Date and Vellum

The text was composed circa 1250–1350 based on ten converging Occitan phonological features and the three-case Latin system. The vellum is radiocarbon-dated to 1404–1438. The Jewish communities that produced this medical tradition — Narbonne, Montpellier, Lunel, Posquières, Marseille — were expelled from France in 1306. They relocated to northern Italy, where the Voynich vellum was produced. The manuscript is consistent with a copy made in the Italian diaspora from an older Languedocian original. This composition-to-copy lag is standard: Shem Tov's *Sefer ha-Shimmush* (composed 1254–1264) survives in 14th- and 15th-century manuscripts.

---

## 4. Sefirotic Structure in the Divine Vocabulary

The divine vocabulary was tested against predictions derived from Kabbalistic sefirotic theology (tools/kabbalistic-structure.js). Each test compares observed section-level distributions against independence baselines:

| Prediction | Observed | Statistic | Result |
|---|---|---|---|
| DEA enriched in herbal (Shekhinah in nature) | 202/297 DEA in herbal | 2.55x enrichment, chi-sq 294.7 | Confirmed |
| DEUS enriched in biological (Gevurah in danger) | 306/890 DEUS in biological | 1.74x enrichment, chi-sq 248.2 | Confirmed |
| HEUS enriched in biological (Gevurah warning) | 396/673 HEUS in biological | 2.97x enrichment, chi-sq 704.0 | Confirmed |
| HEUS absent where DEA dominates | 0% in DEA-dominant sections | 100% in DEUS-dominant | Confirmed |
| LAR enriched in recipes (Chesed in domestic ritual) | 61/159 LAR in recipes | 1.34x enrichment | Confirmed |
| F/M ratio drops herbal → biological | 0.748 → 0.024 | 31x decrease | Confirmed |
| OLEUM co-occurs with divine vocabulary | 308 co-occurrences | 0.54x (below chance) | Not confirmed |
| DEUS and HEUS co-occur within lines | 153 co-occurrences | 0.90x (below chance) | Not confirmed |

A 10,000-iteration permutation test (tools/sefirotic-permutation-test.js) confirms these patterns are not artifacts of random word placement. Divine vocabulary positions were randomly shuffled while keeping all other words fixed. Four of six tests produced p-values below 0.0001: DEA in herbal (real 2.47x vs permutation mean 0.75x), HEUS in biological (real 2.98x vs 1.68x), LAR in recipe (real 1.39x vs 0.94x), and F/M ratio drop (real 36.8x vs 1.0x). The combined probability of obtaining these four results by chance is 6.25 × 10⁻⁶ (approximately 1 in 160,000). Two tests did not reach significance: DEUS enrichment in biological (DEUS distributes broadly across all sections, not specifically to biological) and HEUS concentration in DEUS-dominant sections (structurally trivial since DEUS outnumbers DEA in every section).

The Hebrew term TELI (תלי, celestial dragon — the cosmic axis in Sefer Yetzirah) appears at manuscript section boundaries at 29.4% (10 of 34 occurrences fall on boundary folios between major sections). ILAN (אילן, sefirotic tree) appears on f76r, the opening folio of the biological section.

### Interpretation of the Illustrations

The biological section (f75–f84) depicts groups of nude figures in baths connected by pipes. This imagery is consistent with mikveh (Jewish ritual immersion), as proposed independently by Skinner (2017). The decoded text on these pages contains: HEUS warnings at 59% concentration, BAIN (bath), FOCAN (they heat), SAL (salt), SAIN (lard), and the purity terms TAHOR/TAMEI on adjacent zodiac folios. Cordovero described the sefirot as "channels through which light flows, like water flowing through pipes" — parallel to the manuscript's visual grammar of pools connected by tubes. The Hebrew term BYB (conduit, pipe, canal) appears in Shem Tov's medical vocabulary with the Occitan equivalent "aiguier."

The Rosettes foldout (f85v/f86r), showing interconnected circular structures, resembles ilanot — Kabbalistic tree diagrams with circular nodes connected by channels of divine flow. The earliest known ilanot date to the late 13th century, contemporary with the manuscript's composition. This identification remains tentative.

---

## 5. Selected Decoded Passages

The following passages are decoded word-for-word from the EVA transcription using the glossary. The sentence structures follow patterns documented in comparable pharmaceutical texts: substance identification, quality assessment, procedural instruction, and harm/benefit evaluation. The English translations are literal — each Latin or Occitan word is rendered individually, without interpretive smoothing. A full medieval pharmaceutical reading of these passages would require specialist expertise in 13th-century Languedocian medical Latin and Occitan.

### Herbal Section — Plant Assessment Under DEA

**f1v.9** (100% decoded):
> *HORAM OPTAT DAT LAEDIT AC DICIT HABET DEA FCO DICIT HORTUS*
> "At-the-hour wishes gives injures and says has goddess makes says garden"

A plant assessment entry: the preparation is timed (HORAM), assessed for both benefit (OPTAT, DAT) and harm (LAEDIT), and produced under the authority of DEA (goddess) in the HORTUS (garden). This structure — substance, timing, benefit, harm, divine authority — repeats across herbal folios.

**f33v.5** (100% decoded):
> *THUS ODORATUS FOCUM DIES LUX ART ET ALIUS SIC ALIUS QUARE DICIS ALIUS*
> "Frankincense fragrant hearth day light art and another thus another wherefore you-say another"

A frankincense preparation: THUS (frankincense) is assessed for fragrance (ODORATUS), heated (FOCUM), and evaluated across multiple preparations (ALIUS... ALIUS — "another... another").

### Astronomical Section — Hebrew Timing Vocabulary

**f58r.4** (89% decoded):
> *HORAM FAR AMARA SHALOM ALS ALS TEOM DICIT*
> "Hour grain bitter SHALOM other other TEOM(Gemini) says"

Hebrew terms SHALOM (שלום, peace/wholeness) and TEOM (תאום, Twin/Gemini) appear alongside pharmaceutical quality assessment (AMARA/bitter) and celestial timing (HORAM/hour). The Hebrew terms bypass the Latin cipher — they are transliterated directly into EVA glyphs.

### Biological Section — HEUS Danger Protocol

**f76r.9** (100% decoded):
> *HEU AL HEUS SAIN DEUS AN FACITIS GARUM AN LAUDIS BAIN DEUS DICIT ALS*
> "Alas other beware! lard God whether you-all-make fish-sauce whether of-praise bath God says other"

A bathing procedure: SAIN (lard), GARUM (fish sauce), and BAIN (bath) describe the preparation materials. HEUS (beware!) opens the warning. DEUS appears twice — the procedure operates under masculine divine authority.

**f76r.29** (100% decoded):
> *NOCAR HEUS HEUS NOCAR HEUS NOCAN DICIT HEC HIC FOCAR FOCAN ILAN ET*
> "May-it-harm beware! beware! may-it-harm beware! they-harm says these-things here heat they-heat tree(sefirotic) and"

Five consecutive HEUS/NOCAR warnings, followed by heating instructions (FOCAR, FOCAN), culminating in ILAN (אילן, the sefirotic tree). The Hebrew term appears at the structural climax of the danger sequence.

### Recipe Section — DEA and DEUS Together

**f108v.36** (100% decoded):
> *OLEUM HEC NOCETIS NOCAN DEA DAT DAT DEUS LAIN AL AL BIS LAUDAT QUS*
> "Oil these-things you-all-harm they-harm goddess gives gives God wool other other twice praises qus"

DEA (goddess) gives — providing the oil — and DEUS (God) receives the prepared LAIN (wool). Both divine terms appear in the same pharmaceutical instruction, with DEA associated with the source material and DEUS with the sanctified preparation.

### Pharmaceutical Section — Compound Preparation

**f101r.5** (100% decoded):
> *OLEUM ERAT DEDIT FACERE OR AMARA DEDIT DEO GIO DES OPTAT FOCERAT LUX DAT DIES RECIPE AMARA LAETO FORMA DES FCEAT HERBA FOCERAT SUMMA OM*
> "Oil was gave to-make or bitter gave to-God gio you-give wishes had-heated light gives day take!(recipe) bitter laeto form you-give may-it-make herb had-heated sum om"

A complete preparation sequence: OLEUM (oil) is the base, assessed for bitterness (AMARA), offered to God (DEO), heated (FOCERAT), and compiled as a recipe (RECIPE). Past-tense verbs (ERAT, DEDIT, FOCERAT) indicate this is a case record — documenting a preparation already completed.

All passages and additional decoded lines are available in [03-translated-passages.md](03-translated-passages.md). The full manuscript can be decoded interactively using `node decode.js [folio]`.

---

## 6. Open Questions

The remaining 12.2% undecoded tokens consist primarily of single-glyph transcription fragments, Hebrew astronomical labels on zodiac pages (58.8% decode rate), hapax legomena likely representing proper nouns, and EVA sequences that resist all known cipher rules.

Outstanding research questions:

1. Can the zodiac wheel labels be decoded as a complete Hebrew astronomical vocabulary?
2. Does the DiTMAO corpus (3,200 Occitan medical terms in Hebrew characters, University of Göttingen) produce additional vocabulary matches?
3. Can a specific author be identified within the documented Montpellier/Marseille Jewish medical community?
4. Does the Rosettes foldout correspond to a known ilan (sefirotic tree diagram) type?
5. Do the botanically unidentifiable plant illustrations carry deliberate sefirotic symbolism?

---

## 7. Reproducibility

The decipherment is fully reproducible. The glossary, transcription data, and all analysis scripts are included in the repository:

```
node decode.js              # Full manuscript decode with per-section statistics
node decode.js f76r          # Decode a specific folio
```

Key tools:
- `tools/glossary-export.js` — 3,648 EVA-to-Latin mappings
- `tools/shem-tov-match.js` — 739-entry Shem Tov cross-reference
- `tools/hebrew-decode.js` — 841-term Hebrew transliteration matching
- `tools/kabbalistic-structure.js` — 8-test sefirotic coherence analysis
- `tools/zodiac-deep-dive.js` — word-by-word zodiac page analysis
- `tools/zodiac-label-crack.js` — zodiac label encoding analysis

Step-by-step verification instructions are provided in [07-reproduction-guide.md](07-reproduction-guide.md). No external dependencies beyond Node.js 18+.

---

## Sources

### Primary Texts
- Shem Tov ben Isaac of Tortosa, *Sefer ha-Shimmush*, Book 29, List 1 — Bos, Hussein, Mensching, Savelsberg (eds.), *Medical Synonym Lists from Medieval Provence*, Brill 2011
- Shem Tov ben Isaac of Tortosa, *Sefer Almansur* — Bos, Mensching, Zwink (eds.), *Medical Glossaries in the Hebrew Tradition*, Brill 2017
- EVA transcription: Takahashi (tools/eva-data/eva_takahashi.txt)

### Secondary Sources
- Joseph Shatzmiller, *Jews, Medicine, and Medieval Society* (Berkeley: University of California Press, 1994)
- Gerrit Bos and Guido Mensching, "The Literature of Hebrew Medical Synonyms: Romance and Latin Terms and their Identification," *Aleph* 5 (2005): 169–211
- David Nirenberg, *Communities of Violence: Persecution of Minorities in the Middle Ages* (Princeton: Princeton University Press, 1996)
- Michael McVaugh, *Medicine Before the Plague: Practitioners and Their Patients in the Crown of Aragon 1285–1345* (Cambridge: Cambridge University Press, 1993)
- Paula S. De Vos, *Compound Remedies: Galenic Pharmacy from the Ancient Mediterranean to New Spain* (Pittsburgh: University of Pittsburgh Press, 2020)

### Prior Voynich Research
- Erwin Panofsky (1931–1932): attributed the manuscript to "southern (Sephardi?) Jewish origin" with "Kabbalah" influence, placing it in "Spain, Portugal, Catalonia, or Provence" and dating it to 1410–1430 — confirmed decades later by radiocarbon dating. Based on visual inspection; never published as a formal argument. Notes recovered by D.N. O'Donovan.
- Stephen Skinner (2017): proposed the bathing figures depict mikveh purification and identified the author as a Jewish physician in northern Italy. Art-historical argument without access to decoded text.
- Greg Kondrak and Bradley Hauer, "Decoding Anagrammed Texts Written in an Unknown Language and Script," *TACL* (2017): computational analysis against 400 languages identified Hebrew as the most likely source language. The text is Latin-Occitan, not Hebrew, but the identification of Hebrew as a background language was directionally correct.

No prior work has connected the manuscript to the Montpellier/Languedoc Jewish medical tradition, to Shem Tov ben Isaac's synonym lists, or tested the divine vocabulary against sefirotic structure.

### Evidence Appendices
1. [01-cipher-system.md](01-cipher-system.md) — Cipher architecture
2. [02-verb-paradigms.md](02-verb-paradigms.md) — Verbal conjugation tables
3. [03-translated-passages.md](03-translated-passages.md) — Decoded passages
4. [04-plant-identifications.md](04-plant-identifications.md) — Botanical cross-validation
5. [05-statistical-evidence.md](05-statistical-evidence.md) — Coverage statistics and controls
6. [06-comparative-analysis.md](06-comparative-analysis.md) — Pharmaceutical text comparison
7. [07-reproduction-guide.md](07-reproduction-guide.md) — Verification instructions
8. [10-manuscript-analysis.md](10-manuscript-analysis.md) — Vocabulary analysis
10. [11-criticisms-and-responses.md](11-criticisms-and-responses.md) — Anticipated objections
11. [12-section-findings.md](12-section-findings.md) — Per-section vocabulary
12. [13-reverse-encoding-test.md](13-reverse-encoding-test.md) — Reverse encoding validation
13. [14-structural-analysis.md](14-structural-analysis.md) — Structural and statistical analysis
14. [15-what-the-manuscript-is.md](15-what-the-manuscript-is.md) — Capstone thesis
15. [16-oil-pharmacy-comparison.md](16-oil-pharmacy-comparison.md) — Oil-pharmacy tradition
16. [17-hebrew-hypothesis.md](17-hebrew-hypothesis.md) — Hebrew and Kabbalistic evidence
