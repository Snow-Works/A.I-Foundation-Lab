// e2e/auth.spec.js
import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test("user can register and is redirected to verify pending", async ({ page }) => {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;

    await page.goto("/#/register");

    await page.fill('input[name="firstName"]', "Playwright");
    await page.fill('input[name="surname"]', "Test");
    await page.fill('input[name="email"]', email);
    
    const phoneInput = page.locator('input[type="tel"]');
    await phoneInput.fill("8012345678");

    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill("Password123!");
    await passwordInputs.nth(1).fill("Password123!");

    await page.locator('input[type="checkbox"]').check();

    await page.click('button[type="submit"]');

    // Wait for navigation to verify-pending
    await page.waitForURL(/.*verify-pending.*/);
    
    await expect(page.locator("body")).toContainText(email);
    await expect(page.locator("body")).toContainText("Check your inbox");
  });

  test("user cannot log in with invalid credentials", async ({ page }) => {
    await page.goto("/#/login");
    
    await page.fill('input[type="email"]', "doesnotexist@example.com");
    await page.locator('input[type="password"]').fill("WrongPassword");
    
    await page.click('button[type="submit"]');

    // Wait for the error message to appear (don't wait for URL change)
    const errorBox = page.locator(".register__form-error");
    await expect(errorBox).toBeVisible({ timeout: 5000 });
  });
});