import { fetchAdminAppointments } from "@/app/actions/admin-appointments";
import { fetchAdminDoctors } from "@/app/actions/admin-doctors";
import { HomeDoctorsTable } from "@/components/admin/home-doctors-table";

import { Link } from "next-view-transitions";

import { getUser } from "@/lib/dal";
import { fetchAppointments } from "@/app/actions/appointments";
import { fetchAppointmentHistory } from "@/app/actions/history";
import { fetchRecipes } from "@/app/actions/recipes";
import { columns } from "@/app/dashboard/agendamentos/columns";
import { DataTable } from "@/app/dashboard/agendamentos/data-table";
import { HistorySheet } from "@/components/ui/history-sheet";
import { RecipesSheet } from "@/components/ui/recipes-sheet";

export default async function Dashboard() {
	const [user, agendamentos, history, recipes] = await Promise.all([
		getUser(),
		fetchAppointments(),
		fetchAppointmentHistory(),
		fetchRecipes(),
	]);

	const proximos = agendamentos
		.filter((a) => a.status === "agendado")
		.slice(0, 5);

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
		<main className="relative space-y-8">
			<div className="flex items-center justify-between gap-4">
				<h1 className="text-xl font-semibold text-muted-foreground tracking-tight">
					Bem-vindo, <span className="text-foreground">{user.name}!</span>
				</h1>
				<div className="flex items-center gap-2">
					<RecipesSheet items={recipes} />
					<HistorySheet items={history} />
				</div>
			</div>

			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h2 className="text-lg font-semibold tracking-tight">
						Próximos agendamentos
					</h2>
					<Link
						href="/dashboard/agendamentos"
						className="text-sm text-muted-foreground hover:text-foreground transition-colors"
					>
						Ver todos
					</Link>
				</div>
				<DataTable columns={columns} data={proximos} />
			</section>
		</main>
	);
}
