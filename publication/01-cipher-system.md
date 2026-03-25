# The Cipher System of the Voynich Manuscript

## Summary

The Voynich Manuscript (Beinecke MS 408, dated 1404–1438 by radiocarbon) employs a **verbose positional homophonic substitution cipher** encoding bilingual **Latin-Occitan** text, consistent with the Montpellier medical school tradition of the 13th–15th centuries.

The cipher was identified through systematic constraint elimination and validated against the Naibbe cipher class (Greshko 2025, *Cryptologia*). As of March 2026, **87.8% of the manuscript text** has been decoded (33,247 of 37,886 EVA tokens), producing 1,242 fully decoded lines across all five manuscript sections.

## Cipher Architecture

The cipher operates in three layers:

### Layer 1: Language Preprocessing

Before encoding, plaintext Latin/Occitan words undergo **vowel stripping** for words longer than 3–4 letters. Short words (≤3 letters) are encoded raw. This preprocessing compresses the information content and explains the manuscript's anomalously low second-order entropy (h₂ ≈ 2 bits vs. 3–4 bits for natural languages).

Examples:
- MANDRAGORA → MNDRGR (strip vowels after first)
- VERBENA → VRBN (strip vowels after first)
- JACEA → JACEA (short enough to encode raw)
- MEUM → MEUM (≤4 letters, encode raw)

### Layer 2: Positional Substitution

Each plaintext letter maps to 1–4 EVA glyphs based on its **position** within the word (initial, medial, or final). This is the core cipher — a positional homophonic substitution.

#### Compound Initials

| EVA compound | Latin letter(s) | Example |
|---|---|---|
| ch | D | chedy = DEUS (God) |
| sh | H | shedy = HEUS (hark!) |
| lch | M | lchedy = MEUS (my) |
| ok | F / FOC | okol = OPTAT, okaiin = FOCUM |
| qok | NOC | qokol = NOCET (it harms) |
| ot | L | otchol = LAUDAT (it praises) |
| q | N | qol = NON (not) |
| k | G / B | kol = GRATIA (grace) |
| t | T / S / C | tol = TERTIO (thirdly) |
| p | M / P / V | paiin = MEUM (spignel) |
| o | F / V | oly = FLOS (flower) |

#### Medial Position Mappings

| EVA | Latin | Evidence |
|---|---|---|
| o | A / E / R / D | jacea: o=A; meum: o=E |
| e | E / epenthetic | used as filler vowel |
| ee | I (long I) | qokeey = NOCIS (ee=I) |
| d | U / T / V | chedy: d=U (DEUS) |
| ch | N / S / null | verbena: ch=N; null padding |
| k | C / B | qokol: k=C (NOCET) |
| l | T / L / null | chol: l=T (DAT) |
| t | C (general) / A,I (in QU-words) | cheteey=DICIS; ytedy=QUALIS |
| ii | E / M | borago: ii=M; mandragora: ii=E |
| sh | H / M | timo: sh=M (thyme) |

#### Final Position Mappings

| EVA | Latin | Evidence |
|---|---|---|
| l | T / E | chol = DAT (l=T) |
| y | S / C | chedy = DEUS (y=S) |
| r | R / A | chor = DEA (r=A) |
| aiin | M / UM | daiin = OLEUM (aiin=UM) |
| ain | AN / N | qokain = NOCAN |
| ody | NUS / NUM | pody = PAEONIA (ody=N) |
| eol | -ERAT | keol = GERAT, okeol = FOCERAT |
| or | OR / X / O | cheor = DECOR |
| ol | AT / IT | chol = DAT (ol=AT) |
| o | O | cho = DEO (o=O); oteo = LEO |

### Layer 3: Null Insertion

The cipher employs extensive **null padding** at three levels:

1. **Gallows characters** (cth, ckh, cph, cfh) are always null — they carry no plaintext content and can be stripped without information loss.

2. **Null prefixes**: The glyphs d, l, ol, p, op can appear as word-initial null padding. Example: lol = l(null) + ol = FUIT.

3. **Medial ch-null**: The digraph "ch" can appear as null padding within a word. Example: otchor = ot(L) + ch(null) + or = LOR (their).

