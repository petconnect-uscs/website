import prisma from "@/prisma-client.ts";

async function findAllSpecies() {
  return prisma.species.findMany({
    select: { species_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

async function findOrCreateSpeciesByName(name: string) {
  const existing = await prisma.species.findUnique({
    where: { name },
    select: { species_id: true },
  });
  if (existing) return existing;

  return prisma.species.create({
    data: { name },
    select: { species_id: true },
  });
}

export { findAllSpecies, findOrCreateSpeciesByName };
