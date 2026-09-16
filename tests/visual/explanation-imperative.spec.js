const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROW_COUNT = 14;
const SECOND_PERSON_ROWS = new Set([6, 7, 8, 9, 10, 11]);
const FIVE_VERB_ROWS = new Set([1, 2, 4, 7, 8, 9, 10]);
const NUN_NISWA_ROWS = new Set([5, 11]);

async function generateFixture(page) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section03');
  await page.selectOption('#explanation-field', 'imperative');
  await expect(page.locator('#explanation-row option')).toHaveCount(ROW_COUNT);
}

async function chooseRow(page, rowIndex) {
  const value = await page.locator('#explanation-row option').nth(rowIndex).getAttribute('value');
  if (value === null) throw new Error(`Missing value for explanation row ${rowIndex}`);
  await page.evaluate(({ nextValue }) => {
    const select = document.querySelector('#explanation-row');
    select.value = nextValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, { nextValue: value });
  await expect(page.locator('#explanation-row')).toHaveValue(value);
  await expect(page.locator('#explanation-output .structure-run').first()).toBeVisible();
  await page.waitForFunction(() => Boolean(document.querySelector('#explanation-output .imperative-rule')));
  return value;
}

async function labelsFor(page) {
  return (await page.locator('#explanation-output .structure-run__label').allTextContents()).map((value) => value.trim());
}

function hasPrefixLabel(labels, person, detail) {
  return labels.some((label) => label.includes(`Muḍāriʿ prefix for the ${person} person`) && label.includes(detail));
}

function assertNonSecondPrefix(labels, rowIndex) {
  if ([0, 1, 2].includes(rowIndex)) expect(hasPrefixLabel(labels, 'third', 'masculine')).toBeTruthy();
  if ([3, 4, 5].includes(rowIndex)) expect(hasPrefixLabel(labels, 'third', 'feminine')).toBeTruthy();
  if (rowIndex === 12) expect(hasPrefixLabel(labels, 'first', 'singular')).toBeTruthy();
  if (rowIndex === 13) expect(hasPrefixLabel(labels, 'first', 'plural')).toBeTruthy();
}

async function assertImperative(page, rowIndex) {
  const labels = await labelsFor(page);
  const direct = SECOND_PERSON_ROWS.has(rowIndex);

  if (direct) {
    expect(labels.some((label) => label.includes('lām al-amr'))).toBeFalsy();
    expect(labels.some((label) => label.includes('Muḍāriʿ prefix'))).toBeFalsy();
    expect(labels.some((label) => label.includes('hamzat al-waṣl') && label.includes('همزة الوصل'))).toBeTruthy();
  } else {
    expect(labels.some((label) => label.includes('lām al-amr') && label.includes('لام الأمر'))).toBeTruthy();
    assertNonSecondPrefix(labels, rowIndex);
  }

  const expectedEnding = {
    1: 'masculine dual subject marker',
    2: 'masculine plural subject marker',
    4: 'feminine dual subject marker',
    5: 'feminine plural subject marker',
    7: 'masculine dual addressee subject marker',
    8: 'masculine plural addressee subject marker',
    9: 'feminine singular addressee subject marker',
    10: 'feminine dual addressee subject marker',
    11: 'feminine plural addressee subject marker',
  }[rowIndex];
  if (expectedEnding) expect(labels.some((label) => label.includes(expectedEnding))).toBeTruthy();

  const rule = await page.locator('#explanation-output .imperative-rule').textContent();
  const derivation = await page.locator('#explanation-output .imperative-derivation').textContent();
  expect(rule).toBeTruthy();
  expect(derivation).toBeTruthy();

  if (direct) {
    expect(rule).toContain('direct imperative');
    if (FIVE_VERB_ROWS.has(rowIndex)) expect(rule).toContain('مبني على حذف النون');
    else if (NUN_NISWA_ROWS.has(rowIndex)) {
      expect(rule).toContain('نون النسوة');
      expect(rule).toContain('مبني على السكون');
    } else expect(rule).toContain('مبني على ما يُجزم به مضارعه');
  } else {
    expect(rule).toContain('lām al-amr');
    if (FIVE_VERB_ROWS.has(rowIndex)) expect(rule).toContain('حذف النون');
    else if (NUN_NISWA_ROWS.has(rowIndex)) {
      expect(rule).toContain('نون النسوة');
      expect(rule).toContain('في محل جزم');
    } else expect(rule).toContain('علامة جزمه السكون');
  }
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'row';
}

async function shot(page, rowIndex, rowValue) {
  const outputDir = path.join(process.cwd(), 'test-results', 'section03-explanations', '01-Imperative');
  fs.mkdirSync(outputDir, { recursive: true });
  await page.locator('#explanation-panel').screenshot({
    path: path.join(outputDir, `${String(rowIndex + 1).padStart(2, '0')}-${safeName(rowValue)}.png`),
  });
}

for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
  test(`imperative explanation row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
    await generateFixture(page);
    const rowValue = await chooseRow(page, rowIndex);
    await assertImperative(page, rowIndex);
    await shot(page, rowIndex, rowValue);
  });
}
