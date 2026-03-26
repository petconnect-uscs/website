import type { NextFunction, Request, Response, RequestHandler } from "express";
import * as auth from "../services/auth-service";

function asyncHandler(
  serviceFn: (req: Request) => Promise<unknown>,
  successStatus = 200
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await serviceFn(req);
      return res.status(successStatus).json(result);
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
  201
);

const login = asyncHandler((req) => auth.login(req.body as any));

const me = asyncHandler((req) =>
  auth.getAuthenticatedUser((req as any).user)
);

export { register, login, me };

