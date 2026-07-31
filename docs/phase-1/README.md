# Phase 1: Baseline and Visual Direction Review

Phase 1 is complete. Refined visual direction 2 was approved as the responsive
design target. No application UI was changed during this phase.

## Product language

The approved replacement for **Odds** is **Historical allocation rate**.

> Places taken divided by applications for the selected school, year, and
> admission phase. It describes a historical result, not a forecast or
> guarantee.

The interface should show this explanation near the value anywhere a parent
could reasonably interpret the percentage as a prediction.

## Technical baseline

| Check | Result |
| --- | --- |
| Dependency installation | Completed |
| Development server | Starts successfully |
| Type check | Passes with `npm run typecheck` |
| Lint | Runs, with 33 existing errors and 94 warnings |
| Nuxt client compilation | Completes |
| Nuxt server compilation | Completes |
| Production build | Fails during the final PWA/Workbox step |
| Browser capture | Eight routes/viewports captured with no page or console errors |
| Dependency audit | 67 findings: 4 low, 25 moderate, 32 high, 6 critical |

The production build failure occurs after client and server compilation:

```text
Cannot read properties of undefined (reading 'Symbol(ProxyTarget)')
```

The stack runs through `on-change`, `workbox-build`, and `vite-plugin-pwa`.
The baseline was captured on Node.js 24.5.0 and npm 11.5.1. The project also
contains an intended Firebase Node.js 18 runtime, so runtime compatibility
should be normalized before release.

The client build also reports large chunks of approximately 622 kB and 754 kB
before gzip. Bundle splitting and dependency reduction should be evaluated
after the UI direction is selected.

## Responsive capture

The repeatable capture command is:

```bash
npm run capture:baseline
```

The raw measurements and browser diagnostics are stored in
[`capture-results.json`](capture-results.json).

| Viewport | School list | School detail |
| --- | --- | --- |
| 390 × 844 | [Screenshot](screenshots/school-list-mobile-390.png) | [Screenshot](screenshots/school-detail-ai-tong-mobile-390.png) |
| 768 × 1024 | [Screenshot](screenshots/school-list-tablet-768.png) | [Screenshot](screenshots/school-detail-ai-tong-tablet-768.png) |
| 1024 × 768 | [Screenshot](screenshots/school-list-desktop-1024.png) | [Screenshot](screenshots/school-detail-ai-tong-desktop-1024.png) |
| 1440 × 1024 | [Screenshot](screenshots/school-list-desktop-1440.png) | [Screenshot](screenshots/school-detail-ai-tong-desktop-1440.png) |

## Baseline findings

### Across viewports

- The core school names, addresses, logos, and filters are understandable.
- Indigo provides a recognizable starting point for a shared theme.
- The current label `odds` is ambiguous and lacks its formula and historical
  limitation.
- SAP, GEP, phase names, ballot notation, and unavailable values need
  contextual explanations.
- Search, filters, results, and historical values do not yet form a clear
  information hierarchy.
- Loading, no-result, data-error, location-denied, and missing-record states
  are not represented.

### Mobile

- Four filters are compressed into a single narrow row.
- The account-style avatar has no corresponding account workflow and occupies
  valuable header space.
- Distance appears as `>2km` before the parent supplies a location.
- The map action is an unlabeled icon with a small target.
- The detail table compresses six columns into the viewport, making phase
  comparison difficult.
- The school detail header does not retain strong product identity.

### Tablet and desktop

- A 288 px sidebar uses about 28% of the 1024 px layout despite having one
  primary navigation item.
- At 1440 px, result content remains concentrated on the left while a large
  area is unused.
- The school-detail route overflows horizontally by 8 px at 768 px and 16 px
  at both desktop widths.
- The Phase 2A row is visibly misaligned with its table columns.
- The historical chart begins too far below the core result, especially at
  shorter desktop viewports.
- The school-detail page has an empty document title.

### Long-list cost

The list route renders approximately 25,000 px of document height at all
captured widths. Pagination, progressive rendering, or virtualization should
be considered alongside URL-persisted filters and sorting.

## Visual directions

The directions are numbered in the same order as the review images:

1. [Visual direction 1](directions/visual-direction-1.png)
2. [Visual direction 2](directions/visual-direction-2.png)
3. [Visual direction 3](directions/visual-direction-3.png)

Direction 2 was selected for refinement. Its allocation-rate values now use
the table's primary-data typography, share one right-aligned column edge, and
sit on consistent row baselines:

- [Refined visual direction 2](directions/visual-direction-2-refined.png)

These are layout and visual-hierarchy targets. Any numbers shown inside the
generated concepts are illustrative and are not authoritative data. The
implemented interface will continue to use the application's source data and
will calculate the historical allocation rate from places taken and
applications.

## Phase 1 decision

Refined visual direction 2 was approved. It is the responsive target for the
shared theme and subsequent implementation phases.
