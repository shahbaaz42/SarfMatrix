# SarfMatrix — Morphology Decisions Through PR #82

This file records decisions that should not be reconstructed from memory alone.

## General principles

- Generated Arabic is authoritative unless a morphology error is demonstrated.
- Explanation changes should not mutate the underlying generated form.
- Use trusted Arabic morphology references before changing availability or conjugation behavior.
- English-first learner labels with Arabic terms in brackets are preferred.

## Section 01 — Past

Compound active-past subject endings were visually split into separate components for clearer learner explanations.

Examples:

- `تُمَا` → `تُ | مَ | ا`
- `تُمْ` → `تُ | مْ`
- `تُنَّ` → `تُ | نَّ`

Standardized labels include:

- `تُ`: first-person singular subject ending with ḍammah — تاء الفاعل للمتكلم المفرد
- `نَا`: first-person plural subject ending — نا الفاعلين للمتكلمين
- `تَ`: masculine singular addressee subject ending with fatḥah — تاء الفاعل للمخاطب المفرد المذكر
- `تِ`: feminine singular addressee subject ending with kasrah — تاء الفاعل للمخاطبة المفردة المؤنثة

Passive-past explanations were brought to parity with active past.

## Section 01 — Muḍāriʿ prefixes

Learner labels are person/gender-specific rather than generic.

- `ي` for هُوَ / هُمَا / هُمْ: third person masculine — حرف المضارعة للغائب المذكر
- `ت` for هِيَ / feminine هُمَا: third person feminine — حرف المضارعة للغائبة المؤنثة
- `ت` for أَنْتَ / أَنْتُمَا / أَنْتُمْ: second person masculine — حرف المضارعة للمخاطب المذكر
- `ت` for أَنْتِ / feminine أَنْتُمَا / أَنْتُنَّ: second person feminine — حرف المضارعة للمخاطبة المؤنثة
- `أ` for أَنَا: first person singular — حرف المضارعة للمتكلم المفرد
- `ن` for نَحْنُ: first person plural — حرف المضارعة للمتكلمين

Indicative nūn label:

`This is the retained nūn of the Five Verbs in the indicative (ثبوت النون في الأفعال الخمسة)`

## Section 02 — Majzūm Present

Five-Verbs rows use deletion of nūn as the jussive sign:

`علامة جزمه حذف النون`

Rows with nūn al-niswah are treated as built on sukūn and syntactically in the position of jussive:

`مبني على السكون ... في محل جزم`

Other regular rows use sukūn as the jussive sign:

`علامة جزمه السكون`

The mood particle label uses:

`This is the jussive particle ... (حرف جزم)`

## Section 02 — Manṣūb Present

Five-Verbs rows use deletion of nūn as the subjunctive sign:

`علامة نصبه حذف النون`

Rows with nūn al-niswah are treated as built on sukūn and syntactically in the position of subjunctive:

`مبني على السكون ... في محل نصب`

Other regular rows use fatḥah as the subjunctive sign:

`علامة نصبه الفتحة`

The mood particle label uses:

`This is the subjunctive particle ... (حرف نصب)`

## Section 02 — Heavy Emphasis

Standardized learner labels:

- `This is the emphatic lām (لام التوكيد)`
- `This is the heavy-emphasis nūn (نون التوكيد الثقيلة)`
- `This is the separating alif (الألف الفاصلة)`

Row behavior groups:

- Direct heavy nūn: singular/first-person rows where no retained dual/plural marker is required.
- Dual rows: retain dual alif as its own component before heavy nūn.
- Masculine plural rows: the ordinary indicative ending is reshaped before heavy nūn; the final nūn is not the indicative nūn of the Five Verbs.
- Feminine singular addressee: the ordinary feminine-address ending is reshaped before heavy nūn.
- Feminine plural: retain nūn al-niswah, then separating alif, then heavy nūn.

## Section 02 — Light Emphasis

This is a critical project invariant.

Light Emphasis has only **8 generated forms** in the current SarfMatrix paradigm.

Available forms:

- هُوَ
- هُمْ
- هِيَ
- أَنْتَ
- أَنْتُمْ
- أَنْتِ
- أَنَا
- نَحْنُ

The other 6 row positions are intentionally unavailable. In zero-based row indices:

`1, 4, 5, 7, 10, 11`

Do not force Structure cards or invent generated forms for those rows.

Standardized learner labels:

- `This is the emphatic lām (لام التوكيد)`
- `This is the light-emphasis nūn (نون التوكيد الخفيفة)`

For masculine plural forms, explain that the normal indicative ending is reshaped before attaching light nūn and that the final nūn is not the indicative nūn of the Five Verbs.

For the feminine singular addressee form, explain that the ordinary feminine-address Muḍāriʿ ending is reshaped before attaching light nūn.

## Known semantic cleanup opportunity

The second-person feminine plural past identity has historically been represented with `subject-ta + nun-niswa`. This is semantically coarse. If corrected later, make the change in `grammatical-components.js` / semantic identities first and then render from that semantic state. Avoid adding another glyph-based UI workaround.
