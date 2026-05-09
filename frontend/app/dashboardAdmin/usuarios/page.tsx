import { fetchAdminClients } from "@/app/actions/admin-clients";
import { UsuariosTable } from "@/components/admin/usuarios-table";

export default async function AdminUsuariosPage() {
	const clients = await fetchAdminClients();

	return (
		<div className="relative">
			<UsuariosTable clients={clients} />
		</div>
	);
}
