const SPECIALTIES: Record<string, string> = {
	cardiology: "Cardiologia",
	dentistry: "Odontologia",
	dermatology: "Dermatologia",
	endocrinology: "Endocrinologia",
	neurology: "Neurologia",
	oncology: "Oncologia",
	ophthalmology: "Oftalmologia",
	orthopedics: "Ortopedia",
	pediatrics: "Pediatria",
	psychiatry: "Psiquiatria",
};

export function translateSpecialtyName(name: string): string {
	const key = name.trim().toLowerCase();

	return SPECIALTIES[key] ?? name;
}
