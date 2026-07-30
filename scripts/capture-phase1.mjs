import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const capturePhase = process.env.SGP1_CAPTURE_PHASE || 'phase-1'
const outputDir = new URL(`../docs/${capturePhase}/screenshots/`, import.meta.url)

const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet-768', width: 768, height: 1024 },
  { name: 'desktop-1024', width: 1024, height: 768 },
  { name: 'desktop-1440', width: 1440, height: 1024 },
]

const routes = [
  {
    name: 'school-list',
    path: '/',
    readyText: ['phase-4', 'phase-5'].includes(capturePhase) ? 'matching schools' : 'schools are selected',
  },
  {
    name: 'school-detail-ai-tong',
    path: '/schools/ai_tong',
    readyText: capturePhase === 'phase-5'
      ? 'Review results by year and phase'
      : 'Ballot Odds By Year',
  },
]

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const results = []

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      colorScheme: 'light',
      reducedMotion: 'reduce',
      serviceWorkers: 'block',
    })

    for (const route of routes) {
      const page = await context.newPage()
      const consoleErrors = []
      const pageErrors = []

      page.on('console', (message) => {
        if (message.type() === 'error') {
          consoleErrors.push(message.text())
        }
      })
      page.on('pageerror', error => pageErrors.push(error.message))

      await page.goto(`${baseUrl}${route.path}`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      })

      await page.getByText(route.readyText, { exact: false }).first().waitFor({
        state: 'visible',
        timeout: 20_000,
      })

      await page.waitForTimeout(1_500)

      const metrics = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        documentHeight: document.documentElement.scrollHeight,
        viewportHeight: document.documentElement.clientHeight,
        horizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
        title: document.title,
      }))

      const filename = `${route.name}-${viewport.name}.png`
      await page.screenshot({
        path: fileURLToPath(new URL(filename, outputDir)),
        fullPage: false,
        animations: 'disabled',
      })

      results.push({
        route: route.path,
        viewport,
        screenshot: `screenshots/${filename}`,
        metrics,
        consoleErrors,
        pageErrors,
      })

      await page.close()
    }

    await context.close()
  }
} finally {
  await browser.close()
}

await writeFile(
  new URL('../capture-results.json', outputDir),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
)

console.log(`Captured ${results.length} screenshots in docs/${capturePhase}/screenshots.`)
