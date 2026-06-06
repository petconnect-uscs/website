import express from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  me,
} from "@/controllers/auth-controller.ts";
import authMiddleware from "@/middleware/auth.ts";

const router = express.Router();

const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const email =
      typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
    return email || req.ip || "unknown";
  },
  message: {
    error: "Muitas tentativas. Tente novamente mais tarde.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas tentativas. Tente novamente mais tarde.",
  },
});

router.post("/register", authAttemptLimiter, register);
router.post("/login", authAttemptLimiter, login);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.get("/me", authMiddleware, me);

export default router;

