# Kanban Board

A single-board Kanban MVP built with Next.js, TypeScript, Tailwind CSS and dnd-kit. State is held in memory, so refreshing the page restores the sample data.

## Install

Requires Node.js 20.9 or later.

```bash
cd frontend
npm install
```

## Run

```bash
npm run dev
```

Open http://localhost:3000 and sign in with the demo account:

- Email: `demo@kanban.dev`
- Password: `kanban123`

Sign in is a client-side demo only and does not provide real security.

## Test

```bash
npm test                          # unit tests (Vitest)
npx playwright install chromium   # first run only
npm run test:e2e                  # browser tests (Playwright)
```
