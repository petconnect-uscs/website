import sql from "../config/db.js";

async function findClientByEmail(email) {
  const result = await sql`select * from client where email = ${email} limit 1`;

  return result[0] || null;
}

async function findClientByCpf(cpf) {
  const result = await sql`select * from client where cpf = ${cpf} limit 1`;

  return result[0] || null;
}

async function createClient(data) {
  const { cpf, name, email, birth_date, password } = data;

  const result = await sql`
    insert into client (cpf, name, email, birth_date, password)
    values (${cpf}, ${name}, ${email}, ${birth_date || null}, ${password})
    returning *
  `;

  return result[0];
}

async function findClientById(id) {
  const result = await sql`select * from client where id = ${id} limit 1`;

  return result[0] || null;
}

export { findClientByEmail, findClientByCpf, createClient, findClientById };
