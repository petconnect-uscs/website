import { Link } from "react-router-dom";

import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Senha() {
  return (
    <main className="flex">
      <img src={banner} className="h-screen" />

      <div className="flex flex-col justify-center gap-15 mt-10 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-10 absolute top-10" />
          <h1 className="text-6xl font-semibold">Esqueceu a senha?</h1>
          <p>Recupere a senha de sua conta</p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-2 ">
            <Label for="email">Email</Label>
            <Input type="nome" id="nome" placeholder="seu@exemplo.com" />
          </div>

          <Button size="xl">Enviar</Button>

          <div className=" text-neutral-400 flex items-center justify-center text-center absolute bottom-10">
            <p>
              Continuando, você aceitara nossos {""}
              <span className="text-neutral-400 underline underline-offset-4 decoration-neutral-400 bottom-0">
                Termos de serviço e Política de privacidade.
              </span>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
