import express, { type NextFunction, type Request, type Response } from "express";
import cors, { type CorsOptions } from "cors";

/* CORS */
const corsOptions: CorsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
};

/* Middleware API Key */
function apiKeyMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method === "GET" && req.path.startsWith("/public/imgs/")) {
    return next();
  }

  const apiKey = req.header("X-API-Key");

  if (!apiKey || apiKey !== process.env.APP_API_KEY) {
    return res.status(401).json({
      error: "API Key inválida ou ausente.",
    });
  }

  next();
}

/* Tratamento final de erros (Express error handler) */
function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);
  
  res.status(500).json({
    error: err,
  });
}

function createProxy(app: express.Express) {
  const proxy = express();

  proxy.use(cors(corsOptions));
  proxy.use(express.json());
  proxy.use(apiKeyMiddleware);
  proxy.use(app);
  proxy.use(errorHandler);

  return proxy;
}

export { createProxy };

