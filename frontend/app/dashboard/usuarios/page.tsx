import { fetchAdminClients } from "@/app/actions/admin-clients";

import { NovoUsuarioButton } from "./novo-usuario-button";
import { UsuariosView } from "./usuarios-view";

export default async function UsuariosPage() {
	const clients = await fetchAdminClients();

	return (
		<div className="relative space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl font-semibold text-foreground tracking-tight flex items-baseline gap-1">
					Usuários
					<sup className="text-sm font-semibold ml-0.5 text-primary">
						({clients.length})
					</sup>
				</h1>
				<NovoUsuarioButton />
			</div>

			<UsuariosView clients={clients} />
		</div>
	);
}
