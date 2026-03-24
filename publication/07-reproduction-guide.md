# Voynich Manuscript Decipherment — Independent Reproduction Guide

This document provides step-by-step instructions to independently reconstruct the Voynich Manuscript decipherment from scratch. It is designed to be fed to an LLM or followed by a researcher who wants to verify the work without using any existing code or glossary. All you need is the EVA transcription file.

---

## Prerequisites

1. **The EVA transcription** — Download from voynich.nu (Takahashi transcription) or use the copy at `tools/eva-data/eva_takahashi.txt`. This is the standard machine-readable transcription of the manuscript in the European Voynich Alphabet (EVA) notation.

2. **Basic Latin vocabulary** — knowledge of medieval Latin and basic Occitan is helpful but not required if you follow the steps.

---

## Step 1: Understand EVA Tokenization

EVA text uses digraphs. The following character sequences are single tokens, not two separate letters:

```
ch  sh  ii  ee  ai  oi  or  ol  ar  al  ain  aiin  oiin
cth  ckh  cph  cfh  (gallows characters)
```

When you see `chedy`, tokenize it as: `ch` + `e` + `d` + `y` (4 tokens).
When you see `cthol`, tokenize it as: `cth` + `ol` (2 tokens).

---

## Step 2: Strip Gallows Characters

The four "gallows" characters — `cth`, `ckh`, `cph`, `cfh` — are **always null**. They encode no information. Strip them from every word before analysis.

Example: `cthol` → strip `cth` → `ol`
Example: `kcthy` → strip `cth` → `ky`

This is the single most important preprocessing step. After stripping gallows, many apparently different words become identical.

---

## Step 3: Learn the Positional Cipher Rules

Each EVA token maps to a Latin letter, but the mapping **depends on position** (initial, medial, or final). This is a positional homophonic substitution.

### 3a: Initial Position (first token of a word)

Start with these high-confidence mappings:

| EVA | Latin | How to verify |
|---|---|---|
| ch | D | Decode `chedy` as D+E+U+S = DEUS (God). Appears 70+ times. |
| sh | H | Decode `shedy` as H+E+U+S = HEUS (hark!). Same structure as chedy. |
| ok | F (or FOC-) | Decode `okal` as F+A+C+A+T → FACIT (makes). `okol` = OPTAT (wishes). ok+aiin = FOCUM. |
| qok | NOC- | Decode `qokol` as NOC+A+T = NOCET (harms). Full paradigm follows. |
| ot | L | Decode `otchol` as L+null+A+T = LAUDAT (praises). |
| q | N | Decode `qol` as N+A+T → context confirms NON. |
| qo | NO | Prefix version of q. |
| k | G or B | Decode `kol` as G+A+T → GRATIA (grace). |
| y | QU or ET | Decode `ytedy` as QU+A+L+I+S = QUALIS. Standalone y = ET. |
| o | F or V | Decode `oly` as F+L+S = FLOS (flower). |
| t | T, S, or C | Decode `tol` as T+A+T → TERTIO (thirdly). |
| p | M, P, or V | Decode `paiin` as M+E+U+M = MEUM (spignel plant). |
| s | S | Decode `sy` as S+S → SIC (thus). |
| d | L (or null) | Decode `dal` as L+A+T → DICIT or similar. d- also acts as null prefix. |
| ee | I | Word-initial ee = I. Same as medial. |

### 3b: Medial Position (middle tokens)

| EVA | Latin | Verification |
|---|---|---|
| o | A, E, R, or D | In `chol` (DAT): o=A. In `cheor` (DECOR): o=O. Most common: A. |
| e | E (or epenthetic/null) | Filler vowel. In `chedy`: e=E (DEUS). |
| ee | I | Long I preserved. In `qokeey` (NOCIS): ee=I. |
| d | U, T, V, or N | In `chedy` (DEUS): d=U. In `ytedy` (QUALIS): d=L variant. |
| ch | N, S, or null | In `verbena`: ch=N. Often just null padding. |
| k | C or B | In `qokol`: implied C in NOC-. |
| l | T, L, or null | In `chol` (DAT): l=T via the -AT final. |
| t | C (general) | In `cheteey` (DICIS): t=C. In QU-words: t=A or I. |
| ii | E or M | In `borago`: ii encodes M. |
| sh | H or M | Context dependent. |
| s | S or L | Usually S. |
| r | R | Consistent. |

