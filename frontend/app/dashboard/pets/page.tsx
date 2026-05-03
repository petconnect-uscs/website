import { fetchPetOptions, fetchPets } from "@/app/actions/pets";

import { PetsView } from "./pets-view";

export default async function PetsPage() {
	const [pets, options] = await Promise.all([fetchPets(), fetchPetOptions()]);

	return <PetsView pets={pets} options={options} />;
}
