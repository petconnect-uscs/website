import "server-only";

const API_URL =
	process.env.API_URL ??
	process.env.NEXT_PUBLIC_API_URL ??
	"http://localhost:3002";
const API_KEY = process.env.API_KEY ?? process.env.NEXT_PUBLIC_API_KEY ?? "";

type BackendOptions = RequestInit & { token?: string | null };

export function backend(path: string, options: BackendOptions = {}) {
	const { token, headers, body, ...rest } = options;

	const finalHeaders = new Headers(headers);

	if (API_KEY) finalHeaders.set("X-API-Key", API_KEY);

	if (token) finalHeaders.set("Authorization", `Bearer ${token}`);

	if (
		body !== undefined &&
		!(body instanceof FormData) &&
		!finalHeaders.has("Content-Type")
	) {
		finalHeaders.set("Content-Type", "application/json");
	}

	return fetch(`${API_URL}${path}`, {
		...rest,
		headers: finalHeaders,
		body,
		cache: "no-store",
	});
}

export async function readErrorMessage(res: Response, fallback: string) {
	try {
		const data = await res.json();

		if (
			data &&
			typeof data === "object" &&
			"error" in data &&
			typeof (data as { error: unknown }).error === "string"
		) {
			return (data as { error: string }).error;
		}
	} catch {}

	return fallback;
}