### 3c: Final Position (last token of a word)

| EVA | Latin | Verification |
|---|---|---|
| y | S or C | In `chedy`: y=S (DEUS). Most common final. |
| l | T or E | In `chol`: l=T (DAT). |
| r | R or A | In `chor`: r=A (DEA). In `cheor`: r=R (DECOR). |
| aiin | UM or M | In `daiin`: aiin=UM (OLEUM). Very reliable. |
| ain | AN or N | In `qokain`: ain=AN (NOCAN). |
| ody | NUS or NUM | Noun ending. |
| iin | H or N | Less common. |
| or | OR, X, or O | In `cheor`: or=OR (DECOR). |
| ol | AT or IT | In `chol`: ol=AT (DAT). In qokol: ol=ET (NOCET). |
| eol | -ERAT | Pluperfect suffix. `keol` = GERAT, `okeol` = FOCERAT. |
| dy | US or IS | In `chdy`: dy=US (DATUS). |
| ey | S or ES | Variant of y-final. |
| eedy | ITIS or IS | In `qokeedy`: eedy=ITIS (NOCITIS). |
| o | O | Word-final O. In `cho` = DEO. |
| s | S or ES | In `cheos`: s=S (DEOS). |
| d | T | Word-final d=T. In `qokeed` = NOCUIT. |

---

## Step 4: Verify with the NOCERE Paradigm

This is the single strongest proof. Decode these words using the rules above:

| EVA word | Decomposition | Latin | English | Grammatical form |
|---|---|---|---|---|
| qokol | qok(NOC)+ol(ET) | NOCET | it harms | 3sg present |
| qokeey | qok(NOC)+ee(I)+y(S) | NOCIS | you harm | 2sg present |
| qokeedy | qok(NOC)+ee(I)+edy(TIS) | NOCITIS | you all harm | 2pl present |
| qokain | qok(NOC)+ain(AN) | NOCAN | they harm | 3pl present (Occitan) |
| qokaiin | qok(NOC)+aiin(UM) | NOCUM | harmful | acc/gerund |
| qokor | qok(NOC)+or(OR) | NOCOR | I am harmed | 1sg passive |
| qokeol | qok(NOC)+eol(ERAT) | NOCERAT | it had harmed | pluperfect |
| qokam | qok(NOC)+am(AM) | NOCAM | I may harm | 1sg subjunctive |
| qokar | qok(NOC)+ar(RE) | NOCARE | to harm | infinitive |
| qokeed | qok(NOC)+ee(I)+d(T) | NOCUIT | it harmed | 3sg perfect |
| qokody | qok(NOC)+ody(ATUS) | NOCATUS | harmed | past participle |

**Every one of these is a valid Latin form of NOCERE (to harm).** This cannot happen by coincidence. If the cipher rules were wrong, you would get gibberish, not a complete verb paradigm.

Now verify the same pattern with FACERE (to make):

| EVA word | Latin | Form |
|---|---|---|
| okal | FACIT | 3sg present |
| okeey | FACIS | 2sg present |
| okeedy | FACITIS | 2pl present |
| okaiin | FOCUM | fire (related noun) |
| okeol | FOCERAT | had heated (pluperfect) |
| okeor | FACERE | infinitive |
| okeo | FACIO | 1sg present |

---

## Step 5: Learn the Null-Variant System

Many "unknown" words are just known words with null prefixes or null medial `ch` inserted.

### 5a: Null Prefixes

The following tokens at word-initial position can be null (encoding nothing):

- `d` — Example: `dchedy` = d(null) + chedy(DEUS) = DEUS
- `l` — Example: `lchedy` = l(null)... wait, l+chedy = MEUS (l=M initial). Be careful: l-initial can be M or null.
- `ol` — Example: `olchol` = ol(null) + chol(DAT) = DAT
- `p` — Example: `pchedy` = p(null) + chedy(DEUS) = DEUS. But p can also = M/P initial.
- `op` — Example: `opchol` = op(null) + chol(DAT) = DAT
- `ch` — Example: `chkchy` = ch(null) + kchy(BONUS) = BONUS. But ch is usually D-initial.

**Rule of thumb**: If stripping a prefix from a word produces a known decoded word, and the prefix is one of {d, l, ol, p, op, ch}, it's likely a null variant.

