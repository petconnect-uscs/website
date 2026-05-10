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
  getSpecialties,
  getDoctors,
  getDoctorAvailability,
  getName,
} from "@/controllers/client-controller.ts";
import petRouter from "@/routes/pet-routes.ts";

const router = express.Router();

router.use(authMiddleware, requireClient);
router.get("/profile", getProfile);
router.get("/name", getName);
router.put("/profile", updateProfile);
router.use("/pets", petRouter);
router.get("/specialties", getSpecialties);
router.get("/doctors", getDoctors);
router.get("/doctors/:doctorId/availability", getDoctorAvailability);
router.get("/appointments", getAppointments);
router.get("/appointments/history", getAppointmentHistory);
router.post("/appointments", createAppointment);
router.get("/recipes", getRecipes);

export default router;
