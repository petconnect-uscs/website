"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Trash2Icon } from "lucide-react";

import type { AdminClientWithPets } from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
			id: "select",
			header: ({ table }) => (
				<div className="-mb-1 pl-2">
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
					/>
				</div>
			),
			cell: ({ row }) => (
				<div
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
					role="presentation"
					className="-mb-1 pl-2"
				>
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
					/>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
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
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="text-muted-foreground hover:text-red-600"
						aria-label={`Excluir ${row.original.name}`}
						onClick={() => onDelete(row.original.cpf)}
					>
						<Trash2Icon className="size-4" />
					</Button>
				</div>
			),
			enableSorting: false,
			enableHiding: false,
		},
	];
}
