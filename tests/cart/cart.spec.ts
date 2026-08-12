import { test } from '../../fixtures/cart.fixture';
import receiverData from '../../test-data/receiverData.json';

const ADMIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? '';

test.describe('Cart', () => {
  test.beforeEach(async ({ loginPage, cartPage, homePage }) => {
    test.skip(!ADMIN_USERNAME || !ADMIN_PASSWORD, 'Missing admin credentials for cart flow tests.');

    await loginPage.navigateTo();
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    await cartPage.navigateTo();
    await cartPage.clearCart();
    await homePage.navigateTo();
  });

  test('Question 2: Add a single product to cart', async ({ homePage, cartPage }) => {
    // Step 1: Add the first product from the home page
    const productName = await homePage.addFirstProduct();
    // Step 2: Open the cart and verify the product quantity is 1
    await homePage.openCart();
    await cartPage.assertProductInCart(productName, '1');
  });

  test('Question 3: Add same product twice, ensure the quantity increments correctly', async ({ homePage, cartPage }) => {
    const productName = await homePage.addFirstProduct();
    // Step 1: Add the same product again from the home page
    await homePage.navigateTo();
    await homePage.addProduct(productName);
    // Step 2: Open the cart and verify the quantity increments to 2
    await homePage.openCart();
    await cartPage.assertProductInCart(productName, '2');
  });

  test('Question 4a: Remove a single item from the cart', async ({ homePage, cartPage }) => {
    const singleProduct = await homePage.addFirstProduct();
    // Step 1: Open cart and verify the product is present
    await homePage.openCart();
    await cartPage.assertProductInCart(singleProduct, '1');
    // Step 2: Remove the product
    await cartPage.removeProduct(singleProduct);
    // Step 3: Verify the product is removed and the cart is empty
    await cartPage.assertProductNotInCart(singleProduct);
    await cartPage.assertCartEmpty();
  });

  test('Question 4b: Remove multiple items from the cart', async ({ homePage, cartPage }) => {
    const firstProduct = await homePage.addNthProduct(0);
    const secondProduct = await homePage.addNthProduct(1);
    // Step 1: Open cart and verify both products are present
    await homePage.openCart();
    await cartPage.assertProductInCart(firstProduct, '1');
    await cartPage.assertProductInCart(secondProduct, '1');
    // Step 2: Remove the first product
    await cartPage.removeProduct(firstProduct);
    // Step 3: Verify the first product is removed while the second remains
    await cartPage.assertProductNotInCart(firstProduct);
    await cartPage.assertProductInCart(secondProduct, '1');
    // Step 4: Remove the second product
    await cartPage.removeProduct(secondProduct);
    // Step 5: Verify the cart is now empty
    await cartPage.assertProductNotInCart(secondProduct);
    await cartPage.assertCartEmpty();
  });

  test('Question 5: Checkout succeeds with valid receiver info (COD)', async ({ homePage, cartPage, checkoutPage }) => {
    await homePage.addFirstProduct();
    // Step 1: Open cart and proceed to checkout
    await homePage.openCart();
    await cartPage.proceedToCheckout();
    // Step 2: Fill in valid receiver information
    await checkoutPage.fillReceiverInfo(receiverData.receiverName, receiverData.receiverPhone, receiverData.receiverAddress);
    // Step 3: Select Cash on Delivery (COD) payment method
    await checkoutPage.selectCod();
    // Step 4: Place the order
    await checkoutPage.placeOrder();
    // Step 5: Verify checkout succeeded and receiver info is reflected
    await checkoutPage.assertCheckoutSuccess(receiverData.receiverName);
  });
});