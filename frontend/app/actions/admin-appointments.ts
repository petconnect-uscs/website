"use server";

import { revalidatePath } from "next/cache";
import { backend, readErrorMessage } from "@/lib/backend";
import { verifySession } from "@/lib/dal";
import type { DoctorAvailabilityResponse } from "@/app/actions/appointments";
import { type AdminClientWithPets, fetchAdminClients } from "./admin-clients";
import { type AdminDoctor, fetchAdminDoctors } from "./admin-doctors";

export type AdminAppointment = {
	id: string;
	dateTimeIso: string;
	doctorId: string | null;
	petName: string;
	ownerCpf: string | null;
	ownerName: string;
	doctorName: string;
	specialtyName: string;
	status: "concluido" | "agendado";
};

type ApiAdminAppointment = {
	appointment_id: number;
	appointment_date: string;
	pet:
		| {
				name: string | null;
				client?: { cpf?: string | null; name?: string | null } | null;
		  }
		| null;
	doctor: { doctor_id?: string | null; name: string | null } | null;
	specialty: { name: string | null } | null;
};

function toAdminAppointment(row: ApiAdminAppointment): AdminAppointment {
	const dateTimeIso = row.appointment_date;
	const isPast = new Date(dateTimeIso).getTime() < Date.now();

	return {
		id: String(row.appointment_id),
		dateTimeIso,
		doctorId: row.doctor?.doctor_id ?? null,
		petName: row.pet?.name ?? "—",
		ownerCpf: row.pet?.client?.cpf ?? null,
		ownerName: row.pet?.client?.name ?? "—",
		doctorName: row.doctor?.name ?? "—",
		specialtyName: row.specialty?.name ?? "—",
		status: isPast ? "concluido" : "agendado",
	};
}

export async function fetchAdminAppointments(): Promise<AdminAppointment[]> {
	const { token } = await verifySession();
	const res = await backend("/admin/appointments", { token });
	if (!res.ok) return [];

	const rows = (await res.json()) as ApiAdminAppointment[];
	return rows.map(toAdminAppointment);
}

export type ApiSpecialtyOption = {
	specialty_id: string;
	name: string;
};

export type AdminAppointmentFormOptions = {
	clients: AdminClientWithPets[];
	specialties: ApiSpecialtyOption[];
	doctors: AdminDoctor[];
};

export async function fetchAdminDoctorAvailabilityAction(
	doctorId: string,
): Promise<DoctorAvailabilityResponse | { error: string }> {
	const { token } = await verifySession();

	if (!doctorId.trim()) {
		return { error: "Doutor(a) não informado(a)." };
	}

	const res = await backend(
		`/admin/doctor/${encodeURIComponent(doctorId)}/availability`,
		{ token },
	);

	if (!res.ok) {
		return {
			error: await readErrorMessage(
				res,
				"Não foi possível carregar a disponibilidade do profissional.",
			),
		};
	}

	const data = (await res.json()) as DoctorAvailabilityResponse;
	return {
		booked_dates: Array.isArray(data.booked_dates) ? data.booked_dates : [],
	};
}

export async function fetchAdminAppointmentFormOptions(): Promise<AdminAppointmentFormOptions> {
	const { token } = await verifySession();

	const [clients, specialtiesRes, doctors] = await Promise.all([
		fetchAdminClients(),
		backend("/admin/specialties", { token }),
		fetchAdminDoctors(),
	]);

	const specialties = specialtiesRes.ok
		? ((await specialtiesRes.json()) as ApiSpecialtyOption[])
		: [];

	return { clients, specialties, doctors };
}

type CreateAdminAppointmentInput = {
	client_cpf: string;
	pet_id: string;
	appointment_date: string;
	doctor_id: string;
	specialty_id: string;
};

export async function createAdminAppointmentAction(input: CreateAdminAppointmentInput) {
	const { token } = await verifySession();

	if (
		!input.client_cpf ||
		!input.pet_id ||
		!input.appointment_date ||
		!input.doctor_id ||
		!input.specialty_id
	) {
		return { error: "Preencha todos os campos do agendamento." };
	}

	let res: Response;

	try {
		res = await backend("/admin/appointments", {
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

export async function cancelAdminAppointmentAction(
	appointmentId: string,
): Promise<void> {
	const { token } = await verifySession();

	const res = await backend(`/admin/appointments/${appointmentId}/cancel`, {
		method: "PATCH",
		token,
	});

	if (!res.ok) {
		throw new Error(
			await readErrorMessage(res, "Não foi possível excluir o agendamento."),
		);
	}

	revalidatePath("/dashboard/agendamentos");
}

