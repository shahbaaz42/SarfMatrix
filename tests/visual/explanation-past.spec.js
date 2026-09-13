const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const FORMS = ['past', 'passivePast'];

test.setTimeout(120000);

async function generateFixture(page) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section01');
}

async function forceSelect(page, selector, value) {
  await page.locator(selector).evaluate((select, nextValue) => {
    select.value = nextValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
  await page.waitForTimeout(75);
}

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'row';
}

test('capture every active/passive past pronoun and guard learner labels', async ({ page }, testInfo) => {
  await generateFixture(page);
  const outputDir = path.join(testInfo.outputDir, 'past-explanations');
  fs.mkdirSync(outputDir, { recursive: true });

  for (const form of FORMS) {
    await forceSelect(page, '#explanation-field', form);
    const rows = await page.locator('#explanation-row option').evaluateAll((options) =>
      options.map((option, index) => ({ value: option.value, label: option.textContent.trim(), index }))
    );

    expect(rows.length).toBe(14);

    for (const row of rows) {
      await forceSelect(page, '#explanation-row', row.value);

      const structure = page.locator('#explanation-output .structure-run');
      await expect(structure.first()).toBeVisible();

      const labels = await page.locator('#explanation-output .structure-run__label').allTextContents();
      if (row.index >= 6) {
        expect(labels.some((label) => /^Subject\s+ت\b/i.test(label.trim()))).toBeFalsy();
      }
      if (row.index === 11) {
        expect(labels.some((label) => label.includes('feminine plural addressee subject ending'))).toBeTruthy();
        expect(labels.some((label) => label.includes('feminine plural addressee ending'))).toBeTruthy();
      }
      if (row.index === 12) {
        expect(labels.some((label) => label.includes('first-person singular subject ending with ḍammah'))).toBeTruthy();
      }
      if (row.index === 13) {
        expect(labels.some((label) => label.includes('first-person plural subject ending'))).toBeTruthy();
      }

      const filename = `${form}-${String(row.index + 1).padStart(2, '0')}-${safeName(row.value)}.png`;
      await page.locator('#explanation-panel').screenshot({ path: path.join(outputDir, filename) });
    }
  }
});
