"use server";

import { backend } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type HistoryItem = {
	id: number;
	date: string;
	pet_name: string;
	doctor_name: string;
};

type ApiHistoryItem = {
	appointment_id: number;
	appointment_date: string;
	pet_name: string | null;
	doctor_name: string | null;
};

export async function fetchAppointmentHistory(): Promise<HistoryItem[]> {
	const { token } = await verifySession();

	const res = await backend("/client/appointments/history", { token });

	if (!res.ok) return [];

	const rows = (await res.json()) as ApiHistoryItem[];

	return rows.map((r) => ({
		id: r.appointment_id,
		date: r.appointment_date,
		pet_name: r.pet_name ?? "—",
		doctor_name: r.doctor_name ?? "—",
	}));
}
