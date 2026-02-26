export type Pet = {
  name: string;
  type: "cat" | "dog";
  breed: string;
  sex: "male" | "female";
  birthDate: Date;
  image: string;
  castrated: boolean;
  vaccinated: boolean;
  vaccines: string[];
};

export type PetDisplay = {
  name: string;
  age: string;
  breed: string;
  sex: string;
  image: string;
  type?: "cat" | "dog";
  castrated?: boolean;
  vaccinated?: boolean;
  vaccines?: string[];
};
