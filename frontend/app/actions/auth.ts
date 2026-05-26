"use server";

import { redirect } from "next/navigation";

import { backend, readErrorMessage } from "@/lib/backend";
import { createSession, deleteSession } from "@/lib/session";

type AuthFormState = { error?: string } | undefined;

type TokenResponse = { token: string };

type AuthAction = "fazer login" | "criar a conta";

function defaultAuthError(status: number, action: AuthAction): string {
	if (status === 400 || status === 422) {
		return `Não foi possível ${action}. Verifique os dados informados.`;
	}
	if (status === 401 || status === 403) {
		return "Não autorizado. Verifique suas credenciais e tente novamente.";
	}
	if (status === 404) {
		return "Serviço de autenticação indisponível no momento.";
	}
	if (status >= 500) {
		return "Erro no servidor. Tente novamente em alguns minutos.";
	}
	if (status === 502 || status === 503) {
		return "Serviço temporariamente indisponível. Tente novamente em instantes.";
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
): Promise<{ failure?: AuthFormState; token?: string }> {
	if (!res.ok) {
		const backendMessage = await readErrorMessage(res, "");
		const showBackendMessage =
			Boolean(backendMessage) &&
			[400, 401, 403, 409, 422, 429].includes(res.status);

		if (showBackendMessage) {
			return {
				failure: {
					error: `Não foi possível ${action}: ${backendMessage}`,
				},
			};
		}

		return { failure: { error: defaultAuthError(res.status, action) } };
	}

	const data = (await res
		.json()
		.catch(() => null)) as Partial<TokenResponse> | null;

	if (!data || typeof data.token !== "string") {
		return { failure: { error: "Resposta inválida do servidor." } };
	}

	await createSession(data.token);

	return { token: data.token };
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

	const { failure } = await consumeAuthResponse(res, "fazer login");

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

	const { failure } = await consumeAuthResponse(res, "criar a conta");

	if (failure) return failure;

	redirect("/dashboard");
}

export async function logoutAction() {
	await deleteSession();

	redirect("/");
}
