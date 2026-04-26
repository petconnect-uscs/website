"use client";

import { useActionState, useEffect, useState } from "react";

import { Link } from "next-view-transitions";

import { toast } from "sonner";

import { signupAction } from "@/app/actions/auth";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { TermsModal } from "@/components/modals/terms-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

function formatCpf(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	const parts = [
		digits.slice(0, 3),
		digits.slice(3, 6),
		digits.slice(6, 9),
		digits.slice(9, 11),
	];

	if (digits.length <= 3) return parts[0];
	if (digits.length <= 6) return `${parts[0]}.${parts[1]}`;
	if (digits.length <= 9) return `${parts[0]}.${parts[1]}.${parts[2]}`;
	return `${parts[0]}.${parts[1]}.${parts[2]}-${parts[3]}`;
}

export function Cadastro() {
	const [state, formAction, isPending] = useActionState(
		signupAction,
		undefined,
	);
	const [termsOpen, setTermsOpen] = useState(false);
	const [acceptedTerms, setAcceptedTerms] = useState(false);

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
						inputMode="numeric"
						maxLength={14}
						pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
						title="Digite um CPF no formato 000.000.000-00"
						onInput={(event) => {
							event.currentTarget.value = formatCpf(event.currentTarget.value);
						}}
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
					<PasswordInput
						id="senha"
						name="password"
						placeholder="••••••••••"
						required
					/>
				</div>
				<div className="flex item-center gap-2 py-1">
					<Checkbox
						id="termos"
						name="terms"
						checked={acceptedTerms}
						onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
					/>
					<div className="flex flex-col gap-1">
						<Label htmlFor="termos">Termos de uso</Label>
						<span className="text-sm text-muted-foreground">
							Continuando, você concorda com os nossos {""}
							<button
								type="button"
								onClick={() => setTermsOpen(true)}
								className="block underline underline-offset-4 decoration-1 decoration-neutral-400 text-left hover:text-foreground"
							>
								termos de serviço e política de privacidade
							</button>
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
			<TermsModal
				isOpen={termsOpen}
				onOpenChange={setTermsOpen}
				onAccept={() => setAcceptedTerms(true)}
			/>
		</AuthLayout>
	);
}
