import { NextResponse } from "next/server";

import { backend } from "@/lib/backend";
import { getSessionToken } from "@/lib/session";

export async function GET(
	_request: Request,
	context: { params: Promise<{ recipeId: string }> },
) {
	const token = await getSessionToken();
	if (!token) {
		return new NextResponse("Não autorizado", { status: 401 });
	}

	const { recipeId } = await context.params;
	const id = recipeId.trim();
	if (!/^\d+$/.test(id)) {
		return new NextResponse("ID inválido", { status: 400 });
	}

	const res = await backend(`/client/recipes/${id}/pdf`, { token });

	if (!res.ok) {
		const body = await res.text();
		return new NextResponse(body, {
			status: res.status,
			headers: {
				"Content-Type":
					res.headers.get("Content-Type") ?? "application/json; charset=utf-8",
			},
		});
	}

	const headers = new Headers();
	const ct = res.headers.get("Content-Type");
	const cd = res.headers.get("Content-Disposition");
	if (ct) headers.set("Content-Type", ct);
	if (cd) headers.set("Content-Disposition", cd);

	return new NextResponse(res.body, { status: 200, headers });
}
