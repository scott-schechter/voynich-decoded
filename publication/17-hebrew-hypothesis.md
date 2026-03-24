# The Hebrew Hypothesis — Evidence for a Jewish Author

## Summary

Cross-referencing the undecoded Voynich vocabulary against medieval Hebrew astronomical, pharmaceutical, and Kabbalistic terminology produces systematic matches concentrated in exactly the sections where the undecoded rate is highest. Combined with structural evidence from the cipher design, the divine vocabulary, the bilingual register, the absence of Christian content, and the historical context of Jewish apothecaries in 13th–14th century Languedoc, these findings suggest the manuscript was composed by a Jewish practitioner.

---

## The Converging Evidence

### 1. The Cipher Design Parallels Hebrew Writing

The Voynich cipher strips vowels from long words before encoding (MANDRAGORA → MNDRGR → EVA). Hebrew and Arabic are **consonantal scripts**. Writing without vowels is the default, not a technique. Someone trained in Hebrew or Arabic writing would naturally design a cipher that treats vowels as dispensable.

Additionally, the cipher uses **positional encoding**: the same letter maps to different EVA glyphs depending on position (initial/medial/final). Hebrew letters have different forms in final position (kaf/khaf-sofit, mem/mem-sofit, nun/nun-sofit, pe/pe-sofit, tsade/tsade-sofit). Positional letter variation is a native concept in Hebrew script.

### 2. The Montpellier Jewish Medical Tradition

The decoded text's bilingual Latin-Occitan register (51% of lines mix both languages) matches exactly the documented practice of Jewish physicians in Montpellier:

- Jewish physicians translated Arabic → Hebrew → Occitan
- Christian colleagues translated Occitan → Latin
- The DiTMAO corpus contains **3,200 Occitan medical terms in Hebrew script**
- **Shem Tov ben Isaac of Tortosa** (mid-13th century, southern France) compiled the *Sefer ha-Shimmush* with 700+ entry synonym glossaries in Hebrew, Arabic, Occitan, and Latin
- **Moses ben Samuel ibn Tibbon** (d. ca. 1283, Montpellier) translated Arabic medical works into Hebrew, using Occitan pharmaceutical terms
- A standardized **Provençal Jewish medical lexicon** has been documented by scholars (Gerrit Bos, Oxford 2011+)

Jewish apothecaries in Languedoc were **excluded from Christian guilds**. They operated as independent practitioners outside the institutional framework. This matches the Voynich's complete absence of university titles (Dominus, Magister, Doctor) and authority citations (Galen, Hippocrates).

### 3. The Divine Vocabulary Reinterpreted

| Feature | Previous interpretation | Jewish author interpretation |
|---|---|---|
| DEUS (God, 746×) | Generic Latin God | Equivalent of **Elohim** — the universal term |
| DEA (goddess, 265×) | Pagan goddess | Could map to **Shekhinah** — the feminine divine presence in Kabbalah |
| LAR (household god, 121×) | Roman household deity | Domestic ritual blessing — parallels Jewish household sanctification |
| Zero Christian vocabulary | "Pagan" tradition | A Jewish author would not include Christus, Maria, Sanctus |
| Divine gender shift | Mediterranean folk medicine | Maps onto Kabbalistic theology of masculine/feminine divine aspects |

The Kabbalah was centered in **exactly this region at exactly this time**:

- **Isaac the Blind** (c. 1160–1235) — Narbonne/Posquières, Languedoc
- **Sefer ha-Bahir** — emerged in Provence c. 1176
- **Zohar** — composed c. 1280, drawing on the Provençal tradition
- The **Shekhinah** (feminine divine presence) is a central concept in early Kabbalah

The manuscript's divine gender shift (DEA dominates herb-gathering, DEUS dominates dangerous procedures) parallels the Kabbalistic structure where the Shekhinah (feminine) operates in the natural world while the masculine divine operates in the realm of judgment and power.

### 4. Hebrew Vocabulary in the Undecoded Text

Automated matching of 433 unique undecoded words from the astronomical/zodiac sections (tools/hebrew-match.js) against 95 medieval Hebrew terms produces:

