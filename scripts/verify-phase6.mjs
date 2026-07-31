import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const browser = await chromium.launch({ headless: true })
const results = []

const runCheck = async (name, viewport, check, contextOptions = {}) => {
  const context = await browser.newContext({
    viewport,
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
    ...contextOptions,
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10_000)
  const consoleErrors = []
  const pageErrors = []

  page.on('console', (message) => {
    if (
      message.type() === 'error'
      && !message.text().includes('/__missing-phase6-logo__.png')
    ) {
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

const assertNoOverflow = async (page, label) => {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  if (dimensions.scrollWidth > dimensions.clientWidth) {
    throw new Error(`${label} has horizontal overflow: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`)
  }
}

const assertAccessibleStructure = async (page) => {
  const audit = await page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element)
      const rect = element.getBoundingClientRect()
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && rect.width > 0
        && rect.height > 0
    }
    const nameFor = (element) => (
      element.getAttribute('aria-label')
      || element.getAttribute('title')
      || element.textContent?.trim()
      || element.getAttribute('placeholder')
      || ''
    ).replace(/\s+/g, ' ').trim()
    const interactives = [...document.querySelectorAll(
      'a[href],button,input,select,textarea,summary,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])',
    )].filter(visible)
    const unnamed = interactives.filter(element => !nameFor(element))
    const undersized = interactives.filter((element) => {
      if (element instanceof HTMLInputElement && element.closest('label')) {
        const labelRect = element.closest('label').getBoundingClientRect()
        return labelRect.width < 44 || labelRect.height < 44
      }
      const rect = element.getBoundingClientRect()
      return rect.width < 44 || rect.height < 44
    })
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(visible)
      .map(element => Number(element.tagName.slice(1)))
    return {
      unnamed: unnamed.map(element => element.outerHTML.slice(0, 160)),
      undersized: undersized.map(element => ({
        name: nameFor(element).slice(0, 80),
        rect: element.getBoundingClientRect().toJSON(),
      })),
      headings,
    }
  })

  if (audit.unnamed.length > 0) {
    throw new Error(`Unnamed controls found: ${JSON.stringify(audit.unnamed)}`)
  }
  if (audit.undersized.length > 0) {
    throw new Error(`Controls below 44px found: ${JSON.stringify(audit.undersized)}`)
  }
  for (let index = 1; index < audit.headings.length; index += 1) {
    if (audit.headings[index] > audit.headings[index - 1] + 1) {
      throw new Error(`Heading level skips from h${audit.headings[index - 1]} to h${audit.headings[index]}`)
    }
  }
}

try {
  await runCheck('semantic structure, skip link, focus, and keyboard-removable filters', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/?area=Bishan`, { waitUntil: 'domcontentloaded' })
    await page.getByRole('heading', { name: 'Plan with past registration data' }).waitFor()
    await page.getByRole('status').filter({ hasText: /matching schools/ }).waitFor()
    await page.waitForTimeout(350)
    await assertAccessibleStructure(page)

    await page.keyboard.press('Tab')
    const skipHref = await page.evaluate(() => document.activeElement?.getAttribute('href'))
    if (skipHref !== '#main-content') {
      throw new Error('Skip link is not the first keyboard target')
    }
    await page.keyboard.press('Enter')
    const mainFocused = await page.evaluate(() => document.activeElement?.id === 'main-content')
    if (!mainFocused) {
      throw new Error('Skip link did not move focus to the main content')
    }

    const areaChip = page.getByRole('button', { name: 'Remove Area: Bishan' })
    await areaChip.focus()
    await areaChip.press('Enter')
    await areaChip.waitFor({ state: 'hidden' })
    await page.waitForURL(url => !url.searchParams.has('area'))
    if (new URL(page.url()).searchParams.has('area')) {
      throw new Error('Keyboard chip removal did not update the filter URL')
    }
  })

  await runCheck('mobile navigation and filter dialogs restore keyboard focus', { width: 390, height: 844 }, async (page) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    await page.getByText(/matching schools/).waitFor()
    await page.waitForTimeout(350)

    const navigationButton = page.getByRole('button', { name: 'Open navigation' })
    await navigationButton.click()
    const navigationDialog = page.getByRole('dialog')
    await page.getByRole('button', { name: 'Close navigation' }).waitFor()
    await page.keyboard.press('Escape')
    await navigationDialog.waitFor({ state: 'hidden' })
    await page.waitForTimeout(100)
    if (!await navigationButton.evaluate(element => element === document.activeElement)) {
      throw new Error('Mobile navigation did not restore focus to its trigger')
    }

    const filtersButton = page.getByRole('button', { name: /^Filters/ })
    await filtersButton.click()
    const dialog = page.getByRole('dialog')
    await dialog.getByRole('heading', { name: 'Filter schools' }).waitFor()
    await dialog.getByRole('checkbox', { name: 'GEP' }).check()
    await dialog.getByRole('button', { name: /Show \d+ schools/ }).click()
    await page.getByRole('button', { name: 'Remove GEP' }).waitFor()
    await assertNoOverflow(page, 'Mobile discovery')
  })

  await runCheck('history controls, chart alternative, missing values, and reduced motion', { width: 1440, height: 1024 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('2025 registration results').waitFor()
    await page.waitForTimeout(350)
    await assertAccessibleStructure(page)

    const year = page.getByLabel('Registration year')
    await year.focus()
    await page.keyboard.press('Tab')
    await year.selectOption('2024')
    await page.waitForTimeout(500)
    if (new URL(page.url()).searchParams.get('year') !== '2024') {
      throw new Error('Keyboard-reachable year selection did not update the URL')
    }
    await page.getByText('2024 registration results').waitFor()

    const chartTable = page.getByText('View chart data as a table')
    await chartTable.focus()
    await page.keyboard.press('Enter')
    await page.getByRole('table').last().waitFor()
    await page.getByRole('img', { name: /Historical allocation rates/ }).waitFor()

    await page.getByLabel('Registration year').selectOption('2025')
    await page.getByText('N/A', { exact: true }).first().waitFor()

    const transitionDuration = await page.getByRole('link', { name: 'School research' }).first().evaluate(
      element => getComputedStyle(element).transitionDuration,
    )
    const longestTransition = Math.max(
      ...transitionDuration.split(',').map(value => Number.parseFloat(value)),
    )
    if (longestTransition > 0.001) {
      throw new Error(`Reduced-motion transition was not minimized: ${transitionDuration}`)
    }
  })

  await runCheck('review dialog is trapped, closable, and restores focus', { width: 390, height: 844 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    const trigger = page.getByRole('button', { name: /31 reviews/ })
    await trigger.waitFor()
    await page.waitForTimeout(350)
    await trigger.click()

    const dialog = page.getByRole('dialog')
    await dialog.getByRole('heading', { name: 'Google Maps reviews' }).waitFor()
    await page.waitForTimeout(350)
    const closeButton = dialog.getByRole('button', { name: 'Close reviews' })
    const closeBox = await closeButton.boundingBox()
    if (!closeBox || closeBox.width < 44 || closeBox.height < 44) {
      throw new Error('Review-dialog close control is not a 44px visible target')
    }
    const activeInside = await page.evaluate(() => Boolean(document.activeElement?.closest('[role="dialog"]')))
    if (!activeInside) {
      throw new Error('Review dialog did not move focus inside')
    }

    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'hidden' })
    await page.waitForTimeout(100)
    if (!await trigger.evaluate(element => element === document.activeElement)) {
      throw new Error('Review dialog did not restore focus to its trigger')
    }
  })

  await runCheck('200 percent reflow, 320px long names, and logo fallback', { width: 720, height: 900 }, async (page) => {
    await page.goto(`${baseUrl}/schools/ai_tong`, { waitUntil: 'domcontentloaded' })
    await page.getByText('2025 registration results').waitFor()
    await assertNoOverflow(page, 'Equivalent 200% detail reflow')

    await page.setViewportSize({ width: 320, height: 800 })
    await page.getByRole('link', { name: 'SGP1 school research home' }).click()
    await page.getByRole('searchbox', { name: 'Search schools' }).fill('CHIJ St. Nicholas')
    const longName = page.getByRole('heading', { name: /CHIJ St\. Nicholas Girls' School/ })
    await longName.waitFor()
    await assertNoOverflow(page, '320px long-name result')

    const resultLink = longName.locator('xpath=ancestor::a[1]')
    const schoolLogo = resultLink.locator('img[alt$=" logo"]')
    await schoolLogo.evaluate((element) => {
      element.src = '/__missing-phase6-logo__.png'
    })
    await resultLink.getByRole('img', { name: /logo unavailable/ }).waitFor()
  })

  await runCheck('live results, empty state, and denied location recovery', { width: 390, height: 844 }, async (page, context) => {
    await context.clearPermissions()
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })
    const status = page.getByRole('status').filter({ hasText: /matching schools/ })
    await status.waitFor()
    await page.waitForTimeout(350)
    const search = page.getByRole('searchbox', { name: 'Search schools' })
    await search.fill('no school can match this exact value')
    await page.getByText('No schools match these filters').waitFor()
    await page.getByRole('button', { name: 'Reset search and filters' }).click()
    await page.getByText(/matching schools/).waitFor()

    await page.getByRole('button', { name: /^Filters/ }).click()
    await page.getByRole('button', { name: 'Allow location access' }).click()
    await page.getByText('Location permission was denied').last().waitFor()
    await page.keyboard.press('Escape')
    await page.getByRole('button', { name: 'Try location again' }).waitFor()
  })
} finally {
  await browser.close()
}

await mkdir(new URL('../docs/phase-6/', import.meta.url), { recursive: true })
await writeFile(
  new URL('../docs/phase-6/interaction-results.json', import.meta.url),
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
  console.log(`Passed ${results.length} Phase 6 accessibility checks.`)
}
