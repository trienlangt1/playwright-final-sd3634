import { test as base } from '@playwright/test';
import type { Page, Browser } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

// Cart Questions 2, 3 & 5 continue one authenticated session, so login only happens once per worker.
export const test = base.extend<
  { loginPage: LoginPage; homePage: HomePage; cartPage: CartPage; checkoutPage: CheckoutPage },
  { sharedPage: Page }
>({
  sharedPage: [async ({ browser }: { browser: Browser }, use) => {
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
  checkoutPage: async ({ sharedPage }, use) => {
    await use(new CheckoutPage(sharedPage));
  },
});