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
} from "@/controllers/admin-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireAdmin);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/clients", getClients);
router.delete("/clients/:cpf", deleteClient);
router.get("/appointments", getAppointments);
router.get("/recipes", getRecipes);

export default router;
