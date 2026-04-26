"use client";

import { useActionState, useEffect } from "react";

import { Link } from "next-view-transitions";

import { toast } from "sonner";

import { loginAction } from "@/app/actions/auth";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
	const [state, formAction, isPending] = useActionState(loginAction, undefined);

	useEffect(() => {
		if (state?.error) toast.error(state.error);
	}, [state]);

	return (
		<AuthLayout title="Bem vindo!" description="Faça o login em sua conta">
			<form action={formAction} className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="seuemail@gmail.com"
						required
					/>
				</div>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<Label htmlFor="senha">Senha</Label>
						<Link
							href="/forget"
							className="text-xs text-foreground/60 transition-colors hover:text-foreground"
						>
							Esqueceu a senha?
						</Link>
					</div>
					<Input
						type="password"
						id="senha"
						name="password"
						placeholder="••••••••••"
						required
					/>
				</div>

				<Button size="lg" type="submit" disabled={isPending}>
					{isPending ? "Entrando..." : "Entrar"}
				</Button>

				<div className="flex items-center justify-center">
					<p className="text-sm">
						Não tem uma conta?{" "}
						<Link
							href="/cadastro"
							className="underline underline-offset-4 decoration-neutral-400"
						>
							Cadastre-se agora
						</Link>
					</p>
				</div>
			</form>
		</AuthLayout>
	);
}
