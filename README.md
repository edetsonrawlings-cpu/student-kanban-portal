# Student Kanban Portal

A student portal built with the Next.js App Router: dashboard, courses, a Kanban board for
assignments, gradebook, announcements and a fee receipt page.

> Current state: the UI runs on the demo data in `src/lib/mock-data.ts`. The Prisma schema in
> `prisma/schema.prisma` describes the target database and the client singleton is ready
> (`src/lib/prisma.ts`), but no page queries it yet.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — configured in `@theme` inside `src/app/globals.css`
- [lucide-react](https://lucide.dev) icons
- [Prisma 7](https://www.prisma.io) schema targeting Postgres / Supabase
- [Vitest](https://vitest.dev) for unit tests

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm install` runs `prisma generate`. It succeeds without a database, so no `.env` is needed to
run the UI.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run `tsc --noEmit` |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test and build on every pull request.

## Project structure

```
src/app/                  / (landing), not-found.tsx, error.tsx, icon.svg
src/app/(dashboard)/      Portal routes sharing one layout: /dashboard, /courses,
                          /courses/[id], /assignments, /gradebook, /announcements,
                          /fee-receipt, /settings, /admin
src/components/layout/    DashboardLayout (server shell), Sidebar, Topbar, PageHeader
src/components/kanban/    KanbanBoard
src/components/           dashboard/, courses/, marketing/ UI components
src/lib/                  mock-data.ts, nav.ts, kanban.ts, grades.ts, task-store.ts,
                          prisma.ts, utils.ts
src/lib/__tests__/        Vitest unit tests
src/types/                Shared TypeScript types
prisma/                   schema.prisma + seed.ts
```

Every portal page lives in the `(dashboard)` route group, whose `layout.tsx` renders the sidebar
and topbar once. Pages render only their own content; the topbar title is derived from the route
by `src/lib/nav.ts`. Only the landing page (`/`) is standalone.

`typedRoutes` is enabled in `next.config.ts`, so a `<Link>` pointing at a route that does not
exist fails the build instead of producing a 404 at runtime.

### Data

`src/lib/mock-data.ts` is the **single source of truth** for the demo content. Pages must read
from it rather than declaring their own course codes, grades or deadlines — the dashboard tiles
(`enrolledCourses`, `pendingAssignments`, `gpa`) are derived from the same arrays, so duplicating
data makes the totals disagree with the detail pages. `src/lib/__tests__/mock-data.test.ts`
guards those invariants.

Dates are stored as ISO strings and formatted in UTC (`src/lib/utils.ts`) so server rendering and
client hydration always produce the same markup.

### Kanban board

`/assignments` renders `KanbanBoard`. Tasks can be created, deleted, dragged between columns or
moved with the arrow buttons, and filtered by course and priority. Board state is persisted to
`localStorage` through `src/lib/task-store.ts`, exposed as a `useSyncExternalStore` source so the
hydration render still matches the server output. All board transitions live in
`src/lib/kanban.ts` and are unit tested.

## Database (not connected yet)

1. Set `DATABASE_URL` (pooled) and `DIRECT_URL` (direct connection, used by migrations) in a
   `.env` file — it is git-ignored.
2. `npx prisma migrate dev`
3. `npx prisma db seed` — loads the same content as `src/lib/mock-data.ts`.

Prisma 7 no longer accepts connection URLs in `schema.prisma`: the CLI reads them from
`prisma.config.ts`, and the application connects through the `@prisma/adapter-pg` driver adapter
configured in `src/lib/prisma.ts`.

## Deploying to Vercel

Import the repository on Vercel and keep the defaults — framework, build command and install
command are detected automatically. Add `DATABASE_URL` and `DIRECT_URL` to the project
environment variables only once a page actually queries the database.

## Roadmap

Known gaps, roughly in priority order:

- **Authentication.** The role and user name come from `currentStudent` in `mock-data.ts`. The
  sidebar hides entries a role cannot use, but that is cosmetic: `/admin` is reachable by anyone.
  Server-side auth (Supabase Auth + a Next middleware) is needed before roles mean anything.
- **Persist the Kanban board server-side.** `localStorage` is per-browser; a route handler backed
  by Prisma would make boards portable.
- **Wire the pages to Prisma** and retire the mock data module.
- **Search.** The topbar input is not connected to anything yet.
- **Component tests.** The suite covers pure logic only; rendering tests would need Testing
  Library and a DOM environment.
