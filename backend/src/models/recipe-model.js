import sql from "../config/db.js";

async function findAllRecipes() {
  return await sql`
    SELECT
      r.recipe_id,
      r.description,

      -- relacionamento
      r.pet_id,
      r.client_cpf,
      r.admin_id,

      -- dados enriquecidos
      row_to_json(p.*) AS pet,
      row_to_json(c.*) AS client

    FROM recipe r
    LEFT JOIN pet p ON p.pet_id = r.pet_id
    LEFT JOIN client c ON c.cpf = r.client_cpf

    ORDER BY r.recipe_id DESC
  `;
}

async function findRecipeById(recipe_id) {
  const result = await sql`
    SELECT
      r.recipe_id,
      r.description,
      r.pet_id,
      r.client_cpf,
      r.admin_id,

      row_to_json(p.*) AS pet,
      row_to_json(c.*) AS client

    FROM recipe r
    LEFT JOIN pet p ON p.pet_id = r.pet_id
    LEFT JOIN client c ON c.cpf = r.client_cpf

    WHERE r.recipe_id = ${recipe_id}
    LIMIT 1
  `;

  return result[0] || null;
}

async function createRecipe({ description, pet_id, client_cpf, admin_id }) {
  const result = await sql`
    INSERT INTO recipe (
      description,
      pet_id,
      client_cpf,
      admin_id
    )
    VALUES (
      ${description},
      ${pet_id},
      ${client_cpf},
      ${admin_id}
    )
    RETURNING *
  `;

  return result[0];
}

async function deleteRecipeById(recipe_id) {
  const result = await sql`
    DELETE FROM recipe
    WHERE recipe_id = ${recipe_id}
    RETURNING recipe_id
  `;

  return result[0] || null;
}

export {
  findAllRecipes,
  findRecipeById,
  createRecipe,
  deleteRecipeById
};