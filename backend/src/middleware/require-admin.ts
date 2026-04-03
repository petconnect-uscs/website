import type { NextFunction, Request, Response } from "express";

export default function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (req.user.role !== "admin" || !req.user.admin_id) {
      return res
        .status(403)
        .json({ message: "Acesso restrito a administradores" });
    }

    next();
  } catch {
    return res.status(500).json({ message: "Erro ao validar permissão" });
  }
}
