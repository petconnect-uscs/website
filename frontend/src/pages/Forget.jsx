import { Link } from "react-router-dom";

import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Forget() {
  return (
    <main className="flex">
      <img src={banner} className="h-screen" />

      <div className="flex flex-col justify-center gap-15 mt-10 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-10 absolute top-10" />
          <h1 className="text-6xl font-semibold">Esqueceu a senha?</h1>
          <p>Recupere a senha de sua conta</p>
        </div>

        <form className="flex flex-col gap-10">
          <div className="flex flex-col gap-2 ">
            <Label for="email">Nova Senha </Label>
            <Input type="nome" id="nome" placeholder="*********" />
          </div>
          <div className="flex flex-col gap-2 ">
            <Label for="email">Confirmar Senha</Label>
            <Input type="nome" id="nome" placeholder="*********" />
          </div>

          <Button size="xl">Alterar Senha</Button>
        </form>
      </div>
    </main>
  );
}
