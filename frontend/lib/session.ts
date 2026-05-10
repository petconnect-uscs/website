import "server-only";

import { cookies } from "next/headers";

const TOKEN_KEY = "pet-connect:token";
const ONE_WEEK_SECONDS = 60 * 60 * 24 * 7;

export async function createSession(token: string) {
	const cookieStore = await cookies();
	cookieStore.set(TOKEN_KEY, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: ONE_WEEK_SECONDS,
	});
}

export async function deleteSession() {
	const cookieStore = await cookies();
	cookieStore.delete(TOKEN_KEY);
}

export async function getSessionToken(): Promise<string | null> {
	const cookieStore = await cookies();
	return cookieStore.get(TOKEN_KEY)?.value ?? null;
}
