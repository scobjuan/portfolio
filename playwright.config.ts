import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /(nav|header)\.spec\.ts/ },
  ],
  webServer: {
    // CI tests the production build; locally the dev server is faster.
    command: isCI ? 'pnpm build-only && pnpm preview' : 'pnpm dev',
    port: isCI ? 4173 : 5173,
    reuseExistingServer: !isCI,
  },
})
