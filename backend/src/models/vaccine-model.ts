import prisma from "@/prisma-client.ts";

async function findAllVaccines() {
  return prisma.vaccine.findMany({
    select: { vaccine_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

export { findAllVaccines };
