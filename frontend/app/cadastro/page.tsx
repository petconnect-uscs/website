import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cadastro",
};

import banner from "@/assets/banner.png";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Cadastro() {
  return (
    <main className="flex">
      <Image
        src={banner}
        alt="banner"
        width={1000}
        height={1000}
        className="h-screen border-r border-border"
      />

      <div className="flex flex-col justify-center gap-8 mt-10 max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="w-20 mb-2"
          />
          <h1 className="text-6xl font-semibold">Comece aqui</h1>
          <p>Crie uma nova conta</p>
        </div>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Nome</Label>
            <Input type="nome" id="nome" placeholder="Seu nome" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="seuemail@gmail.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="senha">Senha</Label>
            <Input type="password" id="senha" placeholder="**********" />
          </div>
          <div className="flex item-center gap-2 py-1">
            <Checkbox id="termos" />
            <Label htmlFor="termos">
              Aceite os{" "}
              <span className="text-primary underline underline-offset-4 decoration-primary">
                termos de uso
              </span>{" "}
            </Label>
          </div>
          <Button size="lg">Entrar</Button>

          <div className="flex items-center justify-center">
            <p>
              Já tem uma conta?{" "}
              <Link
                href="/"
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
