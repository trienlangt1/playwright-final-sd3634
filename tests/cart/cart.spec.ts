import { test } from '../../fixtures/cart.fixture';

const ADMIN_USERNAME = process.env.ADMIN_LOGIN_USERNAME ?? '';
const ADMIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD ?? '';

test.describe.configure({ mode: 'serial' });

test.describe('Cart', () => {
  let productName: string;

  // Question 2: Add a single product to cart
  test('Verify that the user can successfully add a single product to cart', async ({ loginPage, homePage, cartPage }) => {
    // Precondition: login with admin credentials
    await loginPage.navigateTo();
    await loginPage.login(ADMIN_USERNAME, ADMIN_PASSWORD);
    // Precondition: start from an empty cart (cart persists per account)
    await cartPage.navigateTo();
    await cartPage.clearCart();

    // Step 1: Open home page
    await homePage.navigateTo();
    // Step 2: Add first product
    productName = await homePage.addFirstProduct();
    // Step 3: Open cart
    await homePage.openCart();
    // Step 4: Verify quantity = 1
    // Step 5: Verify product is displayed
    await cartPage.assertProductInCart(productName, '1');
  });

  // Question 3: Add same product twice, ensure the quantity increments correctly
  test('Verify that the user can successfully add the same product twice and that its quantity increments correctly', async ({ homePage, cartPage }) => {
    // Continues the previous test's session: already logged in, product already in cart with quantity 1
    // Step 1: Add the same product again
    await homePage.navigateTo();
    await homePage.addProduct(productName);
    // Step 2: Open cart
    await homePage.openCart();
    // Step 3: Verify quantity incremented to 2 instead of creating a duplicate entry
    await cartPage.assertProductInCart(productName, '2');
  });

  // Question 4a: Remove a single item from the cart
  test('Verify that the user can successfully remove a single item from the cart', async ({ homePage, cartPage }) => {
    // Continues the shared session: already logged in from Question 2.
    // Setup: start from a known state — an empty cart with exactly one product.
    await cartPage.navigateTo();
    await cartPage.clearCart();
    await homePage.navigateTo();
    const singleProduct = await homePage.addFirstProduct();
 
    // Step 1: Open cart and verify the product is present
    await homePage.openCart();
    await cartPage.assertProductInCart(singleProduct, '1');
    // Step 2: Remove the product
    await cartPage.removeProduct(singleProduct);
    // Step 3: Verify the product is no longer in the cart and the cart is empty
    await cartPage.assertProductNotInCart(singleProduct);
    await cartPage.assertCartEmpty();
  });
 
  // Question 4b: Remove multiple items from the cart
  test('Verify that the user can successfully remove multiple items from the cart', async ({ homePage, cartPage }) => {
    // Continues the shared session: already logged in from Question 2.
    // Setup: start from a known state — an empty cart with two distinct products.
    await cartPage.navigateTo();
    await cartPage.clearCart();
    await homePage.navigateTo();
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
});
