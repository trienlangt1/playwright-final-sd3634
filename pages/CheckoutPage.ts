import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly codOption: Locator;
  readonly placeOrderButton: Locator;
  readonly successHeading: Locator;

  constructor(private page: Page) {
    this.fullNameInput = page.getByTestId('checkout-name');
    this.phoneInput = page.getByTestId('checkout-phone');
    this.addressInput = page.getByTestId('checkout-address');
    this.codOption = page.getByText(/\(?COD\)?/i);
    this.placeOrderButton = page.getByTestId('checkout-submit');
    this.successHeading = page.getByTestId('checkout-success-heading');
  }

  async fillReceiverInfo(fullName: string, phone: string, address: string) {
    await this.fullNameInput.fill(fullName);
    await this.phoneInput.fill(phone);
    await this.addressInput.fill(address);
  }

  async selectCod() {
    await this.codOption.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async assertCheckoutSuccess(receiverFullName: string) {
    await expect(this.successHeading).toBeVisible();
    await expect(this.successHeading).toHaveText(/(?:Đặt hàng thành công!|Order placed successfully!)/);
    await expect(this.page.getByText(`${receiverFullName}`)).toBeVisible();
  }
}