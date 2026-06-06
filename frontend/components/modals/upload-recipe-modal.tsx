"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, ChevronDown, Check, PlusIcon } from "lucide-react";

import type { AdminClientWithPets } from "@/app/actions/admin-clients";
import type { AdminDoctor } from "@/app/actions/admin-doctors";
import {
	createAdminRecipeAction,
	uploadAdminRecipePdfAction,
} from "@/app/actions/admin-recipes";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type UploadRecipeModalProps = {
	clients: AdminClientWithPets[];
	doctors: AdminDoctor[];
};

export function UploadRecipeModal({
	clients,
	doctors,
}: UploadRecipeModalProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedCpf, setSelectedCpf] = useState<string>("");
	const [selectedPetId, setSelectedPetId] = useState<string>("");
	const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
	const [files, setFiles] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [isClientOpen, setIsClientOpen] = useState(false);
	const [searchClient, setSearchClient] = useState("");

	const selectedClient = useMemo(
		() => clients.find((c) => c.cpf === selectedCpf),
		[clients, selectedCpf],
	);

	const filteredClients = useMemo(() => {
		if (!searchClient.trim()) return clients;
		const q = searchClient.toLowerCase();
		return clients.filter((c) => c.name.toLowerCase().includes(q));
	}, [clients, searchClient]);

	const pets = useMemo(() => selectedClient?.pets || [], [selectedClient]);

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			setSelectedCpf("");
			setSelectedPetId("");
			setSelectedDoctorId("");
			setFiles([]);
			setSearchClient("");
			setIsClientOpen(false);
		}
		setIsOpen(newOpen);
	};

	async function handleSubmit() {
		if (!selectedCpf) {
			return toast.error("Selecione um tutor.");
		}
		if (!selectedPetId) {
			return toast.error("Selecione um pet.");
		}
		if (!selectedDoctorId) {
			return toast.error("Selecione o doutor responsável.");
		}
		if (files.length === 0) {
			return toast.error("Anexe o arquivo da receita.");
		}

		setIsSubmitting(true);

		try {
			// 1. Upload File
			const formData = new FormData();
			formData.append("pdf", files[0]);

			const uploadRes = await uploadAdminRecipePdfAction(formData);

			if ("error" in uploadRes) {
				toast.error(uploadRes.error);
				setIsSubmitting(false);
				return;
			}

			// 2. Create Recipe
			const createRes = await createAdminRecipeAction({
				client_cpf: selectedCpf,
				pet_id: selectedPetId,
				doctor_id: selectedDoctorId,
				pdf_url: uploadRes.pdf_url,
			});

			if ("error" in createRes) {
				toast.error(createRes.error);
			} else {
				toast.success("Receita enviada com sucesso!");
				handleOpenChange(false);
			}
		} catch (err) {
			toast.error("Ocorreu um erro inesperado.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button className="bg-primary hover:bg-primary/90 text-white gap-2">
					<PlusIcon className="w-4 h-4" />
					Upload de Receita
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md w-[92vw] rounded-xl sm:w-full">
				<DialogHeader>
					<DialogTitle className="text-xl">Upload de Receita</DialogTitle>
				</DialogHeader>

				<div className="space-y-4 py-4">
					{/* Doutor */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Doutor</label>
						<div className="pt-2">
							<Select
								value={selectedDoctorId}
								onValueChange={setSelectedDoctorId}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Selecionar" />
								</SelectTrigger>
								<SelectContent>
									{doctors.map((doctor) => (
										<SelectItem key={doctor.doctor_id} value={doctor.doctor_id}>
											{doctor.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

					</div>

					{/* Tutor */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Tutor</label>
						<div className="pt-2">
							<Popover open={isClientOpen} onOpenChange={setIsClientOpen} modal={true}>
								<PopoverTrigger asChild>
									<Button
										variant="outline"
										role="combobox"
										aria-expanded={isClientOpen}
										className="w-full justify-between font-normal"
									>
										{selectedClient ? selectedClient.name : "Selecionar Tutor"}
										<ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-200 ${isClientOpen ? "rotate-180" : ""}`} />
									</Button>
								</PopoverTrigger>
								<PopoverContent
									className="w-[var(--radix-popover-trigger-width)] p-0"
									align="start"
								>
									<div className="p-2 border-b">
										<Input
											placeholder="Pesquisar tutor..."
											value={searchClient}
											onChange={(e) => setSearchClient(e.target.value)}
											className="h-8"
										/>
									</div>
									<div className="max-h-60 overflow-y-auto p-1">
										{filteredClients.length === 0 ? (
											<p className="p-2 text-sm text-muted-foreground text-center">
												Nenhum tutor encontrado.
											</p>
										) : (
											filteredClients.map((client) => (
												<div
													key={client.cpf}
													className="flex items-center justify-between cursor-pointer hover:bg-neutral-100 rounded px-2 py-1.5 text-sm"
													onClick={() => {
														setSelectedCpf(client.cpf);
														setSelectedPetId("");
														setIsClientOpen(false);
														setSearchClient("");
													}}
												>
													<span>{client.name}</span>
													{selectedCpf === client.cpf && (
														<Check className="w-4 h-4 text-primary" />
													)}
												</div>
											))
										)}
									</div>
								</PopoverContent>
							</Popover>
						</div>
					</div>

					{/* Pet */}
					<div className="space-y-2">
						<label className="text-sm font-medium text-foreground">Pet</label>
						<div className="pt-2">
							<Select
								value={selectedPetId}
								onValueChange={setSelectedPetId}
								disabled={!selectedCpf || pets.length === 0}
							>
								<SelectTrigger className="w-full [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180">
									<SelectValue placeholder="Selecionar Pet" />
								</SelectTrigger>
								<SelectContent>
									{pets.map((pet) => (
										<SelectItem key={pet.pet_id} value={pet.pet_id}>
											{pet.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Arquivo */}
					<div className="space-y-2 pt-2">
						<label className="text-sm font-medium text-foreground flex items-center gap-1">
							Arquivo da Receita
							<span
								className="text-muted-foreground cursor-help"
								title="Anexe o documento em PDF ou imagem"
							>
								ⓘ
							</span>
						</label>
						<FileUpload
							multiple={false}
							onFilesChange={setFiles}
							accept=".pdf,.png,.jpg,.jpeg,.webm"
							extensionsText="Extensões aceitas: pdf, png, jpg, jpeg, webm"
						/>
					</div>
				</div>

				<div className="flex justify-end pt-2">
					<Button
						onClick={handleSubmit}
						disabled={isSubmitting}
						className="bg-primary hover:bg-primary/90 text-white"
					>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Continuar
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
