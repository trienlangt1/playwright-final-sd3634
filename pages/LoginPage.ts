import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(private page: Page) {
    this.usernameInput = page.getByTestId('login-username');
    this.passwordInput = page.getByTestId('login-password');
    this.submitButton = page.getByTestId('login-submit');
    this.errorMessage = page.getByRole('alert');
  }

  async navigateTo() {
    await this.page.goto('https://shopdemo-e3gwg9hqaygghmbv.canadacentral-01.azurewebsites.net/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async assertLoginFailed() {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText('Vui lòng nhập đầy đủ tài khoản và mật khẩu.');
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
