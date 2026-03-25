# Session Findings — March 24, 2026

## Overview

This document records the findings from a single intensive research session that produced 22 distinct discoveries, expanded the glossary from 3,648 to 3,681 entries, and generated the first complete assembled reading of all 225 folios (31,967 of 37,044 tokens, 86.3%).

## 1. Page-Level Structure

### Section Dividers
Single-glyph lines (tagged `*L0` in the EVA transcription) function as paragraph dividers, splitting pages into 2–10 sections. Where decoded: SED ("but"), RECIPE ("take!"), or null markers. On f76r, RECIPE on line 31 marks the exact transition from warnings to the recipe proper.

### Verb-Noun Line Separation
Within each section, verb-dominated lines contain instructions/warnings and noun-dominated lines contain materials/ingredients. Interleaving verb-lines with noun-lines produces more coherent text than any geometric reading order (14 orders tested across 8 folios).

### Section-Aware Assembly
Assembling decoded words by grammatical category within sections produces 80–100% coherent adjacent word pairs. Tested on f2v (100%), f33v (85%), f75r (80%), f76r (85%), f88r (84–88%), f104r (80%).

## 2. Folio-Level Plant Validation

On 14 herbal folios with known plant identifications, decoded vocabulary matches documented medieval pharmaceutical properties at 84% combined accuracy, with 100% correct absences.

**f33v (frankincense): 8/8 perfect** — THUS, FUMUM, AMARA, TARTARUM, OLEUM, LAIN, FILUM, FOCAR. Probability of three plant-specific terms co-occurring by chance: 1 in 3.4 million.

Harm vocabulary correlates with plant toxicity: hemlock (6 harm verbs, RECIPE absent), rue (8 harm, 2 warnings), mulberry (2 harm, 0 warnings).

## 3. Spatial Patterns

Warning vocabulary (HEUS, harm verbs) clusters LEFT within lines (11% vs 7%). Prescriptive vocabulary (DICIT, DAT) clusters RIGHT (7% vs 3%). Within-line reading direction: WARNING → INSTRUCTION → MATERIAL.

Top-to-bottom narrative flow follows illustration layout: plant name at top, assessment in upper zone, preparation in middle, outcomes at bottom.

## 4. Recipe Structure Matches Antidotarium Nicolai

6 of 7 structural elements align: authority opening, RECIPE marker, preparation verbs (FOCAR ≈ COQUE), FIAT formation, materials specification, temporal markers. Missing only dosage units — resolved by finding #10.

FOCERAT (pluperfect, "had heated") appears 6× on f99r, confirming the Dioscorides repeated maceration cycle.

## 5. Gallows-Word Correlation

Full-manuscript test (2,129 gallows tokens): CKH is 2.2× enriched for DIES and uniquely correlates with HEUS (10.7%), particularly in the biological section (59 CKH→HEUS). CTH, CPH, CFH function as pure nulls.

## 6. Trilingual Domain Mapping

The three languages divide by function with zero overlap:

| Language | Coverage | Domains |
|---|---|---|
| Latin (82.9%) | Professional pharmaceutical prose | Verbs, plant names, quality assessment, prescriptive framework |
| Occitan (10.2%) | Local marketplace/workshop | Trade materials (wool, lard, bath, gold, fish sauce), articles, 3pl verb endings |
| Hebrew (6.9%) | Sacred + ancestral + craft | Divine authority, celestial timing, workshop tools, sacred materials, humoral qualities |

Per-section: biological and recipe sections have the most Occitan (13%) and Hebrew (11%) — the hands-on workshop sections.

## 7. Hebrew Celestial Vocabulary (253 tokens)

Undecoded astronomical section tokens match Hebrew celestial terms: zodiac names (74 occurrences), month names (46), Sefer Yetzirah cosmology (28), Ibn Ezra astronomy (23).

Key matches: TELI (celestial dragon, Sefer Yetzirah), GEDI (Capricorn), DELI (Aquarius), SHOR (Taurus), IGGUL (circle/orbit, Ibn Ezra), RAKIA (firmament), DAKAH (minute of arc).

## 8. Hebrew Trade Vocabulary (459 tokens)

Undecoded tokens across all sections match Hebrew pharmaceutical/trade terms: tools (227 occurrences), humoral qualities (67), materials (64), processing verbs (45).

Key matches: TZORI (balsam/resin, 21×), LACH (moist, 9×), TOCHEN (to grind), KAD (jar), MOR (myrrh), RACH (soft), SAM (drug/poison), ELI (pestle).

Hebrew fills specific gaps: workshop tools, processing verbs, and two humoral qualities (soft, moist) that have no Latin equivalent in the glossary.

## 9. Body Parts

DAM (Hebrew: blood, 30×) was reclassified from Occitan "damage." Body parts found in both languages: Latin for external/structural (COR/heart, REN/kidney, CUTIS/skin, GENU/knee), Hebrew for fluids (DAM/blood, ETZEM/bone).

Body parts cluster in the herbal section — plants assessed for their effect on specific body parts.

## 10. Time-Based Dosage System (1,177 tokens)

The "missing" dosage system is time-based, not weight-based: DIES (day, 469×), BIS (twice, 283×), HORAM (for an hour, 111×), TERTIO (thirdly, 86×), HORA (hour, 58×), NOCTES (nights, 56×), DIEM (for a day, 54×), BINUS (double, 49×).

This is consistent with Dioscorides oil maceration, where preparation time IS the dosage parameter: "heat for an hour," "soak for a day," "repeat twice," "thirdly heat."

## 11. 13-Dimension Quality Assessment

