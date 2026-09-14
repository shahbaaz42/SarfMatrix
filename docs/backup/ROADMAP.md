# SarfMatrix — Roadmap After PR #82

## Current milestone

Section 02 is complete through PR #82.

Stable checkpoint:

`c8c9b684834dd42f73418d3e9bb21a72bb918a4c`

## Immediate next milestone — Section 03

Audit **فعل الأمر** using the same disciplined workflow used for Sections 01 and 02.

Recommended order:

### 1. Basic imperative

- Generate baseline screenshots for all relevant pronoun rows.
- Verify which rows are genuinely generated and which are unavailable.
- Audit Structure segmentation.
- Add learner-facing labels.
- Add Rules and Derivation where transformation is meaningful.
- Add automated assertions.

### 2. Imperative with Heavy Emphasis

- Verify availability row-by-row rather than assuming the same paradigm as Muḍāriʿ Heavy Emphasis.
- Separate grammatical markers into distinct Structure cards.
- Reuse terminology from Section 02 where morphologically identical.
- Add screenshots and assertions.

### 3. Imperative with Light Emphasis

- First establish the exact set of available forms from the generator and trusted morphology references.
- Do not assume 14 forms.
- Preserve explicit unavailable states in CI.
- Add learner-facing explanation only for valid generated forms.

## After Section 03

### Section 04 refinement

Review derived forms and nominal morphology:

- Maṣdar
- Active participle
- Passive participle
- Elative
- Ẓarf

Audit case/number endings and make sure grammatical and derivational identities are separated cleanly.

### Semantic architecture cleanup

Gradually reduce DOM post-render compatibility logic from `explanation-learner-labels.js`.

Preferred direction:

1. Row-aware semantic roles in `grammatical-components.js`.
2. Presentation runs split in `explanation-identities.js`.
3. `explanation-ui.js` renders semantic runs directly.
4. DOM relabel/splitting hacks removed only after equivalent tests exist.

### Automatic Bāb detection

A future product goal is to detect the Bāb automatically from the entered verb/root where linguistically possible. This should be implemented as a separate linguistic inference layer rather than mixing inference into the UI.

### Separate linguistic engine from website

Long-term product architecture should separate:

- morphology/linguistic engine
- browser UI
- export layer
- API/service layer

This will make SarfMatrix easier to reuse in an LMS, EdTech platform, mobile app or paid SaaS product.

## Backup discipline

At major milestones:

1. Merge only after CI and visual approval.
2. Record the merge commit in recovery docs.
3. Create a milestone snapshot branch.
4. Keep a full local Git clone including `.git` history.
5. Copy that clone to a second physical/cloud location.
6. Periodically mirror the repository to a second Git host if desired.

## Starting a new ChatGPT/developer session

Use this instruction:

> Continue SarfMatrix from the PR #82 recovery checkpoint. Read `docs/backup/PROJECT_STATUS.md`, `ARCHITECTURE.md`, `MORPHOLOGY_DECISIONS.md`, `TESTING_AND_CI.md`, and `ROADMAP.md` from the `backup/recovery-docs-pr82` branch. The stable code checkpoint is commit `c8c9b684834dd42f73418d3e9bb21a72bb918a4c`. Continue with Section 03 — فعل الأمر without changing existing generated Arabic unless a morphology bug is proven.
