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

function formatCpf(cpf: string): string {
	const digits = cpf.replace(/\D/g, "");
	if (digits.length !== 11) return cpf;
	return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
		<form action={formAction} className="space-y-10">
			<input type="hidden" name="initial_name" value={profile.name} />

			<header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
				<div className="min-w-0 space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight">
						Configurações
					</h1>
					<p className="text-base text-muted-foreground">
						Gerencie seus dados pessoais e segurança da conta
					</p>
				</div>
			</header>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="flex flex-col gap-2">
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						name="name"
						defaultValue={profile.name}
						autoComplete="name"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="cpf_readonly">CPF</Label>
					<Input id="cpf_readonly" disabled value={formatCpf(profile.cpf)} />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="email_readonly">Email</Label>
					<Input id="email_readonly" disabled value={profile.email} />
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="birth_readonly">Data de nascimento</Label>
					<Input
						id="birth_readonly"
						disabled
						value={formatDateBR(profile.birth_date)}
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="password">Nova senha</Label>
					<PasswordInput
						id="password"
						name="password"
						autoComplete="new-password"
						placeholder="••••••••••"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<Label htmlFor="password_confirm">Confirmar nova senha</Label>
					<PasswordInput
						id="password_confirm"
						name="password_confirm"
						autoComplete="new-password"
						placeholder="••••••••••"
					/>
				</div>
			</div>

			<div className="flex justify-end">
				<Button type="submit" disabled={isPending} className="w-fit shrink-0">
					{isPending ? "Salvando…" : "Salvar alterações"}
				</Button>
			</div>
		</form>
	);
}
