"use client";

import { useActionState, useEffect } from "react";

import { Link } from "next-view-transitions";

import { toast } from "sonner";

import { signupAction } from "@/app/actions/auth";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Cadastro() {
	const [state, formAction, isPending] = useActionState(
		signupAction,
		undefined,
	);

	useEffect(() => {
		if (state?.error) toast.error(state.error);
	}, [state]);

	return (
		<AuthLayout title="Comece aqui" description="Crie uma nova conta">
			<form action={formAction} className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Label htmlFor="nome">Nome</Label>
					<Input
						type="text"
						id="nome"
						name="name"
						placeholder="John Doe"
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="cpf">CPF</Label>
					<Input
						type="text"
						id="cpf"
						name="cpf"
						placeholder="000.000.000-00"
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="johndoe@gmail.com"
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="senha">Senha</Label>
					<Input
						type="password"
						id="senha"
						name="password"
						placeholder="••••••••••"
						required
					/>
				</div>
				<div className="flex item-center gap-2 py-1">
					<Checkbox id="termos" name="terms" />
					<div className="flex flex-col gap-1">
						<Label htmlFor="termos">Termos de uso</Label>
						<span className="text-sm text-muted-foreground">
							Continuando, você concorda com os nossos {""}
							<span className="block underline underline-offset-4 decoration-1 decoration-neutral-400">
								termos de serviço e política de privacidade
							</span>
						</span>
					</div>
				</div>
				<Button size="lg" type="submit" disabled={isPending}>
					{isPending ? "Cadastrando..." : "Cadastrar"}
				</Button>

				<div className="flex items-center justify-center">
					<p className="text-sm">
						Já tem uma conta?{" "}
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
