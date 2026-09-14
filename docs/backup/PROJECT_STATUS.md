# SarfMatrix — Project Recovery Status

## Recovery checkpoint

- Repository: `shahbaaz42/SarfMatrix`
- Recovery date: 2026-09-14
- Stable main checkpoint: `c8c9b684834dd42f73418d3e9bb21a72bb918a4c`
- Checkpoint meaning: PR #82 merged; Section 02 explanation audit complete.
- Immutable snapshot branch: `backup/section02-complete-pr82`
- Recovery documentation branch: `backup/recovery-docs-pr82`

If development history is ever lost, start from the stable checkpoint above or from `backup/section02-complete-pr82`.

## Product goal

SarfMatrix is a browser-first Arabic Ṣarf generator. It generates conjugation tables from Arabic roots and Bāb selections and provides learner-facing explanations of the structure of each generated form.

A major design principle is that the generated Arabic is authoritative. Explanation/UI work must not silently alter generated forms unless a genuine morphology bug has first been established.

## Current development state

Completed through PR #82:

- Core browser generator and root/Bāb selection.
- Section 01 explanation audit:
  - Active Past
  - Passive Past
  - Active Present
  - Passive Present
- Section 02 explanation audit:
  - Majzūm Present
  - Manṣūb Present
  - Heavy Emphasis — نون التوكيد الثقيلة
  - Light Emphasis — نون التوكيد الخفيفة
- Automated Playwright visual auditing of explanation panels.
- Screenshot artifacts generated through GitHub Actions.
- Learner-facing English-first labels with Arabic terminology in brackets.
- Semantic component identities for grammatical and derivational elements.

## PR #82 — Light Emphasis checkpoint

PR #82 completed the Section 02 Light Emphasis audit.

Important invariant:

- Light Emphasis has **8 generated forms** in the current paradigm.
- The remaining **6 rows are intentionally unavailable**.
- CI should test all 14 row positions so the six unavailable rows are also protected against accidental regression.

Available Light Emphasis rows:

- هُوَ
- هُمْ
- هِيَ
- أَنْتَ
- أَنْتُمْ
- أَنْتِ
- أَنَا
- نَحْنُ

Unavailable row indices in the 14-row test array are zero-based:

`[1, 4, 5, 7, 10, 11]`

Do not convert these unavailable rows into generated forms without first verifying the morphology from trusted sources.

## Explanation wording conventions

Learner-facing labels generally begin with **“This is …”**.

Examples already standardized:

- `This is the emphatic lām (لام التوكيد)`
- `This is the heavy-emphasis nūn (نون التوكيد الثقيلة)`
- `This is the light-emphasis nūn (نون التوكيد الخفيفة)`
- Person/gender-specific Muḍāriʿ prefix labels are used instead of generic “Present-tense prefix”.

English-first wording with Arabic terminology in brackets is preferred because it improves readability and reduces bidirectional-text problems.

## UI/UX principles

- One Structure card should represent one grammatical/morphological component.
- Do not expose internal implementation labels such as “Form 8” to learners when a proper Arabic Bāb name can be shown.
- Visual changes are not considered complete until screenshot artifacts have been reviewed.
- Generated Arabic should remain unchanged during explanation-only work.

## Next development area

The next major task is:

**Section 03 — فعل الأمر**

Audit in this order:

1. Basic imperative — فعل الأمر
2. Imperative with Heavy Emphasis — فعل الأمر بنون التوكيد الثقيلة
3. Imperative with Light Emphasis — فعل الأمر بنون التوكيد الخفيفة

Use the same workflow established for Sections 01 and 02: baseline screenshots → morphology audit → semantic labels → rules/derivation → automated assertions → visual approval → merge.

## Recovery procedure

If starting from a new machine or a new conversation:

1. Clone the repository with full Git history, not only a ZIP.
2. Checkout `main` and confirm it contains commit `c8c9b684834dd42f73418d3e9bb21a72bb918a4c` or a descendant.
3. Read all files in `docs/backup/`.
4. Inspect the latest successful `Explanation Visual Audit` workflow before changing explanation logic.
5. Continue with Section 03 only after confirming the existing Section 01 and Section 02 tests remain green.
