# Campus Portal Demo

A three-role campus portal built with the Next.js App Router. The topbar selector switches between
functional Student, Teacher and Administrator demo workspaces without requiring real authentication.

> Current state: seeded data comes from `src/lib/mock-data.ts`; role changes and demo actions are
> persisted in browser `localStorage`. The Prisma schema describes the target database, but no page
> queries it yet.

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

## Demo portals

Use the role selector in the topbar or the three connected dashboard tabs to move directly between
Student, Teacher and Administrator views. This is deliberately a presentation mode, not an
authentication mechanism.

The adjacent account selector changes identity without changing role. Seed data includes multiple
students, professors and administrators, and the browser remembers one selected account per role.
Switching accounts updates the sidebar, dashboard, settings and role-specific records immediately.

| Portal | Functional demo workflows |
| --- | --- |
| Student | Kanban task management, courses, deadlines, gradebook, announcements and fee receipt |
| Teacher | Assigned course dashboard, assignment publishing, class grade entry and course announcements |
| Administrator | Institution dashboard, professor/user creation, course creation and assignment, searchable directory, suspension/reactivation and institution announcements |

Teacher changes flow into the Student portal: a published assignment appears in student deadlines,
a changed grade updates the student gradebook/GPA, and a course announcement appears in the student
feed. In the Teacher portal, Settings can edit the teacher's name, email, faculty ID and affiliation;
the updated identity propagates to navigation, courses, announcements and the administrator directory.
Settings also provides a one-click reset before a new presentation.

The Administrator workspace can add a professor, then create a course and assign it to any active
professor. Both records persist locally; the course appears immediately in the shared catalog and
its locally resolved detail page.

### Linked demo workflow (no authentication)

- Adding a professor in Admin makes that professor selectable in the Teacher topbar.
- Student, Teacher and Administrator can each switch between active accounts while staying in the
  same role.
- Creating a course assigns it to that professor and creates pending grade rows for every student.
- The selected professor sees only their courses, assignments, grade rows and course announcements.
- Teacher assignments, grades and announcements appear immediately in the Student portal; grades
  recalculate the student's GPA.
- Adding a student creates pending grade rows in every existing course.
- Suspending any account removes it from that role's account selector; suspending a professor also
  removes them from new course assignment.
- Reset local data restores all three portals, personas and relationships to the seed state.

All of this is browser-local coordination for the demo. It is not authentication or server-side
authorization.

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
| `npm run demo:check -- [port]` | Check the demo machine and run all four CI gates |

CI (`.github/workflows/ci.yml`) runs install, lint, typecheck, test and build on pushes to `main`
and on every pull request.

## Oral demo

The French [presentation runbook](DEMO.md) covers advance preparation, the final ten-minute
checklist, production startup, projector mode, fallback options and concise technical answers for
the jury.

## Project structure

```
src/app/                  / (landing), not-found.tsx, error.tsx, icon.svg
src/app/(dashboard)/      Portal routes sharing one layout: /dashboard, /courses,
                          /courses/[id], /assignments, /gradebook, /announcements,
                          /fee-receipt, /settings, /admin
src/components/layout/    DashboardLayout (server shell), Sidebar, Topbar, PageHeader
src/components/kanban/    KanbanBoard
src/components/portals/   Role-aware Student, Teacher and Administrator workspaces
src/components/           dashboard/, courses/, marketing/ UI components
src/lib/                  mock data, local demo stores, navigation, grades and utilities
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

`src/lib/mock-data.ts` is the **seed source of truth**. `demo-role-store.ts`,
`demo-workspace-store.ts` and `task-store.ts` expose hydration-safe `useSyncExternalStore` sources
and persist browser changes. The dashboards and detail pages derive their totals from this shared
state; unit tests guard course references, profile roles and unique account data.

Dates are stored as ISO strings and formatted in UTC (`src/lib/utils.ts`) so server rendering and
client hydration always produce the same markup.

### Navigation and search

The topbar search follows the active role: teachers only see their assigned courses and work,
students also see Kanban cards, and administrators search the institution course catalog. Results
link to course details or individual board cards; Enter opens the first result and Escape dismisses
the results. The notification bell opens Announcements.

The landing page links to the official university site for information and applications, and
Contact opens an email to the university. These external links do not create a local account.
Open Demo Portal enters the local dashboard; Back to home returns to the landing page.

### Kanban board

For students, `/assignments` renders the complete Campus Portal development roadmap: authentication,
database work, role dashboards, shared data flows, testing, deployment and presentation tasks are
distributed across To Do, In Progress, Testing and Done. A live progress bar is derived from the
board state. Every column has a configurable work-in-progress limit persisted in the browser;
creation, arrow moves and drag-and-drop cannot add a card to a full column. Tasks can otherwise be
created, deleted, dragged between columns or moved with arrow buttons.
For teachers, the same route is an assignment publisher whose deadlines feed the student dashboard.
Both workflows persist locally.

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

- **Authentication and authorization.** The topbar role selector intentionally simulates access;
  routes are not protected. A real deployment needs an identity provider, server sessions and
  server-side role checks before any mutation reaches a database.
- **Persist the Kanban board server-side.** `localStorage` is per-browser; a route handler backed
  by Prisma would make boards portable.
- **Wire the pages to Prisma** and retire the mock data module.
- **Component tests.** The suite covers pure logic only; rendering tests would need Testing
  Library and a DOM environment.
