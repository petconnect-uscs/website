import express from "express";
import authMiddleware from "@/middleware/auth.ts";
import { getAppointments } from "@/controllers/client-controller.ts";

const router = express.Router();

router.get("/appointments", authMiddleware, getAppointments);

export default router;
