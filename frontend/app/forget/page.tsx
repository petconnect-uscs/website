import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import banner from "@/assets/banner.png";
import logo from "@/assets/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Nova senha",
};

export default function ForgetPage() {
  return (
    <main className="flex">
      <Image
        src={banner}
        alt="banner"
        width={1000}
        height={1000}
        className="h-screen border-r border-border"
      />

      <div className="flex flex-col justify-center gap-12 mt-10 max-w-xl mx-auto w-full">
        <div className="flex flex-col gap-4">
          <Image
            src={logo}
            alt="logo"
            width={100}
            height={100}
            className="w-20 mb-2"
          />
          <h1 className="text-6xl font-semibold">Esqueceu a senha?</h1>
          <p>Recupere a senha de sua conta</p>
        </div>

        <form className="flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <Label htmlFor="nova-senha">Nova Senha</Label>
            <Input
              type="password"
              id="nova-senha"
              placeholder="*********"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmar-senha">Confirmar Senha</Label>
            <Input
              type="password"
              id="confirmar-senha"
              placeholder="*********"
            />
          </div>

          <Button size="lg">Alterar Senha</Button>

          <div className="flex items-center justify-center">
            <p>
              Lembrou a senha?{" "}
              <Link
                href="/"
                className="underline underline-offset-4 decoration-neutral-400"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
