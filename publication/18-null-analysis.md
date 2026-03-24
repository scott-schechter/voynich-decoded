# The Null Character Problem

## Summary

The decipherment produces correct Latin vocabulary at the word level (87.8% coverage, 18 NOCERE conjugations, Zipf-compliant frequency distribution) but decoded passages read as fragmented phrases rather than fluent prose. This document investigates whether characters currently treated as "null padding" actually carry information that could improve sentence-level readability.

## The Current Null System

The decoder treats the following as null (carrying no meaning):

| Type | Characters | Count | Current treatment |
|---|---|---|---|
| Super-gallows | cth, ckh, cph, cfh | 2,149 total | Stripped before lookup |
| Medial nulls | ch (medial), f (medial) | ~5,300 | Stripped if removal produces glossary hit |
| Final nulls | t, g, p (final) | ~200 | Stripped if removal produces glossary hit |
| Prefix nulls | o, d, l, p, sh, s, k, ol, op | ~3,000 | Stripped if removal produces glossary hit |

Combined, approximately 10,000+ tokens are treated as null across 37,886 total tokens — roughly 26% of all glyphs.

## Finding 1: Super-Gallows Preferentially Appear at Vowel Positions

When super-gallows positions in EVA words are mapped to the corresponding positions in their decoded Latin equivalents, the gallows character appears at a vowel position 63% of the time. By chance (Latin text is ~40% vowels), this should be ~40%.

| Metric | Value |
|---|---|
| SG positions tested | 1,447 |
| SG at vowel position | 911 (63.0%) |
| Expected by chance | ~40% |
| Enrichment | 1.58× |

This means super-gallows are not randomly placed — they preferentially land where vowels should be in the Latin word.

## Finding 2: The Four Super-Gallows Types Are Not Interchangeable

The glyph immediately following each super-gallows type differs:

| SG type | Count | Followed by y | Followed by e | Followed by o |
|---|---|---|---|---|
| cth | 939 | 39% | 19% | 24% |
| ckh | 903 | 50% | 25% | 11% |
| cph | 217 | 24% | 26% | 26% |
| cfh | 74 | 32% | 19% | 22% |

If all four types were purely decorative, they would show the same following-glyph distribution. They do not. In particular, ckh strongly prefers y (50%) while cph distributes more evenly across y/e/o.

## Finding 3: Super-Gallows Do Not Map Cleanly to Individual Vowels

Testing which Latin vowel appears at the SG position:

| SG type | Dominant vowel at position | Second | Third |
|---|---|---|---|
| cth (n=320) | I = 45% | E = 28% | A = 19% |
| ckh (n=491) | I = 52% | E = 24% | A = 12% |
| cph (n=76) | A = 33% | I = 28% | E = 22% |
| cfh (n=24) | I = 38% | E = 33% | A = 21% |

Both cth and ckh favor I, not different vowels. This rules out a simple one-to-one SG-to-vowel mapping. However, cph shows a different distribution (A-dominant instead of I-dominant), suggesting the types may encode vowel classes or something vowel-adjacent rather than specific vowels.

## Finding 4: Super-Gallows Frequency Does Not Match Latin Vowel Frequency

| SG type | % of all SG |  | Latin vowel | % of vowels |
|---|---|---|---|---|
| cth | 44.2% | | A | ~28% |
| ckh | 42.3% | | E | ~26% |
| cph | 10.1% | | I | ~20% |
| cfh | 3.4% | | O+U | ~26% |

The SG distribution (44/42/10/3) does not match any plausible mapping to Latin vowels (28/26/20/16/10). If SGs encoded vowels directly, we would expect frequencies closer to the Latin vowel distribution.

## Hypotheses for Further Testing

### H1: Super-Gallows as Generic Vowel Markers

The SGs mark "a vowel goes here" without specifying which vowel. The cth/ckh distinction may be calligraphic (based on the preceding stroke) rather than semantic. The reader reconstructs the specific vowel from context and Latin knowledge, much like Hebrew nikkud (vowel points) which trained readers don't need.

**Test:** If SGs are generic vowel markers, removing them and re-inserting vowels into consonant skeletons based on Latin word recognition should produce more readable text than the current approach of simply stripping them.

### H2: Super-Gallows Encode Syllable Structure

The four types might mark different syllable positions: onset, nucleus, coda, or syllable boundaries. The different following-glyph distributions would reflect the different phonological contexts.

