"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Matcher } from "react-day-picker";
import {
	CheckIcon,
	ChevronsUpDownIcon,
	PlusIcon,
	SearchIcon,
} from "lucide-react";

import {
	createAdminAppointmentAction,
	type AdminAppointmentFormOptions,
} from "@/app/actions/admin-appointments";
import {
	createAppointmentAction,
	fetchDoctorAvailabilityAction,
	type AppointmentFormOptions,
} from "@/app/actions/appointments";
import {
	fullyBookedLocalDayKeys,
	indexBookedHoursByLocalDay,
	localDayKey,
} from "@/lib/appointment-availability";
import { translateSpecialtyName } from "@/lib/specialty-translations";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "./calendar";
import { ScrollArea } from "./scroll-area";

type AppointmentSheetProps =
	| { mode?: "client"; options?: AppointmentFormOptions }
	| { mode: "admin"; options: AdminAppointmentFormOptions };

const SLOT_TIMES = Array.from(
	{ length: 24 },
	(_v, hour) => `${String(hour).padStart(2, "0")}:00`,
);

function buildAppointmentDate(date: Date | null, time: string): string | null {
	if (!date || !time) return null;

	const [hours, minutes] = time.split(":").map(Number);
	const merged = new Date(date);

	merged.setHours(hours, minutes, 0, 0);

	if (Number.isNaN(merged.getTime())) return null;

	return merged.toISOString();
}

function slotTimestampMs(date: Date | null, time: string): number | null {
	const iso = buildAppointmentDate(date, time);
	if (!iso) return null;
	const t = new Date(iso).getTime();
	return Number.isNaN(t) ? null : t;
}

