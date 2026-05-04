import type { NextFunction, Request, Response, RequestHandler } from "express";
import * as petService from "@/services/pet-service.ts";
import { AppError } from "@/services/auth-service.ts";

function asyncHandler(
  serviceFn: (req: Request) => Promise<unknown>,
  successStatus = 200,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceFn(req);
      return res.status(successStatus).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return next(err);
    }
  };
}

const listPets = asyncHandler((req) => petService.listPetsByClient(req.user?.cpf));

const getPet = asyncHandler((req) =>
  petService.getPetByClient(req.params.id as string, req.user?.cpf),
);

const createPet = asyncHandler(
  (req) => petService.createPetForClient(req.body as Record<string, unknown>, req.user?.cpf),
  201,
);

const updatePet = asyncHandler((req) =>
  petService.updatePetForClient(req.params.id as string, req.body as Record<string, unknown>, req.user?.cpf),
);

const deletePet = asyncHandler(async (req) => {
  await petService.deletePetForClient(req.params.id as string, req.user?.cpf);
  return { message: "Pet removido com sucesso" };
});

const listBreeds = asyncHandler(() => petService.listBreeds());

const listBreedsBySpecies = asyncHandler((req) => petService.listBreedsBySpecies(req.params.speciesId as string));

const listVaccines = asyncHandler(() => petService.listVaccines());

const listSpecies = asyncHandler(() => petService.listSpecies());

const uploadPetImage: RequestHandler = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhuma imagem enviada" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/public/imgs/${req.file.filename}`;
  return res.status(200).json({ image_url: imageUrl });
};

export { listPets, getPet, createPet, updatePet, deletePet, listBreeds, listVaccines, listSpecies, uploadPetImage, listBreedsBySpecies };
