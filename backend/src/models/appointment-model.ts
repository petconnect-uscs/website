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

export { findAppointmentsByClientCpf };
