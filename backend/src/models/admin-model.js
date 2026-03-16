import sql from "../config/db.js";

async function findAdminByEmail(email) {
  const result = await sql`select * from admin where email = ${email} limit 1`;

  return result[0] || null;
}

async function findAdminById(id) {
  const result = await sql`select * from admin where id = ${id} limit 1`;

  return result[0] || null;
}

export { findAdminByEmail, findAdminById };
