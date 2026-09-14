const { test, expect } = require('@playwright/test');

const ROW_COUNT = 14;
const LIGHT_AVAILABLE_ROWS = new Set([0, 2, 3, 6, 8, 9, 12, 13]);
const PREFIX_EXPECTATIONS = {
  0: ['third', 'masculine'],
  2: ['third', 'masculine'],
  3: ['third', 'feminine'],
  6: ['second', 'masculine'],
  8: ['second', 'masculine'],
  9: ['second', 'feminine'],
  12: ['first', 'singular'],
  13: ['first', 'plural'],
};

async function generateFixture(page) {
  await page.goto('/');
  await page.fill('#root-one', 'خ');
  await page.fill('#root-two', 'ر');
  await page.fill('#root-three', 'ج');
  await page.selectOption('#bab', 'نَصَرَ-يَنْصُرُ');
  await page.click('#sarf-form button[type="submit"]');
  await expect(page.locator('#explanation-panel')).toBeVisible();
  await page.selectOption('#explanation-section', 'section02');
  await page.selectOption('#explanation-field', 'lightEmphatic');
  await expect(page.locator('#explanation-row option')).toHaveCount(ROW_COUNT);
}

async function selectRow(page, rowIndex) {
  const option = page.locator('#explanation-row option').nth(rowIndex);
  const value = await option.getAttribute('value');
  if (value === null) throw new Error(`Missing value for Light Emphasis row ${rowIndex}`);
  await page.evaluate(({ nextValue }) => {
    const select = document.querySelector('#explanation-row');
    select.value = nextValue;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }, { nextValue: value });
  await expect(page.locator('#explanation-row')).toHaveValue(value);
}

async function labelsFor(page) {
  return (await page.locator('#explanation-output .structure-run__label').allTextContents()).map((text) => text.trim());
}

for (let rowIndex = 0; rowIndex < ROW_COUNT; rowIndex += 1) {
  test(`Light Emphasis learner explanation row ${String(rowIndex + 1).padStart(2, '0')}`, async ({ page }) => {
    await generateFixture(page);
    await selectRow(page, rowIndex);

    if (!LIGHT_AVAILABLE_ROWS.has(rowIndex)) {
      await page.waitForFunction(() => {
        const output = document.querySelector('#explanation-output');
        return output && output.querySelectorAll('.structure-run').length === 0 && output.querySelectorAll('.explanation-empty').length > 0;
      });
      await expect(page.locator('#explanation-output .structure-run')).toHaveCount(0);
      await expect(page.locator('#explanation-output .explanation-empty').first()).toBeVisible();
      await expect(page.locator('#explanation-output')).toContainText('Not available');
      return;
    }

    await expect(page.locator('#explanation-output .structure-run').first()).toBeVisible();
    const labels = await labelsFor(page);
    const [person, detail] = PREFIX_EXPECTATIONS[rowIndex];

    expect(labels.some((label) => label.includes(`Muḍāriʿ prefix for the ${person} person`) && label.includes(detail))).toBeTruthy();
    expect(labels.some((label) => label.includes('emphatic lām') && label.includes('لام التوكيد'))).toBeTruthy();
    expect(labels.some((label) => label.includes('light-emphasis nūn') && label.includes('نون التوكيد الخفيفة'))).toBeTruthy();
    expect(labels.some((label) => label.includes('heavy-emphasis nūn'))).toBeFalsy();

    const lightCards = page.locator('#explanation-output .structure-run').filter({ hasText: 'نون التوكيد الخفيفة' });
    await expect(lightCards).toHaveCount(1);

    const rule = await page.locator('#explanation-output .light-rule').textContent();
    const derivation = await page.locator('#explanation-output .light-derivation').textContent();
    expect(rule).toContain('نون التوكيد الخفيفة');
    expect(derivation).toContain('نون التوكيد الخفيفة');

    if (rowIndex === 2 || rowIndex === 8) {
      expect(rule).toContain('masculine plural');
      expect(rule).toContain('Five Verbs');
    } else if (rowIndex === 9) {
      expect(rule).toContain('feminine singular addressee');
    } else {
      expect(rule).toContain('emphatic lām');
    }
  });
}
