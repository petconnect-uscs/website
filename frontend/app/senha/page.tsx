import type { Metadata } from "next";
import Image from "next/image";

import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
	title: "Recuperar senha",
};

// TODO(api): no backend route exists for requesting a password-reset email.
// Wire to e.g. POST /auth/forgot-password once it is implemented.
export default function SenhaPage() {
	return (
		<main className="flex">
			<div className="relative flex flex-col justify-center gap-12 mt-10 max-w-xl mx-auto w-full">
				<div className="flex flex-col gap-4">
					<Image
						src={logo}
						alt="logo"
						width={100}
						height={100}
						className="w-20 mb-10"
					/>
					<h1 className="text-6xl font-semibold">Esqueceu a senha?</h1>
					<p>Recupere a senha de sua conta</p>
				</div>

				<form className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="email">Email</Label>
						<Input type="email" id="email" placeholder="seu@exemplo.com" />
					</div>

					<Button>Enviar</Button>

					<div className="text-neutral-400 flex items-center justify-center text-center mt-8">
						<p>
							Continuando, você aceitará nossos{" "}
							<span className="text-neutral-400 underline underline-offset-4 decoration-neutral-400">
								Termos de serviço e Política de privacidade.
							</span>
						</p>
					</div>
				</form>
			</div>
		</main>
	);
}
