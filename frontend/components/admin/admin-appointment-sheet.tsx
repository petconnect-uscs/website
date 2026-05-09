"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, ChevronsUpDownIcon, CheckIcon, SearchIcon } from "lucide-react";

import {
	createAdminAppointmentAction,
	type AdminAppointmentFormOptions,
} from "@/app/actions/admin-appointments";
import { translateSpecialtyName } from "@/lib/specialty-translations";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AdminAppointmentSheetProps = {
	options: AdminAppointmentFormOptions;
};

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

const ORANGE = "#F97316";

function formatCpfDisplay(cpf: string): string {
	const d = cpf.replace(/\D/g, "");
	if (d.length !== 11) return cpf;
	return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function AdminAppointmentSheet({ options }: AdminAppointmentSheetProps) {
	const router = useRouter();
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

	const activeClient = useMemo(() => {
		return options.clients.find((c) => c.cpf === clientCpf) || null;
	}, [clientCpf, options.clients]);

	const filteredClients = useMemo(() => {
		if (!clientSearch) return options.clients;
		const q = clientSearch.toLowerCase();
		return options.clients.filter(c => 
			c.name.toLowerCase().includes(q) || 
			c.cpf.includes(q)
		);
	}, [clientSearch, options.clients]);

	const doctorOptions = useMemo(() => {
		if (!specialtyId) return options.doctors;
		return options.doctors.filter(
			(doctor) => doctor.specialty_name === options.specialties.find(s => s.specialty_id === specialtyId)?.name,
		);
	}, [options.doctors, specialtyId, options.specialties]);

	function resetForm() {
		setClientCpf("");
		setClientSearch("");
		setPetId("");
		setSpecialtyId("");
		setDoctorId("");
		setSelectedDate(null);
		setSelectedTime("");
		setError(null);
	}

	function handleSubmit() {
		setError(null);

		const appointmentDate = buildAppointmentDate(selectedDate, selectedTime);

		if (!clientCpf || !petId || !specialtyId || !doctorId || !appointmentDate) {
			setError("Preencha tutor, pet, especialidade, doutor(a), data e horário.");
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
				<Button
					type="button"
					className="rounded-lg text-white shadow-sm hover:opacity-95"
					style={{ backgroundColor: ORANGE }}
				>
					<PlusIcon className="w-4 h-4 mr-2" />
					Novo Agendamento
				</Button>
			</SheetTrigger>
			<SheetContent className="overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Agendar consulta</SheetTitle>
					<SheetDescription>Preencha os campos abaixo.</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-4 px-4 py-4">
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
							<PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[10px]" align="start">
								<div className="flex items-center border-b px-3">
									<SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
									<input
										className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="Pesquisar tutor..."
										value={clientSearch}
										onChange={(e) => setClientSearch(e.target.value)}
									/>
								</div>
								<ScrollArea className="h-[200px]">
									{filteredClients.length === 0 ? (
										<div className="py-6 text-center text-sm text-muted-foreground">Nenhum tutor encontrado.</div>
									) : (
										<div className="p-1">
											{filteredClients.map((client) => (
												<div
													key={client.cpf}
													className={cn(
														"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
														clientCpf === client.cpf ? "bg-muted font-medium" : ""
													)}
													onClick={() => {
														setClientCpf(client.cpf);
														setPetId("");
														setClientPopoverOpen(false);
														setClientSearch("");
													}}
												>
													<CheckIcon
														className={cn(
															"mr-2 h-4 w-4",
															clientCpf === client.cpf ? "opacity-100" : "opacity-0"
														)}
													/>
													<span className="truncate">{client.name}</span>
												</div>
											))}
										</div>
									)}
								</ScrollArea>
							</PopoverContent>
						</Popover>
					</div>

					<div className="flex flex-col gap-2.5">
						<Label>Pet</Label>
						<Select 
							value={petId} 
							onValueChange={setPetId}
							disabled={!activeClient || activeClient.pets.length === 0}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder={
									!activeClient ? "Selecione o tutor primeiro" : 
									activeClient.pets.length === 0 ? "Tutor sem pets" : "Selecionar"
								} />
							</SelectTrigger>
							<SelectContent>
								{activeClient?.pets.map((pet) => (
									<SelectItem key={pet.pet_id} value={pet.pet_id}>
										{pet.name} {pet.species_name ? `(${pet.species_name})` : ""}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
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
								{options.specialties.map((specialty) => (
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
							onSelect={(date) => setSelectedDate(date ?? null)}
						/>
					</div>

					<ScrollArea
						className="w-[351px] pb-4 whitespace-nowrap"
						orientation="horizontal"
					>
						<div className="flex items-center gap-2">
							{SLOT_TIMES.map((time) => (
								<button
									key={time}
									type="button"
									onClick={() => setSelectedTime(time)}
									className={`flex items-center border rounded-full px-2 py-1 ${
										selectedTime === time
											? "border-primary bg-primary text-primary-foreground"
											: "border-input"
									}`}
								>
									<span className="text-sm font-medium">{time}</span>
								</button>
							))}
						</div>
					</ScrollArea>

					{error ? <p className="text-sm text-destructive">{error}</p> : null}
				</div>

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
