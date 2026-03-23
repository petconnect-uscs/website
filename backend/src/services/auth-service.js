import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as clientModel from "../models/client-model.js";
import * as adminModel from "../models/admin-model.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const JWT_SECRET = process.env.JWT_SECRET;

function createToken(payload) {
  if (!JWT_SECRET) {
    throw new AppError("Configuração JWT_SECRET ausente no servidor.", 500);
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function registerClient(payload) {
  const { cpf, name, email, birth_date, password } = payload;

  if (!cpf || !email || !name || !password) {
    throw new AppError("Nome, email, CPF e senha são obrigatórios.", 400);
  }

  const existingByEmail = await clientModel.findClientByEmail(email);
  if (existingByEmail) {
    throw new AppError("E-mail já cadastrado.", 409);
  }

  const existingByCpf = await clientModel.findClientByCpf(cpf);
  if (existingByCpf) {
    throw new AppError("CPF já cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const client = await clientModel.createClient({
    cpf,
    name,
    email,
    passwordHash,
    birth_date,
  });

  const token = createToken({
    cpf: client.cpf,
    role: "client",
  });

  return { token };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("E-mail e senha são obrigatórios.", 400);
  }

  const client = await clientModel.findClientByEmail(email);

  if (client) {
    const isValidPassword = await bcrypt.compare(password, client.password);

    if (isValidPassword) {
      const token = createToken({
        cpf: client.cpf,
        role: "client",
      });

      return { token };
    }
  }

  const admin = await adminModel.findAdminByEmail(email);

  if (admin) {
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (isValidPassword) {
      const token = createToken({
        admin_id: admin.admin_id,
        role: "admin",
      });

      return { token };
    }
  }

  throw new AppError("Usuário ou senha incorretos.", 401);
}

async function getAuthenticatedUser(userFromToken) {
  const { cpf, admin_id, role } = userFromToken;

  if (role === "client") {
    if (!cpf) throw new AppError("Token inválido.", 401);

    const client = await clientModel.findClientByCpf(cpf);
    if (!client) throw new AppError("Cliente não encontrado.", 404);

    return {
      cpf: client.cpf,
      name: client.name,
      email: client.email,
      role: "client",
    };
  }

  if (role === "admin") {
    if (!admin_id) throw new AppError("Token inválido.", 401);

    const admin = await adminModel.findAdminById(admin_id);
    if (!admin) throw new AppError("Admin não encontrado.", 404);

    return {
      admin_id: admin.admin_id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };
  }

  throw new AppError("Tipo de usuário inválido no token.", 401);
}

export { AppError, registerClient, login, getAuthenticatedUser };