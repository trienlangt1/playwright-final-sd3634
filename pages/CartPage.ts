import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly removeButtons: Locator;

  constructor(private page: Page) {
    this.removeButtons = page.getByRole('button', { name: '✕' });
  }

  async navigateTo() {
    await this.page.goto('https://shopdemo-e3gwg9hqaygghmbv.canadacentral-01.azurewebsites.net/cart');
  }

  productHeading(productName: string): Locator {
    return this.page.getByRole('heading', { name: productName, exact: true });
  }

  quantity(productName: string): Locator {
    return this.productHeading(productName)
      .locator('..')
      .locator('..')
      .locator('button:has-text("−") + *');
  }

  // Site persists cart items per account, so tests must start from an empty cart.
  async clearCart() {
    while (await this.removeButtons.count() > 0) {
      await this.removeButtons.first().click();
    }
  }

  async assertProductInCart(productName: string, expectedQuantity: string) {
    await expect(this.productHeading(productName)).toBeVisible();
    await expect(this.quantity(productName)).toHaveText(expectedQuantity);
  }
}
