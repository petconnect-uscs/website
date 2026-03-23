import sql from "../config/db.js";

async function findAdminByEmail(email) {
  const result = await sql`select * from admin where email = ${email} limit 1`;

  return result[0] || null;
}

async function findAdminById(id) {
  const result = await sql`select * from admin where admin_id = ${id} limit 1`;

  return result[0] || null;
}

async function updateAdminById(admin_id, data) {
  if (!admin_id) {
    throw new Error("admin_id não informado");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("Nenhum campo para atualizar");
  }

  const result = await sql`
    UPDATE admin
    SET ${sql(data)}
    WHERE admin_id = ${admin_id}
    RETURNING admin_id, name, email
  `;

  return result[0] || null;
}

export { findAdminByEmail, findAdminById, updateAdminById };