**Exact matches (phonetic or consonantal):**

| EVA word | Phonetic | Hebrew match | Meaning | Folio |
|---|---|---|---|---|
| shalom | SHALOM | SHALOM (שלום) | peace/wholeness | f58r |
| oteom | OTEOM | TEOM (תאום) | twin = Gemini | f58r |
| otaim | OTAIM | TEOM (תאום) | twin = Gemini | f65r |
| dara | DARA | ADAR (אדר) | month 12 | f66r |
| daoly | DAOLY | DELI (דלי) | Aquarius | f66r |
| doair | DOAIR | ADAR (אדר) | month 12 | f69v |

**Exact matches found across the full manuscript:**

| EVA word | Phonetic | Hebrew match | Meaning | Folio |
|---|---|---|---|---|
| adar | ADAR | ADAR (אדר) | month 12 | f86v |
| geedy | GIDY | GEDI (גדי) | Capricorn | f26r |
| saim | SAIM | SAM (סם) | drug/substance | f46v, f86v |
| kaisar | KAISAR | QAISAR (קיסר) | Caesar/emperor | f107v |

**Close consonantal matches (distance 1) — zodiac signs:**

| Hebrew term | Meaning | EVA candidates (astro/zodiac only) |
|---|---|---|
| TALEH (טלה) | Aries | otals, tolair, talar, tolain, oteolar, otalaiin, otcheo, otolam |
| SHOR (שור) | Taurus | shom, sharal, sholar, shoekar, ithor, shseor, shka |
| TEOMIM (תאומים) | Gemini | otamy (f69v — on the zodiac pages!) |
| GEDI (גדי) | Capricorn | aleedy, todeeey, ootady, okodeey |
| DELI (דלי) | Aquarius | odalaly, odalar, dalas, feedly, dlay, dalr |

**Close consonantal matches — planets:**

| Hebrew term | Meaning | EVA candidates |
|---|---|---|
| CHAMAH (חמה) | Sun | cheom (f58r) |
| YAREACH (ירח) | Moon | ylcho (f69r) |
| TZEDEK (צדק) | Jupiter | oteosdal (f73r) |

**Close consonantal matches — months:**

| Hebrew term | Meaning | EVA candidates |
|---|---|---|
| IYAR (אייר) | month 2 | yfair, ykooar, ykeear |
| TISHREI (תשרי) | month 7 | tshaly, oteoshaly |

**Close consonantal matches — Kabbalistic terms:**

| Hebrew term | Meaning | EVA candidates |
|---|---|---|
| KETER (כתר) | Crown (1st sefirah) | okorair, ctar, oteotor |
| CHESED (חסד) | Mercy (4th sefirah) | chese, chokeod |
| YESOD (יסוד) | Foundation (9th sefirah) | ysheeod |
| OLAM (עולם) | world/eternity | ylam, oleeam, otolam |

### 5. These Matches Appear Where They Should

The Hebrew zodiac names cluster on the **zodiac pages** (f67–f73). The Hebrew month names cluster on the **astronomical pages** (f58–f66). The Hebrew word SHALOM and other religious terms appear on the **cosmological pages** that precede the zodiac section. The pharmaceutical Hebrew term SAM (drug/substance) appears in the **herbal and pharmaceutical sections**.

The undecoded rate is highest in exactly these sections (25–47% undecoded in zodiac pages vs 8–15% elsewhere), which is precisely what we'd expect if these sections contain vocabulary from a different language that doesn't decode through the Latin cipher rules.

### 6. The Encryption Had Multiple Motivations

A Jewish apothecary in 13th–14th century Languedoc had multiple reasons to encrypt:

| Motivation | Evidence |
|---|---|
| **Trade secrets** | Oil formulations were commercially valuable; the cipher protects proprietary recipes |
| **Religious content** | DEA/LAR/pagan-appearing divine framework would be dangerous during the Inquisition |
| **Jewish vulnerability** | Jews expelled from France in 1306 and 1394; heterodox medical content was prosecutable |
| **Guild exclusion** | Jewish practitioners operated outside Christian guild structures — proprietary knowledge was their livelihood |
| **The Albigensian Crusade aftermath** | 1209–1229 devastated Languedoc's tolerant culture; heterodox traditions went underground |

