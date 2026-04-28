import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import requireClient from "@/middleware/require-client.ts";
import {
  getAppointments,
  getAppointmentHistory,
  getProfile,
  updateProfile,
  getRecipes,
  createAppointment,
  getClientPets,
  getSpecialties,
  getDoctors,
  getDoctorAvailability,
  getName,
} from "@/controllers/client-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireClient);
router.get("/profile", getProfile);
router.get("/name", getName);
router.put("/profile", updateProfile);
router.get("/pets", getClientPets);
router.get("/specialties", getSpecialties);
router.get("/doctors", getDoctors);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
router.get("/appointments", getAppointments);
router.get("/appointments/history", getAppointmentHistory);
router.post("/appointments", createAppointment);
router.get("/recipes", getRecipes);

export default router;
