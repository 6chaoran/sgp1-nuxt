# Phase 2: Shared Design System

Phase 2 establishes the visual and component foundations for the approved
[refined direction 2](../phase-1/directions/visual-direction-2-refined.png).
It deliberately does not implement the later application-shell, discovery, or
school-history layouts.

## Foundations

The source of truth for raw design tokens is
[`assets/css/main.css`](../../assets/css/main.css). Tailwind aliases are
defined in [`tailwind.config.ts`](../../tailwind.config.ts).

### Token groups

- Brand colors: `brand-50` through `brand-950`
- Neutral colors: `neutral-0` through `neutral-950`
- Semantic colors: `success`, `warning`, `danger`, and `info`
- Typography: product sans and monospace stacks
- Spacing: 4 px through 64 px
- Shape: small, medium, large, extra-large, and full radii
- Depth: control, soft, and overlay shadows
- Focus: a shared high-visibility brand focus ring
- Motion: fast, normal, and slow durations with one product easing curve
- Charts: four series colors plus a grid color

All tokens are CSS custom properties so chart configuration and non-Tailwind
code can use the same values.

## UI primitives

Nuxt auto-imports components inside `components/ui/` with a `Ui` prefix.

| Component | Purpose |
| --- | --- |
| `UiButton` | Primary, secondary, ghost, and danger actions |
| `UiIconButton` | Accessible icon-only actions with required labels |
| `UiTextField` | Text/search input with labels, hints, errors, and clear action |
| `UiSelectField` | Native accessible select with labels, hints, and errors |
| `UiFilterChip` | Active filters and removable selections |
| `UiBadge` | School attributes and compact semantic metadata |
| `UiCard` | Grouped content surface |
| `UiTooltip` | Short contextual explanations |
| `UiStatusMessage` | Info, success, warning, error, and empty states |
| `UiSkeleton` | Reduced-motion-aware loading placeholders |
| `UiContainer` | Shared responsive page width and gutters |

### Example

```vue
<UiTextField
  v-model="query"
  type="search"
  label="Search schools"
  placeholder="School name, address, or area"
  clearable
/>

<UiButton>
  Allow location access
</UiButton>

<UiStatusMessage
  variant="info"
  title="Historical allocation rate"
>
  Places taken divided by applications for the selected year and phase.
</UiStatusMessage>
```

## Existing-component integration

- Existing autocomplete and select controls now consume shared control,
  label, focus, spacing, and overlay styles.
- School attribute labels now use `UiBadge`.
- Location and introduction controls now use semantic `UiIconButton`
  elements with accessible names.
- Review stars use Heroicons and the review modal uses `UiButton`.
- Breadcrumbs and affiliation metadata use semantic HTML and Heroicons.
- ECharts reads chart colors and typography from the shared CSS tokens.
- PWA theme color now uses the brand anchor.
- Vuetify and `vuetify-nuxt-module` were removed after all remaining usages
  were replaced by Tailwind CSS, Headless UI, Heroicons, or project
  primitives.

## Scope boundary

The approved screen composition is implemented in subsequent phases. Phase 2
provides the shared language those screens will use; it does not yet replace
the sidebar, redesign filters/results, or restructure the school-history
table.

## Verification

The completed Phase 2 verification produced:

- `npm run typecheck`: passed
- `npm run lint`: passed with 0 errors and 67 existing warnings
- `npm run capture:phase2`: captured eight list/detail views at 390, 768,
  1024, and 1440 px with no horizontal overflow, console errors, or page
  errors
- `npm run verify:phase2`: passed all three core interaction checks
- `npm run build`: the client and server compile, but the final PWA/Workbox
  step still fails on Node 24.5.0 in `on-change@5.0.1`; this is the unchanged
  Phase 1 environment compatibility issue
- `npm audit`: 63 findings (4 low, 21 moderate, 32 high, 6 critical), down
  from 67 at the Phase 1 baseline

Re-run the checks with:

```bash
npm run typecheck
npm run lint
npm run capture:phase2
npm run verify:phase2
npm run build
```

Results are written to `docs/phase-2/screenshots/` and
`docs/phase-2/capture-results.json`. The combined reference/implementation
review and its acceptance criteria are recorded in
[`design-qa.md`](../../design-qa.md).
