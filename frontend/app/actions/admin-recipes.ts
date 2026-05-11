"use server";

import { revalidatePath } from "next/cache";

import { backend, readErrorMessage } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export async function uploadAdminRecipePdfAction(formData: FormData) {
	const { token } = await verifySession();

	const res = await backend("/admin/recipes/upload", {
		method: "POST",
		token,
		body: formData,
	});

	if (!res.ok) {
		return { error: await readErrorMessage(res, "Falha ao enviar o arquivo.") };
	}

	return (await res.json()) as { pdf_url: string };
}

export async function createAdminRecipeAction(data: {
	client_cpf: string;
	pet_id: string;
	doctor_id?: string | null;
	pdf_url: string;
}) {
	const { token } = await verifySession();

	const res = await backend("/admin/recipes", {
		method: "POST",
		token,
		body: JSON.stringify({
			...data,
			description: "Receita enviada via painel",
		}),
	});

	if (!res.ok) {
		return { error: await readErrorMessage(res, "Falha ao criar receita.") };
	}

	revalidatePath("/dashboard");
	return { success: true as const };
}
