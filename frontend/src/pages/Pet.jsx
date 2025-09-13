import { Link } from "react-router-dom";

import logo from "@/img/logo.png";
import pet1 from "@/img/pet1.png";
import pet2 from "@/img/pet2.png";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function Pet() {
  return (
    <main className="flex flex-col min-h-screen">
      <img src={logo} className="w-18 fixed top-4 left-4 z-10" alt="Logo" />

      <h1 className="text-3xl font-semibold font-sans mb-8 mt-20 relative top-15 left-96">
        Pets <span className="text-orange-500 text-sm align-top">(2)</span>
      </h1>

      <Button className="fixed top-15 right-10 z-10 !px-3 !py-3 text-lg font-light  ">
        + Cadastrar
      </Button>

      <div className="flex gap-4 max-w-4xl relative top-20 left-96 ">
        <div className="w-96 flex flex-col rounded-lg border-2 p-6">
          <img
            src={pet1}
            className="w-full h-64 object-cover rounded-t-lg rounded-b-none"
            alt="Cachorro Golden Retriever"
          />
          <div className="grid grid-cols-2 gap-1 !mt-4 !ml-4">
            <div className="flex flex-col ">
              <label className="text-xs font-light">Nome</label>
              <p className="font-semibold">Rex</p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-light">Idade</label>
              <p className="font-semibold">5 anos e 6 meses</p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-light">Raça</label>
              <p className="font-semibold">Golden</p>
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-light">Sexo</label>
              <p className="font-semibold">Macho</p>
            </div>
          </div>
          <div className="flex justify-between gap-0.5 !mt-6">
            <Button size="xl" className="flex-3">
              Ver Vacinas
            </Button>
            <Button
              size="xl"
              className="flex-1 bg-white text-orange-400 border-2 border-orange-300 hover:bg-orange-100"
            >
              Excluir
            </Button>
          </div>
        </div>
        <div className="w-96 flex flex-col rounded-lg border-2 p-6">
          <img
            src={pet2}
            className="w-full h-64 object-cover rounded-t-lg rounded-b-none"
            alt="Cachorro Yorkshire"
          />
          <div className="grid grid-cols-2  gap-1 !mt-4 !ml-4">
            <div className="flex flex-col ">
              <label className="text-xs font-light">Nome</label>
              <p className="font-semibold">Pérola</p>
            </div>
            <div className="flex flex-col ">
              <label className="text-xs font-light">Idade</label>
              <p className="font-semibold">2 anos e 3 meses</p>
            </div>
            <div className="flex flex-col ">
              <label className="text-xs font-light">Raça</label>
              <p className="font-semibold">Yorkshire</p>
            </div>
            <div className="flex flex-col ">
              <label className="text-xs font-light">Sexo</label>
              <p className="font-semibold">Fêmea</p>
            </div>
          </div>
          <div className="flex justify-between gap-0.5 !mt-6">
            <Button size="xl" className="flex-3">
              Ver Vacinas
            </Button>
            <Button
              size="xl"
              className="flex-1 bg-white text-orange-400 border-2 border-orange-300 hover:bg-orange-100"
            >
              Excluir
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
