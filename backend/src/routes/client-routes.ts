import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import requireClient from "@/middleware/require-client.ts";
import {
  getAppointments,
  getProfile,
  updateProfile,
  getRecipes,
} from "@/controllers/client-controller.ts";

const router = express.Router();

router.use(authMiddleware, requireClient);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/appointments", getAppointments);
router.get("/recipes", getRecipes);

export default router;
