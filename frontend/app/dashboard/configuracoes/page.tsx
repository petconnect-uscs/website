import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { fetchClientProfile } from "@/app/actions/profile";
import { getUser } from "@/lib/dal";

import { ProfileSettingsForm } from "./profile-settings-form";

export const metadata: Metadata = {
	title: "Configurações",
};

export default async function ConfiguracoesPage() {
	const user = await getUser();

	if (user.role !== "client") {
		redirect("/dashboard");
	}

	const profile = await fetchClientProfile();

	return (
		<main>
			<ProfileSettingsForm key={profile.updated_at} profile={profile} />
		</main>
	);
}
