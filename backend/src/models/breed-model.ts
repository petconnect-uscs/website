import prisma from "@/prisma-client.ts";

async function findAllBreeds() {
  return prisma.breed.findMany({
    where: { deleted_at: null },
    select: { breed_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export { findAllBreeds };
