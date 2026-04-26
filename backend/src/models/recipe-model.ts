import prisma from "@/prisma-client.ts";

async function findAllRecipes() {
  return prisma.recipe.findMany({
    orderBy: { recipe_id: "desc" },
    include: {
      pet: true,
      client: true,
    },
  });
}

async function findRecipesByClientCpf(cpf: string) {
  return prisma.recipe.findMany({
    where: { client_cpf: cpf, deleted_at: null },
    orderBy: { recipe_id: "desc" },
    include: {
      pet: true,
    },
  });
}

export { findAllRecipes, findRecipesByClientCpf };
