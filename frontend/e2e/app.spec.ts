import { test, expect } from '@playwright/test';

test.describe('Demo Login Flow', () => {
  test('login page loads and shows demo button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('text=Demo Login')).toBeVisible();
    await expect(page.locator('text=demo@retro-tracker.com')).toBeVisible();
  });

  test('demo login works and redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Demo Login');
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page.locator('text=Welcome back')).toBeVisible({ timeout: 5000 });
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'wrong@email.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('text=Sign In');
    await expect(page.locator('[class*="alert"],[class*="error"]').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Navigation', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Retro Collection Tracker/);
  });

  test('protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('/login');
  });

  test('explore page is public', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.locator('text=Explore')).toBeVisible();
  });
});

test.describe('Dashboard (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Demo Login');
    await page.waitForURL('/dashboard', { timeout: 10000 });
  });

  test('dashboard shows KPIs', async ({ page }) => {
    await expect(page.locator('text=Total Games').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Est. Value').first()).toBeVisible();
    await expect(page.locator('.stat-card__label:has-text("Wishlist")')).toBeVisible();
  });

  test('sidebar navigation works', async ({ page }) => {
    await page.click('text=Collection');
    await page.waitForURL('/collection');
    await expect(page.locator('text=My Collection')).toBeVisible();
  });

  test('logout redirects to login', async ({ page }) => {
    // Click profile chip to open dropdown
    await page.click('[class*="profile-chip"]');
    await page.click('text=Logout');
    await page.waitForURL('/login');
  });
});
