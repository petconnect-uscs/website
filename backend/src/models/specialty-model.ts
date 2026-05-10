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

export type SpecialtyDetailRow = SpecialtyListRow;

async function findAllSpecialties(): Promise<SpecialtyListRow[]> {
  return prisma.specialty.findMany({
    where: { deleted_at: null },
    orderBy: { name: "asc" },
    select: listSelect,
  });
}

async function findSpecialtyById(
  specialtyId: string
): Promise<SpecialtyDetailRow | null> {
  return prisma.specialty.findFirst({
    where: { specialty_id: specialtyId, deleted_at: null },
    select: listSelect,
  });
}

async function createSpecialty(data: {
  name: string;
  description?: string | null;
  admin_id?: string;
}) {
  return prisma.specialty.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      admin_id: data.admin_id,
    },
    select: listSelect,
  });
}

async function updateSpecialty(
  specialtyId: string,
  data: { name?: string; description?: string | null }
) {
  return prisma.specialty.update({
    where: { specialty_id: specialtyId },
    data: {
      ...data,
      updated_at: new Date(),
    },
    select: listSelect,
  });
}

async function countActiveDoctorsBySpecialty(specialtyId: string) {
  return prisma.doctor.count({
    where: { specialty_id: specialtyId, deleted_at: null },
  });
}

async function countActiveAppointmentsBySpecialty(specialtyId: string) {
  return prisma.appointment.count({
    where: { specialty_id: specialtyId, deleted_at: null },
  });
}

async function softDeleteSpecialty(
  specialtyId: string
): Promise<{ specialty_id: string } | null> {
  const existing = await prisma.specialty.findFirst({
    where: { specialty_id: specialtyId, deleted_at: null },
    select: { specialty_id: true },
  });
  if (!existing) return null;

  await prisma.specialty.update({
    where: { specialty_id: specialtyId },
    data: { deleted_at: new Date() },
  });

  return { specialty_id: specialtyId };
}

export {
  findAllSpecialties,
  findSpecialtyById,
  createSpecialty,
  updateSpecialty,
  countActiveDoctorsBySpecialty,
  countActiveAppointmentsBySpecialty,
  softDeleteSpecialty,
};
