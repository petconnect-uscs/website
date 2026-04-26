"use client";

import { useEffect, useState } from "react";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, api } from "@/lib/api";

import { columns, type Agendamento } from "./columns";
import { DataTable } from "./data-table";

type ApiAppointment = {
	appointment_id: number;
	appointment_date: string;
	pet_id: string | null;
	pet_name: string | null;
	doctor_name: string | null;
	specialty_name: string | null;
};

function mapAppointment(row: ApiAppointment): Agendamento {
	const time = new Date(row.appointment_date).getTime();
	const status: Agendamento["status"] =
		!Number.isNaN(time) && time < Date.now() ? "concluido" : "agendado";

	return {
		id: String(row.appointment_id),
		paciente: row.pet_name ?? "—",
		profissional: row.doctor_name ?? "—",
		especialidade: row.specialty_name ?? "—",
		data: row.appointment_date,
		status,
	};
}

export default function AgendamentosPage() {
	const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		api<ApiAppointment[]>("/client/appointments")
			.then((rows) => {
				if (cancelled) return;
				setAgendamentos(rows.map(mapAppointment));
				setIsLoading(false);
			})
			.catch((err) => {
				if (cancelled) return;
				const message =
					err instanceof ApiError
						? err.message
						: "Erro ao carregar agendamentos.";
				toast.error(message);
				setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<main className="relative space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold text-foreground">Agendamentos</h1>
				<Button>
					<PlusIcon className="w-4 h-4" />
					Agendar
				</Button>
			</div>
			{isLoading ? (
				<AgendamentosSkeleton />
			) : (
				<DataTable columns={columns} data={agendamentos} />
			)}
		</main>
	);
}

function AgendamentosSkeleton() {
	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-md border bg-background">
				<div className="flex items-center gap-6 border-b px-4 py-3">
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-4 w-20" />
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-4 w-16" />
				</div>

				{Array.from({ length: 8 }).map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-6 border-b px-4 py-3 last:border-b-0"
					>
						<Skeleton className="h-4 w-4" />
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-5 w-20 rounded-full" />
					</div>
				))}
			</div>

			<div className="flex items-center justify-end gap-2">
				<Skeleton className="h-8 w-20" />
				<Skeleton className="h-8 w-20" />
			</div>
		</div>
	);
}
