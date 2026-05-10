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
  return clientService.listAppointmentsByClient(req.user?.cpf);
});

const getAppointmentHistory = asyncHandler(async (req) => {
  return clientService.listAppointmentHistoryByClient(req.user?.cpf);
});

const getProfile = asyncHandler(async (req) => {
  return clientService.getClientProfile(req.user?.cpf);
});

const getName = asyncHandler(async (req) => {
  return clientService.getClientName(req.user?.cpf);
});

const updateProfile = asyncHandler(async (req) => {
  return clientService.updateClientProfile(
    req.user?.cpf,
    req.body as { name?: string; password?: string }
  );
});

const getRecipes = asyncHandler(async (req) => {
  return clientService.listRecipesByClient(req.user?.cpf);
});

const createAppointment = asyncHandler(async (req) => {
  return clientService.createAppointment(req.user?.cpf, req.body);
}, 201);

const getClientPets = asyncHandler(async (req) => {
  return clientService.listClientPets(req.user?.cpf);
});

const getSpecialties = asyncHandler(async (_req) => {
  return clientService.listSpecialties();
});

const getDoctors = asyncHandler(async (req) => {
  return clientService.listDoctors(req.query.specialty_id as string | undefined);
});

const getDoctorAvailability = asyncHandler(async (req) => {
  return clientService.getDoctorAvailability(req.params.doctorId);
});

export {
  getAppointments,
  getAppointmentHistory,
  getProfile,
  updateProfile,
  getRecipes,
  createAppointment,
  getClientPets,
  getSpecialties,
  getDoctors,
  getDoctorAvailability,
  getName,
};
