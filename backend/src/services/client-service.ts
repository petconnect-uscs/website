import bcrypt from "bcrypt";
import * as appointmentModel from "@/models/appointment-model.ts";
import * as clientModel from "@/models/client-model.ts";
import * as recipeModel from "@/models/recipe-model.ts";
import { AppError } from "@/services/auth-service.ts";

async function listAppointmentsByClient(cpf: string | undefined) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  return appointmentModel.findAppointmentsByClientCpf(cpf);
}

async function getClientProfile(cpf: string | undefined) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  const profile = await clientModel.findActiveClientProfileByCpf(cpf);
  if (!profile) {
    throw new AppError("Cliente não encontrado", 404);
  }

  return profile;
}

async function updateClientProfile(
  cpf: string | undefined,
  body: { name?: string; password?: string }
) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

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

  const updated = await clientModel.updateClientByCpf(cpf, cleanData);
  if (!updated) {
    throw new AppError("Cliente não encontrado", 404);
  }

  return updated;
}

async function listRecipesByClient(cpf: string | undefined) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  return recipeModel.findRecipesByClientCpf(cpf);
}

export {
  listAppointmentsByClient,
  getClientProfile,
  updateClientProfile,
  listRecipesByClient,
};
