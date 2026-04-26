import { getToken } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

export class ApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

type ApiOptions = Omit<RequestInit, "body"> & {
	body?: unknown;
	auth?: boolean;
};

export async function api<T = unknown>(
	path: string,
	options: ApiOptions = {},
): Promise<T> {
	const { body, auth = true, headers, ...rest } = options;

	const finalHeaders = new Headers(headers);
	finalHeaders.set("Content-Type", "application/json");
	if (API_KEY) finalHeaders.set("X-API-Key", API_KEY);

	if (auth) {
		const token = getToken();
		if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
	}

	const res = await fetch(`${API_URL}${path}`, {
		...rest,
		headers: finalHeaders,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});

	const text = await res.text();
	const data = text ? (JSON.parse(text) as unknown) : null;

	if (!res.ok) {
		const errorField =
			data && typeof data === "object" && "error" in data
				? (data as { error: unknown }).error
				: undefined;
		const message =
			typeof errorField === "string" ? errorField : `Erro ${res.status}`;
		throw new ApiError(message, res.status);
	}

	return data as T;
}
