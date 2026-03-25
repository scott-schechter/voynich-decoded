# Methodology Summary

## Overview

This document catalogs every analysis technique used in the decipherment, what each technique tests, what data it produces, and where the results appear.

## Cipher Identification

### 1. Positional Homophonic Substitution Mapping
**What:** Map EVA glyphs to Latin letters based on position (initial, medial, final) within each word.
**Data produced:** 4,046-entry glossary (EVA→Latin/Occitan/Hebrew/Aramaic).
**Key finding:** 87.5-89% of tokens decode to real vocabulary.
**Documents:** 01-cipher-system.md, glossary-export.js

### 2. Null-Padding Identification
**What:** Identify EVA glyphs/sequences that carry no content (gallows characters, prefix nulls).
**Data produced:** 4 gallows types (cth/ckh/cph/cfh) confirmed as nulls; 10 null prefixes (d/l/ol/p/op/o/s/sh/k/qo).
**Key finding:** ~150 base words generate ~38,000 surface tokens through combinatorial null padding.
**Documents:** 01-cipher-system.md, 18-null-analysis.md

### 3. Verb Paradigm Cross-Validation
**What:** Derive positional rules from one word family (DEUS/DAT), then test whether those rules produce correct conjugations of other verbs.
**Data produced:** 18 NOCERE forms, 10+ FACERE forms, DARE, LAUDARE, DICERE paradigms.
**Key finding:** Rules derived from one family produce valid morphology across five independent verb families.
**Documents:** 02-verb-paradigms.md

## Statistical Validation

### 4. Coverage Testing
**What:** Measure what percentage of manuscript tokens the glossary decodes. Compare against random EVA input.
**Data produced:** 87.5-89% real vs 2.1% random (42× ratio).
**Key finding:** The glossary selectively matches real manuscript tokens, not arbitrary EVA sequences.
**Documents:** 05-statistical-evidence.md

### 5. Zipf's Law Validation
**What:** Test whether decoded word frequencies follow the power-law distribution characteristic of natural language.
**Data produced:** Exponent -0.919 (natural language range: -0.8 to -1.2).
**Key finding:** Decoded vocabulary has natural language frequency distribution.
**Documents:** 05-statistical-evidence.md

### 6. Hold-Out Validation
**What:** Build glossary from subset of folios, test coverage on unseen folios.
**Data produced:** 79-81% coverage on held-out folios.
**Key finding:** Coverage is not an artifact of overfitting to the training folios.
**Documents:** 05-statistical-evidence.md

### 7. Formulaic Repetition Test
**What:** Count repeated 3-word phrases in decoded text vs word-shuffled control.
**Data produced:** 94 repeated phrases vs 16 in shuffled text (5.78× ratio).
**Key finding:** Decoded text has formulaic structure, not random word combinations.
**Documents:** 14-structural-analysis.md

## Page-Level Structure

### 8. Reading Order Testing
**What:** Test 14 geometric reading orders (columnar, diagonal, boustrophedon, spiral, etc.) across 8 folios. Score by grammatical coherence of adjacent word pairs.
**Data produced:** V-N line pairing scores highest; diagonal second.
**Key finding:** The author separated verb-lines from noun-lines. Reading requires grammatical recombination.
**Documents:** 19-page-order-analysis.md

### 9. Section Divider Analysis
**What:** Identify single-glyph lines as paragraph markers. Decode divider content where possible.
**Data produced:** SED ("but"), RECIPE ("take!"), and null markers divide pages into 2-10 sections.
**Key finding:** Dividers mark procedural transitions in standard pharmaceutical recipe structure.
**Documents:** 19-page-order-analysis.md

### 10. Section-Aware Grammatical Assembly
**What:** Within each page section, pool decoded words by grammatical category and assemble in pharmaceutical sentence order (Divine-Function-Verb-Adjective-Noun-Function).
**Data produced:** 80-100% coherent adjacent word pairs across 6 tested folios.
**Key finding:** Assembled text reads as pharmaceutical instructions.
**Documents:** 19-page-order-analysis.md

### 11. Spatial Word Distribution
**What:** Map decoded words to page zones (top/upper/lower/bottom quarters, left/right halves).
**Data produced:** Warnings cluster LEFT (11% vs 7%), prescriptions cluster RIGHT (7% vs 3%). Top-to-bottom narrative follows illustration layout.
**Key finding:** Text wraps around illustrations, describing them from top to bottom.
**Documents:** 20-folio-level-validation.md

## Content Validation

### 12. Plant-Property Cross-Validation
**What:** For 14 herbal folios with known plant IDs, check if decoded vocabulary matches that plant's documented medieval pharmaceutical properties.
**Data produced:** 84% expected vocabulary found, 100% correct absences.
**Key finding:** Frankincense page has 8/8 expected terms (probability 1 in 3.4 million). Hemlock page has RECIPE absent.
**Documents:** 20-folio-level-validation.md

