import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.A11Y_BASE_URL || 'http://localhost:3120',
    trace: 'off',
  },
  projects: [
    {
      name: 'a11y-desktop',
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'a11y-mobile',
      use: { viewport: { width: 375, height: 812 } },
    },
  ],
});
