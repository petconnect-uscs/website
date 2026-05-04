"use client";

import { useActionState, useEffect, useState } from "react";

import { Link } from "next-view-transitions";

import { toast } from "sonner";

import { loginAction } from "@/app/actions/auth";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Input } from "@/components/ui/input";

export function Login() {
	const [state, formAction, isPending] = useActionState(loginAction, undefined);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {
		if (state?.error) toast.error(state.error);
	}, [state]);

	return (
		<AuthLayout
			title="Acesse sua conta"
			description="Faça login para continuar"
		>
			<form action={formAction} className="flex flex-col gap-6">
				<div className="flex flex-col gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="seuemail@gmail.com"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-3">
					{/* <div className="flex items-center justify-between">
						<Label htmlFor="senha">Senha</Label>
						<Link
							href="/forget"
							className="text-xs text-foreground/60 transition-colors hover:text-foreground"
						>
							Esqueceu a senha?
						</Link>
					</div> */}
					<Label htmlFor="senha">Senha</Label>
					<PasswordInput
						id="senha"
						name="password"
						placeholder="••••••••••"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
				</div>

				<Button
					type="submit"
					disabled={isPending || !email.trim() || !password}
				>
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
