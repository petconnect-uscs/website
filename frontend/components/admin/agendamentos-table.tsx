"use client";

import { useMemo, useState } from "react";

import { type AdminAppointment } from "@/app/actions/admin-appointments";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Status } from "@/components/ui/status";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { ChevronDownIcon, Search, XIcon } from "lucide-react";

type Props = {
	appointments: AdminAppointment[];
};

function formatDateOnly(d: Date): string {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
}

function dateOnlyIso(value: string): string {
	const d = new Date(value);
	if (Number.isNaN(d.getTime())) return "";
	return formatDateOnly(d);
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
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
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
		const dateFilterIso = dateFilter ? formatDateOnly(dateFilter) : "";

		return appointments
			.filter((a) => {
				if (
					doctorFilter !== "all" &&
					a.doctorName.toLowerCase() !== doctorFilter.toLowerCase()
				) {
					return false;
				}

				if (dateFilterIso && dateOnlyIso(a.dateTimeIso) !== dateFilterIso)
					return false;

				if (!normalizedQuery) return true;

				return (
					a.petName.toLowerCase().includes(normalizedQuery) ||
					a.ownerName.toLowerCase().includes(normalizedQuery) ||
					a.doctorName.toLowerCase().includes(normalizedQuery) ||
					a.specialtyName.toLowerCase().includes(normalizedQuery)
				);
			})
			.sort((a, b) => {
				const diffA = Math.abs(
					new Date(a.dateTimeIso).getTime() - nowReference,
				);
				const diffB = Math.abs(
					new Date(b.dateTimeIso).getTime() - nowReference,
				);
				return diffA - diffB;
			});
	}, [appointments, dateFilter, doctorFilter, nowReference, query]);

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-1.5">
				<InputGroup className="max-w-[360px]">
					<InputGroupAddon>
						<Search className="size-3.5" />
					</InputGroupAddon>
					<InputGroupInput
						placeholder="Buscar por pet, tutor, doutor ou especialidade"
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</InputGroup>

				<Select value={doctorFilter} onValueChange={setDoctorFilter}>
					<SelectTrigger className="bg-white">
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

				<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="group w-[250px] justify-between bg-white font-normal text-sm text-accent-foreground h-8! pl-3! pr-2!"
						>
							{dateFilter
								? dateFilter.toLocaleDateString("pt-BR")
								: "Filtrar por data"}
							{dateFilter ? (
								<span
									role="button"
									tabIndex={0}
									aria-label="Limpar filtro de data"
									onClick={(e) => {
										e.stopPropagation();
										setDateFilter(undefined);
									}}
								>
									<XIcon className="size-4.5 opacity-50" />
								</span>
							) : (
								<ChevronDownIcon className="size-5 opacity-50 transition-all group-data-[state=open]:rotate-180" />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto overflow-hidden p-0" align="start">
						<Calendar
							mode="single"
							selected={dateFilter}
							captionLayout="dropdown"
							onSelect={(date) => {
								setDateFilter(date);
								setDatePickerOpen(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="px-4">Pet</TableHead>
							<TableHead>Tutor</TableHead>
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
									<TableCell className="px-4">{row.petName}</TableCell>
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
