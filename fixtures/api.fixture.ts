import { test as base } from '@playwright/test';
import { ApiClient } from '../api/ApiClient';
import { UserApi } from '../api/UserApi';
import { ProductApi } from '../api/ProductApi';
import { OrderApi } from '../api/OrderApi';

export const test = base.extend<{
  apiClient: ApiClient;
  userApi: UserApi;
  productApi: ProductApi;
  orderApi: OrderApi;
}>({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  userApi: async ({ apiClient }, use) => {
    await use(new UserApi(apiClient));
  },
  productApi: async ({ apiClient }, use) => {
    await use(new ProductApi(apiClient));
  },
  orderApi: async ({ apiClient }, use) => {
    await use(new OrderApi(apiClient));
  },
});