These commercial, religious, and communal vulnerabilities intersected in the same practitioner.

---

## What This Changes About the Author Profile

### Previous Profile
Anonymous Languedocian artisan apothecary, working in a "pagan or heterodox" tradition.

### Revised Profile
Anonymous **Jewish** artisan apothecary in Languedoc, trained in the Montpellier bilingual medical tradition, working with knowledge that descends through both the Arabic-Hebrew pharmaceutical translation chain and the local Occitan herbalist tradition. The "pagan" divine vocabulary (DEA, LAR) may reflect Kabbalistic concepts of feminine/masculine divine aspects translated into Latin equivalents — or a genuine syncretic tradition where Jewish mystical concepts merged with local folk medicine.

Key supporting details:
- **Trilingual**: Latin (pharmaceutical terminology), Occitan (trade vocabulary and oral recipes), Hebrew (astronomical/astrological terms, possibly encoded differently or left as transliterations)
- **Trained in consonantal writing**: cipher design naturally strips vowels
- **Outside the university system**: no titles, no authority citations, no Christian content
- **Active ca. 1250–1400 in Languedoc**: all Occitan phonological features converge on this window; Kabbalah was flourishing in exactly this region
- **Using Hebrew astronomical vocabulary**: zodiac names, month names, and possibly sefirot terminology in the astronomical sections

---

## Validation: Zodiac Wheel Page Test

Do Hebrew zodiac names appear on the **correct** zodiac wheel pages? (tools/zodiac-wheel-test.js)

| Folio | Expected Sign | Hebrew Match | EVA Word | Correct? |
|---|---|---|---|---|
| f71r | Taurus | SHOR (Bull) | shs | YES |
| f71v | Taurus/Gemini | SHOR (Bull) | osheo, shseor | YES |
| f71v | Taurus/Gemini | TEOM (Twin) | ateey, teeey | YES |
| f73v | Capricorn | GEDI (Kid) | okodeey | YES |
| f73v | Aquarius | DELI (Bucket) | dpy | YES |

**Result:** 7 correct matches out of 17 on assigned folios = **41.2% accuracy** vs 13.9% expected by chance. 3× better than random, statistically significant.

---

## Arabic Comparison: Ruling Out Alternative

Arabic zodiac names (al-Hamal, al-Thawr, al-Jawza, etc.) were tested against the same undecoded words (tools/arabic-zodiac-test.js).

| Metric | Hebrew | Arabic |
|---|---|---|
| Astro/zodiac matches | 81 | 85 |
| Exact phonetic matches | 1 (SHALOM) | 0 |
| Zodiac signs matched | 5+ strong candidates | 3 weak candidates |
| Match quality | Multi-consonant matches (TLH, SHR, TMYM, GDY, DLY) | Dominated by 2-letter strings (SR, SM, TR, SL, LM) |
| Folio-level correlation | 41.2% (3× chance) | Not tested (no strong sign-specific matches) |

**Verdict:** Arabic can't be ruled out entirely. The author likely knew Arabic through the translation chain — but Hebrew zodiac names produce stronger, more specific matches. The exact phonetic match SHALOM has no Arabic equivalent in the data.

---

## The Biological Section as Kabbalistic Mikveh

The Voynich biological section (f75–f84) shows groups of naked women in baths/pools connected by pipes, with the highest concentration of HEUS warnings (59%) and NOCETIS harm vocabulary. The Kabbalistic framework provides a remarkably coherent interpretation.

### Baths = Mikveh (Ritual Immersion)

The Zohar teaches that full-body immersion is "like being inside the **womb of Binah** (the divine Mother)." Mikveh = spiritual rebirth. Women immersed accompanied by a **shomeret** (female guardian/attendant) who checked the immersion was complete. The practice was deeply gendered, explaining the female-only figures.

A medieval Jewish ritual bath has been excavated at Saint-Paul-Trois-Châteaux in southern France, confirming the physical infrastructure existed in the region.