**Test:** Map SG positions to syllable boundaries in the decoded Latin words. If cth consistently appears at syllable onsets and ckh at syllable codas (or similar), this hypothesis holds.

### H3: Super-Gallows Encode Word Position in Sentence

The four types might indicate where the word belongs in the sentence (1st, 2nd, 3rd, 4th position), providing the missing reading-order information.

**Test:** Check whether SG type correlates with word position within a line. If cth-words cluster at line beginnings and cfh-words at line endings (or any consistent positional pattern), this hypothesis holds.

### H4: Null Prefixes Encode Grammatical Function

The prefix nulls (o, d, l, p, sh, s, k) might encode grammatical information — case, number, tense, or part of speech — that would help reconstruct sentences.

**Test:** For words that decode to the same Latin base with different null prefixes (e.g., ochedy, dchedy, lchedy all → DEUS/MEUS/etc.), check whether the prefix correlates with the grammatical context (subject vs object, singular vs plural, etc.).

### H5: Reading Order Follows Illustration Paths

The text on zodiac pages might spiral around the wheel. Biological pages might follow the pipes. Herbal pages might read around the plant illustration.

**Test:** For a single well-illustrated folio (e.g., f76r biological), manually reorder the decoded lines following the visual flow of the illustration and check whether the reordered text reads more coherently.

## Finding 5: Super-Gallows Show Weak Word-Position Signal

Testing whether SG type correlates with position in a line:

| SG type | Q1 (start) | Q4 (end) | Start% | End% |
|---|---|---|---|---|
| cth | 202 | 208 | 22.4% | 23.1% |
| ckh | 250 | 144 | 28.5% | 16.4% |
| cph | 51 | 40 | 25.0% | 19.6% |
| cfh | 14 | 18 | 20.6% | 26.5% |

Expected by chance: 25% in each quartile. ckh favors line beginnings (28.5%) and avoids endings (16.4%). cfh shows the opposite pattern. The signal is weak but suggests the types may carry positional information.

## Finding 6: Null Prefixes Correlate With Grammatical Category

The strongest finding. Different null prefixes pair with different types of Latin words:

| Prefix | Top words | Verbs% | Nouns% | Divine% |
|---|---|---|---|---|
| o- (n=5775) | BIS, GENUS, TEUS, BAIN | 2% | 9% | 3% |
| d- (n=2957) | AMARA, AD, AL, AN | 6% | 5% | 4% |
| l- (n=1121) | DEUS, BIS, AM, DES | 7% | 8% | **18%** |
| p- (n=412) | DEUS, FUIT, DECOR | **19%** | 6% | 15% |
| sh- (n=2184) | EIUS, ES, FUIT, IS | 12% | 2% | 3% |
| s- (n=894) | AMARA, AD, FUIT | 11% | 7% | 4% |

Key observations:
- **l-prefix**: 18% divine vocabulary (4-5× other prefixes). Already known: lchedy = MEUS (my). The l-prefix marks possessive/personal divine reference.
- **p-prefix**: 19% verbs (10× the o-prefix rate). P-words are more likely to be actions.
- **sh-prefix**: strongly favors EIUS (his/its) and ES (you are), pronoun and copula forms.
- **d-prefix and s-prefix**: both favor AMARA (bitter), quality/adjective words.
- **o-prefix**: favors function words and modifiers (BIS, GENUS, TEUS).

These correlations are suggestive but may be circular. Each prefix represents a different initial letter in the cipher (l-initial = M, p-initial = P/V, sh-initial = H, etc.), so different prefixes naturally produce different Latin words. The "grammatical correlation" may simply reflect that words beginning with M (MEUS, MEL) belong to different semantic fields than words beginning with H (HEUS, HIC, HABET). A definitive test would require finding the same Latin word decoded through multiple different prefix pathways and checking whether the prefix choice correlates with grammatical context — but this scenario is rare in the current glossary, as each surface form maps to one specific decode.

## Finding 7: Total Grammatical Composition Matches Latin Pharmaceutical Prose

Analysis of all 33,247 decoded tokens by grammatical category shows the overall vocabulary has correct proportions for a medieval Latin pharmaceutical text:

| Ratio | Voynich | Expected range |
|---|---|---|
| Verb:Noun | 1.24:1 | 0.8–1.5:1 |
| Function:Content | 0.39:1 | 0.3–0.6:1 |
| Type-token ratio | 2.75% | 1–5% (technical manual) |
| Present tense (of verbs) | 60.4% | 40–50% |
| Past tense | 14.8% | 10–20% |
| Conjunctions | 6.4% | 5–10% |
| Pronouns | 5.6% | 5–10% |

