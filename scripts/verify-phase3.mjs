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
  await runCheck('desktop secondary navigation', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 schools are selected').waitFor()

    await page.getByRole('button', { name: 'Resources' }).click()
    await page.getByRole('menuitem').filter({ hasText: 'MOE P1 registration' }).waitFor()
    await page.keyboard.press('Escape')

    await page.getByRole('button', { name: 'About' }).click()
    const dialog = page.getByRole('dialog', { name: 'Plan with past registration data' })
    await dialog.waitFor()
    await dialog.getByRole('button', { name: 'Close', exact: true }).click()
    await dialog.waitFor({ state: 'hidden' })
  })

  await runCheck('mobile navigation and about', { width: 390, height: 844 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 schools are selected').waitFor()

    await page.getByRole('button', { name: 'Open navigation' }).click()
    const mobileDialog = page.getByRole('dialog')
    await mobileDialog.getByRole('link', { name: 'School research' }).waitFor()
    await mobileDialog.getByRole('button', { name: 'About this tool' }).click()

    const aboutDialog = page.getByRole('dialog', { name: 'Plan with past registration data' })
    await aboutDialog.waitFor()
    await aboutDialog.getByRole('button', { name: 'Close', exact: true }).click()
    await aboutDialog.waitFor({ state: 'hidden' })
  })

  await runCheck('route metadata', { width: 1024, height: 768 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText('178 schools are selected').waitFor()

    const homeMetadata = await page.evaluate(() => ({
      title: document.title,
      lang: document.documentElement.lang,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    }))

    if (!homeMetadata.title.includes('Primary 1 school ballot history')) {
      throw new Error(`Unexpected home title: ${homeMetadata.title}`)
    }
    if (homeMetadata.lang !== 'en-SG') {
      throw new Error(`Unexpected document language: ${homeMetadata.lang}`)
    }
    if (homeMetadata.canonical !== 'https://sgp1.ichaoran.com/') {
      throw new Error(`Unexpected canonical URL: ${homeMetadata.canonical}`)
    }
    if (!homeMetadata.description || !homeMetadata.ogImage?.startsWith('https://')) {
      throw new Error('Missing description or absolute Open Graph image')
    }

    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('Ballot Odds By Year').waitFor()
    await page.waitForFunction(() => document.title.includes('Ai Tong School'))

    const detailCanonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    if (detailCanonical !== 'https://sgp1.ichaoran.com/schools/ai_tong') {
      throw new Error(`Unexpected detail canonical URL: ${detailCanonical}`)
    }
  })
} finally {
  await browser.close()
}

await mkdir(new URL('../docs/phase-3/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../docs/phase-3/interaction-results.json', import.meta.url),
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
  console.log(`Passed ${results.length} Phase 3 interaction checks.`)
}
