import prisma from "@/prisma-client.ts";

async function findAllBreeds() {
  return prisma.breed.findMany({
    where: { deleted_at: null },
    select: { breed_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

async function createBreed(body: { name?: string; description?: string | null }) {
  return prisma.breed.create({
    data: { name: body.name ?? "", description: body.description ?? null },
  });
}

async function updateBreed(breedId: string, body: { name?: string; description?: string | null }) {
  return prisma.breed.update({
    where: { breed_id: breedId },
    data: { name: body.name ?? "", description: body.description ?? null },
  });
}

async function deleteBreed(breedId: string) {
  return prisma.breed.delete({
    where: { breed_id: breedId },
  });
}

export { findAllBreeds, createBreed, updateBreed, deleteBreed };
