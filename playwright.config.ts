import { defineConfig, devices } from '@playwright/test';

try {
  process.loadEnvFile('.env');
} catch {
  // .env not present (e.g. CI supplies env vars directly)
}

export default defineConfig({
  testDir: './tests',
  timeout: 60000, // was: default 30000ms — safety margin against live remote site + CI runner variance

  fullyParallel: true,
  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 1, // reverted to prior values — keeps local trace generation available on failure

  workers: 1,

  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : 'html',

  expect: {
    timeout: 10000,
  },

  use: {
    baseURL: 'https://testing.platformforge.dev',
    trace: 'on-first-retry',
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