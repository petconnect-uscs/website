"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { backend, readErrorMessage } from "@/lib/backend";
import { verifySession } from "@/lib/dal";

export type ClientProfile = {
	cpf: string;
	name: string;
	email: string;
	birth_date: string | null;
	created_at: string;
	updated_at: string;
};

export type ProfileFormState =
	| { error?: string; success?: boolean }
	| undefined;

const MIN_PASSWORD_LENGTH = 8;

export async function fetchClientProfile(): Promise<ClientProfile> {
	const { token } = await verifySession();

	let res: Response;
	try {
		res = await backend("/client/profile", { token });
	} catch {
		redirect("/");
	}

	if (!res.ok) {
		if (res.status === 401 || res.status === 403) redirect("/");
		if (res.status === 404) redirect("/dashboard");
		redirect("/dashboard");
	}

	return (await res.json()) as ClientProfile;
}

export async function updateClientProfileAction(
	_prev: ProfileFormState,
	formData: FormData,
): Promise<ProfileFormState> {
	const { token } = await verifySession();

	const initialName = String(formData.get("initial_name") ?? "").trim();
	const name = String(formData.get("name") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const passwordConfirm = String(formData.get("password_confirm") ?? "");

	const wantsPasswordChange =
		password.length > 0 || passwordConfirm.length > 0;

	if (wantsPasswordChange) {
		if (!password || !passwordConfirm) {
			return { error: "Preencha a nova senha e a confirmação." };
		}
		if (password !== passwordConfirm) {
			return { error: "As senhas não coincidem." };
		}
		if (password.length < MIN_PASSWORD_LENGTH) {
			return {
				error: `A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
			};
		}
	}

	const nameChanged = name !== initialName;

	if (!nameChanged && !wantsPasswordChange) {
		return { error: "Nenhuma alteração para salvar." };
	}

	if (nameChanged && !name) {
		return { error: "O nome não pode ficar vazio." };
	}

	const body: { name?: string; password?: string } = {};
	if (nameChanged) body.name = name;
	if (wantsPasswordChange) body.password = password;

	let res: Response;
	try {
		res = await backend("/client/profile", {
			method: "PUT",
			token,
			body: JSON.stringify(body),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	if (!res.ok) {
		const backendMessage = await readErrorMessage(res, "");
		if (backendMessage) {
			return { error: backendMessage };
		}
		if (res.status >= 500) {
			return { error: "Erro no servidor. Tente novamente em alguns minutos." };
		}
		return { error: "Não foi possível atualizar o perfil. Tente novamente." };
	}

	revalidatePath("/dashboard/configuracoes");
	revalidatePath("/dashboard");

	return { success: true };
}
