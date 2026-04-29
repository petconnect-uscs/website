import prisma from "@/prisma-client.ts";

async function findAllSpecies() {
  return prisma.species.findMany({
    select: { species_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export { findAllSpecies };
