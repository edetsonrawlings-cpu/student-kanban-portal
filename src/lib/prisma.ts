import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Next.js reloads modules on every change in development and serverless
 * platforms reuse warm instances, so creating a `PrismaClient` per request
 * exhausts the database connection pool. Cache one on `globalThis` instead.
 *
 * The client is created lazily: importing this module must not throw during a
 * build that has no `DATABASE_URL` configured.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env locally and to the environment variables of your deployment."
    );
  }

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export function getPrismaClient(): PrismaClient {
  globalForPrisma.prisma ??= createPrismaClient();
  return globalForPrisma.prisma;
}

/** Lazy proxy so `prisma.course.findMany()` connects on first use, not on import. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export default prisma;
