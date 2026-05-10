"use server";

import { backend } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type AdminDoctor = {
	doctor_id: string;
	name: string;
	specialty_name: string | null;
};

type ApiAdminDoctor = {
	doctor_id: string;
	name: string;
	specialty: { name: string } | null;
};

export async function fetchAdminDoctors(): Promise<AdminDoctor[]> {
	const { token } = await verifySession();
	const res = await backend("/admin/doctor", { token });
	if (!res.ok) return [];

	const rows = (await res.json()) as ApiAdminDoctor[];
	return rows.map((row) => ({
		doctor_id: row.doctor_id,
		name: row.name,
		specialty_name: row.specialty?.name ?? null,
	}));
}

