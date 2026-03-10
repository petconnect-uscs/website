import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
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

    const payload = jwt.verify(token, secret);

    req.user = {
      id: payload.id,
      role: payload.role,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}

export default authMiddleware;
