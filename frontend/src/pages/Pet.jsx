import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { CreateNewPetModal } from "@/components/modals/CreateNewPetModal";
import { useState } from "react";
import { usePetProvider } from "@/context/PetProvider";

export function Pet() {
  const [isOpen, setIsOpen] = useState(false);
  const { pets } = usePetProvider();

  return (
    <>
      <main className="pl-[278px] pr-[60px] mt-12">
        {pets.length > 0 ? (
          <div className="flex flex-col gap-5.5">
            <div className="flex items-center justify-between">
              <h1 className="relative text-2xl font-semibold">
                Pets{" "}
                <span className="absolute text-orange-500 text-xs">
                  ({pets.length})
                </span>
              </h1>
              <Button onClick={() => setIsOpen(true)}>
                <PlusIcon className="w-4 h-4" />
                Cadastrar
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {pets.map((pet) => (
                <div key={pet.name} className="flex flex-col rounded-lg border">
                  <img
                    src={pet.image}
                    className="w-full h-[170px] object-cover rounded-t-lg rounded-b-none"
                    alt="Cachorro Golden Retriever"
                  />
                  <div className="grid grid-cols-2 w-[80%] gap-y-4 !mt-4 !ml-4">
                    <div className="flex flex-col ">
                      <span className="text-xs text-muted-foreground font-medium">
                        Nome
                      </span>
                      <p className="font-semibold text-foreground">
                        {pet.name}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">
                        Idade
                      </span>
                      <p className="font-semibold text-foreground">{pet.age}</p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">
                        Raça
                      </span>
                      <p className="font-semibold text-foreground">
                        {pet.breed}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground font-medium">
                        Sexo
                      </span>
                      <p className="font-semibold text-foreground">{pet.sex}</p>
                    </div>
                  </div>
                  <div className="flex justify-between gap-1 mt-6 p-1">
                    <Button size="lg" className="flex-grow">
                      Ver Vacinas
                    </Button>
                    <Button size="lg" variant="outline">
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 h-[calc(100vh-48px)]">
            <svg
              width="151"
              height="133"
              viewBox="0 0 151 133"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.5">
                <path
                  d="M75.4812 56.6113C52.068 56.6113 18.872 92.8057 18.872 115.653C18.872 125.943 26.7766 132.09 40.0238 132.09C54.4237 132.09 63.9323 124.696 75.4812 124.696C87.1303 124.696 96.6654 132.09 110.939 132.09C124.186 132.09 132.09 125.943 132.09 115.653C132.09 92.8057 98.8944 56.6113 75.4812 56.6113ZM32.0572 52.8933C28.9909 42.6771 19.5442 36.0609 10.9585 38.113C2.37277 40.1651 -2.09994 50.11 0.966387 60.3262C4.03272 70.5424 13.4794 77.1586 22.0651 75.1065C30.6508 73.0545 35.1235 63.1095 32.0572 52.8933ZM57.036 46.7666C66.1583 44.3666 70.7225 32.0423 67.2316 19.2404C63.7407 6.43842 53.5156 -1.99104 44.3933 0.408957C35.271 2.80895 30.7068 15.1332 34.1977 27.9352C37.6886 40.7371 47.9166 49.1695 57.036 46.7666ZM140.001 38.116C131.415 36.0639 121.971 42.6801 118.902 52.8963C115.836 63.1125 120.309 73.0574 128.894 75.1095C137.48 77.1616 146.924 70.5454 149.993 60.3292C153.059 50.113 148.587 40.1681 140.001 38.116ZM93.9263 46.7666C103.049 49.1666 113.274 40.7371 116.765 27.9352C120.255 15.1332 115.691 2.8119 106.569 0.408957C97.4467 -1.99398 87.2217 6.43842 83.7308 19.2404C80.2399 32.0423 84.804 44.3666 93.9263 46.7666Z"
                  fill="#DADADA"
                />
                <path
                  d="M75.4814 57.1113C81.2131 57.1114 87.589 59.3294 93.9512 63.0547C100.308 66.7768 106.616 71.9831 112.202 77.9072C117.788 83.8309 122.641 90.4609 126.095 97.0215C129.552 103.589 131.591 110.053 131.591 115.653C131.591 120.656 129.675 124.615 126.175 127.336C122.658 130.069 117.492 131.59 110.938 131.59C103.889 131.59 98.0033 129.766 92.3818 127.918C86.7791 126.076 81.4018 124.195 75.4814 124.195C69.6106 124.195 64.2635 126.077 58.665 127.918C53.048 129.765 47.1367 131.59 40.0234 131.59C33.4699 131.59 28.3034 130.069 24.7871 127.336C21.2867 124.615 19.3722 120.656 19.3721 115.653C19.3721 110.053 21.4097 103.589 24.8672 97.0215C28.3213 90.4608 33.1748 83.831 38.7607 77.9072C44.3469 71.9833 50.6544 66.7767 57.0107 63.0547C63.3731 59.3292 69.7497 57.1113 75.4814 57.1113ZM119.381 53.04C122.398 42.996 131.632 36.6301 139.885 38.6025C148.101 40.5665 152.526 50.1478 149.514 60.1855C146.496 70.2293 137.263 76.5953 129.011 74.623C120.922 72.6898 116.507 63.3751 119.245 53.5098L119.381 53.04ZM11.0752 38.5996C19.3277 36.6274 28.5636 42.9935 31.5781 53.0371C34.5909 63.0748 30.1658 72.656 21.9492 74.6201C13.6967 76.5926 4.45994 70.2264 1.44531 60.1826C-1.56748 50.1448 2.85841 40.5635 11.0752 38.5996ZM44.5205 0.892578C48.8847 -0.255596 53.5603 1.17374 57.6064 4.50977C61.651 7.84464 65.0277 13.0597 66.749 19.3721C68.4703 25.6846 68.1991 31.8583 66.3945 36.7305C64.5897 41.6033 61.2717 45.1353 56.9092 46.2832H56.9082C52.5458 47.4325 47.8706 46.0033 43.8242 42.667C39.7791 39.3317 36.401 34.1162 34.6797 27.8037C32.9584 21.4913 33.2298 15.3174 35.0342 10.4453C36.839 5.57235 40.1578 2.04037 44.5205 0.892578ZM93.3564 4.50879C97.4025 1.17248 102.077 -0.25687 106.441 0.892578C110.804 2.04181 114.123 5.57371 115.928 10.4463C117.732 15.3181 118.004 21.4912 116.282 27.8037C114.561 34.116 111.184 39.3312 107.14 42.666C103.094 46.002 98.4178 47.4313 94.0537 46.2832C89.691 45.1354 86.3722 41.6034 84.5674 36.7305C82.7629 31.8584 82.4916 25.6845 84.2129 19.3721C85.9342 13.0596 89.3118 7.84402 93.3564 4.50879Z"
                  stroke="#424242"
                  stroke-opacity="0.38"
                />
              </g>
            </svg>
            <span className="text-muted-foreground text-[26px] font-semibold">
              Nenhum pet encontrado
            </span>
            <Button onClick={() => setIsOpen(true)} size="lg">
              <PlusIcon className="w-4 h-4" />
              Cadastrar
            </Button>
          </div>
        )}
      </main>
      <CreateNewPetModal isOpen={isOpen} closeModal={() => setIsOpen(false)} />
    </>
  );
}
