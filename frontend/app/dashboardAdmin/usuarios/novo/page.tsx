"use client";

import { useActionState, useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { createAdminClient } from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

type FormState = { ok?: true; error?: string } | undefined;

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

async function action(_prev: FormState, formData: FormData): Promise<FormState> {
	const name = String(formData.get("name") ?? "").trim();
	const cpf = String(formData.get("cpf") ?? "").trim();
	const email = String(formData.get("email") ?? "").trim();
	const password = String(formData.get("password") ?? "");

	if (!name || !cpf || !email || !password) {
		return { error: "Preencha todos os campos." };
	}

	try {
		await createAdminClient({ name, cpf, email, password });
		return { ok: true };
	} catch (err) {
		return {
			error: err instanceof Error ? err.message : "Não foi possível cadastrar o usuário.",
		};
	}
}

export default function AdminNovoUsuarioPage() {
	const router = useRouter();

	const [state, formAction, isPending] = useActionState(action, undefined);
	const [name, setName] = useState("");
	const [cpf, setCpf] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const canSubmit = useMemo(() => {
		return !!name.trim() && !!cpf.trim() && !!email.trim() && !!password;
	}, [cpf, email, name, password]);

	useEffect(() => {
		if (state?.error) toast.error(state.error);
		if (state?.ok && !isPending) {
			toast.success("Usuário cadastrado com sucesso.");
			router.push("/dashboardAdmin/usuarios");
			router.refresh();
		}
	}, [canSubmit, isPending, router, state]);

	return (
		<div className="max-w-2xl">
			<div className="flex items-center justify-between gap-4 mb-6">
				<div>
					<h1 className="text-2xl font-semibold text-foreground tracking-tight">
						Novo Usuário
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Cadastre um novo cliente para acessar o sistema.
					</p>
				</div>
				<Button type="button" variant="ghost" onClick={() => router.back()}>
					Voltar
				</Button>
			</div>

			<form action={formAction} className="rounded-xl border bg-white p-6 grid gap-5">
				<div className="grid gap-2">
					<Label htmlFor="name">Nome</Label>
					<Input
						id="name"
						name="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="John Doe"
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="cpf">CPF</Label>
					<Input
						id="cpf"
						name="cpf"
						value={cpf}
						onChange={(e) => setCpf(formatCpf(e.target.value))}
						placeholder="000.000.000-00"
						inputMode="numeric"
						maxLength={14}
						pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
						title="Digite um CPF no formato 000.000.000-00"
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="johndoe@gmail.com"
						required
					/>
				</div>

				<div className="grid gap-2">
					<Label htmlFor="password">Senha</Label>
					<PasswordInput
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••••"
						required
					/>
				</div>

				<div className="flex items-center justify-end gap-3 pt-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => router.push("/dashboardAdmin/usuarios")}
					>
						Cancelar
					</Button>
					<Button type="submit" disabled={isPending || !canSubmit}>
						{isPending ? "Cadastrando..." : "Cadastrar"}
					</Button>
				</div>
			</form>
		</div>
	);
}

