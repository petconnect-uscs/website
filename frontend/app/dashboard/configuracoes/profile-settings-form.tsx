"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";

import {
	updateClientProfileAction,
	type ClientProfile,
} from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

function formatDateBR(iso: string | null): string {
	if (!iso) return "—";
	const [y, m, d] = iso.split("-");
	if (!y || !m || !d) return iso;
	return `${d}/${m}/${y}`;
}

export function ProfileSettingsForm({ profile }: { profile: ClientProfile }) {
	const [state, formAction, isPending] = useActionState(
		updateClientProfileAction,
		undefined,
	);

	useEffect(() => {
		if (state?.error) toast.error(state.error);
		if (state?.success) toast.success("Perfil atualizado com sucesso.");
	}, [state]);

	return (
		<form action={formAction} className="mx-auto max-w-xl space-y-10">
			<input type="hidden" name="initial_name" value={profile.name} />

			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						Configurações
					</h1>
					<p className="text-sm text-muted-foreground">
						Gerencie seus dados pessoais e segurança da conta.
					</p>
				</div>
				<Button
					type="submit"
					disabled={isPending}
					className="w-full shrink-0 sm:w-auto sm:self-start"
				>
					{isPending ? "Salvando…" : "Salvar alterações"}
				</Button>
			</header>

			<section className="space-y-4 rounded-xl border border-gray-200 bg-card p-6 shadow-sm">
				<h2 className="text-lg font-semibold tracking-tight">
					Dados da conta
				</h2>
				<p className="text-sm text-muted-foreground">
					CPF, e-mail e data de nascimento não podem ser alterados por aqui.
				</p>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-2">
						<Label htmlFor="cpf_readonly">CPF</Label>
						<Input
							id="cpf_readonly"
							readOnly
							value={profile.cpf}
							className="bg-muted/50"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="email_readonly">E-mail</Label>
						<Input
							id="email_readonly"
							readOnly
							value={profile.email}
							className="bg-muted/50"
						/>
					</div>
					<div className="flex flex-col gap-2 sm:col-span-2">
						<Label htmlFor="birth_readonly">Data de nascimento</Label>
						<Input
							id="birth_readonly"
							readOnly
							value={formatDateBR(profile.birth_date)}
							className="bg-muted/50"
						/>
					</div>
				</div>
			</section>

			<section className="space-y-4 rounded-xl border border-gray-200 bg-card p-6 shadow-sm">
				<h2 className="text-lg font-semibold tracking-tight">Nome</h2>
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Nome completo</Label>
					<Input
						id="name"
						name="name"
						defaultValue={profile.name}
						autoComplete="name"
					/>
				</div>
			</section>

			<section className="space-y-4 rounded-xl border border-gray-200 bg-card p-6 shadow-sm">
				<h2 className="text-lg font-semibold tracking-tight">
					Alterar senha
				</h2>
				<p className="text-sm text-muted-foreground">
					Deixe em branco para manter a senha atual.
				</p>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="password">Nova senha</Label>
						<PasswordInput
							id="password"
							name="password"
							autoComplete="new-password"
							placeholder="Opcional"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="password_confirm">Confirmar nova senha</Label>
						<PasswordInput
							id="password_confirm"
							name="password_confirm"
							autoComplete="new-password"
							placeholder="Opcional"
						/>
					</div>
				</div>
			</section>
		</form>
	);
}
