import bcrypt from "bcrypt";
import prisma from "@/prisma-client.ts";
import * as appointmentModel from "@/models/appointment-model.ts";
import * as clientModel from "@/models/client-model.ts";
import * as recipeModel from "@/models/recipe-model.ts";
import * as doctorModel from "@/models/doctor-model.ts";
import * as specialtyModel from "@/models/specialty-model.ts";
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

async function createAppointment(
  cpf: string | undefined,
  body: {
    pet_id?: string;
    appointment_date?: string;
    doctor_id?: string;
    specialty_id?: string;
  }
) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  const { pet_id, appointment_date, doctor_id, specialty_id } = body ?? {};

  if (!pet_id || !appointment_date || !doctor_id || !specialty_id) {
    throw new AppError(
      "Os campos pet_id, appointment_date, doctor_id e specialty_id são obrigatórios.",
      400
    );
  }

  const date = new Date(appointment_date);
  if (isNaN(date.getTime())) {
    throw new AppError("appointment_date inválida.", 400);
  }
  if (date <= new Date()) {
    throw new AppError("A data do agendamento deve ser futura.", 400);
  }

  const pet = await prisma.pet.findFirst({
    where: { pet_id, client_cpf: cpf, deleted_at: null },
  });
  if (!pet) {
    throw new AppError("Pet não encontrado ou não pertence a este cliente.", 403);
  }

  return appointmentModel.createAppointment({
    pet_id,
    appointment_date: date,
    doctor_id,
    specialty_id,
  });
}

async function listClientPets(cpf: string | undefined) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  return prisma.pet.findMany({
    where: { client_cpf: cpf, deleted_at: null },
    select: { pet_id: true, name: true },
    orderBy: { name: "asc" },
  });
}

async function listSpecialties() {
  return specialtyModel.findAllSpecialties();
}

async function listDoctors(specialtyId?: string) {
  if (specialtyId) {
    return doctorModel.findDoctorsBySpecialtyId(specialtyId);
  }
  return doctorModel.findAllDoctors();
}

async function getDoctorAvailability(doctorId: string | undefined) {
  if (!doctorId) {
    throw new AppError("doctorId não informado", 400);
  }

  const booked = await appointmentModel.findBookedDatesByDoctor(doctorId);

  return {
    booked_dates: booked.map((d) => d.toISOString()),
  };
}

export {
  listAppointmentsByClient,
  getClientProfile,
  updateClientProfile,
  listRecipesByClient,
  createAppointment,
  listClientPets,
  listSpecialties,
  listDoctors,
  getDoctorAvailability,
};
