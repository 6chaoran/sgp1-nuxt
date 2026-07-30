# Phase 5: School history

Phase 5 redesigns the school-detail route into a responsive research view for
understanding past Primary 1 registration outcomes.

## What changed

- Added a clearer school profile with logo, attributes, area, address, map,
  official website, affiliation, and secondary Google review information.
- Automatically selects the newest registration year available for the school.
- Keeps non-default year and phase selections in the URL for reloads and
  shareable research states.
- Places registration year and admission-phase controls directly beside the
  historical results.
- Replaces the compressed mobile table with touch-friendly phase cards while
  preserving a semantic desktop table.
- Defines vacancy, applications, places taken, ballot notation, admission
  phases, missing values, and the historical allocation rate.
- Calculates displayed rates from valid places taken and applications.
  Incomplete source records show `N/A` rather than a misleading 0%.
- Rebuilt the trend chart to resize responsively, react to filter changes,
  preserve gaps for missing data, use shared theme tokens, and provide a
  visible table alternative. Year tooltips preserve every trend line on hover.
- Aligns historical-rate percentages with the neighboring numeric values on
  both desktop and mobile.
- Added loading, data-error, no-history, and missing-school states.

## Main implementation

- `pages/schools/[id].vue`
- `components/SchoolProfile.vue`
- `components/BallotHistory.vue`
- `components/Chart.vue`
- `components/SchoolLogo.vue`
- `components/Rating.vue`

## Review evidence

- Responsive captures: `docs/phase-5/screenshots/`
- Focused state captures: `docs/phase-5/states/`
- Capture metrics: `docs/phase-5/capture-results.json`
- Interaction results: `docs/phase-5/interaction-results.json`
- State capture results: `docs/phase-5/state-capture-results.json`
- Same-route comparison:
  `docs/phase-5/qa-comparison-detail-before-after.png`
- Approved-language comparison:
  `docs/phase-5/qa-comparison-direction-language.png`
- QA report: `design-qa.md`

## Verification

```bash
npm run typecheck
npm run lint
npm run verify:phase5
npm run capture:phase5
npm run capture:phase5:states
```

The Playwright interaction suite covers:

1. Newest-year selection and the school profile/chart.
2. URL-backed year and phase selection across reloads.
3. Mobile phase cards, explanations, and horizontal-overflow prevention.
4. Review-modal behavior.
5. The missing-school state.

## Scope boundary

Phase 5 focuses on the school-detail experience. Broader keyboard, zoom,
large-text, contrast, and edge-case hardening remains assigned to Phase 6.
