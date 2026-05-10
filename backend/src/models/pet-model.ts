import prisma from "@/prisma-client.ts";
import type { Prisma } from "@/generated/prisma/client.ts";

export type PetRow = {
  pet_id: string;
  name: string;
  species_id: string | null;
  species_name: string | null;
  sex: string | null;
  birth_date: string | null;
  image_url: string | null;
  is_neutered: boolean | null;
  is_vaccinated: boolean | null;
  breed_id: string | null;
  breed_name: string | null;
  vaccines: { vaccine_id: string; name: string }[];
};

const petSelect = {
  pet_id: true,
  name: true,
  species_id: true,
  sex: true,
  birth_date: true,
  image_url: true,
  is_neutered: true,
  is_vaccinated: true,
  breed_id: true,
  breed: { select: { name: true } },
  species: { select: { name: true } },
  pet_vaccine: { select: { vaccine: { select: { vaccine_id: true, name: true } } } },
} as const;

function mapPetRow(p: {
  pet_id: string;
  name: string;
  species_id: string | null;
  sex: string | null;
  birth_date: Date | null;
  image_url: string | null;
  is_neutered: boolean | null;
  is_vaccinated: boolean | null;
  breed_id: string | null;
  breed: { name: string } | null;
  species: { name: string } | null;
  pet_vaccine: { vaccine: { vaccine_id: string; name: string } }[];
}): PetRow {
  return {
    pet_id: p.pet_id,
    name: p.name,
    species_id: p.species_id,
    species_name: p.species?.name ?? null,
    sex: p.sex,
    birth_date: p.birth_date ? p.birth_date.toISOString().split("T")[0] : null,
    image_url: p.image_url,
    is_neutered: p.is_neutered,
    is_vaccinated: p.is_vaccinated,
    breed_id: p.breed_id,
    breed_name: p.breed?.name ?? null,
    vaccines: p.pet_vaccine.map((pv) => pv.vaccine),
  };
}

async function findPetsByClientCpf(cpf: string): Promise<PetRow[]> {
  const rows = await prisma.pet.findMany({
    where: { client_cpf: cpf, deleted_at: null },
    select: petSelect,
    orderBy: { name: "asc" },
  });
  return rows.map(mapPetRow);
}

async function findPetByIdAndCpf(petId: string, cpf: string): Promise<PetRow | null> {
  const row = await prisma.pet.findFirst({
    where: { pet_id: petId, client_cpf: cpf, deleted_at: null },
    select: petSelect,
  });
  return row ? mapPetRow(row) : null;
}

export type NewPetData = {
  name: string;
  species_id?: string;
  sex?: string;
  birth_date?: string;
  image_url?: string;
  is_neutered?: boolean;
  is_vaccinated?: boolean;
  breed_id?: string;
  client_cpf: string;
  vaccine_ids?: string[];
};

async function createPet(data: NewPetData): Promise<PetRow> {
  const { vaccine_ids = [], client_cpf, birth_date, ...rest } = data;

  const row = await prisma.pet.create({
    data: {
      ...rest,
      client_cpf,
      birth_date: birth_date ? new Date(birth_date) : undefined,
      pet_vaccine: vaccine_ids.length
        ? { create: vaccine_ids.map((id) => ({ vaccine_id: id })) }
        : undefined,
    },
    select: petSelect,
  });
  return mapPetRow(row);
}

export type UpdatePetData = Partial<Omit<NewPetData, "client_cpf">>;

async function updatePet(petId: string, data: UpdatePetData): Promise<PetRow> {
  const { vaccine_ids, birth_date, ...rest } = data;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (vaccine_ids !== undefined) {
      await tx.pet_vaccine.deleteMany({ where: { pet_id: petId } });
    }

    await tx.pet.update({
      where: { pet_id: petId },
      data: {
        ...rest,
        birth_date: birth_date ? new Date(birth_date) : undefined,
        updated_at: new Date(),
        pet_vaccine:
          vaccine_ids !== undefined
            ? { create: vaccine_ids.map((id) => ({ vaccine_id: id })) }
            : undefined,
      },
    });
  });

  const updated = await prisma.pet.findUniqueOrThrow({
    where: { pet_id: petId },
    select: petSelect,
  });
  return mapPetRow(updated);
}

async function softDeletePet(petId: string): Promise<{ pet_id: string } | null> {
  const existing = await prisma.pet.findFirst({
    where: { pet_id: petId, deleted_at: null },
    select: { pet_id: true },
  });
  if (!existing) return null;

  await prisma.pet.update({
    where: { pet_id: petId },
    data: { deleted_at: new Date(), updated_at: new Date() },
  });
  return { pet_id: petId };
}

export { findPetsByClientCpf, findPetByIdAndCpf, createPet, updatePet, softDeletePet };
