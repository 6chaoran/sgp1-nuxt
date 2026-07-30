# SGP1 Modernization Plan

## Objective

Modernize SGP1 into a clear, trustworthy, and responsive planning tool for Singapore parents researching historical Primary 1 ballot information for their target schools and admission rounds.

The work should:

- Improve the project documentation.
- Modernize the desktop experience.
- Optimize both desktop and mobile layouts.
- Establish one consistent theme across viewports.
- Make historical ballot information easier to understand without presenting it as a prediction.

No application code should be changed until this plan and a visual direction have been approved.

## Current-State Findings

### Product and navigation

- The core product is useful and has a solid data foundation, but navigation occupies more space than the parent's primary task.
- The 288px desktop sidebar supports only one primary navigation item.
- The school list exposes approximately 178 schools as one long stream.
- The personal profile-style menu suggests a signed-in experience even though the app has no user-account flow.
- MOE resources, related projects, and sponsorship links compete visually with school discovery.

### Responsive experience

- Mobile filters are squeezed into four narrow columns.
- Acronyms such as SAP and GEP are not explained.
- School rows contain useful data, but their hierarchy is difficult to scan on smaller screens.
- The ballot table is compressed on mobile and relies on horizontal overflow.
- Desktop layouts do not take full advantage of the available width for search results and historical data.

### Theme and component consistency

- Styling is divided among Tailwind CSS, Vuetify, Headless UI, Heroicons, and inline ECharts configuration.
- There are no shared design tokens for colors, typography, spacing, radii, shadows, focus states, or chart colors.
- Similar elements use slightly different spacing, colors, and interaction patterns.
- PWA theme colors and metadata do not yet reflect a deliberate visual system.

### Data clarity

- The word "odds" may be interpreted as a prediction rather than a historical result.
- The interface does not explain how the displayed percentage is calculated.
- Ballot notation, admission phases, and missing data require more context.
- Loading, empty, error, and unavailable-data states are largely absent.
- Google review ratings can visually compete with the more relevant admission information.

### Functional issues to address

- Selecting "GEP: No" currently checks the SAP field.
- Distances show as `>2km` before the user has supplied a location.
- Distance sorting mutates a computed result and may not remain stable.
- The chart does not reliably update when its data changes.
- The chart does not respond properly to container or viewport resizing.
- The default year can point to a year that is unavailable for the selected school.
- Autocomplete keys do not consistently use the school's actual identifier.
- Several clickable icons are not semantic buttons and lack accessible names.
- Important loading, Firebase error, no-result, location-denied, and missing-record states are not represented.

### Documentation and quality tooling

- The current README contains only two local-preview commands.
- It does not explain the product, data model, setup, architecture, testing, deployment, or contribution workflow.
- The project does not provide complete lint, type-check, and test scripts.
- A screenshot-complete visual audit still needs to be performed after local dependencies are available.

## Recommended Product Direction

The redesigned experience should be:

- **Data-first:** School discovery and historical ballot information remain the main focus.
- **Trustworthy:** Language, source information, and limitations are explicit.
- **Parent-friendly:** Acronyms and admission phases are explained in plain language.
- **Calm:** The interface avoids unnecessary visual competition and alarmist probability treatments.
- **Responsive:** Mobile and desktop use the same tokens and component language while adapting their layouts to each viewport.

Indigo can remain the initial brand anchor, but the final palette, typography, density, and component treatment should be selected through a visual-direction review before implementation.

## Implementation Plan

### Phase 1: Establish the baseline and select a visual direction

**Status:** Complete. Refined direction 2 was approved as the responsive
design target. See
[`docs/phase-1/README.md`](docs/phase-1/README.md).

#### Work

- Install project dependencies.
- Confirm the existing development and production builds.
- Add or repair lint and type-check commands.
- Capture the current school-list and school-detail flows at:
  - 390px
  - 768px
  - 1024px
  - 1440px
- Document visible layout, interaction, and accessibility issues from those screenshots.
- Produce exactly three visual directions grounded in the current product and data density.
- Select one direction before changing application code.
- Confirm the user-facing terminology and calculation behind the current "odds" value.

#### Recommended terminology

Use **Historical allocation rate**.

Definition: the number of places taken divided by the number of applications for a school, year, and admission phase. The label must be paired with a short explanation and must not imply a guarantee or forecast.

#### Deliverable

An approved responsive visual direction and a verified technical baseline.

### Phase 2: Create a shared design system

**Status:** Complete. Shared tokens and reusable UI primitives now provide one
responsive theme for mobile and desktop. Remaining screen-level composition is
intentionally assigned to later phases. See
[`docs/phase-2/README.md`](docs/phase-2/README.md).

#### Work

- Introduce shared tokens for:
  - Brand and semantic colors
  - Neutral colors and surfaces
  - Typography
  - Spacing
  - Border radii
  - Borders and shadows
  - Focus states
  - Motion
  - Chart series
