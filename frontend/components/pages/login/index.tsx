"use client";

import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

import banner from "@/assets/banner.png";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="flex">
      <Image
        src={banner}
        alt="banner"
        width={1000}
        height={1000}
        className="h-screen border-r border-border"
      />

      <div className="flex flex-col justify-center gap-10 mt-20 max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="w-20 mb-2"
          />
          <h1 className="text-6xl font-semibold">Bem vindo!</h1>
          <p>Faça o login em sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="seuemail@gmail.com" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="senha">Senha</Label>
              <Link href="/forget" className="text-sm text-foreground/60">
                Esqueceu a senha?
              </Link>
            </div>
            <Input type="password" id="senha" placeholder="**********" />
          </div>

          <Button size="lg">Entrar</Button>

          <div className="flex items-center justify-center">
            <p>
              Não tem uma conta?{" "}
              <Link
                href="/cadastro"
                className="underline underline-offset-4 decoration-neutral-400"
              >
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
