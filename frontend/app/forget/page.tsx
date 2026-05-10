"use client";

import { useActionState, useEffect } from "react";
import { Link } from "next-view-transitions";
import { toast } from "sonner";

import { resetPasswordAction } from "@/app/actions/auth"; // Importando a action nova
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgetPage() {
	// Hook para gerenciar o estado do formulário e a action
	const [state, formAction, isPending] = useActionState(resetPasswordAction, undefined);

	// Exibe o erro caso o backend retorne algum problema
	useEffect(() => {
		if (state?.error) toast.error(state.error);
	}, [state]);

	return (
		<AuthLayout
			title="Esqueceu a senha?"
			description="Recupere a senha de sua conta"
		>
			<form action={formAction} className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">E-mail da conta</Label>
					<Input 
						type="email" 
						id="email" 
						name="email" 
						placeholder="seuemail@exemplo.com" 
						required 
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="nova-senha">Nova Senha</Label>
					<Input 
						type="password" 
						id="nova-senha" 
						name="password" // Nome batendo com o que a action espera
						placeholder="*********" 
						required
					/>
				</div>

				<div className="flex flex-col gap-2">
					<Label htmlFor="confirmar-senha">Confirmar Senha</Label>
					<Input 
						type="password" 
						id="confirmar-senha" 
						name="confirmPassword" // Nome batendo com o que a action espera
						placeholder="*********" 
						required
					/>
				</div>

				<Button type="submit" disabled={isPending} className="mt-4">
					{isPending ? "Alterando..." : "Alterar Senha"}
				</Button>

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
