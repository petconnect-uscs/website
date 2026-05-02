import { AppError } from "@/services/auth-service.ts";
import * as petModel from "@/models/pet-model.ts";
import * as breedModel from "@/models/breed-model.ts";
import * as vaccineModel from "@/models/vaccine-model.ts";
import * as speciesModel from "@/models/species-model.ts";

function requireCpf(cpf: string | undefined): string {
  if (!cpf) throw new AppError("CPF não informado no token", 401);
  return cpf;
}

async function listPetsByClient(cpf: string | undefined) {
  const validCpf = requireCpf(cpf);
  return petModel.findPetsByClientCpf(validCpf);
}

async function getPetByClient(
  petId: string | undefined,
  cpf: string | undefined,
) {
  const validCpf = requireCpf(cpf);
  if (!petId) throw new AppError("ID do pet não informado", 400);

  const pet = await petModel.findPetByIdAndCpf(petId, validCpf);
  if (!pet) throw new AppError("Pet não encontrado", 404);
  return pet;
}

async function createPetForClient(
  body: Record<string, unknown>,
  cpf: string | undefined,
) {
  const validCpf = requireCpf(cpf);

  const name = (body.name as string | undefined)?.trim();
  if (!name) throw new AppError("O campo name é obrigatório", 400);

  return petModel.createPet({
    name,
    species_id: body.species_id as string | undefined,
    sex: body.sex as string | undefined,
    birth_date: body.birth_date as string | undefined,
    image_url: body.image_url as string | undefined,
    is_neutered: body.is_neutered as boolean | undefined,
    is_vaccinated: body.is_vaccinated as boolean | undefined,
    breed_id: body.breed_id as string | undefined,
    vaccine_ids: body.vaccine_ids as string[] | undefined,
    client_cpf: validCpf,
  });
}

async function updatePetForClient(
  petId: string | undefined,
  body: Record<string, unknown>,
  cpf: string | undefined,
) {

  const validCpf = requireCpf(cpf);
  if (!petId) throw new AppError("ID do pet não informado", 400);

  const existing = await petModel.findPetByIdAndCpf(petId, validCpf);
  if (!existing) throw new AppError("Pet não encontrado", 404);

  const allowedFields = [
    "name",
    "species_id",
    "sex",
    "birth_date",
    "image_url",
    "is_neutered",
    "is_vaccinated",
    "breed_id",
    "vaccine_ids",
  ];
  
  const hasField = allowedFields.some((f) => body[f] !== undefined);
  if (!hasField)
    throw new AppError("Nenhum campo válido fornecido para atualização", 400);

  return petModel.updatePet(petId, {
    name: body.name as string | undefined,
    species_id: body.species_id as string | undefined,
    sex: body.sex as string | undefined,
    birth_date: body.birth_date as string | undefined,
    image_url: body.image_url as string | undefined,
    is_neutered: body.is_neutered as boolean | undefined,
    is_vaccinated: body.is_vaccinated as boolean | undefined,
    breed_id: body.breed_id as string | undefined,
    vaccine_ids: body.vaccine_ids as string[] | undefined,
  });
}

async function deletePetForClient(
  petId: string | undefined,
  cpf: string | undefined,
) {
  const validCpf = requireCpf(cpf);
  if (!petId) throw new AppError("ID do pet não informado", 400);

  const existing = await petModel.findPetByIdAndCpf(petId, validCpf);
  if (!existing) throw new AppError("Pet não encontrado", 404);

  return petModel.softDeletePet(petId);
}

async function listBreeds() {
  return breedModel.findAllBreeds();
}

async function listVaccines() {
  return vaccineModel.findAllVaccines();
}

async function listSpecies() {
  return speciesModel.findAllSpecies();
}

export {
  listPetsByClient,
  getPetByClient,
  createPetForClient,
  updatePetForClient,
  deletePetForClient,
  listBreeds,
  listVaccines,
  listSpecies,
};