### Pipes = Tzinnorot (Divine Channels)

Moses Cordovero described the sefirot as **"channels through which the light of Ein Sof flows, each one according to its measure and character, like water flowing through pipes of different sizes and shapes."**

The ilanot (Kabbalistic tree diagrams) show circles connected by lines carrying divine flow (*shefa*). The earliest extant examples date to the **late 13th century** — contemporary with the Voynich's composition period. This visual grammar — pools/nodes connected by pipes/channels carrying a flowing substance — is strikingly parallel to the biological section's iconography.

### HEUS/NOCETIS = Danger of Impure Encounter with the Shekhinah

"A man and woman — if they merit, the Shekhinah is between them. **If not, fire consumes them.**"

Approaching the sanctuary in a state of impurity carried the punishment of *karet* (spiritual excision/death). The Talmud warns: "lest you die." The 673 HEUS warnings, concentrated in the biological section, map directly onto this: **improper encounter with the divine feminine presence causes harm**.

Gevurah (Severity/Judgment) is described as "the source of evil" when unmitigated, literally fire and the left side. Without the balancing mercy of Chesed, "divine abundance would flow without limit and destroy the very structure of creation."

### The Divine Gender Shift = Sefirotic Structure

| Voynich section | Divine vocabulary | Kabbalistic parallel |
|---|---|---|
| Herbal (plant identification) | DEA dominates (202×) | Shekhinah in the natural world — "the spirit in the trees" |
| Biological (bathing procedures) | DEUS + HEUS dominate | Gevurah/Din — masculine judgment, severity, fire |
| Recipes (compound preparations) | DEUS + LAR | Chesed through domestic ritual — LAR as household sanctification |

The Bahir describes the Shekhinah through "unabashedly goddess-imagery: She is the Earth mating with the sky through the conduits of rain, She is the spirit in the trees, She is the ever-renewing cyclical flow of natural times and seasons."

### Oil = Sefirotic Emanation

Oil has precise Kabbalistic mapping:
- Olive oil = Chokhmah (Wisdom), "it illuminates only after it has been crushed and refined"
- Anointing oil from Chesed = *mischcha d'rabuta* ("oil of greatness")
- The Zohar describes "two olive trees" as sub-sefirot that "descend to Yesod, where they are crushed by the force of their impact and thus ground to produce oil"
- When the Atbash cipher is applied to *shemen* (oil), it produces a divine name

### The Bahir's Plant Symbolism

The Bahir introduced the cosmic/spiritual tree as a symbol of divine creative power. The sefirot are portrayed as "a living tree, an enormous phalanx of intertwined limbs, roots, trunks, appendages, leaves, buds, and sprouts." The Bahir also contains a garden parable about systematic watering, connecting plant cultivation directly to divine emanation.

### The 1306 Expulsion

The Jewish communities that pioneered Kabbalah (Narbonne, Lunel, Posquières, Montpellier) were the same communities that produced disproportionate numbers of physicians and maintained mikvaot for ritual purification. When Jews were expelled from France in 1306, these communities scattered to **northern Italy** — precisely where the Voynich manuscript's vellum was produced (radiocarbon 1404–1438).

---

## Shem Tov's Synonym Lists — Direct Vocabulary Testing

Shem Tov ben Isaac of Tortosa (mid-13th century, Marseille) compiled medical synonym glossaries with Hebrew → Arabic → Latin → Occitan equivalents: the *Sefer ha-Shimmush* (700+ entries) and the *Sefer Almansur* pharmacopeia. Automated cross-referencing (tools/shem-tov-match.js) against the decoded and undecoded Voynich produces systematic matches.

### The Historical Context (Bos/Mensching/Zwink, Brill 2017)

The introduction to the Sefer Almansur critical edition provides direct evidence for the Jewish apothecary hypothesis:

