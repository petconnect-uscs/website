import sql from "../config/db.js";

async function findClientByEmail(email) {
  const result = await sql`
    select * from client where email = ${email} limit 1
  `;
  return result[0] || null;
}

async function findClientByCpf(cpf) {
  const result = await sql`
    select * from client where cpf = ${cpf} limit 1
  `;
  return result[0] || null;
}

async function createClient(data) {
  const { cpf, name, email, birth_date, passwordHash } = data;

  const result = await sql`
    insert into client (cpf, name, email, birth_date, password)
    values (${cpf}, ${name}, ${email}, ${birth_date || null}, ${passwordHash})
    returning *
  `;
  return result[0];
}

async function findClientById(id) {
  const result = await sql`
    select * from client where id = ${id} limit 1
  `;
  return result[0] || null;
}

async function findAllClients() {
  return await sql`
    SELECT
      cpf,
      name,
      birth_date,
      email
    FROM client
    ORDER BY name
`;
}

async function deleteClientByCpf(cpf) {
  const result = await sql`
  UPDATE client
  SET deleted_at = NOW()
  WHERE cpf = ${cpf}
  RETURNING cpf
`;

  return result[0] || null;
}

export { findClientByEmail, findClientByCpf, createClient, findClientById, findAllClients, deleteClientByCpf };