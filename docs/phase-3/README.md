# Phase 3: Modern Application Shell

Phase 3 replaces the oversized desktop sidebar and account-style profile menu
with a compact, responsive frame based on the approved
[refined direction 2](../phase-1/directions/visual-direction-2-refined.png).

## What changed

- Replaced the fixed 288 px sidebar with a sticky 64 px header.
- Kept school research as the primary, route-aware destination.
- Moved MOE guidance, registration FAQ, SG Schooling, maker information, and
  sponsorship into secondary navigation.
- Added a mobile navigation drawer with practical tap targets.
- Added an accessible About dialog explaining what the tool does and the
  limits of historical data.
- Removed the fake signed-in profile/avatar treatment.
- Applied the shared 80 rem content width and responsive gutters to list and
  detail routes.
- Cropped the supplied SGP1 logo into a clear header mark.

## Metadata and PWA identity

- The document locale is now `en-SG`.
- Home, area, and school-detail routes have descriptive titles and summaries.
- Canonical and Open Graph URLs are absolute and route-aware.
- Open Graph and Twitter metadata use the SGP1 brand mark instead of the
  unrelated legacy social image.
- PWA name, description, language, scope, colors, and categories now reflect
  the actual product.
- The incomplete `public/manifest.json` and `public/site.webmanifest` files
  were removed; the Nuxt PWA manifest is the single source of truth.

## Scope boundary

Phase 3 modernizes the frame around the existing product. Search hierarchy,
filters, active chips, result rows/cards, allocation-rate language, and
discovery states remain Phase 4. School-history presentation remains Phase 5.

## Verification

- `npm run typecheck`: passed
- `npm run lint`: passed with 0 errors and 45 existing warnings
- `npm run capture:phase3`: captured eight list/detail views at 390, 768,
  1024, and 1440 px with no horizontal overflow, console errors, or page
  errors
- `npm run capture:phase3:states`: captured desktop resources, About, and
  mobile navigation states
- `npm run verify:phase3`: passed all three navigation, dialog, and metadata
  checks
- `npm run build`: client and server compilation pass; the final PWA/Workbox
  step retains the Phase 1 Node 24.5.0 `on-change@5.0.1` compatibility failure

The reference/implementation comparison and acceptance record are in
[`design-qa.md`](../../design-qa.md).

