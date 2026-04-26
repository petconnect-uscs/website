"use client";

import { useAuth } from "@/contexts/auth-context";

export default function Dashboard() {
	const { user, isLoading } = useAuth();

	return (
		<main className="relative">
			<h1 className="text-xl font-semibold text-muted-foreground tracking-tight">
				Bem-vindo,{" "}
				<span className="text-foreground">
					{isLoading ? "..." : (user?.name ?? "")}!
				</span>
			</h1>
		</main>
	);
}
