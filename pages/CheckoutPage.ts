import { Page, Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly pageHeading: Locator;
  readonly backToCartButton: Locator;
  readonly recipientHeading: Locator;
  readonly fullNameInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly paymentMethodHeading: Locator;
  readonly codOption: Locator;
  readonly stripeOption: Locator;
  readonly orderSummaryHeading: Locator;
  readonly totalLabel: Locator;
  readonly placeOrderButton: Locator;
  readonly successHeading: Locator;

  constructor(private page: Page) {
    this.pageHeading = page.getByRole('heading', { name: 'Thanh toán', exact: true });
    this.backToCartButton = page.getByRole('button', { name: '← Quay lại giỏ hàng' });
    this.recipientHeading = page.getByRole('heading', { name: 'Thông tin người nhận', exact: true });
    this.fullNameInput = page.getByRole('textbox', { name: 'Họ và tên' });
    this.phoneInput = page.getByRole('textbox', { name: 'Số điện thoại' });
    this.addressInput = page.getByRole('textbox', { name: 'Địa chỉ nhận hàng' });
    this.paymentMethodHeading = page.getByRole('heading', { name: 'Phương thức thanh toán', exact: true });
    this.codOption = page.getByText('Thanh toán khi nhận hàng (COD)');
    this.stripeOption = page.getByText('Thanh toán bằng thẻ (Stripe)');
    this.orderSummaryHeading = page.getByRole('heading', { name: 'Đơn hàng của bạn', exact: true });
    this.totalLabel = page.getByText('Tổng cộng');
    this.placeOrderButton = page.getByRole('button', { name: /Đặt hàng .*đ/i });
    this.successHeading = page.getByTestId('checkout-success-heading');
  }

  async assertPageLoaded() {
    await expect(this.pageHeading).toBeVisible();
    await expect(this.recipientHeading).toBeVisible();
  }

  async fillReceiverInfo(fullName: string, phone: string, address: string) {
    await this.fullNameInput.fill(fullName);
    await this.phoneInput.fill(phone);
    await this.addressInput.fill(address);
  }

  async selectCodPayment() {
    await this.codOption.click();
  }

  async placeOrder() {
    await this.placeOrderButton.click();
  }

  async assertCheckoutSuccess(fullName: string) {
    await expect(this.successHeading).toBeVisible();
    await expect(this.successHeading).toHaveText('Đặt hàng thành công!');
    await expect(this.page.getByText(`Người nhận: ${fullName}`)).toBeVisible();
  }
}