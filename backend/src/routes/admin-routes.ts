import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import requireAdmin from "@/middleware/require-admin.ts";
import {
  getProfile,
  updateProfile,
  getClients,
  deleteClient,
  getAppointments,
  getRecipes,
  getDoctors,
  getSpecialties,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "@/controllers/admin-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireAdmin);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/clients", getClients);
router.delete("/clients/:cpf", deleteClient);
router.get("/appointments", getAppointments);
router.get("/recipes", getRecipes);
router.get("/specialties", getSpecialties);
router.get("/doctor", getDoctors);
router.get("/doctor/:doctorId", getDoctor);
router.post("/doctor", createDoctor);
router.put("/doctor/:doctorId", updateDoctor);
router.delete("/doctor/:doctorId", deleteDoctor);

export default router;
