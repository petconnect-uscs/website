import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Formato de token inválido. Use Bearer <token>." });
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res
        .status(500)
        .json({ error: "Configuração de JWT_SECRET ausente no servidor." });
    }

    const payload = jwt.verify(token, secret) as JwtPayload & {
      cpf?: string;
      admin_id?: number;
      role?: "client" | "admin";
    };

    (req as any).user = {
      cpf: payload.cpf as string | undefined,
      admin_id: payload.admin_id as number | undefined,
      role: payload.role as "client" | "admin" | undefined,
    };

    return next();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Erro ao validar token:", message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

export default authMiddleware;

