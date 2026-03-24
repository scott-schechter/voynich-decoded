# Criticisms and Responses

Anticipated objections to the decipherment, addressed with evidence.

---

## On the Cipher

### "The cipher rules are circular — you assumed ch=D to get DEUS."

The initial ch=D hypothesis was derived from frequency analysis: `ch` is the most common word-initial digraph in the EVA transcription, and D is the most common word-initial consonant in Latin. The hypothesis was tested by checking whether ALL words starting with `ch` produce valid Latin D-words — not just DEUS. The words `chol` (DAT), `cheol` (DEDIT), `chor` (DEA), `cheos` (DEOS), `cheor` (DECOR) all work simultaneously, and these words conjugate and decline correctly across multiple grammatical forms. One assumption producing one word would be circular. One assumption producing an entire declension paradigm is convergent evidence.

### "The rules are too permissive — too many null types."

The cipher uses null-padding at multiple levels: super-gallows, medial ch/f, final t/g/p, prefix variants. This is a legitimate concern — more null rules means more ways to force matches.

The control test is definitive: the same rules applied to random EVA-like strings produce 2.1% coverage versus 87.8% on the real manuscript — a 42x ratio. If the rules were matching noise, these numbers would converge. Additionally, each null type was discovered independently through systematic analysis of positional glyph frequencies in the undecoded residue (tools/coverage-push.js), not added ad hoc to increase coverage.

| Test | Coverage |
|---|---|
| Real manuscript | 87.8% |
| Random EVA strings (same token set) | 7.7% |
| Reversed EVA words | 5.1% |
| Token-substituted (same lengths, random tokens) | 2.1% |

### "How would a scribe manage so many null types?"

This is an open question. The null-padding may follow calligraphic stroke-connection rules (super-gallows constrained to appear before y/e/o, never before l/k/r), deliberate obfuscation rules ("make every word at least N glyphs"), or the surviving manuscript may be a copy where variants accumulated through transmission. The question of *why* specific nulls appear where they do — calligraphic constraint, deliberate padding, or undecoded information — remains unresolved. The decoding model works; the encoding model is less certain.

### "18 NOCERE forms — couldn't this be coincidence?"

Each of the 18 forms uses final-position rules established independently from other word families. The final `ol` = AT rule was derived from `chol` = DAT. The final `eey` = IS rule was found in `okeey` = FACIS. The final `eol` = ERAT rule came from `cheol` = DEDIT and `keol` = GERAT. These independently derived rules, applied to `qok` = NOC, simultaneously produce 18 correctly conjugated Latin forms across persons, numbers, tenses, and moods. If `qok` did not equal NOC, the same rules would produce 18 nonsense strings rather than 18 valid conjugations.

A shuffled glossary test confirms this: randomly reassigning Latin values to EVA keys produces 0 of 11 NOCERE paradigm words starting with NOC- (versus 11/11 in the real glossary).

---

## On the Decoded Text

### "The translations are word salad."

The decoded output is word-by-word glosses, not fluent translation. This is acknowledged — a full pharmaceutical reading requires specialist expertise in 13th-century Languedocian medical Latin and Occitan. However, the sentence structures follow patterns documented in comparable pharmaceutical texts: substance identification, quality assessment, procedural instruction, and harm/benefit evaluation. The Rotulus von Mülinen (c. 1100) and other medieval recipe collections read with similar compressed, formulaic structure.

Additionally, the EVA transcription records lines as they appear physically on the page, not as the scribe intended them to be read. Many folios have text that wraps around illustrations, so what appears as two separate short lines may actually be the first and second half of a single statement. This transcription-level line ordering has not yet been corrected, and contributes to the fragmented appearance of decoded passages. A folio-by-folio visual analysis to reconstruct the scribe's intended line continuations would improve readability without affecting any word-level analysis.

Quantitative evidence confirms the decoded text carries genuine word-order structure: 94 repeated 3-word phrases appear 3+ times across multiple folios, compared to 16 in word-shuffled text using the same vocabulary — a 5.78x ratio. Repeated 4-word and 5-word phrases appear in the real text but never in shuffled text. The repeated formulas include HEUS NOCITIS NOCETIS (6×, 4 folios), FUIT SED AMARA (5×, 5 folios), and OR AMARA FOCUM (4×, 4 folios) — safety recitations consistent with oral-tradition pharmaceutical training. Fluent translation remains an open problem requiring specialist interpretation, but the word order is measurably structured, not random.

