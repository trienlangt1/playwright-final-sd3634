import { expect } from '@playwright/test';
import { test } from '../../fixtures/all.fixture';
import accountData from '../../test-data/accountAPIData.json';

const ADMIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? '';

test.describe('Account', () => {
  let token: string;
  let originalName: string;

  test.beforeEach(async ({ userApi }) => {
    test.skip(!ADMIN_USERNAME || !ADMIN_PASSWORD, 'Missing admin credentials for account API tests.');

    // Log in via the API and capture the original name so it can be restored afterwards
    const loginResult = await userApi.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    token = loginResult.token;
    originalName = loginResult.user.name;
  });

  test.afterEach(async ({ userApi }) => {
    // Clean up: always restore the original full name via the API, regardless of test outcome
    if (token && originalName) {
      await userApi.updateProfileName(token, originalName);
    }
  });

  test('Question 6: Update Full Name, then clean up via the API', async ({ userApi }) => {
    // Step 1: Update the full name via the API
    const updatedProfile = await userApi.updateProfileName(token, accountData.updatedName);
    // Step 2: Verify the API response reflects the updated name
    expect(updatedProfile.name).toBe(accountData.updatedName);
    // Step 3: Verify the change persisted by fetching the profile again
    const fetchedProfile = await userApi.getProfile(token);
    expect(fetchedProfile.name).toBe(accountData.updatedName);
  });
});