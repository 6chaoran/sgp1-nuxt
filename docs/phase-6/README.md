# Phase 6: Accessibility and responsive hardening

Phase 6 preserves the approved Phase 5 visual system while strengthening
keyboard access, touch ergonomics, assistive-technology support, and layout
resilience.

## Implemented

- Added a skip link and a programmatically focusable main-content target.
- Corrected the discovery-page heading order.
- Standardized visible focus rings and minimum 44px targets across buttons,
  icon buttons, links, chips, search clearing, filters, breadcrumbs, and
  disclosures.
- Made removable filter chips respond to Enter and Space through their native
  button behavior.
- Replaced visually removable but non-functional default-filter chips with
  neutral badges.
- Restored focus to the opening control after closing mobile navigation,
  mobile filters, About, and review dialogs.
- Reworked Google reviews into a contained, internally scrolling dialog with
  persistent header and footer close controls.
- Added polite live regions for school-result counts and loading states.
- Added accessible missing-logo fallback semantics.
- Added a keyboard-accessible chart-data table and differentiated chart series
  with solid/dashed/dotted lines plus circle/diamond/square markers.
- Preserved gaps for incomplete history values and reduced-motion behavior.
- Prevented hash-only skip navigation from reapplying URL-backed filter state.

## Review evidence

- [Desktop discovery](audit/01-discovery-desktop.png)
- [Visible keyboard focus](audit/02-discovery-keyboard-focus.png)
- [Mobile filter dialog](audit/03-mobile-filter-dialog.png)
- [200% detail-page reflow](audit/04-detail-200-percent-reflow.png)
- [Mobile history](audit/05-detail-mobile-history.png)
- [Mobile review dialog](audit/06-review-dialog-mobile.png)
- [Non-color chart series](audit/07-chart-non-color-series.png)
- [Desktop Phase 5/6 comparison](qa-comparison-discovery-desktop.png)
- [Mobile Phase 5/6 comparison](qa-comparison-history-mobile.png)

The structured audit is recorded in
[`audit-results.json`](audit-results.json), and interaction results are in
[`interaction-results.json`](interaction-results.json).

## Verification

The standalone Playwright suite covers:

- semantic structure, skip navigation, focus visibility, and keyboard chip
  removal;
- mobile navigation and filter-dialog focus restoration;
- keyboard-reachable year selection, chart alternatives, incomplete values,
  and reduced motion;
- review-dialog focus containment, close targets, and focus restoration;
- 200% reflow, 320px long names, and missing-logo fallback;
- live result announcements, empty results, reset, and denied-location
  recovery.

Representative text/token contrast ratios meet WCAG AA for normal text:

| Pair | Ratio |
| --- | ---: |
| Brand 700 on white | 10.26:1 |
| Brand 800 on brand 50 | 10.52:1 |
| Neutral 600 on white | 7.45:1 |
| Neutral 500 on white | 4.85:1 |
| White on brand 600 | 8.50:1 |
| Warning 700 on warning 50 | 6.39:1 |
| Danger 700 on danger 50 | 5.81:1 |
| Success 700 on success 50 | 5.32:1 |
| Info 700 on info 50 | 5.56:1 |

Run the Phase 6 checks with:

```bash
npm run verify:phase6
npm run audit:phase6
npm run qa:phase6
```

Phase 4 and Phase 5 browser suites are also retained as regression coverage.
Broader unit, cross-browser, device, Lighthouse, slow-data, and forced
Firebase-error testing remain assigned to Phase 8.

Final local checks:

- `npm run lint`: passed with 15 existing warnings in the two legacy
  `components/Inputs/*` components and no errors.
- `npm run typecheck`: passed.
- `npm run verify:phase4`: 5 checks passed.
- `npm run verify:phase5`: 5 checks passed.
- `npm run verify:phase6`: 6 checks passed.
- `npm run build`: Nuxt client and server bundles compiled, then Workbox
  service-worker generation failed under Node 24.5.0 in `on-change` while
  reading `Symbol(ProxyTarget)`. This dependency/runtime compatibility issue is
  unchanged by the Phase 6 interface work.

Immediately after Nuxt regenerates `.nuxt`, the first cold development request
to a Firebase-backed detail route can log Nuxt’s existing hydration-mismatch
warning. The warmed verification run is clean; SSR/data hydration should be
investigated separately during Phase 8.