### 13. Harm-Toxicity Correlation
**What:** Count harm/warning vocabulary per herbal folio and compare with known plant toxicity.
**Data produced:** Hemlock (6 harm, 1 warning), rue (8 harm, 2 warnings), mulberry (2 harm, 0 warnings).
**Key finding:** More toxic plants produce more harm vocabulary.
**Documents:** 20-folio-level-validation.md

### 14. Kabbalistic Permutation Test
**What:** 10,000-iteration permutation test for divine vocabulary distribution (DEA/DEUS/HEUS/LAR) across sections.
**Data produced:** 4 of 6 tests at p < 0.0001, combined probability 1 in 160,000.
**Key finding:** Divine vocabulary distributes according to sefirotic theology, not chance.
**Documents:** 17-hebrew-hypothesis.md

### 15. Recipe Structure Comparison
**What:** Compare decoded text structure against Antidotarium Nicolai recipe format (Name→Ingredients→Preparation→Formation→Dosage).
**Data produced:** 6 of 7 structural elements match.
**Key finding:** Voynich recipes follow the same structure as contemporary pharmaceutical texts.
**Documents:** 20-folio-level-validation.md

### 16. Dioscorides Maceration Confirmation
**What:** Search for evidence of the Dioscorides repeated oil maceration protocol (heat, strain, add fresh material, repeat).
**Data produced:** FOCERAT (pluperfect, "had heated") appears 6× on f99r. BIS ("twice") appears 283× total.
**Key finding:** The pluperfect tense encodes sequential completed heating steps.
**Documents:** 20-folio-level-validation.md

## Language Analysis

### 17. Trilingual Domain Mapping
**What:** Classify every decoded word by language (Latin/Occitan/Hebrew) and map which language covers which conceptual domain.
**Data produced:** Latin 82.9%, Occitan 10.2%, Hebrew 6.9%. Zero domain overlap.
**Key finding:** Each language was learned in a different context and covers a different knowledge domain.
**Documents:** 24-quadrilingual-analysis.md

### 18. Aramaic Layer Identification
**What:** Test undecoded tokens against 126 Aramaic terms from Talmudic medical passages, Zohar, and Targum. Context-validate each match.
**Data produced:** 70 context-validated matches (102 tokens). ASHTA/fever, SAMMA/drug, TICHLA/remedy, UKMA/black, CHAD/one.
**Key finding:** Fourth language confirmed. Aramaic covers medical knowledge, body parts, colors, and numbers.
**Documents:** 24-quadrilingual-analysis.md

### 19. Hebrew Celestial Vocabulary
**What:** Match undecoded astronomical tokens against Hebrew terms from Sefer Yetzirah, Ibn Ezra, Talmud, Maimonides.
**Data produced:** 253 potential tokens. TELI (Sefer Yetzirah), GEDI (Capricorn), IGGUL (circle/orbit), RAKIA (firmament).
**Key finding:** Astronomical section contains Hebrew celestial terminology from specific Jewish intellectual traditions.
**Documents:** 21-hebrew-trade-vocabulary.md

### 20. Hebrew Trade Vocabulary
**What:** Match undecoded tokens against Hebrew pharmaceutical/trade terms across all sections.
**Data produced:** 459 potential tokens. TZORI/balsam, LACH/moist, TOCHEN/grind, KAD/jar.
**Key finding:** Hebrew fills vocabulary gaps that Latin doesn't cover (tools, humoral qualities, sacred materials).
**Documents:** 21-hebrew-trade-vocabulary.md

### 21. Aramaic Number-Dosage Correlation
**What:** Test whether Aramaic numbers (CHAD/one, TLATA/three) appear near time words more than random undecoded tokens.
**Data produced:** 2.2× enrichment near time words vs random baseline.
**Key finding:** Aramaic numbers function as dosage counters: "CHAD HORA" = "one hour."
**Documents:** 24-quadrilingual-analysis.md

## Vocabulary Discovery

### 22. Time-Based Dosage System
**What:** Catalog all temporal vocabulary and test whether it functions as a dosage system.
**Data produced:** 1,177 tokens: DIES (469×), BIS (283×), HORAM (111×), TERTIO (86×), HORA (58×), NOCTES (56×), DIEM (54×).
**Key finding:** The "missing" dosage system is time-based, not weight-based. Consistent with oil maceration protocol.
**Documents:** 22-session-findings-march24.md

### 23. 13-Axis Quality Assessment
**What:** Identify all quality/assessment vocabulary and classify by axis (taste, yield, smell, texture, color, freshness, intensity, frequency, moisture, general).
**Data produced:** 13 axes, 1,500+ tokens. AMARA/bitter (660×), LAETUS/rich (330×), ODORATUS/fragrant (114×).
**Key finding:** Materials were evaluated on 13 independent quality dimensions using Latin (11 axes) and Hebrew (2 axes).
**Documents:** 22-session-findings-march24.md

### 24. LAETUS Context Analysis
**What:** Test whether LAETUS means "fertile/rich" (quality) or "yellow/saffron" (color) by analyzing adjacent words.
**Data produced:** LAETUS modifies same nouns as AMARA (quality word), not same nouns as ALBA (color word). Yield context (31) beats visual context (18).
**Key finding:** LAETUS = quality assessment (yield/potency), not color.
**Documents:** 22-session-findings-march24.md

