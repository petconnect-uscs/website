import { listAppointmentsByClient } from "../services/client-service.js";

export async function getAppointments(req, res, next) {
  try {
    const cpf = req.user.cpf;

    const data = await listAppointmentsByClient(cpf);

    res.json(data);
  } catch (err) {
    next(err);
  }
}