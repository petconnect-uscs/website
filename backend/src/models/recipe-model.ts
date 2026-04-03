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

export { findAllRecipes };