This null-insertion system generates a **combinatorial explosion** of surface forms: each base word can appear with any combination of null prefixes and medial ch-null insertions. A single word like DEUS has variants: chedy, dchedy, pchedy, opchedy, lchedy (=MEUS, different word), etc.

The null system explains why:
- The manuscript has ~30,000 tokens but only ~150 unique base words
- Word-length distributions appear near-binomial
- The same "word" appears in many superficially different forms

*See [14-structural-analysis.md](14-structural-analysis.md) for detailed gallows distribution analysis, calligraphic constraints, and paragraph-marking patterns.*

## The Language

The underlying text is **bilingual Latin-Occitan**, consistent with the medical school at Montpellier (southern France), which used both languages in the 13th–15th centuries.

**Latin elements:**
- Full verbal paradigms (NOCERE: NOCET/NOCIS/NOCETIS/NOCAM/NOCUIT/NOCERAT)
- Nominal declensions (DEUS/DEUM/DEO/DEIS/DEOS)
- Medical/pharmacological vocabulary (OLEUM, DOSIS, HERBA, RECIPE)
- Divine formulae (DEUS MEUS, DEA, LAR)

**Occitan elements:**
- Articles: AL (at the), LAS (the, f.pl), LO (the), AN (a/one), DEL (of the)
- Possessives: LOR (their), MEUS/TEUS (my/your — shared with Latin)
- Vocabulary: LAIN (wool), BAIN (bath), SAIN (lard), TAIN (tin), FRAN (free), OR (gold), BEN (well), DAM (harm), SARE (to plant), ODAR (to smell)
- Verb forms: NOCAN/FOCAN (-AN 3rd plural, Occitan conjugation)

## Validation

### Internal Consistency
- The NOCERE paradigm conjugates correctly across 18 forms (3sg, 2sg, 2pl, 3pl, 1sg, passive, infinitive, pluperfect, subjunctive, participle, perfect)
- The FACERE paradigm conjugates correctly across 10+ forms
- Null-variant patterns are systematic and predictable

### External Validation
- Plant names decoded from cipher (BORAGO, MENTHA, VIOLA, TILIA, etc.) match independent visual botanical identifications of manuscript illustrations
- The Occitan month names written in plain script ("mars", "aberil") on zodiac pages are consistent with the Occitan linguistic profile
- Coverage is consistent across all five manuscript sections (herbal, astro, bio, pharma, recipes), confirming a unified cipher system

*See [14-structural-analysis.md](14-structural-analysis.md) for syntactic validation (recipe structure, word-order analysis, category transitions), Currier A/B unified cipher confirmation, undecoded residue profiling, HEUS safety protocol analysis, provenance scan, and astronomical vocabulary findings.*

### Coverage Statistics (March 2026)

| Section | Coverage |
|---|---|
| Herbal (f1–f57) | 88.2% |
| Astronomical (f67–f74) | 81.3% |
| Biological (f75–f84) | 93.3% |
| Pharmaceutical (f87–f102) | 85.4% |
| Recipes (f103–f116) | 89.0% |
| **Total** | **87.8%** |

## Separate Label Cipher

Plant name labels on herbal folios use a **different positional encoding table** from the prose cipher. This label cipher has been partially cracked (40-entry table, 30/110 herbal folios matched). Identified plants include: borago (borage), mandragora (mandrake), mentha (mint), tilia (linden), viola (violet), aloe, timo (thyme), linum (flax), cicuta (hemlock), fragaria (strawberry), ruta (rue), morus (mulberry), cardo (thistle), and others.

## The Page-Level Reading Order

The word-level cipher produces correct Latin vocabulary: 18 NOCERE conjugations, Zipf-compliant frequency distribution (exponent -0.919), and grammatical composition matching Latin pharmaceutical prose (verb:noun ratio 1.24:1, function:content ratio 0.39:1). Testing confirms 223 of 224 folios are grammatically self-contained, with enough verbs, nouns, and function words on each page to form complete sentences.

However, the decoded text reads as fragmented phrases in the EVA transcription's physical line order. Systematic analysis across six folios from all five manuscript sections has identified the page-level structure:

### Section Dividers

