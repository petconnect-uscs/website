"use client";

import { useState, useTransition } from "react";

import { ChevronDownIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
	createPetAction,
	uploadPetImageAction,
	type PetOptions,
} from "@/app/actions/pets";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import {
	type BreedSpecies,
	getBreedSpecies,
	translateBreedName,
} from "@/lib/breed-translations";

const SPECIES_TO_BREED: Record<string, BreedSpecies> = {
	Cachorro: "dog",
	Gato: "cat",
};

type CreateNewPetModalProps = {
	closeModal: () => void;
	isOpen: boolean;
	options: PetOptions;
};

type FormState = {
	name: string;
	species_name: string;
	breed_id: string;
	sex: string;
	birth_date: Date | undefined;
	image_file: File | undefined;
	is_neutered: boolean | undefined;
	is_vaccinated: boolean | undefined;
	vaccine_ids: string[];
};

const initialFormData: FormState = {
	name: "",
	species_name: "",
	breed_id: "",
	sex: "",
	birth_date: undefined,
	image_file: undefined,
	is_neutered: undefined,
	is_vaccinated: undefined,
	vaccine_ids: [],
};

export function CreateNewPetModal({
	closeModal,
	isOpen,
	options,
}: CreateNewPetModalProps) {
	const router = useRouter();
	const [activeStep, setActiveStep] = useState(0);
	const [datePickerOpen, setDatePickerOpen] = useState(false);
	const [formData, setFormData] = useState<FormState>(initialFormData);
	const [isPending, startTransition] = useTransition();

	function handleInputChange<K extends keyof FormState>(
		field: K,
		value: FormState[K],
	) {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}

	function handleVaccineChange(
		vaccineId: string,
		checked: boolean | "indeterminate",
	) {
		setFormData((prev) => ({
			...prev,
			vaccine_ids:
				checked === true
					? [...prev.vaccine_ids, vaccineId]
					: prev.vaccine_ids.filter((id) => id !== vaccineId),
		}));
	}

	function reset() {
		setFormData(initialFormData);
		setActiveStep(0);
	}

	function handleSubmit() {
		if (activeStep === 0) {
			setActiveStep(1);

			return;
		}

		startTransition(async () => {
			let imageUrl: string | undefined;

			if (formData.image_file) {
				const upload = new FormData();

				upload.append("image", formData.image_file);

				const uploadResult = await uploadPetImageAction(upload);

				if ("error" in uploadResult) {
					toast.error(uploadResult.error ?? "Falha ao enviar a imagem.");

					return;
				}

				imageUrl = uploadResult.image_url;
			}

			const result = await createPetAction({
				name: formData.name.trim(),
				species_name: formData.species_name || undefined,
				breed_id: formData.breed_id || undefined,
				sex: formData.sex || undefined,
				birth_date: formData.birth_date?.toISOString(),
				image_url: imageUrl,
				is_neutered: formData.is_neutered,
				is_vaccinated: formData.is_vaccinated,
				vaccine_ids: formData.vaccine_ids.length
					? formData.vaccine_ids
					: undefined,
			});

			if ("error" in result) {
				toast.error(result.error ?? "Falha ao cadastrar o pet.");

				return;
			}

			toast.success("Pet cadastrado!");
			reset();
			closeModal();
			router.refresh();
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
			<DialogContent className="p-6">
				<DialogHeader>
					<DialogTitle>Cadastrar Pet</DialogTitle>
					<DialogDescription className="max-w-sm">
						Insira os dados para cadastrar seu pet
					</DialogDescription>
				</DialogHeader>
				<form className="my-2 flex flex-col gap-4">
					{activeStep === 0 ? (
						<>
							<div className="flex flex-col gap-3">
								<Label htmlFor="name">Nome</Label>
								<Input
									placeholder="John Doe"
									id="name"
									className="h-8"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Espécie</Label>
								<Select
									value={formData.species_name}
									onValueChange={(value) => {
										handleInputChange("species_name", value);
										handleInputChange("breed_id", "");
									}}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Cachorro">Cachorro</SelectItem>
										<SelectItem value="Gato">Gato</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Raça</Label>
								<Select
									value={formData.breed_id}
									onValueChange={(value) =>
										handleInputChange("breed_id", value)
									}
									disabled={!formData.species_name}
								>
									<SelectTrigger className="w-full">
										<SelectValue
											placeholder={
												formData.species_name
													? "Selecionar"
													: "Selecione a espécie primeiro"
											}
										/>
									</SelectTrigger>
									<SelectContent>
										{options.breeds
											.filter((b) => {
												const target = SPECIES_TO_BREED[formData.species_name];
												if (!target) return true;
												return getBreedSpecies(b.name) === target;
											})
											.map((b) => (
												<SelectItem key={b.id} value={b.id}>
													{translateBreedName(b.name)}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Sexo</Label>
								<Select
									value={formData.sex}
									onValueChange={(value) => handleInputChange("sex", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Macho</SelectItem>
										<SelectItem value="female">Fêmea</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Data de Nascimento</Label>
								<Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											id="date"
											className="w-full justify-between font-normal text-sm text-muted-foreground h-8! pl-3! pr-2!"
										>
											{formData.birth_date
												? formData.birth_date.toLocaleDateString("pt-BR")
												: "Selecionar"}
											<ChevronDownIcon className="size-5 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={formData.birth_date}
											captionLayout="dropdown"
											onSelect={(date) => {
												handleInputChange("birth_date", date);
												setDatePickerOpen(false);
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Imagem do Pet</Label>
								<FileUpload
									multiple={false}
									onFilesChange={(files) =>
										handleInputChange("image_file", files[0])
									}
								/>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col gap-3">
								<Label>Seu pet é castrado?</Label>
								<RadioGroup
									value={
										formData.is_neutered === undefined
											? ""
											: String(formData.is_neutered)
									}
									onValueChange={(value) =>
										handleInputChange("is_neutered", value === "true")
									}
									className="flex gap-3"
								>
									<div className="flex items-center">
										<RadioGroupItem value="true" id="yes-castrated" />
										<Label htmlFor="yes-castrated" className="pl-2">
											Sim
										</Label>
									</div>
									<div className="flex items-center">
										<RadioGroupItem value="false" id="no-castrated" />
										<Label htmlFor="no-castrated" className="pl-2">
											Não
										</Label>
									</div>
								</RadioGroup>
							</div>
							<div className="flex flex-col gap-3 mt-2">
								<Label>Seu pet é vacinado?</Label>
								<RadioGroup
									value={
										formData.is_vaccinated === undefined
											? ""
											: String(formData.is_vaccinated)
									}
									onValueChange={(value) =>
										handleInputChange("is_vaccinated", value === "true")
									}
									className="flex gap-3"
								>
									<div className="flex items-center">
										<RadioGroupItem value="true" id="yes-vaccinated" />
										<Label htmlFor="yes-vaccinated" className="pl-2">
											Sim
										</Label>
									</div>
									<div className="flex items-center">
										<RadioGroupItem value="false" id="no-vaccinated" />
										<Label htmlFor="no-vaccinated" className="pl-2">
											Não
										</Label>
									</div>
								</RadioGroup>
							</div>
							{formData.is_vaccinated && (
								<div className="flex flex-col gap-3 mt-2">
									<Label>Marque as vacinas que seu pet tomou</Label>
									{options.vaccines.length === 0 ? (
										<p className="text-sm text-muted-foreground">
											Nenhuma vacina disponível.
										</p>
									) : (
										options.vaccines.map((v) => (
											<div key={v.id} className="flex items-center">
												<Checkbox
													id={`vaccine-${v.id}`}
													checked={formData.vaccine_ids.includes(v.id)}
													onCheckedChange={(checked) =>
														handleVaccineChange(v.id, checked)
													}
												/>
												<Label
													htmlFor={`vaccine-${v.id}`}
													className="text-muted-foreground pl-2"
												>
													{v.name}
												</Label>
											</div>
										))
									)}
								</div>
							)}
						</>
					)}
				</form>
				<DialogFooter className="ml-auto">
					{activeStep !== 0 && (
						<Button
							variant="outline"
							onClick={() => setActiveStep(0)}
							disabled={isPending}
						>
							Voltar
						</Button>
					)}
					<Button
						onClick={handleSubmit}
						disabled={isPending || (activeStep === 0 && !formData.name.trim())}
					>
						{activeStep === 0
							? "Continuar"
							: isPending
								? "Cadastrando..."
								: "Cadastrar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
