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

  // Question 3: Add same product twice, ensure the quantity increments correctly
  test('Adding the same product twice increments its quantity', async ({ loginPage, homePage, cartPage }) => {
    // Precondition: login with admin credentials
    await loginPage.navigateTo();
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    // Precondition: start from an empty cart (cart persists per account)
    await cartPage.navigateTo();
    await cartPage.clearCart();

    // Step 1: Open home page
    await homePage.navigateTo();
    // Step 2: Add the same product twice
    const productName = await homePage.addFirstProduct();
    await homePage.addProduct(productName);
    // Step 3: Open cart
    await homePage.openCart();
    // Step 4: Verify quantity incremented to 2 instead of creating a duplicate entry
    await cartPage.assertProductInCart(productName, '2');
  });
});
