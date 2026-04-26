import prisma from "@/prisma-client.ts";

export type AppointmentRowForClient = {
  appointment_id: number;
  appointment_date: Date;
  pet_id: string | null;
  pet_name: string | null;
  doctor_name: string | null;
  specialty_name: string | null;
};

async function findAppointmentsByClientCpf(
  cpf: string
): Promise<AppointmentRowForClient[]> {
  const rows = await prisma.appointment.findMany({
    where: {
      deleted_at: null,
      pet: {
        client_cpf: cpf,
        deleted_at: null,
      },
    },
    orderBy: { appointment_date: "desc" },
    include: {
      pet: { select: { pet_id: true, name: true } },
      doctor: { select: { name: true } },
      specialty: { select: { name: true } },
    },
  });

  return rows.map(
    (a: (typeof rows)[number]): AppointmentRowForClient => ({
      appointment_id: a.appointment_id,
      appointment_date: a.appointment_date,
      pet_id: a.pet_id,
      pet_name: a.pet?.name ?? null,
      doctor_name: a.doctor?.name ?? null,
      specialty_name: a.specialty?.name ?? null,
    })
  );
}

async function findAllAppointments() {
  return prisma.appointment.findMany({
    orderBy: { appointment_date: "desc" },
    include: {
      pet: true,
      doctor: true,
      specialty: true,
    },
  });
}

export type NewAppointmentData = {
  pet_id: string;
  appointment_date: Date | string;
  doctor_id: string;
  specialty_id: string;
};

async function createAppointment(
  data: NewAppointmentData
): Promise<AppointmentRowForClient> {
  const row = await prisma.appointment.create({
    data: {
      pet_id: data.pet_id,
      appointment_date: data.appointment_date,
      doctor_id: data.doctor_id,
      specialty_id: data.specialty_id,
    },
    include: {
      pet: { select: { pet_id: true, name: true } },
      doctor: { select: { name: true } },
      specialty: { select: { name: true } },
    },
  });

  return {
    appointment_id: row.appointment_id,
    appointment_date: row.appointment_date,
    pet_id: row.pet_id,
    pet_name: row.pet?.name ?? null,
    doctor_name: row.doctor?.name ?? null,
    specialty_name: row.specialty?.name ?? null,
  };
}

async function findBookedDatesByDoctor(doctorId: string): Promise<Date[]> {
  const rows = await prisma.appointment.findMany({
    where: { doctor_id: doctorId, deleted_at: null },
    select: { appointment_date: true },
  });
  return rows.map((r) => r.appointment_date);
}

export {
  findAppointmentsByClientCpf,
  findAllAppointments,
  createAppointment,
  findBookedDatesByDoctor,
};
