import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const outputDir = new URL('../docs/phase-4/states/', import.meta.url)
const browser = await chromium.launch({ headless: true })
const results = []

await mkdir(outputDir, { recursive: true })

const captureState = async ({
  name,
  viewport,
  path = '/',
  contextOptions = {},
  prepare,
}) => {
  const context = await browser.newContext({
    viewport,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    ...contextOptions,
  })
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text())
    }
  })
  page.on('pageerror', error => pageErrors.push(error.message))

  try {
    await page.goto(`${baseUrl}${path}`, { waitUntil: 'domcontentloaded' })
    await page.getByText(/matching schools?$/).first().waitFor()
    await prepare?.(page)
    await page.waitForTimeout(350)

    const filename = `${name}.png`
    await page.screenshot({
      path: fileURLToPath(new URL(filename, outputDir)),
      animations: 'disabled',
    })
    results.push({ name, screenshot: `states/${filename}`, consoleErrors, pageErrors })
  } finally {
    await context.close()
  }
}

try {
  await captureState({
    name: 'desktop-filtered',
    viewport: { width: 1440, height: 1024 },
    path: '/?q=Ai%20Tong&phase=2B&sap=1',
  })

  await captureState({
    name: 'desktop-no-results',
    viewport: { width: 1440, height: 1024 },
    prepare: async (page) => {
      await page.getByRole('searchbox', { name: 'Search schools' }).fill('No such school in Singapore')
      await page.getByText('No schools match these filters').waitFor()
    },
  })

  await captureState({
    name: 'mobile-filter-sheet',
    viewport: { width: 390, height: 844 },
    prepare: async (page) => {
      await page.getByRole('button', { name: /Filters/ }).click()
      await page.getByRole('dialog', { name: 'Filter schools' }).waitFor()
    },
  })

  await captureState({
    name: 'desktop-location-ready',
    viewport: { width: 1440, height: 1024 },
    contextOptions: {
      geolocation: { latitude: 1.3521, longitude: 103.8198 },
      permissions: ['geolocation'],
    },
    prepare: async (page) => {
      await page.getByRole('button', { name: 'Allow location access' }).click()
      await page.getByText('Distance sorting is available').waitFor()
    },
  })
} finally {
  await browser.close()
}

await writeFile(
  new URL('../state-capture-results.json', outputDir),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
)

console.log(`Captured ${results.length} Phase 4 UI states.`)
