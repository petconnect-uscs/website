import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não informado" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ error: "Erro no formato do token" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: "Token mal formatado" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT não configurado no servidor" });
    }

    const decoded = jwt.verify(token, secret) as JwtPayload & {
      cpf?: string;
      admin_id?: string;
      role?: "client" | "admin";
    };

    if (!decoded.role) {
      return res.status(401).json({ error: "Token inválido (sem role)" });
    }

    req.user = {
      id: decoded.admin_id ?? decoded.cpf,
      admin_id: decoded.admin_id ?? undefined,
      cpf: decoded.cpf ?? undefined,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Erro ao validar token:", message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export default authMiddleware;
