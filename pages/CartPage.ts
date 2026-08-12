import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;

  constructor(private page: Page) {
    this.removeButtons = page.getByRole('button', { name: '✕' });
    this.checkoutButton = page.getByRole('button', { name: 'Thanh toán ngay' });
  }

  async navigateTo() {
    await this.page.goto('/cart');
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

  removeButton(productName: string): Locator {
    return this.productHeading(productName)
      .locator('..')
      .locator('..')
      .getByRole('button', { name: '✕' });
  }

  // Site persists cart items per account, so tests must start from an empty cart.
  async clearCart() {
    let remaining = await this.removeButtons.count();
    while (remaining > 0) {
      await this.removeButtons.first().click();
      remaining -= 1;
      await expect(this.removeButtons).toHaveCount(remaining);
    }
  }

  async removeProduct(productName: string) {
    const countBefore = await this.removeButtons.count();
    await this.removeButton(productName).click();
    await expect(this.removeButtons).toHaveCount(countBefore - 1);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async assertProductInCart(productName: string, expectedQuantity: string) {
    await expect(this.productHeading(productName)).toBeVisible();
    await expect(this.quantity(productName)).toHaveText(expectedQuantity);
  }

  async assertProductNotInCart(productName: string) {
    await expect(this.productHeading(productName)).toHaveCount(0);
  }

  async assertCartEmpty() {
    await expect(this.removeButtons).toHaveCount(0);
  }
}