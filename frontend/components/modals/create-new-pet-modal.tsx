import { useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import type { Pet, PetDisplay } from "@/types/pet";
import { usePetProvider } from "@/context/pet-provider";

import { toast } from "sonner";
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

type CreateNewPetModalProps = {
	closeModal: () => void;
	isOpen: boolean;
};

const initialFormData: Partial<Pet> = {
	name: "",
	type: undefined,
	breed: "",
	sex: undefined,
	birthDate: undefined,
	image: undefined,
	castrated: undefined,
	vaccinated: undefined,
	vaccines: [],
};

export function CreateNewPetModal({
	closeModal,
	isOpen,
}: CreateNewPetModalProps) {
	const [activeStep, setActiveStep] = useState(0);
	const [date, setDate] = useState<Date | undefined>(undefined);
	const [open, setOpen] = useState(false);
	const { addPet } = usePetProvider();

	const [formData, setFormData] = useState<Partial<Pet>>(initialFormData);

	function handleInputChange<K extends keyof Pet>(
		field: K,
		value: Partial<Pet>[K],
	) {
		setFormData((prev: Partial<Pet>) => ({ ...prev, [field]: value }));
	}

	function handleVaccineChange(
		vaccine: string,
		checked: boolean | "indeterminate",
	) {
		setFormData((prev: Partial<Pet>) => ({
			...prev,
			vaccines:
				checked === true
					? [...(prev.vaccines ?? []), vaccine]
					: (prev.vaccines ?? []).filter((v: string) => v !== vaccine),
		}));
	}

	function calculateAge(birthDate: Date | undefined) {
		if (!birthDate) return "Idade não informada";

		const today = new Date();
		const birth = new Date(birthDate);
		const diffTime = Math.abs(today.getTime() - birth.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		const years = Math.floor(diffDays / 365);
		const months = Math.floor((diffDays % 365) / 30);

		if (years > 0 && months > 0) {
			return `${years} ano${years > 1 ? "s" : ""} e ${months} mês${
				months > 1 ? "es" : ""
			}`;
		} else if (years > 0) {
			return `${years} ano${years > 1 ? "s" : ""}`;
		} else {
			return `${months} mês${months > 1 ? "es" : ""}`;
		}
	}

	function handleSubmit() {
		if (activeStep === 0) {
			setActiveStep(1);
			return;
		}

		const newPet = {
			name: formData.name,
			age: calculateAge(formData.birthDate),
			breed: formData.breed,
			sex: formData.sex === "male" ? "Macho" : "Fêmea",
			image: formData.image ?? "/src/img/pet1.png",
			type: formData.type,
			castrated: formData.castrated,
			vaccinated: formData.vaccinated,
			vaccines: formData.vaccines ?? [],
		};

		addPet(newPet as PetDisplay);
		closeModal();

		setFormData(initialFormData);

		setActiveStep(0);
		setDate(undefined);

		toast.success("Pet cadastrado!");
	}

	return (
		<Dialog open={isOpen} onOpenChange={closeModal}>
			<DialogContent className="p-6">
				<DialogHeader className="flex flex-col gap-2.5">
					<DialogTitle>Cadastrar Pet</DialogTitle>
					<DialogDescription className="max-w-sm">
						Insira os dados para cadastrar seu pet. Clique em salvar quando
						terminar.
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
									value={formData.name ?? ""}
									onChange={(e) => handleInputChange("name", e.target.value)}
								/>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Tipo</Label>
								<Select
									value={formData.type ?? ""}
									onValueChange={(value) =>
										handleInputChange(
											"type",
											value === "cat" || value === "dog" ? value : undefined,
										)
									}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="dog">Cachorro</SelectItem>
										<SelectItem value="cat">Gato</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Raça</Label>
								<Select
									value={formData.breed ?? ""}
									onValueChange={(value) => handleInputChange("breed", value)}
								>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecionar" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="yorkshire">Yorkshire</SelectItem>
										<SelectItem value="golden">Golden</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Sexo</Label>
								<Select
									value={formData.sex ?? ""}
									onValueChange={(value) =>
										handleInputChange(
											"sex",
											value === "male" || value === "female"
												? value
												: undefined,
										)
									}
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
								<Popover open={open} onOpenChange={setOpen}>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											id="date"
											className="w-full justify-between font-normal text-sm text-muted-foreground pl-3! pr-2!"
										>
											{date ? date.toLocaleDateString("pt-BR") : "Selecionar"}
											<ChevronDownIcon className="size-5 opacity-50" />
										</Button>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto overflow-hidden p-0"
										align="start"
									>
										<Calendar
											mode="single"
											selected={date}
											captionLayout="dropdown"
											onSelect={(date) => {
												setDate(date);
												handleInputChange("birthDate", date);
												setOpen(false);
											}}
										/>
									</PopoverContent>
								</Popover>
							</div>
							<div className="flex flex-col gap-3">
								<Label>Imagem do Pet</Label>
								<FileUpload
									multiple={false}
									onFilesChange={(files) => {
										const url =
											files.length > 0
												? URL.createObjectURL(files[0])
												: undefined;
										handleInputChange("image", url);
									}}
								/>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col gap-3">
								<Label>Seu pet é castrado?</Label>
								<RadioGroup
									value={
										formData.castrated === undefined
											? ""
											: String(formData.castrated)
									}
									onValueChange={(value) =>
										handleInputChange("castrated", value === "true")
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
										formData.vaccinated === undefined
											? ""
											: String(formData.vaccinated)
									}
									onValueChange={(value) =>
										handleInputChange("vaccinated", value === "true")
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
							<div className="flex flex-col gap-3 mt-2">
								<Label>Marque as vacinas que seu pet tomou</Label>
								<div className="flex items-center">
									<Checkbox
										id="v8-v10"
										checked={(formData.vaccines ?? []).includes("v8-v10")}
										onCheckedChange={(checked) =>
											handleVaccineChange("v8-v10", checked)
										}
									/>
									<Label
										htmlFor="v8-v10"
										className="text-muted-foreground pl-2"
									>
										Vacina Multiplas (V8 e V10)
									</Label>
								</div>
								<div className="flex items-center">
									<Checkbox
										id="antirabies"
										checked={(formData.vaccines ?? []).includes("antirabies")}
										onCheckedChange={(checked) =>
											handleVaccineChange("antirabies", checked)
										}
									/>
									<Label
										htmlFor="antirabies"
										className="text-muted-foreground pl-2"
									>
										Vacina Antirrãbica
									</Label>
								</div>
								<div className="flex items-center">
									<Checkbox
										id="canine"
										checked={(formData.vaccines ?? []).includes("canine")}
										onCheckedChange={(checked) =>
											handleVaccineChange("canine", checked)
										}
									/>
									<Label
										htmlFor="canine"
										className="text-muted-foreground pl-2"
									>
										Vacina de Gripe Canina
									</Label>
								</div>
								<div className="flex items-center">
									<Checkbox
										id="giardia"
										checked={(formData.vaccines ?? []).includes("giardia")}
										onCheckedChange={(checked) =>
											handleVaccineChange("giardia", checked)
										}
									/>
									<Label
										htmlFor="giardia"
										className="text-muted-foreground pl-2"
									>
										Vacina contra Giardia
									</Label>
								</div>
							</div>
						</>
					)}
				</form>
				<DialogFooter className="ml-auto">
					{activeStep !== 0 && (
						<Button variant="outline" onClick={() => setActiveStep(0)}>
							Voltar
						</Button>
					)}
					<Button onClick={handleSubmit}>
						{activeStep === 0 ? "Continuar" : "Cadastrar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
