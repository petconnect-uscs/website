import { fetchAdminAppointments, fetchAdminAppointmentFormOptions } from "@/app/actions/admin-appointments";
import { AgendamentosTable } from "@/components/admin/agendamentos-table";
import { AdminAppointmentSheet } from "@/components/admin/admin-appointment-sheet";

function formatTodayBr() {
	return new Intl.DateTimeFormat("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date());
}

export default async function AdminAgendamentosPage() {
	const [appointments, options] = await Promise.all([
		fetchAdminAppointments(),
		fetchAdminAppointmentFormOptions(),
	]);

	return (
		<div className="relative space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="text-2xl font-semibold text-foreground tracking-tight">
						Agendamentos
					</h1>
					<p className="text-sm text-muted-foreground mt-1 capitalize">
						Hoje: {formatTodayBr()}
					</p>
				</div>
				<AdminAppointmentSheet options={options} />
			</div>
			<AgendamentosTable appointments={appointments} />
		</div>
	);
}
