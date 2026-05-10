import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import requireAdmin from "@/middleware/require-admin.ts";
import upload from "@/middleware/upload.ts";
import {
  getProfile,
  updateProfile,
  getClients,
  deleteClient,
  getAppointments,
  getRecipes,
  getDoctors,
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  createRecipe,
  deleteRecipe,
  uploadRecipePdf,
  getDoctorAppointments,
  getBreeds,
  createBreed,
  updateBreed,
  deleteBreed,
} from "@/controllers/admin-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireAdmin);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/clients", getClients);
router.delete("/clients/:cpf", deleteClient);
router.get("/appointments", getAppointments);
router.get("/recipes", getRecipes);
router.post("/recipes/upload", upload.single("pdf"), uploadRecipePdf);
router.post("/recipes", createRecipe);
router.delete("/recipes/:id", deleteRecipe);
router.get("/specialties", getSpecialties);
router.post("/specialties", createSpecialty);
router.put("/specialties/:id", updateSpecialty);
router.delete("/specialties/:id", deleteSpecialty);
router.get("/doctor", getDoctors);
router.get("/doctor/:doctorId", getDoctor);
router.post("/doctor", createDoctor);
router.put("/doctor/:doctorId", updateDoctor);
router.delete("/doctor/:doctorId", deleteDoctor);
router.get("/doctor/:doctorId/appointments", getDoctorAppointments);
router.get("/breeds", getBreeds);
router.post("/breeds", createBreed);
router.put("/breeds/:id", updateBreed);
router.delete("/breeds/:id", deleteBreed);

export default router;