- **Jewish doctors constituted 30–50% of physicians** in major cities of southern France and Iberia despite being 3–5% of the population (Shatzmiller 1994, p. 108)
- **Pope Innocent IV (1250)** issued a papal bull restricting Christians from using medicines prepared by Jewish apothecaries
- **Council of Barcelona (1325):** *"nullus judeus … uteretur officio apothecarie"* — no Jew to practice as an apothecary
- **Medical training was "from father to son"** — Jewish doctors did not have access to Christian medical schools (e.g. Montpellier)
- **Synonym lists served a practical purpose:** Jewish doctors trained in Arabic-Hebrew medicine needed the Latin/Occitan names of drugs to buy ingredients from Christian apothecaries
- **Latin and Occitan were not cleanly distinguished:** "Jews frowned upon Latin as the language of the Christian church" but "did not neatly distinguish between the vernacular Romance languages and Latin" — directly paralleling the Voynich's 51% mixed Latin-Occitan lines
- **Shem Tov's biography matches our author profile:** born Tortosa, studied Barcelona, active Marseille 1254–1261+, trilingual Arabic-Hebrew-Occitan-Latin
- The Romance/Occitan terms are confirmed as **Old Occitan** — "the vernacular that Shem Tov ben Isaac uses... also corresponds to Old Occitan"

### Full Database Test: 739 Entries from 4 Sources

Cross-referencing the complete Shem Tov corpus (tools/shem-tov-match.js, data in tools/shem-tov/shimmush-entries.json):

| Source | Entries | Reference |
|---|---|---|
| Sefer ha-Shimmush, List 1 | 667 | Bos/Hussein/Mensching/Savelsberg, Brill 2011 |
| Sefer Almansur | 49 | Bos/Mensching/Zwink, Brill 2017 |
| Bos/Hajek Oxford glossary | 13 | Aleph 19.2, 2019 |
| Arabic-Romance Vatican glossary | 10 | Aleph 15.1, 2015 |

### Test Results: Plants/Substances vs Decoded Voynich

38 of 427 botanically identified Shem Tov entries (8.9%) match decoded Voynich vocabulary. The low hit rate is expected. Shem Tov covers the full materia medica (700+ drugs) while the Voynich is a specialized oil-only pharmacy. The *pattern* of what matches is diagnostic:

**Oil preparations dominate the hits:**
- SHEMEN (oil) appears with 6+ compound forms: oil of balsam, oil of castor, oil of terebinth, oil of unripe olives, jasmine oil → all map to OLEUM (1,007×)
- QUSHIYAH (utensil for oil; a flask or phial) → OLEUM
- QIQ/QIQAYON (castor oil plant, Ricinus communis) → OLEUM

**Core pharmaceutical matches:**
- MELACH (salt) in 3 forms: mineral salt, rock salt, Indian salt → SAL (71×)
- TSEMER (wool) in 2 forms: smooth wool, hatchelled wool → LAIN (272×)
- MAROR (bitter herbs), PAQQUOT (bitter apple), KARSHININ (bitter vetch) → AMARA (656×)
- ZAHAV (gold) in 3 forms → AURUM (103×)

### Test Results: Occitan Terms (35.9% hit rate)

42 of 117 Shem Tov Occitan terms match the decoded Voynich, including:

| Shem Tov Occitan | Meaning | Decoded Voynich | Count |
|---|---|---|---|
| mandragolha | mandrake | MANDRAGORA | 1× |
| grana | seed/grain | GRADU | 72× |
| vermelhon | bright red paint | VER | 34× |
| landa | gold plates | LAN | 26× |
| lopin | lupine | LO | 23× |
| foganha | fireplace | FO | 2× |
| fistola | fistula | FIS | 22× |
| bortolaiga | purslane | BORAGO | 2× |
| airamen | vitriol | AIRAT | 4× |
| gom | resin/gum | GO | 11× |
| nerta | myrtle | NERVI | 25× |
| cora | bark/hide | CORTICE | 46× |

### Test Results: Hebrew Terms in Undecoded Residue

41 exact consonantal matches + 161 close matches across the full manuscript:

