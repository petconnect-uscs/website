import { fetchAdminAppointments } from "@/app/actions/admin-appointments";
import { fetchAdminDoctors } from "@/app/actions/admin-doctors";
import { HomeDoctorsTable } from "@/components/admin/home-doctors-table";
import { getUser } from "@/lib/dal";

export default async function Dashboard() {
	const user = await getUser();

	if (user.role === "admin") {
		const [doctors, appointments] = await Promise.all([
			fetchAdminDoctors(),
			fetchAdminAppointments(),
		]);

		return (
			<div className="relative space-y-6">
				<div className="flex items-start justify-between gap-4">
					<div className="flex flex-col gap-0.5">
						<h1 className="text-2xl font-semibold text-foreground tracking-tight">
							{user.name}
						</h1>
						<p className="text text-muted-foreground">
							Atendimentos mais recentes da clínica
						</p>
					</div>
				</div>
				<HomeDoctorsTable doctors={doctors} appointments={appointments} />
			</div>
		);
	}

	return (
		<main className="relative">
			<h1 className="text-xl font-semibold text-muted-foreground tracking-tight">
				Bem-vindo, <span className="text-foreground">{user.name}!</span>
			</h1>
		</main>
	);
}
