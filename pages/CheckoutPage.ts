import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly backToCartButton: Locator;
  readonly pageHeading: Locator;
  readonly recipientHeading: Locator;
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly paymentMethodHeading: Locator;
  readonly codOption: Locator;
  readonly stripeOption: Locator;
  readonly placeOrderButton: Locator;
  readonly orderSummaryHeading: Locator;
  readonly totalText: Locator;
  readonly successHeading: Locator;

  constructor(private page: Page) {
    this.backToCartButton = page.getByRole('button', { name: '← Quay lại giỏ hàng' });
    this.pageHeading = page.getByRole('heading', { name: 'Thanh toán', exact: true });
    this.recipientHeading = page.getByRole('heading', { name: 'Thông tin người nhận', exact: true });
    this.fullNameInput = page.getByPlaceholder('Nguyễn Văn A');
    this.phoneInput = page.getByPlaceholder('0912 345 678');
    this.addressInput = page.getByPlaceholder('123 Đường ABC, Phường XYZ, TP. HCM');
    this.paymentMethodHeading = page.getByRole('heading', { name: 'Phương thức thanh toán', exact: true });
    this.codOption = page.getByText('Thanh toán khi nhận hàng (COD)');
    this.stripeOption = page.getByText('Thanh toán bằng thẻ (Stripe)');
    this.placeOrderButton = page.getByRole('button', { name: /Đặt hàng .*đ/i });
    this.orderSummaryHeading = page.getByRole('heading', { name: 'Đơn hàng của bạn', exact: true });
    this.totalText = page.getByText('Tổng cộng');
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
    await expect(this.successHeading).toHaveText('Đặt hàng thành công!');
    await expect(this.page.getByText(`Người nhận: ${receiverFullName}`)).toBeVisible();
  }
}