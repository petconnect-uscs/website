"use client";

import { useMemo, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import type { AdminAppointment } from "@/app/actions/admin-appointments";
import type { AdminDoctor } from "@/app/actions/admin-doctors";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

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
						new Date(b.dateTimeIso).getTime() - new Date(a.dateTimeIso).getTime(),
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
		return doctors.find((d) => d.doctor_id === activeDoctorId)?.name || "Doutor";
	}, [activeDoctorId, doctors]);

	return (
		<div className="space-y-4">
			<div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
				<Table className="table-fixed">
					<TableHeader>
						<TableRow className="bg-neutral-100/70 hover:bg-neutral-100/70">
							<TableHead className="px-4">Doutor</TableHead>
							<TableHead className="px-4">Especialidade</TableHead>
							<TableHead className="px-4">Paciente</TableHead>
							<TableHead className="px-4">Dono do pet</TableHead>
							<TableHead className="w-[150px] px-4 text-center">Agenda</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{doctorRows.length > 0 ? (
							doctorRows.map((row) => (
								<TableRow
									key={row.doctorId}
									className="transition-colors hover:bg-neutral-100/35"
								>
									<TableCell className="px-4 font-medium">{row.doctorName}</TableCell>
									<TableCell className="px-4">{row.specialtyName}</TableCell>
									<TableCell className="px-4">{row.lastPetName}</TableCell>
									<TableCell className="px-4">{row.lastOwnerName}</TableCell>
									<TableCell className="w-[150px] px-4">
										<div className="flex justify-center">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => setActiveDoctorId(row.doctorId)}
											>
												Visualizar
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
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

			<AnimatePresence>
				{activeDoctorId && (
					<>
						<motion.button
							type="button"
							aria-label="Fechar agenda"
							className="fixed inset-0 z-40 bg-black/30"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setActiveDoctorId(null)}
						/>
						<motion.aside
							className={cn(
								"fixed right-0 top-0 z-50 h-dvh w-full sm:w-[430px]",
								"border-l border-neutral-200 bg-white shadow-xl",
								"flex flex-col",
							)}
							initial={{ x: 430, opacity: 0.95 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 430, opacity: 0.95 }}
							transition={{ type: "spring", stiffness: 380, damping: 34 }}
						>
							<div className="px-5 py-4 border-b border-neutral-200 flex items-start justify-between gap-4">
								<div>
									<p className="text-xs font-semibold uppercase tracking-wide text-[#F97316]">
										Agenda
									</p>
									<h2 className="text-lg font-semibold text-foreground leading-tight">
										Próximos agendamentos
									</h2>
									<p className="text-sm text-muted-foreground mt-0.5">
										Doutor: {activeDoctorName}
									</p>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="rounded-full"
									onClick={() => setActiveDoctorId(null)}
								>
									<XIcon className="size-4" />
								</Button>
							</div>

							<div className="p-5 overflow-y-auto">
								{upcomingForDoctor.length > 0 ? (
									<ul className="grid gap-2">
										{upcomingForDoctor.map((a) => (
											<li
												key={a.id}
												className="rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm shadow-sm"
											>
												<p className="font-medium text-foreground">{a.petName}</p>
												<p className="text-xs text-muted-foreground mt-1">
													{a.specialtyName} · Tutor: {a.ownerName}
												</p>
												<p className="text-xs text-muted-foreground mt-0.5">
													{formatDateTimeBr(a.dateTimeIso)}
												</p>
											</li>
										))}
									</ul>
								) : (
									<p className="text-sm text-muted-foreground">
										Não há próximos agendamentos para este doutor.
									</p>
								)}
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}

