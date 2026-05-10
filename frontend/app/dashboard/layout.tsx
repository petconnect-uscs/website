import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/dal";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	return (
		<main className="flex min-h-dvh">
			<Sidebar user={user} />
			<article className="flex-1 px-15 py-16">{children}</article>
		</main>
	);
}
