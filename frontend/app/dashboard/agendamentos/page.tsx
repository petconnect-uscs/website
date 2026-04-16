import { PlusIcon } from "lucide-react";

import { DataTable } from "./data-table";
import { columns, type Agendamento } from "./columns";

import { Button } from "@/components/ui/button";
import { AppointmentSheet } from "@/components/ui/appointment-sheet";

const mockAgendamentos: Agendamento[] = [
  {
    id: "1",
    paciente: "Rex",
    profissional: "Dra. Maria",
    especialidade: "Fisioterapia",
    data: "2026-03-20 09:00",
    status: "concluido",
  },
  {
    id: "2",
    paciente: "Pérola",
    profissional: "Dr. Carlos",
    especialidade: "Clínico geral",
    data: "2026-03-20 10:30",
    status: "agendado",
  },
  {
    id: "3",
    paciente: "Sasha",
    profissional: "Dra. Julia",
    especialidade: "Cirurgião",
    data: "2026-03-21 14:00",
    status: "cancelado",
  },
  {
    id: "4",
    paciente: "Thor",
    profissional: "Dr. Paulo",
    especialidade: "Ortopedia",
    data: "2026-03-22 08:30",
    status: "agendado",
  },
  {
    id: "5",
    paciente: "Luna",
    profissional: "Dra. Ana",
    especialidade: "Clínico geral",
    data: "2026-03-22 09:15",
    status: "concluido",
  },
  {
    id: "6",
    paciente: "Bob",
    profissional: "Dr. Ricardo",
    especialidade: "Dermatologia",
    data: "2026-03-22 10:00",
    status: "agendado",
  },
  {
    id: "7",
    paciente: "Mia",
    profissional: "Dra. Carla",
    especialidade: "Fisioterapia",
    data: "2026-03-22 10:45",
    status: "cancelado",
  },
  {
    id: "8",
    paciente: "Zeus",
    profissional: "Dr. Bruno",
    especialidade: "Cirurgião",
    data: "2026-03-22 11:30",
    status: "concluido",
  },
  {
    id: "9",
    paciente: "Nina",
    profissional: "Dra. Luiza",
    especialidade: "Oftalmologia",
    data: "2026-03-22 13:00",
    status: "agendado",
  },
  {
    id: "10",
    paciente: "Max",
    profissional: "Dr. Pedro",
    especialidade: "Clínico geral",
    data: "2026-03-22 13:45",
    status: "concluido",
  },
  {
    id: "11",
    paciente: "Mel",
    profissional: "Dra. Helena",
    especialidade: "Cardiologia",
    data: "2026-03-22 14:30",
    status: "agendado",
  },
  {
    id: "12",
    paciente: "Toby",
    profissional: "Dr. André",
    especialidade: "Dermatologia",
    data: "2026-03-22 15:15",
    status: "cancelado",
  },
  {
    id: "13",
    paciente: "Bela",
    profissional: "Dra. Marina",
    especialidade: "Fisioterapia",
    data: "2026-03-23 09:00",
    status: "agendado",
  },
  {
    id: "14",
    paciente: "Simba",
    profissional: "Dr. Gustavo",
    especialidade: "Cirurgião",
    data: "2026-03-23 09:45",
    status: "concluido",
  },
  {
    id: "15",
    paciente: "Lola",
    profissional: "Dra. Fernanda",
    especialidade: "Clínico geral",
    data: "2026-03-23 10:30",
    status: "agendado",
  },
  {
    id: "16",
    paciente: "Chico",
    profissional: "Dr. Rafael",
    especialidade: "Cardiologia",
    data: "2026-03-23 11:15",
    status: "cancelado",
  },
  {
    id: "17",
    paciente: "Meg",
    profissional: "Dra. Patrícia",
    especialidade: "Dermatologia",
    data: "2026-03-23 13:00",
    status: "concluido",
  },
  {
    id: "18",
    paciente: "Luke",
    profissional: "Dr. Tiago",
    especialidade: "Fisioterapia",
    data: "2026-03-23 13:45",
    status: "agendado",
  },
  {
    id: "19",
    paciente: "Zara",
    profissional: "Dra. Beatriz",
    especialidade: "Oftalmologia",
    data: "2026-03-23 14:30",
    status: "agendado",
  },
  {
    id: "20",
    paciente: "Apollo",
    profissional: "Dr. Henrique",
    especialidade: "Cirurgião",
    data: "2026-03-24 09:00",
    status: "concluido",
  },
  {
    id: "21",
    paciente: "Pingo",
    profissional: "Dra. Camila",
    especialidade: "Clínico geral",
    data: "2026-03-24 09:45",
    status: "agendado",
  },
  {
    id: "22",
    paciente: "Kira",
    profissional: "Dr. João",
    especialidade: "Cardiologia",
    data: "2026-03-24 10:30",
    status: "cancelado",
  },
  {
    id: "23",
    paciente: "Bolt",
    profissional: "Dra. Sofia",
    especialidade: "Fisioterapia",
    data: "2026-03-24 11:15",
    status: "agendado",
  },
];

export default function AgendamentosPage() {
  return (
    <main className="relative space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Agendamentos</h1>
        <AppointmentSheet>
          <Button>
            <PlusIcon className="w-4 h-4" />
            Agendar
          </Button>
        </AppointmentSheet>
      </div>
      <DataTable columns={columns} data={mockAgendamentos} />
    </main>
  );
}
