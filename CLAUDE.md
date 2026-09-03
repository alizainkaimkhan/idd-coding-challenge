# IDD Coding Challenge — UofL Course Catalog

Next.js 15 static-export SPA (TypeScript, Tailwind) deployed to GitHub Pages.
Data: catalog_dev.csv → scripts/csv-to-json.mjs → public/data/courses.json.

## Commands
- npm run dev / npm run lint / npm run build
- node scripts/csv-to-json.mjs — regenerate courses.json

## Conventions
- TS strict; function components; hooks at top; derived data via useMemo, never duplicated into state
- State is only what the user controls: query, subject, page. Page resets to 1 when query/subject change.
- Pure logic (search matching, pagination math) lives in src/lib/, framework-free
- Comments explain WHY and non-obvious logic only (dedup policy, token-prefix matching
  with the "Philosophy of Technology" example). Never narrate obvious code.
- Every user-visible state handled: loading, error, empty results
- Conventional Commits; small commits per logical change

## Don't
- No new dependencies without asking
- No server-side code — everything must work as a static export
- Don't edit public/data/courses.json by hand; regenerate via the script