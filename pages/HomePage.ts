import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly cartButton: Locator;
  readonly productHeadings: Locator;

  constructor(private page: Page) {
    this.cartButton = page.getByRole('button', { name: /^🛒/ });
    this.productHeadings = page.getByRole('heading', { level: 3 });
  }

  async navigateTo() {
    await this.page.goto('https://shopdemo-e3gwg9hqaygghmbv.canadacentral-01.azurewebsites.net/home');
  }

  addToCartButton(productName: string): Locator {
    return this.page
      .getByRole('heading', { name: productName, exact: true })
      .locator('..')
      .getByRole('button', { name: /🛒/ });
  }

  async addFirstProduct(): Promise<string> {
    const firstProduct = this.productHeadings.first();
    const productName = (await firstProduct.textContent())?.trim() ?? '';
    await this.addToCartButton(productName).click();
    return productName;
  }

  async openCart() {
    await this.cartButton.click();
  }
}
