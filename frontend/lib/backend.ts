import "server-only";

// URL do seu backend que está rodando no terminal
const API_URL =
	process.env.API_URL ??
	process.env.NEXT_PUBLIC_API_URL ??
	"http://localhost:8100";

// Esta chave DEVE ser igual ao APP_API_KEY do seu backend .env
const API_KEY = 
	process.env.API_KEY ?? 
	process.env.NEXT_PUBLIC_API_KEY ?? 
	"petconnect_secret_123";

type BackendOptions = RequestInit & { token?: string | null };

export function backend(path: string, options: BackendOptions = {}) {
	const { token, headers, body, ...rest } = options;

	const finalHeaders = new Headers(headers);

	// Se houver chave de API, ela é enviada aqui para o backend autorizar
	if (API_KEY) {
		finalHeaders.set("X-API-Key", API_KEY);
	}

	// Se o usuário estiver logado, envia o token de autenticação
	if (token) {
		finalHeaders.set("Authorization", `Bearer ${token}`);
	}

	// Define que estamos enviando dados em formato JSON
	if (body !== undefined && !finalHeaders.has("Content-Type")) {
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

		// Tenta pegar a mensagem de erro que o backend enviou
		if (data && typeof data === "object") {
			if ("error" in data && typeof data.error === "string") return data.error;
			if ("message" in data && typeof data.message === "string") return data.message;
		}
	} catch {
		// Se o backend não retornar um JSON válido, usamos o fallback
	}

	return fallback;
}
