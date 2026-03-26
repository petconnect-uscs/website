import sql from "../config/db.ts";

export type Admin = {
  admin_id: number;
  name: string;
  email: string;
  password?: string;
};

async function findAdminByEmail(email: string): Promise<Admin | null> {
  const result = await sql`select * from admin where email = ${email} limit 1`;
  return (result as unknown as Admin[])[0] || null;
}

async function findAdminById(id: number): Promise<Admin | null> {
  const result = await sql`select * from admin where id = ${id} limit 1`;
  return (result as unknown as Admin[])[0] || null;
}

export { findAdminByEmail, findAdminById };

