import express from "express";
import authMiddleware from "../middleware/auth.js";
import { getAppointments } from "../controllers/client-controller.js";

const router = express.Router();

router.get("/appointments", authMiddleware, getAppointments);

export default router;