"use client";

import { useMemo, useState, useTransition } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	deleteAdminClient,
	type AdminClientWithPets,
} from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { getBreedImage, translateBreedName } from "@/lib/breed-translations";

import { buildColumns } from "./columns";
import { DataTable } from "./data-table";

function formatCpfDisplay(cpf: string): string {
	const d = cpf.replace(/\D/g, "");
	if (d.length !== 11) return cpf;
	return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatDateBr(iso: string | null): string {
	if (!iso) return "—";
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${d}/${m}/${y}`;
}

function calculateAge(birthDate: string | null): string {
	if (!birthDate) return "Idade não informada";

	const birth = new Date(birthDate);

	if (Number.isNaN(birth.getTime())) return "Idade não informada";

	const diffDays = Math.ceil(
		Math.abs(Date.now() - birth.getTime()) / (1000 * 60 * 60 * 24),
	);
	const years = Math.floor(diffDays / 365);
	const months = Math.floor((diffDays % 365) / 30);

	if (years > 0 && months > 0) {
		return `${years} ano${years > 1 ? "s" : ""} e ${months} ${months > 1 ? "meses" : "mês"}`;
	}

	if (years > 0) return `${years} ano${years > 1 ? "s" : ""}`;

	return `${months} mês${months > 1 ? "es" : ""}`;
}

function formatSex(sex: string | null): string {
	if (sex === "male") return "Macho";
	if (sex === "female") return "Fêmea";
	return sex ?? "—";
}

function formatBoolBr(value: boolean | null | undefined): string {
	if (value === true) return "Sim";
	if (value === false) return "Não";
	return "—";
}

type Props = {
	clients: AdminClientWithPets[];
};

export function UsuariosView({ clients }: Props) {
	const router = useRouter();
	const [activeCpf, setActiveCpf] = useState<string | null>(null);
	const [cpfToDelete, setCpfToDelete] = useState<string | null>(null);
	const [isDeleting, startDeleteTransition] = useTransition();

	const activeClient = useMemo(() => {
		if (!activeCpf) return null;
		return clients.find((c) => c.cpf === activeCpf) ?? null;
	}, [activeCpf, clients]);

	const clientToDelete = useMemo(
		() => clients.find((c) => c.cpf === cpfToDelete) ?? null,
		[clients, cpfToDelete],
	);

	const columns = useMemo(() => buildColumns({ onDelete: setCpfToDelete }), []);

	function closeDrawer() {
		setActiveCpf(null);
	}

	function confirmDeleteClient() {
		if (!cpfToDelete) return;
		startDeleteTransition(async () => {
			try {
				await deleteAdminClient(cpfToDelete);
				toast.success("Usuário excluído permanentemente.");
				setCpfToDelete(null);
				if (activeCpf === cpfToDelete) setActiveCpf(null);
				router.refresh();
			} catch (err) {
				toast.error(
					err instanceof Error ? err.message : "Falha ao excluir usuário.",
				);
			}
		});
	}

	return (
		<>
			<DataTable
				columns={columns}
				data={clients}
				onRowClick={(row) => setActiveCpf(row.cpf)}
				isRowActive={(row) => row.cpf === activeCpf}
			/>

			<Sheet
				open={Boolean(activeClient)}
				onOpenChange={(open) => {
					if (!open) closeDrawer();
				}}
			>
				<SheetContent>
					{activeClient ? (
						<>
							<SheetHeader>
								<SheetTitle className="truncate">
									{activeClient.name}
								</SheetTitle>
								<SheetDescription className="truncate">
									{activeClient.email} <br />
									{formatCpfDisplay(activeClient.cpf)} <br />
									{formatDateBr(activeClient.birth_date)}
								</SheetDescription>
							</SheetHeader>

							<div className="flex flex-col gap-2 px-4">
								<h1 className="text-lg font-semibold text-foreground tracking-tight flex items-baseline gap-1">
									Pets
									{activeClient.pets.length > 0 && (
										<sup className="text-xs font-semibold text-primary">
											({activeClient.pets.length})
										</sup>
									)}
								</h1>

								{activeClient.pets.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										Nenhum pet cadastrado.
									</p>
								) : (
									<ul className="grid gap-3">
										{activeClient.pets.map((p) => (
											<li
												key={p.pet_id}
												className="flex flex-col rounded-[10px] border"
											>
												<Image
													src={
														p.image_url ??
														getBreedImage(p.breed_name) ??
														"/src/img/pet1.png"
													}
													width={170}
													height={170}
													className="w-full h-[170px] object-cover rounded-t-lg rounded-b-none"
													alt={p.name}
												/>
												<div className="grid grid-cols-2 w-[80%] gap-y-4 mt-4 ml-4 mb-4">
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Nome
														</span>
														<p className="font-semibold text-sm text-foreground">
															{p.name}
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Idade
														</span>
														<p className="font-semibold text-sm text-foreground">
															{calculateAge(p.birth_date)}
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Raça
														</span>
														<p className="font-semibold text-sm text-foreground capitalize">
															{p.breed_name
																? translateBreedName(p.breed_name)
																: "—"}
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Sexo
														</span>
														<p className="font-semibold text-sm text-foreground">
															{formatSex(p.sex)}
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Castrado
														</span>
														<p className="font-semibold text-sm text-foreground">
															{formatBoolBr(p.is_neutered)}
														</p>
													</div>
													<div className="flex flex-col">
														<span className="text-xs text-muted-foreground font-medium">
															Vacinado
														</span>
														<p className="font-semibold text-sm text-foreground">
															{formatBoolBr(p.is_vaccinated)}
														</p>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</>
					) : null}
				</SheetContent>
			</Sheet>

			<Dialog
				open={Boolean(cpfToDelete)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setCpfToDelete(null);
				}}
			>
				<DialogContent showCloseButton={!isDeleting}>
					<DialogHeader className="gap-2">
						<DialogTitle>Excluir usuário permanentemente?</DialogTitle>
						<DialogDescription>
							Tem certeza que deseja excluir{" "}
							<span className="text-foreground">{clientToDelete?.name}</span>?{" "}
							<br />
							Esta ação é permanente e não pode ser desfeita.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							disabled={isDeleting}
							onClick={() => setCpfToDelete(null)}
						>
							Cancelar
						</Button>
						<Button
							type="button"
							variant="destructive"
							disabled={isDeleting}
							onClick={confirmDeleteClient}
						>
							{isDeleting ? "Excluindo..." : "Excluir"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
