"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	type AdminAppointment,
	cancelAdminAppointmentAction,
} from "@/app/actions/admin-appointments";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Status } from "@/components/ui/status";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
	ChevronDownIcon,
	MoreHorizontalIcon,
	Search,
	Trash2Icon,
	XIcon,
} from "lucide-react";
import { translateSpecialtyName } from "@/lib/specialty-translations";

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
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [doctorFilter, setDoctorFilter] = useState("all");
	const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [nowReference] = useState(() => Date.now());
	const [idToDelete, setIdToDelete] = useState<string | null>(null);
	const [isDeleting, startDeleteTransition] = useTransition();

	const appointmentToDelete = useMemo(
		() => appointments.find((a) => a.id === idToDelete) ?? null,
		[appointments, idToDelete],
	);

	function confirmDelete() {
		if (!idToDelete) return;
		startDeleteTransition(async () => {
			try {
				await cancelAdminAppointmentAction(idToDelete);
				toast.success("Agendamento excluído.");
				setIdToDelete(null);
				router.refresh();
			} catch (err) {
				toast.error(
					err instanceof Error
						? err.message
						: "Falha ao excluir agendamento.",
				);
			}
		});
	}

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
		<div className="space-y-2">
			<div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full">
				<InputGroup className="w-full sm:w-auto sm:max-w-[360px] flex-1">
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
					<SelectTrigger className="bg-white max-sm:w-full">
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
							className="group max-sm:w-full sm:w-[250px] justify-between bg-white font-normal text-sm text-accent-foreground h-8! pl-3! pr-2!"
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
								<ChevronDownIcon className="size-5 opacity-30 transition-all group-data-[state=open]:rotate-180 duration-200 group-hover:opacity-100" />
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
							<TableHead className="w-0" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredAndSorted.length > 0 ? (
							filteredAndSorted.map((row) => (
								<TableRow key={row.id}>
									<TableCell className="px-4">{row.petName}</TableCell>
									<TableCell>{row.ownerName}</TableCell>
									<TableCell>
										{translateSpecialtyName(row.specialtyName)}
									</TableCell>
									<TableCell>{row.doctorName}</TableCell>
									<TableCell>{formatDateTimeBr(row.dateTimeIso)}</TableCell>
									<TableCell>
										<Status status={row.status} />
									</TableCell>
									<TableCell className="text-right">
										{row.status === "agendado" ? (
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-muted-foreground"
														aria-label={`Ações para o agendamento de ${row.petName}`}
													>
														<MoreHorizontalIcon className="size-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-40">
													<DropdownMenuItem
														className="!text-destructive focus:bg-destructive/10"
														onClick={() => setIdToDelete(row.id)}
													>
														<Trash2Icon className="text-inherit" />
														Excluir
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										) : null}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className="h-24 text-center">
									Nenhum agendamento encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog
				open={Boolean(idToDelete)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setIdToDelete(null);
				}}
			>
				<DialogContent
					showCloseButton={!isDeleting}
					className="w-[92vw] rounded-xl sm:max-w-md"
				>
					<DialogHeader className="gap-2 pr-6">
						<DialogTitle className="leading-snug">
							Excluir agendamento?
						</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja excluir o agendamento de{" "}
							<span className="text-foreground">
								{appointmentToDelete?.petName}
							</span>{" "}
							com {appointmentToDelete?.doctorName}? <br />
							Esta ação não pode ser desfeita.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isDeleting}
							onClick={() => setIdToDelete(null)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={isDeleting}
							onClick={confirmDelete}
						>
							{isDeleting ? "Excluindo..." : "Excluir"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