### 5b: Medial ch-null and Medial f-null

The digraphs `ch` and `f` can appear in the middle of a word as null padding:

- `otchor` = ot(L) + ch(null) + or(OR) = LOR (their)
- `qokchor` = qok(NOC) + ch(null) + or(OR) = NOCOR (I am harmed)
- `qofchedy` = qo(NO) + f(null) + chedy(DEUS) → strips to qochedy = EIUS

**Rule**: If removing a medial `ch` or `f` from an unknown word produces a known word, the `ch`/`f` was null.

### 5c: Final t, g, and p as null

The glyphs `t`, `g`, and `p` at word-final position can be null padding:

- `qot` = qo(NO) + t(null) = NO
- `chot` = cho(DEO) + t(null) = DEO
- `qop` = qo(NO) + p(null) = NO
- `chodalg` = chodal(FUAT) + g(null) = FUAT

**Rule**: If removing a final `t`, `g`, or `p` produces a known word, it was null padding.

### 5d: Bare c = ch (scribal abbreviation)

The bare glyph `c` (not part of ch/ckh/cth/cph) functions as a scribal abbreviation for `ch`:

- `cty` = chty = SIC
- `cky` = chky = DECUS
- `ctchy` = chtchy = SENECIO

### 5e: Additional prefix nulls

Beyond the original set {d, l, ol, p, op, ch}, these also function as null prefixes:

- `sh` — Example: `shky` = sh(null) + ky(AC) = AC
- `s` — Example: `salal` = s(null) + alal(ALOE) = ALOE
- `k` — Example: `kshedy` = k(null) + shedy(HEUS) = HEUS

### 5f: Gallows as null (already covered in Step 2)

---

## Step 6: Build a Glossary Iteratively

Start with the highest-frequency words and work outward:

**Round 1 — Core vocabulary (decode manually):**
```
chedy = DEUS (God)           shedy = HEUS (hark!)
chol = DAT (gives)           shol = HABET (has)
cheol = DEDIT (gave)         sheol = HERBA (herb)
chor = DEA (goddess)         shor = HORAM (hour)
chey = DES (from, Occ)       shey = HEC (this)
cheos = DEOS (the gods)      shy = HIC (here)
daiin = OLEUM (oil)          okaiin = FOCUM (fire)
qokol = NOCET (harms)        okal = FACIT (makes)
oly = FLOS (flower)          kol = GRATIA (grace)
```

**Round 2 — Null-variant sweep:**
For each word in Round 1, generate all null-prefix variants: d+word, l+word, ol+word, p+word, op+word, ch+word. Also generate ch-medial variants. Add these to the glossary.

**Round 3 — Extended paradigms:**
For each verb root (NOC-, FAC-, LAUD-, DAR-, DIC-), generate all final-position variants: -ol(AT), -eey(IS), -eedy(ITIS), -ain(AN), -aiin(UM), -eol(ERAT), -or(OR/RE), -am(AM), -ody(NUS), etc.

**Round 4 — Context-driven discovery:**
Look at partially-decoded lines. If a line reads "DICIT ___ OLEUM", the unknown word likely means something that fits between "says" and "oil." Use the cipher rules to decompose the unknown and match it to Latin vocabulary.

**Round 5 — Aggressive decomposition:**
For any remaining unknown, try all combinations of known-initial + known-medial + known-final. If the resulting consonant skeleton matches a Latin or Occitan word, add it.

---

## Step 7: Measure Coverage

Count how many EVA tokens in the transcription your glossary decodes. Use only "prose" lines (line types starting with `+P` or `@P` in the IVTFF transcription format).

**Expected milestones:**
- After Round 1 (~50 entries): ~15-20%
- After Round 2 (~200 entries): ~40-50%
- After Round 3 (~400 entries): ~60-65%
- After Rounds 4-5 (~1000+ entries): ~80-85%
- After systematic null-variant sweep (~3,600 entries): ~87-88%

If your coverage matches these milestones, you have independently reproduced the decipherment. The current glossary (3,648 entries) achieves 87.8% (33,247 of 37,886 tokens).

---

## Step 8: Validate

Your decode is correct if:

1. **Verb paradigms conjugate correctly** — NOCERE should produce 10+ valid Latin forms. FACERE, DARE, LAUDARE should also conjugate. If your rules produce gibberish paradigms, something is wrong.

