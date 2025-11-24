import { Link } from "react-router-dom";

import banner from "@/img/banner.png";
import logo from "@/img/logo.png";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Login() {
  return (
    <main className="flex">
      <img src={banner} className="h-screen" />

      <div className="flex flex-col justify-center gap-10 mt-20 max-w-xl !mx-auto w-full">
        <div className="flex flex-col gap-4">
          <img src={logo} className="w-20 !mb-2" />
          <h1 className="text-6xl font-semibold">Bem vindo!</h1>
          <p>Faça o login em sua conta</p>
        </div>

        <form className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <Label for="email">Email</Label>
            <Input type="email" id="email" placeholder="seuemail@gmail.com" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label for="senha">Senha</Label>
              <Link to="/forget" class="text-sm text-foreground/60">
                Esqueceu a senha?
              </Link>
            </div>
            <Input type="password" id="senha" placeholder="**********" />
          </div>

          <Button size="xl">Fazer Login</Button>

          <div className="flex items-center justify-center">
            <p>
              Não tem uma conta?{" "}
              <Link
                to="/cadastro"
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