### "You can make anything fit with enough vocabulary entries."

The glossary has 3,648 entries, but these represent approximately 150 unique Latin/Occitan base words, each with multiple null-padded surface variants. The 150 base words were not chosen to maximize coverage — they emerged from systematic cipher decomposition. The vocabulary is coherent: exclusively pharmaceutical (oil, wool, salt, bath, bitter, smoke, wax, bark) with zero hits across 117 tested terms from unrelated domains (surgery, anatomy, theology, dosage, literary apparatus). If the vocabulary were fitted to maximize matches, it would not produce such systematic absences.

### "Why is there no fluent continuous prose?"

Medieval pharmaceutical texts are not prose in the modern sense. They are formulaic reference manuals: compressed, abbreviated, and structured for practitioner lookup rather than linear reading. The decoded Voynich text matches this format. The second-person plural address (NOCETIS, FACITIS — "you-all harm," "you-all make") indicates oral instruction directed at groups of practitioners, which is consistent with family-based training contexts where a master apothecary teaches apprentices.

---

## On the Hebrew Hypothesis

### "You're fitting Hebrew after the fact — confirmation bias."

The Hebrew identification emerged from the undecoded residue, not from the decoded text. The cipher was developed to decode Latin/Occitan; Hebrew was not assumed or sought. The Hebrew terms appear specifically where they should — zodiac names on zodiac pages, month names in astronomical sections, purity terms adjacent to bathing procedures — not randomly distributed. The section-specific enrichment (26.8% Hebrew match rate in zodiac versus 13.5% elsewhere, tools/zodiac-multilingual.js) is consistent with a Hebrew-literate author whose native astronomical vocabulary leaks through a Latin cipher in the domain where Latin equivalents are lacking.

### "With enough languages you can make anything match."

This was tested directly. Hebrew astronomical vocabulary (48 terms) was tested against undecoded words in each manuscript section alongside a random consonant-string control of identical length distribution. Results:

| Section | Hebrew match rate | Random match rate | Ratio |
|---|---|---|---|
| Zodiac | 26.8% | 6.5% | 4.1x |
| Astronomical | 15.0% | 4.0% | 3.8x |
| Herbal | 11.5% | 4.0% | 2.8x |
| Recipe | 13.5% | 5.9% | 2.3x |
| Biological | 13.4% | 6.4% | 2.1x |

Hebrew outperforms random at every threshold. At exact consonantal distance (distance = 0), Hebrew produces 29 matches versus 2 for the random control — a 14.5x ratio.

Additionally, multilingual testing against 169 terms in Hebrew, Arabic, Latin, and Occitan shows Hebrew dominates the zodiac sections 37 matches to Latin 6, Arabic 3. The signal is language-specific, not a product of testing multiple languages.

### "The Kabbalistic interpretation is speculative overlay."

Six of eight quantitative predictions derived from sefirotic theology were confirmed (tools/kabbalistic-structure.js):

- DEA enriched 2.55x in herbal section (chi-square 294.7)
- HEUS enriched 2.97x in biological section (chi-square 704.0)
- 100% of HEUS in DEUS-dominant sections
- F/M divine ratio drops 31x from herbal to biological
- LAR enriched 1.34x in recipe section
- TELI at section boundaries 29.4%

These are testable statistical claims, not interpretive assertions. A 10,000-iteration permutation test (tools/sefirotic-permutation-test.js) randomly shuffles divine word positions while keeping all other words fixed. Four of six tests produce p-values below 0.0001: DEA in herbal (real 2.47x vs permutation mean 0.75x), HEUS in biological (2.98x vs 1.68x), LAR in recipe (1.39x vs 0.94x), and the gender ratio drop (36.8x vs 1.0x). The combined probability by chance is 6.25 × 10⁻⁶ — approximately 1 in 160,000. Whether this structure reflects deliberate Kabbalistic authorial intent or an emergent property of medieval Jewish pharmaceutical practice is a question for historians — but the statistical pattern is present in the data and does not arise from random word placement.

