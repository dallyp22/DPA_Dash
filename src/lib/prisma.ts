import { PrismaClient } from "@prisma/client";

// Reuse Prisma client between hot reloads in development to avoid creating
// too many connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;


