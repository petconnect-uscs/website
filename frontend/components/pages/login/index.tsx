"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api";
import { setToken } from "@/lib/auth";

type LoginResponse = { token: string };

export function Login() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		setIsSubmitting(true);

		try {
			const { token } = await api<LoginResponse>("/auth/login", {
				method: "POST",
				auth: false,
				body: { email, password },
			});

			setToken(token);

			toast.success("Login realizado com sucesso.");

			router.push("/dashboard");
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : "Falha ao fazer login.";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthLayout title="Bem vindo!" description="Faça o login em sua conta">
			<form onSubmit={handleSubmit} className="flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="seuemail@gmail.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
						placeholder="••••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>

				<Button size="lg" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Entrando..." : "Entrar"}
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