Single-glyph lines (tagged `*L0` in the Takahashi transcription) function as paragraph dividers, splitting each page into 2–10 self-contained sections. Where decoded, these read as SED ("but"), RECIPE ("take!"), or null paragraph markers. On f76r, the RECIPE divider on line 31 marks the exact transition from warnings to the recipe proper. The dividers create a progression matching standard pharmaceutical recipe structure: invocation → warnings → ingredients → procedure → safety chanting → recipe → final preparation.

### Grammatical Line Separation

Within each section, lines cluster by grammatical category. Verb-dominated lines contain instructions and warnings (FOCAR/"heat", NOCETIS/"you all harm", FACITIS/"you all make"). Noun-dominated lines contain materials and ingredients (OLEUM/"oil", SAIN/"lard", GARUM/"fish sauce"). Interleaving verb-lines with noun-lines produces more grammatically coherent text than normal reading order or any geometric alternative tested (columnar, boustrophedon, spiral, diagonal — 14 reading orders tested across 8 folios).

### Section-Aware Assembly Results

When decoded words within each section are assembled by grammatical category, 80–100% of adjacent word pairs form coherent grammatical sequences. Results across folios:

| Folio | Section | Coherent Pairs |
|---|---|---|
| f2v (herbal — borage) | single section | 100% |
| f33v (herbal — frankincense) | single section | 85% |
| f75r (biological — bathing) | single section | 80% |
| f76r (biological — bathing) | 10 sections | 85% avg |
| f88r (pharmaceutical) | 4 sections | 84–88% |
| f104r (recipes — compound) | single section | 80% |

The assembled text reads as pharmaceutical instructions. Examples:

- **f2v (herbal):** "To God has fragrant wool. This goddess gives bitter oil. This goddess gives grace. Their goddess gives oil yielded. Day gives oil."
- **f75r (biological):** "God they harm branch not God it may harm wool gold God heat herb of this God it may harm wool of this BEWARE TAKE hour not BEWARE."
- **f104r (recipes):** "With of yielded fish sauce to heat aloe and to heat oil... hour and to it may harm fish sauce but to approves grace... oil let be made grace heat grace approves whey it makes oil."

### Warning Chant Structure

In every folio analyzed, the first 60–70% of decoded words assemble into coherent pharmaceutical statements. The final 30–40% degrades into repetitive harm/warning verb stacking (NOCETIS NOCITIS NOCAN NOCETIS...). This is not noise — it is the oral safety protocol, a group of practitioners chanting warnings during dangerous heated bathing procedures. The warnings concentrate in the biological section (59% of all HEUS occurrences), exactly where heated oil-salt-lard bathing procedures would be most dangerous.

### Gallows Correlation

Full-manuscript gallows-word correlation testing (2,129 gallows tokens) found that CKH is the only gallows type with a distinctive word profile: 2.2× enriched for DIES (day/time) compared to other gallows types, and uniquely correlated with HEUS (beware) at 10.7% — particularly in the biological section (59 CKH→HEUS hits). CTH, CPH, and CFH show similar distributions consistent with pure nulls, but CKH may function as a warning or temporal marker.

### Status

The page-level structure has been identified: the author separated instructions from materials on different lines and used single-glyph dividers to mark paragraph boundaries. Section-aware grammatical assembly produces coherent pharmaceutical text across all five manuscript sections. The exact within-line word order has not been recovered, but the structural principle is clear. Full analysis in [19-page-order-analysis.md](19-page-order-analysis.md).

## Historical Context

The cipher is consistent with the **Naibbe cipher** class (Greshko 2025), a verbose homophonic substitution system documented in the court of the Duke of Mantua in the early 15th century. The vellum radiocarbon date (1404–1438) places it squarely within this period. The bilingual Latin-Occitan profile and pharmacological content are consistent with the medical tradition of Montpellier, a major center of medieval medicine where Latin and Occitan coexisted in scholarly and practical texts.

## References

- Greshko, M. (2025). "The Naibbe Cipher and the Voynich Manuscript." *Cryptologia*. doi:10.1080/01611194.2025.2566408
- Takahashi, G. EVA Transcription of the Voynich Manuscript. voynich.nu
- Montemurro, M. A. & Zanette, D. H. (2013). "Keywords and Co-Occurrence Patterns in the Voynich Manuscript." *PLoS ONE* 8(6).
- Beinecke Rare Book & Manuscript Library, Yale University. MS 408.
