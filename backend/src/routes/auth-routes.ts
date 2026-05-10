import express from "express";
import { register, login, me, resetPassword } from "@/controllers/auth-controller.ts";
import authMiddleware from "@/middleware/auth.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, me);

// Nova rota definida para o endpoint de recuperar senha
router.post("/reset-password", resetPassword);

export default router;
