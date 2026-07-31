# Phase 4: School discovery

Phase 4 redesigns the school list into a responsive research workflow based on
the refined visual direction approved in Phase 1.

## What changed

- Added a planning hero with a purpose-built school illustration.
- Made school search the dominant control and expanded it to school name,
  address, and area.
- Added a structured desktop filter rail and a mobile filter sheet.
- Added plain-language explanations for SAP, GEP, affiliation, admission
  phase, historical allocation rate, distance, and location privacy.
- Added removable filter chips, result counts, reset actions, and
  URL-persisted search/filter/sort state.
- Added stable school-name, historical-rate, and permission-aware distance
  sorting. Missing rates remain last in either rate order.
- Added desktop result rows and responsive touch-friendly cards.
- Added loading, Firebase error, no-result, denied/unavailable location,
  retry, and missing-logo states.
- Corrected the GEP predicate and removed pre-permission distance display.
- Replaced internal full-page navigation with Nuxt links.

## Main implementation

- `components/SchoolList.vue`
- `components/SchoolFilterFields.vue`
- `components/SchoolIdentity.vue`
- `components/SchoolLogo.vue`
- `components/SchoolBadges.vue`
- `components/ui/SelectField.vue`
- `public/school-planning-illustration-transparent.png`

## Review evidence

- Responsive captures:
  `docs/phase-4/screenshots/`
- State captures:
  `docs/phase-4/states/`
- Capture metrics:
  `docs/phase-4/capture-results.json`
- Interaction results:
  `docs/phase-4/interaction-results.json`
- State capture results:
  `docs/phase-4/state-capture-results.json`
- Design comparison:
  `docs/phase-4/qa-comparison-desktop.png`
- Focused design comparison:
  `docs/phase-4/qa-comparison-discovery.png`
- QA report:
  `design-qa.md`

## Verification

```bash
npm run typecheck
npm run lint
npm run verify:phase4
npm run capture:phase4
npm run capture:phase4:states
```

The Playwright interaction suite covers:

1. Search, empty results, reset, and URL persistence.
2. Desktop GEP filtering and historical-rate sorting.
3. Mobile filter-sheet behavior and route-state restoration.
4. Denied location and retry feedback.
5. Successful location access and distance sorting.

## Scope boundary

Phase 4 changes school discovery only. The school profile, historical table,
chart, year selection, and phase-level history presentation remain Phase 5.
