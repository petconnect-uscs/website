import prisma from "@/prisma-client.ts";

export type RecipeRowForClient = {
  recipe_id: number;
  created_at: Date;
  pdf_url: string | null;
  pet_name: string | null;
  doctor_name: string | null;
};

async function findAllRecipes() {
  return prisma.recipe.findMany({
    orderBy: { recipe_id: "desc" },
    include: {
      pet: true,
      client: true,
    },
  });
}

async function findRecipesByClientCpf(cpf: string): Promise<RecipeRowForClient[]> {
  const rows = await prisma.recipe.findMany({
    where: { client_cpf: cpf, deleted_at: null },
    orderBy: { created_at: "desc" },
    select: {
      recipe_id: true,
      created_at: true,
      pdf_url: true,
      pet: { select: { name: true } },
      doctor: { select: { name: true } },
    },
  });

  return rows.map((r) => ({
    recipe_id: r.recipe_id,
    created_at: r.created_at,
    pdf_url: r.pdf_url ?? null,
    pet_name: r.pet?.name ?? null,
    doctor_name: r.doctor?.name ?? null,
  }));
}

export type NewRecipeData = {
  description: string;
  pet_id: string;
  client_cpf: string;
  doctor_id?: string | null;
  pdf_url?: string | null;
  admin_id: string;
};

async function createRecipe(data: NewRecipeData) {
  return prisma.recipe.create({ data });
}

async function softDeleteRecipe(
  recipeId: number
): Promise<{ recipe_id: number } | null> {
  const existing = await prisma.recipe.findFirst({
    where: { recipe_id: recipeId, deleted_at: null },
  });
  if (!existing) return null;

  await prisma.recipe.update({
    where: { recipe_id: recipeId },
    data: { deleted_at: new Date() },
  });
  return { recipe_id: recipeId };
}

export { findAllRecipes, findRecipesByClientCpf, createRecipe, softDeleteRecipe };
