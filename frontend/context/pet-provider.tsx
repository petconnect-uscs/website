"use client";

import { createContext, useContext, useState } from "react";

import type { PetDisplay } from "@/types/pet";

type PetContextValue = {
  pets: PetDisplay[];
  addPet: (petData: PetDisplay) => void;
};

const Context = createContext<PetContextValue | undefined>(undefined);

export function PetProvider({ children }: { children: React.ReactNode }) {
  const [pets, setPets] = useState<PetDisplay[]>([]);

  const addPet = (petData: PetDisplay) => {
    setPets((prevPets) => [...prevPets, petData]);
  };

  const value: PetContextValue = {
    pets,
    addPet,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePetProvider() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("usePetProvider must be used within a PetProvider");
  }
  return context;
}
