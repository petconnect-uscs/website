"use client";

import { useMemo, useState } from "react";

import {
	type AdminAppointment,
} from "@/app/actions/admin-appointments";
import { Status } from "@/components/ui/status";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

type Props = {
	appointments: AdminAppointment[];
};

function dateOnlyIso(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function formatDateTimeBr(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return value;
	return new Intl.DateTimeFormat("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(d);
}

export function AgendamentosTable({ appointments }: Props) {
	const [query, setQuery] = useState("");
	const [doctorFilter, setDoctorFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState("");
	const [nowReference] = useState(() => Date.now());

	const doctors = useMemo(() => {
		return Array.from(
			new Set(
				appointments
					.map((a) => a.doctorName)
					.filter((name) => Boolean(name) && name !== "—"),
			),
		).sort((a, b) => a.localeCompare(b, "pt-BR"));
	}, [appointments]);

	const filteredAndSorted = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();

		return appointments
			.filter((a) => {
				if (
					doctorFilter !== "all" &&
					a.doctorName.toLowerCase() !== doctorFilter.toLowerCase()
				) {
					return false;
				}

				if (dateFilter && dateOnlyIso(a.dateTimeIso) !== dateFilter) return false;

				if (!normalizedQuery) return true;

				return (
					a.petName.toLowerCase().includes(normalizedQuery) ||
					a.ownerName.toLowerCase().includes(normalizedQuery) ||
					a.doctorName.toLowerCase().includes(normalizedQuery) ||
					a.specialtyName.toLowerCase().includes(normalizedQuery)
				);
			})
			.sort((a, b) => {
				const diffA = Math.abs(new Date(a.dateTimeIso).getTime() - nowReference);
				const diffB = Math.abs(new Date(b.dateTimeIso).getTime() - nowReference);
				return diffA - diffB;
			});
	}, [appointments, dateFilter, doctorFilter, nowReference, query]);

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-end gap-4 rounded-md border bg-muted/20 p-3">
				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground">Buscar</p>
					<InputGroup>
						<InputGroupAddon>
							<Search className="size-3.5" />
						</InputGroupAddon>
						<InputGroupInput
							placeholder="Pet, dono, doutor ou especialidade"
							className="w-[320px] max-w-full bg-white"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
					</InputGroup>
				</div>

				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground">
						Filtrar por data
					</p>
					<InputGroupInput
						type="date"
						className="w-[190px] bg-white"
						value={dateFilter}
						onChange={(e) => setDateFilter(e.target.value)}
					/>
				</div>

				<div className="space-y-1">
					<p className="text-xs font-medium text-muted-foreground">
						Filtrar por doutor
					</p>
					<Select value={doctorFilter} onValueChange={setDoctorFilter}>
						<SelectTrigger className="w-[240px] bg-white">
							<SelectValue placeholder="Todos os doutores" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">Todos os doutores</SelectItem>
							{doctors.map((doctor) => (
								<SelectItem key={doctor} value={doctor}>
									{doctor}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="overflow-hidden rounded-md border bg-background px-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Pet</TableHead>
							<TableHead>Dono</TableHead>
							<TableHead>Especialidade</TableHead>
							<TableHead>Profissional</TableHead>
							<TableHead>Data e horário</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSorted.length > 0 ? (
							filteredAndSorted.map((row) => (
								<TableRow key={row.id}>
									<TableCell>{row.petName}</TableCell>
									<TableCell>{row.ownerName}</TableCell>
									<TableCell>{row.specialtyName}</TableCell>
									<TableCell>{row.doctorName}</TableCell>
									<TableCell>{formatDateTimeBr(row.dateTimeIso)}</TableCell>
									<TableCell>
										<Status status={row.status} />
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className="h-24 text-center">
									Nenhum agendamento encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

