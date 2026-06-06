import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { backend } from "@/lib/backend";
import { deleteSession, getSessionToken } from "@/lib/session";
import type { AuthUser } from "@/lib/types";

async function clearSessionAndRedirectHome(): Promise<never> {
	await deleteSession();
	redirect("/");
}

export const verifySession = cache(async () => {
	const token = await getSessionToken();

	if (!token) redirect("/");

	return { token };
});

export const getUser = cache(async (): Promise<AuthUser> => {
	const { token } = await verifySession();

	const res = await backend("/auth/me", { token });

	if (res.status === 429) {
		throw new Error("Muitas requisições. Aguarde alguns instantes e tente novamente.");
	}

	if (res.status === 401 || res.status === 403 || res.status === 404) {
		await clearSessionAndRedirectHome();
	}

	if (res.status >= 500) {
		throw new Error("Erro no servidor. Tente novamente em alguns instantes.");
	}

	if (!res.ok) {
		await clearSessionAndRedirectHome();
	}

	return (await res.json()) as AuthUser;
});
