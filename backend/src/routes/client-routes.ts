import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import requireClient from "@/middleware/require-client.ts";
import {
  getAppointments,
  getProfile,
  updateProfile,
  getRecipes,
  createAppointment,
  getClientPets,
  getSpecialties,
  getDoctors,
  getDoctorAvailability,
} from "@/controllers/client-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireClient);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/pets", getClientPets);
router.get("/specialties", getSpecialties);
router.get("/doctors", getDoctors);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
router.get("/appointments", getAppointments);
router.post("/appointments", createAppointment);
router.get("/recipes", getRecipes);

export default router;
