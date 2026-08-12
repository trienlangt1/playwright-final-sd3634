import { expect } from '@playwright/test';
import { test } from '../../fixtures/all.fixture';
import receiverData from '../../test-data/receiverData.json';

const ADMIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? '';

test.describe('Orders', () => {
  let token: string;

  test.beforeEach(async ({ userApi }) => {
    test.skip(!ADMIN_USERNAME || !ADMIN_PASSWORD, 'Missing admin credentials for order API tests.');

    const loginResult = await userApi.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    token = loginResult.token;
  });

  test('Question 7: Verify Orders page (seed the order via API)', async ({ productApi, orderApi }) => {
    // Step 1: Fetch a real product to build a valid order payload
    const products = await productApi.getProducts(token);
    const product = products[0];
    const quantity = 1;

    // Step 2: Seed an order via the API using the fetched product and existing receiver test data
    const createdOrder = await orderApi.placeOrder(token, {
      items: [
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          emoji: product.emoji,
        },
      ],
      recipientName: receiverData.receiverName,
      recipientPhone: receiverData.receiverPhone,
      address: receiverData.receiverAddress,
      paymentMethod: 'cash',
      totalPrice: product.price * quantity,
    });

    // Step 3: Verify the order creation response reflects the seeded data
    expect(createdOrder.recipientName).toBe(receiverData.receiverName);
    expect(createdOrder.totalPrice).toBe(product.price * quantity);
    expect(createdOrder.status).toBe('confirmed');

    // Step 4: Verify the seeded order appears when listing orders
    const orderList = await orderApi.getOrders(token, { search: receiverData.receiverName });
    const foundOrder = orderList.orders.find((order) => order.id === createdOrder.id);
    expect(foundOrder).toBeDefined();
    expect(foundOrder?.totalPrice).toBe(product.price * quantity);
  });
});