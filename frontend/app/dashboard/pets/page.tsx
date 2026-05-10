import { redirect } from "next/navigation";

import { fetchPetOptions, fetchPets } from "@/app/actions/pets";
import { getUser } from "@/lib/dal";

import { PetsView } from "./pets-view";

export default async function PetsPage() {
	const user = await getUser();

	if (user.role === "admin") {
		redirect("/dashboard");
	}

	const [pets, options] = await Promise.all([fetchPets(), fetchPetOptions()]);

	return <PetsView pets={pets} options={options} />;
}
