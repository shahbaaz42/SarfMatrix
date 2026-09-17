const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROW_COUNT = 14;
const SECOND_PERSON_ROWS = new Set([6, 7, 8, 9, 10, 11]);
const DUAL_ROWS = new Set([1, 4, 7, 10]);
const NUN_NISWA_ROWS = new Set([5, 11]);
const DIRECTLY_EMPHASIZED_NONSECOND_ROWS = new Set([0, 3, 12, 13]);

async function generateFixture(page) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section03');
  await page.selectOption('#explanation-field', 'heavyImperative');
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
  await expect(page.locator('#explanation-output .explanation-surface')).toBeVisible();
  await expect(page.locator('#explanation-output .structure-run').first()).toBeVisible();

  // Wait until the precision layer identifies the exact requested row. Textual
  // grammar markers are intentionally shared by multiple rows.
  await expect(page.locator('#explanation-output')).toHaveAttribute('data-heavy-imperative-row', String(rowIndex));

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

async function assertHeavyImperative(page, rowIndex) {
  const labels = await labelsFor(page);
  const direct = SECOND_PERSON_ROWS.has(rowIndex);

  expect(labels.some((label) => label.includes('heavy-emphasis nūn') && label.includes('نون التوكيد الثقيلة'))).toBeTruthy();

  if (direct) {
    expect(labels.some((label) => label.includes('lām al-amr'))).toBeFalsy();
    expect(labels.some((label) => label.includes('Muḍāriʿ prefix'))).toBeFalsy();
    expect(labels.some((label) => label.includes('hamzat al-waṣl') && label.includes('همزة الوصل'))).toBeTruthy();
  } else {
    expect(labels.some((label) => label.includes('lām al-amr') && label.includes('لام الأمر'))).toBeTruthy();
    assertNonSecondPrefix(labels, rowIndex);
  }

  if (DUAL_ROWS.has(rowIndex)) {
    const dualCards = page.locator('#explanation-output .structure-run').filter({ hasText: 'ألف الاثنين' });
    const heavyCards = page.locator('#explanation-output .structure-run').filter({ hasText: 'نون التوكيد الثقيلة' });
    await expect(dualCards).toHaveCount(1);
    await expect(heavyCards).toHaveCount(1);
    expect(await dualCards.evaluate((dual, heavy) => dual !== heavy, await heavyCards.elementHandle())).toBeTruthy();
    const heavyArabic = await heavyCards.locator('.structure-run__arabic').textContent();
    expect(String(heavyArabic || '').normalize('NFD').replace(/\p{M}/gu, '')).toBe('ن');
  }

  if (NUN_NISWA_ROWS.has(rowIndex)) {
    expect(labels.some((label) => label.includes('نون النسوة'))).toBeTruthy();
    expect(labels.some((label) => label.includes('الألف الفاصلة'))).toBeTruthy();
    if (rowIndex === 11) expect(labels.some((label) => label.includes('feminine plural addressee subject marker'))).toBeTruthy();
  }

  const ruleLocator = page.locator('#explanation-output .heavy-imperative-precise-rule');
  const derivationLocator = page.locator('#explanation-output .heavy-imperative-precise-derivation');
  await expect(ruleLocator).toBeVisible();
  await expect(derivationLocator).toBeVisible();
  const rule = await ruleLocator.textContent();
  const derivation = await derivationLocator.textContent();
  expect(rule).toMatch(/heavy-emphasis nūn|نون التوكيد الثقيلة/);
  expect(derivation).toContain('نون التوكيد الثقيلة');

  if (rowIndex === 6) {
    expect(rule).toContain('مبني على الفتح');
    expect(rule).toContain('اتصالًا مباشرًا');
  }

  if (rowIndex === 7 || rowIndex === 10) {
    expect(rule).toContain('مبني على حذف النون');
    expect(rule).toContain('ألف الاثنين');
    expect(rule).toContain('نِّ');
  }

  if (rowIndex === 8) {
    expect(rule).toContain('مبني على حذف النون');
    expect(rule).toContain('واو الجماعة');
    expect(rule).toContain('التقاء الساكنين');
  }

  if (rowIndex === 9) {
    expect(rule).toContain('مبني على حذف النون');
    expect(rule).toContain('ياء المخاطبة');
    expect(rule).toContain('التقاء الساكنين');
  }

  if (rowIndex === 11) {
    expect(rule).toContain('مبني على السكون');
    expect(rule).toContain('نون النسوة');
    expect(rule).toContain('الألف الفاصلة');
  }

  if (DIRECTLY_EMPHASIZED_NONSECOND_ROWS.has(rowIndex)) {
    expect(rule).toContain('lām al-amr');
    expect(rule).toContain('مبني على الفتح');
    expect(rule).toContain('في محل جزم');
  }

  if (rowIndex === 1 || rowIndex === 4) {
    expect(rule).toContain('علامة جزمه حذف النون');
    expect(rule).toContain('ألف الاثنين');
  }

  if (rowIndex === 2) {
    expect(rule).toContain('علامة جزمه حذف النون');
    expect(rule).toContain('واو الجماعة');
    expect(rule).toContain('التقاء الساكنين');
  }

  if (rowIndex === 5) {
    expect(rule).toContain('مبني على السكون');
    expect(rule).toContain('في محل جزم');
    expect(rule).toContain('الألف الفاصلة');
  }
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'row';
}

async function shot(page, rowIndex, rowValue) {
  const outputDir = path.join(process.cwd(), 'test-results', 'section03-explanations', '02-Heavy-Imperative');
  fs.mkdirSync(outputDir, { recursive: true });
  await page.locator('#explanation-panel').screenshot({
    path: path.join(outputDir, `${String(rowIndex + 1).padStart(2, '0')}-${safeName(rowValue)}.png`),
  });
}

for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
  test(`heavy imperative explanation row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
    await generateFixture(page);
    const rowValue = await chooseRow(page, rowIndex);
    await assertHeavyImperative(page, rowIndex);
    await shot(page, rowIndex, rowValue);
  });
}
