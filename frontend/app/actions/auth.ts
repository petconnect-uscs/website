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
	const birthDate = String(formData.get("birth_date") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const acceptedTerms = formData.get("terms") === "on";

	if (!name || !cpf || !birthDate || !email || !password) {
		return { error: "Preencha todos os campos." };
	}
	if (!acceptedTerms) {
		return { error: "Você precisa aceitar os termos de uso." };
	}

	let res: Response;

	try {
		res = await backend("/auth/register", {
			method: "POST",
			body: JSON.stringify({ name, cpf, birth_date: birthDate, email, password }),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	const { failure } = await consumeAuthResponse(res, "criar a conta");

	if (failure) return failure;

	redirect("/dashboard");
}

type ResetRequestState = { error?: string; success?: boolean } | undefined;

export async function forgotPasswordAction(
	_prev: ResetRequestState,
	formData: FormData,
): Promise<ResetRequestState> {
	const email = String(formData.get("email") ?? "").trim();

	if (!email) {
		return { error: "Informe seu e-mail." };
	}

	let res: Response;

	try {
		res = await backend("/auth/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	if (!res.ok) {
		if (res.status === 429) {
			return {
				error:
					"Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.",
			};
		}

		const message = await readErrorMessage(res, "");

		if (message && [400, 401, 403, 422].includes(res.status)) {
			return { error: message };
		}

		return {
			error:
				"Não foi possível enviar o e-mail de recuperação. Tente novamente.",
		};
	}

	return { success: true };
}

type ResetPasswordState = { error?: string; success?: boolean } | undefined;

const MIN_PASSWORD_LENGTH = 8;

export async function resetPasswordAction(
	_prev: ResetPasswordState,
	formData: FormData,
): Promise<ResetPasswordState> {
	const token = String(formData.get("token") ?? "").trim();
	const password = String(formData.get("password") ?? "");
	const passwordConfirm = String(formData.get("password_confirm") ?? "");

	if (!token) {
		return {
			error: "Link de recuperação inválido ou ausente. Solicite um novo.",
		};
	}
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

	let res: Response;

	try {
		res = await backend("/auth/reset-password", {
			method: "POST",
			body: JSON.stringify({
				token,
				password,
				password_confirm: passwordConfirm,
			}),
		});
	} catch {
		return { error: "Não foi possível conectar ao servidor." };
	}

	if (!res.ok) {
		if (res.status === 429) {
			return {
				error:
					"Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.",
			};
		}

		const message = await readErrorMessage(res, "");

		if (message && [400, 422].includes(res.status)) {
			return { error: message };
		}

		return {
			error:
				"Não foi possível redefinir a senha. O link pode ter expirado. Solicite um novo.",
		};
	}

	return { success: true };
}

export async function logoutAction() {
	await deleteSession();

	redirect("/");
}
