import { test, expect } from '@playwright/test';
//แบบฝึก1
test('Login สำเร็จ', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.title')).toHaveText('Products');
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});
//แบบฝึก2
test('Add และ Remove สินค้าใน Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Login ก่อน
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // Add Backpack (ใช้ filter)
  await page.locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' })
    .getByRole('button', { name: 'Add to cart' })
    .click();

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  // Add Bike Light
await page.locator('.inventory_item')
  .filter({ hasText: 'Sauce Labs Bike Light' })
  .getByRole('button', { name: 'Add to cart' })
  .click();

await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

// Remove Backpack
await page.locator('.inventory_item')
  .filter({ hasText: 'Sauce Labs Backpack' })
  .getByRole('button', { name: 'Remove' })
  .click();

await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
});
//แบบฝึก3

test('Assertions เชิงลึก', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // 🔴 Login ผิด
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('wrong_password');
  await page.locator('[data-test="login-button"]').click();

  // 1. Error ต้องแสดง
  await expect(page.locator('[data-test="error"]')).toBeVisible();

  // 2. ต้องมีข้อความ do not match
  await expect(page.locator('[data-test="error"]'))
    .toContainText('do not match');

  // 3. Username ต้องมี class error
  await expect(page.locator('[data-test="username"]'))
    .toHaveClass(/error/);

  // 4. กด X แล้ว error ต้องหาย
  await page.locator('.error-button').click();
  await expect(page.locator('[data-test="error"]')).not.toBeVisible();

  // 🟢 Login ใหม่ให้ถูกต้อง
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // เปลี่ยน sort เป็น Price Low to High
  await page.locator('[data-test="product-sort-container"]')
    .selectOption('lohi');

  // สินค้าแรกต้องราคา $7.99
  await expect(
    page.locator('.inventory_item_price').first()
  ).toHaveText('$7.99');
});
