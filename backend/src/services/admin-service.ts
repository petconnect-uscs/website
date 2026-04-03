import bcrypt from "bcrypt";
import { AppError } from "@/services/auth-service.ts";
import * as adminModel from "@/models/admin-model.ts";
import * as clientModel from "@/models/client-model.ts";
import * as appointmentModel from "@/models/appointment-model.ts";
import * as recipeModel from "@/models/recipe-model.ts";

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

export {
  getAdminProfile,
  updateAdminProfile,
  listClientsForAdmin,
  deleteClientByCpf,
  listAppointmentsForAdmin,
  listRecipesForAdmin,
};
