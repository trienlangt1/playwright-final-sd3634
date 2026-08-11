import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';

// Cart Questions 2 & 3 continue one authenticated session, so login only happens once per worker.
export const test = base.extend<
  { loginPage: LoginPage; homePage: HomePage; cartPage: CartPage },
  { sharedPage: Page }
>({
  sharedPage: [async ({ browser }, use) => {
    const page = await browser.newPage();
    await use(page);
    await page.close();
  }, { scope: 'worker' }],
  loginPage: async ({ sharedPage }, use) => {
    await use(new LoginPage(sharedPage));
  },
  homePage: async ({ sharedPage }, use) => {
    await use(new HomePage(sharedPage));
  },
  cartPage: async ({ sharedPage }, use) => {
    await use(new CartPage(sharedPage));
  },
});
