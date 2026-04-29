import { Router } from "express";
import { uploadImage } from "@/middleware/upload.ts";
import {
  listPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
  listBreeds,
  listVaccines,
  listSpecies,
  uploadPetImage,
} from "@/controllers/pet-controller.ts";

const router = Router();

// Rotas fixas ANTES de /:id para evitar conflito de parâmetro
router.get("/breeds", listBreeds);
router.get("/vaccines", listVaccines);
router.get("/species", listSpecies);
router.post("/upload", uploadImage.single("image"), uploadPetImage);

// CRUD
router.get("/", listPets);
router.get("/:id", getPet);
router.post("/", createPet);
router.put("/:id", updatePet);
router.delete("/:id", deletePet);

export default router;
