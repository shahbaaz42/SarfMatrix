const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const FORMS = ['past', 'passivePast', 'present', 'passivePresent'];
const FORM_DIRS = Object.freeze({
  past: '01-Active-Past',
  passivePast: '02-Passive-Past',
  present: '03-Active-Present',
  passivePresent: '04-Passive-Present',
});
const ROW_COUNT = 14;

async function generateFixture(page, form) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section01');
  await page.selectOption('#explanation-field', form);
  await expect(page.locator('#explanation-row option')).toHaveCount(ROW_COUNT);
}

async function chooseRow(page, rowIndex) {
  const value = await page.locator('#explanation-row option').nth(rowIndex).getAttribute('value');
  if (value === null) throw new Error(`Missing value for explanation row ${rowIndex}`);

  await page.evaluate(({ selector, nextValue }) => {
    const select = document.querySelector(selector);
    if (!select) throw new Error(`Missing select: ${selector}`);
    select.value = nextValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, { selector: '#explanation-row', nextValue: value });

  await expect(page.locator('#explanation-row')).toHaveValue(value);
  await expect(page.locator('#explanation-output .structure-run').first()).toBeVisible();
  return value;
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'row';
}

async function labelsFor(page) {
  return (await page.locator('#explanation-output .structure-run__label').allTextContents()).map((label) => label.trim());
}

async function assertPastLabels(page, rowIndex) {
  const labels = await labelsFor(page);
  if (rowIndex >= 6) expect(labels.some((label) => /^Subject\s+ت\b/i.test(label))).toBeFalsy();
  if (rowIndex === 11) {
    expect(labels.some((label) => label.includes('feminine plural addressee subject ending'))).toBeTruthy();
    expect(labels.some((label) => label.includes('feminine plural addressee ending'))).toBeTruthy();
  }
  if (rowIndex === 12) expect(labels.some((label) => label.includes('first-person singular subject ending with ḍammah'))).toBeTruthy();
  if (rowIndex === 13) expect(labels.some((label) => label.includes('first-person plural subject ending'))).toBeTruthy();
}

async function assertPresentLabels(page, rowIndex) {
  const labels = await labelsFor(page);
  expect(labels.some((label) => label.startsWith('This is the') && label.includes('present prefix'))).toBeTruthy();

  const fiveVerbRows = new Set([1, 2, 4, 7, 8, 9, 10]);
  if (fiveVerbRows.has(rowIndex)) {
    expect(labels.some((label) => label.includes('indicative five-verbs ending'))).toBeTruthy();
  }
  if (rowIndex === 5) expect(labels.some((label) => label.includes('feminine plural subject marker (نون النسوة)'))).toBeTruthy();
  if (rowIndex === 11) expect(labels.some((label) => label.includes('feminine plural addressee subject marker (نون النسوة)'))).toBeTruthy();
  if (rowIndex === 12) expect(labels.some((label) => label.includes('first-person singular present prefix أ'))).toBeTruthy();
  if (rowIndex === 13) expect(labels.some((label) => label.includes('first-person plural present prefix ن'))).toBeTruthy();
}

for (const form of FORMS) {
  for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
    test(`${form} explanation row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
      await generateFixture(page, form);
      const rowValue = await chooseRow(page, rowIndex);
      if (form === 'past' || form === 'passivePast') await assertPastLabels(page, rowIndex);
      else await assertPresentLabels(page, rowIndex);

      const outputDir = path.join(process.cwd(), 'test-results', 'section01-explanations', FORM_DIRS[form]);
      fs.mkdirSync(outputDir, { recursive: true });
      const filename = `${String(rowIndex + 1).padStart(2, '0')}-${safeName(rowValue)}.png`;
      await page.locator('#explanation-panel').screenshot({ path: path.join(outputDir, filename) });
    });
  }
}
