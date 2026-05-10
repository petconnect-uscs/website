import type { NextFunction, Request, Response, RequestHandler } from "express";
import * as auth from "@/services/auth-service.ts";

function asyncHandler(
  serviceFn: (req: Request) => Promise<unknown>,
  successStatus = 200,
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceFn(req);
      // Ajustado para retornar um JSON mesmo se o service for Promise<void>
      return res.status(successStatus).json(result || { success: true });
    } catch (err) {
      if (err instanceof auth.AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return next(err);
    }
  };
}

const register = asyncHandler(
  (req) => auth.registerClient(req.body as any),
  201,
);

const login = asyncHandler((req) => auth.login(req.body as any));

// Nova função integrada ao padrão do projeto
const resetPassword = asyncHandler(
  (req) => auth.resetPassword(req.body as any)
);

const me = asyncHandler((req) => {
  const user = req.user;
  if (!user) throw new auth.AppError("Não autenticado", 401);
  return auth.getAuthenticatedUser(user);
});

export { register, login, me, resetPassword };
