import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { getUser } from "@/lib/dal";

export default async function DashboardAdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUser();

	if (!("admin_id" in user) || !user.admin_id) {
		redirect("/dashboard");
	}

	return (
		<main className="flex h-screen overflow-hidden bg-[#F5F5F5]">
			<AdminSidebar user={user} />
			<article className="flex-1 overflow-y-auto px-15 py-16">{children}</article>
		</main>
	);
}

