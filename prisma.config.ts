import { defineConfig } from "prisma/config";

/**
 * Prisma 7 reads the CLI connection URL from here instead of from
 * `schema.prisma`. Migrations must bypass Supabase's connection pooler, so this
 * prefers `DIRECT_URL`; the application itself connects through the pooled
 * `DATABASE_URL` via the driver adapter in `src/lib/prisma.ts`.
 *
 * `process.env` is read directly (rather than through Prisma's `env()` helper)
 * so that `prisma generate` — which runs on every install, including on Vercel
 * — still succeeds when no database is configured yet.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
