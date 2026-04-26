"use client";

import { useState } from "react";
import { Link } from "next-view-transitions";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthLayout } from "@/components/layouts/auth-layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, api } from "@/lib/api";
import { setToken } from "@/lib/auth";

type RegisterResponse = { token: string };

export function Cadastro() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [cpf, setCpf] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!acceptedTerms) {
			toast.error("Você precisa aceitar os termos de uso.");
			return;
		}

		setIsSubmitting(true);
		try {
			const { token } = await api<RegisterResponse>("/auth/register", {
				method: "POST",
				auth: false,
				body: { name, cpf, email, password },
			});
			setToken(token);
			toast.success("Conta criada com sucesso.");
			router.push("/dashboard");
		} catch (err) {
			const message =
				err instanceof ApiError ? err.message : "Falha ao criar a conta.";
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<AuthLayout title="Comece aqui" description="Crie uma nova conta">
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="flex flex-col gap-2">
					<Label htmlFor="nome">Nome</Label>
					<Input
						type="text"
						id="nome"
						placeholder="John Doe"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="cpf">CPF</Label>
					<Input
						type="text"
						id="cpf"
						placeholder="000.000.000-00"
						value={cpf}
						onChange={(e) => setCpf(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						type="email"
						id="email"
						placeholder="johndoe@gmail.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="senha">Senha</Label>
					<Input
						type="password"
						id="senha"
						placeholder="••••••••••"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<div className="flex item-center gap-2 py-1">
					<Checkbox
						id="termos"
						checked={acceptedTerms}
						onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
					/>
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
				<Button size="lg" type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
