"use client";

import { useActionState, useEffect, useState } from "react";

import { Link } from "next-view-transitions";

import { toast } from "sonner";

import { forgotPasswordAction } from "@/app/actions/auth";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RecuperarSenha() {
	const [state, formAction, isPending] = useActionState(
		forgotPasswordAction,
		undefined,
	);
	const [email, setEmail] = useState("");
	const sent = state?.success === true;

	useEffect(() => {
		if (state?.error) toast.error(state.error);
	}, [state]);

	if (sent) {
		return (
			<AuthLayout
				title="Verifique seu email"
				description="Enviamos um link de recuperação"
			>
				<div className="flex flex-col gap-6">
					<p className="text-sm text-muted-foreground">
						Se{" "}
						<span className="font-medium text-foreground">
							{email.trim() || "o e-mail informado"}
						</span>{" "}
						estiver cadastrado, enviamos um link para redefinir sua senha. O link
						expira em alguns minutos.
					</p>
					<Button variant="outline" asChild>
						<Link href="/">Voltar para o login</Link>
					</Button>
				</div>
			</AuthLayout>
		);
	}

	return (
		<AuthLayout
			title="Esqueceu a senha?"
			description="Recupere a senha de sua conta"
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

				<Button type="submit" disabled={isPending || !email.trim()}>
					{isPending ? "Enviando..." : "Enviar link de recuperação"}
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
