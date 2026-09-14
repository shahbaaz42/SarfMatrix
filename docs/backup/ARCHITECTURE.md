# SarfMatrix — Architecture Recovery Notes

## Core generation boundary

`script.js` contains the generation workflow. `dispatchGeneration(options)` is the important generation boundary: generated Arabic output should be treated as authoritative by explanation/UI code.

Do not derive new morphology from visible glyphs when semantic metadata already exists.

## Semantic identity layers

### `component-contract.js`

Defines language-neutral semantic component identities.

Important structural kinds include:

- `radical`
- `derivational`
- `derivational-copy`
- `grammatical`
- `particle`
- `presentation`

Important grammatical/derivational roles include Muḍāriʿ prefixes, dual alif, plural wāw, feminine-address yāʾ, nūn al-niswah, subject endings, mood particles, heavy/light emphasis nūns, derivational hamzahs, hamzat waṣl/qaṭʿ, and nominal case/number markers.

### `grammatical-components.js`

Attaches grammatical identities to Sections 01–03.

Important existing row-level concepts:

- Past endings such as dual alif, plural wāw, feminine tāʾ, subject tāʾ and first-person plural nā.
- Non-past endings such as dual alif, plural wāw, feminine-address yāʾ and nūn al-niswah.
- Indicative nūn for the Five Verbs.
- Heavy/light emphasis nūn identities.

Known semantic caveat: the second-person feminine plural row historically uses a coarse `subject-ta + nun-niswa` representation. If this is refactored, do it in the semantic layer first rather than adding more DOM-only inference.

### `derivational-components.js`

Assigns Bāb-specific derivational identities from builder metadata and field structure rather than simply scanning Unicode glyphs.

Examples include Form VIII tāʾ, Form VII/VIII/X hamzah, Form X sīn/tāʾ, maṣdar alif and participle mīm.

### `explanation-identities.js`

Enriches explanation snapshots with semantic identities while leaving the raw generated tables unchanged.

### `explanation-ui.js`

Renders the Rules & Explanation interface, including Structure cards, Rules, Derivation, alternatives and sources.

### `explanation-learner-labels.js`

Provides learner-facing terminology for explanation components. It contains compatibility/post-render logic accumulated during the Section 01–02 audit.

Long-term refactor direction: reduce DOM/glyph inference here and move row-aware morphology into semantic identities so the UI only renders already-identified components.

### `explanation-light-emphasis.js`

PR #82 added Light Emphasis learner-facing refinement for the eight generated forms. It adjusts labels/rules/derivation without altering the generated Arabic.

The MutationObserver in this file must remain idempotent: only write DOM text when the new value differs from the current value. Non-idempotent rewriting previously caused visual-audit timeouts.

## Result sections

### Section 01

- Active Past
- Active Present
- Passive Past
- Passive Present

### Section 02

- Majzūm Present
- Manṣūb Present
- Heavy Emphasis
- Light Emphasis

### Section 03

- Imperative
- Imperative with Heavy Emphasis
- Imperative with Light Emphasis

Section 03 is the next audit target after PR #82.

### Section 04

Derived/nominal forms such as maṣdar, active participle, passive participle, elative and ẓarf are displayed separately and have their own explanation semantics.

## Architectural rules for future changes

1. Preserve generated Arabic unless the generator itself is proven wrong.
2. Prefer semantic role identities over visual/glyph heuristics.
3. Keep one Structure card per meaningful grammatical/morphological component.
4. Keep learner labels independent from internal role names.
5. Use row-aware tests for pronoun-sensitive morphology.
6. Treat unavailable paradigms as explicit states, not test failures.
7. Any visual explanation change must be verified by automated screenshots before merge.
