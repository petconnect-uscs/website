import * as appointmentModel from "../models/appointment-model.js";
import { AppError } from "./auth-service.js";

export async function listAppointmentsByClient(cpf) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  const appointments = await appointmentModel.findAppointmentsByClientCpf(cpf);

  return appointments;
}