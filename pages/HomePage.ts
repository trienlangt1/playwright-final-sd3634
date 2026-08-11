import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly cartButton: Locator;
  readonly productHeadings: Locator;

  constructor(private page: Page) {
    this.cartButton = page.getByRole('button', { name: /^🛒/ });
    this.productHeadings = page.getByRole('heading', { level: 3 });
  }

  async navigateTo() {
    await this.page.goto('/home');
  }

  addToCartButton(productName: string): Locator {
    return this.page
      .getByRole('heading', { name: productName, exact: true })
      .locator('..')
      .getByRole('button', { name: /🛒/ });
  }

  private async cartCount(): Promise<number> {
    const text = (await this.cartButton.textContent()) ?? '';
    return Number(text.match(/\d+/)?.[0] ?? 0);
  }

  async addFirstProduct(): Promise<string> {
    const firstProduct = this.productHeadings.first();
    const productName = (await firstProduct.textContent())?.trim() ?? '';
    await this.addProduct(productName);
    return productName;
  }

  async addNthProduct(index: number): Promise<string> {
    const product = this.productHeadings.nth(index);
    const productName = (await product.textContent())?.trim() ?? '';
    await this.addProduct(productName);
    return productName;
  }

  async addProduct(productName: string) {
    const countBefore = await this.cartCount();
    await this.addToCartButton(productName).click();
    // Confirm the add actually registered before moving on, instead of finding out later that the cart is empty.
    await expect(this.cartButton).toContainText(String(countBefore + 1));
  }

  async openCart() {
    await this.cartButton.click();
  }
}