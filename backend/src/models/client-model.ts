import prisma from "@/prisma-client.ts";

export type Client = {
  cpf: string;
  name: string;
  email: string;
  birth_date?: string | null;
  password?: string;
};

function formatDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toClient(row: {
  cpf: string;
  name: string;
  email: string;
  birth_date: Date;
  password: string;
}): Client {
  return {
    cpf: row.cpf,
    name: row.name,
    email: row.email,
    birth_date: formatDateOnly(row.birth_date),
    password: row.password,
  };
}

async function findClientByEmail(email: string): Promise<Client | null> {
  const row = await prisma.client.findUnique({
    where: { email },
  });
  return row ? toClient(row) : null;
}

async function findClientByCpf(cpf: string): Promise<Client | null> {
  const row = await prisma.client.findUnique({
    where: { cpf },
  });
  return row ? toClient(row) : null;
}

async function createClient(data: {
  cpf: string;
  name: string;
  email: string;
  birth_date?: string | null;
  passwordHash: string;
}): Promise<Client> {
  const { cpf, name, email, birth_date, passwordHash } = data;

  const birthDate =
    birth_date != null && birth_date !== ""
      ? new Date(birth_date)
      : new Date("1970-01-01");

  const row = await prisma.client.create({
    data: {
      cpf,
      name,
      email,
      birth_date: birthDate,
      password: passwordHash,
    },
  });

  return toClient(row);
}

async function findClientById(cpf: string): Promise<Client | null> {
  return findClientByCpf(cpf);
}

export { findClientByEmail, findClientByCpf, createClient, findClientById };
