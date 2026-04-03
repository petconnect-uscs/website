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

export type ClientListRow = {
  cpf: string;
  name: string;
  birth_date: string | null;
  email: string;
};

async function findAllClients(): Promise<ClientListRow[]> {
  const rows = await prisma.client.findMany({
    where: { deleted_at: null },
    select: {
      cpf: true,
      name: true,
      birth_date: true,
      email: true,
    },
    orderBy: { name: "asc" },
  });

  return rows.map(
    (r: {
      cpf: string;
      name: string;
      birth_date: Date;
      email: string;
    }): ClientListRow => ({
      cpf: r.cpf,
      name: r.name,
      email: r.email,
      birth_date: r.birth_date ? formatDateOnly(r.birth_date) : null,
    })
  );
}

async function deleteClientByCpf(cpf: string): Promise<{ cpf: string } | null> {
  const existing = await prisma.client.findFirst({
    where: { cpf, deleted_at: null },
  });
  if (!existing) return null;

  await prisma.client.update({
    where: { cpf },
    data: { deleted_at: new Date() },
  });

  return { cpf };
}

export {
  findClientByEmail,
  findClientByCpf,
  createClient,
  findClientById,
  findAllClients,
  deleteClientByCpf,
};
