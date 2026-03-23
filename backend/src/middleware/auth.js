import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Token não informado" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ error: "Erro no formato do token" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: "Token mal formatado" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: "JWT não configurado no servidor" });
    }

    const decoded = jwt.verify(token, secret);

    if (!decoded.role) {
      return res.status(401).json({ error: "Token inválido (sem role)" });
    }

    req.user = {
      id: decoded.admin_id || decoded.cpf,
      admin_id: decoded.admin_id || null,
      cpf: decoded.cpf || null,
      role: decoded.role,
    };

    return next();
  } catch (err) {
    console.error("Erro ao validar token:", err.message);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

export default authMiddleware;