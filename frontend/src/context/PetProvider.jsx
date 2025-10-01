import { createContext, useContext, useState } from "react";

const Context = createContext();

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);

  const addPet = (petData) => {
    setPets((prevPets) => [...prevPets, petData]);
  };

  const value = {
    pets,
    addPet,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePetProvider() {
  return useContext(Context);
}
