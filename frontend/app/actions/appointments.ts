"use server";

import type { Agendamento } from "@/app/dashboard/agendamentos/columns";
import { revalidatePath } from "next/cache";
import { backend, readErrorMessage } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

type ApiAppointment = {
	appointment_id: number;
	appointment_date: string;
	pet_id: string | null;
	pet_name: string | null;
	doctor_name: string | null;
	specialty_name: string | null;
};

type ApiPetOption = {
	pet_id: string;
	name: string;
};

type ApiSpecialtyOption = {
	specialty_id: string;
	name: string;
};

type ApiDoctorOption = {
	doctor_id: string;
	name: string;
	specialty_id: string | null;
};

export type AppointmentFormOptions = {
	pets: ApiPetOption[];
	specialties: ApiSpecialtyOption[];
	doctors: ApiDoctorOption[];
};

type CreateAppointmentInput = {
	pet_id: string;
	appointment_date: string;
	doctor_id: string;
	specialty_id: string;
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

export async function fetchAppointmentFormOptions(): Promise<AppointmentFormOptions> {
	const { token } = await verifySession();

	const [petsRes, specialtiesRes, doctorsRes] = await Promise.all([
		backend("/client/pets", { token }),
		backend("/client/specialties", { token }),
		backend("/client/doctors", { token }),
	]);

	const [pets, specialties, doctors] = await Promise.all([
		petsRes.ok
			? ((await petsRes.json()) as ApiPetOption[])
			: Promise.resolve([] as ApiPetOption[]),
		specialtiesRes.ok
			? ((await specialtiesRes.json()) as ApiSpecialtyOption[])
			: Promise.resolve([] as ApiSpecialtyOption[]),
		doctorsRes.ok
			? ((await doctorsRes.json()) as ApiDoctorOption[])
			: Promise.resolve([] as ApiDoctorOption[]),
	]);

	return { pets, specialties, doctors };
}

export async function createAppointmentAction(input: CreateAppointmentInput) {
	const { token } = await verifySession();

	if (
		!input.pet_id ||
		!input.appointment_date ||
		!input.doctor_id ||
		!input.specialty_id
	) {
		return { error: "Preencha todos os campos do agendamento." };
	}

	let res: Response;

	try {
		res = await backend("/client/appointments", {
			method: "POST",
			token,
			body: JSON.stringify(input),
		});
	} catch {
		return { error: "Nao foi possivel conectar ao servidor." };
	}

	if (!res.ok) {
		return {
			error: await readErrorMessage(res, "Falha ao criar o agendamento."),
		};
	}

	revalidatePath("/dashboard/agendamentos");

	return { success: true as const };
}
