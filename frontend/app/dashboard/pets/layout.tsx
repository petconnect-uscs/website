import { PetProvider } from "@/context/pet-provider";

export default function PetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PetProvider>{children}</PetProvider>;
}
