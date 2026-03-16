import * as auth from "../services/auth-service.js";

function asyncHandler(serviceFn, successStatus = 200) {
  return async (req, res, next) => {
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

const register = asyncHandler((req) => auth.registerClient(req.body), 201);
const login = asyncHandler((req) => auth.login(req.body));
const me = asyncHandler((req) => auth.getAuthenticatedUser(req.user));

export { register, login, me };
