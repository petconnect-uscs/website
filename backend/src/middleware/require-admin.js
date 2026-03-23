
export default function requireAdmin(req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (req.user.role !== "admin" || !req.user.admin_id) {
      return res.status(403).json({ message: "Acesso restrito a administradores" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Erro ao validar permissão" });
  }
}