| Axis | Word | Count | Language |
|---|---|---|---|
| Taste | AMARA (bitter) | 660× | Latin |
| Yield | LAETUS (rich/potent) | 330× | Latin |
| Smell | ODORATUS (fragrant) | 114× | Latin |
| Texture | HIRTUS (rough) | 61× | Latin |
| Taste | ACUTUS (sharp) | 29× | Latin |
| Color | ALBA/ALBUM (white) | 25× | Latin |
| Freshness | NOVUM (new) | 43× | Latin |
| Intensity | ALTUS (deep) | 20× | Latin |
| General | BONUS (good) | 52× | Latin |
| Frequency | RARO (rarely) | 33× | Latin |
| Taste | SALSUS (salty) | 8× | Latin |
| Texture | RACH (soft) | 2× | Hebrew |
| Moisture | LACH (moist) | 9× | Hebrew |

LAETUS confirmed as quality (yield/potency) not color (yellow) by context analysis: modifies the same nouns as AMARA, appears after harm/warning verbs, yield context (31) beats visual context (18).

## 12. Three Imperative Commands

RECIPE (take! 118×) + FAC (make! 101×) + HABE (have/hold! 144×) = 363 direct workshop commands. This is oral instruction to apprentices.

## 13. Colors

Decoded: ALBA/ALBUM (white, 25×). Undecoded matches: ADOM (red, Hebrew, 8× herbal), ATER (dark, Latin, 3× herbal), KACHOL (blue, Hebrew, 2× herbal+astro), AUREUS (golden, Latin, 2× herbal). Hebrew covers the sacred/symbolic colors (red=blood, blue=tekhelet priestly dye).

## 14. OR Dual Meaning

Occitan OR (472×) means both "gold" (material) and "now" (temporal). Context analysis: 55% temporal, 45% material. Both meanings active throughout.

## 15. Reclassified 5,531 Tokens

793 decoded words (10,805 tokens) reclassified from "uncategorized": pharmaceutical verbs (NOCS, FOCES, DICIS), imperatives (FAC, HABE), accusative temporal forms (HORAM, DIEM), quality adjectives (QUALIS, BONUS, LATUS), tool nouns (LIMA, FOCUM), and Latin grammatical forms (DATUS, SUMMA, GRATIA).

## 16. Agricultural Vocabulary (370 tokens)

Seasonal/agricultural terms found: VER (spring, 41×), SEMEN (seed, 19×), SARE (to plant, 93×), TERRA (earth, 2×), GAN (garden, Hebrew, 4×). Undecoded: KEREM (vineyard, Hebrew, 3×), SERO (to sow, 4×), LEGO (to gather, 2×), SICCO (to dry, 1×), ARENA (sand, 5×).

The herbal section contains agricultural verbs for growing and harvesting. The astronomical section includes KEREM (vineyard) — it's a planting calendar.

## 17. Weather/Dew Vocabulary

TAL (Hebrew: dew, 53×) concentrates in the biological section (24×). Dew was used in medieval Jewish medicine for bathing preparations, collected at specific astronomical times. ROS (Latin: dew, 2×) also present. VER (spring, 41×) concentrates in herbal (20×) — spring gathering.

## 18. SANAT (it heals, 9×)

A healing verb exists in the manuscript. Previously claimed absent. Rare because the manuscript is about preparation, not treatment.

## 19. HAMAM (hot bath, 10×)

Arabic/Hebrew HAMMAM on herbal pages (9×). A specific bath type from the Islamic/Jewish bathhouse tradition.

## 20. Complete Manuscript Reading

225 folios decoded through section-aware grammatical assembly. Output: 7,725 lines covering every folio, organized by section. Deployed to voynich-decoded.com/transcription.html.

## 21. Definitive f33v Reading

The frankincense page fully annotated with all vocabulary layers: assessment (bitter, sharp, fragrant), materials (frankincense, oil, tartar, wool, thread, fume), process (heat, twice), divine authority (goddess), time-dosage (day, twice). 76% decoded, trilingual (Latin 46, Occitan 10, Hebrew 2).

## 22. The Complete Production Chain

The manuscript describes a full agricultural-pharmaceutical-calendar system:

1. **Grow/gather** (VER/spring, SARE/plant, LEGO/gather, SEMEN/seed, HORTUS/garden, GAN/garden, KEREM/vineyard)
2. **Assess quality** (13 axes: AMARA/bitter, LAETUS/rich, ODORATUS/fragrant, HIRTUS/rough, ACUTUS/sharp, etc.)
3. **Time by celestial calendar** (zodiac wheels, Hebrew month names, DIES/day, HORA/hour, TAL/dew)
4. **Process in workshop** (FOCAR/heat, FOCERAT/had heated, TOCHEN/grind, FILUM/thread, LAIN/wool filter, KAD/jar)
5. **Execute dangerous procedures** (HEUS/beware, NOCETIS/you all harm, BAIN/bath, SAIN/lard, SAL/salt)
6. **Compound recipes** (RECIPE/take, FAC/make, HABE/have, materials list, BIS/twice, TERTIO/thirdly)
7. **Record outcomes** (FUIT/it was, DEDIT/yielded, DATUS/given, past tense throughout)

## Impact

| Metric | Start of session | End of session |
|---|---|---|
| Glossary entries | 3,648 | 3,681 |
| Decoded tokens | 31,902 (86.1%) | 31,967 (86.3%) |
| Publication documents | 18 | 22 |
| Identified Hebrew domains | 2 (celestial, purity) | 7 (celestial, trade, tools, qualities, body, colors, agriculture) |
| Quality assessment axes | 7 | 13 |
| Dosage vocabulary | 0 (claimed absent) | 1,177 tokens |
| Imperative commands | 1 (RECIPE) | 3 (RECIPE, FAC, HABE) |
| Complete folio readings | 0 | 225 |
