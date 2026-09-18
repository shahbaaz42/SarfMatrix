const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROW_COUNT = 14;

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
  await expect(page.locator('#explanation-row option')).toHaveCount(ROW_COUNT);
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

for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
  test(`light imperative explanation row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
    await generateFixture(page);
    const rowValue = await chooseRow(page, rowIndex);
    await shot(page, rowIndex, rowValue);
  });
}
