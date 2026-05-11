"use client";

import { useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createAdminClient } from "@/app/actions/admin-clients";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";

type CreateNewUserModalProps = {
	closeModal: () => void;
	isOpen: boolean;
};

type FormState = {
	name: string;
	cpf: string;
	email: string;
	password: string;
};

const initialFormData: FormState = {
	name: "",
	cpf: "",
	email: "",
	password: "",
};

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

export function CreateNewUserModal({
	closeModal,
	isOpen,
}: CreateNewUserModalProps) {
	const router = useRouter();
	const [formData, setFormData] = useState<FormState>(initialFormData);
	const [isPending, startTransition] = useTransition();

	function handleInputChange<K extends keyof FormState>(
		field: K,
		value: FormState[K],
	) {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}

	function reset() {
		setFormData(initialFormData);
	}

	const canSubmit = useMemo(() => {
		return (
			!!formData.name.trim() &&
			!!formData.cpf.trim() &&
			!!formData.email.trim() &&
			!!formData.password
		);
	}, [formData]);

	function handleSubmit() {
		startTransition(async () => {
			try {
				await createAdminClient({
					name: formData.name.trim(),
					cpf: formData.cpf.trim(),
					email: formData.email.trim(),
					password: formData.password,
				});
				toast.success("Usuário cadastrado!");
				reset();
				closeModal();
				router.refresh();
			} catch (err) {
				toast.error(
					err instanceof Error
						? err.message
						: "Não foi possível cadastrar o usuário.",
				);
			}
		});
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) {
					reset();
					closeModal();
				}
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cadastrar Usuário</DialogTitle>
					<DialogDescription className="max-w-sm">
						Insira os dados para cadastrar um novo cliente.
					</DialogDescription>
				</DialogHeader>
				<form
					className="my-2 flex flex-col gap-4"
					onSubmit={(e) => {
						e.preventDefault();
						if (canSubmit && !isPending) handleSubmit();
					}}
				>
					<div className="flex flex-col gap-3">
						<Label htmlFor="name">Nome</Label>
						<Input
							id="name"
							placeholder="John Doe"
							className="h-8"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col gap-3">
						<Label htmlFor="cpf">CPF</Label>
						<Input
							id="cpf"
							placeholder="000.000.000-00"
							className="h-8"
							value={formData.cpf}
							onChange={(e) =>
								handleInputChange("cpf", formatCpf(e.target.value))
							}
							inputMode="numeric"
							maxLength={14}
							pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
							title="Digite um CPF no formato 000.000.000-00"
							required
						/>
					</div>

					<div className="flex flex-col gap-3">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="johndoe@gmail.com"
							className="h-8"
							value={formData.email}
							onChange={(e) => handleInputChange("email", e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col gap-3">
						<Label htmlFor="password">Senha</Label>
						<PasswordInput
							id="password"
							placeholder="••••••••••"
							className="h-8.5!"
							value={formData.password}
							onChange={(e) => handleInputChange("password", e.target.value)}
							required
						/>
					</div>
				</form>
				<DialogFooter className="ml-auto">
					<Button
						variant="outline"
						onClick={() => {
							reset();
							closeModal();
						}}
						disabled={isPending}
					>
						Cancelar
					</Button>
					<Button onClick={handleSubmit} disabled={isPending || !canSubmit}>
						{isPending ? "Cadastrando..." : "Cadastrar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
