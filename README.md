# UofL Course Catalog

**Live site:** https://alizainkaimkhan.github.io/idd-coding-challenge/

A single-page course catalog application built for the UofL Integrative Design & Development programmer coding challenge. It transforms the provided course export (`catalog_dev.csv`) into a browsable, searchable, filterable catalog of **2,772 unique courses**, deployed as a static site on GitHub Pages with continuous deployment.

## Features

- **Course cards** displaying Subject, Catalog Number, and Description, in a responsive mobile-first grid (1 column on phones → 2 → 3 on wider screens)
- **Search** with bidirectional token-prefix matching — typing *"Philosophy of Technology"* finds the course stored as *"PHIL OF TECHNOLOGY"* (see Design Decisions)
- **Subject filter** — a searchable combobox over all 158 subjects present in the data
- **Pagination** — 12 cards per page with range display ("Showing 13–24 of 2772 courses"), boundary-disabled controls, and automatic reset to page 1 whenever the search or filter changes
- **Full user-state coverage** — distinct loading, data-error, empty-dataset, and no-results-match states; result counts always visible
- **Accessibility** — labeled inputs, real `disabled` attributes on boundary buttons, `aria-live` page announcements, 44px touch targets, `prefers-reduced-motion` respected on scroll
- **Continuous deployment** — every merge to `main` rebuilds the data, builds the site, and publishes to GitHub Pages via GitHub Actions

## Approach

### Data pipeline (the "backend")

The CSV is not a course list — it is a **class-section export**: 8,494 rows describing scheduled sections, where a single course can appear as many as 138 times. The pipeline in `scripts/csv-to-json.mjs` (Node, zero dependencies) transforms it into the application's JSON storage layer:

1. **Parse** with a hand-rolled RFC4180-aware CSV parser — required because several `DESCR` values contain embedded commas inside quotes (e.g. `"GEN STUDIES CAPSTONE - WR, CUE"`), which a naive `split(',')` silently corrupts.
2. **Trim** every field (catalog numbers arrive space-padded).
3. **Drop 3 junk rows** where `CATALOG_NBR` contains no digit — subject-header leakage from the source system (their "descriptions" are subject names like *Business Education*, not courses).
4. **Deduplicate by `CRSE_ID`** — the system's own primary key — collapsing 5,719 section rows. One description collision exists in the data (`CRSE_ID 2529`); last-seen wins and the collision is logged.
5. **Assert** that unique `CRSE_ID` count equals unique `SUBJECT`+`CATALOG_NBR` count (2,772 = 2,772), so regenerating from a future CSV snapshot where that equivalence breaks fails loudly instead of silently corrupting output.
6. **Emit** `public/data/courses.json`: a lean array of `{ id, subject, catalogNbr, descr, sections }`, sorted for deterministic diffs — the ~100 registrar/financial columns are dropped because the client should not download AP ledger codes to render course cards.

The script logs its full accounting: `8494 rows read → 3 junk dropped → 5719 sections collapsed → 2772 courses`.

### Architecture: build-time backend, static runtime

GitHub Pages serves only static files, so the "NodeJS backend + JSON storage" requirement is satisfied at **build time**: CI runs the Node pipeline on every deploy, and the browser fetches the resulting JSON as a static asset. All querying (search, filter, pagination) is client-side over the 2,772-record array — instant at this scale, no server round-trips. The client fetch is real (with genuine loading/error states), so swapping the JSON file for a live API later is a one-URL change.

## Design Decisions

- **Deduplication.** Rendering the CSV naively produces 8,494 cards with massive duplication. Profiling the data first (row counts, key cardinality, anomaly hunting) revealed the section/course distinction and the junk rows before any UI code was written.
- **Search: bidirectional token-prefix matching.** The challenge brief's own example — user types "Philosophy of Technology", expects the PHIL card — fails under naive substring matching because the data stores abbreviated ALL-CAPS (`PHIL OF TECHNOLOGY`); "philosophy" is not a substring of "phil". The matcher tokenizes both sides and accepts a match when every query token prefix-matches a course token **in either direction** ("phil" is a prefix of "philosophy"). Searching spans subject + number + description, so "chem 390" also works.
- **Pagination over infinite scroll:** simpler to reason about, keyboard/assistive-tech friendly, a visible sense of place ("page 12 of 231"), and easier to verify. `PAGE_SIZE = 12` divides evenly into the 1/2/3-column grid so no breakpoint shows a ragged final row mid-list.
- **State discipline:** React state holds only what the user controls (`query`, `subject`, `page`); everything else — filtered lists, page slices, subject options — is derived via `useMemo`. Page resets to 1 inside the change handlers (state responding to user events), while scroll-to-top is a `useEffect` (synchronizing the viewport with rendered output).
- **Pure logic is framework-free:** the search matcher and pagination math live in `src/lib/` with no React imports — readable, testable in isolation, and reusable.
- **No premature machinery:** no debouncing, no token caching, no state library — each considered and declined because filtering 2,772 plain objects per keystroke is already instant. The decisions are documented in code comments where they were made.

## Running locally

```bash
git clone https://github.com/alizainkaimkhan/idd-coding-challenge.git
cd idd-coding-challenge
npm install

# regenerate the data file from the CSV (also runs in CI on every deploy)
node scripts/csv-to-json.mjs

npm run dev
# → http://localhost:3000/idd-coding-challenge
```

Note the `/idd-coding-challenge` base path — the app is configured (`next.config.ts`) to live under the GitHub Pages project subpath, and the dev server mirrors that.

**Checks:** `npm run lint` · `npm run build` (static export to `out/`)

## Project structure

```
├── catalog_dev.csv               # source data (committed)
├── scripts/csv-to-json.mjs       # build-time data pipeline (Node, no deps)
├── public/data/courses.json      # generated JSON storage layer
├── src/
│   ├── app/page.tsx              # composition root: state + wiring
│   ├── components/               # SearchBar, SubjectFilter, CourseCard, Pagination
│   └── lib/                      # pure logic: search matcher, pagination math, types
└── .github/workflows/deploy.yml  # build + deploy to Pages on push to main
```

## Tech stack

Next.js 15 (App Router, static export) · React · TypeScript (strict) · Tailwind CSS · Node (data pipeline) · GitHub Actions → GitHub Pages

## Development process

Built with a feature-branch/PR workflow (no direct commits to `main` after the initial scaffold), small conventional commits, and AI-assisted development using Claude Code under a plan-first, human-reviewed loop — project conventions are codified in [CLAUDE.md](CLAUDE.md), every plan was reviewed before execution, and every diff before commit. Each feature was verified against the real dataset with headless-browser checks (exact counts, boundary states, interaction cases like search→paginate→clear) before merging.
