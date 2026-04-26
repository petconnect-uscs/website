import { type NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "pet-connect:token";

const protectedPrefixes = ["/dashboard"];
const guestOnlyRoutes = ["/", "/cadastro"];

export default function proxy(req: NextRequest) {
	const { pathname } = req.nextUrl;
	const hasSession = Boolean(req.cookies.get(TOKEN_KEY)?.value);

	const isProtected = protectedPrefixes.some(
		(prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
	);
	const isGuestOnly = guestOnlyRoutes.includes(pathname);

	if (isProtected && !hasSession) {
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	if (isGuestOnly && hasSession) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
