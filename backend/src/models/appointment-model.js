import sql from "../config/db.js";

export async function findAllAppointments() {
  return await sql`
    SELECT
      a.appointment_id,
      a.appointment_date,
      row_to_json(p.*) AS pet,
      row_to_json(d.*) AS doctor,
      row_to_json(s.*) AS specialty
    FROM appointment a
    LEFT JOIN pet p ON p.pet_id = a.pet_id
    LEFT JOIN doctor d ON d.doctor_id = a.doctor_id
    LEFT JOIN specialty s ON s.specialty_id = a.specialty_id
    ORDER BY a.appointment_date DESC
  `;
}