# Voynich Manuscript: Decoded

Decipherment of the Voynich Manuscript (Beinecke MS 408). 87.8% of 37,886 tokens decoded using a 3,648-entry glossary. The text is bilingual Latin-Occitan, encoding a complete oil-based pharmaceutical production system.

## Quick Start

```bash
node decode.js              # Full manuscript decode with statistics
node decode.js f76r          # Decode a specific folio
```

Requires Node.js 18+. No other dependencies.

## What's Here

- **`decode.js`** — The decoder. Run it and see the decoded manuscript.
- **`tools/glossary-export.js`** — 3,648 EVA→Latin/Occitan/Hebrew mappings.
- **`tools/eva-data/`** — The Takahashi EVA transcription of the manuscript.
- **`tools/`** — Validation scripts (permutation tests, Hebrew matching, Shem Tov cross-reference).
- **`publication/`** — Evidence documents, comprehensive report, and the full book.

## Key Findings

- **87.8%** of 37,886 tokens decoded (2.1% random baseline, 42× ratio)
- **18** correctly conjugated forms of NOCERE (to harm)
- **Zipf's law** exponent -0.919 (natural language range)
- **6/8 Kabbalistic coherence tests** pass at p < 0.0001
- **Hebrew zodiac names** dominate undecoded astronomical sections 37:6:3 over Latin and Arabic
- **5 documented trilingual traditions** from the same time and place use the same Hebrew-Latin-Occitan register

## Validation

```bash
node tools/sefirotic-permutation-test.js   # Divine vocabulary permutation test
node tools/kabbalistic-structure.js        # 8-test sefirotic coherence
node tools/zodiac-multilingual.js          # Multilingual astronomical testing
node tools/hebrew-decode.js                # Hebrew transliteration matching
node tools/shem-tov-match.js               # 739-entry Shem Tov cross-reference
```

## Publication

The complete book is at `publication/voynich-decoded-book.md` or viewable at [voynich-decoded.com/book.html](https://voynich-decoded.com/book.html).

Individual evidence documents are in `publication/`:

| Doc | Content |
|---|---|
| 00 | Comprehensive report |
| 01 | Cipher system |
| 02 | Verb paradigms |
| 03 | Translated passages |
| 04 | Plant identifications |
| 05 | Statistical evidence |
| 06 | Comparative analysis |
| 07 | Reproduction guide |
| 10 | Manuscript analysis |
| 11 | Criticisms and responses |
| 12 | Section findings |
| 13 | Reverse encoding test |
| 14 | Structural analysis |
| 15 | What the manuscript is |
| 16 | Oil-pharmacy comparison |
| 17 | Hebrew hypothesis |

## Website

[voynich-decoded.com](https://voynich-decoded.com)

## Author

Scott Schechter · contact@voynich-decoded.com

Built with [Claude Code](https://claude.ai/claude-code) (Anthropic)