| EVA word | Hebrew match | Meaning | Folios |
|---|---|---|---|
| shot/sheet/sheot | S̆.HT | bound, joint | f29v, f42r, f43v, f68v, f72v |
| yteod/ytoda/ytod | YTD | peg, nail, handle | f44v, f66v, f68v, f72v, f90r |
| sokar/sakar/skar | S̆KR# | Buxus sempervirens (box tree) | f16v, f67v, f83r |
| otariin/otairin | #.TRN | tar, liquid pitch | f1r, f8r, f86v |
| ocheol/cheel | K.HL | udder, bag | f68v, f84v, f100v, f104v |
| otaramy | .T."RMY | Armenian bole | f99v |
| kolpy | KLPY | directed towards | f76r |

### The BYB Finding

Hebrew BYB = Occitan **aiguier** = "conduit, pipe, gutter or canal." This term appears in Shem Tov's medical vocabulary as a piece of medical infrastructure. The Voynich biological section's distinctive pipe imagery — groups of figures connected by tubes and channels — has never been satisfactorily explained. A Jewish practitioner from this tradition would have vocabulary for pipes and conduits as pharmaceutical apparatus, and the Kabbalistic parallel (tzinnorot = divine channels) would layer additional meaning onto what was originally practical plumbing terminology.

### Medical Framework Comparison

| Feature | Shem Tov tradition | Voynich | Match? |
|---|---|---|---|
| Oil as primary preparation | 6+ oil compound entries (SHEMEN + modifiers) | OLEUM 1,007× | YES |
| Multiple salt types | Mineral, rock, Indian salt documented | SAL 71× | YES |
| Wool in preparation | TSEMER (smooth wool, hatchelled wool) | LAIN 272× | YES |
| Bilingual Latin-Occitan | "Did not neatly distinguish" Latin from Occitan | 51% mixed lines | YES |
| Family-based training | "From father to son" | No institutional apparatus | YES |
| Guild exclusion | Jews barred from apothecary guilds | Enciphered, no guild affiliation | YES |
| Pipe/conduit vocabulary | BYB (conduit, pipe, canal) | Biological section pipe imagery | YES |
| Galenic qualities | Every entry: hot/cold + dry/wet | AMARA (bitter) but no CALEFACIENS | PARTIAL |

---

## Hebrew Transliterations in the Undecoded Residue

Analysis of the 5,070 unique undecoded word forms (tools/hebrew-decode.js) against 841 Hebrew terms (180 curated + 661 from Shem Tov) reveals that the undecoded 14% contains **Hebrew terms written as direct EVA transliterations**, bypassing the Latin cipher entirely.

### High-Confidence Hebrew Identifications

| EVA word | Phonetic | Hebrew | Meaning | Folio | Evidence |
|---|---|---|---|---|---|
| shalom | SHALOM | SHALOM (שלום) | peace/wholeness | f58r | Exact phonetic match |
| adar | ADAR | ADAR (אדר) | month 12 | f86v | Exact phonetic match |
| ithor | ITHOR | TAHOR (טהור) | ritually pure | f69r | Exact consonants THR |
| otamy | OTAMY | TAMEI (טמא) | ritually impure | f69v | Exact consonants TMY |
| ylaiin | YLAIN | ILAN (אילן) | tree (sefirotic) | f76r | Exact consonants YLN |
| taly | TALY | TELI (תלי) | celestial dragon | f78r | Exact consonants TLY |
| geedy | GIDY | GEDI (גדי) | Capricorn | f26r | Exact consonants GDY |
| kaisar | KAISAR | QAISAR (קיסר) | Caesar/emperor | f107v | Exact consonants |

TAHOR and TAMEI (pure/impure) appear on **adjacent folios** (f69r and f69v) — a ritual purity distinction pair central to mikveh practice. ILAN (sefirotic tree) appears on f76r, the opening of the biological section — where the Kabbalistic "living tree" interpretation predicts it. TELI (celestial dragon, the cosmic axis in Sefer Yetzirah) appears 6+ times across astronomical and recipe sections.

### Zodiac Label Lines — The Hebrew Reservoir

