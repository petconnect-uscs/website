import prisma from "@/prisma-client.ts";

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

export { findAllAppointments };
