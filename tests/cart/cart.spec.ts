import { test } from '../../fixtures/test.fixture';

const ADMIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? '';

test.describe('Cart', () => {
  // Question 2: Add a single product to cart
  test('Add a single product to cart', async ({ loginPage, homePage, cartPage }) => {
    // Precondition: login with admin credentials
    await loginPage.navigateTo();
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    // Precondition: start from an empty cart (cart persists per account)
    await cartPage.navigateTo();
    await cartPage.clearCart();

    // Step 1: Open home page
    await homePage.navigateTo();
    // Step 2: Add first product
    const productName = await homePage.addFirstProduct();
    // Step 3: Open cart
    await homePage.openCart();
    // Step 4 & 5: Verify quantity = 1 and product is displayed
    await cartPage.assertProductInCart(productName, '1');
  });
});
