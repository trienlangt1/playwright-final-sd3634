import { test } from '../../fixtures/test.fixture';

test.describe('Login Page', () => {
  // Question 1: Login fails when username/password are blank
  test('Login fails when username and password are blank', async ({ loginPage }) => {
    // Step 1: Navigate to login page
    await loginPage.navigateTo();
    // Step 2: Attempt login with blank credentials
    await loginPage.login('', '');
    // Step 3: Verify login was unsuccessful
    await loginPage.assertLoginFailed();
  });
});

