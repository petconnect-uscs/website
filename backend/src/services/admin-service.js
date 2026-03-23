import bcrypt from "bcrypt";
import { AppError } from "./auth-service.js";

import * as adminModel from "../models/admin-model.js";
import * as clientModel from "../models/client-model.js";
import * as appointmentModel from "../models/appointment-model.js";
import * as recipeModel from "../models/recipe-model.js";

export async function getAdminProfile(adminId) {
  const admin = await adminModel.findAdminById(adminId);

  if (!admin) throw new AppError("Admin não encontrado", 404);

  delete admin.password;
  return admin;
}

export async function updateAdminProfile(adminId, body) {

  if (!body || Object.keys(body).length === 0) {
    throw new AppError("Body vazio", 400);
  }

  const cleanData = {};

  if (body.name) {
    cleanData.name = body.name;
  }

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    cleanData.password = hashedPassword;
  }

  if (Object.keys(cleanData).length === 0) {
    throw new AppError("Nenhum campo válido enviado", 400);
  }

  return await adminModel.updateAdminById(adminId, cleanData);
}

export async function listClientsForAdmin() {
  return await clientModel.findAllClients();
}

export async function deleteClientByCpf(cpf) {
  const deleted = await clientModel.deleteClientByCpf(cpf);

  if (!deleted) {
    throw new AppError("Cliente não encontrado", 404);
  }
}

export async function listAppointmentsForAdmin() {
  return await appointmentModel.findAllAppointments();
}

export async function listRecipesForAdmin() {
  return await recipeModel.findAllRecipes();
}