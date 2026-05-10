import type { NextFunction, Request, Response } from "express";

export default function requireClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Não autenticado" });
    }

    if (req.user.role !== "client" || !req.user.cpf) {
      return res
        .status(403)
        .json({ error: "Acesso restrito a clientes autenticados." });
    }

    next();
  } catch {
    return res.status(500).json({ error: "Erro ao validar permissão" });
  }
}
