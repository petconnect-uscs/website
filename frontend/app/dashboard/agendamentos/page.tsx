import { PlusIcon } from "lucide-react";

import { fetchAppointments } from "@/app/actions/appointments";
import { AppointmentSheet } from "@/components/ui/appointment-sheet";
import { Button } from "@/components/ui/button";

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function AgendamentosPage() {
	const agendamentos = await fetchAppointments();

	return (
		<main className="relative space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground tracking-tight">
					Agendamentos
				</h1>
				<AppointmentSheet>
					<Button size="sm">
						<PlusIcon className="w-4 h-4" />
						Agendar
					</Button>
				</AppointmentSheet>
			</div>
			<DataTable columns={columns} data={agendamentos} />
		</main>
	);
}
