import bcrypt from "bcrypt";
import { AppError } from "@/services/auth-service.ts";
import * as adminModel from "@/models/admin-model.ts";
import * as clientModel from "@/models/client-model.ts";
import * as appointmentModel from "@/models/appointment-model.ts";
import * as recipeModel from "@/models/recipe-model.ts";
import * as doctorModel from "@/models/doctor-model.ts";
import * as specialtyModel from "@/models/specialty-model.ts";
import * as breedModel from "@/models/breed-model.ts";
import prisma from "@/prisma-client.ts";

function isUniqueConstraintViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}

async function assertSpecialtyExistsForDoctor(specialtyId: string) {
  const row = await prisma.specialty.findFirst({
    where: { specialty_id: specialtyId, deleted_at: null },
  });
  if (!row) throw new AppError("Especialidade não encontrada", 404);
}

async function getAdminProfile(adminId: string) {
  const admin = await adminModel.findAdminById(adminId);

  if (!admin) throw new AppError("Admin não encontrado", 404);

  const { password: _p, ...rest } = admin;
  return rest;
}

async function updateAdminProfile(
  adminId: string,
  body: { name?: string; password?: string }
) {
  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Body vazio", 400);
  }

  const cleanData: { name?: string; password?: string } = {};

  if (body.name) {
    cleanData.name = body.name;
  }

  if (body.password) {
    cleanData.password = await bcrypt.hash(body.password, 10);
  }

  if (Object.keys(cleanData).length === 0) {
    throw new AppError("Nenhum campo válido enviado", 400);
  }

  return adminModel.updateAdminById(adminId, cleanData);
}

async function listClientsForAdmin() {
  return clientModel.findAllClients();
}

async function deleteClientByCpf(cpf: string) {
  const deleted = await clientModel.deleteClientByCpf(cpf);

  if (!deleted) {
    throw new AppError("Cliente não encontrado", 404);
  }
}

async function listAppointmentsForAdmin() {
  return appointmentModel.findAllAppointments();
}

async function listRecipesForAdmin() {
  return recipeModel.findAllRecipes();
}

async function listDoctorsForAdmin() {
  return doctorModel.findAllDoctors();
}

async function listSpecialtiesForAdmin() {
  return specialtyModel.findAllSpecialties();
}

async function createSpecialtyForAdmin(
  body: { name?: string; description?: string | null },
  adminId: string | undefined
) {
  if (!adminId) throw new AppError("Não autenticado", 401);

  const name = body.name?.trim();
  if (!name) throw new AppError("Nome é obrigatório", 400);

  let description: string | null | undefined = undefined;
  if (body.description !== undefined) {
    const raw = body.description;
    if (raw === null) {
      description = null;
    } else {
      const d = String(raw).trim();
      description = d === "" ? null : d;
    }
  }

  try {
    return await specialtyModel.createSpecialty({
      name,
      description,
      admin_id: adminId,
    });
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      throw new AppError("Especialidade já cadastrada", 409);
    }
    throw err;
  }
}

async function updateSpecialtyForAdmin(
  specialtyId: string,
  body: { name?: string; description?: string | null }
) {
  const existing = await specialtyModel.findSpecialtyById(specialtyId);
  if (!existing) throw new AppError("Especialidade não encontrada", 404);

  const clean: { name?: string; description?: string | null } = {};

  if (body.name !== undefined) {
    const n = String(body.name).trim();
    if (!n) throw new AppError("Nome inválido", 400);
    clean.name = n;
  }

  if (body.description !== undefined) {
    if (body.description === null) {
      clean.description = null;
    } else {
      const d = String(body.description).trim();
      clean.description = d === "" ? null : d;
    }
  }

  if (Object.keys(clean).length === 0) {
    throw new AppError("Body vazio", 400);
  }

  try {
    return await specialtyModel.updateSpecialty(specialtyId, clean);
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      throw new AppError("Especialidade já cadastrada", 409);
    }
    throw err;
  }
}

async function deleteSpecialtyForAdmin(specialtyId: string) {
  const existing = await specialtyModel.findSpecialtyById(specialtyId);
  if (!existing) throw new AppError("Especialidade não encontrada", 404);

  const [doctorCount, appointmentCount] = await Promise.all([
    specialtyModel.countActiveDoctorsBySpecialty(specialtyId),
    specialtyModel.countActiveAppointmentsBySpecialty(specialtyId),
  ]);

  if (doctorCount > 0) {
    throw new AppError(
      "Não é possível remover: há doutores ativos vinculados à especialidade",
      409
    );
  }
  if (appointmentCount > 0) {
    throw new AppError(
      "Não é possível remover: há agendamentos ativos vinculados à especialidade",
      409
    );
  }

  const deleted = await specialtyModel.softDeleteSpecialty(specialtyId);
  if (!deleted) throw new AppError("Especialidade não encontrada", 404);
}

