"use client";

import { useMemo, useState } from "react";

import type { AdminAppointment } from "@/app/actions/admin-appointments";
import type { AdminDoctor } from "@/app/actions/admin-doctors";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-is-mobile";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { translateSpecialtyName } from "@/lib/specialty-translations";

type Props = {
	doctors: AdminDoctor[];
	appointments: AdminAppointment[];
};

type DoctorRow = {
	doctorId: string;
	doctorName: string;
	specialtyName: string;
	lastPetName: string;
	lastOwnerName: string;
	lastOwnerCpf: string | null;
};

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

export function HomeDoctorsTable({ doctors, appointments }: Props) {
	const isMobile = useIsMobile();
	const [activeDoctorId, setActiveDoctorId] = useState<string | null>(null);
	const [nowReference] = useState(() => Date.now());

	const doctorRows = useMemo<DoctorRow[]>(() => {
		return doctors.map((doctor) => {
			const concludedForDoctor = appointments
				.filter(
					(a) =>
						a.doctorId === doctor.doctor_id &&
						new Date(a.dateTimeIso).getTime() < nowReference,
				)
				.sort(
					(a, b) =>
						new Date(b.dateTimeIso).getTime() -
						new Date(a.dateTimeIso).getTime(),
				);

			const last = concludedForDoctor[0];
			return {
				doctorId: doctor.doctor_id,
				doctorName: doctor.name,
				specialtyName: last?.specialtyName || doctor.specialty_name || "—",
				lastPetName: last?.petName || "—",
				lastOwnerName: last?.ownerName || "—",
				lastOwnerCpf: last?.ownerCpf ?? null,
			};
		});
	}, [appointments, doctors, nowReference]);

	const upcomingForDoctor = useMemo(() => {
		if (!activeDoctorId) return [];

		return appointments
			.filter(
				(a) =>
					a.doctorId === activeDoctorId &&
					new Date(a.dateTimeIso).getTime() >= nowReference,
			)
			.sort(
				(a, b) =>
					new Date(a.dateTimeIso).getTime() - new Date(b.dateTimeIso).getTime(),
			);
	}, [activeDoctorId, appointments, nowReference]);

	const activeDoctorName = useMemo(() => {
		if (!activeDoctorId) return "Doutor";
		return (
			doctors.find((d) => d.doctor_id === activeDoctorId)?.name || "Doutor"
		);
	}, [activeDoctorId, doctors]);

	const agendaContent = (
		<div className="flex flex-col gap-2 px-4 pt-2">
						<h1 className="text-lg font-semibold text-foreground tracking-tight flex items-baseline gap-1">
							Agenda
							{upcomingForDoctor.length > 0 && (
								<sup className="text-xs font-semibold text-primary">
									({upcomingForDoctor.length})
								</sup>
							)}
						</h1>

						{upcomingForDoctor.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								Não há próximos agendamentos para este doutor.
							</p>
						) : (
							<ul className="grid gap-2">
								{upcomingForDoctor.map((a) => (
									<li
										key={a.id}
										className="flex flex-col gap-3 rounded-lg border border-border bg-white px-3.5 py-3"
									>
										<h3 className="font-semibold text-foreground">
											{a.petName}
										</h3>
										<div className="flex flex-col">
											<p className="text-sm text-muted-foreground">
												Especialidade
											</p>
											<p className="text-sm text-foreground font-medium">
												{translateSpecialtyName(a.specialtyName)}
											</p>
										</div>
										<div className="flex flex-col">
											<p className="text-sm text-muted-foreground">Paciente</p>
											<p className="text-sm text-foreground font-medium">
												{a.ownerName}
											</p>
										</div>
										<div className="flex flex-col">
											<p className="text-sm text-muted-foreground">
												Data e Hora
											</p>
											<p className="text-sm text-foreground font-medium">
												{formatDateTimeBr(a.dateTimeIso)}
											</p>
										</div>
									</li>
								))}
							</ul>
						)}
		</div>
	);

	const drawerOrSheet = isMobile ? (
		<Drawer
			open={Boolean(activeDoctorId)}
			onOpenChange={(open) => {
				if (!open) setActiveDoctorId(null);
			}}
		>
			<DrawerContent className="max-h-[90vh]">
				<DrawerHeader className="text-left">
					<DrawerTitle className="truncate">{activeDoctorName}</DrawerTitle>
					<DrawerDescription>Próximos agendamentos</DrawerDescription>
				</DrawerHeader>
				<div className="overflow-y-auto pb-4">
					{agendaContent}
				</div>
			</DrawerContent>
		</Drawer>
	) : (
		<Sheet
			open={Boolean(activeDoctorId)}
			onOpenChange={(open) => {
				if (!open) setActiveDoctorId(null);
			}}
		>
			<SheetContent className="overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="truncate">{activeDoctorName}</SheetTitle>
					<SheetDescription>Próximos agendamentos</SheetDescription>
				</SheetHeader>
				{agendaContent}
			</SheetContent>
		</Sheet>
	);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="px-4">Doutor</TableHead>
							<TableHead>Especialidade</TableHead>
							<TableHead>Paciente</TableHead>
							<TableHead>Dono do pet</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{doctorRows.length > 0 ? (
							doctorRows.map((row) => {
								const active = activeDoctorId === row.doctorId;
								return (
									<TableRow
										key={row.doctorId}
										onClick={() => setActiveDoctorId(row.doctorId)}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												e.preventDefault();
												setActiveDoctorId(row.doctorId);
											}
										}}
										tabIndex={0}
										role="button"
										className={cn(
											"cursor-pointer hover:bg-neutral-50/80",
											active && "bg-neutral-50/70",
										)}
									>
										<TableCell className="px-4">{row.doctorName}</TableCell>
										<TableCell>
											{translateSpecialtyName(row.specialtyName)}
										</TableCell>
										<TableCell>{row.lastPetName}</TableCell>
										<TableCell>{row.lastOwnerName}</TableCell>
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={5} className="h-24 text-center">
									Nenhum doutor encontrado.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{drawerOrSheet}
		</div>
	);
}
