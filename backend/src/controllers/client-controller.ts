import type { NextFunction, Request, Response, RequestHandler } from "express";
import * as clientService from "@/services/client-service.ts";
import { AppError } from "@/services/auth-service.ts";

function asyncHandler(
  serviceFn: (req: Request) => Promise<unknown>,
  successStatus = 200
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceFn(req);
      return res.status(successStatus).json(result);
    } catch (err) {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
      }
      return next(err);
    }
  };
}

const getAppointments = asyncHandler(async (req) => {
  const cpf = req.user?.cpf;
  if (!cpf) throw new AppError("Acesso restrito a clientes autenticados.", 403);

  return clientService.listAppointmentsByClient(cpf);
});

export { getAppointments };