- Standardize primarily on Tailwind CSS, Headless UI, and Heroicons.
- Replace the limited Vuetify usage with project components where practical.
- Remove Vuetify if no essential usage remains.
- Build reusable primitives for:
  - Buttons and icon buttons
  - Text fields and search
  - Select menus
  - Filter chips
  - School attribute badges
  - Cards
  - Tooltips and explanatory help
  - Loading skeletons
  - Empty, error, and status messages
  - Responsive page containers

#### Deliverable

One reusable theme and component language shared by mobile and desktop.

### Phase 3: Modernize the application shell

**Status:** Complete. The sidebar and account-style menu have been replaced by
a compact responsive header, secondary navigation, an accessible About flow,
shared content width, and corrected route/PWA metadata. See
[`docs/phase-3/README.md`](docs/phase-3/README.md).

#### Work

- Replace the oversized sidebar with a compact responsive header.
- Give the central content area an intentional maximum width and responsive gutters.
- Keep the school list as the clear primary destination.
- Move MOE resources, related projects, sponsorship, and project information into secondary navigation.
- Remove the profile/account visual treatment unless a real account feature is planned.
- Add a clear product description and accessible help/about entry.
- Update route-aware navigation states.
- Correct:
  - Page titles and descriptions
  - Locale
  - Canonical and Open Graph metadata
  - Social image URLs
  - Logo and avatar alt text
  - PWA name and colors
  - Duplicate or incomplete manifest files

#### Primary touch point

- `app.vue`

#### Deliverable

A lighter application frame that gives school research more space on every viewport.

### Phase 4: Redesign school discovery

**Status:** Complete. School discovery now follows the approved responsive
direction with desktop filters, a mobile filter sheet, URL-backed state,
historical-rate context, robust result states, and verified search, sorting,
and location flows. See
[`docs/phase-4/README.md`](docs/phase-4/README.md).

#### Work

- Make school search the dominant control.
- Redesign filters responsively:
  - Desktop: structured toolbar or side filter panel.
  - Mobile: search plus a filter sheet or disclosure panel.
- Show active filters as removable chips.
- Add a visible reset action.
- Explain SAP, GEP, affiliation, distance, and admission phase in context.
- Introduce clear sorting controls, including distance when permission is available.
- Preserve search, filter, phase, and sort state in the URL.
- Present results as:
  - Compact, highly scannable rows on larger screens.
  - Touch-friendly cards on small screens.
- Prioritize:
  - School name
  - Selected phase
  - Historical rate
  - Area
  - Distance
  - School attributes
- Add:
  - Loading skeletons
  - Result counts
  - No-result guidance
  - Firebase error feedback
  - Location request, denied, unavailable, and retry states
  - Missing-logo fallback
- Correct the GEP filter, search keys, geolocation display, and stable distance sorting.
- Use Nuxt navigation components rather than full-page anchor navigation for internal routes.

#### Primary touch point

- `components/SchoolList.vue`

#### Deliverable

A fast, clear school-finding experience optimized for both touch and desktop scanning.

### Phase 5: Redesign the school history page

**Status:** Complete. The school-detail experience now presents a clear
profile, newest-year historical results, responsive phase cards and table,
plain-language definitions, and an accessible responsive trend chart. See
[`docs/phase-5/README.md`](docs/phase-5/README.md).

#### Work

- Create a clear school summary containing:
  - School name and logo
  - School attributes
  - Area and address
  - Map and school website links
  - Secondary review information
- Place the year and phase controls close to the historical results.
- Automatically select the newest year available for each school.
- Add plain-language explanations for:
  - Admission phases
  - Vacancy
  - Applied
  - Taken
  - Ballot
  - Historical rate
  - Ballot notation
- Improve responsive presentation:
  - Desktop: accessible data table with clearly grouped headings.
  - Mobile: phase-based cards or disclosure rows rather than a compressed table.
- Make the historical chart:
  - Responsive
  - Reactive to data changes
  - Consistent with the shared theme
  - Legible with missing values
  - Usable with touch and keyboard interactions where applicable
- Add a text or table alternative for chart information.
- Handle incomplete records and missing years gracefully.
- Keep Google reviews visually secondary to admission information.

#### Primary touch points

- `pages/schools/[id].vue`
- `components/SchoolProfile.vue`
- `components/BallotHistory.vue`
- `components/Chart.vue`
- `components/Rating.vue`
- `components/ReviewModal.vue`

#### Deliverable

A school-detail experience that helps parents understand historical outcomes without overstating certainty.

### Phase 6: Accessibility and responsive hardening

**Status:** Complete. The interface now has skip navigation, consistent
keyboard focus, accessible dialog focus restoration, 44px interaction
targets, live result/loading announcements, non-color chart differentiation,
reduced-motion support, and verified reflow at 200% zoom. See
[`docs/phase-6/README.md`](docs/phase-6/README.md).

#### Work

