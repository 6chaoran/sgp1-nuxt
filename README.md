# SGP1 — Singapore Primary 1 Planning Companion

SGP1 aims to help parents find a primary school for their little ones with
ease. It brings Singapore Primary 1 registration information into a responsive
research experience where parents can search and filter schools, compare school
attributes, and review historical registration outcomes by year and admission
phase.

The percentages shown in the application are **historical allocation rates**:
places taken divided by applications for a school, year, and admission phase.
They describe past registration exercises and are not forecasts or guarantees
of future admission.

## Tech stack

- **Application:** Nuxt 3, Vue 3, and TypeScript
- **UI:** Tailwind CSS, Headless UI, Heroicons, and Inter
- **Data and hosting:** Firebase Realtime Database, VueFire, and Firebase App
  Hosting
- **Data visualization:** Apache ECharts
- **Web platform:** Progressive Web App support, sitemap generation, and Google
  Analytics
- **Quality:** ESLint, Vue TypeScript checking, and Playwright browser tests
- **Delivery:** GitHub Actions for pull-request validation and Firebase App
  Hosting automatic production rollouts

## Redesign with Codex

The current interface was redesigned through a six-phase plan implemented by a
Codex coding agent with minimal intervention from the project owner. The owner
approved the visual direction and provided focused product feedback; the agent
handled the codebase audit, implementation, responsive captures, browser tests,
accessibility checks, and phase documentation.

1. **[Baseline and visual direction](docs/phase-1/README.md)** — audited the
   original interface across four viewport sizes, clarified the historical-rate
   language, explored three design directions, and selected a responsive target.
2. **[Shared design system](docs/phase-2/README.md)** — introduced design tokens
   and reusable controls, cards, badges, filter chips, status messages, and
   loading states.
3. **[Application shell](docs/phase-3/README.md)** — replaced the oversized
   sidebar with a responsive header and navigation, improved page structure, and
   corrected metadata and PWA presentation.
4. **[School discovery](docs/phase-4/README.md)** — rebuilt search, filters,
   sorting, location handling, URL-backed state, result cards, and empty/error
   states for desktop and mobile.
5. **[School history](docs/phase-5/README.md)** — redesigned school profiles,
   historical phase results, terminology, year and phase controls, and the
   responsive allocation-rate chart.
6. **[Accessibility and responsive hardening](docs/phase-6/README.md)** — added
   keyboard and screen-reader support, focus restoration, touch-friendly
   targets, reduced-motion behavior, non-color chart differentiation, and
   200%-zoom reflow checks.

Based on repository timestamps and the size of the change, the six phases took
an estimated **4.5–6 hours of active agent work** (about **5.2 hours** at the
midpoint). Estimated usage was **0.7–2.2 million tokens** (about **1.3 million**)
or roughly **65–245 GPT-5.6 Sol-equivalent credits** (about **130**). These are
workload estimates rather than billing records; actual deducted credits depend
on cached-token usage and the allowance included with the account. See the
[Codex rate card](https://help.openai.com/en/articles/20001106-codex-rate-card)
for the current conversion.

The full implementation plan and its product rationale are recorded in
[PLAN.md](docs/PLAN.md).

## Owner runbook: local testing and deployment

### First-time setup

Use Node.js 22 LTS to match CI and the Firebase App Hosting runtime.

```bash
git clone git@github.com:6chaoran/sgp1-nuxt.git
cd sgp1-nuxt
npm ci
```

If Playwright reports that its browser is missing:

```bash
npx playwright install chromium
```

### Run the site locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production-style local check:

```bash
npm run build
npm run preview
```

To test with the Firebase App Hosting emulator:

```bash
npx firebase-tools emulators:start
```

### Run checks before pushing

Run the fast checks first:

```bash
npm run lint
npm run typecheck
npm run build
```

The browser suites expect the development server to already be running at
`http://127.0.0.1:3000`. Keep `npm run dev` open in one terminal, then run in a
second terminal:

```bash
npm run verify:phase4
npm run verify:phase5
npm run verify:phase6
```

To run the suites against another environment:

```bash
SGP1_BASE_URL=https://example.com npm run verify:phase6
```

### Deploy

Pull requests run the App Hosting-targeted build in
`.github/workflows/firebase-hosting-pull-request.yml`. App Hosting does not
provide the temporary per-PR preview channels offered by classic Firebase
Hosting, so review the PR checks and test locally before merging.

Production deployment is handled by the Firebase App Hosting GitHub
integration. Complete this one-time setup in the Firebase console:

1. Open **Hosting & Serverless → App Hosting** in project `sgp1-79c40`.
2. Open backend `sgp1` and go to **Settings → Deployment**.
3. Connect the GitHub repository `6chaoran/sgp1-nuxt`.
4. Set the app root directory to `/`, the live branch to `main`, and enable
   automatic rollouts.
5. Select Node.js 22 and finish the first rollout.

Recommended release flow:

```bash
git checkout -b feature/short-description
# Make and test the changes.
git status
git add path/to/changed-file
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Open a pull request on GitHub, confirm the validation workflow passes, test the
branch locally, and merge it into `main` when it looks correct. The App Hosting
GitHub integration then builds the Nuxt SSR application and rolls it out to
backend `sgp1`.

If already working directly on `main`, pushing it triggers the same automatic
rollout:

```bash
git push origin main
```

Prefer the pull-request flow so the automated checks can catch problems before
production.

For an exceptional manual deployment from the checked-out source, first log in
to Firebase, then run:

```bash
npx firebase-tools deploy \
  --only apphosting:sgp1 \
  --project sgp1-79c40 \
  --runtime nodejs22
```