2. **The same cipher rules work across all 5 sections** — herbal, astro, bio, pharma, recipes. If a rule only works in one section, it's likely wrong.

3. **Coverage is roughly uniform** — no section should be below 60% or above 95%. Large discrepancies suggest section-specific errors. Expected range: Zodiac ~80%, Herbal ~88%, Biological ~93%.

4. **Decoded vocabulary is plausible** — the text should contain medical/pharmaceutical Latin (OLEUM, HERBA, RECIPE, CORTICE, FUMUM, VINUM, SAL) and Occitan articles/prepositions (AL, DES, LOR, AN, OR). Systematic absence testing across 117 terms should find zero surgical vocabulary, zero Christian vocabulary, zero dosage units, and zero medical authorities.

5. **Frequency distribution follows Zipf's law** — plot log(rank) vs log(frequency) for your decoded vocabulary. The slope should be between -0.8 and -1.2 (natural language range). Random or mechanical output produces a slope near 0. Expected value: approximately -0.92.

6. **Formulaic repetition exceeds shuffled baseline** — count 3-word phrases that repeat 3+ times across multiple folios. The real text should produce approximately 5-6× more repeated phrases than word-shuffled text using the same vocabulary.

---

## Step 9: Run Control Tests

These additional tests confirm the cipher is reading real structure, not noise:

**9a: Random token substitution.** Replace each EVA token in every real word with a random token from the same glyph set (preserving word length). Run your glossary against the randomized text. Expected result: ~2% coverage (vs ~88% for real text). The 42× ratio confirms the cipher is reading real structure. If your random coverage is significantly higher, your rules may be too permissive.

**9b: Shuffled glossary paradigm test.** Randomly reassign Latin values to EVA keys in your glossary (keep all keys, shuffle all values). Check whether the NOCERE paradigm words (qokol, qokeey, qokeol, etc.) still produce NOC- forms. Expected result: 0 of 11 match.

**9c: Reverse encoding test.** Take known medieval pharmaceutical Latin, encode each word through your cipher rules in reverse (Latin → EVA), add null padding at observed rates, and compare the output to the real manuscript. Expected result: word length within 0.3 chars, token frequencies within 1-2 percentage points, same visual character. See [13-reverse-encoding-test.md](13-reverse-encoding-test.md).

**9d: Hold-out validation.** Split the manuscript by odd and even folios. Build a glossary from only one half, test on the other. Expected result: 79-81% coverage on the held-out half (vs ~88% with full glossary). The 7-10% drop should be attributable to folio-specific null-variant surface forms, not cipher failure. Vocabulary overlap between halves should be ~87%.

**9e: Sefirotic permutation test.** If you have identified divine vocabulary (DEA, DEUS, HEUS, LAR), randomly shuffle their positions 10,000 times while keeping all other words fixed. Test whether the real distribution of divine terms across sections is more extreme than the random distribution. Expected result: DEA enrichment in herbal section and HEUS enrichment in biological section should each exceed 99.99% of random permutations (p < 0.0001). See tools/sefirotic-permutation-test.js.

**9f: Multilingual zodiac label test.** Test undecoded words from the zodiac sections (f67-f73) against astronomical vocabulary in Hebrew, Arabic, Latin, and Occitan. Expected result: Hebrew should dominate with approximately 6× more matches than Arabic and Latin. A random consonant-string control of matched length should match at 4-6× lower rates than Hebrew. See tools/zodiac-multilingual.js.

---

## Step 10: Verify Hebrew Vocabulary in the Undecoded Residue

The undecoded 12.2% contains Hebrew terms written as direct EVA transliterations, bypassing the cipher. To verify:

1. **Collect undecoded words from the zodiac/astronomical sections** (f58-f73). These sections have the highest undecoded rates (19-20%).

2. **Convert each undecoded word to phonetic values** using EVA sound values: sh=SH, ch=KH, ee/ii=I, and single letters at face value.

3. **Strip vowels to get a consonantal skeleton** and compare against Hebrew zodiac names (TALEH/TLH=Aries, SHOR/SHR=Taurus, TEOMIM/TMYM=Gemini, GEDI/GDY=Capricorn, DELI/DLY=Aquarius, etc.), month names (NISAN, IYAR, ADAR, TISHREI), and planet names (CHAMAH, LEVANAH, KOKHAV, TZEDEK, SHABTAI).

