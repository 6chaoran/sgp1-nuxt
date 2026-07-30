import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const results = []
const browser = await chromium.launch({ headless: true })

const runCheck = async (name, viewport, check, contextOptions = {}) => {
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
    await check(page, context)
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
  await runCheck('search, empty state, and URL persistence', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 matching schools').waitFor()
    await page.waitForTimeout(350)

    const search = page.getByRole('searchbox', { name: 'Search schools' })
    await search.fill('Ai Tong')
    await page.getByText('1 matching school').waitFor()
    await page.waitForURL(url => url.searchParams.get('q') === 'Ai Tong')
    await page.getByRole('link', { name: /Ai Tong School/ }).waitFor()

    await search.fill('No such school in Singapore')
    await page.getByText('No schools match these filters').waitFor()

    await page.getByRole('button', { name: 'Reset search and filters' }).click()
    await page.getByText('178 matching schools').waitFor()
    await page.waitForURL(url => url.search === '')
  })

  await runCheck('desktop filters, GEP correctness, and sorting', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 matching schools').waitFor()
    await page.waitForTimeout(350)

    await page.getByRole('checkbox', { name: /^GEP\b/ }).check()
    await page.waitForURL(url => url.searchParams.get('gep') === '1')
    const filteredCount = Number((await page.getByText(/matching schools?$/).first().textContent())?.match(/\d+/)?.[0])
    if (!(filteredCount > 0 && filteredCount < 178)) {
      throw new Error(`Unexpected GEP result count: ${filteredCount}`)
    }
    await page.getByRole('button', { name: 'GEP' }).waitFor()

    await page.getByLabel('Sort results').last().selectOption('rate-desc')
    await page.waitForURL(url => url.searchParams.get('sort') === 'rate-desc')

    await page.getByRole('button', { name: 'Reset all' }).click()
    await page.getByText('178 matching schools').waitFor()
  })

  await runCheck('mobile filter sheet and route state', { width: 390, height: 844 }, async (page) => {
    await page.goto(`${baseUrl}/?q=Ai%20Tong&phase=2B&sap=1`, { waitUntil: 'domcontentloaded' })
    await page.getByText('1 matching school').waitFor()
    await page.waitForTimeout(350)
    await page.getByRole('searchbox', { name: 'Search schools' }).waitFor()
    if (await page.getByRole('searchbox', { name: 'Search schools' }).inputValue() !== 'Ai Tong') {
      throw new Error('Search query was not restored from the URL')
    }

    await page.getByRole('button', { name: /Filters/ }).click()
    const dialog = page.getByRole('dialog', { name: 'Filter schools' })
    await dialog.waitFor()
    await dialog.getByLabel('Area').selectOption('Bishan')
    await page.waitForURL(url => url.searchParams.get('area') === 'Bishan')
    await dialog.getByRole('button', { name: /Show \d+ schools?/ }).click()
    await dialog.waitFor({ state: 'hidden' })
  })

  await runCheck('location denied state', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 matching schools').waitFor()
    await page.waitForTimeout(350)
    await page.getByRole('button', { name: 'Allow location access' }).click()
    await page.getByText('Location permission was denied', { exact: true }).waitFor()
    await page.getByRole('button', { name: 'Try location again' }).waitFor()
  })

  await runCheck(
    'location enabled and distance sorting',
    { width: 1440, height: 1024 },
    async (page) => {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
      await page.getByText('178 matching schools').waitFor()
      await page.waitForTimeout(350)
      await page.getByRole('button', { name: 'Allow location access' }).click()
      await page.getByText('Distance sorting is available').waitFor()
      await page.waitForURL(url => url.searchParams.get('sort') === 'distance')
      await page.getByText(/km away/).first().waitFor()
    },
    {
      geolocation: { latitude: 1.3521, longitude: 103.8198 },
      permissions: ['geolocation'],
    },
  )
} finally {
  await browser.close()
}

await mkdir(new URL('../docs/phase-4/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../docs/phase-4/interaction-results.json', import.meta.url),
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
  console.log(`Passed ${results.length} Phase 4 interaction checks.`)
}
