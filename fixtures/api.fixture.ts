import { test as base } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { UserApi } from '../api/UserApi';

export const test = base.extend<{ apiClient: ApiClient; userApi: UserApi }>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  userApi: async ({ apiClient }, use) => {
    await use(new UserApi(apiClient));
  },
});