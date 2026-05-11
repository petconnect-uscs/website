"use server";

import { backend } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type Recipe = {
	id: number;
	date: string;
	pet_name: string;
	doctor_name: string;
	pdf_url: string | null;
};

type ApiRecipe = {
	recipe_id: number;
	created_at: string;
	pdf_url: string | null;
	pet_name: string | null;
	doctor_name: string | null;
};

export async function fetchRecipes(): Promise<Recipe[]> {
	const { token } = await verifySession();

	const res = await backend("/client/recipes", { token });

	if (!res.ok) return [];

	const rows = (await res.json()) as ApiRecipe[];

	return rows.map((r) => ({
		id: r.recipe_id,
		date: r.created_at,
		pet_name: r.pet_name ?? "—",
		doctor_name: r.doctor_name ?? "—",
		pdf_url: r.pdf_url ?? null,
	}));
}
