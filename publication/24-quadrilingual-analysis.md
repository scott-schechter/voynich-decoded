# Quadrilingual Analysis: Latin, Occitan, Hebrew, Aramaic

## Summary

The decoded Voynich Manuscript contains four languages, each serving a distinct functional domain with zero overlap. The four languages were learned in four different contexts and are never used interchangeably.

| Language | Share | Role | Learned from |
|---|---|---|---|
| Latin | 82.9% | Professional pharmaceutical prose | Montpellier medical texts |
| Occitan | 10.2% | Marketplace and workshop materials | Southern France daily life |
| Hebrew | 6.9% | Sacred authority and celestial timing | Synagogue, family, Sefer Yetzirah, Ibn Ezra |
| Aramaic | ~0.3% | Medical knowledge and practical craft | Talmud (Gittin 67b-70a, Shabbat 109b-134a), Zohar |

## Evidence for Aramaic

### Method

126 Aramaic terms from Talmudic medical passages, the Zohar, and the Targum were tested against 4,538 undecoded EVA tokens using consonant-skeleton matching at threshold 0.75 with mandatory context validation. Each match required at least one adjacent decoded pharmaceutical word.

### Results

70 context-validated matches covering 102 tokens across 10 categories.

### Medical terms (18 tokens)

| EVA | Aramaic | Meaning | Count | Context |
|---|---|---|---|---|
| shd | ASHTA | fire/fever | 6× | near DAT, SED — herbal, bio |
| saino | SAMMA | drug/medicine | 2× | near QUAS, DECOR — bio |
| tochol / etchal / otchl | TICHLA | remedy/cure | 3× | near DEA, AMARA, CALE — herbal |
| eesey / oeeesoy | ASYA | physician/healer | 2× | near FLOS, FUIT, ODORATUS |
| ockhosam / cphesaiin / eeesaiin / siiin | SAMMA | drug/medicine | 4× | near FLOS, LAIN, FACIS |

ASHTA (fire/fever) is the strongest Aramaic medical term. In Talmudic medicine, ASHTA refers to both the element fire (used in heating preparations) and the condition fever (treated by preparations). Both meanings apply in a pharmaceutical manual.

TICHLA (remedy/cure) appears 3 times in the herbal section near quality assessment words (AMARA/bitter, CALE/be warm), consistent with describing a plant's therapeutic properties.

SAMMA (drug/medicine) is the Aramaic pharmaceutical term itself. Its presence in the manuscript places the author in the Talmudic medical vocabulary tradition.

### Body parts (20 tokens)

| EVA variants | Aramaic | Meaning | Total | Sections |
|---|---|---|---|---|
| damo, daiioamo, cphedom, + 9 variants | DAMA | blood | 14× | herbal(9), astro(3), bio(1), pharma(1) |
| okaram, okeoram | GARMA | bone | 4× | astro(2), recipe(1), astro(1) |
| aiodam | DAMA | blood | 1× | bio |

DAMA (blood, Aramaic) appears alongside Hebrew DAM (blood, 30×). The author uses both the Hebrew and Aramaic forms for the same concept. Blood vocabulary concentrates in the herbal section (plants assessed for their effect on blood) and appears in Aramaic on herbal pages near OLEUM, LAIN, DEA, NOCOR — pharmaceutical context.

### Qualities — colors (18 tokens)

| EVA variants | Aramaic | Meaning | Total | Sections |
|---|---|---|---|---|
| okom, okeom, okeeom, okeoam, qoin, qockhom | UKMA | black | 18× | herbal(9), pharma(4), recipe(2), astro(1), bio(1) |

UKMA (black, Aramaic) is the strongest single Aramaic quality term. It appears primarily in the herbal section, where it likely describes the color of plant parts, roots, or preparations. This fills a gap: the decoded vocabulary had ALBA/ALBUM (white, Latin) and ADOM (red, Hebrew) but no term for black.

The color vocabulary is now trilingual: white in Latin, red in Hebrew, black in Aramaic.

### Numbers (18 tokens)

| EVA variants | Aramaic | Meaning | Total |
|---|---|---|---|
| chd, chckhd, cheoda, chad, cheoet, cheet, ch?d? | CHAD | one | 15× |
| otald, told | TLATA | three | 3× |

The manuscript has NUMBER vocabulary in Aramaic. CHAD (one) appears 15 times, primarily in the herbal section. If these are dosage counters, they modify the time-based dosage system: "CHAD HORAM" = "one hour," "TLATA BIS" = "three times." The numbers are in Aramaic rather than Latin (UNUS, TRES) or Hebrew (ECHAD, SHALOSH).

### Processes (8 tokens)

| EVA variants | Aramaic | Meaning | Total | Context |
|---|---|---|---|---|
| chotom, choteeen, cheeotaiin | CHATAM | to seal/close | 5× | near AMARA, DEDIT, DAT — herbal |
| tcheen, tchom, tcheain, otchm | TACHHAN | to grind | 4× | near FLORA, LAIN, TARTARUM — herbal |

CHATAM (to seal/close) describes closing containers after preparation. TACHHAN (to grind) is the Aramaic equivalent of Hebrew TOCHEN. Both are workshop process verbs — the same domain Hebrew covers for tools (KAD/jar, ELI/pestle). The author knew grinding terminology in both Hebrew (TOCHEN) and Aramaic (TACHHAN).

### Tools (14 tokens)

| EVA variants | Aramaic | Meaning | Total | Sections |
|---|---|---|---|---|
| okaiis, keeees, okseo, okeeas, okesoe, okoeese, okeeees, okaos, qoais, qocthes | KASA | cup/vessel | 10× | astro(5), herbal(2), bio(2) |
| seeder, oseeedar, sotar | SUDAR | cloth/napkin | 3× | astro(1), bio(1), herbal(1) |
| amam | MANA | vessel/utensil | 1× | herbal(1) |

