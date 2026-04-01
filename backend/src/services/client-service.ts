import * as appointmentModel from "@/models/appointment-model.ts";
import { AppError } from "@/services/auth-service.ts";

async function listAppointmentsByClient(cpf: string | undefined) {
  if (!cpf) {
    throw new AppError("CPF não informado no token", 401);
  }

  return appointmentModel.findAppointmentsByClientCpf(cpf);
}

export { listAppointmentsByClient };
