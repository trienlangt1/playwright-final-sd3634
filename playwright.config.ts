import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://nodejs.org/api/process.html#processloadenvfilepath
 */
try {
  process.loadEnvFile('.env');
} catch {
  // .env not present (e.g. CI supplies env vars directly)
}


/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry so a transient failure against the live remote site gets one automatic re-run */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  // Tests share one live demo account/backend, so runs must not overlap.
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Give assertions more slack against the live remote site before failing */
  expect: {
    timeout: 10000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://testing.platformforge.dev',


    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Run headed with slowMo locally for debugging; run headless/full-speed in CI. */
    headless: !!process.env.CI,
    launchOptions: {
      slowMo: process.env.CI ? 0 : 800,
    },
  },

  /* Configure projects for major browsers */
  projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