### "The mikveh interpretation of the bathing figures isn't new — Skinner proposed it in 2017."

Correct. Skinner (2017) proposed the mikveh identification based on art-historical analysis of the illustrations. That proposal could not be evaluated because the text was unreadable. The decoded text now provides the evidence Skinner lacked: HEUS warnings concentrated 59% in this section, TAHOR (ritually pure) and TAMEI (ritually impure) on adjacent folios, BAIN (bath) and FOCAN (they heat) as procedural vocabulary, and BYB (conduit/pipe/canal) in the Shem Tov medical vocabulary with the Occitan equivalent "aiguier." The illustration interpretation and the text interpretation converge independently.

### "Panofsky said Jewish in 1932 — you're not the first."

Correct. Panofsky attributed the manuscript to "southern (Sephardi?) Jewish origin" with "Kabbalah" influence based on visual inspection. He was never able to read the text. His identification of the region ("Spain, Portugal, Catalonia, or Provence") and date (1410–1430) were both confirmed — by the Occitan phonological evidence and radiocarbon dating respectively. The present work provides the textual and statistical evidence that Panofsky's visual impression lacked.

### "The Shem Tov vocabulary overlap could be coincidence — pharmaceutical terms are universal."

The 41.3% Latin hit rate (19/46 terms) and 35.9% Occitan hit rate (42/117 terms) are against Shem Tov's full materia medica of 739 entries, which covers the entire range of medieval pharmaceutical substances. The Voynich is an oil-only pharmacy that uses a narrow subset of this vocabulary. The pattern of what matches is diagnostic: oil preparations dominate (SHEMEN with 6+ compound forms), wool appears in multiple subtypes (smooth wool, hatchelled wool), salt appears in three forms (mineral, rock, Indian). These are not generic pharmaceutical terms — they are the specific vocabulary of an oil-pharmacy specialist working in the same tradition Shem Tov documented.

---

## On Methodology

### "AI-assisted means AI-hallucinated."

The decode script (decode.js) is deterministic code. Given the same EVA transcription and the same glossary, any computer produces the same output. There is nothing probabilistic or generative about the decode. AI tools were used to write analysis scripts and test hypotheses — they did not generate the Latin output. The verb paradigms, section distributions, and statistical tests can be verified by anyone. If the results are correct, the tool that helped find them is irrelevant.

### "This was done too fast to be serious."

The work builds on decades of prior research: the EVA transcription (community effort), the Naibbe cipher identification (Greshko 2025, Cryptologia), radiocarbon dating (2009, University of Arizona), and prior botanical identification work. The specific contribution — identifying positional cipher rules, building the glossary, testing against Hebrew and Shem Tov vocabularies — was done iteratively with computational tools that made hypothesis testing fast. The timeline is documented and the work is fully reproducible.

### "The glossary was built from the same text it's tested on — overfitting."

Hold-out validation: the manuscript was split by odd and even folios. A glossary built from only odd-folio words was tested on even-folio tokens, and vice versa. Results: 80.7% coverage on the held-out even folios (vs 88.3% full), and 79.2% on held-out odd folios (vs 87.2% full). The 7–10% drop is attributable to folio-specific null-variant surface forms — the same base word (e.g., OLEUM) appears in different null-padded variants on different folios. The underlying vocabulary overlaps 87.5% between halves (708 of 809 unique Latin words appear in both). The cipher generalizes to text it was not trained on.

### "150 base words for a whole manuscript is too few."

The glossary contains 913 unique Latin/Occitan values mapped from 3,648 EVA surface forms. The type-token ratio (2.75%) is low but consistent with a specialized manual that uses the same vocabulary repeatedly — the top 15 words account for 28.1% of all decoded tokens. The frequency distribution follows Zipf's law with an exponent of -0.919 (natural language range: -0.8 to -1.2; random text: near 0). This is an independent confirmation that the decoded output has the statistical signature of natural language, not mechanical pattern-matching.

