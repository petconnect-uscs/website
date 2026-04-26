import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { backend } from "@/lib/backend";
import { getSessionToken } from "@/lib/session";
import type { AuthUser } from "@/lib/types";

export const verifySession = cache(async () => {
	const token = await getSessionToken();

	if (!token) redirect("/");

	return { token };
});

export const getUser = cache(async (): Promise<AuthUser> => {
	const { token } = await verifySession();

	const res = await backend("/auth/me", { token });

	if (!res.ok) redirect("/");

	return (await res.json()) as AuthUser;
});
