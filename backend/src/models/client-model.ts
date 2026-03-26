import sql from "../config/db.ts";

export type Client = {
  id: number;
  cpf: string;
  name: string;
  email: string;
  birth_date?: string | null;
  password?: string;
};

async function findClientByEmail(email: string): Promise<Client | null> {
  const result = await sql`
    select * from client where email = ${email} limit 1
  `;
  return (result as unknown as Client[])[0] || null;
}

async function findClientByCpf(cpf: string): Promise<Client | null> {
  const result = await sql`
    select * from client where cpf = ${cpf} limit 1
  `;
  return (result as unknown as Client[])[0] || null;
}

async function createClient(data: {
  cpf: string;
  name: string;
  email: string;
  birth_date?: string | null;
  passwordHash: string;
}): Promise<Client> {
  const { cpf, name, email, birth_date, passwordHash } = data;

  const result = await sql`
    insert into client (cpf, name, email, birth_date, password)
    values (${cpf}, ${name}, ${email}, ${birth_date || null}, ${passwordHash})
    returning *
  `;

  return (result as unknown as Client[])[0];
}

async function findClientById(id: number): Promise<Client | null> {
  const result = await sql`
    select * from client where id = ${id} limit 1
  `;
  return (result as unknown as Client[])[0] || null;
}

export { findClientByEmail, findClientByCpf, createClient, findClientById };