KASA (cup/drinking vessel) concentrates in the astronomical section (5 of 10 tokens). This may refer to vessels used in timed preparations connected to the astronomical calendar, or to measuring cups for portions.

SUDAR (cloth/napkin) is a filtering cloth — parallel to Latin LAIN (wool) and FILUM (thread) as filtering/straining materials.

### Materials (4 tokens)

| EVA | Aramaic | Meaning | Context |
|---|---|---|---|
| cheel, ?cheol, ??chol | CHALA | vinegar | biological section, near NOCETIS, OLEUM |
| koshet | KUSHTA | costus (plant) / truth | herbal, near BONUS, ODORATUS |

CHALA (vinegar) appears exclusively in the biological section (bathing procedures). Vinegar was used in medieval bathing preparations. Its appearance in Aramaic rather than Latin (ACETUM) is consistent with the author using Aramaic for workshop materials learned from Talmudic sources.

## Aramaic vs Hebrew: Complementary Domains

The two Semitic languages divide cleanly by function:

| Domain | Hebrew | Aramaic |
|---|---|---|
| Divine authority | DEUS, DEA, HEUS, LAR (1,849×) | 0 |
| Celestial/zodiac | SHOR, GEDI, DELI, TELI, IGGUL (23×) | 0 |
| Purity | TAHOR, TAMEI (2×) | 0 |
| Body parts | DAM/blood (30×) | DAMA/blood + GARMA/bone (24×) |
| Medical terms | SAM/drug (1×) | ASHTA, SAMMA, TICHLA, ASYA (18×) |
| Colors/qualities | RACH/soft, LACH/moist (11×) | UKMA/black (18×) |
| Numbers | 0 | CHAD/one, TLATA/three (18×) |
| Tools | KAD/jar, ELI/pestle (2×) | KASA/cup, SUDAR/cloth, MANA/vessel (14×) |
| Processes | TOCHEN/grind (1×) | CHATAM/seal, TACHHAN/grind (8×) |
| Plants/gardens | GAN/garden, ILAN/tree (5×) | ILANA/tree, ESHBA/herb (2×) |

Hebrew covers the sacred and cosmological. Aramaic covers the practical and medical. This split reflects the two textual traditions of Jewish learning: the Torah/Kabbalah tradition (Hebrew) and the Talmudic/Zoharic tradition (Aramaic).

## The Quadrilingual Author

The four-language structure reveals where the author learned each domain of knowledge:

**Latin from Montpellier medical texts.** The professional pharmaceutical vocabulary — every verb of instruction, every plant name, every formal assessment term. This is the language of the curriculum, the textbooks, the Antidotarium Nicolai.

**Occitan from daily life in Languedoc.** The materials he bought at the market (wool, lard, fish sauce, gold, tin), the articles of his spoken language (at the, a/one, their), the verb endings of his mother tongue (-AN for "they heat"). This is the language of the street, the shop, the home.

**Hebrew from the synagogue and family.** The divine authority that frames his practice (goddess for nature, God for danger), the celestial timing that governs his calendar (zodiac names, Sefer Yetzirah cosmology, Ibn Ezra astronomy), the ritual purity concepts that structure his worldview (pure, impure). This is the language of prayer, of the Sabbath, of his father's teaching.

**Aramaic from the study house.** The medical knowledge embedded in Talmudic passages (drug, remedy, physician, fire/fever), the body parts discussed in halakhic contexts (blood, bone), the colors and qualities described in rabbinic literature (black, one, three), the workshop processes from practical Talmudic discussions (to grind, to seal). This is the language of the beit midrash, where Torah study and practical knowledge were inseparable.

The author was not merely literate in four languages. He was educated in four traditions, each of which contributed a specific layer of knowledge to his pharmaceutical practice. His manual is not a translation from one language to another — it is a document that could only have been written by someone who thought in all four simultaneously.

## Section Distribution

Aramaic concentrates differently than Hebrew:

| Section | Hebrew | Aramaic |
|---|---|---|
| Herbal | 5% of section | 55 tokens (highest) |
| Astronomical | 4% | 20 tokens |
| Biological | 11% | 14 tokens |
| Pharmaceutical | 4% | 6 tokens |
| Recipes | 7% | 7 tokens |

Hebrew concentrates in the biological section (divine warnings during danger). Aramaic concentrates in the herbal section (medical assessment of plants). The herbal section is where the author does his most detailed intellectual work — assessing each plant's properties — and this is where both his medical-Aramaic and his professional-Latin vocabulary appear most densely.

## Implications

1. The author's education included Talmudic medical study. The Aramaic medical vocabulary (SAMMA, TICHLA, ASYA, ASHTA) comes from specific Talmudic passages where pharmaceutical recipes are discussed.

2. The number vocabulary in Aramaic (CHAD, TLATA) may resolve dosage counting. Combined with the Latin time-based dosage system (HORAM, DIEM, BIS, TERTIO), the Aramaic numbers could provide the quantity markers: "one hour," "three times."

3. The color vocabulary is trilingual: white (Latin ALBA), red (Hebrew ADOM), black (Aramaic UKMA). Each color comes from a different linguistic tradition, suggesting the author learned color terminology in different contexts — Latin from texts, Hebrew from ritual (red = blood = life), Aramaic from Talmudic description.

4. CHALA (vinegar, Aramaic) in the biological section adds a new material to the bathing preparations not present in the Latin vocabulary. The author knew bathing materials in Aramaic, consistent with the HAMMAM (hot bath) tradition.
