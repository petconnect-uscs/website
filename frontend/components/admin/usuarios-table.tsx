"use client";

import { Fragment, useEffect, useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AnimatePresence, motion } from "motion/react";
import { Trash2Icon, XIcon } from "lucide-react";

import {
	deleteAdminClient,
	type AdminClientWithPets,
} from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ORANGE = "#F97316";

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

function formatDateTimeBr(iso: string | null | undefined): string {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return String(iso);
	return d.toLocaleString("pt-BR");
}

function formatBoolBr(value: boolean | null | undefined): string {
	if (value === true) return "Sim";
	if (value === false) return "Não";
	return "—";
}

type Props = {
	clients: AdminClientWithPets[];
};

export function UsuariosTable({ clients }: Props) {
	const router = useRouter();
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [activeCpf, setActiveCpf] = useState<string | null>(null);
	const [cpfToDelete, setCpfToDelete] = useState<string | null>(null);
	const [isDeleting, startDeleteTransition] = useTransition();

	const allCpfs = useMemo(() => clients.map((c) => c.cpf), [clients]);
	const allSelected =
		clients.length > 0 && selected.size === clients.length;
	const someSelected = selected.size > 0 && !allSelected;

	const activeClient = useMemo(() => {
		if (!activeCpf) return null;
		return clients.find((c) => c.cpf === activeCpf) ?? null;
	}, [activeCpf, clients]);

	function toggleSelect(cpf: string) {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(cpf)) next.delete(cpf);
			else next.add(cpf);
			return next;
		});
	}

	function toggleSelectAll() {
		if (allSelected) setSelected(new Set());
		else setSelected(new Set(allCpfs));
	}

	function closeDrawer() {
		setActiveCpf(null);
	}

	const clientToDelete = useMemo(
		() => clients.find((c) => c.cpf === cpfToDelete) ?? null,
		[clients, cpfToDelete],
	);

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

	useEffect(() => {
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") closeDrawer();
		}

		if (activeCpf) {
			document.addEventListener("keydown", onKeyDown);
			return () => document.removeEventListener("keydown", onKeyDown);
		}
	}, [activeCpf]);

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-baseline gap-1">
					Usuários
					<sup
						className="text-sm font-semibold ml-0.5"
						style={{ color: ORANGE }}
					>
						({clients.length})
					</sup>
				</h1>
				<Button
					type="button"
					onClick={() => router.push("/dashboardAdmin/usuarios/novo")}
					className="rounded-lg text-white shadow-sm hover:opacity-95"
					style={{ backgroundColor: ORANGE }}
				>
					+ Novo Usuário
				</Button>
			</div>

			<div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr
								className="text-left border-b border-neutral-200 bg-neutral-100/70 "

							>
								<th className="w-12 px-4 py-3">
									<Checkbox
										checked={
											someSelected ? "indeterminate" : allSelected
										}
										onCheckedChange={() => toggleSelectAll()}
										aria-label="Selecionar todos"
										className="border-neutral-400 data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]"
									/>
								</th>
								<th
									className="px-3 py-3 text-xs font-semibold uppercase tracking-wide"
								>
									Nome
								</th>
								<th
									className="px-3 py-3 text-xs font-semibold uppercase tracking-wide"
								>
									CPF
								</th>
								<th
									className="px-3 py-3 text-xs font-semibold uppercase tracking-wide"
								>
									Email
								</th>
								<th
									className="px-3 py-3 text-xs font-semibold uppercase tracking-wide"
								>
									Telefone
								</th>
								<th
									className="px-3 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap"
								>
									Data de nascimento
								</th>
								<th className="w-14 px-2 py-3 text-right" aria-hidden />
							</tr>
						</thead>
						<tbody>
							{clients.length === 0 ? (
								<tr>
									<td
										colSpan={7}
										className="px-4 py-12 text-center text-muted-foreground"
									>
										Nenhum usuário encontrado.
									</td>
								</tr>
							) : (
								clients.map((row) => {
									const isActive = activeCpf === row.cpf;
									return (
										<Fragment key={row.cpf}>
											<tr
												role="button"
												tabIndex={0}
												onClick={() => setActiveCpf(row.cpf)}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault();
														setActiveCpf(row.cpf);
													}
												}}
												className={cn(
													"border-b border-neutral-100 transition-colors cursor-pointer",
													"hover:bg-neutral-50/80",
													isActive && "bg-neutral-50/70",
												)}
											>
												<td
													className="px-4 py-3 align-middle"
													onClick={(e) => e.stopPropagation()}
												>
													<Checkbox
														checked={selected.has(row.cpf)}
														onCheckedChange={() =>
															toggleSelect(row.cpf)
														}
														aria-label={`Selecionar ${row.name}`}
														className="border-neutral-400 data-[state=checked]:bg-[#F97316] data-[state=checked]:border-[#F97316]"
													/>
												</td>
												<td className="px-3 py-3 font-medium text-foreground">
													{row.name}
												</td>
												<td className="px-3 py-3 text-muted-foreground tabular-nums">
													{formatCpfDisplay(row.cpf)}
												</td>
												<td className="px-3 py-3 text-muted-foreground">
													{row.email}
												</td>
												<td className="px-3 py-3 text-muted-foreground">
													—
												</td>
												<td className="px-3 py-3 text-muted-foreground whitespace-nowrap">
													{formatDateBr(row.birth_date)}
												</td>
												<td
													className="px-2 py-3 text-right"
													onClick={(e) => e.stopPropagation()}
												>
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-muted-foreground hover:text-red-600"
														aria-label={`Excluir ${row.name}`}
														onClick={() => setCpfToDelete(row.cpf)}
													>
														<Trash2Icon className="size-4" />
													</Button>
												</td>
											</tr>
										</Fragment>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			<AnimatePresence>
				{activeClient && (
					<>
						<motion.button
							type="button"
							aria-label="Fechar detalhes"
							className="fixed inset-0 z-40 bg-black/30"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={closeDrawer}
						/>

						<motion.aside
							aria-label={`Detalhes de ${activeClient.name}`}
							className={cn(
								"fixed right-0 top-0 z-50 h-dvh w-full sm:w-[420px]",
								"border-l border-neutral-200 bg-white shadow-xl",
								"flex flex-col",
							)}
							initial={{ x: 420, opacity: 0.9 }}
							animate={{ x: 0, opacity: 1 }}
							exit={{ x: 420, opacity: 0.9 }}
							transition={{ type: "spring", stiffness: 380, damping: 34 }}
						>
							<div className="px-5 py-4 border-b border-neutral-200 flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p
										className="text-xs font-semibold uppercase tracking-wide"
										style={{ color: ORANGE }}
									>
										Usuário
									</p>
									<h2 className="text-lg font-semibold text-foreground leading-tight truncate">
										{activeClient.name}
									</h2>
									<p className="text-sm text-muted-foreground mt-0.5 truncate">
										{activeClient.email}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										CPF: {formatCpfDisplay(activeClient.cpf)} · Nasc.:{" "}
										{formatDateBr(activeClient.birth_date)}
									</p>
								</div>

								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={closeDrawer}
									className="shrink-0 rounded-full"
									aria-label="Fechar"
								>
									<XIcon className="size-4" />
								</Button>
							</div>

							<div className="p-5 overflow-y-auto">
								<p
									className="text-xs font-semibold uppercase tracking-wide mb-3"
									style={{ color: ORANGE }}
								>
									Pets de {activeClient.name}
								</p>

								{activeClient.pets.length === 0 ? (
									<p className="text-sm text-muted-foreground">
										Nenhum pet cadastrado.
									</p>
								) : (
									<ul className="grid gap-2">
										{activeClient.pets.map((p) => (
											<li
												key={p.pet_id}
												className="rounded-lg border border-neutral-200 bg-white px-3.5 py-3 text-sm shadow-sm"
											>
												<div className="flex items-start justify-between gap-3">
													<div className="min-w-0">
														<span className="font-medium text-foreground block truncate">
															{p.name}
														</span>
														<span className="text-muted-foreground text-xs mt-1 block">
															{p.species_name ?? "Espécie —"} ·{" "}
															{p.breed_name ?? "Raça —"}
														</span>
														<span className="text-muted-foreground text-xs mt-0.5 block">
															Nasc.: {formatDateBr(p.birth_date)}
															{p.sex ? ` · ${p.sex}` : ""}
														</span>
														<div className="mt-2 grid gap-1 text-xs text-muted-foreground">
															<div className="flex flex-wrap gap-x-3 gap-y-1">
																<span>Vacinado: {formatBoolBr(p.is_vaccinated)}</span>
																<span>Castrado: {formatBoolBr(p.is_neutered)}</span>
															</div>
															<div className="flex flex-wrap gap-x-3 gap-y-1">
																<span className="tabular-nums">
																	Criado: {formatDateTimeBr(p.created_at)}
																</span>
																<span className="tabular-nums">
																	Atualizado: {formatDateTimeBr(p.updated_at)}
																</span>
															</div>
															<div className="flex flex-wrap gap-x-3 gap-y-1">
																<span className="tabular-nums">ID: {p.pet_id}</span>
																{p.image_url ? (
																	<a
																		href={p.image_url}
																		target="_blank"
																		rel="noreferrer"
																		className="underline underline-offset-2"
																	>
																		Foto
																	</a>
																) : (
																	<span>Foto: —</span>
																)}
															</div>
															{p.vaccines && p.vaccines.length > 0 ? (
																<div className="text-xs text-muted-foreground">
																	Vacinas: {p.vaccines.join(", ")}
																</div>
															) : (
																<div className="text-xs text-muted-foreground">
																	Vacinas: —
																</div>
															)}
														</div>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</motion.aside>
					</>
				)}
			</AnimatePresence>

			<Dialog
				open={Boolean(cpfToDelete)}
				onOpenChange={(open) => {
					if (!open && !isDeleting) setCpfToDelete(null);
				}}
			>
				<DialogContent showCloseButton={!isDeleting}>
					<DialogHeader>
						<DialogTitle>Excluir usuário permanentemente?</DialogTitle>
						<DialogDescription>
							{clientToDelete
								? `Tem certeza que deseja excluir "${clientToDelete.name}"? Esta ação é permanente e não pode ser desfeita.`
								: "Esta ação é permanente e não pode ser desfeita."}
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
		</div>
	);
}
