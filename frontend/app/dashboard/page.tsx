import { getUser } from "@/lib/dal";

export default async function Dashboard() {
	const user = await getUser();

	return (
		<main className="relative">
			<h1 className="text-xl font-semibold text-muted-foreground tracking-tight">
				Bem-vindo, <span className="text-foreground">{user.name}!</span>
			</h1>
		</main>
	);
}
