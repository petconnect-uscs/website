const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

/*CORS*/
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
};

/*Rate Limit Global*/
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Muitas requisições. Tente novamente mais tarde.",
  },
});

/*Middleware API Key*/
function apiKeyMiddleware(req, res, next) {
  const apiKey = req.header("X-API-Key");

  if (!apiKey || apiKey !== process.env.APP_API_KEY) {
    return res.status(401).json({
      error: "API Key inválida ou ausente.",
    });
  }

  next();
}

/*Tratamento final de erros*/
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({
    error: "Erro interno do servidor.",
  });
}

function createProxy(app) {
  const proxy = express();

  proxy.use(cors(corsOptions));

  proxy.use(express.json());

  proxy.use(globalLimiter);

  proxy.use(apiKeyMiddleware);

  proxy.use(app);

  proxy.use(errorHandler);

  return proxy;
}

module.exports = { createProxy };
