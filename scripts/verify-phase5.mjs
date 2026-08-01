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
  await runCheck('latest year, profile summary, and chart', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: 'Ai Tong School', level: 1 }).waitFor()
    await page.waitForTimeout(350)
    await page.getByText('2025 registration results').waitFor()
    if (await page.getByLabel('Registration year').inputValue() !== '2025') {
      throw new Error('Newest available registration year was not selected')
    }
    await page.getByRole('img', { name: /Historical allocation rates/ }).waitFor()
    await page.locator('canvas').waitFor()
    await page.getByRole('link', { name: 'Open map' }).waitFor()
    await page.getByRole('link', { name: 'School website' }).waitFor()
  })

  await runCheck('year and phase URL state', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('2025 registration results').waitFor()
    await page.waitForTimeout(350)
    await page.getByLabel('Registration year').selectOption('2024')
    await page.waitForURL(url => url.searchParams.get('year') === '2024')
    await page.getByText('2024 registration results').waitFor()

    await page.getByLabel('Show admission phase').selectOption('2C')
    await page.waitForURL(url => url.searchParams.get('phase') === '2C')
    await page.getByRole('rowheader', { name: 'Phase 2C' }).waitFor()
    await page.getByText('All recorded phases').waitFor({ state: 'hidden' })

    await page.reload({ waitUntil: 'domcontentloaded' })
    await page.getByText('2024 registration results').waitFor()
    if (await page.getByLabel('Show admission phase').inputValue() !== '2C') {
      throw new Error('Phase selection was not restored from the URL')
    }
  })

  await runCheck('mobile cards and explanatory content', { width: 390, height: 844 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong?phase=2C`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: 'Ai Tong School', level: 1 }).waitFor()
    await page.waitForTimeout(350)
    const schoolDetailsToggle = page.getByRole('button', { name: 'Location and school links' })
    await schoolDetailsToggle.waitFor()
    if (await page.getByRole('link', { name: 'Open map' }).isVisible()) {
      throw new Error('School location details should start collapsed on mobile')
    }
    await schoolDetailsToggle.click()
    await page.getByRole('link', { name: 'Open map' }).waitFor()
    await page.getByText('Historical rate', { exact: true }).first().waitFor()
    await page.getByText('Vacancy', { exact: true }).last().waitFor()
    const definitionsToggle = page.getByRole('button', { name: 'How to read these results' })
    if (await definitionsToggle.getAttribute('aria-expanded') !== 'false') {
      throw new Error('Result definitions should start collapsed on mobile')
    }
    await definitionsToggle.click()
    await page.getByText('Admission phases and ballot notation').click()
    await page.getByText(/For children who have a sibling studying/).waitFor()
    const overflow = await page.evaluate(() => (
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    ))
    if (overflow) {
      throw new Error('Mobile school history has horizontal overflow')
    }
  })

  await runCheck('review information remains secondary and accessible', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('Google reviews', { exact: true }).waitFor()
    await page.waitForTimeout(350)
    await page.getByRole('button', { name: /31 reviews/ }).click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('heading', { name: 'Google Maps reviews' }).waitFor()
    await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    await dialog.waitFor({ state: 'hidden' })
  })

  await runCheck('missing school state', { width: 390, height: 844 }, async (page) => {
    await page.goto(`${baseUrl}/schools/not_a_real_school`, { waitUntil: 'domcontentloaded' })
    await page.getByText('School record not found').waitFor()
    await page.getByRole('link', { name: 'Back to school research' }).waitFor()
  })
} finally {
  await browser.close()
}

await mkdir(new URL('../docs/phase-5/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../docs/phase-5/interaction-results.json', import.meta.url),
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
  console.log(`Passed ${results.length} Phase 5 interaction checks.`)
}
