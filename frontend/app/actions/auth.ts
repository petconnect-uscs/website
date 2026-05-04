"use server";

import { redirect } from "next/navigation";

import { backend, readErrorMessage } from "@/lib/backend";
import { createSession, deleteSession } from "@/lib/session";

type AuthFormState = { error?: string } | undefined;

type TokenResponse = { token: string };

type AuthAction = "fazer login" | "criar a conta";

function defaultAuthError(status: number, action: AuthAction): string {
	if (status >= 500) {
		return "Erro no servidor. Tente novamente em alguns minutos.";
	}
	if (status === 429) {
		return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
	}
	if (status === 408 || status === 504) {
		return "Tempo limite excedido. Verifique sua conexão e tente novamente.";
	}
	return `Não foi possível ${action}. Verifique os dados e tente novamente.`;
}

async function consumeAuthResponse(
	res: Response,
	action: AuthAction,
): Promise<AuthFormState> {
	if (!res.ok) {
		const backendMessage = await readErrorMessage(res, "");

		if (backendMessage) {
			return { error: `Não foi possível ${action}: ${backendMessage}` };
		}

		return { error: defaultAuthError(res.status, action) };
	}

	const data = (await res
		.json()
		.catch(() => null)) as Partial<TokenResponse> | null;

	if (!data || typeof data.token !== "string") {
		return { error: "Resposta inválida do servidor." };
	}

	await createSession(data.token);

	return undefined;
}

export async function loginAction(
	_prev: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!email || !password) {
		return { error: "E-mail e senha são obrigatórios." };
	}

	let res: Response;

	try {
		res = await backend("/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	const failure = await consumeAuthResponse(res, "fazer login");

	if (failure) return failure;

	redirect("/dashboard");
}

export async function signupAction(
	_prev: AuthFormState,
	formData: FormData,
): Promise<AuthFormState> {
	const name = String(formData.get("name") ?? "").trim();
	const cpf = String(formData.get("cpf") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const acceptedTerms = formData.get("terms") === "on";

	if (!name || !cpf || !email || !password) {
		return { error: "Preencha todos os campos." };
	}
	if (!acceptedTerms) {
		return { error: "Você precisa aceitar os termos de uso." };
	}

	let res: Response;

	try {
		res = await backend("/auth/register", {
			method: "POST",
			body: JSON.stringify({ name, cpf, email, password }),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	const failure = await consumeAuthResponse(res, "criar a conta");

	if (failure) return failure;

	redirect("/dashboard");
}

export async function logoutAction() {
	await deleteSession();

	redirect("/");
}
