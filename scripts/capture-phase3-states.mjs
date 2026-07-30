import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const baseUrl = process.env.SGP1_BASE_URL || 'http://127.0.0.1:3000'
const outputDir = new URL('../docs/phase-3/screenshots/', import.meta.url)

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ headless: true })

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1024 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  })
  const desktopPage = await desktop.newPage()
  await desktopPage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await desktopPage.getByText('178 schools are selected').waitFor()

  await desktopPage.getByRole('button', { name: 'Resources' }).click()
  await desktopPage.getByRole('menuitem').filter({ hasText: 'MOE P1 registration' }).waitFor()
  await desktopPage.waitForTimeout(250)
  await desktopPage.screenshot({
    path: fileURLToPath(new URL('resources-menu-desktop-1440.png', outputDir)),
    animations: 'disabled',
  })

  await desktopPage.keyboard.press('Escape')
  await desktopPage.getByRole('button', { name: 'About' }).click()
  await desktopPage.getByRole('dialog', { name: 'Plan with past registration data' }).waitFor()
  await desktopPage.getByRole('heading', { name: 'Plan with past registration data' }).waitFor()
  await desktopPage.waitForTimeout(250)
  await desktopPage.screenshot({
    path: fileURLToPath(new URL('about-dialog-desktop-1440.png', outputDir)),
    animations: 'disabled',
  })
  await desktop.close()

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    serviceWorkers: 'block',
  })
  const mobilePage = await mobile.newPage()
  await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' })
  await mobilePage.getByText('178 schools are selected').waitFor()
  await mobilePage.getByRole('button', { name: 'Open navigation' }).click()
  await mobilePage.getByRole('dialog').getByRole('link', { name: 'School research' }).waitFor()
  await mobilePage.screenshot({
    path: fileURLToPath(new URL('navigation-open-mobile-390.png', outputDir)),
    animations: 'disabled',
  })
  await mobile.close()
} finally {
  await browser.close()
}

console.log('Captured 3 Phase 3 navigation states.')
