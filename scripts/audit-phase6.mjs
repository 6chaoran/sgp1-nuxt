import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const outputDir = new URL('../docs/phase-6/audit/', import.meta.url)
const browser = await chromium.launch({ headless: true })
const results = []

await mkdir(outputDir, { recursive: true })

const inspectPage = async (page) => page.evaluate(() => {
  const visible = (element) => {
    const style = getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return style.visibility !== 'hidden'
      && style.display !== 'none'
      && rect.width > 0
      && rect.height > 0
  }

  const interactiveSelector = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    'summary',
    '[role="button"]',
    '[role="link"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  const nameFor = (element) => (
    element.getAttribute('aria-label')
    || element.getAttribute('title')
    || element.textContent?.trim()
    || element.getAttribute('placeholder')
    || ''
  ).replace(/\s+/g, ' ').trim()

  const interactives = [...document.querySelectorAll(interactiveSelector)]
    .filter(visible)
    .map((element) => {
      const target = element instanceof HTMLInputElement && element.closest('label')
        ? element.closest('label')
        : element
      const rect = target.getBoundingClientRect()
      return {
        tag: element.tagName.toLowerCase(),
        role: element.getAttribute('role'),
        name: nameFor(element).slice(0, 100),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      }
    })

  return {
    title: document.title,
    headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(visible)
      .map(element => ({
        level: Number(element.tagName.slice(1)),
        text: element.textContent?.trim().replace(/\s+/g, ' '),
      })),
    unnamedInteractives: interactives.filter(item => !item.name),
    smallTargets: interactives.filter(item => item.width < 44 || item.height < 44),
    horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    liveRegions: [...document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')]
      .filter(visible)
      .map(element => ({
        role: element.getAttribute('role'),
        live: element.getAttribute('aria-live'),
        text: element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 160),
      })),
  }
})

const capture = async ({ name, path, viewport, prepare }) => {
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
    await page.waitForTimeout(700)
    if (prepare) {
      await prepare(page)
      await page.waitForTimeout(250)
    }
    const filename = `${name}.png`
    await page.screenshot({
      path: fileURLToPath(new URL(filename, outputDir)),
      fullPage: false,
      animations: 'disabled',
    })
    results.push({
      name,
      path,
      viewport,
      screenshot: `audit/${filename}`,
      audit: await inspectPage(page),
      consoleErrors,
      pageErrors,
    })
  } finally {
    await context.close()
  }
}

try {
  await capture({
    name: '01-discovery-desktop',
    path: '/',
    viewport: { width: 1440, height: 1024 },
  })

  await capture({
    name: '02-discovery-keyboard-focus',
    path: '/',
    viewport: { width: 1440, height: 1024 },
    prepare: async (page) => {
      const search = page.getByRole('searchbox', { name: 'Search schools' })
      await search.focus()
      await page.keyboard.press('Tab')
    },
  })

  await capture({
    name: '03-mobile-filter-dialog',
    path: '/',
    viewport: { width: 390, height: 844 },
    prepare: async (page) => {
      await page.getByRole('button', { name: /^Filters/ }).click()
      await page.getByRole('dialog').waitFor()
    },
  })

  await capture({
    name: '04-detail-200-percent-reflow',
    path: '/schools/ai_tong',
    viewport: { width: 720, height: 900 },
    prepare: async (page) => {
      await page.getByText('2025 registration results').scrollIntoViewIfNeeded()
    },
  })

  await capture({
    name: '05-detail-mobile-history',
    path: '/schools/ai_tong?phase=2C',
    viewport: { width: 390, height: 844 },
    prepare: async (page) => {
      await page.getByText('2025 registration results').scrollIntoViewIfNeeded()
    },
  })

  await capture({
    name: '06-review-dialog-mobile',
    path: '/schools/ai_tong',
    viewport: { width: 390, height: 844 },
    prepare: async (page) => {
      await page.getByRole('button', { name: /reviews/i }).click()
      await page.getByRole('heading', { name: 'Google Maps reviews' }).waitFor()
    },
  })

  await capture({
    name: '07-chart-non-color-series',
    path: '/schools/ai_tong',
    viewport: { width: 1440, height: 1024 },
    prepare: async (page) => {
      await page.getByRole('heading', { name: 'Historical allocation-rate trend' }).scrollIntoViewIfNeeded()
    },
  })
} finally {
  await browser.close()
}

await writeFile(
  new URL('../audit-results.json', outputDir),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`,
)

console.log(`Captured and inspected ${results.length} Phase 6 audit states.`)