4. **Check whether matches appear on the correct zodiac pages.** Hebrew zodiac names should concentrate on their assigned pages at rates above chance (expected: ~14% by random, observed: ~41%).

5. **Test Hebrew against Arabic, Latin, and Occitan** using the same method. Hebrew should dominate the zodiac sections approximately 6:1 over Latin and 12:1 over Arabic.

6. **Cross-reference against the Shem Tov synonym database** (tools/shem-tov/shimmush-entries.json, 739 entries from Bos/Hussein/Mensching/Savelsberg, Brill 2011). Hebrew pharmaceutical terms from Shem Tov should produce exact consonantal matches in the undecoded residue at rates significantly above random.

See tools/hebrew-decode.js and tools/zodiac-multilingual.js for automated implementations.

---

## Common Pitfalls

1. **Don't assume simple substitution.** Each EVA glyph means different things in different positions. `ch` = D at the start, N/S/null in the middle.

2. **Don't ignore the null system.** Without understanding gallows-as-nulls and null prefixes, ~30% of the manuscript appears to be unique words when they're actually variants of known words.

3. **EVA `y` is not a single letter.** At word-initial it = QU or ET. At word-final it = S. These are completely different functions.

4. **The label cipher is different.** Plant name labels on herbal folios use a separate encoding table. Don't expect the prose cipher rules to decode labels. Focus on prose text first.

5. **Occitan is not Italian.** The bilingual element is Occitan (langue d'oc), not Italian. Articles like AL, LAS, LOR, AN and vocabulary like BAIN, SAIN, TAIN, FRAN are Occitan, not Latin or Italian.

6. **Line order is not sentence order.** The EVA transcription records lines as they appear physically on the page. Many folios have text that wraps around illustrations, so a physical line may continue on a non-adjacent line. For example, lines 15-20 on a folio may be continuations of lines 1-6 from the other side of an illustration. Decoded passages will appear fragmented until a folio-by-folio visual analysis reconstructs the scribe's intended reading order. This does not affect word-level analysis (vocabulary, coverage, statistics) but it does affect sentence-level readability.

---

## Quick Self-Test

Decode these 5 words using the rules above. If you get the right answers, you have the system:

1. `shol` → ?
2. `qokeey` → ?
3. `daiin` → ?
4. `oly` → ?
5. `cheor` → ?

Answers: 1) HABET (has), 2) NOCIS (you harm), 3) OLEUM (oil), 4) FLOS (flower), 5) DECOR (beauty)

---

## Data Sources and Code

All code, data, and analysis scripts are available at [github.com/scott-schechter/voynich-decoded](https://github.com/scott-schechter/voynich-decoded).

To get started:

```
git clone https://github.com/scott-schechter/voynich-decoded.git
cd voynich-decoded
node decode.js              # Full manuscript decode
node decode.js f76r          # Single folio decode
```

### Key Files

- `decode.js` — The decoder (run this first)
- `tools/glossary-export.js` — 3,648 EVA→Latin mappings
- `tools/eva-data/eva_takahashi.txt` — Takahashi EVA transcription
- `tools/shem-tov/shimmush-entries.json` — 739-entry Shem Tov synonym database (Bos et al., Brill 2011 and 2017)

### Validation Scripts

- `tools/sefirotic-permutation-test.js` — 10,000-iteration divine vocabulary permutation test
- `tools/kabbalistic-structure.js` — 8-test sefirotic coherence analysis
- `tools/zodiac-multilingual.js` — multilingual astronomical vocabulary testing
- `tools/hebrew-decode.js` — 841-term Hebrew transliteration matching
- `tools/shem-tov-match.js` — 739-entry Shem Tov cross-reference
- `tools/coverage-push.js` — systematic null-variant and paleographic correction sweep
- `tools/zodiac-deep-dive.js` — word-by-word zodiac page analysis
- `tools/o-prefix-analysis.js` — o-prefix hypothesis test (negative result)

### External References

- Manuscript images: [Yale Digital Library (Beinecke MS 408)](https://collections.library.yale.edu/catalog/2002046) or [archive.org/details/voynich](https://archive.org/details/voynich)
- EVA transcription: [voynich.nu](https://voynich.nu/transcr.html) (Takahashi)
- Greshko (2025) Naibbe cipher paper: *Cryptologia* doi:10.1080/01611194.2025.2566408
