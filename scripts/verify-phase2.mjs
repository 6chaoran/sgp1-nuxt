import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const results = []
const browser = await chromium.launch({ headless: true })

const runCheck = async (name, viewport, check) => {
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
    await check(page)
    results.push({ name, status: 'passed', consoleErrors, pageErrors })
  } catch (error) {
    results.push({
      name,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      consoleErrors,
      pageErrors,
    })
  } finally {
    await context.close()
  }
}

try {
  await runCheck('school discovery controls', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 schools are selected').waitFor()

    await page.getByRole('button', { name: 'Show introduction' }).click()
    await page.getByText('I know, I know').waitFor({ state: 'visible' })

    const searchInput = page.getByPlaceholder('Type to search...')
    await searchInput.fill('Ai Tong')
    await page.locator('[role="option"]').filter({ hasText: 'Ai Tong School' }).click()
    await page.getByText('1 schools are selected').waitFor()
  })

  await runCheck('mobile navigation', { width: 390, height: 844 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 schools are selected').waitFor()

    await page.getByRole('button', { name: 'Open sidebar' }).click()
    const closeSidebar = page.getByRole('button', { name: 'Close sidebar' })
    await closeSidebar.waitFor({ state: 'visible' })
    await closeSidebar.click()
    await closeSidebar.waitFor({ state: 'hidden' })
  })

  await runCheck('review dialog', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('Ballot Odds By Year').waitFor()

    await page.getByRole('button', { name: /reviews/ }).click()
    const dialogTitle = page.getByText('Google Maps Review')
    await dialogTitle.waitFor({ state: 'visible' })
    await page.getByLabel('Google Maps Review').getByRole('button', { name: 'Close' }).click()
    await dialogTitle.waitFor({ state: 'hidden' })
  })
} finally {
  await browser.close()
}

await mkdir(new URL('../docs/phase-2/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../docs/phase-2/interaction-results.json', import.meta.url),
  `${JSON.stringify({ checkedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
)

const failed = results.filter(result =>
  result.status === 'failed'
  || result.consoleErrors.length > 0
  || result.pageErrors.length > 0,
)

if (failed.length > 0) {
  console.error(JSON.stringify(failed, null, 2))
  process.exitCode = 1
} else {
  console.log(`Passed ${results.length} Phase 2 interaction checks.`)
}
