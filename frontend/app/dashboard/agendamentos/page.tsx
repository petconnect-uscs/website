import {
	fetchAdminAppointmentFormOptions,
	fetchAdminAppointments,
} from "@/app/actions/admin-appointments";
import {
	fetchAppointmentFormOptions,
	fetchAppointments,
} from "@/app/actions/appointments";
import { AgendamentosTable } from "@/components/admin/agendamentos-table";
import { AppointmentSheet } from "@/components/ui/appointment-sheet";
import { getUser } from "@/lib/dal";

import { columns } from "./columns";
import { DataTable } from "./data-table";

function formatTodayBr() {
	return new Intl.DateTimeFormat("pt-BR", {
		weekday: "long",
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date());
}

export default async function AgendamentosPage() {
	const user = await getUser();

	if (user.role === "admin") {
		const [appointments, options] = await Promise.all([
			fetchAdminAppointments(),
			fetchAdminAppointmentFormOptions(),
		]);

		return (
			<div className="relative space-y-6">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-2xl font-semibold text-foreground tracking-tight">
						Agendamentos
					</h1>
					<AppointmentSheet mode="admin" options={options} />
				</div>
				<AgendamentosTable appointments={appointments} />
			</div>
		);
	}

	const [agendamentos, options] = await Promise.all([
		fetchAppointments(),
		fetchAppointmentFormOptions(),
	]);

	return (
		<main className="relative space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground tracking-tight">
					Agendamentos
				</h1>
				<AppointmentSheet options={options} />
			</div>
			<DataTable columns={columns} data={agendamentos} />
		</main>
	);
}