- Use semantic buttons and links for all interactions.
- Give every icon-only control an accessible name.
- Establish a correct heading hierarchy.
- Ensure visible and consistent keyboard focus.
- Support keyboard navigation for menus, filters, search results, dialogs, and year selection.
- Announce changing result counts and asynchronous states to screen readers.
- Ensure touch targets are at least 44px.
- Verify text and UI color contrast.
- Avoid relying on color alone to communicate historical-rate meaning.
- Respect reduced-motion preferences.
- Preserve usability at 200% zoom.
- Prevent page-level horizontal scrolling.
- Keep any necessary table overflow contained and discoverable.
- Test:
  - Long school names
  - Missing logos
  - Large text
  - Empty results
  - Slow data
  - Data errors
  - Location denial
  - Incomplete historical records

#### Deliverable

A keyboard-accessible and touch-friendly interface that remains coherent across supported sizes.

### Phase 7: Improve the README

Rewrite `README.md` to include:

- Product purpose
- Intended audience
- Feature overview
- Current screenshots
- Explanation of the historical ballot data
- Data sources and attribution
- Calculation methodology and limitations
- Disclaimer that historical results do not guarantee future admission
- Technology stack
- Project structure
- Prerequisites and supported Node version
- Installation
- Firebase and environment configuration
- Local development
- Linting
- Type checking
- Testing
- Production build
- Local preview
- Firebase deployment
- Data structure and update process
- PWA behavior
- Responsive and accessibility notes
- Troubleshooting
- Contribution guidance
- License or repository-use terms

#### Deliverable

A README that supports parents, contributors, and future maintainers.

### Phase 8: Testing and final verification

#### Automated checks

- Add unit tests for:
  - Area, SAP, GEP, and affiliation filters
  - Search behavior
  - Historical-rate formatting
  - Missing-data formatting
  - Newest-year fallback
  - Distance calculation and sorting
- Add component or end-to-end coverage for:
  - Finding a school
  - Changing filters
  - Selecting a phase
  - Enabling distance sorting
  - Opening a school
  - Changing the historical year
  - Reading the ballot table and chart
- Run:
  - Lint
  - Type check
  - Unit tests
  - Component or end-to-end tests
  - Production build

#### Visual and device checks

- Compare before-and-after screenshots at all target viewports.
- Verify:
  - Desktop Chrome
  - Safari and iOS Safari
  - Android Chrome
- Check loading, error, empty, permission-denied, and missing-data states.
- Confirm there is no unintended horizontal page scrolling.
- Confirm the selected theme is visually consistent across every route and viewport.

#### Quality targets

- Target Lighthouse scores of at least 90 for accessibility and best practices.
- Document any performance limitations caused by Firebase or third-party assets.
- Verify that school data and historical calculations are unchanged unless a correction was explicitly approved.

#### Deliverable

A verified production-ready implementation with documented limitations.

## Proposed Delivery Checkpoints

### Checkpoint 1: Visual foundation

- Baseline screenshots
- Three visual directions
- Selected direction
- Design tokens
- Application shell

### Checkpoint 2: School discovery

- Search and filter experience
- Responsive school results
- Location and sorting states
- Discovery-related functional corrections

### Checkpoint 3: School history and handoff

- School profile and historical results
- Responsive chart and table
- Accessibility hardening
- README
- Automated tests
- Cross-device and visual QA

Each checkpoint should be reviewed before starting the next one.

## Acceptance Criteria

The implementation is complete when:

- Desktop and mobile use the same visual tokens and interaction language.
- The layout works at 390px, 768px, 1024px, and 1440px.
- The page does not have unintended horizontal scrolling.
- Search and filters are understandable and usable with touch and keyboard.
- Active filters can be identified and cleared.
- Location information is never shown before a valid location exists.
- Historical percentages are clearly described and are not presented as predictions.
- Missing, loading, empty, and error states are represented.
- The ballot history remains readable on small screens.
- The chart resizes and updates correctly.
- The newest valid school year is selected automatically.
- Internal navigation does not cause unnecessary full-page reloads.
- Core filtering, formatting, year selection, and sorting logic is covered by tests.
- Lint, type-check, test, and production-build commands pass.
- The README documents setup, data, limitations, development, testing, and deployment.
- Before-and-after screenshots have been reviewed at all target viewports.

## Decisions Required Before Implementation

1. Select one of the three visual directions produced during Phase 1.
2. Confirm the meaning and calculation of the current `odds` field.
3. Approve the final user-facing label for that value.
4. Confirm whether Google reviews should remain in the primary school-detail flow or move to a secondary section.
5. Confirm whether removing Vuetify after replacing its limited usage is acceptable.

## Out of Scope Unless Separately Approved

- Predictive admission modeling
- User accounts
- Saved school shortlists
- Multi-school comparison
- Notifications or registration reminders
- Changes to the underlying Firebase data
- A new administration interface
- Deployment or hosting changes beyond the existing Firebase setup
