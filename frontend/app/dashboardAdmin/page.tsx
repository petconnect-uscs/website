import { fetchAdminAppointments } from "@/app/actions/admin-appointments";
import { fetchAdminDoctors } from "@/app/actions/admin-doctors";
import { HomeDoctorsTable } from "@/components/admin/home-doctors-table";

export default async function DashboardAdmin() {
	const [doctors, appointments] = await Promise.all([
		fetchAdminDoctors(),
		fetchAdminAppointments(),
	]);

	return (
		<div className="relative space-y-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h1 className="text-2xl font-semibold text-foreground tracking-tight">
						Clínica <span className="text-[#F97316]">PetCare Center!</span>
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Veja os atendimentos mais recentes dos {doctors.length} doutores da
						clínica.
					</p>
				</div>
			</div>
			<HomeDoctorsTable doctors={doctors} appointments={appointments} />
		</div>
	);
}

