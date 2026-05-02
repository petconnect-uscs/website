"use server";

import { revalidatePath } from "next/cache";
import { backend, readErrorMessage } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type Pet = {
	pet_id: string;
	name: string;
	species_id: string | null;
	species_name: string | null;
	sex: string | null;
	birth_date: string | null;
	image_url: string | null;
	is_neutered: boolean | null;
	is_vaccinated: boolean | null;
	breed_id: string | null;
	breed_name: string | null;
	vaccines: { vaccine_id: string; name: string }[];
};

export type PetOption = { id: string; name: string };

export type PetOptions = {
	species: PetOption[];
	breeds: PetOption[];
	vaccines: PetOption[];
};

type CreatePetInput = {
	name: string;
	species_id?: string;
	species_name?: string;
	sex?: string;
	birth_date?: string;
	image_url?: string;
	is_neutered?: boolean;
	is_vaccinated?: boolean;
	breed_id?: string;
	vaccine_ids?: string[];
};

export async function fetchPets(): Promise<Pet[]> {
	const { token } = await verifySession();

	const res = await backend("/client/pets", { token });

	if (!res.ok) return [];

	return (await res.json()) as Pet[];
}

export async function fetchPetOptions(): Promise<PetOptions> {
	const { token } = await verifySession();

	const [speciesRes, breedsRes, vaccinesRes] = await Promise.all([
		backend("/client/pets/species", { token }),
		backend("/client/pets/breeds", { token }),
		backend("/client/pets/vaccines", { token }),
	]);

	const [species, breeds, vaccines] = await Promise.all([
		speciesRes.ok
			? (
					(await speciesRes.json()) as { species_id: string; name: string }[]
				).map((s) => ({ id: s.species_id, name: s.name }))
			: [],
		breedsRes.ok
			? ((await breedsRes.json()) as { breed_id: string; name: string }[]).map(
					(b) => ({ id: b.breed_id, name: b.name }),
				)
			: [],
		vaccinesRes.ok
			? (
					(await vaccinesRes.json()) as { vaccine_id: string; name: string }[]
				).map((v) => ({ id: v.vaccine_id, name: v.name }))
			: [],
	]);

	return { species, breeds, vaccines };
}

export async function uploadPetImageAction(formData: FormData) {
	const { token } = await verifySession();

	const file = formData.get("image");
	if (!(file instanceof File) || file.size === 0) {
		return { error: "Imagem inválida." };
	}

	const upstream = new FormData();
	upstream.append("image", file);

	let res: Response;
	try {
		res = await backend("/client/pets/upload", {
			method: "POST",
			token,
			body: upstream,
		});
	} catch {
		return { error: "Não foi possível enviar a imagem." };
	}

	if (!res.ok) {
		return { error: await readErrorMessage(res, "Falha ao enviar a imagem.") };
	}

	const data = (await res.json()) as { image_url: string };
	return { image_url: data.image_url };
}

export async function createPetAction(input: CreatePetInput) {
	const { token } = await verifySession();

	if (!input.name?.trim()) {
		return { error: "O campo nome é obrigatório." };
	}

	let res: Response;

	try {
		res = await backend("/client/pets", {
			method: "POST",
			token,
			body: JSON.stringify(input),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	if (!res.ok) {
		const text = await res.text();

		console.error("[createPetAction] backend error", res.status, text);

		let message = `Falha ao cadastrar o pet (HTTP ${res.status}).`;

		try {
			const parsed = JSON.parse(text);

			if (typeof parsed?.error === "string") message = parsed.error;
		} catch {}

		return { error: message };
	}

	revalidatePath("/dashboard/pets");

	return { success: true as const };
}