async function getDoctorForAdmin(doctorId: string) {
  const doctor = await doctorModel.findDoctorById(doctorId);
  if (!doctor) throw new AppError("Doutor não encontrado", 404);
  return doctor;
}

async function createDoctorForAdmin(
  body: { name?: string; cpf?: string; specialty_id?: string | null },
  adminId: string | undefined
) {
  if (!adminId) throw new AppError("Não autenticado", 401);

  const name = body.name?.trim();
  const cpf = body.cpf?.trim();
  if (!name || !cpf) {
    throw new AppError("Nome e CPF são obrigatórios", 400);
  }

  const specialtyRaw = body.specialty_id;
  const specialty_id =
    specialtyRaw == null || specialtyRaw === ""
      ? null
      : String(specialtyRaw).trim();
  if (specialty_id) {
    await assertSpecialtyExistsForDoctor(specialty_id);
  }

  try {
    return await doctorModel.createDoctor({
      name,
      cpf,
      specialty_id: specialty_id || undefined,
      admin_id: adminId,
    });
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      throw new AppError("CPF já cadastrado", 409);
    }
    throw err;
  }
}

async function updateDoctorForAdmin(
  doctorId: string,
  body: { name?: string; cpf?: string; specialty_id?: string | null }
) {
  const existing = await doctorModel.findDoctorById(doctorId);
  if (!existing) throw new AppError("Doutor não encontrado", 404);

  const clean: {
    name?: string;
    cpf?: string;
    specialty_id?: string | null;
  } = {};

  if (body.name !== undefined) {
    const n = String(body.name).trim();
    if (!n) throw new AppError("Nome inválido", 400);
    clean.name = n;
  }
  if (body.cpf !== undefined) {
    const c = String(body.cpf).trim();
    if (!c) throw new AppError("CPF inválido", 400);
    clean.cpf = c;
  }
  if (body.specialty_id !== undefined) {
    const sid =
      body.specialty_id === null || body.specialty_id === ""
        ? null
        : String(body.specialty_id).trim();
    if (sid) await assertSpecialtyExistsForDoctor(sid);
    clean.specialty_id = sid;
  }

  if (Object.keys(clean).length === 0) {
    throw new AppError("Body vazio", 400);
  }

  try {
    return await doctorModel.updateDoctor(doctorId, clean);
  } catch (err) {
    if (isUniqueConstraintViolation(err)) {
      throw new AppError("CPF já cadastrado", 409);
    }
    throw err;
  }
}

async function deleteDoctorForAdmin(doctorId: string) {
  const deleted = await doctorModel.softDeleteDoctor(doctorId);
  if (!deleted) throw new AppError("Doutor não encontrado", 404);
}

async function createRecipeForAdmin(
  body: {
    description?: string;
    pet_id?: string;
    client_cpf?: string;
    doctor_id?: string | null;
    pdf_url?: string | null;
  },
  adminId: string | undefined
) {
  if (!adminId) throw new AppError("Não autenticado", 401);

  const description = body.description?.trim();
  const pet_id = body.pet_id?.trim();
  const client_cpf = body.client_cpf?.trim();

  if (!description || !pet_id || !client_cpf) {
    throw new AppError(
      "description, pet_id e client_cpf são obrigatórios",
      400
    );
  }

  return recipeModel.createRecipe({
    description,
    pet_id,
    client_cpf,
    doctor_id: body.doctor_id ?? null,
    pdf_url: body.pdf_url ?? null,
    admin_id: adminId,
  });
}

async function deleteRecipeForAdmin(recipeId: number) {
  const deleted = await recipeModel.softDeleteRecipe(recipeId);
  if (!deleted) throw new AppError("Receita não encontrada", 404);
}

async function listBreedsForAdmin() {
  return breedModel.findAllBreeds();
}

async function createBreedForAdmin(body: { name?: string; description?: string | null }, adminId: string | undefined) {
  if (!adminId) throw new AppError("Não autenticado", 401);
  return breedModel.createBreed(body);
}

async function updateBreedForAdmin(breedId: string, body: { name?: string; description?: string | null }) {
  return breedModel.updateBreed(breedId, body);
}

async function deleteBreedForAdmin(breedId: string) {
  return breedModel.deleteBreed(breedId);
}

export {
  getAdminProfile,
  updateAdminProfile,
  listClientsForAdmin,
  deleteClientByCpf,
  listAppointmentsForAdmin,
  listRecipesForAdmin,
  listDoctorsForAdmin,
  listSpecialtiesForAdmin,
  createSpecialtyForAdmin,
  updateSpecialtyForAdmin,
  deleteSpecialtyForAdmin,
  getDoctorForAdmin,
  createDoctorForAdmin,
  updateDoctorForAdmin,
  deleteDoctorForAdmin,
  createRecipeForAdmin,
  deleteRecipeForAdmin,
  listBreedsForAdmin,
  createBreedForAdmin,
  updateBreedForAdmin,
  deleteBreedForAdmin,
};