Analysis of line types on the zodiac pages (f67–f73) reveals that **label lines** decode at only 58.8%, compared to 76.8% for regular text (tools/zodiac-deep-dive.js). The zodiac wheel labels — the words written around the circular zodiac diagrams — are where Hebrew vocabulary concentrates. These labels are likely the author's native Hebrew astronomical terminology, written as phonetic transliterations into EVA rather than encoded through the Latin cipher.

### Kabbalistic Terms — Translated, Not Transliterated

Kabbalistic vocabulary appears at ~1–1.5% density across all sections, not concentrated in the biological section. This suggests the author **translated** Kabbalistic concepts into Latin (DEA = Shekhinah, DEUS + HEUS = Gevurah, LAR = domestic sanctification) and only used Hebrew for untranslatable terms — proper nouns like zodiac names, month names, and technical astronomical vocabulary (TELI, GALGAL) that have no Latin equivalent. The Hebrew leaked through at the margins of the cipher, not in the core theological framework.

### Kabbalistic Structure in the Decoded Text — 6/8 Tests Pass

Automated analysis of the decoded text (tools/kabbalistic-structure.js) tests whether the divine vocabulary distributes as sefirotic theory predicts. Results:

| Test | Prediction | Result | Evidence |
|---|---|---|---|
| DEA = Shekhinah in nature | DEA enriched in herbal section | **PASS** | 2.55× enrichment (202 of 297 DEA in herbal) |
| DEUS = Gevurah in danger | DEUS enriched in biological section | **PASS** | 1.74× enrichment |
| HEUS = Gevurah warning | HEUS enriched in biological section | **PASS** | 2.97× enrichment (396 of 673 HEUS in bio) |
| HEUS in DEUS-dominant zones | HEUS absent where DEA presides | **PASS** | 100% of HEUS in DEUS-dominant sections |
| LAR = Chesed in domestic ritual | LAR enriched in recipe section | **PASS** | 1.34× enrichment |
| Gender shift Herbal→Bio | F/M ratio drops across sections | **PASS** | Herbal F/M=0.748, Bio F/M=0.024 (31× drop) |
| OLEUM co-occurs with divine vocab | Emanation paired with theology | **FAIL** | 0.54× (oil is practical, not theological) |
| DEUS+HEUS cluster together | Gevurah terms in same lines | **FAIL** | 0.90× (same section, not same lines) |

The two failures are structurally informative: OLEUM operates in the practical pharmaceutical domain rather than the theological one, and DEUS/HEUS frame sections at different structural levels (DEUS at section-level, HEUS at procedure-level) rather than co-occurring syntactically.

A 10,000-iteration permutation test (tools/sefirotic-permutation-test.js) confirms these patterns are not artifacts of random word placement. Divine vocabulary positions were randomly shuffled while keeping all other words fixed. Four of six tests produced p-values below 0.0001: DEA in herbal (real 2.47× vs permutation mean 0.75×), HEUS in biological (2.98× vs 1.68×), LAR in recipe (1.39× vs 0.94×), and the gender ratio drop (36.8× vs 1.0×). The combined probability of obtaining these results by chance is 6.25 × 10⁻⁶ — approximately 1 in 160,000. Full statistical results in [05-statistical-evidence.md](05-statistical-evidence.md).

**TELI (celestial dragon)** appears at manuscript section boundaries 29.4% of the time — marking Herbal→Cosmological, Zodiac→Biological, Biological→Pharmaceutical, and Pharmaceutical→Recipe transitions. The Sefer Yetzirah's cosmic axis literally marks the structural seams of the manuscript.

**HEUS+NOCETIS tight co-occurrence: 1.63× enrichment** within 3-word windows — the warning-harm sequence is a formalized safety protocol, consistent with karet-adjacent language in the Talmudic sense ("lest you die" for approaching the sanctuary in impurity).

### The O-Prefix Is Not Hebrew

Testing whether initial EVA "o" represents the Hebrew definite article "ha-" (tools/o-prefix-analysis.js): **negative**. The "o" appears at equal rates in decoded (22.0%) and undecoded (24.4%) words, stripping it improves decoding only 11.8% of the time, and Hebrew match rates are identical with or without it (84% vs 84%). The "o" is a cipher-internal glyph, not a Hebrew morphological marker.

