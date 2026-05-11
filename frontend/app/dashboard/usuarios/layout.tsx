import { redirect } from "next/navigation";

import { getUser } from "@/lib/dal";

export default async function UsuariosLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	if (user.role !== "admin") {
		redirect("/dashboard");
	}

	return children;
}
