import prisma from "@/prisma-client.ts";

const listSelect = {
  specialty_id: true,
  name: true,
  description: true,
  admin_id: true,
  created_at: true,
  updated_at: true,
} as const;

export type SpecialtyListRow = {
  specialty_id: string;
  name: string;
  description: string | null;
  admin_id: string | null;
  created_at: Date;
  updated_at: Date;
};

async function findAllSpecialties(): Promise<SpecialtyListRow[]> {
  return prisma.specialty.findMany({
    where: { deleted_at: null },
    orderBy: { name: "asc" },
    select: listSelect,
  });
}

export { findAllSpecialties };
