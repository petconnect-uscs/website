import express from "express";
import authMiddleware from "../middleware/auth.js";
import requireAdmin from "../middleware/require-admin.js";

import {
  getProfile,
  updateProfile,
  getClients,
  deleteClient,
  getAppointments,
  getRecipes
} from "../controllers/admin-controller.js";

const router = express.Router();

router.use(authMiddleware, requireAdmin);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/clients", getClients);
router.delete("/clients/:cpf", deleteClient);
router.get("/appointments", getAppointments);
router.get("/recipes", getRecipes);

export default router;