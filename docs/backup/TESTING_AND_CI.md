# SarfMatrix — Testing and CI Recovery Guide

## Visual audit workflow

GitHub Actions workflow:

`.github/workflows/explanation-visual-audit.yml`

Purpose:

- Run Playwright explanation tests.
- Capture learner-facing screenshots.
- Upload screenshot artifacts for visual review.

The current workflow covers Sections 01 and 02.

## Main Playwright audit file

`tests/visual/explanation-past.spec.js`

Despite its historical filename, this test file now covers much more than past tense. It includes:

- Active Past
- Passive Past
- Active Present
- Passive Present
- Majzūm Present
- Manṣūb Present
- Heavy Emphasis
- Light Emphasis

At the PR #82 checkpoint, the full explanation audit contains **112 tests**.

## Screenshot artifact layout

Section 01:

- `01-Active-Past/`
- `02-Passive-Past/`
- `03-Active-Present/`
- `04-Passive-Present/`

Section 02:

- `01-Majzum-Present/`
- `02-Mansub-Present/`
- `03-Heavy-Emphasis/`
- `04-Light-Emphasis/`

Dedicated GitHub Action artifacts are uploaded for these groups.

## Light Emphasis testing rule

All 14 row positions are tested, but only 8 should contain generated Light Emphasis forms.

Unavailable rows are zero-based:

`[1, 4, 5, 7, 10, 11]`

For these rows the test should verify that:

- there are no `.structure-run` cards, and
- an unavailable/empty explanation state is visible.

For available rows the test should verify that Structure cards exist.

Do not change the test to expect 14 generated Light Emphasis forms.

## Important regression lesson

The Light Emphasis learner-label refinement uses a MutationObserver. A prior implementation repeatedly rewrote text even when the value was already correct, which retriggered mutation handling and caused visual-audit timeouts.

Rule:

**Any DOM post-render refinement must be idempotent.**

Before setting `textContent`, compare the existing value with the desired value. Only mutate when different.

## Existing assertion philosophy

Tests should verify both rendering and morphology-oriented terminology, not only take screenshots.

Examples of assertion targets:

- person/gender-specific Muḍāriʿ prefix labels
- `حرف جزم` / `حرف نصب`
- `حذف النون`
- `مبني على السكون`
- `في محل جزم` / `في محل نصب`
- `نون التوكيد الثقيلة`
- `نون التوكيد الخفيفة`
- `لام التوكيد`
- dual marker / separating alif where applicable

## Merge rule

For explanation/UI work:

1. Implement on a branch.
2. Run all explanation tests.
3. Confirm CI success.
4. Download and inspect screenshot artifacts.
5. Obtain visual approval.
6. Merge only after approval.

Never report tests as passing unless the GitHub Actions run has actually completed successfully.

## Recovery checkpoint CI

PR #82 final visual audit completed successfully before merge.

Stable merge commit:

`c8c9b684834dd42f73418d3e9bb21a72bb918a4c`

If a future change breaks many existing explanations, compare against this checkpoint before modifying morphology logic.
