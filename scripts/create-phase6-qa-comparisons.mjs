import { readFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const projectRoot = new URL('../', import.meta.url)
const browser = await chromium.launch({ headless: true })

const asDataUrl = async (relativePath) => {
  const bytes = await readFile(new URL(relativePath, projectRoot))
  return `data:image/png;base64,${bytes.toString('base64')}`
}

const createComparison = async ({
  source,
  implementation,
  output,
  imageWidth,
  imageHeight,
}) => {
  const page = await browser.newPage({
    viewport: {
      width: imageWidth * 2 + 48,
      height: imageHeight + 88,
    },
    deviceScaleFactor: 1,
  })
  const [sourceUrl, implementationUrl] = await Promise.all([
    asDataUrl(source),
    asDataUrl(implementation),
  ])

  await page.setContent(`
    <style>
      * { box-sizing: border-box; }
      body {
        margin: 0;
        padding: 16px;
        background: #e5e7eb;
        color: #111827;
        font: 600 14px/1.4 Inter, ui-sans-serif, system-ui, sans-serif;
      }
      main { display: flex; gap: 16px; }
      figure { margin: 0; width: ${imageWidth}px; }
      figcaption { height: 40px; padding: 8px 10px; background: white; }
      img {
        display: block;
        width: ${imageWidth}px;
        height: ${imageHeight}px;
        object-fit: contain;
        object-position: top;
        background: white;
      }
    </style>
    <main>
      <figure>
        <figcaption>Approved Phase 5 baseline</figcaption>
        <img src="${sourceUrl}" alt="">
      </figure>
      <figure>
        <figcaption>Phase 6 implementation</figcaption>
        <img src="${implementationUrl}" alt="">
      </figure>
    </main>
  `)
  await page.screenshot({
    path: new URL(output, projectRoot).pathname,
    fullPage: true,
  })
  await page.close()
}

try {
  await createComparison({
    source: 'docs/phase-5/screenshots/school-list-desktop-1440.png',
    implementation: 'docs/phase-6/audit/01-discovery-desktop.png',
    output: 'docs/phase-6/qa-comparison-discovery-desktop.png',
    imageWidth: 720,
    imageHeight: 512,
  })
  await createComparison({
    source: 'docs/phase-5/states/mobile-history-card.png',
    implementation: 'docs/phase-6/audit/05-detail-mobile-history.png',
    output: 'docs/phase-6/qa-comparison-history-mobile.png',
    imageWidth: 390,
    imageHeight: 844,
  })
} finally {
  await browser.close()
}

console.log('Created 2 Phase 6 design-QA comparison images.')
