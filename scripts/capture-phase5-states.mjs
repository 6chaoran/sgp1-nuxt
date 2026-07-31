import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const outputDir = new URL('../docs/phase-5/states/', import.meta.url)
const browser = await chromium.launch({ headless: true })
const results = []

await mkdir(outputDir, { recursive: true })

const captureState = async ({ name, viewport, path, prepare }) => {
  const context = await browser.newContext({
    viewport,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
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
    await page.waitForTimeout(500)
    await prepare(page)
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
    name: 'desktop-history-table',
    viewport: { width: 1440, height: 1024 },
    path: '/schools/ai_tong',
    prepare: async (page) => {
      await page.getByText('2025 registration results').scrollIntoViewIfNeeded()
    },
  })

  await captureState({
    name: 'desktop-trend-chart',
    viewport: { width: 1440, height: 1024 },
    path: '/schools/ai_tong',
    prepare: async (page) => {
      await page.getByRole('heading', { name: 'Historical allocation-rate trend' }).scrollIntoViewIfNeeded()
      await page.locator('canvas').waitFor()
    },
  })

  await captureState({
    name: 'desktop-chart-hover',
    viewport: { width: 1440, height: 1024 },
    path: '/schools/ai_tong',
    prepare: async (page) => {
      const chart = page.locator('canvas')
      await chart.scrollIntoViewIfNeeded()
      await chart.waitFor()
      const box = await chart.boundingBox()
      if (!box) {
        throw new Error('Historical chart is not visible')
      }
      await page.mouse.move(
        box.x + 48 + ((box.width - 68) * 12 / 16),
        box.y + 120,
      )
    },
  })

  await captureState({
    name: 'desktop-phase-filtered',
    viewport: { width: 1440, height: 1024 },
    path: '/schools/ai_tong?year=2024&phase=2C',
    prepare: async (page) => {
      await page.getByText('2024 registration results').scrollIntoViewIfNeeded()
    },
  })

  await captureState({
    name: 'mobile-history-card',
    viewport: { width: 390, height: 844 },
    path: '/schools/ai_tong?phase=2C',
    prepare: async (page) => {
      await page.getByText('2025 registration results').scrollIntoViewIfNeeded()
    },
  })

  await captureState({
    name: 'mobile-explanations',
    viewport: { width: 390, height: 844 },
    path: '/schools/ai_tong?phase=2C',
    prepare: async (page) => {
      await page.getByText('Admission phases and ballot notation').click()
      await page.getByText(/Phase 1 covers children with a sibling/).scrollIntoViewIfNeeded()
    },
  })

  await captureState({
    name: 'mobile-missing-school',
    viewport: { width: 390, height: 844 },
    path: '/schools/not_a_real_school',
    prepare: async (page) => {
      await page.getByText('School record not found').waitFor()
    },
  })
} finally {
  await browser.close()
}

await writeFile(
  new URL('../state-capture-results.json', outputDir),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
)

console.log(`Captured ${results.length} Phase 5 UI states.`)