export function AppointmentSheet(props: AppointmentSheetProps) {
	const isMobile = useIsMobile();
	const isAdmin = props.mode === "admin";

	const clientOptions: AppointmentFormOptions = isAdmin
		? { pets: [], specialties: [], doctors: [] }
		: (props.options ?? { pets: [], specialties: [], doctors: [] });

	const adminOptions: AdminAppointmentFormOptions = isAdmin
		? props.options
		: { clients: [], specialties: [], doctors: [] };

	const router = useRouter();
	const sheetContentRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState(false);

	const [clientCpf, setClientCpf] = useState("");
	const [clientSearch, setClientSearch] = useState("");
	const [clientPopoverOpen, setClientPopoverOpen] = useState(false);

	const [petId, setPetId] = useState("");
	const [specialtyId, setSpecialtyId] = useState("");
	const [doctorId, setDoctorId] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const [bookedDatesIso, setBookedDatesIso] = useState<string[]>([]);
	const [availabilityLoading, setAvailabilityLoading] = useState(false);
	const [availabilityError, setAvailabilityError] = useState<string | null>(
		null,
	);

	const activeClient = useMemo(() => {
		if (!isAdmin) return null;
		return adminOptions.clients.find((c) => c.cpf === clientCpf) ?? null;
	}, [adminOptions.clients, clientCpf, isAdmin]);

	const filteredClients = useMemo(() => {
		if (!isAdmin) return [];
		if (!clientSearch) return adminOptions.clients;
		const q = clientSearch.toLowerCase();
		return adminOptions.clients.filter(
			(c) => c.name.toLowerCase().includes(q) || c.cpf.includes(q),
		);
	}, [adminOptions.clients, clientSearch, isAdmin]);

	const doctorOptions = useMemo(() => {
		if (isAdmin) {
			if (!specialtyId) return adminOptions.doctors;
			return adminOptions.doctors.filter(
				(doctor) => doctor.specialty_id === specialtyId,
			);
		}
		if (!specialtyId) return clientOptions.doctors;
		return clientOptions.doctors.filter(
			(doctor) => doctor.specialty_id === specialtyId,
		);
	}, [adminOptions.doctors, clientOptions.doctors, isAdmin, specialtyId]);

	const specialties = isAdmin
		? adminOptions.specialties
		: clientOptions.specialties;

	const bookedByDay = useMemo(
		() => indexBookedHoursByLocalDay(isAdmin ? [] : bookedDatesIso),
		[isAdmin, bookedDatesIso],
	);

	const fullyBookedKeys = useMemo(
		() => fullyBookedLocalDayKeys(bookedByDay),
		[bookedByDay],
	);

	const startOfToday = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

	const calendarDisabled = useMemo((): Matcher | Matcher[] => {
		const matchers: Matcher[] = [{ before: startOfToday }];
		if (!isAdmin && fullyBookedKeys.size > 0) {
			matchers.push((date) => fullyBookedKeys.has(localDayKey(date)));
		}
		return matchers;
	}, [startOfToday, isAdmin, fullyBookedKeys]);

	useEffect(() => {
		if (isAdmin) {
			setBookedDatesIso([]);
			setAvailabilityLoading(false);
			setAvailabilityError(null);
			return;
		}

		if (!doctorId) {
			setBookedDatesIso([]);
			setAvailabilityLoading(false);
			setAvailabilityError(null);
			return;
		}

		let cancelled = false;
		setAvailabilityLoading(true);
		setAvailabilityError(null);

		void (async () => {
			const result = await fetchDoctorAvailabilityAction(doctorId);
			if (cancelled) return;

			setAvailabilityLoading(false);

			if ("error" in result) {
				setBookedDatesIso([]);
				setAvailabilityError(result.error);
				return;
			}

			setBookedDatesIso(result.booked_dates);
		})();

		return () => {
			cancelled = true;
		};
	}, [isAdmin, doctorId]);

	useEffect(() => {
		if (!isAdmin || !doctorId) return;
		const stillListed = doctorOptions.some((d) => d.doctor_id === doctorId);
		if (!stillListed) setDoctorId("");
	}, [isAdmin, doctorId, doctorOptions]);

	useEffect(() => {
		if (!selectedDate || isAdmin) return;
		const key = localDayKey(selectedDate);
		if (fullyBookedKeys.has(key)) {
			setSelectedDate(null);
			setSelectedTime("");
		}
	}, [isAdmin, selectedDate, fullyBookedKeys]);

	useEffect(() => {
		if (!selectedDate || !selectedTime) return;

		const ts = slotTimestampMs(selectedDate, selectedTime);
		if (ts !== null && ts < Date.now()) {
			setSelectedTime("");
			return;
		}

		if (isAdmin) return;

		const key = localDayKey(selectedDate);
		const hour = Number.parseInt(selectedTime.slice(0, 2), 10);
		if (!Number.isNaN(hour) && bookedByDay.get(key)?.has(hour)) {
			setSelectedTime("");
		}
	}, [selectedDate, selectedTime, isAdmin, bookedByDay]);

	function resetForm() {
		setClientCpf("");
		setClientSearch("");
		setPetId("");
		setSpecialtyId("");
		setDoctorId("");
		setSelectedDate(null);
		setSelectedTime("");
		setError(null);
		setBookedDatesIso([]);
		setAvailabilityLoading(false);
		setAvailabilityError(null);
	}

	function handleSubmit() {
		setError(null);

		const appointmentDate = buildAppointmentDate(selectedDate, selectedTime);

		if (isAdmin) {
			if (!clientCpf) {
				setError("Selecione o tutor.");
				return;
			}
			if (!petId) {
				setError("Selecione o pet.");
				return;
			}
			if (!specialtyId) {
				setError("Selecione a especialidade.");
				return;
			}
			if (!doctorId) {
				setError("Selecione o doutor(a).");
				return;
			}
			if (!selectedDate || !selectedTime) {
				setError("Selecione a data e o horário.");
				return;
			}
			if (!appointmentDate) {
				setError("Data ou horário inválido. Escolha novamente o horário.");
				return;
			}

			const adminSlotTs = slotTimestampMs(selectedDate, selectedTime);
			if (adminSlotTs !== null && adminSlotTs < Date.now()) {
				setError("Escolha uma data e horário no futuro.");
				return;
			}

			startTransition(async () => {
				const result = await createAdminAppointmentAction({
					client_cpf: clientCpf,
					pet_id: petId,
					specialty_id: specialtyId,
					doctor_id: doctorId,
					appointment_date: appointmentDate,
				});

				if ("error" in result) {
					setError(result.error ?? "Falha ao criar o agendamento.");
					return;
				}

				resetForm();
				setOpen(false);
				router.refresh();
			});
			return;
		}

		if (!petId || !specialtyId || !doctorId || !appointmentDate) {
			setError("Preencha pet, especialidade, doutor(a), data e horario.");
			return;
		}

		const slotTs = slotTimestampMs(selectedDate, selectedTime);
		if (slotTs !== null && slotTs < Date.now()) {
			setError("Escolha uma data e horário no futuro.");
			return;
		}

		if (selectedDate && selectedTime) {
			const key = localDayKey(selectedDate);
			const hour = Number.parseInt(selectedTime.slice(0, 2), 10);
			if (!Number.isNaN(hour) && bookedByDay.get(key)?.has(hour)) {
				setError("Este horário já está ocupado para o profissional escolhido.");
				return;
			}
		}

		startTransition(async () => {
			const result = await createAppointmentAction({
				pet_id: petId,
				specialty_id: specialtyId,
				doctor_id: doctorId,
				appointment_date: appointmentDate,
			});

			if ("error" in result) {
				setError(result.error ?? "Falha ao criar o agendamento.");
				return;
			}

			resetForm();
			setOpen(false);
			router.refresh();
		});
	}

	const innerForm = (
		<div className="grid flex-1 auto-rows-min gap-4 px-4">
			{isAdmin ? (
				<div className="flex flex-col gap-2.5">
					<Label>Tutor</Label>
					<Popover open={clientPopoverOpen} onOpenChange={setClientPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={clientPopoverOpen}
								className="w-full justify-between font-normal hover:bg-transparent px-3 rounded-[10px]"
							>
								<span className="truncate">
									{activeClient ? activeClient.name : "Selecionar"}
								</span>
								<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							container={sheetContentRef.current}
							className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[10px]"
							align="start"
						>
							<div className="flex items-center border-b px-3">
								<SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
								<input
									className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
									placeholder="Pesquisar"
									value={clientSearch}
									onChange={(e) => setClientSearch(e.target.value)}
								/>
							</div>
							<div className="overflow-y-auto max-h-50">
								{filteredClients.length === 0 ? (
									<div className="py-6 text-center text-sm text-muted-foreground">
										Nenhum tutor encontrado.
									</div>
								) : (
									<div className="p-1">
										{filteredClients.map((client) => (
											<button
												key={client.cpf}
												className={cn(
													"relative w-full flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
													clientCpf === client.cpf
														? "bg-muted font-medium"
														: "",
												)}
												onClick={() => {
													setClientCpf(client.cpf);
													setPetId("");
													setClientPopoverOpen(false);
													setClientSearch("");
												}}
											>
												<span className="truncate">{client.name}</span>
												<CheckIcon
													className={cn(
														"ml-auto h-4 w-4",
														clientCpf === client.cpf
															? "opacity-100"
															: "opacity-0",
													)}
												/>
											</button>
										))}
									</div>
								)}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			) : null}

			<div className="flex flex-col gap-2.5">
				<Label>Pet</Label>
				{isAdmin ? (
					<Select
						value={petId}
						onValueChange={setPetId}
						disabled={!activeClient || activeClient.pets.length === 0}
					>
						<SelectTrigger className="w-full">
							<SelectValue
								placeholder={
									!activeClient
										? "Selecione o tutor primeiro"
										: activeClient.pets.length === 0
											? "Tutor sem pets"
											: "Selecionar"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{activeClient?.pets.map((pet) => (
								<SelectItem key={pet.pet_id} value={pet.pet_id}>
									{pet.name} {pet.species_name ? `(${pet.species_name})` : ""}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				) : (
					<Select value={petId} onValueChange={setPetId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Selecionar" />
						</SelectTrigger>
						<SelectContent>
							{clientOptions.pets.map((pet) => (
								<SelectItem key={pet.pet_id} value={pet.pet_id}>
									{pet.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>

			<div className="flex flex-col gap-2.5">
				<Label>Especialidade</Label>
				<Select
					value={specialtyId}
					onValueChange={(value) => {
						setSpecialtyId(value);
						setDoctorId("");
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecionar" />
					</SelectTrigger>
					<SelectContent>
						{specialties.map((specialty) => (
							<SelectItem
								key={specialty.specialty_id}
								value={specialty.specialty_id}
							>
								{translateSpecialtyName(specialty.name)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="flex flex-col gap-2.5">
				<Label>Doutor(a)</Label>
				<Select value={doctorId} onValueChange={setDoctorId}>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Selecionar" />
					</SelectTrigger>
					<SelectContent>
						{doctorOptions.map((doctor) => (
							<SelectItem key={doctor.doctor_id} value={doctor.doctor_id}>
								{doctor.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="border border-input rounded-[10px] overflow-hidden">
				<Calendar
					mode="single"
					className="w-full"
					selected={selectedDate ?? undefined}
					captionLayout="dropdown"
					disabled={calendarDisabled}
					onSelect={(date) => {
						if (!date) {
							setSelectedDate(null);
							return;
						}
						const normalized = new Date(
							date.getFullYear(),
							date.getMonth(),
							date.getDate(),
						);
						setSelectedDate(normalized);
					}}
				/>
			</div>

			{!isAdmin && availabilityLoading ? (
				<p className="text-xs text-muted-foreground">
					A carregar disponibilidade do profissional…
				</p>
			) : null}
			{!isAdmin && availabilityError ? (
				<p className="text-xs text-destructive">{availabilityError}</p>
			) : null}

			<ScrollArea
				className="w-[351px] pb-4 whitespace-nowrap"
				orientation="horizontal"
			>
				<div className="flex items-center gap-2">
					{SLOT_TIMES.map((time) => {
						const ts = slotTimestampMs(selectedDate, time);
						const inPast = ts !== null && ts < Date.now();
						const key = selectedDate ? localDayKey(selectedDate) : "";
						const hour = Number.parseInt(time.slice(0, 2), 10);
						const booked =
							!isAdmin &&
							selectedDate !== null &&
							!Number.isNaN(hour) &&
							(bookedByDay.get(key)?.has(hour) ?? false);
						const slotDisabled = inPast || booked;

						return (
							<button
								key={time}
								type="button"
								disabled={slotDisabled}
								onClick={() => {
									if (!slotDisabled) setSelectedTime(time);
								}}
								className={cn(
									"flex items-center border rounded-full px-2 py-1 transition-opacity",
									selectedTime === time
										? "border-primary bg-primary text-primary-foreground"
										: "border-input",
									slotDisabled &&
										"opacity-40 pointer-events-none cursor-not-allowed",
								)}
							>
								<span className="text-sm font-medium">{time}</span>
							</button>
						);
					})}
				</div>
			</ScrollArea>

			{error ? <p className="text-sm text-destructive">{error}</p> : null}
		</div>
	);

	if (isMobile) {
		return (
			<Drawer
				open={open}
				onOpenChange={(nextOpen) => {
					setOpen(nextOpen);
					if (!nextOpen) resetForm();
				}}
			>
				<DrawerTrigger asChild>
					<Button className="shrink-0">
						<PlusIcon className="w-4 h-4" />
						Novo
					</Button>
				</DrawerTrigger>
				<DrawerContent className={cn(isAdmin && "max-h-[90vh]")}>
					<DrawerHeader className="text-left">
						<DrawerTitle>Agendar consulta</DrawerTitle>
						<DrawerDescription>Preencha os campos abaixo.</DrawerDescription>
					</DrawerHeader>
					<ScrollArea className="overflow-y-auto max-h-[60vh] px-2">
						{innerForm}
					</ScrollArea>
					<DrawerFooter>
						<Button type="button" onClick={handleSubmit} disabled={isPending}>
							{isPending ? "Agendando..." : "Agendar"}
						</Button>
						<DrawerClose asChild>
							<Button variant="outline" disabled={isPending}>
								Cancelar
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<Sheet
			open={open}
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) resetForm();
			}}
		>
			<SheetTrigger asChild>
				<Button className="shrink-0">
					<PlusIcon className="w-4 h-4" />
					Novo
				</Button>
			</SheetTrigger>
			<SheetContent
				ref={sheetContentRef}
				className={cn(isAdmin && "overflow-y-auto")}
			>
				<SheetHeader>
					<SheetTitle>Agendar consulta</SheetTitle>
					<SheetDescription>Preencha os campos abaixo.</SheetDescription>
				</SheetHeader>
				{innerForm}
				<SheetFooter>
					<Button type="button" onClick={handleSubmit} disabled={isPending}>
						{isPending ? "Agendando..." : "Agendar"}
					</Button>
					<SheetClose asChild>
						<Button variant="outline" disabled={isPending}>
							Cancelar
						</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
