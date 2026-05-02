import prisma from "@/prisma-client.ts";

const specialtySelect = {
  specialty_id: true,
  name: true,
} as const;

export type DoctorListRow = {
  doctor_id: string;
  name: string;
  cpf: string;
  specialty_id: string | null;
  admin_id: string | null;
  created_at: Date;
  updated_at: Date;
  specialty: { specialty_id: string; name: string } | null;
};

export type DoctorDetailRow = DoctorListRow;

async function findAllDoctors(): Promise<DoctorListRow[]> {
  return prisma.doctor.findMany({
    where: { deleted_at: null },
    orderBy: { name: "asc" },
    include: {
      specialty: { select: specialtySelect },
    },
  });
}

async function findDoctorById(
  doctorId: string
): Promise<DoctorDetailRow | null> {
  return prisma.doctor.findFirst({
    where: { doctor_id: doctorId, deleted_at: null },
    include: {
      specialty: { select: specialtySelect },
    },
  });
}

async function createDoctor(data: {
  name: string;
  cpf: string;
  specialty_id?: string | null;
  admin_id?: string | null;
}) {
  return prisma.doctor.create({
    data: {
      name: data.name,
      cpf: data.cpf,
      specialty_id: data.specialty_id ?? undefined,
      admin_id: data.admin_id ?? undefined,
    },
    include: {
      specialty: { select: specialtySelect },
    },
  });
}

async function updateDoctor(
  doctorId: string,
  data: {
    name?: string;
    cpf?: string;
    specialty_id?: string | null;
  }
) {
  return prisma.doctor.update({
    where: { doctor_id: doctorId },
    data: {
      ...data,
      updated_at: new Date(),
    },
    include: {
      specialty: { select: specialtySelect },
    },
  });
}

async function softDeleteDoctor(
  doctorId: string
): Promise<{ doctor_id: string } | null> {
  const existing = await prisma.doctor.findFirst({
    where: { doctor_id: doctorId, deleted_at: null },
  });
  if (!existing) return null;

  await prisma.doctor.update({
    where: { doctor_id: doctorId },
    data: { deleted_at: new Date() },
  });

  return { doctor_id: doctorId };
}

async function findDoctorsBySpecialtyId(
  specialtyId: string
): Promise<DoctorListRow[]> {
  return prisma.doctor.findMany({
    where: { deleted_at: null, specialty_id: specialtyId },
    orderBy: { name: "asc" },
    include: {
      specialty: { select: specialtySelect },
    },
  });
}



export {
  findAllDoctors,
  findDoctorById,
  findDoctorsBySpecialtyId,
  createDoctor,
  updateDoctor,
  softDeleteDoctor,
};
