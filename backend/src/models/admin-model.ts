import prisma from "@/prisma-client.ts";

export type Admin = {
  admin_id: string;
  name: string;
  email: string;
  password?: string;
};

function toAdmin(row: {
  admin_id: string;
  name: string;
  email: string;
  password: string;
}): Admin {
  return {
    admin_id: row.admin_id,
    name: row.name,
    email: row.email,
    password: row.password,
  };
}

async function findAdminByEmail(email: string): Promise<Admin | null> {
  const row = await prisma.admin.findUnique({
    where: { email },
  });
  return row ? toAdmin(row) : null;
}

async function findAdminById(adminId: string): Promise<Admin | null> {
  const row = await prisma.admin.findUnique({
    where: { admin_id: adminId },
  });
  return row ? toAdmin(row) : null;
}

async function updateAdminById(
  adminId: string,
  data: { name?: string; password?: string }
): Promise<Pick<Admin, "admin_id" | "name" | "email"> | null> {
  const row = await prisma.admin.update({
    where: { admin_id: adminId },
    data,
    select: { admin_id: true, name: true, email: true },
  });
  return row;
}

export { findAdminByEmail, findAdminById, updateAdminById };
