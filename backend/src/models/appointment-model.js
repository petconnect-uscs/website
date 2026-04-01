import sql from "../config/db.js";

async function findAppointmentsByClientCpf(cpf) {
  return await sql`
    SELECT
      a.appointment_id,
      a.appointment_date,

      p.pet_id,
      p.name AS pet_name,

      d.name AS doctor_name,
      s.name AS specialty_name

    FROM appointment a
    JOIN pet p ON p.pet_id = a.pet_id
    LEFT JOIN doctor d ON d.doctor_id = a.doctor_id
    LEFT JOIN specialty s ON s.specialty_id = a.specialty_id

    WHERE p.client_cpf = ${cpf}

    ORDER BY a.appointment_date DESC
  `;
}

export { findAppointmentsByClientCpf };