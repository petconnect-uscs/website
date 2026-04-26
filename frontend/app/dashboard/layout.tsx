import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/contexts/auth-context";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider>
			<main className="flex">
				<Sidebar />
				<article className="flex-1 px-15 my-16">{children}</article>
			</main>
		</AuthProvider>
	);
}
