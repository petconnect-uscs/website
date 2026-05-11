"use server";

import { revalidatePath } from "next/cache";

import { backend } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type AdminClientPet = {
	pet_id: string;
	name: string;
	birth_date: string | null;
	sex: string | null;
	breed_name: string | null;
	species_name: string | null;
	image_url: string | null;
	is_neutered: boolean | null;
	is_vaccinated: boolean | null;
	client_cpf: string | null;
	breed_id: string | null;
	species_id: string | null;
	created_at: string;
	updated_at: string;
	vaccines: string[];
};

export type AdminClientWithPets = {
	cpf: string;
	name: string;
	email: string;
	birth_date: string | null;
	pets: AdminClientPet[];
};

export async function fetchAdminClients(): Promise<AdminClientWithPets[]> {
	const { token } = await verifySession();

	const res = await backend("/admin/clients", { token });

	if (!res.ok) return [];

	return (await res.json()) as AdminClientWithPets[];
}

export async function createAdminClient(payload: {
	name?: string;
	cpf?: string;
	email?: string;
	password?: string;
	birth_date?: string | null;
}): Promise<{ cpf: string }> {
	const { token } = await verifySession();

	const res = await backend("/admin/clients", {
		token,
		method: "POST",
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const msg = await res.json().catch(() => null);
		throw new Error(
			typeof msg?.error === "string" && msg.error
				? msg.error
				: "Não foi possível cadastrar o usuário.",
		);
	}

	return (await res.json()) as { cpf: string };
}

export async function deleteAdminClient(cpf: string): Promise<void> {
	const { token } = await verifySession();

	const res = await backend(`/admin/clients/${cpf}`, {
		token,
		method: "DELETE",
	});

	if (!res.ok) {
		const msg = await res.json().catch(() => null);
		throw new Error(
			typeof msg?.error === "string" && msg.error
				? msg.error
				: "Não foi possível excluir o usuário.",
		);
	}

	revalidatePath("/dashboard/usuarios");
}