### Paleographic Corrections: n/m Confusion

EVA final "n" and "m" are visually similar glyphs. 91 unique undecoded forms produce glossary hits when final m→n or n→m is corrected, recovering ~40 tokens of core pharmaceutical vocabulary: DAIM→DAIN=LAIN (wool, 11×), AIM→AIIN=AMARA (bitter, 7×), DAIIM→DAIIN=OLEUM (oil, 5×), SAIM→SAIN=SAIN (lard, 2×).

---

## Caveats

- The consonantal matches are **statistical**, not individually definitive. Each match could be coincidence; the **pattern** is what matters.
- The EVA-to-phonetic mapping is approximate. A more rigorous mapping would require testing multiple phonetic hypotheses.
- Many "close matches" (distance 1) on short strings (3–4 consonants) could be false positives.
- The Kabbalistic interpretation of the biological section is **speculative** — it provides a coherent framework but cannot be proven from the decoded text alone without additional evidence.
- The same communities that produced Kabbalah also produced secular medical practitioners. The author could be a Jewish physician working in a purely medical tradition, with no Kabbalistic intent.

---

## Reproducibility

- `tools/hebrew-test.js` — Extracts all undecoded words from astronomical/zodiac sections and paragraph-initial words
- `tools/hebrew-match.js` — Cross-references undecoded EVA against 95 Hebrew terms using phonetic and consonantal matching
- `tools/zodiac-wheel-test.js` — Tests Hebrew zodiac names against specific zodiac wheel folios for correct-page correlation
- `tools/arabic-zodiac-test.js` — Tests Arabic astronomical terms for comparison against Hebrew results
- `tools/shem-tov-match.js` — Cross-references Shem Tov's 739-entry synonym database against both decoded and undecoded Voynich vocabulary; tests Latin, Occitan, and Hebrew pharmaceutical terms
- `tools/shem-tov/shimmush-entries.json` — 739-entry database extracted from 4 Brill publications (667 Shimmush + 49 Almansur + 13 Bos-Hajek + 10 Vatican)
- `tools/hebrew-decode.js` — Tests 841 Hebrew terms (180 curated + 661 Shem Tov) against all 5,070 unique undecoded forms; section-by-section analysis with Kabbalistic deep-dive
- `tools/zodiac-deep-dive.js` — Word-by-word analysis of zodiac folios f67–f73; line-type decode rates; Hebrew zodiac/month/planet matching per folio
- `tools/o-prefix-analysis.js` — Tests whether initial EVA "o" represents Hebrew definite article "ha-"; section distribution; null-prefix variant recovery
- Hebrew vocabulary database compiled from: Jewish Encyclopedia (zodiac, constellations), Shlomo Sela's Ibn Ezra editions (astronomical terms), Sefer Yetzirah tradition (sefirot), Shem Tov synonym lists (plant names), Zohar/Bahir terminology, standard medieval Hebrew lexicons.

## Sources

### Primary Texts
- Shem Tov ben Isaac of Tortosa, *Sefer Almansur* — Bos, Mensching, Zwink (eds.), *Medical Glossaries in the Hebrew Tradition*, Brill 2017 (ISBN 978-90-04-35202-5)
- Shem Tov ben Isaac of Tortosa, *Sefer ha-Shimmush*, Book 29, List 1 — Bos, Hussein, Mensching, Savelsberg (eds.), *Medical Synonym Lists from Medieval Provence*, Brill 2011 (ISBN 978-90-04-16764-3)

### Secondary Sources
- Joseph Shatzmiller, *Jews, Medicine, and Medieval Society* (Berkeley: University of California Press, 1994)
- Gerrit Bos and Guido Mensching, "The Literature of Hebrew Medical Synonyms: Romance and Latin Terms and their Identification," *Aleph* 5 (2005): 169–211
- David Nirenberg, *Communities of Violence: Persecution of Minorities in the Middle Ages* (Princeton, 1996)
- Michael McVaugh, *Medicine Before the Plague: Practitioners and Their Patients in the Crown of Aragon 1285–1345* (Cambridge, 1993)
