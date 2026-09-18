const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const AVAILABLE_ROW_INDEXES = [0, 2, 3, 6, 8, 9, 12, 13];

async function generateFixture(page) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section03');
  await page.selectOption('#explanation-field', 'lightImperative');
  await expect(page.locator('#explanation-row option')).toHaveCount(AVAILABLE_ROW_INDEXES.length);
}

async function chooseRow(page, rowIndex) {
  const option = page.locator('#explanation-row option').nth(rowIndex);
  const value = await option.getAttribute('value');
  if (value === null) throw new Error(`Missing value for explanation row ${rowIndex}`);
  await page.selectOption('#explanation-row', value);
  await expect(page.locator('#explanation-row')).toHaveValue(value);
  await expect(page.locator('#explanation-output .explanation-surface')).toBeVisible();
  return value;
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'row';
}

async function shot(page, rowIndex, rowValue) {
  const outputDir = path.join(process.cwd(), 'test-results', 'section03-explanations', '03-Light-Imperative');
  fs.mkdirSync(outputDir, { recursive: true });
  await page.locator('#explanation-panel').screenshot({
    path: path.join(outputDir, `${String(rowIndex + 1).padStart(2, '0')}-${safeName(rowValue)}.png`),
  });
}

for (const rowIndex of AVAILABLE_ROW_INDEXES) {
  test(`light imperative explanation source row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
    await generateFixture(page);
    const optionIndex = AVAILABLE_ROW_INDEXES.indexOf(rowIndex);
    const rowValue = await chooseRow(page, optionIndex);
    await shot(page, rowIndex, rowValue);
  });
}
