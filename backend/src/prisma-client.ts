import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to create PrismaClient.");
}

// Prisma ORM v7 requires a driver adapter for direct DB connections.
const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

// Export a singleton Prisma client to avoid creating many connections.
const prisma = new PrismaClient({ adapter });

export default prisma;

