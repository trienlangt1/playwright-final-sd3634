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

  /* Retry once for transient failures against the live remote site. */
  retries: process.env.CI ? 1 : 0,

  /*
   * Tests share one live demo account/backend,
   * so runs must not overlap.
   */
  workers: 1,

  /* Reporter to use */
  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'html',

  /* Give assertions more slack against the live remote site */
  expect: {
    timeout: 10000,
  },

  /* Shared settings for all projects */
  use: {
    baseURL: 'https://testing.platformforge.dev',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Run headed locally with slowMo; headless/full-speed in CI */
    headless: !!process.env.CI,

    launchOptions: {
      slowMo: process.env.CI ? 0 : 800,
    },
  },

  projects: [
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});