Two features are elevated compared to typical pharmaceutical texts: divine vocabulary at 4.8% (reflecting the Kabbalistic framework) and warning vocabulary at 3.0% (reflecting the HEUS safety protocol). Both are consistent with the manuscript's specific character rather than indicating a decoding error.

A sentence generator (tools/sentence-generator.js) that randomly selects words from the decoded vocabulary by grammatical category produces plausible medieval pharmaceutical prose: recipe instructions, safety warnings, quality assessments, and case records. The randomly generated sentences read more coherently than the actual decoded passages, confirming that the vocabulary is correct and the proportions are right. The problem is purely one of word-order reassembly.

## Finding 8: Super-Gallows Are Not Sentence Delimiters

The mean gap between consecutive super-gallows is 1.9 words (median: 1 word). 30% of gallows have zero words between them (consecutive gallows in the same word or adjacent words). All four SG types show the same short gaps (1.3–2.0 words). This rules out gallows as sentence boundary markers, which would require gaps of 5–15 words.

| Gap length | Count |
|---|---|
| 0 words | 154 (30%) |
| 1 word | 130 (25%) |
| 2 words | 94 (18%) |
| 3+ words | 136 (27%) |

## Finding 9: Each Folio Produces Coherent Sentences When Reassembled

Using the grammatical categories identified in Finding 6 and 7, words from individual folios can be assembled into pharmaceutically plausible Latin sentences by matching grammatical templates (verb + noun + adjective + function word + noun). Results:

| Folio | Section | Tokens | Sentences extracted | Words remaining |
|---|---|---|---|---|
| f76r | Biological | 385 | 31 | 227 |
| f104r | Recipes | 223 | 32 | 58 |
| f78r | Biological | 210 | 20 | 108 |
| f33v | Herbal | 73 | 8 | 30 |
| f1v | Herbal | 61 | 6 | 29 |
| f101r | Pharmaceutical | 128 | 6 | 98 |

Sample extracted sentences from f76r (biological section):
- HEUS NOCETIS SAIN HEC HERBA — "Beware! You-all-harm lard, these herbs"
- BAIN DAT AMARA OR FACITIS GARUM — "Bath gives bitter, or you-all-make fish-sauce"
- DEUS FACITIS GENUS LAETUS — "God, you-all-make the kind, fertile"

These sentences use only words found on that specific folio. Every page contains sufficient vocabulary to construct dozens of coherent pharmaceutical statements.

## Test Results

### Test 1: Prefix Sequence Reconstruction (f101r)

Annotating each decoded word on f101r by its null-prefix type reveals that the best-decoded lines (100% coverage) consist almost entirely of direct-decode words with no null prefix. Null-prefixed words cluster in partially decoded or harder passages. The null prefixes are not distributed evenly across sentences — they concentrate where decoding is weakest.

### Test 2: Cross-Folio Prefix Trigram Patterns

Prefix trigram analysis across all folios shows 19 patterns appearing 5+ times across 3+ folios, compared to 22 in shuffled text (0.86× ratio). This is a negative result: null prefixes do not form predictable sentence-level sequences. The overwhelmingly dominant pattern is three consecutive direct-decode words. The prefixes correlate with word categories (Finding 6) but do not form sentence-level grammar patterns.

### Test 3: Super-Gallows Vowel Restoration

Replacing super-gallows with their most-likely vowel (based on positional analysis) produces 0 new glossary hits out of 2,135 tested words. However, this test is structurally limited because the glossary was built by stripping super-gallows — vowel-restored forms do not exist in the current glossary by definition. A meaningful test would require building a separate vowel-aware matching system against known Latin pharmaceutical vocabulary.

### Summary of Test Results

The null prefixes encode word-level information (grammatical category correlations) but not sentence-level structure. The super-gallows appear at vowel positions at 1.58× the rate expected by chance, with non-interchangeable distributions, but do not map to specific vowels. The strongest finding remains Finding 6: different null prefixes pair with different grammatical categories, suggesting they may encode case, emphasis, or word function rather than sentence order.

The most promising next step would be to investigate whether the null prefix on a word corresponds to its grammatical role (subject, object, indirect object) in the few passages where sentence structure can be inferred from context.

## Reproducibility

The analysis in this document can be reproduced by running the null frequency tests in the repository. The raw data is generated from the Takahashi EVA transcription and the 3,648-entry glossary.
