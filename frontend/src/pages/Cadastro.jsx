import { Link } from "react-router-dom";

import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function Cadastro() {
	return (
		<main className="flex">
			<img src={banner} className="h-screen border-r border-border" />

			<div className="flex flex-col justify-center gap-8 mt-10 max-w-xl mx-auto w-full">
				<div className="flex flex-col gap-4">
					<img src={logo} className="w-20 mb-2" />
					<h1 className="text-6xl font-semibold">Comece aqui</h1>
					<p>Crie uma nova conta</p>
				</div>

				<form className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<Label for="email">Nome</Label>
						<Input type="nome" id="nome" placeholder="Seu nome" />
					</div>
					<div className="flex flex-col gap-2">
						<Label for="email">Email</Label>
						<Input type="email" id="email" placeholder="seuemail@gmail.com" />
					</div>
					<div className="flex flex-col gap-2">
						<Label for="senha">Senha</Label>
						<Input type="password" id="senha" placeholder="**********" />
					</div>
					<div className="flex item-center gap-2 py-1">
						<Checkbox id="termos" />
						<Label for="termos">
							Aceite os{" "}
							<span className="text-primary underline underline-offset-4 decoration-primary">
								termos de uso
							</span>{" "}
						</Label>
					</div>
					<Button size="xl">Fazer Login</Button>

					<div className="flex items-center justify-center">
						<p>
							Já tem uma conta?{" "}
							<Link
								to="/"
								className="underline underline-offset-4 decoration-neutral-400"
							>
								Fazer login
							</Link>
						</p>
					</div>
					<div className=" text-neutral-400 flex items-center justify-center text-center ">
						<p>
							Continuando, você concorda com os nossos {""}
							<span className="block text-neutral-400 underline underline-offset-4 decoration-neutral-400">
								Termos de serviço e Política de privacidade.
							</span>
						</p>
					</div>
				</form>
			</div>
		</main>
	);
}
