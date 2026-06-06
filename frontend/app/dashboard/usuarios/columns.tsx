"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";

import type { AdminClientWithPets } from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

type ColumnsOptions = {
	onDelete: (cpf: string) => void;
};

export function buildColumns({
	onDelete,
}: ColumnsOptions): ColumnDef<AdminClientWithPets>[] {
	return [
		{
			accessorKey: "name",
			header: "Nome",
			cell: ({ row }) => (
				<span className="font-medium text-foreground">{row.original.name}</span>
			),
			sortingFn: (a, b) =>
				a.original.name.localeCompare(b.original.name, "pt-BR", {
					sensitivity: "base",
				}),
		},
		{
			accessorKey: "cpf",
			header: "CPF",
			cell: ({ row }) => (
				<span className="text-muted-foreground tabular-nums">
					{formatCpfDisplay(row.original.cpf)}
				</span>
			),
		},
		{
			accessorKey: "email",
			header: "Email",
			cell: ({ row }) => (
				<span className="text-muted-foreground">{row.original.email}</span>
			),
		},
		{
			id: "telefone",
			header: "Telefone",
			cell: () => <span className="text-muted-foreground">—</span>,
		},
		{
			accessorKey: "birth_date",
			header: () => (
				<span className="whitespace-nowrap">Data de nascimento</span>
			),
			cell: ({ row }) => (
				<span className="text-muted-foreground whitespace-nowrap">
					{formatDateBr(row.original.birth_date)}
				</span>
			),
		},
		{
			id: "actions",
			header: () => null,
			cell: ({ row }) => (
				<div
					className="text-right"
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="presentation"
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="group data-[state=open]:bg-accent focus-visible:ring-0 focus-visible:border-transparent"
								aria-label={`Ações para ${row.original.name}`}
							>
								<MoreHorizontalIcon className="size-4 opacity-50 group-hover:opacity-100 group-data-[state=open]:bg-accent" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-40">
							<DropdownMenuItem
								className="!text-destructive focus:bg-destructive/10"
								onClick={() => onDelete(row.original.cpf)}
							>
								<Trash2Icon className="text-inherit" />
								Excluir
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
	];
}
