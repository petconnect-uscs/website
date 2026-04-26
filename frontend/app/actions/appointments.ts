import "server-only";

import type { Agendamento } from "@/app/dashboard/agendamentos/columns";
import { backend } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

type ApiAppointment = {
	appointment_id: number;
	appointment_date: string;
	pet_id: string | null;
	pet_name: string | null;
	doctor_name: string | null;
	specialty_name: string | null;
};

function mapAppointment(row: ApiAppointment): Agendamento {
	const time = new Date(row.appointment_date).getTime();
	const status: Agendamento["status"] =
		!Number.isNaN(time) && time < Date.now() ? "concluido" : "agendado";

	return {
		id: String(row.appointment_id),
		paciente: row.pet_name ?? "—",
		profissional: row.doctor_name ?? "—",
		especialidade: row.specialty_name ?? "—",
		data: row.appointment_date,
		status,
	};
}

export async function fetchAppointments(): Promise<Agendamento[]> {
	const { token } = await verifySession();

	const res = await backend("/client/appointments", { token });

	if (!res.ok) return [];

	const rows = (await res.json()) as ApiAppointment[];

	return rows.map(mapAppointment);
}
