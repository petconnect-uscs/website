"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Status } from "@/components/ui/status";
import { translateSpecialtyName } from "@/lib/specialty-translations";

export type Agendamento = {
  id: string;
  paciente: string;
  profissional: string;
  especialidade: string;
  data: string;
  status: "concluido" | "agendado" | "cancelado";
};

export const columns: ColumnDef<Agendamento>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "paciente",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Paciente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "especialidade",
    header: "Especialidade",
    cell: ({ row }) => translateSpecialtyName(row.getValue("especialidade")),
  },
  {
    accessorKey: "profissional",
    header: "Profissional",
  },
  {
    accessorKey: "data",
    header: () => <div className="text-left">Data e horário</div>,
    cell: ({ row }) => {
      const raw = row.getValue("data") as string;
      const date = new Date(raw.replace(" ", "T"));

      if (Number.isNaN(date.getTime())) return raw;

      return format(date, "dd/MM/yyyy HH:mm");
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Agendamento["status"];

      return <Status status={status} />;
    },
  },
];
