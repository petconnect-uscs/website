import type { Metadata } from "next";
import { Link } from "next-view-transitions";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
	title: "Nova senha",
};

// TODO(api): no backend route exists for resetting the password.
// Wire to e.g. POST /auth/reset-password once it is implemented.
export default function ForgetPage() {
	return (
		<AuthLayout
			title="Esqueceu a senha?"
			description="Recupere a senha de sua conta"
		>
			<form className="flex flex-col gap-10">
				<div className="flex flex-col gap-2">
					<Label htmlFor="nova-senha">Nova Senha</Label>
					<Input type="password" id="nova-senha" placeholder="*********" />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="confirmar-senha">Confirmar Senha</Label>
					<Input
						type="password"
						id="confirmar-senha"
						placeholder="*********"
					/>
				</div>

				<Button size="lg">Alterar Senha</Button>

				<div className="flex items-center justify-center">
					<p className="text-sm">
						Lembrou a senha?{" "}
						<Link
							href="/"
							className="underline underline-offset-4 decoration-neutral-400"
						>
							Fazer login
						</Link>
					</p>
				</div>
			</form>
		</AuthLayout>
	);
}
