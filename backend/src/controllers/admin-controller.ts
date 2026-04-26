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
  const cpf = req.params.cpf as string;
  await adminService.deleteClientByCpf(cpf);
  return { message: "Cliente removido com sucesso" };
});

const getAppointments = asyncHandler(() =>
  adminService.listAppointmentsForAdmin()
);

const getRecipes = asyncHandler(() => adminService.listRecipesForAdmin());

const getDoctors = asyncHandler(() => adminService.listDoctorsForAdmin());

const getSpecialties = asyncHandler(() =>
  adminService.listSpecialtiesForAdmin()
);

const createSpecialty = asyncHandler(
  (req) =>
    adminService.createSpecialtyForAdmin(
      req.body as { name?: string; description?: string | null },
      req.user?.admin_id
    ),
  201
);

const updateSpecialty = asyncHandler((req) => {
  const specialtyId = req.params.id as string;
  return adminService.updateSpecialtyForAdmin(
    specialtyId,
    req.body as { name?: string; description?: string | null }
  );
});

const deleteSpecialty = asyncHandler(async (req) => {
  const specialtyId = req.params.id as string;
  await adminService.deleteSpecialtyForAdmin(specialtyId);
  return { message: "Especialidade removida com sucesso" };
});

const getDoctor = asyncHandler(async (req) => {
  const doctorId = req.params.doctorId as string;
  return adminService.getDoctorForAdmin(doctorId);
});

const createDoctor = asyncHandler(
  async (req) =>
    adminService.createDoctorForAdmin(
      req.body as {
        name?: string;
        cpf?: string;
        specialty_id?: string | null;
      },
      req.user?.admin_id
    ),
  201
);

const updateDoctor = asyncHandler(async (req) => {
  const doctorId = req.params.doctorId as string;
  return adminService.updateDoctorForAdmin(
    doctorId,
    req.body as { name?: string; cpf?: string; specialty_id?: string | null }
  );
});

const deleteDoctor = asyncHandler(async (req) => {
  const doctorId = req.params.doctorId as string;
  await adminService.deleteDoctorForAdmin(doctorId);
  return { message: "Doutor removido com sucesso" };
});

export {
  getProfile,
  updateProfile,
  getClients,
  deleteClient,
  getAppointments,
  getRecipes,
  getDoctors,
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
