# B10.1 — Grammatical Component Audit

## Purpose

Before B11 learner-facing explanations, SarfMatrix must represent grammatical additions as separate semantic components rather than treating a visually adjacent ending as one component.

This audit covers Sections 01–04 and explicitly includes masculine and feminine forms.

## 1. Emphasis with feminine plural

`nun-niswa` and `heavy-emphasis-nun` are different grammatical components. When both occur in one generated form, the Structure view must show them as separate cards. The same separation principle applies to any intervening support material. A single run may not carry both labels as though they were one morpheme.

When heavy emphasis is attached to a form already carrying nūn al-niswah, the separating alif between the two nūns must also be represented as its own component.

Required regression cases: third-person feminine plural and second-person feminine plural in heavy-emphasis forms.

## 2. Section 04 nominal case system

For active and passive participles, the explanation layer must identify both the case and the grammatical marker that realizes it.

### Masculine singular

- nominative: final dammah / dammatan
- accusative: final fathah / fathatan
- genitive: final kasrah / kasratan

### Masculine dual

- nominative: alif is the dual case marker; final nun belongs to the dual ending
- accusative/genitive: ya is the dual case marker; final nun belongs to the dual ending
- the dual nun must be represented independently from alif/ya

### Sound masculine plural

- nominative: waw is the case marker; final nun belongs to the sound-masculine-plural ending
- accusative/genitive: ya is the case marker; final nun belongs to the sound-masculine-plural ending
- the plural nun must be represented independently from waw/ya

## 3. Feminine forms — mandatory scope

Feminine forms must not be treated as a later add-on.

### Feminine singular

Represent the feminine marker (ta marbuta where the generated pattern uses it) separately from the final case/tanwin marking.

### Feminine dual

Represent all three functions independently:

1. feminine `ta`
2. dual case marker: alif in nominative, ya in accusative/genitive
3. dual `nun`

### Sound feminine plural

Represent the plural `alif + ta` material and the case marking distinctly. The case behavior is:

- nominative: dammah
- accusative: kasrah
- genitive: kasrah

The accusative kasrah is therefore not to be described as an ordinary singular genitive marker; it is the case marker used by the sound feminine plural in the accusative.

## 4. Section 04 groups to audit

The component model must be checked for:

- active participle (ism al-fa'il)
- passive participle (ism al-maf'ul)
- elative forms where generated
- zarf forms where generated
- any future case-inflected derived noun using the shared nominal inflection engine

Do not assume that a suffix with the same visible letters has the same grammatical identity in every group.

## 5. Architecture rule

Semantic identity must come from generation context (field, case, gender, number and stable element identity), not from scanning the completed Arabic word for matching letters.

The generated Arabic surface remains authoritative and unchanged during this phase.

## 6. Implementation order

1. Split `nun-niswa` from heavy/light emphasis nun where both are present.
2. Add nominal case/number/gender component identities.
3. Enrich Section 04 presentations with those identities.
4. Split compound nominal endings into separate structural runs for learner display.
5. Add English labels only after the structural identities are correct.
6. Add regression coverage for masculine singular/dual/plural and feminine singular/dual/plural in nominative, accusative and genitive.
7. Then proceed to B11 learner-friendly explanation wording.

## Research basis

The repository's morphology PDFs are the preferred research collection for this project. They include classical and teaching references already stored with SarfMatrix, such as Shadha al-ʿArf, Matn al-Bināʾ, Taṣrīf al-ʿIzzī, Tashīl al-Ṣarf, Abwāb al-Ṣarf al-Jadīd, Durūs al-Taṣrīf, Kitāb al-Maqṣūd, Irshād al-Ṣarf and related works. Page-level claims should be checked against these references whenever the relevant PDF text/page is accessible.

Arabic nominal inflection used by this audit follows the standard rules: the dual is nominative with alif and accusative/genitive with ya; the sound masculine plural is nominative with waw and accusative/genitive with ya; the sound feminine plural is nominative with dammah and accusative/genitive with kasrah. The nun of the dual and sound masculine plural is a separate part of the ending and is omitted in idafa, which further supports modelling it separately from the case marker.
