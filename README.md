# Student Kanban Portal

A student portal built with the Next.js App Router: dashboard, courses, a Kanban board for
assignments, gradebook, announcements and a fee receipt page.

> Current state: the UI runs entirely on mock data (`src/lib/mock-data.ts` and page-local
> constants). The Prisma schema in `prisma/schema.prisma` describes the target database but is
> not wired to the pages yet.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [lucide-react](https://lucide.dev) icons
- [Prisma](https://www.prisma.io) schema targeting Postgres / Supabase

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
src/app/                Routes: / (landing), /dashboard, /courses, /assignments,
                        /gradebook, /announcements, /fee-receipt
src/components/layout/  Sidebar + DashboardLayout (shell shared by every portal page)
src/components/         dashboard/, courses/, marketing/ UI components
src/lib/                utils.ts (cn, date helpers) and mock-data.ts
src/types/              Shared TypeScript types
prisma/schema.prisma    Database schema (not connected yet)
```

Every portal page renders inside `DashboardLayout`, which provides the sidebar and the topbar;
only the landing page (`/`) is standalone.

## Database (not connected yet)

To connect the schema later, set `DATABASE_URL` and `DIRECT_URL` in a `.env` file (git-ignored),
then run `npx prisma migrate dev`.
