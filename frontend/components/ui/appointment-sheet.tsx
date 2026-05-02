"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";

import {
	createAppointmentAction,
	type AppointmentFormOptions,
} from "@/app/actions/appointments";
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
import { Calendar } from "./calendar";
import { ScrollArea } from "./scroll-area";

type AppointmentSheetProps = {
	options?: AppointmentFormOptions;
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

export function AppointmentSheet({ options }: AppointmentSheetProps) {
	const safeOptions: AppointmentFormOptions = options ?? {
		pets: [],
		specialties: [],
		doctors: [],
	};

	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [petId, setPetId] = useState("");
	const [specialtyId, setSpecialtyId] = useState("");
	const [doctorId, setDoctorId] = useState("");
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	const doctorOptions = useMemo(() => {
		if (!specialtyId) return safeOptions.doctors;
		return safeOptions.doctors.filter(
			(doctor) => doctor.specialty_id === specialtyId,
		);
	}, [safeOptions.doctors, specialtyId]);

	function resetForm() {
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

		if (!petId || !specialtyId || !doctorId || !appointmentDate) {
			setError("Preencha pet, especialidade, doutor(a), data e horario.");
			return;
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
					Agendar
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Agendar consulta</SheetTitle>
					<SheetDescription>Preencha os campos abaixo.</SheetDescription>
				</SheetHeader>
				<div className="grid flex-1 auto-rows-min gap-4 px-4">
					<div className="flex flex-col gap-2.5">
						<Label>Pet</Label>
						<Select value={petId} onValueChange={setPetId}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Selecionar" />
							</SelectTrigger>
							<SelectContent>
								{safeOptions.pets.map((pet) => (
									<SelectItem key={pet.pet_id} value={pet.pet_id}>
										{pet.name}
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
								{safeOptions.specialties.map((specialty) => (
									<SelectItem
										key={specialty.specialty_id}
										value={specialty.specialty_id}
									>
										{specialty.name}
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