### 25. OR Dual-Meaning Analysis
**What:** Test whether Occitan OR means "gold" (material) or "now" (temporal) by context.
**Data produced:** 55% temporal context (near verbs), 45% material context (near nouns).
**Key finding:** OR carries both meanings. Context determines which.
**Documents:** 22-session-findings-march24.md

### 26. Body Part Search
**What:** Match undecoded tokens against Hebrew/Latin body part vocabulary.
**Data produced:** DAM/blood (30× decoded), COR/heart, REN/kidney, CUTIS/skin, GENU/knee in undecoded.
**Key finding:** Body parts exist in both languages. DAM (blood, Hebrew) reclassified from Occitan "damage."
**Documents:** 22-session-findings-march24.md

### 27. Color Vocabulary Search
**What:** Search for color terms in Latin, Hebrew, and Aramaic.
**Data produced:** ALBA/white (Latin, 25×), ADOM/red (Hebrew, 8×), UKMA/black (Aramaic, 18×), KACHOL/blue (Hebrew, 2×).
**Key finding:** Color vocabulary is trilingual. Hebrew covers sacred colors (red=blood, blue=tekhelet).
**Documents:** 22-session-findings-march24.md

### 28. Agricultural/Seasonal Vocabulary
**What:** Search for agricultural, seasonal, and weather terms.
**Data produced:** VER/spring (41×), SEMEN/seed (19×), SARE/plant (93×), TAL/dew (53×), KEREM/vineyard (3×).
**Key finding:** The herbal section contains agricultural vocabulary. The astronomical section is a planting calendar.
**Documents:** 22-session-findings-march24.md

## Cipher Extension

### 29. qo- Null Prefix Discovery
**What:** Test whether the undecoded qo- initial is a cipher compound (encoding a Latin letter) or a null prefix (carrying no content).
**Data produced:** 34.9% of qo- tokens decode when qo- is stripped. 8/15 top following words overlap with NOC- words.
**Key finding:** qo- is the 10th null prefix. +99 glossary entries, +113 tokens.
**Documents:** 22-session-findings-march24.md

### 30. Double-Null 5-7 Character Tokens
**What:** Apply extended null prefix stripping (including double-null combinations) to 5-7 character undecoded tokens.
**Data produced:** 242 new entries, 279 tokens decoded.
**Key finding:** Double-null combinations (o+k, ol+k, qo+k) generate additional surface variants.
**Documents:** 22-session-findings-march24.md

### 31. Context-Guided Undecoded Analysis
**What:** For remaining undecoded tokens, analyze surrounding decoded words to predict grammatical category and semantic role.
**Data produced:** 869 predicted nouns, 790 predicted verbs, 166 predicted function words. 28% of gaps cluster next to other undecoded tokens.
**Key finding:** Remaining gaps are mostly content words (materials, actions), not structural words.
**Documents:** 22-session-findings-march24.md

### 32. Gallows-Word Correlation
**What:** Test whether the four gallows types (cth/ckh/cph/cfh) decode to the same word distributions or different ones.
**Data produced:** CKH is 2.2× enriched for DIES and correlates with HEUS (10.7%) in the biological section.
**Key finding:** CKH may function as a warning/temporal marker rather than a pure null.
**Documents:** 19-page-order-analysis.md

## Synthesis

### 33. Five-Axis Linguistic Analysis
**What:** Tag every decoded word across morphological form, pharmaceutical role, addressee, valence, and source-vs-product. Analyze distribution per section.
**Data produced:** Unique five-axis fingerprint per manuscript section.
**Key finding:** Each section has distinct linguistic signatures matching its content type across all five independent axes.
**Documents:** 25-five-axis-analysis.md

### 34. Complete Manuscript Reading
**What:** Apply section-aware grammatical assembly to all 225 folios.
**Data produced:** 7,725-line complete reading, deployed at voynich-decoded.com/transcription.html.
**Key finding:** Every folio produces coherent pharmaceutical vocabulary consistent with its manuscript section.
**Documents:** voynich-complete-reading.txt

### 35. Label Cipher Extension
**What:** Apply 40-entry label positional table to all 109 herbal first-words.
**Data produced:** 16 plant names matched (6 new: colchicum, absinthium, melissa, cardamomum, consolida, cyclamen).
**Key finding:** Label cipher uses a different encoding table from the prose cipher. Missing medial vowel mappings limit further progress.
**Documents:** 04-plant-identifications.md

## Data Sources

| Source | Description | Location |
|---|---|---|
| EVA transcription | Takahashi transcription of full manuscript | tools/eva-data/eva_takahashi.txt |
| Glossary | 4,046 EVA→decoded mappings | tools/glossary-export.js |
| Decoder | Standalone decode script | decode.js |
| Shem Tov database | 739-entry medical synonym list | tools/shem-tov/shimmush-entries.json |
| Complete reading | 225-folio assembled text | publication/voynich-complete-reading.txt |
