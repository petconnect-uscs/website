import type { NextFunction, Request, Response, RequestHandler } from "express";
import * as adminService from "@/services/admin-service.ts";
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

const getProfile = asyncHandler(async (req) => {
  const adminId = req.user?.admin_id;
  if (!adminId) throw new AppError("Não autenticado", 401);
  return adminService.getAdminProfile(adminId);
});

const updateProfile = asyncHandler((req) => {
  const adminId = req.user?.admin_id;
  if (!adminId) throw new AppError("Não autenticado", 401);
  return adminService.updateAdminProfile(adminId, req.body as {
    name?: string;
    password?: string;
  });
});

const getClients = asyncHandler(() => adminService.listClientsForAdmin());

const deleteClient = asyncHandler(async (req) => {
  const cpf = req.params.cpf;
  await adminService.deleteClientByCpf(cpf);
  return { message: "Cliente removido com sucesso" };
});

const getAppointments = asyncHandler(() =>
  adminService.listAppointmentsForAdmin()
);

const getRecipes = asyncHandler(() => adminService.listRecipesForAdmin());

export { getProfile, updateProfile, getClients, deleteClient, getAppointments, getRecipes };