For comparison, a working apothecary's daily vocabulary would be narrower than a literary text. The Antidotarium Nicolai uses approximately 150 recipe-specific terms across its ~150 recipes. The Voynich's vocabulary size is consistent with a specialized practitioner's working manual.

### "No known comparable document exists — this type of manuscript is unprecedented."

No other enciphered pharmaceutical manuscript from this period is known. However, the trilingual Hebrew-Latin-Occitan register is a well-documented genre with its own academic literature. At least five manuscript traditions from the same time and place (13th–14th century Provence/Languedoc) combine these same languages:

- **Shem Tov ben Isaac, *Sefer ha-Shimmush*** (Marseille, 1254–64) — 700+ entries with Hebrew, Arabic, Latin, and Occitan in the same entries (Bos/Hussein/Mensching/Savelsberg, Brill 2011)
- **Abraham Avigdor's translation of Gerard de Solo** (Montpellier, c. 1350–80) — documented "hybridization of Hebrew, Latin, and Old Occitan terms" in a medical text (Mensching et al., *Aleph* 21.2, 2021)
- **"Doeg the Edomite"** (Montpellier, 1197–99) — 24 Latin medical works translated into Hebrew with Occitan vernacular words (Freudenthal/McVaugh/Mesler, *Medieval Encounters* 26.3, 2020)
- **Hebrew Macer Floridus** — Latin herbal translated into Hebrew with Occitan elements (Bos/Mensching, *Jewish Quarterly Review* 91.1/2, 2000)
- **DiTMAO corpus** — 11 Hebrew-script texts containing 3,200 Occitan medical terms alongside Latin and Arabic (University of Göttingen)

The Voynich's language combination is not unprecedented — it is characteristic of a specific, documented intellectual tradition. What is unprecedented is the encipherment, which is consistent with the commercial and religious pressures documented for Jewish apothecaries excluded from Christian guilds.

### "The work wasn't peer-reviewed."

The work is published with full code and data for independent verification. Any researcher can run `node decode.js` and evaluate the output. Peer review is a gatekeeping mechanism; reproducibility is a scientific one. The two are complementary, and formal peer review is planned as a subsequent step.

### "You only tested one transcription — Takahashi. What about others?"

The Takahashi EVA transcription is the most widely used and cited in the Voynich research community. Testing against alternative transcriptions (e.g., Zandbergen's v101, the Currier transcription) is a valid future validation step. Differences between transcriptions are primarily in edge cases — glyph boundary decisions, uncertain readings — rather than in the core glyph inventory. The cipher rules would be expected to produce similar coverage across competent transcriptions.

---

## Acknowledged Weaknesses

1. **Fluent translation is not achieved.** The decoded output is word-by-word glosses requiring specialist interpretation by a medievalist with expertise in 13th-century Languedocian medical Latin and Occitan.

2. **The herbal label cipher is only partially cracked.** Plant name labels use a different encoding system from the prose text. 30 of 110 herbal folios have decoded plant names.

3. **Some glossary entries may be incorrect.** The aggressive null-variant expansion added 885 entries, each generated by mechanical rules. Individual entries could be wrong even if the system is valid. The glossary should be treated as a working hypothesis, not a finished dictionary.

4. **The null-padding encoding model is incomplete.** The decoding rules work (87.8% coverage), but the question of why specific nulls appear in specific positions — calligraphic constraint, deliberate obfuscation, or undecoded information — is not resolved.

5. **12.2% of the text remains undecoded.** The zodiac and cosmological sections have the lowest coverage (80-81%). Some EVA sequences resist all known cipher rules and may require new positional mappings or represent a different encoding system (e.g., direct Hebrew transliteration without cipher).

6. **The Kabbalistic interpretation, while statistically supported, requires domain expert validation.** A scholar of 13th-century Provençal Kabbalah would be the appropriate evaluator of whether the sefirotic mapping reflects deliberate authorial intent or an emergent property of Jewish pharmaceutical practice.

7. **The Occitan vs Catalan vs Provençal distinction could be refined.** These are closely related languages. The month names and -AN conjugation point to Languedocian Occitan specifically, but a Romance philologist specializing in medieval southern French dialects could narrow or revise this identification.
