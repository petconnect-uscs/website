import { Sidebar } from "@/components/sidebar";
import { getUser } from "@/lib/dal";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	return (
		<main className="flex flex-col md:flex-row min-h-dvh w-full">
			<Sidebar user={user} />
			<article className="flex-1 px-4 py-6 md:px-15 md:pt-16 md:pb-0 w-full overflow-x-hidden">
				{children}
			</article>
		</main>
	);
}
